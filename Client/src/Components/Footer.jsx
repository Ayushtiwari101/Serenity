import React from 'react';
import { Leaf, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-40 border-t border-white/20 bg-white/40 backdrop-blur-3xl overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-white/50 bg-white/20 p-1">
                <img src="/assets/logo-stylish.png" alt="Serenity Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
            <p className="text-xl text-zinc-600 leading-relaxed mb-10 font-light max-w-sm">
              Your comprehensive companion for mindfulness, physical health, and cognitive well-being. Built for the modern traveler of life.
            </p>
            <div className="flex gap-5">
              {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm text-zinc-400 hover:text-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-zinc-50">
                  <Icon size={20} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-zinc-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Platform</h4>
            <ul className="space-y-5">
              {['Features', 'Meditation', 'Workouts', 'Diet Plan', 'Games'].map(link => (
                <li key={link}>
                  <a href="#" className="text-zinc-500 hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-zinc-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Community</h4>
            <ul className="space-y-5">
              {['Journal', 'Challenges', 'Success Stories', 'Support'].map(link => (
                <li key={link}>
                  <a href="#" className="text-zinc-500 hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-zinc-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Newsletter</h4>
            <p className="text-zinc-500 mb-6 font-light leading-relaxed">Get weekly wellness tips and updates.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="px-6 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm backdrop-blur-sm"
              />
              <button className="w-full bg-zinc-900 text-white px-6 py-4 rounded-2xl hover:bg-zinc-800 transition-all duration-500 font-bold text-sm shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          <p>© 2026 Serenity. Elevating the human experience.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
