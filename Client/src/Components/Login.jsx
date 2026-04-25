import './Login.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("https://serenitysteps.onrender.com/login", { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            setLoginError(error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-blob auth-blob-sage"></div>
            <div className="auth-blob auth-blob-blue"></div>

            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Enter your details to find your serenity.</p>

                <form className="auth-form" onSubmit={handleFormSubmit}>
                    <div className="auth-input-group">
                        <label className="auth-label">Username</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="e.g. serenity_seeker"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Password</label>
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <a href="#" className="auth-forgot">Forgot password?</a>

                    <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {loginError && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{loginError}</p>}

                <div className="auth-footer">
                    New here? <Link to="/signup" className="auth-link">Create an account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
