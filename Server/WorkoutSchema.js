const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    day: { type: String, required: true }, // e.g., 'monday', 'tuesday', etc.
    exercises: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: String, required: true },
            animation: { type: String },
            description: { type: String },
            order: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

const workoutHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    completedExercises: [{ type: String }] // Array of exercise IDs
}, { timestamps: true });

const workoutPlanModel = mongoose.model('workout_plans', workoutPlanSchema);
const workoutHistoryModel = mongoose.model('workout_history', workoutHistorySchema);

module.exports = { workoutPlanModel, workoutHistoryModel };
