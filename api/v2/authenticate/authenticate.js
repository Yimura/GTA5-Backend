import Modules from 'waffle-manager';
import RockstarAPI from '@yimura/node-rockstar-api';

export default class Authenticate extends Modules.rest.classes.Route {
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
        const body = await request.json();
        if (!body || !body.sessionId)
            return request.reject(400);

        Modules.sessions.delete(body.sessionId);

        return request.accept('', 204);
    }

    /**
     * @param {HTTPRequest} request
     */
    async post(request) {
        const body = await request.json();
        if (!body || !body.token)
            return request.reject(400);

        const api = new RockstarAPI(body.token);
        const userProfile = await api.profile.getUserAccountInfo();
        if (!userProfile.Status)
            return request.reject(403);

        const searchResult = await api.friends.search(userProfile.Nickname);
        if (!searchResult.Status)
            return request.reject(403);

        const profile = searchResult.Accounts[0];
        if (userProfile.Nickname != profile.Nickname)
            return request.reject(403);

        let dbUser = await Modules.users.getByRockstarID(profile.RockstarId);
        if (!dbUser)
            dbUser = await Modules.users.create(profile.Nickname, profile.RockstarId);
        else if (!dbUser.accounts.some(acc => acc.username === profile.Nickname)) // username in DB is outdated
            Modules.users.update({ 'accounts.rockstarId': profile.RockstarId }, { '$set': { 'accounts.$.username': profile.Nickname } }); // don't await we can update the user async without blocking

        const session = Modules.sessions.create(dbUser._id, body.token);

        return request.accept({
            sessionId: session.sessionId
        });
    }
}
