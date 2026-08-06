import React from 'react';
import { Sparkles, Database, PlusCircle, RefreshCw, Trash2, Home, LayoutDashboard, Globe } from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';

export default function Navbar({ 
  onOpenAddModal, 
  onSeedData, 
  onClearData, 
  isPostgresConnected, 
  loading,
  currentCurrency,
  onCurrencyChange,
  activeView,
  onViewChange,
  onOpenAuthModal,
  user,
  onLogout
}) {
  return (
    <header className="bg-white border-b border-purple-100 sticky top-0 z-50 px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('landing')}>
          <div className="w-10 h-10 rounded-xl bg-[#7e22ce] text-white flex items-center justify-center shadow-md shadow-purple-200">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                Smart Expense Tracker
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Free AI-Powered Expense & Cashflow Tracker
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Matching smartexpenseai.com) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button onClick={() => onViewChange('landing')} className={`hover:text-[#7e22ce] transition-colors ${activeView === 'landing' ? 'text-[#7e22ce] font-bold' : ''}`}>
            Features
          </button>
          <button onClick={() => onViewChange('landing')} className="hover:text-[#7e22ce] transition-colors">
            Blog
          </button>
          <button onClick={() => onViewChange('landing')} className="hover:text-[#7e22ce] transition-colors">
            Pricing
          </button>
          <button onClick={() => onViewChange('landing')} className="hover:text-[#7e22ce] transition-colors">
            About
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-xs">
            <button
              onClick={() => onViewChange('landing')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'landing' 
                  ? 'bg-white text-[#7e22ce] shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home size={13} /> Landing
            </button>

            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'dashboard' 
                  ? 'bg-[#7e22ce] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={13} /> App Dashboard
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100/70 px-2.5 py-1.5 rounded-xl border border-purple-200 text-xs text-purple-900 font-semibold transition-colors">
            <Globe className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <select
              value={currentCurrency ? currentCurrency.code : 'USD'}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              className="bg-transparent border-none outline-none text-xs font-bold cursor-pointer text-purple-900"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#ffffff', color: '#1e1b4b' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={onLogout}
              className="border border-purple-300 text-[#7e22ce] hover:bg-purple-50 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
            >
              Sign Out ({user.name})
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="border border-[#7e22ce] text-[#7e22ce] hover:bg-purple-50 font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Sign In
            </button>
          )}

          {/* Dashboard specific buttons */}
          {activeView === 'dashboard' && (
            <button
              onClick={onOpenAddModal}
              className="bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-200 transition-all"
            >
              <PlusCircle size={14} /> Add Transaction
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
