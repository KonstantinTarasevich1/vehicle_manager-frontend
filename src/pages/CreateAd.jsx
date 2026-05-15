import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CarFront, Settings, Camera, Info, CheckCircle2 } from 'lucide-react';

const CreateAd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [adData, setAdData] = useState({
        adType: 'CAR', title: '', description: '', price: '', city: '', make: '', model: '', year: '', mileage: '', engineType: 'PETROL', vinNumber: '', vignetteValidUntil: '', insuranceValidUntil: '', yttValidUntil: '', bodyStyle: 'SEDAN', doors: '', loadCapacityKg: '', axles: '', motorcycleType: 'SPORT', hasSidecar: false, active: true
    });

    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAdData({ ...adData, [name]: type === 'checkbox' ? checked : value });
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
            images.forEach((image) => formData.append('images', image));
            formData.append('mainImageIndex', mainImageIndex);

            await axios.post('http://localhost:8080/api/ads', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });

            navigate('/my-ads');
        } catch (err) {
            console.error(err);
            setError('An error occurred while publishing the ad.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
    const labelClass = "block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300";

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <PlusCircle className="w-8 h-8" /> Create a New Ad
                    </h2>
                    <p className="mt-2 text-blue-100">Fill in the details below to list your vehicle on the marketplace.</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 border border-red-200 dark:border-red-800 font-medium flex items-center gap-2"><Info className="w-5 h-5"/>{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                                <CarFront className="w-6 h-6 text-blue-500" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Vehicle Type *</label>
                                    <select name="adType" value={adData.adType} onChange={handleInputChange} className={inputClass} required>
                                        <option value="CAR">Car</option>
                                        <option value="TRUCK">Truck</option>
                                        <option value="MOTORCYCLE">Motorcycle</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Ad Title *</label>
                                    <input type="text" name="title" value={adData.title} onChange={handleInputChange} className={inputClass} placeholder="e.g. Audi A4 2018 S-Line" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Price (€) *</label>
                                    <input type="number" name="price" value={adData.price} onChange={handleInputChange} className={inputClass} placeholder="15000" required />
                                </div>
                                <div>
                                    <label className={labelClass}>City *</label>
                                    <input type="text" name="city" value={adData.city} onChange={handleInputChange} className={inputClass} placeholder="e.g. Sofia" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Make *</label>
                                    <input type="text" name="make" value={adData.make} onChange={handleInputChange} className={inputClass} placeholder="e.g. Audi" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Model *</label>
                                    <input type="text" name="model" value={adData.model} onChange={handleInputChange} className={inputClass} placeholder="e.g. A4" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Year of Manufacture *</label>
                                    <input type="number" name="year" value={adData.year} onChange={handleInputChange} className={inputClass} placeholder="2018" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Mileage (km) *</label>
                                    <input type="number" name="mileage" value={adData.mileage} onChange={handleInputChange} className={inputClass} placeholder="120000" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Engine *</label>
                                    <select name="engineType" value={adData.engineType} onChange={handleInputChange} className={inputClass} required>
                                        <option value="DIESEL">Diesel</option>
                                        <option value="PETROL">Petrol</option>
                                        <option value="HYBRID">Hybrid</option>
                                        <option value="ELECTRIC">Electric</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>VIN Number</label>
                                    <input type="text" name="vinNumber" maxLength="17" value={adData.vinNumber} onChange={handleInputChange} className={inputClass} placeholder="17-character VIN" />
                                </div>
                            </div>
                        </section>

                        <section className="bg-blue-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Settings className="w-6 h-6 text-blue-500" /> Specific Characteristics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {adData.adType === 'CAR' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Body Style</label>
                                            <select name="bodyStyle" value={adData.bodyStyle} onChange={handleInputChange} className={inputClass}>
                                                <option value="SEDAN">Sedan</option>
                                                <option value="SUV">SUV</option>
                                                <option value="WAGON">Wagon</option>
                                                <option value="HATCHBACK">Hatchback</option>
                                                <option value="COUPE">Coupe</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Number of Doors</label>
                                            <input type="number" name="doors" value={adData.doors} onChange={handleInputChange} className={inputClass} placeholder="e.g. 4" />
                                        </div>
                                    </>
                                )}
                                {adData.adType === 'TRUCK' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Load Capacity (kg)</label>
                                            <input type="number" name="loadCapacityKg" value={adData.loadCapacityKg} onChange={handleInputChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Number of Axles</label>
                                            <input type="number" name="axles" value={adData.axles} onChange={handleInputChange} className={inputClass} />
                                        </div>
                                    </>
                                )}
                                {adData.adType === 'MOTORCYCLE' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Motorcycle Type</label>
                                            <select name="motorcycleType" value={adData.motorcycleType} onChange={handleInputChange} className={inputClass}>
                                                <option value="SPORT">Sport</option>
                                                <option value="CRUISER">Cruiser</option>
                                                <option value="ENDURO">Enduro</option>
                                                <option value="SCOOTER">Scooter</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center mt-8 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <input type="checkbox" name="hasSidecar" checked={adData.hasSidecar} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded mr-3" />
                                            <label className="font-semibold text-gray-700 dark:text-gray-300">Has Sidecar</label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">Valid Documents (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelClass}>Insurance Until</label>
                                    <input type="date" name="insuranceValidUntil" value={adData.insuranceValidUntil} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>YTT (Inspection) Until</label>
                                    <input type="date" name="yttValidUntil" value={adData.yttValidUntil} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Vignette Until</label>
                                    <input type="date" name="vignetteValidUntil" value={adData.vignetteValidUntil} onChange={handleInputChange} className={inputClass} />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="mb-8">
                                <label className={labelClass}>Detailed Description</label>
                                <textarea name="description" rows="5" value={adData.description} onChange={handleInputChange} className={`${inputClass} resize-none`} placeholder="Write more about the vehicle's condition, features, history..."></textarea>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-gray-500" /> Upload Images
                                </h3>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mb-6 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white transition-all cursor-pointer" />
                                
                                {images.length > 0 && (
                                    <div>
                                        <p className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Select which image will be the MAIN cover:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                            {images.map((img, index) => (
                                                <div key={index} 
                                                     className={`relative border-4 cursor-pointer rounded-xl overflow-hidden transition-all ${mainImageIndex === index ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                                     onClick={() => setMainImageIndex(index)}>
                                                    <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-24 object-cover" />
                                                    {mainImageIndex === index && (
                                                        <div className="absolute top-0 left-0 w-full bg-blue-500 text-white text-xs font-bold py-1 text-center">COVER</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800/50 flex items-center">
                            <input type="checkbox" name="active" id="active" checked={adData.active} onChange={handleInputChange} className="w-6 h-6 text-green-600 rounded mr-4 cursor-pointer" />
                            <label htmlFor="active" className="font-bold text-green-800 dark:text-green-400 cursor-pointer text-lg">
                                Make this ad active immediately (visible to everyone)
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2">
                            {loading ? <span className="animate-pulse">Publishing...</span> : <><CheckCircle2 className="w-6 h-6"/> Publish Ad</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAd;