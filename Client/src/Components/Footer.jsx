import React from 'react';
import { Leaf, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="font-poppins font-bold text-lg text-primary">Serenity</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Your comprehensive companion for mindfulness, physical health, and cognitive well-being. Built for the modern traveler of life.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                <button key={i} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-zinc-400 hover:text-primary hover:shadow-md transition-all duration-300">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-800 mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4">
              {['Features', 'Meditation', 'Workouts', 'Diet Plan', 'Games'].map(link => (
                <li key={link}><a href="#" className="text-sm text-zinc-500 hover:text-primary transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-800 mb-6 uppercase text-xs tracking-widest">Community</h4>
            <ul className="space-y-4">
              {['Journal', 'Challenges', 'Success Stories', 'Support'].map(link => (
                <li key={link}><a href="#" className="text-sm text-zinc-500 hover:text-primary transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-800 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-sm text-zinc-500 mb-4">Get weekly wellness tips and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors font-bold text-sm">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <p>© 2026 Serenity. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
