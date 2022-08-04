import BaseModule from './structures/BaseModule.js'
import Session from './structures/Session.js'
import crypto from 'crypto'
import Modules from '@/src/managers/Modules.js'

export default class Sessions extends BaseModule {
    sessions = new Map();

    constructor(main) {
        super(main);

        this.register(Sessions, {
            name: 'Sessions',

            requires: [ 'Users' ]
        });
    }

    create(user, fake = false) {
        let sessionId;

        do {
            sessionId = crypto.randomBytes(16).toString('base64');
        } while (this.sessions.has(sessionId));

        if (fake) return sessionId;
        const session = new Session(user, sessionId);
        this.sessions.set(sessionId, session);

        return session.id;
    }

    get(sessionId) {
        return this.sessions.get(sessionId);
    }

    isSessionValid(sessionId, level) {
        const PermissionLevels = Modules.Users.constants.PermissionLevels;
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        return PermissionLevels.indexOf(level) <= PermissionLevels.indexOf(session.permissionLevel);
    }
}
