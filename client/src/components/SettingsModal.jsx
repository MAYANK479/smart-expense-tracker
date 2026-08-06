import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings, User, Globe, Key, Bell, Sun, Moon, 
  Download, Trash2, CheckCircle2, ShieldCheck, Sparkles 
} from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Card from './ui/Card';
import { CURRENCIES } from '../utils/currencies';

export default function SettingsModal({
  isOpen,
  onClose,
  user,
  currentCurrency,
  onCurrencyChange,
  onClearData
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'notifications' | 'data'
  const [themeMode, setThemeMode] = useState(() => {
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  });

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('custom_gemini_key') || '');
  const [savedSuccess, setSavedSuccess] = useState('');

  if (!isOpen) return null;

  const toggleTheme = (mode) => {
    setThemeMode(mode);
    if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('custom_gemini_key', apiKey);
    } else {
      localStorage.removeItem('custom_gemini_key');
    }
    setSavedSuccess('Settings & API preferences saved successfully!');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General & Theme', icon: Globe },
    { id: 'security', label: 'API Keys & Security', icon: Key },
    { id: 'notifications', label: 'Alerts & Limits', icon: Bell },
    { id: 'data', label: 'Data Export & Reset', icon: Download },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Settings & Preferences</h3>
                <p className="text-xs text-slate-400">Configure global currency, theme modes, and API connections</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Tabs Navigation */}
          <div className="flex gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all relative ${
                    isActive ? 'text-white bg-purple-600 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {savedSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{savedSuccess}</span>
            </div>
          )}

          {/* TAB 1: GENERAL & THEME */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300 uppercase tracking-wider">Appearance Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTheme('dark')}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      themeMode === 'dark'
                        ? 'bg-purple-950/40 border-purple-500 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span>Dark Mode (Primary)</span>
                    </div>
                    {themeMode === 'dark' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleTheme('light')}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      themeMode === 'light'
                        ? 'bg-purple-950/40 border-purple-500 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light Mode</span>
                    </div>
                    {themeMode === 'light' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-300 uppercase tracking-wider">Global Display Currency</label>
                <select
                  value={currentCurrency ? currentCurrency.code : 'USD'}
                  onChange={(e) => {
                    const found = CURRENCIES.find(c => c.code === e.target.value);
                    if (found) onCurrencyChange(found);
                  }}
                  className="input-primary"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code} style={{ background: '#0F172A', color: '#fff' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-slate-500 text-[11px]">All financial metrics, charts, and budget limits will format using this symbol.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" type="submit">
                  Save General Settings
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & API KEYS */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Key className="w-4 h-4" />
                  <span>Custom Gemini / Groq AI API Key (Optional)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  By default, Smart Expense AI utilizes the built-in system multi-provider fallback engine. You may optionally supply a custom key.
                </p>
                <Input
                  type="password"
                  placeholder="e.g. gsk_... or AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" type="submit">
                  Save API Configuration
                </Button>
              </div>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS & ALERTS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Category Overspend Alerts</h4>
                  <p className="text-slate-400 text-[11px]">Show warning banner when spending reaches 80%+ of category monthly target</p>
                </div>
                <Badge variant="emerald" size="sm">Enabled</Badge>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">High Outlier Anomaly Detection</h4>
                  <p className="text-slate-400 text-[11px]">Automatically flag single large purchases exceeding category averages</p>
                </div>
                <Badge variant="emerald" size="sm">Enabled</Badge>
              </div>
            </div>
          )}

          {/* TAB 4: DATA EXPORT & RESET */}
          {activeTab === 'data' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Clear All Transaction Records</h4>
                  <p className="text-slate-400 text-[11px]">Reset all manual & imported expense entries from your session</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => { onClearData(); onClose(); }}
                  icon={Trash2}
                >
                  Clear Data
                </Button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
