import BaseModule from './structures/BaseModule.js'
import ImportDir from '@yimura/import-dir'
import { resolve } from 'path'
import Route from './structures/routes/Route.js'

export default class REST extends BaseModule {
    _cache = new Map();

    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        super(main);

        this.register(REST, {
            name: 'REST',
            requires: [ 'web' ],
            events: [
                {
                    mod: 'web',
                    name: 'request',
                    call: '_onRequest'
                }
            ]
        });

        Object.assign(this, {
            Route
        });
    }

    /**
     * Check if an incoming request is a valid api request and if not return 404.
     * @private
     * @param {Request} request
     */
    async _onRequest(request) {
        const instance = this._cache.get(request.url);
        if (!instance) {
            request.res.writeHead(404, { 'Content-Type': 'text/html' });
            request.res.end('<pre>404 - Not Found<br><br>The requested URL was not found on this server.</pre>');

            return;
        }

        const method = request.method;
        if (typeof instance[method] !== 'function') {
            request.res.writeHead(405, { 'Content-Type': 'text/html' });
            request.res.end('<pre>405 - Method Not Allowed<br><br>The given URL exists but an invalid request method was used.</pre>');

            return;
        }

        try {
            if (await instance[method](request))
            {
                this.log.info("REST", `Handled ${method.toUpperCase()} request ${request.req.url}`);
            }
        } catch (err) {
            request.res.writeHead(500, { 'Content-Type': 'text/plain' });
            if (this.config.development)
                request.res.end(err.stack);
            else
                request.res.end("An error occured, please contact an administrator if the problem persists.");

            this.log.error('REST', `An error occured on "${request.url}":`, err);
        }
    }

    /**
     * Registers all of the files from under the API directory.
     * @param {Object} api
     */
    async _recursiveRegister(api, route = '/api') {
        for (const bit in api) {
            if (Object.hasOwnProperty.call(api, bit)) {
                const bits = api[bit];

                if (bits instanceof Promise) {
                    const instance = new (await api[bit]).default(this._m);

                    if (instance.disabled) {
                        this.log.warn('REST', `Route disabled: ${route + instance.route}`);

                        continue;
                    }

                    this._cache.set(route + instance.route, instance);

                    continue;
                }

                await this._recursiveRegister(bits, `${route}/${bit}`);
            }
        }
    }

    async init() {
        const api = ImportDir(resolve('./api/'), { recurse: true });

        await this._recursiveRegister(api);

        this.log.verbose('REST', 'Registered all routes:', this._cache);

        return true;
    }
}
