import Modules from '@/src/managers/Modules.js';

export default class CreateHandlingProfile extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/create';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async post(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        const authorization = request.headers['authorization'];

        try {
            return request.accept({
                status: 'success',
                data: await Modules.Vehicles.saveHandlingData(authorization, body)
            });
        }
        catch {
            return request.reject(401, {
                status: 'error',
                message: 'Failed to create vehicle data.'
            });
        }
    }
}
