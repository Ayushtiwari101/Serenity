import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
    CheckCircle2, ChevronRight, X, Dumbbell, Calendar, Target, Clock, 
    Search, Plus, Trash2, GripVertical, TrendingUp, AlertCircle, Sparkles, Save
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import AnimatedCard from '../Components/AnimatedCard';
import API_URL from '../config';

const DEFAULT_PLANS = {
    monday: [
        { id: 'd1', name: 'Bench Press', sets: 4, reps: '10', animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', description: 'Major chest exercise for building mass.' },
        { id: 'd2', name: 'Push-ups', sets: 3, reps: '15', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', description: 'Great for warming up and bodyweight strength.' },
        { id: 'd3', name: 'Tricep Dips', sets: 3, reps: '12', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80', description: 'Primary tricep builder.' }
    ],
    tuesday: [
        { id: 'd4', name: 'Deadlifts', sets: 4, reps: '8', animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', description: 'Compound back builder.' },
        { id: 'd5', name: 'Pull-ups', sets: 3, reps: 'Max', animation: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80', description: 'Upper back width.' },
        { id: 'd6', name: 'Dumbbell Bicep Curls', sets: 3, reps: '12', animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', description: 'Isolation for bicep peaks.' }
    ],
    wednesday: [
        { id: 'd7', name: 'Plank', sets: 3, reps: '60s', animation: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80', description: 'Core stabilization.' },
        { id: 'd8', name: 'Russian Twists', sets: 3, reps: '20', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', description: 'Oblique work.' },
        { id: 'd9', name: 'Burpees', sets: 4, reps: '15', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80', description: 'Full body cardio.' }
    ],
    thursday: [
        { id: 'd10', name: 'Squats', sets: 4, reps: '12', animation: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80', description: 'Foundation for leg strength.' },
        { id: 'd11', name: 'Lunges', sets: 3, reps: '12 per leg', animation: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80', description: 'Single leg stability.' },
        { id: 'd12', name: 'Calf Raises', sets: 4, reps: '20', animation: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&w=800&q=80', description: 'Lower leg focus.' }
    ],
    friday: [
        { id: 'd13', name: 'Shoulder Press', sets: 4, reps: '10', animation: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80', description: 'Overall shoulder mass.' },
        { id: 'd14', name: 'Lateral Raises', sets: 3, reps: '15', animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', description: 'Focus on side delts.' },
        { id: 'd15', name: 'Face Pulls', sets: 3, reps: '15', animation: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80', description: 'Rear delts and upper back.' }
    ],
    saturday: [
        { id: 'd16', name: 'Yoga / Stretching', sets: 1, reps: '30 mins', animation: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80', description: 'Focus on mobility and recovery.' }
    ],
    sunday: [
        { id: 'd17', name: 'Active Recovery Walk', sets: 1, reps: '45 mins', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', description: 'Gentle movement for recovery.' }
    ]
};

const Workout = () => {
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase());
    const [exercises, setExercises] = useState([]);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [streakData, setStreakData] = useState({ streak: 0, feedback: 'inactive', message: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isCustomPlan, setIsCustomPlan] = useState(false);

    useEffect(() => {
        fetchWorkoutPlan();
        fetchStreak();
        fetchHistory();
    }, [selectedDay]);

    const fetchWorkoutPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/workouts/${selectedDay}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.exercises && response.data.exercises.length > 0) {
                setExercises(response.data.exercises);
                setIsCustomPlan(true);
            } else {
                setExercises(DEFAULT_PLANS[selectedDay]);
                setIsCustomPlan(false);
            }
        } catch (error) {
            console.error("Error fetching workout plan:", error);
            setExercises(DEFAULT_PLANS[selectedDay]);
            setIsCustomPlan(false);
        }
    };

    const fetchStreak = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/workouts/streak`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStreakData(response.data);
        } catch (error) {
            console.error("Error fetching streak:", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(`${API_URL}/workouts/history/${today}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompletedExercises(response.data.completedExercises || []);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const response = await axios.get(`${API_URL}/exercises/search?q=${query}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Search error:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const addExercise = (template) => {
        const newExercise = {
            id: Date.now().toString(),
            name: template.name,
            sets: 3,
            reps: '12',
            animation: template.animation,
            description: `Focus on ${template.target} engagement.`,
            order: exercises.length
        };
        setExercises([...exercises, newExercise]);
        setSuggestions([]);
        setSearchQuery('');
    };

    const removeExercise = (id) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    const savePlan = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/workouts`, {
                day: selectedDay,
                exercises
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            alert("Workout plan saved!");
        } catch (error) {
            console.error("Error saving plan:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const completeExercise = async (exerciseId) => {
        const isCurrentlyCompleted = completedExercises.includes(exerciseId);
        
        // Optimistic UI Update
        if (isCurrentlyCompleted) {
            setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
        } else {
            setCompletedExercises([...completedExercises, exerciseId]);
        }

        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            await axios.post(`${API_URL}/workouts/history`, {
                date: today,
                exerciseId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStreak(); // Refresh streak after change
        } catch (error) {
            console.error("Error toggling exercise:", error);
            // Revert on error
            fetchHistory();
        }
    };

    const getFeedbackColor = () => {
        switch (streakData.feedback) {
            case 'on_fire': return 'text-orange-600 bg-orange-50 border-orange-100 shadow-lg shadow-orange-200/50';
            case 'momentum': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
            case 'active': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'broken': return 'text-rose-500 bg-rose-50 border-rose-100';
            default: return 'text-zinc-400 bg-zinc-50 border-zinc-100';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/50">
            <Navbar />

            <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full mb-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar: Streak & Schedule */}
                    <aside className="lg:w-80 shrink-0 space-y-6">
                        {/* Streak Card */}
                        <AnimatedCard className={`p-6 border ${getFeedbackColor()}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Workout Streak</h3>
                                <TrendingUp size={16} />
                            </div>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-bold">{streakData.streak}</span>
                                <span className="text-sm font-bold pb-1 uppercase tracking-widest">Days</span>
                            </div>
                            <p className="text-xs font-medium opacity-80">{streakData.message}</p>
                            
                            {/* Visual Progress Bar */}
                            <div className="mt-6 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(streakData.streak * 10, 100)}%` }}
                                    className={`h-full ${streakData.feedback === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                />
                            </div>
                        </AnimatedCard>

                        {/* Day Selector */}
                        <AnimatedCard className="p-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                                <Calendar size={16} /> Weekly Rhythm
                            </h3>
                            <div className="flex flex-col gap-2">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all duration-300 ${
                                            selectedDay === day 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                            : 'text-zinc-500 hover:bg-zinc-50 hover:text-primary'
                                        }`}
                                    >
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </AnimatedCard>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow">
                        <header className="flex justify-between items-end mb-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <Dumbbell size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Daily Routine</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-4xl font-poppins font-bold text-zinc-900 tracking-tight capitalize">
                                        {selectedDay}'s Session
                                    </h1>
                                    {!isCustomPlan && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100">
                                            <Sparkles size={12} /> Standard Plan
                                        </div>
                                    )}
                                    {isCustomPlan && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                            <Target size={12} /> Personal Plan
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={savePlan}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all"
                                        >
                                            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Plan'}
                                        </button>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-white border border-zinc-200 text-zinc-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                                    >
                                        <Plus size={16} /> Customize Plan
                                    </button>
                                )}
                            </div>
                        </header>

                        {/* Search & Suggestions (Only in Edit Mode) */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 relative"
                                >
                                    <div className="relative group">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="Search exercises (e.g., Dumbbell, Chest, Squat)..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-zinc-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                        />
                                    </div>
                                    
                                    {/* Suggestions Dropdown */}
                                    {suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-zinc-100 rounded-3xl shadow-2xl z-50 overflow-hidden py-3">
                                            {suggestions.map((s, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => addExercise(s)}
                                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                            <Dumbbell size={18} />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-bold text-zinc-900">{s.name}</div>
                                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.target}</div>
                                                        </div>
                                                    </div>
                                                    <Plus size={18} className="text-zinc-300" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Exercises List */}
                        <Reorder.Group axis="y" values={exercises} onReorder={setExercises} className="space-y-4">
                            {exercises.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-4xl">
                                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2">No exercises planned</h3>
                                    <p className="text-zinc-400 max-w-xs mx-auto">Click "Customize Plan" to build your custom {selectedDay} routine.</p>
                                </div>
                            ) : (
                                exercises.map((exercise) => (
                                    <Reorder.Item 
                                        key={exercise.id} 
                                        value={exercise}
                                        className="group relative"
                                    >
                                        <div className={`p-6 glass-card flex items-center gap-6 transition-all ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'hover:border-primary/30'}`}>
                                            {isEditing && <GripVertical className="text-zinc-300 shrink-0" size={20} />}
                                            
                                            <div 
                                                onClick={() => !isEditing && setSelectedExercise(exercise)}
                                                className="flex-grow flex items-center gap-6 cursor-pointer"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50">
                                                    <img src={exercise.animation} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">{exercise.name}</h3>
                                                        {completedExercises.includes(exercise.id) && (
                                                            <motion.div 
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="text-emerald-500"
                                                            >
                                                                <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Target size={10} /> {exercise.sets} Sets
                                                        </span>
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock size={10} /> {exercise.reps} Reps
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditing ? (
                                                <button 
                                                    onClick={() => removeExercise(exercise.id)}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => setSelectedExercise(exercise)}
                                                        className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </Reorder.Item>
                                ))
                            )}
                        </Reorder.Group>
                    </div>
                </div>
            </main>

            {/* Exercise Modal */}
            <AnimatePresence>
                {selectedExercise && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedExercise(null)}
                            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xl" 
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                        >
                            <button 
                                onClick={() => setSelectedExercise(null)}
                                className="absolute top-8 right-8 z-10 w-12 h-12 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="md:w-5/12 bg-zinc-100 min-h-[300px]">
                                <img src={selectedExercise.animation} className="w-full h-full object-cover" alt="" />
                            </div>

                            <div className="md:w-7/12 p-12 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-6">
                                    <Sparkles size={14} /> AI Guided Exercise
                                </div>
                                <h2 className="text-4xl font-poppins font-bold text-zinc-900 mb-6 tracking-tight">{selectedExercise.name}</h2>
                                <p className="text-zinc-500 leading-relaxed mb-10 text-lg font-medium">{selectedExercise.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Target Sets</span>
                                        <span className="text-2xl font-bold text-zinc-900">{selectedExercise.sets}</span>
                                    </div>
                                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Target Reps</span>
                                        <span className="text-2xl font-bold text-zinc-900">{selectedExercise.reps}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        completeExercise(selectedExercise.id);
                                        setSelectedExercise(null);
                                    }}
                                    className={`w-full py-5 text-lg shadow-xl font-bold rounded-2xl transition-all ${
                                        completedExercises.includes(selectedExercise.id)
                                        ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                        : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {completedExercises.includes(selectedExercise.id) ? 'Logged ✓' : 'Log Session'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Workout;