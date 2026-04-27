import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Leaf } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

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
            const response = await axios.post(`${API_URL}/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            alert(response.data.message || "Login successful!");
            navigate('/home');
        } catch (error) {
            setLoginError(error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-zinc-50">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
                <ArrowLeft size={14} /> Back
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex w-12 h-12 bg-primary rounded-xl items-center justify-center text-white shadow-lg mb-4">
                        <Leaf size={24} />
                    </div>
                    <h1 className="text-3xl font-poppins font-bold text-zinc-900 tracking-tight">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm font-medium">Continue your journey with Serenity.</p>
                </div>

                <div className="glass-card p-8 shadow-xl">
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                                    placeholder="your_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary w-full py-4 text-base shadow-lg shadow-primary/20" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {loginError && <p className="mt-4 text-xs text-rose-500 text-center font-bold">{loginError}</p>}
                </div>

                <div className="mt-8 text-center text-zinc-500 text-sm font-medium">
                    New to Serenity? <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
