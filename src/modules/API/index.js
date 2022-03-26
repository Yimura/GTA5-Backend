import { resolve as resolvePath } from 'path';
import ImportDir from '@yimura/import-dir';
import Modules, { ModuleBuilder } from 'waffle-manager';
import { Logger } from '@/src/util/Logger.js';
import { Route } from './structures/Route.js';

export const ModuleClasses = {
    Route
};

export const ModuleInfo = new ModuleBuilder('rest')
    .addRequired('webServer');

export const ModuleInstance = class RESTAPI {
    constructor() {
        this._cache = new Map();
    }

    cloneInstance(instance) {
        return new instance.constructor();
    }

    async init() {
        Modules.webServer.addPathHandler('/api', this.requestHandler.bind(this));

        const api = ImportDir(resolvePath('./api'), { recurse: true });
        await this.prepareRoutes(api);

        Logger.info('REST_API', `Registered ${this._cache.size} routes:`);
        console.table([...this._cache.keys()]);

        return true;
    }

    /**
     * 
     * @param {object} routes 
     */
    async prepareRoutes(routes, route = '/api') {
        for (const bit in routes) {
            if (Object.hasOwnProperty.call(routes, bit)) {
                const bits = routes[bit];

                if (bits instanceof Promise) {
                    const instance = new (await routes[bit]).default();

                    if (instance.disabled) {
                        Logger.warn('REST_API', `Route disabled: ${route + instance.route}`);

                        continue;
                    }

                    this._cache.set(route + instance.route, instance);

                    continue;
                }

                await this.prepareRoutes(bits, `${route}/${bit}`);
            }
        }
    }

    /**
     * @param {HTTPRequest}
     */
    async requestHandler(request) {
        const path = request.url.pathname;
        if (!this._cache.has(path))
            return request.reject(404);

        const instance = this.cloneInstance(
            this._cache.get(path)
        );

        const method = request.method.toLowerCase();
        if (typeof instance[method] !== 'function')
            return request.reject(405);

        try {
            return instance[method](request);
        } catch (err) {
            Logger.error('REST', `An error occured on "${path}":`, err.stack);
            
            return request.reject(500);
        }
    }
}
