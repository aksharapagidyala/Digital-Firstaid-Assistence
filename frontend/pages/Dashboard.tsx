
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Weight, Heart, Droplet, Clock, TrendingUp, AlertCircle, Sparkles, ChevronRight, PlusCircle, User as UserIcon, Phone, Trash2, UserPlus, Save
} from 'lucide-react';
import { HealthLog, User, EmergencyContact } from '../types';
import { getHealthSuggestions } from '../geminiService';
import { useLanguage } from '../App';

interface DashboardProps {
  user: User;
  setUser: (u: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [contactForm, setContactForm] = useState({ name: '', phone: '', relation: '' });

  useEffect(() => {
    const savedLogs = localStorage.getItem(`logs_${user.id}`);
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    const savedContacts = localStorage.getItem(`contacts_${user.id}`);
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, [user.id]);

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (logs.length > 0) {
        setLoadingAi(true);
        const suggestions = await getHealthSuggestions(user, logs);
        setAiSuggestions(suggestions);
        setLoadingAi(false);
      }
    };
    fetchAiSuggestions();
  }, [logs, user]);

  const latestLog = logs[logs.length - 1];

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substring(7),
      ...contactForm
    };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem(`contacts_${user.id}`, JSON.stringify(updatedContacts));
    setContactForm({ name: '', phone: '', relation: '' });
    setShowAddContact(false);
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem(`contacts_${user.id}`, JSON.stringify(updatedContacts));
  };

  const StatCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">
          {value || '--'} <span className="text-base font-normal text-slate-400">{unit}</span>
        </h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Hi, {user.name}</h1>
          <p className="text-slate-500 font-medium">Your personal health overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/tracker" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <PlusCircle className="mr-2 w-5 h-5" /> {t('tracker')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Weight" value={latestLog?.weight} unit="kg" icon={Weight} color="bg-blue-500" trend={logs.length > 1 ? `${(logs[logs.length-1].weight - logs[logs.length-2].weight).toFixed(1)}kg` : null} />
        <StatCard title="BP" value={latestLog ? `${latestLog.systolic}/${latestLog.diastolic}` : null} unit="mmHg" icon={Activity} color="bg-red-500" />
        <StatCard title="Heart" value={latestLog?.heartRate} unit="bpm" icon={Heart} color="bg-pink-500" />
        <StatCard title="Sugar" value={latestLog?.sugarLevel} unit="mg/dL" icon={Droplet} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" /> Health Trends
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Phone className="w-5 h-5 mr-2 text-red-500" /> {t('emergencyContacts')}
              </h2>
              <button 
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-blue-600 font-bold text-sm flex items-center hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
              >
                {showAddContact ? t('cancel') : <><PlusCircle className="w-4 h-4 mr-1" /> {t('addContact')}</>}
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContact} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                <input 
                  required
                  placeholder={t('contactName')} 
                  value={contactForm.name} 
                  onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <input 
                  required
                  placeholder={t('contactPhone')} 
                  value={contactForm.phone} 
                  onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                  className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <div className="flex space-x-2">
                  <input 
                    required
                    placeholder={t('contactRelation')} 
                    value={contactForm.relation} 
                    onChange={e => setContactForm({...contactForm, relation: e.target.value})}
                    className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-grow"
                  />
                  {/* Fixed: Use imported Save icon */}
                  <button type="submit" className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {contacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                        <Phone className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{c.name}</p>
                        <p className="text-sm text-slate-500">{c.phone} • <span className="text-blue-500 font-medium">{c.relation}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteContact(c.id)}
                      className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">{t('noContacts')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-blue-200" />
              <h2 className="text-xl font-bold text-white">AI Health Advisor</h2>
            </div>
            {loadingAi ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <p className="text-blue-50 leading-relaxed text-sm">{aiSuggestions}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-slate-400" /> Profile
              </h2>
              <button onClick={() => setIsEditing(!isEditing)} className="text-blue-600 text-sm font-bold hover:underline">
                {isEditing ? t('cancel') : t('editProfile')}
              </button>
            </div>
            {isEditing ? (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('age')}</label>
                  <input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('height')} (cm)</label>
                  <input type="number" value={editForm.height} onChange={e => setEditForm({...editForm, height: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={handleSaveProfile} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                  {t('save')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-400 font-medium">{t('age')}</span>
                  <span className="font-bold text-slate-800">{user.age}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-400 font-medium">{t('height')}</span>
                  <span className="font-bold text-slate-800">{user.height} cm</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-slate-400 font-medium">{t('gender')}</span>
                  <span className="font-bold text-slate-800 capitalize">{user.gender}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
