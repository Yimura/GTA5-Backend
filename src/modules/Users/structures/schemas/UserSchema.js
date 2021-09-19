import { PermissionLevel, PermissionLevels } from '../../util/Constants.js'
import mongoose from 'mongoose'

const user = new mongoose.Schema({
    rockstar_id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    permission: { type: String, enum: PermissionLevels, default: PermissionLevel.NORMAL },
    saved_profiles: [ { type: String } ]
});

export default mongoose.model('users', user);
