import ImportDir from '@yimura/import-dir'
import ModuleProxy from './module/Proxy.js'
import log from '../util/Log.js'
import { resolve } from 'path'

class PrivateModuleManager extends ModuleProxy {
    _ = new Map();
    _scope = new Map();

    constructor() {
        super();
    }

    addToScope(module) {
        const scope = module.scope;

        if (!this._scope[scope.group]) this._scope[scope.group] = new Map();
        if (this._scope[scope.group].has(scope.name)) {
            log.error('MODULES', `Duplicate scoped module name error, module "${module.name}" with scope name "${scope.name}"`);

            return;
        }

        this._scope[scope.group].set(scope.name, module);
    }

    async cleanup() {
        for (const module of this._.values())
            if (typeof module.cleanup === 'function') await module.cleanup();

        this._scope.clear();
        this._.clear();
    }

    get(moduleName) {
        return this._.get(moduleName);
    }

    getScope(scopeName) {
        return this._scope.get(scopeName);
    }

    has(moduleName) {
        return this._.has(moduleName);
    }

    async load(main) {
        const modules = ImportDir(resolve('./src/modules/'), { recurse: true, recurseDepth: 1 });

        await this.importModules(main, modules);

        if (!await this.initModules(main)) {
            log.error('MODULES', 'Some modules did not meet their requirements.');

            process.exit(1);
        }
    }

    async importModules(main, modules) {
        for (const bit in modules) {
            if (Object.hasOwnProperty.call(modules, bit) && modules[bit] instanceof Promise) {
                try {
                    modules[bit] = (await modules[bit]).default;
                } catch (e) {
                    log.error('MODULES', `An error occured while importing ${bit}`, e);
                }

                try {
                    const instance = new modules[bit](main);
                    if (instance.disabled)
                        continue;

                    if (this.has(instance.name))
                        continue;

                    this._.set(instance.name, instance);

                    if (instance.scope) this.addToScope(instance);
                } catch (e) {
                    log.warn('MODULES', `Module is broken, ${bit}`, e);
                }

                continue;
            }

            await this.importModules(main, modules[bit]);
        }
    }

    async initModules(main) {
        for (const [ name, instance ] of this._) {
            if (instance.requires) {
                for (const requirement of instance.requires) {
                    if (!this.has(requirement)) {
                        log.error('MODULES', `Module "${name}" has an unmet requirement "${requirement}"`);

                        return false;
                    }
                }
            }

            if (instance.events) {
                for (const _event of instance.events) {
                    if (_event.mod) {
                        const mod = this._.get(_event.mod);
                        if (mod) {
                            mod.on(_event.name, instance[_event.call].bind(instance));

                            continue;
                        }
                    }

                    if (typeof main.on === 'function') main.on(_event.name, instance[_event.call].bind());
                }
            }
        }

        for (const instance of this._.values()) {
            if (typeof instance.init === 'function' && !await instance.init()) return false;
        }

        return true;
    }
}

export class ModuleManager {
    static _ = null;

    constructor() {
        throw new Error('You cannot initialize Module Manager directly...');
    }

    static getInstance() {
        if (!this._) this._ = new PrivateModuleManager();
        return this._;
    }
}

export default ModuleManager.getInstance();
