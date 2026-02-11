
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ChevronLeft, 
  Activity, 
  Weight, 
  Heart, 
  Droplet, 
  Timer,
  Save,
  Info
} from 'lucide-react';
import { HealthLog, User } from '../types';

interface HealthTrackerProps {
  user: User;
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    sugarLevel: '',
    activityMinutes: ''
  });

  const [saving, setSaving] = useState(false);

  const calculateBMI = (weight: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const newLog: HealthLog = {
      id: Math.random().toString(36).substring(7),
      userId: user.id,
      timestamp: new Date().toISOString(),
      weight: parseFloat(formData.weight),
      systolic: parseInt(formData.systolic),
      diastolic: parseInt(formData.diastolic),
      heartRate: parseInt(formData.heartRate),
      sugarLevel: parseFloat(formData.sugarLevel),
      activityMinutes: parseInt(formData.activityMinutes),
      bmi: calculateBMI(parseFloat(formData.weight), user.height)
    };

    const existingLogs = JSON.parse(localStorage.getItem(`logs_${user.id}`) || '[]');
    const updatedLogs = [...existingLogs, newLog];
    localStorage.setItem(`logs_${user.id}`, JSON.stringify(updatedLogs));

    setTimeout(() => {
      setSaving(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Daily Health Log</h1>
              <p className="text-blue-100">Track your progress and get AI insights.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weight Section */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Weight className="w-4 h-4 mr-2 text-blue-500" /> Body Weight (kg)
              </label>
              <input
                required
                type="number"
                name="weight"
                step="0.1"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. 75.5"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>

            {/* Heart Rate Section */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Heart className="w-4 h-4 mr-2 text-pink-500" /> Heart Rate (bpm)
              </label>
              <input
                required
                type="number"
                name="heartRate"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. 72"
                value={formData.heartRate}
                onChange={handleInputChange}
              />
            </div>

            {/* Blood Pressure Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <Activity className="w-4 h-4 mr-2 text-red-500" /> Systolic (mmHg)
                </label>
                <input
                  required
                  type="number"
                  name="systolic"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. 120"
                  value={formData.systolic}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <Activity className="w-4 h-4 mr-2 text-red-400" /> Diastolic (mmHg)
                </label>
                <input
                  required
                  type="number"
                  name="diastolic"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. 80"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sugar Level */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Droplet className="w-4 h-4 mr-2 text-orange-500" /> Blood Sugar (mg/dL)
              </label>
              <input
                required
                type="number"
                name="sugarLevel"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. 100"
                value={formData.sugarLevel}
                onChange={handleInputChange}
              />
            </div>

            {/* Activity Minutes */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Timer className="w-4 h-4 mr-2 text-teal-500" /> Activity (Minutes)
              </label>
              <input
                required
                type="number"
                name="activityMinutes"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. 30"
                value={formData.activityMinutes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
            <Info className="w-5 h-5 text-blue-500 mt-1" />
            <p className="text-sm text-blue-700 leading-relaxed">
              Tracking your health daily helps myCare's AI provide better personalized insights. Try to log your data at approximately the same time each day for consistency.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-5 rounded-2xl text-xl font-bold text-white shadow-xl transition-all flex items-center justify-center ${
              saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving your data...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 w-6 h-6" /> Save Today's Entry
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthTracker;
