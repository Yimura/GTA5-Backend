import Modules from '@/src/managers/Modules.js';

export default class Root extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    /**
     * Leave empty to use the directory name as the route, modify to add on top of the directory structure
     * /api/index.js with and empty route will map to /api/
     * If modified this will add on top of the current directory of the file, /api/index.js with get route() => 'index' will map to /api/index
     * NOTE: leading slash is required if the route is not empty
     * @returns {string}
     */
    get route() {
        // return '/index';

        return '';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async delete(request) {
        if (!request.headers.authorization) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        return request.accept('', 201);
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    get(request) {
        const searchParams = new URLSearchParams(request.searchParams);
        if (searchParams.has('name')) return request.accept('Hello there, '+ searchParams.get('name'));

        return request.accept('Example Return body');
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async post(request) {
        const body = await request.json();
        if (body && body.name) return request.accept('Hello there, '+ body.name);

        return request.accept({
            example: 'Return Body'
        });
    }
}
