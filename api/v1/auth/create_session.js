import Modules from '@/src/managers/Modules.js';

export default class CreateSession extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/create_session';
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async post(request) {
        const body = await request.json();
        if (!body || !body.rockstar_id) return request.reject(400, {
            status: 'fail',
            data: {
                rockstar_id: 'This field is required.'
            }
        });

        const search = Object.assign({}, body);
        delete search.username;

        let user = await Modules.Users.get(search);
        if (!user) {
            user = await Modules.Users.create(body);
        }

        return request.accept({
            status: 'success',
            data: {
                sessionId: Modules.Sessions.create(user)
            }
        });
    }
}
