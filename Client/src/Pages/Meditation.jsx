import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Meditation.css';

const Meditation = () => {
  const song = useRef(null);
  const video = useRef(null);
  const playButton = useRef(null);
  const outline = useRef(null);
  const timeDisplay = useRef(null);
  const [fakeDuration, setFakeDuration] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);

  const outlineLength = 2 * Math.PI * 216.5;

  useEffect(() => {
    if (outline.current) {
      outline.current.style.strokeDashoffset = outlineLength;
      outline.current.style.strokeDasharray = outlineLength;
    }
  }, [outlineLength]); // Run once on mount to set initial strokes

  useEffect(() => {
    if (timeDisplay.current) {
      const minutes = Math.floor(fakeDuration / 60);
      const seconds = Math.floor(fakeDuration % 60);
      timeDisplay.current.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Padded seconds
    }
  }, [fakeDuration]);


  const checkPlaying = () => {
    if (song.current.paused) {
      song.current.play();
      video.current.play();
      setIsPlaying(true);
    } else {
      song.current.pause();
      video.current.pause();
      setIsPlaying(false);
    }
  };

  const restartSong = () => {
    song.current.currentTime = 0;
    console.log('Restarted song');
  };

  const handleTimeSelect = (time) => {
    setFakeDuration(time);
    song.current.currentTime = 0; // Reset song progress when changing time
    // Visual update happens in useEffect
  };

  const handleSoundChange = async (sound, videoSrc) => {
    const wasPlaying = !song.current.paused;
    song.current.pause();
    video.current.pause();
    song.current.src = sound;
    video.current.src = videoSrc;
    await song.current.load();
    await video.current.load();
    if (wasPlaying) {
      song.current.play();
      video.current.play();
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = song.current.currentTime;
    const elapsed = fakeDuration - currentTime;
    const seconds = Math.floor(elapsed % 60);
    const minutes = Math.floor(elapsed / 60);

    if (timeDisplay.current) {
      timeDisplay.current.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    const progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    if (outline.current) {
      outline.current.style.strokeDashoffset = progress;
    }

    if (currentTime >= fakeDuration) {
      song.current.pause();
      song.current.currentTime = 0;
      video.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="meditation-root-container">
      <nav className="meditation-navbar">
        <Link to="/home" className="meditation-back-btn">← Home</Link>
        <h1 className='meditation-title'>Meditation Session</h1>
      </nav>

      {/* Video Background */}
      <div className="meditation-vid-container">
        <video ref={video} loop muted className="meditation-bg-video">
          <source src="../video/rain.mp4" type="video/mp4" />
        </video>
        <div className="meditation-video-overlay"></div>
      </div>

      <div className="meditation-controls-wrapper">
        <div className="meditation-time-picker">
          <button onClick={() => handleTimeSelect(120)} className="meditation-time-btn">2 Mins</button>
          <button onClick={() => handleTimeSelect(300)} className="meditation-time-btn">5 Mins</button>
          <button onClick={() => handleTimeSelect(600)} className="meditation-time-btn">10 Mins</button>
        </div>

        <div className="meditation-player-container">
          <audio ref={song} onTimeUpdate={handleTimeUpdate}>
            <source src="../sounds/rain.mp3" />
          </audio>

          <div className="meditation-svg-wrapper">
            {/* Using standard sizing controlled by CSS logic mostly, but keeping viewBox for circle calc */}
            <svg className="meditation-track-outline" width="300" height="300" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="226.5" cy="226.5" r="216.5" strokeWidth="20" />
            </svg>
            <svg ref={outline} className="meditation-moving-outline" width="300" height="300" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="226.5" cy="226.5" r="216.5" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>

          <div className="meditation-center-actions">
            <button onClick={checkPlaying} className="meditation-play-toggle">
              <img ref={playButton} src={isPlaying ? "../svg/pause.svg" : "../svg/play.svg"} className="meditation-play-icon" alt="play/pause" />
            </button>
            <h3 ref={timeDisplay} className="meditation-timer-text">10:00</h3>
          </div>
        </div>

        <div className="meditation-sound-picker">
          <button className="meditation-sound-btn" onClick={() => handleSoundChange('../sounds/rain.mp3', '../video/rain.mp4')}>
            <img src="../svg/rain.svg" alt="rain" />
            <span>Rain</span>
          </button>
          <button className="meditation-sound-btn" onClick={() => handleSoundChange('../sounds/beach.mp3', '../video/beach.mp4')}>
            <img src="../svg/beach.svg" alt="beach" />
            <span>Beach</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meditation;