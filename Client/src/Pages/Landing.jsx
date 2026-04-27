import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import Navbar from '../Components/Navbar';

const Landing = () => {
  const [textIndex, setTextIndex] = useState(0);
  const slogans = ['Peace', 'Clarity', 'Health', 'Focus'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % slogans.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <ShieldCheck className="text-emerald-500" />, title: "Personal Privacy", desc: "Your data is encrypted and remains exclusively yours." },
    { icon: <Zap className="text-amber-500" />, title: "Daily Energy", desc: "Scientifically backed routines to boost your vitality." },
    { icon: <Heart className="text-rose-500" />, title: "Mental Care", desc: "Curated practices to maintain emotional equilibrium." }
  ];

  return (
    <div className="flex flex-col min-h-screen relative font-inter overflow-x-hidden bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Natural Scrolling Background */}
        <section className="relative min-h-[105vh] flex items-center justify-center overflow-hidden px-6 pt-20 text-center z-0">
          {/* Background Image - Absolute so it scrolls with the section */}
          <div className="absolute inset-0">
            <motion.img 
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="/assets/landing-bg-ultra.png" 
              alt="Premium Background" 
              className="w-full h-full object-cover"
            />
            {/* Elegant overlay to ensure text readability */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md text-primary font-semibold text-sm mb-10 shadow-sm border border-white/50"
            >
              <Sparkles size={16} className="text-primary/70 animate-pulse" /> 
              The Pinnacle of Wellness
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-poppins font-bold text-zinc-900 mb-8 tracking-tight leading-[1.1]">
              Find Your <br />
              <div className="relative inline-block h-[1.2em] w-[4em] align-bottom text-primary">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ y: 40, opacity: 0, rotateX: 45 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -40, opacity: 0, rotateX: -45 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent italic"
                  >
                    {slogans[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-zinc-700 mb-14 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Your personal sanctuary for mindfulness, physical well-being, and 
              cognitive health. Begin your journey to a balanced life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <Link to="/signup" className="btn-primary text-xl px-14 py-6 rounded-full group relative overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-3">
                  Begin Your Journey <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        {/* Features Section - Bento Style */}
        <section className="py-32 px-6 bg-white relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">Designed for you</h2>
              <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
                Every feature is crafted to elevate your daily routine and provide lasting benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
              {/* Feature 1 - Large */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:col-span-8 p-12 rounded-[40px] bg-zinc-50 border border-zinc-100 flex flex-col justify-end group overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute top-12 right-12 text-primary opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                   <ShieldCheck size={120} strokeWidth={1} />
                </div>
                <h3 className="text-4xl font-bold text-zinc-900 mb-4 relative z-10">{features[0].title}</h3>
                <p className="text-xl text-zinc-500 max-w-md relative z-10 font-light">{features[0].desc}</p>
              </motion.div>

              {/* Feature 2 - Tall */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:col-span-4 p-12 rounded-[40px] bg-primary text-white flex flex-col justify-between group overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-white/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                   <Zap size={64} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">{features[1].title}</h3>
                  <p className="text-lg text-white/90 font-light">{features[1].desc}</p>
                </div>
              </motion.div>

              {/* Feature 3 - Wide */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="md:col-span-12 p-12 rounded-[40px] bg-zinc-900 text-white flex flex-col md:flex-row items-center gap-12 group overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-rose-500 transition-colors duration-500">
                   <Heart className="text-rose-500 group-hover:text-white transition-colors duration-500" size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-4">{features[2].title}</h3>
                  <p className="text-xl text-zinc-400 font-light max-w-2xl">{features[2].desc}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Landing;
