import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, Sun, Moon, Coffee, ArrowRight, Activity, Brain, Utensils, Gamepad2, ChevronRight, Target } from 'lucide-react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import API_URL from '../config';

const PremiumCard = ({ children, className = "", delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 rounded-[32px] overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const MicroRing = ({ percentage, color, icon: Icon }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-14 h-14 flex items-center justify-center group">
            <svg className="w-full h-full -rotate-90 drop-shadow-sm transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100">
                <circle className="text-zinc-100" cx="50" cy="50" r={radius} strokeWidth="6" fill="none" stroke="currentColor" />
                <motion.circle 
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    cx="50" cy="50" r={radius} 
                    strokeWidth="6" fill="none" stroke={color} 
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Icon size={14} style={{ color }} />
            </div>
        </div>
    );
};

function Home() {
    const navigate = useNavigate();
    const [streak, setStreak] = useState([true, true, true, true, false, false, false]);
    const [greeting, setGreeting] = useState({ text: '', subtext: '', icon: null, gradient: '' });
    const [userName, setUserName] = useState('Traveler');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting({ 
                text: 'Good Morning', 
                subtext: "Let's set the tone for a productive day.",
                icon: <Coffee size={24} className="text-amber-600" />,
                gradient: 'from-amber-500/10 via-orange-500/5 to-transparent'
            });
        } else if (hour < 18) {
            setGreeting({ 
                text: 'Good Afternoon', 
                subtext: "Keep the momentum going, you're doing great.",
                icon: <Sun size={24} className="text-orange-500" />,
                gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent'
            });
        } else {
            setGreeting({ 
                text: 'Good Evening', 
                subtext: "Time to wind down and reflect on your progress.",
                icon: <Moon size={24} className="text-indigo-500" />,
                gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent'
            });
        }

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
        <div className="min-h-screen flex flex-col bg-zinc-50/80 font-inter relative overflow-x-hidden">
            {/* Ambient Contextual Background */}
            <div className={`absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b ${greeting.gradient} pointer-events-none -z-10 transition-colors duration-1000`} />
            
            <Navbar />

            <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full flex flex-col gap-10 pb-20">
                {/* Contextual Hero */}
                <header className="mb-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/50 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
                        <Calendar size={12} className="text-primary" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </motion.div>
                    
                    <div className="flex flex-col gap-2">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
                                {greeting.icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-poppins font-bold text-zinc-900 tracking-tight">
                                {greeting.text}, <span className="text-primary italic pr-2">{userName}</span>
                            </h1>
                        </motion.div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-500 text-lg font-light ml-16">
                            {greeting.subtext}
                        </motion.p>
                    </div>
                </header>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[auto]">
                    
                    {/* Primary Insight Banner (Spans 8 cols) */}
                    <PremiumCard className="md:col-span-8 relative overflow-hidden group bg-white border-zinc-100" delay={0.2}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000" />
                        
                        <div className="p-10 relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-primary shadow-sm">
                                    <Sparkles size={12} /> AI Insight
                                </div>
                                <h2 className="text-3xl font-bold mb-4 tracking-tight text-zinc-900">Optimal Time for Focus</h2>
                                <p className="text-lg text-zinc-500 mb-8 font-light max-w-xl leading-relaxed">
                                    Your biometric patterns indicate peak cognitive clarity right now. We recommend starting a deep work session or the 'Clarity' meditation protocol.
                                </p>
                            </div>
                            <div>
                                <Link to="/meditate" className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-zinc-800 hover:shadow-xl transition-all hover:-translate-y-0.5">
                                    Start Protocol <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Streak Tracker (Spans 4 cols) */}
                    <PremiumCard className="md:col-span-4 p-8 flex flex-col bg-white border-zinc-100" delay={0.3}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity size={14} className="text-primary" /> Momentum
                            </h3>
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {streak.filter(x => x).length} Days
                            </div>
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-center gap-6">
                            <div className="flex justify-between gap-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <button key={i} onClick={() => toggleStreak(i)}
                                        className={`flex-1 aspect-square rounded-[14px] text-[10px] font-bold flex items-center justify-center transition-all duration-300 ${
                                            streak[i] 
                                                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                                                : 'bg-zinc-50 text-zinc-400 border border-zinc-100 hover:bg-zinc-100 hover:scale-105'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                                <p className="text-xs text-zinc-500 font-light leading-relaxed italic text-center">
                                    "Small disciplines repeated with consistency lead to great achievements."
                                </p>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Quick Stats (Spans 12 cols horizontally) */}
                    <PremiumCard className="md:col-span-12 p-8 bg-white border-zinc-100" delay={0.4}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-sm">
                                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                                    <Target size={14} className="text-primary" /> Daily Balance
                                </h3>
                                <p className="text-zinc-600 font-light text-sm leading-relaxed">
                                    You're maintaining a healthy equilibrium today. Nutrition and mindfulness are exceptionally well-balanced.
                                </p>
                            </div>

                            <div className="flex gap-8 lg:gap-16 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col items-center gap-3">
                                    <MicroRing percentage={75} color="#10b981" icon={Brain} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mind</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <MicroRing percentage={45} color="#f43f5e" icon={Activity} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Body</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <MicroRing percentage={90} color="#f59e0b" icon={Utensils} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fuel</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <MicroRing percentage={60} color="#6366f1" icon={Gamepad2} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Focus</span>
                                </div>
                            </div>
                            
                            <button className="hidden lg:flex w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 items-center justify-center text-zinc-400 hover:text-primary hover:bg-white hover:shadow-md transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </PremiumCard>

                </div>
            </main>
        </div>
    );
}

export default Home;