import { useState, useEffect } from 'react';
import { CarFront, Plus, X, AlertTriangle, Trash2, Edit, Calendar, Gauge, CheckCircle, Clock, FileText, Loader2, ShieldCheck, Euro } from 'lucide-react';
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
    if (window.confirm("Are you sure you want to delete this vehicle from your garage?")) {
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
    if (window.confirm("Are you sure you want to delete this document/reminder?")) {
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
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const inputClass = "w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300";

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
              <p className="text-lg font-medium">Opening your garage...</p>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <CarFront className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                My Garage
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your vehicles and track important document expiries.</p>
        </div>
        <button onClick={() => setIsVehicleModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-bold group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center px-4 transition-colors">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-full mb-6">
              <CarFront className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your garage is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Add your first vehicle to start tracking maintenance, insurance, vignettes, and other important reminders.
          </p>
          <button onClick={() => setIsVehicleModalOpen(true)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2 text-lg">
            <Plus className="w-5 h-5" /> Park a vehicle here
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
              
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {vehicle.category}
                    </span>
                    <span className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {vehicle.engineType?.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    {vehicle.make} {vehicle.model} 
                    <span className="text-sm font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg ml-2 border border-gray-200 dark:border-gray-600 uppercase">
                        {vehicle.regNumber || 'NO PLATE'}
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 mt-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {vehicle.year}</span>
                    <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4"/> {vehicle.mileage.toLocaleString()} km</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">VIN: {vehicle.vinNumber || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 w-full sm:w-auto justify-end">
                  <button onClick={() => openEditVehicleModal(vehicle)} className="flex items-center justify-center gap-2 p-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-bold text-sm border border-gray-200 dark:border-gray-600 shadow-sm">
                      <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDeleteVehicle(vehicle.id)} className="flex items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors border border-red-100 dark:border-red-800/50 shadow-sm" title="Delete Vehicle">
                      <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" /> Documents & Reminders
                  </h3>
                  <button onClick={() => openAddReminderModal(vehicle.id)} className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold py-1.5 px-3 rounded-lg flex items-center transition-colors">
                    <Plus className="w-4 h-4 mr-1"/> Add Document
                  </button>
                </div>

                <div className="space-y-3">
                  {(!remindersByVehicle[vehicle.id] || remindersByVehicle[vehicle.id].length === 0) ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No documents tracked for this vehicle yet.</p>
                    </div>
                  ) : (
                    remindersByVehicle[vehicle.id].map(reminder => {
                      const daysLeft = getDaysUntilExpiry(reminder.expiryDate);
                      
                      let statusBadge = <span className="text-[10px] bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-0.5 rounded-full font-bold tracking-wider">VALID</span>;
                      let IconComponent = ShieldCheck;
                      let iconColor = "text-green-500 dark:text-green-400";
                      let bgColor = "bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800";
                      let borderColor = "border-gray-100 dark:border-gray-700";

                      if (daysLeft < 0) {
                        statusBadge = <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-0.5 rounded-full font-bold tracking-wider">EXPIRED {Math.abs(daysLeft)} DAYS AGO</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-600 dark:text-red-400";
                        bgColor = "bg-red-50/30 dark:bg-red-900/10";
                        borderColor = "border-red-100 dark:border-red-900/30";
                      } else if (daysLeft === 0) {
                        statusBadge = <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse tracking-wider">EXPIRES TODAY!</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-500";
                        bgColor = "bg-red-50/50 dark:bg-red-900/20";
                        borderColor = "border-red-200 dark:border-red-800/50";
                      } else if (daysLeft <= 14) {
                        statusBadge = <span className="text-[10px] bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 px-2 py-0.5 rounded-full font-bold tracking-wider">EXPIRING IN {daysLeft} DAYS</span>;
                        IconComponent = AlertTriangle;
                        iconColor = "text-orange-500 dark:text-orange-400";
                        bgColor = "bg-orange-50/30 dark:bg-orange-900/10";
                        borderColor = "border-orange-100 dark:border-orange-900/30";
                      }

                      return (
                        <div key={reminder.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${borderColor} ${bgColor} transition-colors gap-4 group`}>
                          <div className="flex items-start sm:items-center gap-4">
                            <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border ${borderColor}`}>
                                <IconComponent className={`${iconColor} w-6 h-6`} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-gray-100 flex flex-wrap items-center gap-2">
                                {reminder.type} 
                                {statusBadge}
                              </p>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Valid until: <span className="text-gray-700 dark:text-gray-300">{reminder.expiryDate}</span></span>
                                {reminder.price && <span className="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-4"><Euro className="w-4 h-4"/> Cost: <span className="text-gray-700 dark:text-gray-300">{reminder.price} €</span></span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-12 sm:ml-0">
                            <button onClick={() => openEditReminderModal(vehicle.id, reminder)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg shadow-sm"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteReminder(vehicle.id, reminder.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg shadow-sm"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative shrink-0">
                <button onClick={closeVehicleModal} className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
                <h2 className="text-2xl font-extrabold flex items-center gap-2">
                <CarFront className="w-6 h-6" />
                {editingVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleVehicleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                    <label className={labelClass}>Category *</label>
                    <select value={newVehicle.category} onChange={(e) => setNewVehicle({...newVehicle, category: e.target.value})} className={inputClass}>
                        <option value="CAR">Car</option>
                        <option value="TRUCK">Truck</option>
                        <option value="MOTORCYCLE">Motorcycle</option>
                    </select>
                    </div>
                    <div>
                    <label className={labelClass}>Engine *</label>
                    <select value={newVehicle.engineType} onChange={(e) => setNewVehicle({...newVehicle, engineType: e.target.value})} className={inputClass}>
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

                <div className="grid grid-cols-2 gap-5">
                    <div>
                    <label className={labelClass}>Make *</label>
                    <input required type="text" placeholder="e.g. BMW" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                    <label className={labelClass}>Model *</label>
                    <input required type="text" placeholder="e.g. 320d" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} className={inputClass} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                    <label className={labelClass}>Year *</label>
                    <input required type="number" min="1900" max="2026" placeholder="2015" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                    <label className={labelClass}>Mileage (km) *</label>
                    <input required type="number" min="0" placeholder="150000" value={newVehicle.mileage} onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})} className={inputClass} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                    <label className={labelClass}>License Plate</label>
                    <input type="text" placeholder="e.g. CB 1234 AB" value={newVehicle.regNumber} onChange={(e) => setNewVehicle({...newVehicle, regNumber: e.target.value})} className={`${inputClass} uppercase`} />
                    </div>
                    <div>
                    <label className={labelClass}>VIN Number</label>
                    <input type="text" maxLength={17} placeholder="17-char code" value={newVehicle.vinNumber} onChange={(e) => setNewVehicle({...newVehicle, vinNumber: e.target.value})} className={`${inputClass} uppercase`} />
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 flex justify-center items-center gap-2 transition-all">
                        <CheckCircle className="w-5 h-5" /> {editingVehicleId ? 'Save Changes' : 'Add to Garage'}
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white relative shrink-0">
                <button onClick={closeReminderModal} className="absolute top-4 right-4 text-amber-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
                <h2 className="text-2xl font-extrabold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {editingReminderId ? 'Edit Document' : 'Add Document'}
                </h2>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleReminderSubmit} className="space-y-5">
                <div>
                    <label className={labelClass}>Document Type *</label>
                    <select 
                    disabled={editingReminderId !== null} 
                    value={newReminder.type} 
                    onChange={(e) => setNewReminder({...newReminder, type: e.target.value})} 
                    className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                    <option value="VIGNETTE">Vignette</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="YTT">MOT / YTT (Technical test)</option>
                    <option value="TAX">Vehicle Tax</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                    <label className={labelClass}>Expiry Date *</label>
                    <input required type="date" value={newReminder.expiryDate} onChange={(e) => setNewReminder({...newReminder, expiryDate: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                    <label className={labelClass}>Cost (€)</label>
                    <input type="number" step="0.01" placeholder="50.00" value={newReminder.price} onChange={(e) => setNewReminder({...newReminder, price: e.target.value})} className={inputClass} />
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                    {newReminder.type === 'VIGNETTE' && (
                        <div>
                        <label className={labelClass}>Vignette Number</label>
                        <input type="text" placeholder="e.g. BG123456" value={newReminder.vignetteNumber} onChange={(e) => setNewReminder({...newReminder, vignetteNumber: e.target.value})} className={inputClass} />
                        </div>
                    )}

                    {newReminder.type === 'INSURANCE' && (
                        <>
                        <div>
                            <label className={labelClass}>Company</label>
                            <input type="text" placeholder="e.g. Allianz" value={newReminder.insuranceCompany} onChange={(e) => setNewReminder({...newReminder, insuranceCompany: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Policy Number</label>
                            <input type="text" placeholder="e.g. 987654" value={newReminder.policyNumber} onChange={(e) => setNewReminder({...newReminder, policyNumber: e.target.value})} className={inputClass} />
                        </div>
                        </>
                    )}

                    {newReminder.type === 'TAX' && (
                        <div>
                        <label className={labelClass}>Municipality</label>
                        <input type="text" placeholder="e.g. Sofia" value={newReminder.municipality} onChange={(e) => setNewReminder({...newReminder, municipality: e.target.value})} className={inputClass} />
                        </div>
                    )}

                    {newReminder.type === 'YTT' && (
                        <div>
                        <label className={labelClass}>Testing Center</label>
                        <input type="text" placeholder="e.g. AutoTest OOD" value={newReminder.testingCenter} onChange={(e) => setNewReminder({...newReminder, testingCenter: e.target.value})} className={inputClass} />
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/30 flex justify-center items-center gap-2 transition-all">
                        <CheckCircle className="w-5 h-5" /> {editingReminderId ? 'Update Document' : 'Save Document'}
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}