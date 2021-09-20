import Modules from '@/src/managers/Modules.js';

export default class GetSavedHandlingProfiles extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/get_saved';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async get(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);
        if (!searchParams.has('handling_hash')) return request.reject(400, {
            status: 'failed',
            data: {
                handling_hash: 'Missing handling_hash field in GET request.'
            }
        });

        const authorization = request.headers['authorization'];
        return request.accept({
            status: 'success',
            data: await Modules.Vehicles.getSavedHandlingData(authorization, searchParams.get('handling_hash'))
        });
    }
}
