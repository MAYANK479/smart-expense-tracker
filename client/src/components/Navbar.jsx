import React from 'react';
import { Wallet, Sparkles, Database, PlusCircle, RefreshCw, Trash2, Home, LayoutDashboard } from 'lucide-react';
import CurrencySelector from './CurrencySelector';

export default function Navbar({ 
  onOpenAddModal, 
  onSeedData, 
  onClearData, 
  isPostgresConnected, 
  loading,
  currentCurrency,
  onCurrencyChange,
  activeView,
  onViewChange
}) {
  return (
    <header style={{
      background: 'rgba(10, 6, 20, 0.85)',
      backdropFilter: 'blur(18px)',
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
        gap: '14px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #5A008A, #9333EA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(147, 51, 234, 0.5)',
            cursor: 'pointer'
          }} onClick={() => onViewChange('landing')}>
            <Wallet size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                cursor: 'pointer'
              }} onClick={() => onViewChange('landing')}>
                Smart Expense AI
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> Multi-Currency
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              AI Expense Tracker & Financial Pattern Engine
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '3px',
            borderRadius: '10px',
            display: 'flex',
            gap: '2px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => onViewChange('landing')}
              style={{
                background: activeView === 'landing' ? 'var(--primary-purple)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Home size={14} /> Landing Page
            </button>

            <button
              onClick={() => onViewChange('dashboard')}
              style={{
                background: activeView === 'dashboard' ? 'var(--primary-purple)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={14} /> App Dashboard
            </button>
          </div>

          {/* Currency Switcher */}
          <CurrencySelector 
            currentCurrency={currentCurrency}
            onCurrencyChange={onCurrencyChange}
          />

          <div className={`badge ${isPostgresConnected ? 'badge-emerald' : 'badge-amber'}`} style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Database size={12} />
            {isPostgresConnected ? 'PostgreSQL' : 'Local DB'}
          </div>

          {activeView === 'dashboard' && (
            <>
              <button 
                onClick={onSeedData}
                disabled={loading}
                className="glow-btn glow-btn-secondary"
                title="Populate sample expenses to test AI insights"
              >
                <RefreshCw size={14} className={loading ? 'pulse-glow' : ''} />
                Seed Data
              </button>

              <button 
                onClick={onOpenAddModal}
                className="glow-btn"
              >
                <PlusCircle size={15} />
                Add Expense
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
