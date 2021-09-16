import HandlingSchema from '../schemas/HandlingSchema.js'

export const create = (handling) => {
    return new HandlingSchema(handling).save();
};

export const ensureUnique = async (share_code) => {
    return 0 == await HandlingSchema.countDocuments({ share_code });
};

export const getAll = async (q) => {
    return HandlingSchema.find(q);
};

export const getOne = async (q) => {
    return HandlingSchema.findOne(q);
};

export const update = async(q, update) => {
    return HandlingSchema.findOneAndUpdate(q, update, { new: true });
};

export default {
    create,
    ensureUnique,
    getAll,
    getOne,
    update
}
