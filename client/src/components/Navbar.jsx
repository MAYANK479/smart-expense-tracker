import React from 'react';
import { Sparkles, PlusCircle, Home, LayoutDashboard, Globe } from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';

export default function Navbar({ 
  onOpenAddModal, 
  currentCurrency,
  onCurrencyChange,
  activeView,
  onViewChange,
  onOpenAuthModal,
  user,
  onLogout
}) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e9d5ff',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
      boxShadow: '0 1px 4px rgba(126, 34, 206, 0.06)'
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
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onViewChange('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#7e22ce',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(126, 34, 206, 0.25)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Smart Expense Tracker
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              Free AI-Powered Expense & Cashflow Tracker
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Matching smartexpenseai.com) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <button 
            onClick={() => onViewChange('landing')}
            style={{
              background: 'none',
              border: 'none',
              color: activeView === 'landing' ? '#7e22ce' : '#475569',
              fontWeight: activeView === 'landing' ? 700 : 600,
              cursor: 'pointer'
            }}
          >
            Features
          </button>
          <button 
            onClick={() => onViewChange('landing')}
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
          >
            Blog
          </button>
          <button 
            onClick={() => onViewChange('landing')}
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
          >
            Pricing
          </button>
          <button 
            onClick={() => onViewChange('landing')}
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
          >
            About
          </button>
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* View Toggle */}
          <div style={{
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '12px',
            display: 'flex',
            gap: '4px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => onViewChange('landing')}
              style={{
                background: activeView === 'landing' ? '#ffffff' : 'transparent',
                color: activeView === 'landing' ? '#7e22ce' : '#475569',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeView === 'landing' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Home size={13} /> Landing
            </button>

            <button
              onClick={() => onViewChange('dashboard')}
              style={{
                background: activeView === 'dashboard' ? '#7e22ce' : 'transparent',
                color: activeView === 'dashboard' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeView === 'dashboard' ? '0 2px 6px rgba(126,34,206,0.3)' : 'none'
              }}
            >
              <LayoutDashboard size={13} /> App Dashboard
            </button>
          </div>

          {/* Currency Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f3e8ff',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid #e9d5ff'
          }}>
            <Globe size={14} color="#7e22ce" />
            <select
              value={currentCurrency ? currentCurrency.code : 'USD'}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#6b21a8',
                cursor: 'pointer'
              }}
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
              style={{
                background: '#ffffff',
                border: '1px solid #e9d5ff',
                color: '#7e22ce',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '7px 14px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Sign Out ({user.name})
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                background: '#ffffff',
                border: '1.5px solid #7e22ce',
                color: '#7e22ce',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '7px 16px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          )}

          {/* Dashboard Add Transaction Button */}
          {activeView === 'dashboard' && (
            <button
              onClick={onOpenAddModal}
              style={{
                background: '#7e22ce',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '7px 16px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(126, 34, 206, 0.3)'
              }}
            >
              <PlusCircle size={14} /> Add Transaction
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
