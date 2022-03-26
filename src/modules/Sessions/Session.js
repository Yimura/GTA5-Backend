export class Session {
    constructor(sessionId, userId) {
        this._id = sessionId;
        this._uid = userId;

        this._creationDate = Date.now();
    }

    get sessionId() {
        return this._id;
    }

    get userId() {
        return this._uid;
    }

    isExpired(age = 1e3 * 60 * 60 * 48) {
        return this._creationDate < Date.now() - age;
    }
}
