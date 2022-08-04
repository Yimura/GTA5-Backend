import Modules from '@/src/managers/Modules.js';

export default class UpdateHandlingProfile extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/update';
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
                data: await Modules.Vehicles.updateHandlingData(authorization, body)
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
