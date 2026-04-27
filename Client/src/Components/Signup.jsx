import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowLeft, Leaf } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import API_URL from '../config';

const clientID = "85462322080-3ie3vc4olh1oi5puuv4b3j3p71get9f6.apps.googleusercontent.com";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactOrEmail, setContactOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEmail = /\S+@\S+\.\S+/.test(contactOrEmail);
    const userdata = {
      firstName, lastName, username, password,
      ...(isEmail ? { email: contactOrEmail } : { contactNumber: contactOrEmail })
    };

    try {
      const response = await axios.post(`${API_URL}/signup`, userdata);
      alert(response.data.message || "Signup successful!");
      navigate("/login");
    } catch (error) {
      setSignupError(error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-zinc-50">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> Back
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 bg-primary rounded-xl items-center justify-center text-white shadow-lg mb-4">
            <Leaf size={24} />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-zinc-900 tracking-tight">Join Serenity</h1>
          <p className="text-zinc-500 text-sm font-medium">Begin your transformation today.</p>
        </div>

        <div className="glass-card p-8 shadow-xl">
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">First Name</label>
                <input type="text" className="w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Last Name</label>
                <input type="text" className="w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email or Mobile</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={16} />
                <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="jane@example.com" value={contactOrEmail} onChange={(e) => setContactOrEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={16} />
                <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="jane_serenity" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={16} />
                <input type="password" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-base shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="flex justify-center mt-2">
              <GoogleOAuthProvider clientId={clientID}>
              <GoogleLogin 
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await axios.post(`${API_URL}/google-auth`, {
                      token: credentialResponse.credential
                    });
                    localStorage.setItem('token', response.data.token);
                    alert("Google login successful!");
                    navigate("/home");
                  } catch (error) {
                    console.error("Google auth failed:", error);
                    alert("Google authentication failed. Please try again.");
                  }
                }} 
                text="signup_with" 
                shape="pill" 
                size="medium" 
              />
            </GoogleOAuthProvider>
            </div>
          </form>

          {signupError && <p className="mt-4 text-xs text-rose-500 text-center font-bold">{signupError}</p>}
        </div>

        <div className="mt-8 text-center text-zinc-500 text-sm font-medium">
          Already part of Serenity? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
