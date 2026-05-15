import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, CarFront, MessageSquare, Tag, LogOut, Shield, Key, AlertTriangle, Edit3, Save, X, Loader2, Mail, Phone, Hash, Trash2 } from 'lucide-react';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load profile.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:8080/api/users/me', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/users/me/password', 
            { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }, 
            { headers: { 'Authorization': `Bearer ${token}` } });
            
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to change password.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you absolutely sure you want to delete your profile? This cannot be undone and all your data, garage vehicles, and ads will be permanently removed.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                handleLogout();
            } catch (err) {
                setError('Failed to delete profile.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const inputClass = "w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
    const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300";

    if (!profile && !error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
            
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-full shadow-lg">
                    <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{profile?.firstName} {profile?.lastName}</h1>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-bold mt-1">@{profile?.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4"/> {profile?.email}
                    </p>
                </div>
            </div>
            
            {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
            {successMessage && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider text-xs border-b border-gray-100 dark:border-gray-700 pb-3">Quick Menu</h2>
                        
                        <div className="space-y-2">
                            <button onClick={() => navigate('/garage')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <CarFront className="w-5 h-5" /> My Garage
                            </button>
                            <button onClick={() => navigate('/my-messages')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <MessageSquare className="w-5 h-5" /> My Messages
                            </button>
                            <button onClick={() => navigate('/my-topics')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <Hash className="w-5 h-5" /> My Forum Topics
                            </button>
                            <button onClick={() => navigate('/my-ads')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <Tag className="w-5 h-5" /> My Ads
                            </button>
                        </div>

                        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold border border-red-100 dark:border-red-800/50 transition-colors">
                                <LogOut className="w-5 h-5" /> Log Out
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="w-6 h-6 text-blue-500" /> Personal Details
                            </h2>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-5 animate-in fade-in duration-300">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-400 mb-6 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <span>Username: <span className="font-bold text-gray-900 dark:text-white">{profile.username}</span> <span className="italic opacity-80">(Cannot be changed)</span></span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>First Name</label>
                                        <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className={inputClass} required />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className={inputClass} placeholder="+359..." />
                                </div>
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                                        <Save className="w-4 h-4"/> Save Changes
                                    </button>
                                    <button type="button" onClick={() => { setIsEditing(false); setFormData(profile); }} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <X className="w-4 h-4"/> Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4 animate-in fade-in duration-300">
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">First Name</span>
                                    <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> {profile.firstName}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Last Name</span>
                                    <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> {profile.lastName}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Email</span>
                                    <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {profile.email}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Phone Number</span>
                                    <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400"/> 
                                        {profile.phoneNumber ? profile.phoneNumber : <span className="italic text-gray-400">Not provided</span>}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Key className="w-6 h-6 text-amber-500" /> Security
                            </h2>
                            {!isChangingPassword && (
                                <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-2 text-amber-600 dark:text-amber-500 hover:text-amber-800 font-bold bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg transition-colors">
                                    Update Password
                                </button>
                            )}
                        </div>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-in fade-in duration-300 border-t border-gray-100 dark:border-gray-700 pt-6">
                                <div>
                                    <label className={labelClass}>Current Password</label>
                                    <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>New Password</label>
                                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={inputClass} required minLength="6" />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm New Password</label>
                                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={inputClass} required minLength="6" />
                                </div>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <button type="submit" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                                        <Save className="w-4 h-4"/> Save Password
                                    </button>
                                    <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({oldPassword: '', newPassword: '', confirmPassword: ''}); setError(''); }} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <X className="w-4 h-4"/> Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-200 dark:border-red-900/50">
                        <h3 className="text-xl text-red-600 dark:text-red-400 font-extrabold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6" /> Danger Zone
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium leading-relaxed">
                            Deleting your account is permanent. Once you delete your account, there is no going back. All your personal data, garage vehicles, active ads, and forum posts will be immediately and permanently removed from our servers.
                        </p>
                        <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-lg transition-all flex items-center gap-2">
                            <Trash2 className="w-5 h-5"/> Delete My Account Permanently
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;