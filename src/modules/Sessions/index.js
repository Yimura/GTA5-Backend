import { ModuleBuilder } from 'waffle-manager';
import { Logger } from '@/src/util/Logger.js';
import { Session } from './Session.js';
import { randomBytes } from 'crypto';

export const ModuleInfo = new ModuleBuilder('sessions');

export const ModuleInstance = class Sessions {
    constructor() {
        /**
         * @type{Map<string,Session>}
         */
        this._cache = new Map();
    }

    cleanup() {
        clearInterval(this._int);
    }

    /**
     *
     * @param {string} userId
     * @returns {Session}
     */
    create(userId) {
        let sessionId;

        do {
            sessionId = randomBytes(32).toString('base64');
        } while (this._cache.has(sessionId));

        const session = new Session(sessionId, userId);
        this._cache.set(sessionId, session);

        return session;
    }

    /**
     *
     * @param {string} sessionId
     * @returns {boolean}
     */
    delete(sessionId) {
        return this._cache.delete(sessionId);
    }

    /**
     *
     * @param {string} sessionId
     * @returns {Session}
     */
    get(sessionId) {
        return this._cache.get(sessionId);
    }

    init() {
        this._int = setInterval(this.removeOldSessions.bind(this), 60 * 60 * 1e3);

        return true;
    }

    removeOldSessions() {
        Logger.info('SESSIONS', 'Removing old sessions...');

        for (const session of this._cache.values())
            if (session.isExpired())
                this._cache.delete(session.sessionId);
    }
}
