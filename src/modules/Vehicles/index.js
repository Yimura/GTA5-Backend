import BaseModule from './structures/BaseModule.js'
import Modules from '@/src/managers/Modules.js'
import HandlingModel from './structures/models/HandlingModel.js'
import { createShareCode } from './util/ShareCode.js'

export default class Vehicles extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Vehicles, {
            name: 'Vehicles',

            requires: [ 'mongodb', 'Sessions' ]
        });
    }

    getHandlingDataBySession(sessionId, handling_hash) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return [];

        return HandlingModel.getAll({ user_id: session.userId, handling_hash });
    }

    getHandlingDataByShareCode(share_code) {
        return HandlingModel.getOne({ share_code });
    }

    getSavedHandlingData(sessionId, handling_hash) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return [];

        const ids = session.user.saved_profiles;

        return HandlingModel.getAll({ _id: { $in: ids }, handling_hash });
    }

    async saveHandlingData(sessionId, data) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return undefined;

        let share_code;
        do {
            share_code = createShareCode(session);
        } while (!await HandlingModel.ensureUnique(share_code));

        const handlingData = Object.assign({ user_id: session.userId, share_code }, data);

        return HandlingModel.create(handlingData);
    }

    /**
     *
     * @param {string} sessionId The session id of the user
     * @param {string} share_code Share code to find the id of the handling profile
     * @returns {boolean} True if the handling id was added successfully, false otherwise
     */
    async saveProfile(sessionId, share_code) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return false;

        const { _id, user_id } = await this.getHandlingDataByShareCode(share_code);
        if (!_id || user_id == session.userId) return false;

        const { saved_profiles } = await Modules.Users.appendHandlingProfile({ _id: session.userId }, _id);

        return saved_profiles.includes(_id);
    }

    updateHandlingData(sessionId, data) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return undefined;

        const { share_code } = data;
        return HandlingModel.update({ share_code, user_id: session.userId }, data);
    }
}
