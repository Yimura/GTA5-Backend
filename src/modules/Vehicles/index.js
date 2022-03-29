import { ModuleBuilder } from 'waffle-manager';
import HandlingSchema from './HandlingSchema.js';
import { createShareCode } from './Util.js';

export const ModuleConstants = {
    HandlingSchema
};

export const ModuleInfo = new ModuleBuilder('vehicles')
    .addRequired('mongodb')
    .addRequired('users');

export const ModuleInstance = class Users {
    constructor() {

    }

    async createHandlingProfile(userId, handlingProfile) {
        let shareCode;
        do {
            shareCode = createShareCode();
        } while (await this.shareCodeExists(shareCode));

        const handlingData = Object.assign({ userId, shareCode }, handlingProfile);

        try {
            return new HandlingSchema(handlingData).save();
        } catch (error) {
            return null;
        }
    }

    /**
     *
     * @param {string} userId
     * @param {string} shareCode
     * @returns {Promise<HandlingSchema>}
     */
    deleteHandlingProfile(userId, shareCode) {
        return HandlingSchema.findOneAndDelete({ userId, shareCode }).exec();
    }

    /**
     *
     * @param {object} query
     * @returns {Promise<HandlingSchema>}
     */
    getHandlingProfile(query) {
        return HandlingSchema.findOne(query).exec();
    }

    /**
     *
     * @param {object} query
     * @returns {Promise<Array<HandlingSchema>>}
     */
    getHandlingProfiles(query) {
        return HandlingSchema.find(query).exec();
    }

    /**
     * Returns the updated HandlingSchema
     * @param {object} query
     * @param {object} update
     * @returns {Promise<HandlingSchema>}
     */
    updateHandlingProfile(query, update) {
        return HandlingSchema.findOneAndUpdate(query, update, { new: true }).exec();
    }

    /**
     * Returns a number above 0 if the share code exists.
     * @param {string} shareCode
     * @returns {number}
     * @returns {Promise<number>}
     */
    shareCodeExists(shareCode) {
        return HandlingSchema.countDocuments({ shareCode });
    }
}
