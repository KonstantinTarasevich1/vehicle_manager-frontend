import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [roleModal, setRoleModal] = useState({ isOpen: false, username: '', currentRole: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, username: '' });
    
    const [selectedRole, setSelectedRole] = useState('USER');
    const [adminPassword, setAdminPassword] = useState('');
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const statsRes = await axios.get('http://localhost:8080/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStats(statsRes.data);

            const usersRes = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(usersRes.data);
            
        } catch (err) {
            setError('Access Denied. You must be an Administrator to view this page.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRoleModal = (user) => {
        setRoleModal({ isOpen: true, username: user.username, currentRole: user.role });
        setSelectedRole(user.role);
        setAdminPassword('');
        setModalError('');
    };

    const submitRoleChange = async (e) => {
        e.preventDefault();
        setModalError('');
        
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/admin/users/${roleModal.username}/role`, {
                newRole: selectedRole,
                adminPassword: adminPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUsers(users.map(u => u.username === roleModal.username ? { ...u, role: selectedRole } : u));
            setRoleModal({ isOpen: false, username: '', currentRole: '' });
            
        } catch (err) {
            setModalError(err.response?.data?.message || err.response?.data || 'Failed to change role. Check your password.');
        }
    };

    const handleOpenDeleteModal = (username) => {
        setDeleteModal({ isOpen: true, username: username });
        setAdminPassword('');
        setModalError('');
    };

    const submitDeleteUser = async (e) => {
        e.preventDefault();
        setModalError('');
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/admin/users/${deleteModal.username}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { adminPassword: adminPassword } // Axios изисква 'data' за body при DELETE заявка
            });

            setUsers(users.filter(u => u.username !== deleteModal.username));
            setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            setDeleteModal({ isOpen: false, username: '' });
            
        } catch (err) {
            setModalError(err.response?.data?.message || err.response?.data || 'Failed to delete user. Check your password.');
        }
    };

    if (loading) return <div className="text-center p-10 text-xl">Loading Admin Dashboard...</div>;
    if (error) return <div className="text-center p-10 text-red-600 font-bold text-xl">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 mt-6 relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button onClick={() => navigate('/profile')} className="text-blue-600 font-bold hover:underline">
                    &larr; Back to Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-1">Total Users</div>
                    <div className="text-3xl font-black text-gray-800">{stats.totalUsers}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-1">Active Ads</div>
                    <div className="text-3xl font-black text-gray-800">{stats.totalAds}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-yellow-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-1">Marketplace Value</div>
                    <div className="text-3xl font-black text-gray-800">{stats.totalAdsValue} €</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-purple-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-1">Forum Topics</div>
                    <div className="text-3xl font-black text-gray-800">{stats.totalTopics}</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
                                <th className="p-4 font-semibold">Username</th>
                                <th className="p-4 font-semibold">Full Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(user => (
                                <tr key={user.username} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-800">{user.username}</td>
                                    <td className="p-4 text-gray-600">{user.firstName} {user.lastName}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : user.role === 'MODERATOR' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {user.role !== 'ADMIN' && (
                                            <>
                                                <button 
                                                    onClick={() => handleOpenRoleModal(user)}
                                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded border border-blue-100 transition"
                                                >
                                                    Change Role
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDeleteModal(user.username)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded border border-red-100 transition"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {roleModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border-t-4 border-t-blue-600">
                        <h2 className="text-2xl font-bold mb-4">Change Role</h2>
                        <p className="text-gray-600 mb-6">
                            Change role for user <span className="font-bold text-gray-900">{roleModal.username}</span>.
                        </p>
                        
                        {modalError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-semibold">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={submitRoleChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">New Role</label>
                                <select 
                                    value={selectedRole} 
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                >
                                    <option value="USER">USER</option>
                                    <option value="MODERATOR">MODERATOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Admin Password</label>
                                <input 
                                    type="password" 
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Enter your password..."
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t mt-6">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                                    Confirm Change
                                </button>
                                <button type="button" onClick={() => setRoleModal({ isOpen: false, username: '', currentRole: '' })} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border-t-4 border-t-red-600">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Delete User</h2>
                        <p className="text-gray-600 mb-2">
                            You are about to permanently delete <span className="font-bold text-gray-900">{deleteModal.username}</span> and all their data (garage, ads, comments).
                        </p>
                        <p className="text-sm font-bold text-red-500 mb-6 uppercase">This action cannot be undone!</p>
                        
                        {modalError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-semibold">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={submitDeleteUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm with Admin Password</label>
                                <input 
                                    type="password" 
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Enter your password..."
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t mt-6">
                                <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition">
                                    Permanently Delete
                                </button>
                                <button type="button" onClick={() => setDeleteModal({ isOpen: false, username: '' })} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;