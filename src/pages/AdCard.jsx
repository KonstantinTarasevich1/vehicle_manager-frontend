import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Gauge, Fuel } from 'lucide-react';

const AdCard = ({ ad }) => {
    const navigate = useNavigate();

    const coverImage = ad.mainImageUrl 
        ? `http://localhost:8080${ad.mainImageUrl}` 
        : 'https://via.placeholder.com/400x300?text=No+Image';

    const formattedPrice = Number(ad.price).toLocaleString('en-US') + ' €';

    return (
        <div 
            onClick={() => navigate(`/ads/${ad.id}`)}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 group flex flex-col h-full"
        >
            <div className="h-52 overflow-hidden relative">
                <img 
                    src={coverImage} 
                    alt={ad.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-black shadow-lg">
                    {formattedPrice}
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-extrabold text-lg mb-1 text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ad.title}
                </h3>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                    {ad.make} {ad.model} • {ad.year}
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <Gauge className="w-4 h-4 text-gray-400" />
                        <span className="truncate w-full">{ad.mileage} km</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center border-l border-r border-gray-100 dark:border-gray-700 px-1">
                        <Fuel className="w-4 h-4 text-gray-400" />
                        <span className="truncate w-full">{ad.engineType}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate w-full">{ad.city}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdCard;