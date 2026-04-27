import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-0 right-0 z-[1000] px-6 transition-all duration-500">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-6xl mx-auto flex justify-between items-center px-8 py-3 rounded-full transition-all duration-500 ${
          scrolled 
            ? 'bg-white/40 backdrop-blur-2xl border border-white/40 shadow-premium py-3' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <Link to="/home" className="flex items-center group">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 bg-white/20 p-1">
            <img src="/assets/logo-stylish.png" alt="Serenity Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <span className="ml-5 font-serif text-2xl text-primary tracking-[0.2em] opacity-90 group-hover:opacity-100 transition-opacity">SERENITY</span>
        </Link>

        {!isLanding && (
          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Meditate', 'Workout', 'Diet', 'Games'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  location.pathname.includes(item.toLowerCase().replace(' ', ''))
                    ? 'text-primary'
                    : 'text-zinc-500 hover:text-primary'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6">
          {!isLanding && (
            <>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 text-zinc-600 hover:text-primary hover:bg-white transition-all duration-300 shadow-sm border border-white/50">
                <Bell size={20} />
              </button>
              <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-white/40">
                <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-zinc-600 overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-300 shadow-sm border border-white/50">
                  <User size={20} />
                </div>
              </Link>
            </>
          )}
          {isLanding && (
            <Link 
              to="/login" 
              className="px-8 py-2.5 rounded-full bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
