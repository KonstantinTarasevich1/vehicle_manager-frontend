import { useState, useEffect } from 'react';
import { CarFront, Plus, X, AlertTriangle, Trash2, Edit, Calendar, Gauge, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Garage() {

  const [vehicles, setVehicles] = useState([]);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [remindersByVehicle, setRemindersByVehicle] = useState({});
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [activeVehicleId, setActiveVehicleId] = useState(null);

  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', regNumber: '', vinNumber: '', category: 'CAR', engineType: 'PETROL', year: '', mileage: ''
  });

  const [newReminder, setNewReminder] = useState({
    type: 'VIGNETTE', expiryDate: '', price: '', isActive: true,
    vignetteNumber: '', validityPeriod: '', insuranceCompany: '', policyNumber: '', municipality: '', testingCenter: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/my-garage');
      setVehicles(response.data);
      response.data.forEach(v => fetchReminders(v.id));
    } catch (error) {
      console.error("Error fetching garage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      ...newVehicle, 
      year: parseInt(newVehicle.year, 10), 
      mileage: parseInt(newVehicle.mileage, 10) 
    };

    try {
      if (editingVehicleId) await api.put(`/my-garage/${editingVehicleId}`, payload);
      else await api.post('/my-garage', payload);
      closeVehicleModal();
      fetchVehicles();
    } catch (error) { 
      console.error("Error saving vehicle:", error); 
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/my-garage/${id}`);
        fetchVehicles();
      } catch (error) { 
        console.error("Error deleting vehicle:", error); 
      }
    }
  };

  const closeVehicleModal = () => {
    setIsVehicleModalOpen(false);
    setEditingVehicleId(null);
    setNewVehicle({ make: '', model: '', regNumber: '', vinNumber: '', category: 'CAR', engineType: 'PETROL', year: '', mileage: '' });
  };

  const openEditVehicleModal = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setNewVehicle({ ...vehicle });
    setIsVehicleModalOpen(true);
  };

  const fetchReminders = async (vehicleId) => {
    try {
      const response = await api.get(`/reminders/vehicle/${vehicleId}`);
      setRemindersByVehicle(prev => ({ ...prev, [vehicleId]: response.data }));
    } catch (error) { 
      console.error("Error fetching reminders:", error); 
    }
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...newReminder, vehicleId: activeVehicleId };
    try {
      if (editingReminderId) await api.put(`/reminders/${editingReminderId}`, payload);
      else await api.post(`/reminders/vehicle/${activeVehicleId}`, payload);
      closeReminderModal();
      fetchReminders(activeVehicleId);
    } catch (error) { 
      console.error("Error saving reminder:", error); 
    }
  };

  const handleDeleteReminder = async (vehicleId, reminderId) => {
    if (window.confirm("Delete this document/reminder?")) {
      try {
        await api.delete(`/reminders/${reminderId}`);
        fetchReminders(vehicleId);
      } catch (error) { 
        console.error("Error deleting reminder:", error); 
      }
    }
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setEditingReminderId(null);
    setActiveVehicleId(null);
    setNewReminder({ type: 'VIGNETTE', expiryDate: '', price: '', isActive: true, vignetteNumber: '', validityPeriod: '', insuranceCompany: '', policyNumber: '', municipality: '', testingCenter: '' });
  };

  const openAddReminderModal = (vehicleId) => {
    setActiveVehicleId(vehicleId);
    setIsReminderModalOpen(true);
  };

  const openEditReminderModal = (vehicleId, reminder) => {
    setActiveVehicleId(vehicleId);
    setEditingReminderId(reminder.id);
    setNewReminder({ ...reminder });
    setIsReminderModalOpen(true);
  };

  const getDaysUntilExpiry = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const expiry = new Date(dateString);
    expiry.setHours(0, 0, 0, 0); 

    const diffTime = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
    return diffTime;
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading garage...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Vehicles</h1>
        <button onClick={() => setIsVehicleModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium">
          <Plus className="w-5 h-5" /><span>Add Vehicle</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <CarFront className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Your garage is empty</h3>
          <p className="text-gray-500 mt-2">Add your first vehicle to start tracking reminders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                      {vehicle.category}
                    </span>
                    <span className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                      {vehicle.engineType?.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {vehicle.make} {vehicle.model} <span className="text-gray-500 font-normal ml-2">({vehicle.regNumber})</span>
                  </h2>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {vehicle.year}</span>
                    <span className="flex items-center gap-1"><Gauge className="w-4 h-4"/> {vehicle.mileage} km</span>
                    <span>VIN: {vehicle.vinNumber || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openEditVehicleModal(vehicle)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => handleDeleteVehicle(vehicle.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300">Documents & Reminders</h3>
                  <button onClick={() => openAddReminderModal(vehicle.id)} className="text-sm text-blue-600 font-medium hover:underline flex items-center">
                    <Plus className="w-4 h-4 mr-1"/> Add Reminder
                  </button>
                </div>

                <div className="space-y-3">
                  {(!remindersByVehicle[vehicle.id] || remindersByVehicle[vehicle.id].length === 0) ? (
                    <p className="text-sm text-gray-500 italic">No reminders added yet.</p>
                  ) : (
                    remindersByVehicle[vehicle.id].map(reminder => {
                      const daysLeft = getDaysUntilExpiry(reminder.expiryDate);
                      
                      let statusBadge = null;
                      let IconComponent = CheckCircle;
                      let iconColor = "text-green-500";

                      if (daysLeft < 0) {
                        statusBadge = <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">EXPIRED {Math.abs(daysLeft)} DAYS AGO</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-600";
                      } else if (daysLeft === 0) {
                        statusBadge = <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold animate-pulse">EXPIRES TODAY!</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-500";
                      } else if (daysLeft <= 14) {
                        statusBadge = <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">EXPIRING IN {daysLeft} DAYS</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-orange-500";
                      }

                      return (
                        <div key={reminder.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`${iconColor} w-6 h-6`} />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                {reminder.type} 
                                {statusBadge}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3"/> Valid until: {reminder.expiryDate} 
                                {reminder.price && <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">| Cost: €{reminder.price}</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditReminderModal(vehicle.id, reminder)} className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteReminder(vehicle.id, reminder.id)} className="text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <button onClick={closeVehicleModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <CarFront className="w-6 h-6 text-blue-600" />
              {editingVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
            </h2>
            <form onSubmit={handleVehicleSubmit} className="space-y-4">
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
                  <input type="text" maxLength={17} placeholder="17-char code" value={newVehicle.vinNumber} onChange={(e) => setNewVehicle({...newVehicle, vinNumber: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md flex justify-center items-center gap-2 mt-4 transition-colors">
                <Plus className="w-5 h-5" /> {editingVehicleId ? 'Save Changes' : 'Save Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <button onClick={closeReminderModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              {editingReminderId ? 'Edit Document' : 'Add Document'}
            </h2>
            
            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type *</label>
                <select 
                  disabled={editingReminderId !== null} 
                  value={newReminder.type} 
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="VIGNETTE">Vignette</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="YTT">MOT / YTT (Technical test)</option>
                  <option value="TAX">Vehicle Tax</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date *</label>
                  <input required type="date" value={newReminder.expiryDate} onChange={(e) => setNewReminder({...newReminder, expiryDate: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost (€)</label>
                  <input type="number" step="0.01" placeholder="e.g. 50.00" value={newReminder.price} onChange={(e) => setNewReminder({...newReminder, price: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {newReminder.type === 'VIGNETTE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vignette Number</label>
                  <input type="text" placeholder="e.g. BG123456" value={newReminder.vignetteNumber} onChange={(e) => setNewReminder({...newReminder, vignetteNumber: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {newReminder.type === 'INSURANCE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                    <input type="text" placeholder="e.g. Allianz" value={newReminder.insuranceCompany} onChange={(e) => setNewReminder({...newReminder, insuranceCompany: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Policy Number</label>
                    <input type="text" placeholder="e.g. 987654" value={newReminder.policyNumber} onChange={(e) => setNewReminder({...newReminder, policyNumber: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {newReminder.type === 'TAX' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Municipality</label>
                  <input type="text" placeholder="e.g. Sofia" value={newReminder.municipality} onChange={(e) => setNewReminder({...newReminder, municipality: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {newReminder.type === 'YTT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Testing Center</label>
                  <input type="text" placeholder="e.g. AutoTest OOD" value={newReminder.testingCenter} onChange={(e) => setNewReminder({...newReminder, testingCenter: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg shadow-md flex justify-center items-center mt-6 transition-colors">
                {editingReminderId ? 'Update Document' : 'Save Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}