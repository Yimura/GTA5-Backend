export default class Session {
    constructor(user, sessionId) {
        this._u = user;
        this._id = sessionId;
    }

    get id() {
        return this._id;
    }

    get permissionLevel() {
        return this._u.permission;
    }

    get rockstarId() {
        return this._u.rockstar_id;
    }

    get user() {
        return this._u;
    }

    get userId() {
        return this._u._id;
    }
}
