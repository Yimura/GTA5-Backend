import UserSchema from '../schemas/UserSchema.js';

/**
 *
 * @param {Object} user
 * @returns {UserSchema}
 */
export const createUser = (user) => {
    return new UserSchema(user).save();
};

/**
 * @param {Object} user
 * @returns {UserSchema}
 */
export const deleteUser = (user) => {
    return UserSchema.findOneAndDelete(user).exec();
};

/**
 * Find a user based on a user object
 * @param {Object} q
 * @returns {UserSchema}
 */
export const getUser = (q) => {
    return UserSchema
        .findOne(q)
        .exec();
};

/**
 *
 * @param {Object} q query
 * @returns {Array<UserSchema>}
 */
export const getUsers = (q) => {
    return UserSchema
        .find(q)
        .exec();
};

/**
 *
 * @param {Object} q Search query
 * @param {Object} update Updated object
 * @returns
 */
export const updateUser = (q, update) => {
    return UserSchema.findOneAndUpdate(q, update, { new: true }).exec();
};

export default {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
};
