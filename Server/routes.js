const express = require('express');
const router = express.Router();
const { userModel } = require('./UserSchema');
const { mealModel } = require('./MealSchema');
const { nutritionPlanModel } = require('./NutritionSchema');
const { workoutPlanModel, workoutHistoryModel } = require('./WorkoutSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.use(express.json());

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Diagnostic route
router.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Google Auth route
router.post('/google-auth', async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.decode(token);
        
        if (!decoded) return res.status(400).json({ error: 'Invalid Google token' });

        const { email, given_name, family_name, sub } = decoded;
        
        let user = await userModel.findOne({ $or: [{ email }, { username: email.split('@')[0] }] });
        
        if (!user) {
            user = await userModel.create({
                email,
                firstName: given_name,
                lastName: family_name,
                username: email.split('@')[0],
                password: await bcrypt.hash(sub, 10)
            });
        }

        const serenityToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ success: true, token: serenityToken, message: 'Google login successful' });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Signup route with bcrypt password hashing
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, email, username, password } = req.body;
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ 
            firstName, 
            lastName, 
            contactNumber, 
            email, 
            username, 
            password: hashedPassword 
        });
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login route with JWT
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username }, { password: 0 });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, email } = req.body;
        const updatedUser = await userModel.findOneAndUpdate(
            { username: req.user.username },
            { firstName, lastName, contactNumber, email },
            { new: true, select: '-password' }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- WORKOUT ROUTES ---

// Get Streak (must be before :day to avoid "streak" matching as a day param)
router.get('/workouts/streak', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username });
        // Only count days where at least one exercise was completed
        const history = await workoutHistoryModel.find({ 
            userId: user._id, 
            "completedExercises.0": { $exists: true } 
        }).sort({ date: -1 });
        
        if (!history || history.length === 0) {
            return res.json({ streak: 0, feedback: 'inactive', message: 'Ready to start your journey?' });
        }

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const hasActivityToday = history[0].date === today;
        const hasActivityYesterday = history[0].date === yesterday || (history.length > 1 && history[1].date === yesterday);

        if (!hasActivityToday && !hasActivityYesterday) {
            return res.json({ streak: 0, feedback: 'broken', message: 'Streak broken! Let\'s get back to it.' });
        }

        let current = new Date(history[0].date);
        streak = 1;
        for (let i = 1; i < history.length; i++) {
            let prev = new Date(history[i].date);
            let diff = (current - prev) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
                current = prev;
            } else {
                break;
            }
        }

        let feedback = 'active';
        let message = 'Great consistency!';

        if (streak >= 7) {
            feedback = 'on_fire';
            message = 'UNSTOPPABLE! 7+ days and counting! 🔥';
        } else if (streak >= 3) {
            feedback = 'momentum';
            message = 'Building momentum! Keep going! 🚀';
        } else if (streak > 0) {
            feedback = 'active';
            message = 'Great start! Consistency is key. ✨';
        }

        res.json({ streak, feedback, message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Log workout history
router.post('/workouts/history', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username });
        const { date, exerciseId } = req.body;
        
        const existingRecord = await workoutHistoryModel.findOne({ userId: user._id, date });
        let update;
        
        if (existingRecord && existingRecord.completedExercises.includes(exerciseId)) {
            update = { $pull: { completedExercises: exerciseId } };
        } else {
            update = { $addToSet: { completedExercises: exerciseId } };
        }

        const history = await workoutHistoryModel.findOneAndUpdate(
            { userId: user._id, date },
            update,
            { new: true, upsert: true }
        );
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get workout history for a specific date
router.get('/workouts/history/:date', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username });
        const history = await workoutHistoryModel.findOne({ userId: user._id, date: req.params.date });
        res.status(200).json(history || { completedExercises: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get workout plan for a specific day
router.get('/workouts/:day', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username });
        const plan = await workoutPlanModel.findOne({ userId: user._id, day: req.params.day });
        res.status(200).json(plan || { exercises: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update workout plan
router.post('/workouts', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.user.username });
        const { day, exercises } = req.body;
        const plan = await workoutPlanModel.findOneAndUpdate(
            { userId: user._id, day },
            { exercises },
            { new: true, upsert: true }
        );
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- EXERCISE SEARCH ---

const EXERCISE_LIBRARY = [
    { name: 'Push-ups', target: 'Chest', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dumbbell Bicep Curls', target: 'Arms', animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bench Press', target: 'Chest', animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
    { name: 'Squats', target: 'Legs', animation: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Plank', target: 'Core', animation: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Deadlifts', target: 'Back', animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
    { name: 'Pull-ups', target: 'Back', animation: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lunges', target: 'Legs', animation: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80' },
    { name: 'Preacher Curls', target: 'Arms', animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Shoulder Press', target: 'Shoulders', animation: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tricep Dips', target: 'Arms', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Russian Twists', target: 'Core', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Calf Raises', target: 'Legs', animation: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Burpees', target: 'Full Body', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80' },
];

router.get('/exercises/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    const suggestions = EXERCISE_LIBRARY.filter(ex => 
        ex.name.toLowerCase().includes(query) || 
        ex.target.toLowerCase().includes(query)
    );
    res.json(suggestions);
});

// --- NUTRITION ROUTES ---

// Calculate and save nutrition plan
router.post('/nutrition-plan', async (req, res) => {
    try {
        const {
            userId, weight, height, age, gender, activityLevel, goal, unit, heightUnit
        } = req.body;

        const weightInKg = unit === 'lbs' ? weight * 0.453592 : parseFloat(weight);
        const heightInCm = heightUnit === 'in' ? height * 2.54 : parseFloat(height);

        let bmr;
        if (gender === 'male') {
            bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
        } else {
            bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
        }

        const activityMultipliers = {
            sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
        };
        
        const tdee = bmr * activityMultipliers[activityLevel];

        let dailyCalories;
        switch (goal) {
            case 'lose': dailyCalories = tdee - 500; break;
            case 'gain': dailyCalories = tdee + 500; break;
            default: dailyCalories = tdee;
        }

        let proteinRatio, carbsRatio, fatsRatio;
        switch (goal) {
            case 'lose': proteinRatio = 0.4; carbsRatio = 0.3; fatsRatio = 0.3; break;
            case 'gain': proteinRatio = 0.3; carbsRatio = 0.45; fatsRatio = 0.25; break;
            default: proteinRatio = 0.3; carbsRatio = 0.4; fatsRatio = 0.3;
        }

        const protein = Math.round((dailyCalories * proteinRatio) / 4);
        const carbs = Math.round((dailyCalories * carbsRatio) / 4);
        const fats = Math.round((dailyCalories * fatsRatio) / 9);
        const waterIntake = Math.round((weightInKg * 0.033) * 10) / 10;

        const nutritionPlan = await nutritionPlanModel.findOneAndUpdate(
            { userId },
            {
                weight, height, age, gender, activityLevel, goal, unit, heightUnit,
                dailyCalories: Math.round(dailyCalories), protein, carbs, fats, waterIntake,
                updatedAt: Date.now()
            },
            { new: true, upsert: true }
        );

        res.status(200).json(nutritionPlan);
    } catch (error) {
        console.error('Error calculating nutrition plan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get meals by category
router.get('/meals/:category', async (req, res) => {
    try {
        const meals = await mealModel.find({ 
            category: req.params.category, isActive: true 
        }).sort({ name: 1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meals by food group
router.get('/meals/group/:foodGroup', async (req, res) => {
    try {
        const meals = await mealModel.find({ 
            foodGroup: req.params.foodGroup, isActive: true 
        }).sort({ calories: 1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save selected meals
router.post('/save-meals', async (req, res) => {
    try {
        const { userId, selectedMeals, date } = req.body;
        const mealIds = Object.values(selectedMeals).filter(id => id);
        const validMeals = await mealModel.find({ _id: { $in: mealIds } });
        
        if (validMeals.length !== mealIds.length) {
            return res.status(400).json({ error: 'Invalid meal selection' });
        }

        const nutritionPlan = await nutritionPlanModel.findOneAndUpdate(
            { userId },
            { 
                $push: { mealHistory: { date: date || new Date(), meals: selectedMeals } },
                selectedMeals, updatedAt: Date.now()
            },
            { new: true }
        );
        
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        
        res.status(200).json(nutritionPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meal suggestions
router.post('/meal-suggestions', async (req, res) => {
    try {
        const { calories, protein, carbs, fats, excludeIds = [] } = req.body;
        const mealCalories = calories / 5;
        const mealProtein = protein / 5;
        const mealCarbs = carbs / 5;
        const mealFats = fats / 5;

        const suggestions = await mealModel.find({
            _id: { $nin: excludeIds }, isActive: true,
            calories: { $gte: mealCalories * 0.8, $lte: mealCalories * 1.2 },
            protein: { $gte: mealProtein * 0.8, $lte: mealProtein * 1.2 },
            carbs: { $gte: mealCarbs * 0.8, $lte: mealCarbs * 1.2 },
            fats: { $gte: mealFats * 0.8, $lte: mealFats * 1.2 }
        }).limit(10);

        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's meal history
router.get('/meal-history/:userId', async (req, res) => {
    try {
        const nutritionPlan = await nutritionPlanModel.findOne({ 
            userId: req.params.userId 
        }).populate('mealHistory.meals');
        
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        
        res.status(200).json(nutritionPlan.mealHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user data
router.get('/data', async (req, res) => {
    try {
        const data = await userModel.find();
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;