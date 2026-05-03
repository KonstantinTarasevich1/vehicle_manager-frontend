import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from './AdCard';

const Marketplace = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        adType: '',
        make: '',
        model: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        city: ''
    });

    const fetchAds = async () => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );

            const queryString = new URLSearchParams(activeFilters).toString();

            const token = localStorage.getItem('token');

            const config = {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            };
            
            const response = await axios.get(`http://localhost:8080/api/ads?${queryString}`, config);
            setAds(response.data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAds();
    };

    const handleClearFilters = () => {
        setFilters({
            adType: '', make: '', model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', city: ''
        });
        setTimeout(() => fetchAds(), 50);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 mt-6">
            
            <div className="w-full md:w-1/4 bg-white p-5 rounded-lg shadow h-fit sticky top-6">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Vehicle Type</label>
                        <select 
                            name="adType" 
                            value={filters.adType} 
                            onChange={handleFilterChange} 
                            className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="">All Types</option>
                            <option value="CAR">Cars</option>
                            <option value="TRUCK">Trucks</option>
                            <option value="MOTORCYCLE">Motorcycles</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Make</label>
                        <input 
                            type="text" 
                            name="make" 
                            value={filters.make} 
                            onChange={handleFilterChange} 
                            placeholder="e.g. Audi" 
                            className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Model</label>
                        <input 
                            type="text" 
                            name="model" 
                            value={filters.model} 
                            onChange={handleFilterChange} 
                            placeholder="e.g. A4" 
                            className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Min Price (€)</label>
                            <input 
                                type="number" 
                                name="minPrice" 
                                value={filters.minPrice} 
                                onChange={handleFilterChange} 
                                placeholder="From" 
                                className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Max Price (€)</label>
                            <input 
                                type="number" 
                                name="maxPrice" 
                                value={filters.maxPrice} 
                                onChange={handleFilterChange} 
                                placeholder="To" 
                                className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Year From</label>
                            <input 
                                type="number" 
                                name="minYear" 
                                value={filters.minYear} 
                                onChange={handleFilterChange} 
                                placeholder="e.g. 2010" 
                                className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Year To</label>
                            <input 
                                type="number" 
                                name="maxYear" 
                                value={filters.maxYear} 
                                onChange={handleFilterChange} 
                                placeholder="e.g. 2024" 
                                className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={filters.city} 
                            onChange={handleFilterChange} 
                            placeholder="e.g. Sofia" 
                            className="w-full border border-gray-300 bg-gray-50 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-2">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition shadow-sm">
                            Search
                        </button>
                        <button type="button" onClick={handleClearFilters} className="w-full bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300 transition">
                            Clear Filters
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Marketplace</h1>
                    <span className="text-gray-500">{ads.length} results found</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading ads...</div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded shadow-sm border border-gray-100">
                        <p className="text-lg text-gray-600">No ads found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads.map(ad => (
                            <AdCard key={ad.id} ad={ad} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;