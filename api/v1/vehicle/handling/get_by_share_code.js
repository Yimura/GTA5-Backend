import Modules from '@/src/managers/Modules.js';

export default class GetHandlingDataByShareCode extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/get_by_share_code';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async get(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);
        if (!searchParams.has('share_code')) return request.reject(400, {
            status: 'failed',
            data: {
                share_code: 'Missing share_code field in GET request.'
            }
        });

        return request.accept({
            status: 'success',
            data: await Modules.Vehicles.getHandlingDataByShareCode(searchParams.get('share_code'))
        });
    }
}
