import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, ExternalLink, Brain, Trophy, Users } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import AnimatedCard from '../Components/AnimatedCard';

const gameList = [
    {
        title: 'Strategic Chess',
        desc: 'Master your focus and foresight with the game of kings.',
        url: 'https://www.chess.com/',
        image: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=800&q=80',
        icon: <Brain size={20} className="text-emerald-500" />
    },
    {
        title: 'Creative Skribbl',
        desc: 'Express your imagination and bond with the community.',
        url: 'https://skribbl.io/',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        icon: <Users size={20} className="text-amber-500" />
    },
    {
        title: 'Mindful Drawing',
        desc: 'Channel your inner calm through artistic expression.',
        url: 'https://drawbattle.io/',
        image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80',
        icon: <Sparkles size={20} className="text-rose-500" />
    },
    {
        title: 'Cognitive Boost',
        desc: 'Sharpen your mental agility with logic puzzles.',
        url: 'https://poki.com/en/g/brain-test-tricky-words',
        image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
        icon: <Trophy size={20} className="text-indigo-500" />
    }
];

function Games() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full mb-12">
                <header className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Gamepad2 size={14} /> Cognitive Playground
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-poppins font-bold text-zinc-900 tracking-tight mb-6 leading-tight">
                        Nurture Your <span className="text-primary italic">Focus</span>
                    </h1>
                    <p className="text-xl text-zinc-500 leading-relaxed font-light">
                        Engage your focus, find your flow, and enhance your mental agility with our curated therapeutic experiences.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {gameList.map((game, i) => (
                        <AnimatedCard key={i} delay={i * 0.15} className="group overflow-hidden flex flex-col sm:flex-row h-full border-none shadow-xl">
                            <div className="sm:w-2/5 overflow-hidden relative">
                                <img 
                                    src={game.image} 
                                    alt={game.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                            </div>
                            <div className="sm:w-3/5 p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-zinc-50 rounded-lg">
                                        {game.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-primary transition-colors tracking-tight">{game.title}</h2>
                                </div>
                                <p className="text-zinc-500 mb-8 leading-relaxed">
                                    {game.desc}
                                </p>
                                <a 
                                    href={game.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-all self-start group-hover:shadow-lg group-hover:shadow-primary/20"
                                >
                                    Launch Activity <ExternalLink size={16} />
                                </a>
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Games;