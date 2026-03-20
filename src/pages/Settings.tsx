import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Settings as SettingsIcon, Bell, Moon, Shield, Volume2, LogOut, Paintbrush, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { signOut, profile } = useAuthStore();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32 pb-16 px-4 sm:px-6 w-full max-w-3xl mx-auto flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-display tracking-wide text-white flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-sky-400" />
            Preferences
          </h1>
          <p className="text-slate-400 font-sans text-sm">Manage your account settings and app experience.</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl"></div>
            
            <h2 className="text-base font-display text-sky-400 tracking-wider uppercase mb-6 flex items-center gap-2">
              <Paintbrush className="w-4 h-4" /> Appearance
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Cinematic Dark Mode</p>
                    <p className="text-xs text-slate-500">Enhanced deep-space visuals</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Visual Effects</p>
                    <p className="text-xs text-slate-500">Enable glows, grids, and animations</p>
                  </div>
                </div>
                <button disabled className="w-12 h-6 rounded-full bg-sky-500 opacity-50 cursor-not-allowed relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white translate-x-6"></div>
                </button>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <h2 className="text-base font-display text-sky-400 tracking-wider uppercase mb-6 flex items-center gap-2">
              <Bell className="w-4 h-4" /> App Experience
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Push Notifications</p>
                    <p className="text-xs text-slate-500">Session reminders and streak alerts</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Session Sound Effects</p>
                    <p className="text-xs text-slate-500">Audio feedback during practice</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${soundEffects ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </section>

          {/* Account & Privacy */}
          <section className="glass-panel p-6 rounded-2xl border border-red-900/30">
            <h2 className="text-base font-display text-red-400 tracking-wider uppercase mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Account Safety
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200 mb-1">Signed in as {profile?.email}</p>
                  <p className="text-xs text-slate-500">You are securely logged in.</p>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Settings;
