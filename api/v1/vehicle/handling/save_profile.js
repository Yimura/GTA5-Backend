import Modules from '@/src/managers/Modules.js';

export default class SaveProfile extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/save_profile';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async post(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const { share_code } = await request.json();
        const authorization = request.headers['authorization'];

        try {
            return request.accept({
                status: 'success',
                data: await Modules.Vehicles.saveProfile(authorization, share_code)
            });
        }
        catch(e) {
            return request.reject(401, {
                status: 'error',
                message: 'Failed to add handling to user object.',
                data: e
            });
        }
    }
}
