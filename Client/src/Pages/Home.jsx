import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Home() {
    const [greeting, setGreeting] = useState('Good Day');
    const [dateString, setDateString] = useState('');
    const [selectedMood, setSelectedMood] = useState(null);

    // Initial Load & Time
    useEffect(() => {
        // Time & Greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Date
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        setDateString(new Date().toLocaleDateString('en-US', options));

        // Load Saved Mood (Reset daily? For now, just persistent)
        const savedMood = localStorage.getItem('serenity_daily_mood');
        const savedMoodDate = localStorage.getItem('serenity_mood_date');
        const todayStr = new Date().toDateString();

        if (savedMood && savedMoodDate === todayStr) {
            setSelectedMood(savedMood);
        }
    }, []);

    const handleMoodSelect = (moodLabel) => {
        setSelectedMood(moodLabel);
        const todayStr = new Date().toDateString();
        localStorage.setItem('serenity_daily_mood', moodLabel);
        localStorage.setItem('serenity_mood_date', todayStr);

        // Feedback
        const messages = {
            'Calm': "Glad you're feeling peaceful. 🌿",
            'Energetic': "That's the spirit! Let's move. ⚡",
            'Tired': "Take it easy today. Rest is productive. 🌙",
            'Stressed': "Deep breaths. We're here for you. 💙"
        };
        toast.success(messages[moodLabel], { icon: '✨' });
    };

    const moods = [
        { emoji: '😌', label: 'Calm' },
        { emoji: '⚡', label: 'Energetic' },
        { emoji: '😔', label: 'Tired' },
        { emoji: '😤', label: 'Stressed' }
    ];

    // Streak Logic
    const [streak, setStreak] = useState(0);
    const [weekStatus, setWeekStatus] = useState(Array(7).fill(false)); // [Mon, Tue, ... Sun]

    useEffect(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // 1. Get History
        let history = JSON.parse(localStorage.getItem('serenity_visit_history') || '[]');

        // 2. Add Today if new
        if (!history.includes(todayStr)) {
            history.push(todayStr);
            localStorage.setItem('serenity_visit_history', JSON.stringify(history));
        }

        // 3. Calculate Streak
        let currentStreak = 0;
        let d = new Date(today);
        while (true) {
            const dStr = d.toISOString().split('T')[0];
            if (history.includes(dStr)) {
                currentStreak++;
                d.setDate(d.getDate() - 1); // Go back one day
            } else {
                break;
            }
        }
        setStreak(currentStreak);

        // 4. Calculate Week Visualization (Mon-Sun)
        // Find Monday of current week
        const dayOfWeek = today.getDay(); // 0(Sun) - 6(Sat)
        const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Mon=0
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMon);

        const newWeekStatus = [];
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(monday);
            checkDate.setDate(monday.getDate() + i);
            const checkStr = checkDate.toISOString().split('T')[0];
            newWeekStatus.push(history.includes(checkStr));
        }
        setWeekStatus(newWeekStatus);

    }, []);

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="home-root-container animate-enter">
            {/* Nav */}
            <nav className="home-navbar">
                <div className="home-navbar-content">
                    <h1 className="home-brand-title">Serenity Steps</h1>
                </div>
            </nav>

            <div className="home-content-wrapper">

                {/* 1. Daily Dashboard Header */}
                <header className="home-dashboard-header">
                    <div className="home-greeting-wrapper">
                        <p className="home-date">{dateString}</p>
                        <h2 className="home-greeting">{greeting}, Traveler</h2>
                    </div>
                </header>

                {/* 2. Retention Tools Row */}
                <section className="home-dashboard-stats-row">
                    {/* Streak Card */}
                    <div className="home-stat-card">
                        <h3 className="home-stat-title">Weekly Consistency</h3>
                        <div className="home-streak-container">
                            {weekDays.map((day, idx) => (
                                <div key={idx} className={`home-streak-dot ${weekStatus[idx] ? 'completed' : ''}`}>
                                    <span className="home-streak-label">{day}</span>
                                </div>
                            ))}
                        </div>
                        <p className="home-stat-subtitle">
                            {streak > 1
                                ? `You're on a ${streak} day streak! 🔥`
                                : "Start your streak today! 🌱"}
                        </p>
                    </div>

                    {/* Mood Check-in */}
                    <div className="home-stat-card">
                        <h3 className="home-stat-title">How are you feeling?</h3>
                        <div className="home-mood-grid">
                            {moods.map((m) => (
                                <button
                                    key={m.label}
                                    className={`home-mood-btn ${selectedMood === m.label ? 'selected' : ''}`}
                                    onClick={() => handleMoodSelect(m.label)}
                                >
                                    <span className="mood-emoji">{m.emoji}</span>
                                    <span className="mood-label">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Daily Recommendation (Dynamic retention hook) */}
                <section className="home-daily-focus">
                    <div className="home-focus-card">
                        <div className="home-focus-content">
                            <h3 className="home-focus-label">TODAY'S RECOMMENDATION</h3>
                            <h2 className="home-focus-title">Morning Clarity Session</h2>
                            <p className="home-focus-desc">Start your day with intention using our 10-minute guided breathing.</p>
                        </div>
                        <Link to="/meditate" className="home-focus-btn">Start Now →</Link>
                    </div>
                </section>

                {/* 4. Quick Access Grid (Existing) */}
                <div className="home-section-title">Explore</div>
                <div className="home-features-grid">
                    <div className="home-feature-card">
                        <div className="home-card-icon-wrapper">
                            <img src="/image.png" alt="Meditation" className='home-card-icon' />
                        </div>
                        <h2 className='home-card-title'>Meditation</h2>
                        <Link to="/meditate" className='home-card-btn'>Start</Link>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-card-icon-wrapper">
                            <img src="/fit.png" alt="Workout" className='home-card-icon' />
                        </div>
                        <h2 className='home-card-title'>Workout</h2>
                        <Link to="/workout" className="home-card-btn">Start</Link>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-card-icon-wrapper">
                            <img src="/diet.png" alt="Diet Plan" className='home-card-icon' />
                        </div>
                        <h2 className='home-card-title'>Diet Plan</h2>
                        <Link to="/diet" className="home-card-btn">View</Link>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-card-icon-wrapper">
                            <img src="/mind.png" alt="Mind Games" className='home-card-icon' />
                        </div>
                        <h2 className='home-card-title'>Games</h2>
                        <Link to="/games" className="home-card-btn">Play</Link>
                    </div>
                </div>
            </div>

            <footer className="home-footer">
                <p>&copy; 2024 Serenity Steps. Daily Wellness.</p>
            </footer>
        </div>
    )
}
export default Home