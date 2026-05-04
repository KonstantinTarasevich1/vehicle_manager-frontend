import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        if (window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
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

    if (!profile && !error) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 mt-6">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Navigation</h2>
                        
                        <button onClick={() => navigate('/garage')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded font-semibold mb-2 border transition">
                            My Garage
                        </button>
                        
                        <button onClick={() => navigate('/my-messages')} className="w-full flex justify-between items-center text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 rounded font-semibold mb-2 border transition">
                            <span>My Messages</span>
                        </button>

                        <button onClick={() => navigate('/my-ads')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded font-semibold mb-2 border transition">
                            My Ads
                        </button>
                        
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold border border-red-100 transition mt-4">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Profile Details</h2>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline font-semibold">
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 mb-4 border">
                                    Username: <span className="font-bold">{profile.username}</span> (Cannot be changed)
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Phone Number</label>
                                    <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Save Changes</button>
                                    <button type="button" onClick={() => { setIsEditing(false); setFormData(profile); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-sm text-gray-500">Username</span>
                                    <span className="font-semibold text-lg">{profile.username}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Email</span>
                                    <span className="font-semibold text-lg">{profile.email}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">First Name</span>
                                    <span className="font-semibold text-lg">{profile.firstName}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Last Name</span>
                                    <span className="font-semibold text-lg">{profile.lastName}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Phone Number</span>
                                    <span className="font-semibold text-lg">{profile.phoneNumber || 'Not provided'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Security</h2>
                            {!isChangingPassword && (
                                <button onClick={() => setIsChangingPassword(true)} className="text-blue-600 hover:underline font-semibold">
                                    Change Password
                                </button>
                            )}
                        </div>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 border-t pt-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Current Password</label>
                                    <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">New Password</label>
                                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required minLength="6" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required minLength="6" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Update Password</button>
                                    <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({oldPassword: '', newPassword: '', confirmPassword: ''}); setError(''); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
                        <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. All your data, garage vehicles, and ads will be permanently removed.</p>
                        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition">
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;