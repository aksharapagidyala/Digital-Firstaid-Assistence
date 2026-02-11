
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  ShieldAlert, 
  ChevronRight, 
  ArrowLeft,
  Stethoscope,
  MapPin,
  Loader2,
  Phone,
  Navigation,
  ExternalLink,
  LocateFixed,
  Map,
  User,
  Info,
  X,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react';
import { FIRST_AID_SCENARIOS } from '../constants';
import { FirstAidScenario } from '../types';
import { getNearbyFacilities, getLocationSuggestions, getAiFirstAid } from '../geminiService';
import { useLanguage } from '../App';

const FirstAid: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyType, setNearbyType] = useState<'pharmacy' | 'doctor' | null>(null);
  const [nearbyResults, setNearbyResults] = useState<{text: string, chunks: any[]}>({text: '', chunks: []});
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [locSuggestions, setLocSuggestions] = useState<string[]>([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [loadingLocSuggestions, setLoadingLocSuggestions] = useState(false);
  const [showAiDetail, setShowAiDetail] = useState(false);
  const [loadingAiFirstAid, setLoadingAiFirstAid] = useState(false);
  
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  // Parse URL parameters for direct linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const q = params.get('q');
    if (id) {
      const scenario = FIRST_AID_SCENARIOS.find(s => s.id === id);
      if (scenario) setSelectedScenario(scenario);
    } else if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(event.target as Node)) {
        setShowLocSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use Memo to filter scenarios in real-time for the grid
  const filteredScenarios = useMemo(() => {
    if (!searchQuery.trim()) return FIRST_AID_SCENARIOS;
    const q = searchQuery.toLowerCase();
    return FIRST_AID_SCENARIOS.filter(s => {
      const title = s.title[lang].toLowerCase();
      const category = s.category[lang].toLowerCase();
      const steps = s.steps[lang].join(' ').toLowerCase();
      return title.includes(q) || category.includes(q) || steps.includes(q);
    });
  }, [searchQuery, lang]);

  // Handle location suggestions with debounce
  useEffect(() => {
    if (manualLocation.trim().length < 2) {
      setLocSuggestions([]);
      setShowLocSuggestions(false);
      return;
    }

    setLoadingLocSuggestions(true);
    const timer = setTimeout(async () => {
      const results = await getLocationSuggestions(manualLocation);
      setLocSuggestions(results);
      setLoadingLocSuggestions(false);
      setShowLocSuggestions(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [manualLocation]);

  const fetchAiGuidance = async () => {
    setLoadingAiFirstAid(true);
    const result = await getAiFirstAid(searchQuery, lang);
    if (result) {
      setSelectedScenario({
        id: 'ai-generated',
        title: { [lang]: result.title },
        category: { [lang]: 'AI Assistant' },
        icon: '🤖',
        steps: { [lang]: result.steps },
        dos: { [lang]: result.dos },
        donts: { [lang]: result.donts }
      });
    } else {
      alert("AI Guidance currently unavailable. Please call emergency services.");
    }
    setLoadingAiFirstAid(false);
  };

  const findNearby = async (type: 'pharmacy' | 'doctor') => {
    setLoadingNearby(true);
    setNearbyType(type);
    setNearbyResults({text: '', chunks: []});
    setShowAiDetail(true);
    
    if (manualLocation.trim()) {
      try {
        const results = await getNearbyFacilities(type, undefined, undefined, manualLocation);
        setNearbyResults(results);
      } catch (err) {
        console.error("Facility finding error:", err);
      } finally {
        setLoadingNearby(false);
      }
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoadingNearby(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const results = await getNearbyFacilities(type, pos.coords.latitude, pos.coords.longitude);
        setNearbyResults(results);
      } catch (err) {
        console.error("Facility finding error:", err);
      } finally {
        setLoadingNearby(false);
      }
    }, (err) => {
      alert("Location access denied. Please enter location manually.");
      setLoadingNearby(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {selectedScenario ? (
        <div className="animate-in slide-in-from-right duration-300">
          <button onClick={() => setSelectedScenario(null)} className="flex items-center text-slate-500 mb-8 font-bold hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> {t('backToGuides')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center space-x-6">
                <div className="text-6xl bg-white p-6 rounded-3xl border shadow-sm">{selectedScenario.icon}</div>
                <div>
                  <h1 className="text-5xl font-black text-slate-900">{selectedScenario.title[lang]}</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-1">{selectedScenario.category[lang]}</p>
                </div>
              </div>

              <section className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
                  <Stethoscope className="w-6 h-6 mr-3 text-blue-600" /> Emergency Instructions
                </h2>
                <div className="space-y-8">
                  {selectedScenario.steps[lang].map((step: string, index: number) => (
                    <div key={index} className="flex space-x-6">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-blue-100">
                        {index + 1}
                      </div>
                      <p className="text-xl text-slate-700 pt-2 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                  <h3 className="text-xl font-black text-green-800 mb-6 flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" /> Do's
                  </h3>
                  <ul className="space-y-4">
                    {selectedScenario.dos[lang].map((item: string, i: number) => (
                      <li key={i} className="flex items-start text-green-700 font-bold">
                        <span className="mr-3 text-xl">✅</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                  <h3 className="text-xl font-black text-red-800 mb-6 flex items-center">
                    <XCircle className="w-6 h-6 mr-2 text-red-600" /> Don'ts
                  </h3>
                  <ul className="space-y-4">
                    {selectedScenario.donts[lang].map((item: string, i: number) => (
                      <li key={i} className="flex items-start text-red-700 font-bold">
                        <span className="mr-3 text-xl">❌</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-6" />
                <h3 className="text-3xl font-black mb-4">{t('emergency')}?</h3>
                <p className="text-slate-400 mb-8 font-medium">For life-threatening situations, immediate professional medical help is required.</p>
                <a href="tel:112" className="flex items-center justify-center bg-red-600 py-5 rounded-2xl font-black text-3xl hover:bg-red-700 transition-all shadow-xl shadow-red-900/40">
                  <Phone className="mr-3 w-8 h-8" /> 112
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center max-w-4xl mx-auto mb-16 pt-8">
            <h1 className="text-6xl font-black text-slate-900 mb-8 tracking-tight">Digital First Aid <span className="text-blue-600">Assistant</span></h1>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Search medical topics, symptoms or instructions..."
                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs">
              {filteredScenarios.length} Knowledge Base Matches
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {filteredScenarios.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredScenarios.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => setSelectedScenario(s)} 
                      className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all group"
                    >
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform bg-slate-50 p-6 rounded-3xl group-hover:bg-blue-50 inline-block shadow-sm">
                        {s.icon}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{s.title[lang]}</h3>
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{s.category[lang]}</p>
                      <div className="mt-8 flex items-center text-blue-600 font-black">
                        View Instructions <ChevronRight className="ml-2 w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-200 text-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Bot className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">No Local Matches for "{searchQuery}"</h2>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
                    We couldn't find this topic in our offline guides. Would you like our AI Medical Assistant to generate instructions for you?
                  </p>
                  <button 
                    onClick={fetchAiGuidance}
                    disabled={loadingAiFirstAid}
                    className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {loadingAiFirstAid ? (
                      <Loader2 className="animate-spin w-6 h-6 mr-3" />
                    ) : (
                      <Sparkles className="w-6 h-6 mr-3" />
                    )}
                    Generate AI First Aid
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
                  <MapPin className="mr-3 text-red-500" /> {t('nearbyHelp')}
                </h2>

                <div className="mb-6 space-y-2 relative" ref={locRef}>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Location Context</label>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="City or medical hub..." 
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      onFocus={() => locSuggestions.length > 0 && setShowLocSuggestions(true)}
                    />
                    {loadingLocSuggestions ? (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin w-4 h-4" />
                    ) : manualLocation && (
                      <button onClick={() => setManualLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {showLocSuggestions && locSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden">
                      {locSuggestions.map((loc, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setManualLocation(loc); setShowLocSuggestions(false); }}
                          className="w-full text-left p-4 hover:bg-blue-50 text-sm font-bold text-slate-700 flex items-center group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-3 group-hover:text-blue-500" />
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <button 
                    onClick={() => findNearby('pharmacy')} 
                    className={`w-full p-6 rounded-3xl flex items-center justify-between font-black text-lg transition-all border-2 ${
                      nearbyType === 'pharmacy' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-xl mr-4 shadow-sm text-xl">💊</div>
                      {t('pharmacies')}
                    </div>
                    {loadingNearby && nearbyType === 'pharmacy' ? <Loader2 className="animate-spin w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => findNearby('doctor')} 
                    className={`w-full p-6 rounded-3xl flex items-center justify-between font-black text-lg transition-all border-2 ${
                      nearbyType === 'doctor' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-xl mr-4 shadow-sm text-xl">👨‍⚕️</div>
                      {t('doctors')}
                    </div>
                    {loadingNearby && nearbyType === 'doctor' ? <Loader2 className="animate-spin w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>

                {nearbyType && !loadingNearby && nearbyResults.text && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl mb-4">
                      <button 
                        onClick={() => setShowAiDetail(!showAiDetail)}
                        className="w-full p-5 flex items-center justify-between text-blue-400 font-black uppercase tracking-widest text-[10px] border-b border-white/10"
                      >
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" /> Local Specialist Details
                        </div>
                        {showAiDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {showAiDetail && (
                        <div className="p-6 text-sm text-white leading-relaxed font-sans">
                          {nearbyResults.text}
                        </div>
                      )}
                    </div>
                    
                    {nearbyResults.chunks && nearbyResults.chunks.length > 0 && (
                      <div className="space-y-4">
                        {nearbyResults.chunks.map((chunk, i) => chunk.maps && (
                          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <p className="font-black text-slate-900 mb-4">{chunk.maps.title}</p>
                            <a 
                              href={chunk.maps.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs"
                            >
                              <LocateFixed className="w-4 h-4 mr-2" /> Navigate
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstAid;