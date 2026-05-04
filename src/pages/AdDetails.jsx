import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

    if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500 text-lg">{error}</div>;
    if (!ad) return <div className="text-center mt-10 text-lg">Ad not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 mt-6">
            <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline font-semibold">
                &larr; Back to Marketplace
            </button>
            
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 border">
                        <img src={mainImage || 'https://via.placeholder.com/800x600?text=No+Image'} alt={ad.title} className="w-full h-[500px] object-cover" />
                    </div>
                    
                    {ad.imageUrls && ad.imageUrls.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
                            {ad.imageUrls.map((url, idx) => (
                                <img 
                                    key={idx} 
                                    src={`http://localhost:8080${url}`} 
                                    alt={`Thumbnail ${idx}`} 
                                    onClick={() => setMainImage(`http://localhost:8080${url}`)}
                                    className={`h-24 w-36 object-cover cursor-pointer rounded-md border-2 transition-all ${mainImage === `http://localhost:8080${url}` ? 'border-blue-600 shadow-md scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                        <h2 className="text-xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
                    </div>
                </div>

                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
                        <div className="text-3xl font-bold text-blue-600 mb-4">{ad.price} €</div>
                        <div className="text-gray-600 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {ad.city}
                        </div>
                        
                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-2 text-gray-800">Seller Contact</h3>
                            <p className="font-semibold text-lg">{ad.ownerName}</p>
                            <a href={`tel:${ad.ownerPhone}`} className="text-xl text-blue-600 font-bold hover:underline block mt-1">
                                {ad.ownerPhone}
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold mb-4 text-gray-800">Technical Details</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Make</span> <span className="font-semibold">{ad.make}</span></li>
                            <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Model</span> <span className="font-semibold">{ad.model}</span></li>
                            <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Year</span> <span className="font-semibold">{ad.year}</span></li>
                            <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Mileage</span> <span className="font-semibold">{ad.mileage} km</span></li>
                            <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Engine</span> <span className="font-semibold">{ad.engineType}</span></li>
                            {ad.vinNumber && <li className="flex justify-between border-b pb-2"><span className="text-gray-500">VIN</span> <span className="font-semibold">{ad.vinNumber}</span></li>}
                            
                            {ad.adType === 'CAR' && (
                                <>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Body Style</span> <span className="font-semibold">{ad.bodyStyle}</span></li>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Doors</span> <span className="font-semibold">{ad.doors}</span></li>
                                </>
                            )}
                            {ad.adType === 'TRUCK' && (
                                <>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Load Capacity</span> <span className="font-semibold">{ad.loadCapacityKg} kg</span></li>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Axles</span> <span className="font-semibold">{ad.axles}</span></li>
                                </>
                            )}
                            {ad.adType === 'MOTORCYCLE' && (
                                <>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Type</span> <span className="font-semibold">{ad.motorcycleType}</span></li>
                                    <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Sidecar</span> <span className="font-semibold">{ad.hasSidecar ? 'Yes' : 'No'}</span></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {(ad.vignetteValidUntil || ad.insuranceValidUntil || ad.yttValidUntil) && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-4 text-gray-800">Valid Documents</h3>
                            <ul className="space-y-3 text-sm">
                                {ad.insuranceValidUntil && <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Insurance</span> <span className="font-semibold text-green-600">{ad.insuranceValidUntil}</span></li>}
                                {ad.yttValidUntil && <li className="flex justify-between border-b pb-2"><span className="text-gray-500">YTT (Inspection)</span> <span className="font-semibold text-green-600">{ad.yttValidUntil}</span></li>}
                                {ad.vignetteValidUntil && <li className="flex justify-between border-b pb-2"><span className="text-gray-500">Vignette</span> <span className="font-semibold text-green-600">{ad.vignetteValidUntil}</span></li>}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 border-t pt-8">
                <Chat adId={ad.id} partnerUsername={ad.ownerUsername} />
            </div>

        </div>
    );
};

export default AdDetails;