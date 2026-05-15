import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit3, CarFront, Settings, Camera, Info, Save, Loader2 } from 'lucide-react';

const EditAd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    const [adData, setAdData] = useState({
        adType: 'CAR', title: '', description: '', price: '', city: '', make: '', model: '', year: '', mileage: '', engineType: 'PETROL', vinNumber: '', vignetteValidUntil: '', insuranceValidUntil: '', yttValidUntil: '', bodyStyle: 'SEDAN', doors: '', loadCapacityKg: '', axles: '', motorcycleType: 'SPORT', hasSidecar: false, active: true
    });

    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/ads/${id}`);
                const data = response.data;
                
                setAdData({
                    adType: data.adType || 'CAR', title: data.title || '', description: data.description || '', price: data.price || '', city: data.city || '', make: data.make || '', model: data.model || '', year: data.year || '', mileage: data.mileage || '', engineType: data.engineType || 'PETROL', vinNumber: data.vinNumber || '', vignetteValidUntil: data.vignetteValidUntil || '', insuranceValidUntil: data.insuranceValidUntil || '', yttValidUntil: data.yttValidUntil || '', bodyStyle: data.bodyStyle || 'SEDAN', doors: data.doors || '', loadCapacityKg: data.loadCapacityKg || '', axles: data.axles || '', motorcycleType: data.motorcycleType || 'SPORT', hasSidecar: data.hasSidecar || false, active: data.active !== undefined ? data.active : true
                });
            } catch (err) {
                setError('Failed to fetch ad details.');
            } finally {
                setFetching(false);
            }
        };

        fetchAdDetails();
    }, [id]);

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

            await axios.put(`http://localhost:8080/api/ads/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });

            navigate('/my-ads');
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the ad.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
    const labelClass = "block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300";

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-amber-500" />
                <p className="text-lg font-medium">Loading ad data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <Edit3 className="w-8 h-8" /> Edit Ad
                    </h2>
                    <p className="mt-2 text-amber-100">Update your vehicle's information and keep your listing fresh.</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 border border-red-200 dark:border-red-800 font-medium flex items-center gap-2"><Info className="w-5 h-5"/>{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                                <CarFront className="w-6 h-6 text-amber-500" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Vehicle Type *</label>
                                    <select name="adType" value={adData.adType} onChange={handleInputChange} className={`${inputClass} opacity-60 cursor-not-allowed`} disabled>
                                        <option value="CAR">Car</option>
                                        <option value="TRUCK">Truck</option>
                                        <option value="MOTORCYCLE">Motorcycle</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Vehicle type cannot be changed after creation.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Ad Title *</label>
                                    <input type="text" name="title" value={adData.title} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Price (€) *</label>
                                    <input type="number" name="price" value={adData.price} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>City *</label>
                                    <input type="text" name="city" value={adData.city} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Make *</label>
                                    <input type="text" name="make" value={adData.make} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Model *</label>
                                    <input type="text" name="model" value={adData.model} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Year of Manufacture *</label>
                                    <input type="number" name="year" value={adData.year} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Mileage (km) *</label>
                                    <input type="number" name="mileage" value={adData.mileage} onChange={handleInputChange} className={inputClass} required />
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
                                    <input type="text" name="vinNumber" maxLength="17" value={adData.vinNumber} onChange={handleInputChange} className={inputClass} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-amber-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-amber-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Settings className="w-6 h-6 text-amber-500" /> Specific Characteristics
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
                                            <input type="number" name="doors" value={adData.doors} onChange={handleInputChange} className={inputClass} />
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
                                            <input type="checkbox" name="hasSidecar" checked={adData.hasSidecar} onChange={handleInputChange} className="w-5 h-5 text-amber-500 rounded mr-3" />
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
                                <textarea name="description" rows="5" value={adData.description} onChange={handleInputChange} className={`${inputClass} resize-none`}></textarea>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-gray-500" /> Replace Images
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Leave this empty if you want to keep your current photos.</p>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mb-6 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-gray-700 dark:file:text-white transition-all cursor-pointer" />
                                
                                {images.length > 0 && (
                                    <div>
                                        <p className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Select which NEW image will be the MAIN cover:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                            {images.map((img, index) => (
                                                <div key={index} 
                                                     className={`relative border-4 cursor-pointer rounded-xl overflow-hidden transition-all ${mainImageIndex === index ? 'border-amber-500 shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                                     onClick={() => setMainImageIndex(index)}>
                                                    <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-24 object-cover" />
                                                    {mainImageIndex === index && (
                                                        <div className="absolute top-0 left-0 w-full bg-amber-500 text-white text-xs font-bold py-1 text-center">COVER</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center">
                            <input type="checkbox" name="active" id="active" checked={adData.active} onChange={handleInputChange} className="w-6 h-6 text-blue-600 rounded mr-4 cursor-pointer" />
                            <label htmlFor="active" className="font-bold text-blue-800 dark:text-blue-400 cursor-pointer text-lg">
                                Ad is Active (Visible in Marketplace)
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-amber-500/30 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2">
                            {loading ? <span className="animate-pulse">Updating...</span> : <><Save className="w-6 h-6"/> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAd;