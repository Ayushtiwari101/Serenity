import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ChevronDown, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DietPlan.css';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

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
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain',
    unit: 'kg',
    heightUnit: 'cm'
  });

  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Loading

    // Simulate AI Processing Time (Simulates complex calculation)
    setTimeout(() => {
      const calories = 2000; // Placeholder logic
      setNutritionPlan({
        dailyCalories: calories,
        protein: 150,
        carbs: 200,
        fats: 65
      });
      setLoading(false); // Stop Loading
      toast.success('Custom Plan Generated!', { icon: '🥗' });
    }, 1500);
  };

  const addFoodToMeal = (meal, food) => {
    setMealPlan(prev => ({
      ...prev,
      [meal]: [...prev[meal], food]
    }));
    toast.success(`Added ${food.name}`);
  };

  const removeFoodFromMeal = (meal, index) => {
    setMealPlan(prev => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== index)
    }));
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
    <div className="diet-root-container animate-enter">
      <nav className="diet-navbar">
        <div className="diet-nav-content">
          <Link to="/home" className="diet-back-link">← Back</Link>
          <h1 className="diet-brand-title">Diet Planner</h1>
        </div>
      </nav>

      <div className="diet-main-content container">
        {/* Calculator Section */}
        <section className="diet-calculator-section diet-card">
          <div className="diet-section-header">
            <Calculator className="diet-icon" />
            <h2>Nutrition Calculator</h2>
          </div>

          <form onSubmit={handleCalculate} className="diet-calculator-form">
            <div className="diet-form-grid">
              <div className="diet-form-group">
                <label>Weight</label>
                <div className="diet-input-wrapper">
                  <input
                    type="number"
                    name="weight"
                    value={userStats.weight}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                  <select name="unit" value={userStats.unit} onChange={handleInputChange}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div className="diet-form-group">
                <label>Height</label>
                <div className="diet-input-wrapper">
                  <input
                    type="number"
                    name="height"
                    value={userStats.height}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                  <select name="heightUnit" value={userStats.heightUnit} onChange={handleInputChange}>
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>

              <div className="diet-form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={userStats.age}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                />
              </div>

              <div className="diet-form-group">
                <label>Gender</label>
                <select name="gender" value={userStats.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="diet-form-group full-width">
                <label>Activity Level</label>
                <select name="activityLevel" value={userStats.activityLevel} onChange={handleInputChange}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Exercise</option>
                  <option value="moderate">Moderate Exercise</option>
                  <option value="active">Active</option>
                  <option value="veryActive">Very Active</option>
                </select>
              </div>
            </div>

            <button type="submit" className="diet-calculate-btn" disabled={loading}>
              {loading ? <span className="s-spinner"></span> : 'Calculate Plan'}
            </button>
          </form>

          {nutritionPlan && (
            <div className="diet-results-grid">
              <div className="diet-result-card">
                <h3>Daily Calories</h3>
                <p className="diet-result-value">{nutritionPlan.dailyCalories}</p>
                <p className="diet-result-desc">kcal</p>
              </div>
              <div className="diet-result-card">
                <h3>Protein</h3>
                <p className="diet-result-value">{nutritionPlan.protein}g</p>
              </div>
              <div className="diet-result-card">
                <h3>Carbs</h3>
                <p className="diet-result-value">{nutritionPlan.carbs}g</p>
              </div>
              <div className="diet-result-card">
                <h3>Fats</h3>
                <p className="diet-result-value">{nutritionPlan.fats}g</p>
              </div>
            </div>
          )}
        </section>

        {/* Meal Planner Section */}
        <section className="diet-planner-section diet-card">
          <div className="diet-section-header">
            <h2>Meal Planner</h2>
          </div>

          <div className="diet-meals-grid">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
              <div key={meal} className="diet-meal-column">
                <h3 className="diet-meal-title">{meal}</h3>

                {/* Food Adder */}
                <div className="diet-food-picker">
                  {Object.entries(foodCategories).map(([category, foods]) => (
                    <div key={category} className="diet-food-category">
                      <h4>{category}</h4>
                      <div className="diet-food-list">
                        {foods.map((food, index) => (
                          <button
                            key={index}
                            className="diet-food-btn"
                            onClick={() => addFoodToMeal(meal, food)}
                            title={`Add ${food.name}`}
                          >
                            {food.name} <Plus size={14} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Foods */}
                <div className="diet-selected-foods">
                  {mealPlan[meal].map((food, index) => (
                    <div key={index} className="diet-selected-item">
                      <div className="diet-item-info">
                        <span className="diet-item-name">{food.name}</span>
                        <span className="diet-item-cal">{food.calories} cal</span>
                      </div>
                      <button
                        onClick={() => removeFoodFromMeal(meal, index)}
                        className="diet-remove-btn"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {mealPlan[meal].length > 0 && (
                  <div className="diet-meal-totals">
                    <span>Total: {Math.round(calculateMealTotals(meal).calories)} cal</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DietPlan;