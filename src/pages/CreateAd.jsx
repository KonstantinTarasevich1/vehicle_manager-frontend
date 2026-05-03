import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [adData, setAdData] = useState({
        adType: 'CAR',
        title: '',
        description: '',
        price: '',
        city: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        engineType: 'PETROL',
        vinNumber: '',
        vignetteValidUntil: '',
        insuranceValidUntil: '',
        yttValidUntil: '',
        bodyStyle: 'SEDAN',
        doors: '',
        loadCapacityKg: '',
        axles: '',
        motorcycleType: 'SPORT',
        hasSidecar: false
    });

    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAdData({
            ...adData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setMainImageIndex(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('adData', JSON.stringify(adData));

            images.forEach((image) => {
                formData.append('images', image);
            });

            formData.append('mainImageIndex', mainImageIndex);

            await axios.post('http://localhost:8080/api/ads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/marketplace');
        } catch (err) {
            console.error(err);
            setError('An error occurred while publishing the ad.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h2 className="text-2xl font-bold mb-6">Create a New Ad</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">Vehicle Type *</label>
                        <select name="adType" value={adData.adType} onChange={handleInputChange} className="w-full border p-2 rounded" required>
                            <option value="CAR">Car</option>
                            <option value="TRUCK">Truck</option>
                            <option value="MOTORCYCLE">Motorcycle</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Ad Title *</label>
                        <input type="text" name="title" value={adData.title} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Price (€) *</label>
                        <input type="number" name="price" value={adData.price} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">City *</label>
                        <input type="text" name="city" value={adData.city} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Make *</label>
                        <input type="text" name="make" value={adData.make} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Model *</label>
                        <input type="text" name="model" value={adData.model} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Year of Manufacture *</label>
                        <input type="number" name="year" value={adData.year} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Mileage (km) *</label>
                        <input type="number" name="mileage" value={adData.mileage} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Engine *</label>
                        <select name="engineType" value={adData.engineType} onChange={handleInputChange} className="w-full border p-2 rounded" required>
                            <option value="DIESEL">Diesel</option>
                            <option value="PETROL">Petrol</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="ELECTRIC">Electric</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">VIN Number</label>
                        <input type="text" name="vinNumber" maxLength="17" value={adData.vinNumber} onChange={handleInputChange} className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded border">
                    <h3 className="font-bold mb-3">Specific Characteristics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {adData.adType === 'CAR' && (
                            <>
                                <div>
                                    <label className="block mb-1 font-semibold">Body Style</label>
                                    <select name="bodyStyle" value={adData.bodyStyle} onChange={handleInputChange} className="w-full border p-2 rounded">
                                        <option value="SEDAN">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="WAGON">Wagon</option>
                                        <option value="HATCHBACK">Hatchback</option>
                                        <option value="COUPE">Coupe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 font-semibold">Number of Doors</label>
                                    <input type="number" name="doors" value={adData.doors} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                            </>
                        )}

                        {adData.adType === 'TRUCK' && (
                            <>
                                <div>
                                    <label className="block mb-1 font-semibold">Load Capacity (kg)</label>
                                    <input type="number" name="loadCapacityKg" value={adData.loadCapacityKg} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block mb-1 font-semibold">Number of Axles</label>
                                    <input type="number" name="axles" value={adData.axles} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                            </>
                        )}

                        {adData.adType === 'MOTORCYCLE' && (
                            <>
                                <div>
                                    <label className="block mb-1 font-semibold">Motorcycle Type</label>
                                    <select name="motorcycleType" value={adData.motorcycleType} onChange={handleInputChange} className="w-full border p-2 rounded">
                                        <option value="SPORT">Sport</option>
                                        <option value="CRUISER">Cruiser</option>
                                        <option value="ENDURO">Enduro</option>
                                        <option value="SCOOTER">Scooter</option>
                                    </select>
                                </div>
                                <div className="flex items-center mt-6">
                                    <input type="checkbox" name="hasSidecar" checked={adData.hasSidecar} onChange={handleInputChange} className="mr-2" />
                                    <label className="font-semibold">Has Sidecar</label>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">Insurance Until</label>
                        <input type="date" name="insuranceValidUntil" value={adData.insuranceValidUntil} onChange={handleInputChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">YTT Until</label>
                        <input type="date" name="yttValidUntil" value={adData.yttValidUntil} onChange={handleInputChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Vignette Until</label>
                        <input type="date" name="vignetteValidUntil" value={adData.vignetteValidUntil} onChange={handleInputChange} className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Detailed Description</label>
                    <textarea name="description" rows="4" value={adData.description} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Write more about the vehicle's condition..."></textarea>
                </div>

                <div className="border-t pt-4">
                    <label className="block mb-2 font-semibold">Upload Images (Select up to 10)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mb-4 w-full" />
                    
                    {images.length > 0 && (
                        <div className="bg-gray-100 p-4 rounded">
                            <p className="mb-2 text-sm text-gray-600">Select which image will be the main one (cover):</p>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                {images.map((img, index) => (
                                    <div key={index} 
                                         className={`relative border-4 cursor-pointer rounded overflow-hidden ${mainImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                                         onClick={() => setMainImageIndex(index)}>
                                        <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-24 object-cover" />
                                        {mainImageIndex === index && (
                                            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">MAIN</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-400 transition">
                    {loading ? 'Publishing...' : 'Publish Ad'}
                </button>
            </form>
        </div>
    );
};

export default CreateAd;