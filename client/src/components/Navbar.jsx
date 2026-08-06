import React from 'react';
import { Wallet, Sparkles, Database, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onSeedData, onClearData, isPostgresConnected, loading }) {
  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 24px'
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
                <Sparkles size={12} /> Insights v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Intelligent Expense Tracker & Pattern Analytics
            </p>
          </div>
        </div>

        {/* Database Status & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className={`badge ${isPostgresConnected ? 'badge-emerald' : 'badge-amber'}`} style={{ padding: '6px 12px' }}>
            <Database size={13} />
            {isPostgresConnected ? 'PostgreSQL Active' : 'Postgres Dialect / Local DB'}
          </div>

          <button 
            onClick={onSeedData}
            disabled={loading}
            className="glow-btn glow-btn-secondary"
            title="Populate sample expenses to quickly evaluate AI insights"
          >
            <RefreshCw size={15} className={loading ? 'pulse-glow' : ''} />
            Seed Sample Data
          </button>

          <button 
            onClick={onClearData}
            disabled={loading}
            className="glow-btn glow-btn-secondary"
            style={{ color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.2)' }}
            title="Reset all expense records"
          >
            <Trash2 size={15} />
            Clear
          </button>

          <button 
            onClick={onOpenAddModal}
            className="glow-btn"
          >
            <PlusCircle size={16} />
            Add Expense Entry
          </button>
        </div>
      </div>
    </header>
  );
}
