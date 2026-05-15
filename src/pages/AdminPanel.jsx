import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Tag, Euro, MessageSquare, ArrowLeft, Shield, Trash2, X, Loader2, AlertTriangle } from 'lucide-react';

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
                data: { adminPassword: adminPassword } 
            });

            setUsers(users.filter(u => u.username !== deleteModal.username));
            setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            setDeleteModal({ isOpen: false, username: '' });
            
        } catch (err) {
            setModalError(err.response?.data?.message || err.response?.data || 'Failed to delete user. Check your password.');
        }
    };

    const inputClass = "w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
    const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-purple-600" />
                <p className="text-lg font-medium">Loading Admin Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border border-red-200 dark:border-red-800/50 max-w-md">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Restricted</h2>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-6">{error}</p>
                    <button onClick={() => navigate('/home')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
            <button onClick={() => navigate('/profile')} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Profile
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                    <ShieldAlert className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full"><Users className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalUsers || 0}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full"><Tag className="w-8 h-8 text-green-600 dark:text-green-400" /></div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Ads</div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalAds || 0}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full"><Euro className="w-8 h-8 text-amber-600 dark:text-amber-400" /></div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Marketplace Value</div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{Number(stats?.totalAdsValue || 0).toLocaleString('en-US')} €</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full"><MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" /></div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Forum Topics</div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalTopics || 0}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-500" /> User Management
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-5 font-bold">Username</th>
                                <th className="p-5 font-bold">Full Name</th>
                                <th className="p-5 font-bold">Email</th>
                                <th className="p-5 font-bold">Role</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.username} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-5 font-bold text-gray-900 dark:text-white">{user.username}</td>
                                    <td className="p-5 text-gray-600 dark:text-gray-300 font-medium">{user.firstName} {user.lastName}</td>
                                    <td className="p-5 text-gray-600 dark:text-gray-300">{user.email}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wide ${
                                            user.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                            user.role === 'MODERATOR' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right flex justify-end gap-3">
                                        {user.role !== 'ADMIN' && (
                                            <>
                                                <button 
                                                    onClick={() => handleOpenRoleModal(user)}
                                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 dark:border-blue-800/50"
                                                >
                                                    <Shield className="w-4 h-4" /> Role
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDeleteModal(user.username)}
                                                    className="flex items-center gap-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-bold text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-colors border border-red-100 dark:border-red-800/50"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete
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
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative">
                            <button onClick={() => setRoleModal({ isOpen: false, username: '', currentRole: '' })} className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-extrabold flex items-center gap-2">
                                <Shield className="w-6 h-6" /> Change Role
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                                Update privileges for user <span className="font-bold text-gray-900 dark:text-white">{roleModal.username}</span>.
                            </p>
                            
                            {modalError && (
                                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0"/> {modalError}
                                </div>
                            )}

                            <form onSubmit={submitRoleChange} className="space-y-5">
                                <div>
                                    <label className={labelClass}>Assign New Role</label>
                                    <select 
                                        value={selectedRole} 
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="MODERATOR">MODERATOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm with Admin Password</label>
                                    <input 
                                        type="password" 
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                                        Update Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white relative">
                            <button onClick={() => setDeleteModal({ isOpen: false, username: '' })} className="absolute top-4 right-4 text-red-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-extrabold flex items-center gap-2">
                                <Trash2 className="w-6 h-6" /> Delete User
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 mb-6">
                                <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                                    You are about to permanently delete <span className="font-bold text-red-900 dark:text-white">{deleteModal.username}</span> and all their associated data.
                                </p>
                                <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">This action cannot be undone!</p>
                            </div>
                            
                            {modalError && (
                                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0"/> {modalError}
                                </div>
                            )}

                            <form onSubmit={submitDeleteUser} className="space-y-5">
                                <div>
                                    <label className={labelClass}>Confirm with Admin Password</label>
                                    <input 
                                        type="password" 
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-md hover:shadow-lg">
                                        Permanently Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;