import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, Soup, Leaf, Flame, Activity, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import AnimatedCard from '../Components/AnimatedCard';

const foodCategories = {
  protein: [
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13 },
    { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    { name: 'Tofu', calories: 144, protein: 15.9, carbs: 3.3, fat: 8.7 },
  ],
  carbs: [
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
    { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 23.6, fat: 0.2 },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
    { name: 'Oats', calories: 307, protein: 13, carbs: 55, fat: 5 },
    { name: 'Whole Wheat Bread', calories: 69, protein: 3.6, carbs: 12, fat: 1 },
  ],
  fats: [
    { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14 },
    { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
    { name: 'Chia Seeds', calories: 138, protein: 4.7, carbs: 12, fat: 8.7 },
    { name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16 },
  ],
  vegetables: [
    { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: 'Kale', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9 },
    { name: 'Bell Peppers', calories: 31, protein: 1, carbs: 6, fat: 0.3 },
    { name: 'Carrots', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  ],
};

const DietPlan = () => {
  const [userStats, setUserStats] = useState({
    weight: '', height: '', age: '', gender: 'male',
    activityLevel: 'sedentary', goal: 'maintain', unit: 'kg', heightUnit: 'cm'
  });

  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState({
    breakfast: [], lunch: [], dinner: [], snacks: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserStats(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setNutritionPlan({ dailyCalories: 2150, protein: 160, carbs: 220, fats: 70 });
      setLoading(false);
      toast.success('Custom Plan Generated!', { icon: '🥗' });
    }, 1200);
  };

  const addFoodToMeal = (meal, food) => {
    setMealPlan(prev => ({ ...prev, [meal]: [...prev[meal], food] }));
    toast.success(`Added ${food.name}`);
  };

  const removeFoodFromMeal = (meal, index) => {
    setMealPlan(prev => ({ ...prev, [meal]: prev[meal].filter((_, i) => i !== index) }));
  };

  const calculateMealTotals = (meal) => {
    return mealPlan[meal].reduce((acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full mb-12">
        <header className="mb-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-widest mb-4"
            >
                <Leaf size={14} /> Nutritionist AI
            </motion.div>
            <h1 className="text-5xl font-poppins font-medium text-zinc-900 tracking-tight">
                Fuel Your <span className="font-bold text-primary italic">Ambition</span>
            </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Calculator Section */}
          <div className="lg:col-span-4">
            <AnimatedCard className="p-8">
              <h2 className="text-xl font-bold text-zinc-800 mb-8 flex items-center gap-3">
                <Calculator className="text-primary" size={24} /> Metabolism
              </h2>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Weight</label>
                        <input 
                            type="number" name="weight" value={userStats.weight} onChange={handleInputChange} required
                            className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Height</label>
                        <input 
                            type="number" name="height" value={userStats.height} onChange={handleInputChange} required
                            className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Activity Level</label>
                    <select 
                        name="activityLevel" value={userStats.activityLevel} onChange={handleInputChange}
                        className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                        <option value="active">Very Active</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                    {loading ? "Analyzing..." : "Generate My Plan"}
                </button>
              </form>

              <AnimatePresence>
                {nutritionPlan && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-10 pt-10 border-t border-zinc-100"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                                    <Flame size={12} /> Energy
                                </div>
                                <div className="text-xl font-bold text-zinc-900">{nutritionPlan.dailyCalories} <span className="text-xs font-normal opacity-50">kcal</span></div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                                    <Activity size={12} /> Protein
                                </div>
                                <div className="text-xl font-bold text-zinc-900">{nutritionPlan.protein} <span className="text-xs font-normal opacity-50">g</span></div>
                            </div>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </AnimatedCard>
          </div>

          {/* Meal Planner Section */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal, i) => (
                    <AnimatedCard key={meal} delay={i * 0.1} className="p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-zinc-800 capitalize tracking-tight flex items-center gap-2">
                                <Soup size={20} className="text-primary" /> {meal}
                            </h3>
                            <div className="text-xs font-bold text-zinc-400 tracking-widest">
                                {Math.round(calculateMealTotals(meal).calories)} KCAL
                            </div>
                        </div>

                        {/* Food Search / Add (Simplified for UI) */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {Object.entries(foodCategories).slice(0,2).map(([cat, foods]) => (
                                <div key={cat} className="flex flex-wrap gap-1">
                                    {foods.slice(0, 2).map((food, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => addFoodToMeal(meal, food)}
                                            className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-bold text-zinc-500 hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1"
                                        >
                                            <Plus size={10} /> {food.name}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Selected Items */}
                        <div className="space-y-3 flex-grow">
                            <AnimatePresence mode="popLayout">
                                {mealPlan[meal].map((food, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex justify-between items-center p-4 bg-zinc-50/50 rounded-xl border border-zinc-50 group hover:border-zinc-200 transition-all"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-zinc-800">{food.name}</div>
                                            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{food.calories} calories</div>
                                        </div>
                                        <button 
                                            onClick={() => removeFoodFromMeal(meal, idx)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </AnimatedCard>
                ))}
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};

export default DietPlan;