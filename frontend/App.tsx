import React, { useState, useEffect, createContext, useContext } from "react";
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  Menu,
  X,
  PhoneCall,
  Globe,
  AlertTriangle
} from "lucide-react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FirstAid from "./pages/FirstAid";
import HealthTracker from "./pages/HealthTracker";
import Auth from "./pages/Auth";
import ChatBot from "./components/ChatBot";

import { AuthState, Language } from "./types";
import { translations } from "./translations";

/* ================= LANGUAGE CONTEXT ================= */

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k
});

export const useLanguage = () => useContext(LanguageContext);

/* ================= SOS OVERLAY ================= */

const SOSOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useLanguage();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      () => console.error("Location permission denied")
    );
  }, []);

  return (
    <div className="fixed inset-0 bg-red-600 z-[999] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-white/20 p-8 rounded-full mb-8 animate-pulse">
        <AlertTriangle className="w-24 h-24" />
      </div>

      <h1 className="text-5xl font-black mb-4">{t("sosTitle")}</h1>
      <p className="text-xl mb-10 opacity-90">{t("sosInstruction")}</p>

      <a
        href="tel:112"
        className="bg-white text-red-600 px-12 py-6 rounded-3xl text-4xl font-black shadow-2xl mb-10 flex items-center"
      >
        <PhoneCall className="mr-4 w-10 h-10" /> 112
      </a>

      {coords && (
        <div className="bg-black/20 p-5 rounded-2xl mb-6">
          <p className="text-xs uppercase font-bold opacity-70 mb-1">
            {t("sosLocation")}
          </p>
          <p className="text-lg font-mono">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        </div>
      )}

      <button onClick={onClose} className="text-white/70 hover:text-white">
        {t("cancel")}
      </button>
    </div>
  );
};

/* ================= APP ================= */

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("mycare_lang") as Language) || "en"
  );

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem("mycare_auth");
    return saved
      ? JSON.parse(saved)
      : { user: null, isAuthenticated: false };
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    localStorage.setItem("mycare_auth", JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("mycare_lang", lang);
  }, [lang]);

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setMenuOpen(false);
  };

  const t = (key: string) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <Router>
        {showSOS && <SOSOverlay onClose={() => setShowSOS(false)} />}

        <div className="min-h-screen flex flex-col">
          {/* ================= NAVBAR ================= */}
          <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">
                  Digital First Aid Assistance
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link to="/">{t("home")}</Link>
                <Link to="/first-aid">{t("firstAid")}</Link>

                {auth.isAuthenticated && (
                  <Link to="/tracker">{t("tracker")}</Link>
                )}

                <button
                  onClick={() => setShowSOS(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
                >
                  {t("sosTrigger")}
                </button>

                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="bn">বাংলা</option>
                  <option value="te">తెలుగు</option>
                  <option value="mr">मराठी</option>
                  <option value="ta">தமிழ்</option>
                </select>

                {auth.isAuthenticated ? (
                  <button onClick={logout}>
                    <LogOut className="w-5 h-5 text-red-500" />
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full"
                  >
                    {t("signIn")}
                  </Link>
                )}
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center space-x-3">
                <button
                  onClick={() => setShowSOS(true)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  SOS
                </button>
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>

            {menuOpen && (
              <div className="md:hidden px-4 py-4 space-y-3 border-t">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  {t("home")}
                </Link>
                <Link to="/first-aid" onClick={() => setMenuOpen(false)}>
                  {t("firstAid")}
                </Link>

                {auth.isAuthenticated ? (
                  <>
                    <Link to="/dashboard">{t("dashboard")}</Link>
                    <Link to="/tracker">{t("tracker")}</Link>
                    <button onClick={logout} className="text-red-600">
                      {t("signOut")}
                    </button>
                  </>
                ) : (
                  <Link to="/auth">{t("signIn")}</Link>
                )}

                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Language)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="bn">বাংলা</option>
                    <option value="te">తెలుగు</option>
                    <option value="mr">मराठी</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>
              </div>
            )}
          </nav>

          {/* ================= ROUTES ================= */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/auth" element={<Auth setAuth={setAuth} />} />

              <Route
                path="/dashboard"
                element={
                  auth.isAuthenticated ? (
                    <Dashboard
                      user={auth.user!}
                      setUser={(u) =>
                        setAuth((p) => ({ ...p, user: u }))
                      }
                    />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />

              <Route
                path="/tracker"
                element={
                  auth.isAuthenticated ? (
                    <HealthTracker user={auth.user!} />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
            </Routes>
          </main>

          <ChatBot />

          {/* ================= FOOTER ================= */}
          <footer className="bg-slate-900 text-slate-400 py-10 text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Heart className="w-6 h-6 text-blue-500" />
              <span className="text-white font-bold">
                Digital First Aid Assistance
              </span>
            </div>
            <p>© {new Date().getFullYear()} • Emergency: 112</p>
          </footer>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
