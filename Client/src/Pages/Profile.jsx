import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Save, LogOut, ArrowLeft, Edit2 } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import AnimatedCard from '../Components/AnimatedCard';
import API_URL from '../config';

// FIXED: InfoRow must be outside the main component to prevent focus loss on re-render
const InfoRow = ({ icon: Icon, label, value, field, isEditing, formData, setFormData }) => (
    <div className="group space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{label}</label>
        <div className="relative">
            {isEditing ? (
                <>
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input 
                        type="text" 
                        value={formData[field]}
                        onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-zinc-900"
                        autoFocus={false}
                    />
                </>
            ) : (
                <div className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4 transition-all group-hover:bg-zinc-100/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 shadow-sm">
                        <Icon size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-zinc-900">{value || <span className="text-zinc-300 font-normal italic">Not set</span>}</div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || '',
                contactNumber: response.data.contactNumber || ''
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/50">
            <Navbar />

            <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full mb-12">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <motion.button 
                            onClick={() => navigate('/home')}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest mb-4"
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </motion.button>
                        <h1 className="text-4xl font-poppins font-bold text-zinc-900 tracking-tight">Your Profile</h1>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 transition-all font-bold text-xs uppercase tracking-widest shadow-sm shadow-rose-500/5"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Summary */}
                    <aside className="lg:col-span-4 space-y-6">
                        <AnimatedCard className="p-8 flex flex-col items-center text-center">
                            <div className="relative mb-6 group">
                                <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden shadow-inner border-4 border-white">
                                    {user && user.firstName ? (
                                        <span className="text-4xl font-bold">{user.firstName[0]}{user.lastName ? user.lastName[0] : ''}</span>
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-zinc-400 hover:text-primary transition-all border border-zinc-50">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-1">
                                {user && user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'Traveler')}
                            </h2>
                            <p className="text-sm font-medium text-zinc-400 mb-6">{user?.username}</p>
                            
                            <div className="w-full pt-6 border-t border-zinc-100">
                                <div className="flex items-center justify-center gap-3 text-left p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <div className="w-10 h-10 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Type</div>
                                        <div className="text-xs font-bold text-emerald-700">Premium Traveler</div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard className="p-6 bg-primary/5 border-primary/10" delay={0.1}>
                             <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Shield size={14} /> Privacy Mode
                             </div>
                             <p className="text-[11px] text-primary/60 font-medium">Your data is encrypted and only visible to you.</p>
                        </AnimatedCard>
                    </aside>

                    {/* Main Details Section */}
                    <div className="lg:col-span-8">
                        <AnimatedCard className="p-10" delay={0.2}>
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-50">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800">Account Information</h3>
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleUpdate}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all"
                                        >
                                            <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-zinc-100 text-zinc-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoRow 
                                    icon={User} label="First Name" value={user?.firstName} field="firstName" 
                                    isEditing={isEditing} formData={formData} setFormData={setFormData}
                                />
                                <InfoRow 
                                    icon={User} label="Last Name" value={user?.lastName} field="lastName" 
                                    isEditing={isEditing} formData={formData} setFormData={setFormData}
                                />
                                <div className="md:col-span-2">
                                    <InfoRow 
                                        icon={Mail} label="Email Address" value={user?.email} field="email" 
                                        isEditing={isEditing} formData={formData} setFormData={setFormData}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InfoRow 
                                        icon={Phone} label="Contact Number" value={user?.contactNumber} field="contactNumber" 
                                        isEditing={isEditing} formData={formData} setFormData={setFormData}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-10 text-[11px] text-zinc-400 text-center italic"
                                >
                                    Ensure your contact information is correct for personalized AI insights.
                                </motion.p>
                            )}
                        </AnimatedCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
