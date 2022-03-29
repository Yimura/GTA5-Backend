export class Session {
    constructor(sessionId, userId, scToken) {
        this._id = sessionId;
        this._token = scToken;
        this._uid = userId;

        this._creationDate = Date.now();
    }

    get sessionId() {
        return this._id;
    }

    get token() {
        return this._token;
    }

    get userId() {
        return this._uid;
    }

    isExpired(age = 1e3 * 60 * 60 * 48) {
        return this._creationDate < Date.now() - age;
    }
}
