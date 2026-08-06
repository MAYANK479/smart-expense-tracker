import React from 'react';
import { Wallet, Sparkles, Database, PlusCircle, RefreshCw, Trash2, User, LogOut, Target, FileSpreadsheet, LogIn, Globe } from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';

export default function Navbar({
  user,
  currency,
  onCurrencyChange,
  onOpenAuthModal,
  onLogout,
  onOpenBudgetModal,
  onOpenCSVModal,
  onOpenAddModal,
  onSeedData,
  onClearData,
  isPostgresConnected,
  loading
}) {
  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Wallet size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                SmartExpense AI
              </h1>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={12} /> Global AI v3.0
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              AI Expense & Income Tracker • All Currencies Worldwide
            </p>
          </div>
        </div>

        {/* Database Status & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Multi-Currency Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              className="bg-transparent text-slate-200 border-none outline-none font-semibold text-xs cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#0F172A', color: '#fff' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`badge ${isPostgresConnected ? 'badge-emerald' : 'badge-amber'}`} style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Database size={13} />
            {isPostgresConnected ? 'PostgreSQL Active' : 'Postgres Dialect / Local DB'}
          </div>

          <button 
            onClick={onOpenBudgetModal}
            className="glow-btn glow-btn-secondary"
            title="Set category monthly targets and overspend alerts"
          >
            <Target size={15} />
            Budgets
          </button>

          <button 
            onClick={onOpenCSVModal}
            className="glow-btn glow-btn-secondary"
            title="Upload CSV bank statement"
          >
            <FileSpreadsheet size={15} />
            Import CSV
          </button>

          <button 
            onClick={onSeedData}
            disabled={loading}
            className="glow-btn glow-btn-secondary"
            title="Populate sample expenses to quickly evaluate AI insights"
          >
            <RefreshCw size={15} className={loading ? 'pulse-glow' : ''} />
            Seed Data
          </button>

          <button 
            onClick={onClearData}
            disabled={loading}
            className="glow-btn glow-btn-secondary"
            style={{ color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.2)' }}
            title="Reset expense records"
          >
            <Trash2 size={15} />
            Clear
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-200 font-medium">{user.name}</span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 ml-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="glow-btn glow-btn-secondary"
              style={{ color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}
            >
              <LogIn size={15} />
              Sign In
            </button>
          )}

          <button 
            onClick={onOpenAddModal}
            className="glow-btn"
          >
            <PlusCircle size={16} />
            Add Entry
          </button>
        </div>
      </div>
    </header>
  );
}
