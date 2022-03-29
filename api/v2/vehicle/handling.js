import Modules from 'waffle-manager';

export default class Handling extends Modules.rest.classes.Route {
    constructor() {
        super();
    }

    get route() {
        return '';
    }

    /**
     * @param {HTTPRequest} request
     */
    async delete(request) {
        const authorization = request.getHeader('authorization');
        if (!authorization) return request.reject(403);

        const session = Modules.sessions.get(authorization);
        if (!session) return request.reject(403);

        const body = await request.json();
        if (!body || !body.shareCode)
            return request.reject(400);

        const userId = session.userId;
        Modules.vehicles.deleteHandlingProfile(userId, body.shareCode);

        return request.accept('', 204);
    }

    /**
     *
     * @param {HTTPRequest} request
     */
    async get(request) {
        const authorization = request.getHeader('authorization');
        if (!authorization) return request.reject(403);

        const session = Modules.sessions.get(authorization);
        if (!session) return request.reject(403);

        let data = null;
        /**
         * @type {URLSearchParams}
         */
        const searchParams = request.searchParams;
        if (searchParams.has('handling_hash'))
        {
            const handlingHash = searchParams.get('handling_hash');
            const userId = session.userId;

            if (searchParams.has('saved'))
                data = await Modules.users.getSavedHandlingProfiles(userId, handlingHash);
            else if (searchParams.has('mine'))
                data = await Modules.vehicles.getHandlingProfiles({ userId, handlingHash });
        }
        else if (searchParams.has('share_code'))
        {
            data = await Modules.vehicles.getHandlingProfile({ shareCode: searchParams.get('share_code') });
        }

        return request.accept({ data });
    }

    /**
     * @param {HTTPRequest} request
     */
    async post(request) {
        const authorization = request.getHeader('authorization');
        if (!authorization) return request.reject(403);

        const session = Modules.sessions.get(authorization);
        if (!session) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        const userId = session.userId;
        const data = await Modules.vehicles.createHandlingProfile(userId, body);

        return request.accept({ data });
    }

    /**
     * @param {HTTPRequest} request
     */
    async put(request) {
        const authorization = request.getHeader('authorization');
        if (!authorization) return request.reject(403);

        const session = Modules.sessions.get(authorization);
        if (!session) return request.reject(403);

        const body = await request.json();
        if (!body || !body.shareCode) return request.reject(400);

        const shareCode = body.shareCode;
        const data = await Modules.vehicles.updateHandlingProfile({ shareCode }, body);

        return request.accept({ data });
    }
}
