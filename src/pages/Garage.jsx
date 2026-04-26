import { useState, useEffect } from 'react';
import { CarFront, Plus, X, AlertTriangle, Trash2, Edit, Calendar, Gauge } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Garage() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    regNumber: '',
    vinNumber: '',
    category: 'CAR',
    engineType: 'PETROL',
    year: '',
    mileage: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/my-garage');
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching garage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
        ...newVehicle,
        year: parseInt(newVehicle.year, 10),
        mileage: parseInt(newVehicle.mileage, 10)
    };

    try {
      if (editingId) {
        await api.put(`/my-garage/${editingId}`, payload);
      } else {
        await api.post('/my-garage', payload);
      }
      closeModal();
      fetchVehicles();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("An error occurred while saving the vehicle.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/my-garage/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete the vehicle.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewVehicle({ 
      make: '', model: '', regNumber: '', vinNumber: '', 
      category: 'CAR', engineType: 'PETROL', year: '', mileage: '' 
    });
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);
    setNewVehicle({
      make: vehicle.make,
      model: vehicle.model,
      regNumber: vehicle.regNumber || '',
      vinNumber: vehicle.vinNumber || '',
      category: vehicle.category || 'CAR',
      engineType: vehicle.engineType || 'PETROL',
      year: vehicle.year || '',
      mileage: vehicle.mileage || ''
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Loading garage...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Vehicles</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center shadow-sm">
          <CarFront className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Your garage is empty</h3>
          <p className="text-gray-500 mt-2">Add your first vehicle to start tracking reminders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                        {vehicle.category}
                      </span>
                      <span className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                        {vehicle.engineType.replace('_', ' ')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {vehicle.make} {vehicle.model} 
                      {vehicle.regNumber && <span className="text-gray-500 font-normal text-lg ml-2">({vehicle.regNumber})</span>}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {vehicle.year}</span>
                      <span className="flex items-center gap-1"><Gauge className="w-4 h-4"/> {vehicle.mileage} km</span>
                      <span>VIN: {vehicle.vinNumber || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(vehicle)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Reminders will be displayed here.</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <CarFront className="w-6 h-6 text-blue-600" />
              {editingId ? 'Edit Vehicle' : 'Add Vehicle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select value={newVehicle.category} onChange={(e) => setNewVehicle({...newVehicle, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="CAR">Car</option>
                    <option value="TRUCK">Truck</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Engine *</label>
                  <select value={newVehicle.engineType} onChange={(e) => setNewVehicle({...newVehicle, engineType: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONLY_LPG">Only LPG</option>
                    <option value="PETROL_LPG">Petrol + LPG</option>
                    <option value="ONLY_CNG">Only CNG</option>
                    <option value="PETROL_CNG">Petrol + CNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Make *</label>
                  <input required type="text" placeholder="e.g. BMW" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model *</label>
                  <input required type="text" placeholder="e.g. 320d" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
                  <input required type="number" min="1900" max="2026" placeholder="2015" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mileage (km) *</label>
                  <input required type="number" min="0" placeholder="150000" value={newVehicle.mileage} onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Plate</label>
                  <input type="text" placeholder="e.g. CB 1234 AB" value={newVehicle.regNumber} onChange={(e) => setNewVehicle({...newVehicle, regNumber: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VIN Number</label>
                  <input type="text" maxLength={17} placeholder="17-character code" value={newVehicle.vinNumber} onChange={(e) => setNewVehicle({...newVehicle, vinNumber: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                </div>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md flex justify-center items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingId ? 'Save Changes' : 'Save to Garage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}