import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-16 pt-12 text-center lg:pt-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-8"
            >
              <Sparkles size={14} /> 
              The Future of Wellness
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-poppins font-medium text-zinc-900 leading-tight mb-8 tracking-tighter">
              Find Your <br />
              <div className="relative inline-block h-[1.2em] w-full align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 text-primary italic font-bold"
                  >
                    {slogans[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-2xl text-xl text-zinc-500 leading-relaxed mb-12"
            >
              Join thousands on a journey to mental clarity, physical strength, and spiritual balance through our personalized AI companion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/signup" className="btn-primary text-lg px-10 py-5">
                Join Serenity Today <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-10 py-5">
                Explore Demo
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-white/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-10 rounded-4xl border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
