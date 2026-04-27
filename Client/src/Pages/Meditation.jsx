import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CloudRain, Waves, ArrowLeft } from 'lucide-react';

const Meditation = () => {
  const navigate = useNavigate();
  const song = useRef(null);
  const video = useRef(null);
  const [fakeDuration, setFakeDuration] = useState(600);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');

  const outlineLength = 2 * Math.PI * 216.5;

  useEffect(() => {
    setTimeRemaining(fakeDuration);
  }, [fakeDuration]);

  const togglePlay = () => {
    if (!song.current || !video.current) return;

    if (song.current.paused) {
      song.current.play().then(() => {
        video.current.play().catch(e => console.error("Video failed:", e));
        setIsPlaying(true);
      }).catch(error => {
        console.error("Audio failed:", error);
        video.current.play().catch(e => console.error("Video failed:", e));
        setIsPlaying(true); 
      });
    } else {
      song.current.pause();
      video.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeSelect = (time) => {
    setFakeDuration(time);
    if (song.current) {
        song.current.currentTime = 0;
        if (isPlaying) {
            song.current.play().catch(e => {});
            video.current.play().catch(e => {});
        }
    }
  };

  const handleSoundChange = async (soundType) => {
    const wasPlaying = isPlaying;
    setCurrentSound(soundType);
    
    const soundSrc = soundType === 'beach' ? './sounds/beach.mp3' : './sounds/rain.mp3';
    const videoSrc = soundType === 'beach' ? './video/beach.mp4' : './video/rain.mp4';

    if (song.current && video.current) {
        song.current.src = soundSrc;
        video.current.src = videoSrc;
        song.current.load();
        video.current.load();
        if (wasPlaying) {
          song.current.play().catch(e => {});
          video.current.play().catch(e => {});
        }
    }
  };

  const handleTimeUpdate = () => {
    if (!song.current) return;
    const currentTime = song.current.currentTime;
    const elapsed = fakeDuration - currentTime;
    setTimeRemaining(Math.max(0, elapsed));

    if (currentTime >= fakeDuration) {
      song.current.pause();
      song.current.currentTime = 0;
      video.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const progress = (1 - timeRemaining / fakeDuration) * outlineLength;

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Background Video */}
      <video 
        ref={video} 
        loop 
        muted 
        playsInline
        src={currentSound === 'beach' ? './video/beach.mp4' : './video/rain.mp4'}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Distraction-free Back Button */}
      <button 
        onClick={() => navigate('/home')}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/10">
            <ArrowLeft size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Exit Session</span>
      </button>

      <main className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center gap-10 h-full">
        {/* Time Selection */}
        <div className="flex gap-4 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
          {[120, 300, 600].map(t => (
            <button 
              key={t}
              onClick={() => handleTimeSelect(t)} 
              className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                fakeDuration === t 
                ? 'bg-white text-primary shadow-xl' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {t / 60} Min
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 453 453">
            <circle cx="226.5" cy="226.5" r="216.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
            <motion.circle 
              cx="226.5" cy="226.5" r="216.5" 
              fill="none" stroke="white" strokeWidth="12" 
              strokeDasharray={outlineLength}
              animate={{ strokeDashoffset: outlineLength - progress }}
              transition={{ duration: 0.1, ease: "linear" }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          </svg>
          
          <div className="flex flex-col items-center gap-6 relative z-20">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Pause size={32} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <h2 className="text-7xl font-poppins font-light text-white tracking-tighter">
              {formatTime(timeRemaining)}
            </h2>
          </div>
        </div>

        {/* Reset Button */}
        <button 
          onClick={() => { if(song.current) song.current.currentTime = 0; }}
          className="p-3 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
          title="Reset Timer"
        >
          <RotateCcw size={24} />
        </button>

        <audio 
            ref={song} 
            onTimeUpdate={handleTimeUpdate}
            src={currentSound === 'beach' ? './sounds/beach.mp3' : './sounds/rain.mp3'}
        />

        {/* Sound Selection */}
        <div className="flex gap-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
          <button 
            onClick={() => handleSoundChange('rain')}
            className={`flex items-center gap-3 transition-all duration-300 ${
              currentSound === 'rain' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <CloudRain size={20} />
            <span className="font-bold text-xs tracking-widest uppercase">Rain</span>
          </button>
          <button 
            onClick={() => handleSoundChange('beach')}
            className={`flex items-center gap-3 transition-all duration-300 ${
              currentSound === 'beach' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Waves size={20} />
            <span className="font-bold text-xs tracking-widest uppercase">Beach</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Meditation;