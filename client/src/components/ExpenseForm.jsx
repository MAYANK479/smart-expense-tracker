import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Health & Fitness',
  'Housing',
  'Services & Tech',
  'Miscellaneous'
];

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Apple Pay',
  'Bank Transfer'
];

export default function ExpenseForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Credit Card',
    notes: '',
    tags: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? initialData.amount : '',
        category: initialData.category || 'Food & Dining',
        date: initialData.date || new Date().toISOString().split('T')[0],
        payment_method: initialData.payment_method || 'Credit Card',
        notes: initialData.notes || '',
        tags: initialData.tags || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Credit Card',
        notes: '',
        tags: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter an expense title.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid expense amount greater than 0.');
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '520px',
        background: '#0F172A',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#6366F1" />
            {initialData ? 'Edit Expense Entry' : 'Manual Expense Entry'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fda4af',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">Expense Title / Merchant *</label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. Whole Foods Market, Netflix, Uber"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Amount ($) *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Date *</label>
              <input 
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Category & Payment Method Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Category *</label>
              <select 
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#0F172A', color: '#fff' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Payment Method</label>
              <select 
                className="input-field"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm} style={{ background: '#0F172A', color: '#fff' }}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">Notes / Description (Optional)</label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. Weekly family dinner, Project subscription"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label">Tags (Comma separated)</label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. essential, recurring, work, leisure"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="glow-btn glow-btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="glow-btn"
            >
              <CheckCircle size={16} />
              {initialData ? 'Save Changes' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
