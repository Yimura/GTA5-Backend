import { ModuleBuilder } from 'waffle-manager';
import { Logger } from '@/src/util/Logger.js';
import UserSchema from './Schema.js';

export const ModuleConstants = {
    UserSchema
};

export const ModuleInfo = new ModuleBuilder('users')
    .addRequired('mongodb')
    .addRequired('vehicles');

export const ModuleInstance = class Users {
    constructor() {

    }

    /**
     * Create a new user
     * @param {string} username Username of the user
     * @param {string} rockstarId RockstarID of the user
     * @returns {Promise<UserSchema>}
     */
    create(username, rockstarId) {
        return new UserSchema({
            accounts: [
                { username, rockstarId }
            ]
        }).save();
    }

    /**
     * Delete a user
     * @param {object} query
     * @returns {Promise<UserSchema>} The deleted object
     */
    delete(query) {
        return UserSchema.findOneAndDelete(query).exec();
    }

    /**
     * Search for a user
     * @param {object} query
     * @returns {Promise<UserSchema>}
     */
    get(query) {
        return UserSchema.findOne(query).exec();
    }

    /**
     * Get a UserSchema by RockstarID
     * @param {string} rockstarId
     */
    getByRockstarID(rockstarId) {
        return this.get({ "accounts.rockstarId": rockstarId });
    }

    /**
     *
     * @param {string} userId
     * @param {number} handlingHash
     * @returns {Promise<Array<HandlingSchema>>}
     */
    getSavedHandlingProfiles(userId, handlingHash) {
        return UserSchema.findOne({ _id: userId })
            .populate('saved_handling_profiles', {
                match: { handlingHash: { $ne: handlingHash } }
            }).exec();
    }

    /**
     * Update a user object with a search query
     * @param {object} query
     * @param {object} update
     * @returns {Promise<UserSchema>}
     */
    update(query, update) {
        return UserSchema.findOneAndUpdate(query, update, { new: true }).exec();
    }
}
