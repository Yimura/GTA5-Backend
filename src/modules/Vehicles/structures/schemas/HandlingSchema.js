import mongoose from 'mongoose'

const handlingData = new mongoose.Schema({
    user_id: { type: String, required: true },
    handling_hash: { type: Number, required: true },
    share_code: { type: String, required: true },

    name: { type: String, required: true },
    description: { type: String, required: true },

    data: {
        mass: Number,

        downforce_mult: Number,
        centre_of_mass: {
            x: Number,
            y: Number,
            z: Number
        },
        inertia_mult: {
            x: Number,
            y: Number,
            z: Number
        },

        buoyancy: Number,

        drive_bias_rear: Number,
        drive_bias_front: Number,

        acceleration_mult: Number,

        initial_drive_gears: Number,
        upshift: Number,
        downshift: Number,

        drive_inertia: Number,

        initial_drive_force: Number,
        drive_max_flat_vel: Number,

        brake_force: Number,
        brake_bias_front: Number,
        brake_bias_rear: Number,
        handbrake_force: Number,

        steering_lock: Number,
        steering_lock_ratio: Number,

        traction_curve_max: Number,
        traction_curve_lateral: Number,
        traction_curve_min: Number,
        traction_curve_ratio: Number,

        traction_bias_front: Number,
        traction_bias_rear: Number,
        traction_loss_mult: Number,

        curve_lateral: Number,
        curve_lateral_ratio: Number,

        traction_spring_delta_max: Number,
        traction_spring_delta_max_ratio: Number,

        low_speed_traction_loss_mult: Number,

        camber_stiffness: Number,

        suspension_force: Number,
        suspension_comp_damp: Number,
        suspension_rebound_damp: Number,
        suspension_upper_limit: Number,
        suspension_lower_limit: Number,
        suspension_raise: Number,
        suspension_bias_front: Number,
        suspension_bias_rear: Number,

        anti_rollbar_force: Number,
        anti_rollbar_bias_front: Number,
        anti_rollbar_bias_rear: Number,

        roll_centre_height_front: Number,
        roll_centre_height_rear: Number
    }
});

export default mongoose.model('handling_data', handlingData);
