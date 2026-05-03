import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdCard = ({ ad }) => {
    const navigate = useNavigate();

    const coverImage = ad.mainImageUrl 
        ? `http://localhost:8080${ad.mainImageUrl}` 
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div 
            onClick={() => navigate(`/ads/${ad.id}`)}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition bg-white"
        >
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={coverImage} 
                    alt={ad.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                    {ad.price} €
                </div>
            </div>
            
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{ad.title}</h3>
                <div className="text-sm text-gray-600 mb-2">
                    {ad.make} {ad.model} • {ad.year}
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mt-4 border-t pt-2">
                    <span>{ad.mileage} km</span>
                    <span>{ad.engineType}</span>
                    <span>{ad.city}</span>
                </div>
            </div>
        </div>
    );
};

export default AdCard;