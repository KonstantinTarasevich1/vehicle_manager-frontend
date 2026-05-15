import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit3, Trash2, AlertCircle, Loader2, PackageOpen, Tag } from 'lucide-react';

const MyAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:8080/api/ads/my-ads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAds(response.data);
        } catch (err) {
            setError('Failed to load your ads.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this ad?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/ads/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setAds(ads.filter(ad => ad.id !== id));
            } catch (err) {
                alert('Failed to delete ad.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading your ads...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Ads</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your active and inactive vehicle listings.</p>
                </div>
                <button 
                    onClick={() => navigate('/create-ad')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create New Ad
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {ads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center px-4 transition-colors">
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-full mb-6">
                        <PackageOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No ads found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                        You haven't posted any vehicles for sale yet. Create your first listing to reach thousands of buyers.
                    </p>
                    <button 
                        onClick={() => navigate('/create-ad')}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2 text-lg"
                    >
                        <Plus className="w-5 h-5" /> Post your first ad
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {ads.map(ad => {
                        const isAdActive = ad.active;
                        const formattedPrice = Number(ad.price).toLocaleString('en-US') + ' €';

                        return (
                            <div key={ad.id} className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all group">
                                
                                <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <img 
                                        src={ad.mainImageUrl ? `http://localhost:8080${ad.mainImageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
                                        alt={ad.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {isAdActive ? (
                                            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">Active</span>
                                        ) : (
                                            <span className="bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">Inactive</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white line-clamp-2">
                                                {ad.title}
                                            </h3>
                                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                {formattedPrice}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-2">
                                            <Tag className="w-4 h-4" />
                                            {ad.make} {ad.model} • {ad.year}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:w-48 shrink-0">
                                    <button 
                                        onClick={() => navigate(`/ads/${ad.id}`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition shadow-sm text-sm"
                                    >
                                        <Eye className="w-4 h-4" /> View
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/edit-ad/${ad.id}`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-4 py-2 rounded-xl font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition shadow-sm text-sm"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ad.id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-4 py-2 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition shadow-sm text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyAds;