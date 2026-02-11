
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, PhoneCall, Search, Stethoscope, ChevronRight, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguage } from '../App';
import { FIRST_AID_SCENARIOS } from '../constants';
import { FirstAidScenario } from '../types';
import { getDailyHealthTip } from '../geminiService';

const Home: React.FC = () => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<FirstAidScenario[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dailyTip, setDailyTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(true);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchTip = async () => {
    setLoadingTip(true);
    const tip = await getDailyHealthTip();
    setDailyTip(tip);
    setLoadingTip(false);
  };

  useEffect(() => {
    fetchTip();
  }, []);

  useEffect(() => {
    if (search.trim().length > 0) {
      const filtered = FIRST_AID_SCENARIOS.filter(s => 
        s.title[lang].toLowerCase().includes(search.toLowerCase()) ||
        s.category[lang].toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/first-aid?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative bg-white pt-16 pb-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm mb-8">
            <ShieldAlert className="w-4 h-4" />
            <span>24/7 Digital First Aid Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Digital <span className="text-blue-600">First Aid</span> Assistance
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">{t('searchPlaceholder')}</p>

          <div className="max-w-2xl mx-auto relative mb-12" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-xl focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSuggestions(true)}
              />
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden text-left animate-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  {suggestions.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => navigate(`/first-aid?id=${s.id}`)} 
                      className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl flex items-center space-x-4 group transition-colors"
                    >
                      <span className="text-2xl bg-slate-50 p-2 rounded-xl group-hover:bg-white shadow-sm transition-all">{s.icon}</span>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-700">{s.title[lang]}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.category[lang]}</p>
                      </div>
                      <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/first-aid" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center shadow-xl hover:bg-slate-800 transition-all">
              <Stethoscope className="mr-2 w-5 h-5" /> {t('firstAid')}
            </Link>
            <Link to="/tracker" className="bg-white text-slate-700 border-2 px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-slate-50 transition-all">
              <Activity className="mr-2 w-5 h-5" /> {t('tracker')}
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Care Tip Widget */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 bg-white/10 w-40 h-40 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Lightbulb className="w-6 h-6 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-blue-100">Daily Care Tip</h3>
                </div>
                <button 
                  onClick={fetchTip} 
                  disabled={loadingTip}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
                  title="Refresh Tip"
                >
                  <RefreshCw className={`w-5 h-5 ${loadingTip ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loadingTip ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-4 italic">
                    "{dailyTip}"
                  </p>
                  <div className="flex items-center text-blue-200 text-sm font-bold">
                    <Sparkles className="w-4 h-4 mr-2" /> Powered by Digital Assistant AI
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-4xl font-black mb-6 md:mb-0">{t('emergency')}?</h2>
          <div className="flex items-center space-x-4 bg-white/5 p-6 rounded-3xl border border-white/10">
            <PhoneCall className="w-10 h-10 text-red-500" />
            <div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t('emergency')}</span>
              <a href="tel:112" className="text-4xl font-black hover:text-red-400 transition-colors">112</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;