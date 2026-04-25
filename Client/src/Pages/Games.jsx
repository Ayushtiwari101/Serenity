import './Games.css';
import { Link } from 'react-router-dom';

function Games() {
    return (
        <div className="games-root-container">
            <nav className="games-navbar">
                <Link to="/home" className="games-back-link">← Back</Link>
                <div className="games-header-group">
                    <h1 className='games-title'>Mind Games</h1>
                    <p className="games-subtitle">Sharpen your mind with these cognitive exercises.</p>
                </div>
            </nav>

            <div className="games-grid">
                {/* Chess */}
                <div className="games-card">
                    <div className='games-card-image-wrapper'>
                        <img src="/chess.webp" alt="Chess" className='games-card-img' />
                    </div>
                    <div className="games-card-content">
                        <h2 className='games-card-title'>Chess</h2>
                        <a href="https://www.chess.com/" target="_blank" rel="noopener noreferrer" className='games-play-btn'>Play Now</a>
                    </div>
                </div>

                {/* Skribbl */}
                <div className="games-card">
                    <div className='games-card-image-wrapper'>
                        <img src="/game2.jpeg" alt="Skribbl" className='games-card-img' />
                    </div>
                    <div className="games-card-content">
                        <h2 className='games-card-title'>Skribbl.io</h2>
                        <a href="https://skribbl.io/" target="_blank" rel="noopener noreferrer" className="games-play-btn">Play Now</a>
                    </div>
                </div>

                {/* Drawbattle */}
                <div className="games-card">
                    <div className='games-card-image-wrapper'>
                        <img src="/draw-battle.png" alt="Draw Battle" className='games-card-img' />
                    </div>
                    <div className="games-card-content">
                        <h2 className='games-card-title'>Draw Battle</h2>
                        <a href="https://drawbattle.io/" target="_blank" rel="noopener noreferrer" className="games-play-btn">Play Now</a>
                    </div>
                </div>

                {/* Brain Test */}
                <div className="games-card">
                    <div className='games-card-image-wrapper'>
                        <img src="/brain-test.jpeg" alt="Brain Test" className='games-card-img' />
                    </div>
                    <div className="games-card-content">
                        <h2 className='games-card-title'>Brain Test</h2>
                        <a href="https://poki.com/en/g/brain-test-tricky-words" target="_blank" rel="noopener noreferrer" className="games-play-btn">Play Now</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Games