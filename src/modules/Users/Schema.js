import mongoose from 'mongoose';
import { PermissionLevel, PermissionLevels } from './Constants.js';

const user = new mongoose.Schema({
    accounts: [
        {
            rockstarId: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true }
        }
    ],
    permission: { type: String, enum: PermissionLevels, default: PermissionLevel.NORMAL },
    saved_handling_profiles: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle_handling_data' }
    ]
});

export default mongoose.model('users', user);
