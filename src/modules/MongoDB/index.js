import { ModuleBuilder } from 'waffle-manager';
import mongoose from 'mongoose';
import { Logger } from '@/src/util/Logger.js';
import { loadJson } from '@/src/util/Util.js';

export const ModuleInfo = new ModuleBuilder('mongodb');

export const ModuleInstance = class StaticServe {
    constructor() {

    }

    isConnected() {
        return this._connected;
    }

    async init() {
        const { mongodb } = loadJson('/data/auth.json');
        if (!mongodb)
        {
            Logger.critical('MONGODB', 'There are no mongodb credentials in auth.json.');

            return false;
        }

        this._connected = false;
        try {
            const { auth, options } = mongodb;

            mongoose.connect(
                `mongodb://${auth.user}:${auth.password}@${auth.host}:${auth.port}/${auth.database}`,
                options
            );

            Logger.info('MONGODB', 'Successfully connected to MongoDB server.');

            this._connected = true;
        } catch (e) {
            Logger.critical('MONGODB', "Failed to connect to MongoDB server, are the credentials in auth.json correct?", e);
        }

        return this._connected;
    }
}
