import BaseModule from './structures/BaseModule.js'
import Constants from './util/Constants.js'
import UserModel from './structures/models/UserModel.js'

export default class Users extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Users, {
            name: 'Users',
            requires: [ 'mongodb' ]
        });
    }

    get constants() {
        return Constants;
    }

    /**
     *
     * @param {Object} q The object to match the user with
     * @param {string} id The string id of the handling profile
     * @returns The new user object
     */
    appendHandlingProfile(q, id) {
        return UserModel.appendHandlingProfile(q, id);
    }

    /**
     *
     * @param {Object} user
     * @returns
     */
    create(user) {
        return UserModel.createUser(user);
    }

    /**
     * Search for a user and return it object
     * @param {Object} q
     */
    get(q) {
        return UserModel.getUser(q);
    }
}
