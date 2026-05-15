import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Phone, User, Calendar, Gauge, Fuel, CheckCircle2, FileText, Settings, ShieldCheck } from 'lucide-react';
import Chat from '../components/Chat'; 

const AdDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/ads/${id}`);
                setAd(response.data);
                
                if (response.data.mainImageUrl) {
                    setMainImage(`http://localhost:8080${response.data.mainImageUrl}`);
                } else if (response.data.imageUrls && response.data.imageUrls.length > 0) {
                    setMainImage(`http://localhost:8080${response.data.imageUrls[0]}`);
                }
            } catch (err) {
                setError('Failed to load ad details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-lg font-medium text-gray-500">Loading vehicle details...</div>;
    if (error) return <div className="text-center mt-20 text-red-500 font-bold text-lg">{error}</div>;
    if (!ad) return <div className="text-center mt-20 text-lg">Ad not found.</div>;

    const formattedPrice = Number(ad.price).toLocaleString('en-US') + ' €';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Marketplace
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8">
                
                <div className="w-full lg:w-2/3">
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 transition-colors">
                        <img src={mainImage || 'https://via.placeholder.com/800x600?text=No+Image'} alt={ad.title} className="w-full h-[400px] md:h-[550px] object-cover" />
                    </div>
                    
                    {ad.imageUrls && ad.imageUrls.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto mb-8 pb-2 custom-scrollbar">
                            {ad.imageUrls.map((url, idx) => (
                                <img 
                                    key={idx} 
                                    src={`http://localhost:8080${url}`} 
                                    alt={`Thumbnail ${idx}`} 
                                    onClick={() => setMainImage(`http://localhost:8080${url}`)}
                                    className={`h-24 w-36 object-cover cursor-pointer rounded-xl border-2 transition-all ${mainImage === `http://localhost:8080${url}` ? 'border-blue-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                            <FileText className="w-6 h-6 text-blue-600" /> Description
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                            {ad.description}
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 space-y-6">
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h1 className="text-2xl font-extrabold mb-2 text-gray-900 dark:text-white">{ad.title}</h1>
                        <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-4">{formattedPrice}</div>
                        <div className="text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2 font-medium">
                            <MapPin className="w-5 h-5" /> {ad.city}
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50 mt-6">
                            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Seller Contact</h3>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-full">
                                    <User className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                                </div>
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{ad.ownerName}</span>
                            </div>
                            <a href={`tel:${ad.ownerPhone}`} className="flex items-center gap-3 mt-4 group">
                                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                                    <Phone className="w-5 h-5 text-green-700 dark:text-green-400" />
                                </div>
                                <span className="text-xl text-green-700 dark:text-green-400 font-bold group-hover:underline">
                                    {ad.ownerPhone}
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="font-bold mb-5 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" /> Technical Details
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Settings className="w-4 h-4"/> Make</span> <span className="font-bold text-gray-900 dark:text-white">{ad.make}</span></li>
                            <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Settings className="w-4 h-4"/> Model</span> <span className="font-bold text-gray-900 dark:text-white">{ad.model}</span></li>
                            <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4"/> Year</span> <span className="font-bold text-gray-900 dark:text-white">{ad.year}</span></li>
                            <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Gauge className="w-4 h-4"/> Mileage</span> <span className="font-bold text-gray-900 dark:text-white">{ad.mileage} km</span></li>
                            <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Fuel className="w-4 h-4"/> Engine</span> <span className="font-bold text-gray-900 dark:text-white">{ad.engineType}</span></li>
                            {ad.vinNumber && <li className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700"><span className="text-gray-500 dark:text-gray-400 font-bold">VIN</span> <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">{ad.vinNumber}</span></li>}
                            
                            {ad.adType === 'CAR' && (
                                <>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Body Style</span> <span className="font-bold text-gray-900 dark:text-white">{ad.bodyStyle}</span></li>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Doors</span> <span className="font-bold text-gray-900 dark:text-white">{ad.doors}</span></li>
                                </>
                            )}
                            {ad.adType === 'TRUCK' && (
                                <>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Load Capacity</span> <span className="font-bold text-gray-900 dark:text-white">{ad.loadCapacityKg} kg</span></li>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Axles</span> <span className="font-bold text-gray-900 dark:text-white">{ad.axles}</span></li>
                                </>
                            )}
                            {ad.adType === 'MOTORCYCLE' && (
                                <>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Type</span> <span className="font-bold text-gray-900 dark:text-white">{ad.motorcycleType}</span></li>
                                    <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Sidecar</span> <span className="font-bold text-gray-900 dark:text-white">{ad.hasSidecar ? 'Yes' : 'No'}</span></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {(ad.vignetteValidUntil || ad.insuranceValidUntil || ad.yttValidUntil) && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                            <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" /> Valid Documents
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {ad.insuranceValidUntil && <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Insurance</span> <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {ad.insuranceValidUntil}</span></li>}
                                {ad.yttValidUntil && <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">YTT (Inspection)</span> <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {ad.yttValidUntil}</span></li>}
                                {ad.vignetteValidUntil && <li className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400">Vignette</span> <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {ad.vignetteValidUntil}</span></li>}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <Chat adId={ad.id} partnerUsername={ad.ownerUsername} />
            </div>

        </div>
    );
};

export default AdDetails;