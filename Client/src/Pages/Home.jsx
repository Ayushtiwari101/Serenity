// Tailwind Migration - Final Polish with Personalization
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, Sun, Moon, Coffee, ArrowRight, Activity, Brain, Utensils, Gamepad2 } from 'lucide-react';
import Navbar from '../Components/Navbar';
import AnimatedCard from '../Components/AnimatedCard';
import axios from 'axios';
import API_URL from '../config';

const CircularProgress = ({ percentage, label, color, icon: Icon }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-zinc-100" cx="50" cy="50" r={radius} strokeWidth="8" fill="none" stroke="currentColor" />
                    <motion.circle 
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50" cy="50" r={radius} 
                        strokeWidth="8" fill="none" stroke={color} 
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <Icon size={16} style={{ color: color }} />
                    <span className="text-[11px] font-bold mt-1" style={{ color: color }}>{percentage}%</span>
                </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
        </div>
    );
};

function Home() {
    const navigate = useNavigate();
    const [streak, setStreak] = useState([true, true, true, true, false, false, false]);
    const [greeting, setGreeting] = useState({ text: '', icon: null });
    const [userName, setUserName] = useState('Traveler');
    const [textIndex, setTextIndex] = useState(0);
    const slogans = ['Peace', 'Clarity', 'Health', 'Focus'];

    useEffect(() => {
        const timer = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % slogans.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting({ text: 'Good Morning', icon: <Coffee size={20} className="text-amber-500" /> });
        else if (hour < 18) setGreeting({ text: 'Good Afternoon', icon: <Sun size={20} className="text-orange-500" /> });
        else setGreeting({ text: 'Good Evening', icon: <Moon size={20} className="text-indigo-400" /> });

        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.firstName) {
                    setUserName(response.data.firstName);
                } else if (response.data.username) {
                    setUserName(response.data.username);
                }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const toggleStreak = (index) => {
        const newStreak = [...streak];
        newStreak[index] = !newStreak[index];
        setStreak(newStreak);
    };

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/50">
            <Navbar />

            <main className="flex-grow pt-40 px-6 max-w-7xl mx-auto w-full flex flex-col gap-8">
                <header className="mb-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Calendar size={12} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </motion.div>
                    
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 text-lg font-medium tracking-tight">{greeting.text}, {userName}</span>
                            {greeting.icon}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-poppins font-medium text-zinc-900 tracking-tighter leading-tight flex items-center flex-wrap gap-x-3">
                            Find Your
                            <div className="relative inline-block h-[1.2em] min-w-[160px] align-bottom">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={textIndex}
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -15, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="absolute left-0 text-primary italic font-bold"
                                    >
                                        {slogans[textIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    {/* Progress Card */}
                    <AnimatedCard className="lg:col-span-8 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" /> Daily Adherence
                            </h3>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Analytics</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <CircularProgress percentage={75} label="Mind" color="#10b981" icon={Brain} />
                            <CircularProgress percentage={45} label="Body" color="#f43f5e" icon={Activity} />
                            <CircularProgress percentage={90} label="Fuel" color="#f59e0b" icon={Utensils} />
                            <CircularProgress percentage={60} label="Focus" color="#6366f1" icon={Gamepad2} />
                        </div>
                    </AnimatedCard>

                    {/* Streak Card */}
                    <AnimatedCard className="lg:col-span-4 p-8 flex flex-col" delay={0.2}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-primary" /> Progress
                            </h3>
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {streak.filter(x => x).length} Day Streak
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 mb-8">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleStreak(i)}
                                    className={`flex-1 aspect-square rounded-xl text-[10px] font-bold flex items-center justify-center transition-all ${
                                        streak[i] ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 border border-zinc-100 hover:bg-zinc-100'
                                    }`}
                                >
                                    {d}
                                </motion.button>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
                            "Consistency is the engine of results."
                        </p>
                    </AnimatedCard>
                </div>

                {/* Banner */}
                <AnimatedCard className="relative overflow-hidden mb-12 border-none bg-gradient-to-br from-primary to-primary-dark p-10 text-white shadow-2xl" delay={0.4}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Sparkles size={12} /> AI Insight
                        </div>
                        <h2 className="text-2xl font-poppins font-bold mb-4 tracking-tight">Morning Clarity Session</h2>
                        <p className="text-base text-white/80 mb-8 leading-relaxed font-light">
                            Your biometric data suggests a slight increase in stress levels. We recommend a 10-minute mindful breathing exercise.
                        </p>
                        <Link to="/meditate" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg">
                            Start Now <ArrowRight size={16} />
                        </Link>
                    </div>
                </AnimatedCard>
            </main>
        </div>
    );
}

export default Home;