import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        if (window.confirm('Are you sure you want to delete this ad?')) {
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

    if (loading) return <div className="text-center mt-10">Loading your ads...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 mt-6">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold">My Ads</h1>
                <button 
                    onClick={() => navigate('/create-ad')}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
                >
                    + Create New Ad
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            {ads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-600 mb-4">You haven't posted any ads yet.</p>
                    <button 
                        onClick={() => navigate('/create-ad')}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Click here to create your first ad!
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {ads.map(ad => {
                        const isAdActive = ad.active;

                        return (
                            <div key={ad.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="w-full md:w-48 h-32 bg-gray-100 shrink-0">
                                    <img 
                                        src={ad.mainImageUrl ? `http://localhost:8080${ad.mainImageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
                                        alt={ad.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-gray-800 truncate">{ad.title}</h3>
                                            
                                            {isAdActive ? (
                                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Active</span>
                                            ) : (
                                                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">Inactive</span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 mt-1">{ad.make} {ad.model} • {ad.year}</p>
                                    </div>
                                    <div className="text-xl font-bold text-blue-600 mt-2 md:mt-0">
                                        {ad.price} €
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-gray-50 flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-200 md:w-40 shrink-0">
                                    <button 
                                        onClick={() => navigate(`/ads/${ad.id}`)}
                                        className="w-full bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-semibold hover:bg-blue-200 transition text-sm"
                                    >
                                        View
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/edit-ad/${ad.id}`)}
                                        className="w-full bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded font-semibold hover:bg-yellow-200 transition text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ad.id)}
                                        className="w-full bg-red-100 text-red-700 px-3 py-1.5 rounded font-semibold hover:bg-red-200 transition text-sm"
                                    >
                                        Delete
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