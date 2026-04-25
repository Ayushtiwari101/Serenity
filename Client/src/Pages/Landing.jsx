import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import './Landing.css';

const Landing = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const options = {
      strings: ["Peace", "Balance", "Serenity"],
      typeSpeed: 90,
      backSpeed: 60,
      loop: true,
      showCursor: false,
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="landing-root-container">
      {/* Clean Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">Serenity</div>
        <div className="landing-nav-links">
          <Link to="/login" className="landing-nav-link">Login</Link>
          <Link to="/signup" className="landing-nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero-section">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Find your <span ref={typedRef} className="landing-highlight-text"></span>
          </h1>
          <p className="landing-hero-subtext">
            Your personalized sanctuary for meditation, balanced nutrition,
            and mindful movement. Rediscover your inner calm today.
          </p>

          <div className="landing-cta-group">
            <Link to="/signup">
              <button className="landing-btn-primary">Begin Journey</button>
            </Link>
            <Link to="/login">
              <button className="landing-btn-secondary">Sign In</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
