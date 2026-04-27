import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, User, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className="fixed top-4 left-0 right-0 z-[1000] px-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto flex justify-between items-center px-6 py-2.5 bg-white/70 backdrop-blur-2xl border border-white/50 rounded-full shadow-premium"
      >
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <span className="font-poppins font-bold text-lg text-primary tracking-tight">Serenity</span>
        </Link>

        {!isLanding && (
          <div className="hidden md:flex items-center gap-6">
            {['Home', 'Meditate', 'Workout', 'Diet', 'Games'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                  location.pathname.includes(item.toLowerCase().replace(' ', ''))
                    ? 'text-primary'
                    : 'text-zinc-400 hover:text-primary'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300">
            <Bell size={18} />
          </button>
          <Link to="/profile" className="flex items-center gap-2 pl-2 border-l border-zinc-200">
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-300">
              <User size={18} />
            </div>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
