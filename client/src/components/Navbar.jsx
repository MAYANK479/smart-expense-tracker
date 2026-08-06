import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, PlusCircle, Home, LayoutDashboard, Globe, Menu, X, 
  LogOut, User, Target, FileSpreadsheet, RefreshCw 
} from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { CURRENCIES } from '../utils/currencies';

export default function Navbar({ 
  onOpenAddModal, 
  onSeedData, 
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="sticky top-3 z-50 px-4 max-w-7xl mx-auto w-full pointer-events-none"
    >
      <nav className="pointer-events-auto bg-slate-950/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl px-5 py-3 shadow-2xl shadow-purple-950/20 flex items-center justify-between transition-all">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { onViewChange('landing'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg text-white tracking-tight group-hover:text-purple-300 transition-colors">
                Smart Expense AI
              </h1>
              <Badge variant="purple" size="sm">
                v3.0
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Free Autonomous AI Financial Tracker
            </p>
          </div>
        </div>

        {/* Center Navigation View Switcher Pill */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 relative">
          <button
            onClick={() => onViewChange('landing')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold relative z-10 flex items-center gap-1.5 transition-colors ${
              activeView === 'landing' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeView === 'landing' && (
              <motion.div 
                layoutId="activePill"
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Home size={13} /> Landing Page
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold relative z-10 flex items-center gap-1.5 transition-colors ${
              activeView === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeView === 'dashboard' && (
              <motion.div 
                layoutId="activePill"
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <LayoutDashboard size={13} /> App Dashboard
          </button>
        </div>

        {/* Right Desktop Controls */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Currency Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs">
            <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={currentCurrency ? currentCurrency.code : 'USD'}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              className="bg-transparent text-slate-200 font-semibold outline-none cursor-pointer text-xs"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Auth or Sign In */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-200 font-semibold">{user.name}</span>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 ml-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenAuthModal}
            >
              Sign In
            </Button>
          )}

          {/* Add Transaction Button */}
          {activeView === 'dashboard' && (
            <Button
              size="sm"
              variant="primary"
              onClick={onOpenAddModal}
              icon={PlusCircle}
            >
              Add Entry
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="pointer-events-auto mt-2 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 lg:hidden"
          >
            <div className="flex justify-around bg-slate-900 p-1 rounded-xl text-xs">
              <button
                onClick={() => { onViewChange('landing'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
                  activeView === 'landing' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                <Home size={14} /> Landing
              </button>
              <button
                onClick={() => { onViewChange('dashboard'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
                  activeView === 'dashboard' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                <LayoutDashboard size={14} /> Dashboard
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Global Currency:</span>
              <select
                value={currentCurrency ? currentCurrency.code : 'USD'}
                onChange={(e) => {
                  const found = CURRENCIES.find(c => c.code === e.target.value);
                  if (found) onCurrencyChange(found);
                }}
                className="bg-slate-800 text-purple-300 font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none text-xs"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {activeView === 'dashboard' && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => { onOpenAddModal(); setMobileMenuOpen(false); }}
                icon={PlusCircle}
              >
                Add Transaction
              </Button>
            )}

            {!user ? (
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
              >
                Sign In / Register
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                className="w-full text-rose-400"
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                icon={LogOut}
              >
                Sign Out ({user.name})
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
