import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SlidersHorizontal, Search, X, MapPin, Calendar, Car, Euro, Loader2, PackageX } from 'lucide-react';
import AdCard from './AdCard';

const Marketplace = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        adType: '', make: '', model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', city: ''
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
            
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit sticky top-24 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="space-y-5">
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vehicle Type</label>
                        <select 
                            name="adType" 
                            value={filters.adType} 
                            onChange={handleFilterChange} 
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="">All Types</option>
                            <option value="CAR">Cars</option>
                            <option value="TRUCK">Trucks</option>
                            <option value="MOTORCYCLE">Motorcycles</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Make</label>
                            <div className="relative">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" name="make" value={filters.make} onChange={handleFilterChange} placeholder="e.g. Audi" 
                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Model</label>
                            <div className="relative">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" name="model" value={filters.model} onChange={handleFilterChange} placeholder="e.g. A4" 
                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Min Price</label>
                            <div className="relative">
                                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="From" 
                                    className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Price</label>
                            <div className="relative">
                                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="To" 
                                    className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year From</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" name="minYear" value={filters.minYear} onChange={handleFilterChange} placeholder="2010" 
                                    className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year To</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" name="maxYear" value={filters.maxYear} onChange={handleFilterChange} placeholder="2024" 
                                    className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="e.g. Sofia" 
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-3">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                            <Search className="w-4 h-4" /> Apply Filters
                        </button>
                        <button type="button" onClick={handleClearFilters} className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                            <X className="w-4 h-4" /> Clear All
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Marketplace</h1>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 py-1.5 px-4 rounded-full text-sm font-bold shadow-sm">
                        {ads.length} {ads.length === 1 ? 'vehicle' : 'vehicles'} found
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                        <p className="text-lg font-medium">Searching for vehicles...</p>
                    </div>
                ) : ads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center px-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-6">
                            <PackageX className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No vehicles found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            We couldn't find any ads matching your current filters. Try adjusting your search criteria or clear filters to see all available vehicles.
                        </p>
                        <button onClick={handleClearFilters} className="mt-6 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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