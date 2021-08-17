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

    updateHandlingData(sessionId, data) {
        const session = Modules.Sessions.get(sessionId);
        if (!session) return undefined;


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
}
