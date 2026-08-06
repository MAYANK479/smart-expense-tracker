import React, { useState, useEffect } from 'react';
import { X, Target, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Utilities',
  'Transportation',
  'Health & Fitness',
  'Services & Tech',
  'Entertainment',
  'General'
];

export default function BudgetModal({ isOpen, onClose, onBudgetUpdated, currentBudgets = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const existing = currentBudgets.find(b => b.category === selectedCategory);
    if (existing) {
      setMonthlyLimit(existing.monthly_limit.toString());
    } else {
      setMonthlyLimit('');
    }
  }, [selectedCategory, currentBudgets]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await api.setBudget(selectedCategory, parseFloat(monthlyLimit));
      setLoading(false);
      setSuccessMsg(`Budget for ${selectedCategory} updated to $${parseFloat(monthlyLimit).toFixed(2)}`);
      onBudgetUpdated();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to save budget target');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="modal-title">Category Monthly Budgets</h3>
              <p className="text-xs text-slate-400">Set spend limits to receive overspend notifications & threshold alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button"><X className="w-5 h-5" /></button>
        </div>

        {successMsg && (
          <div className="alert-banner alert-banner-success text-xs mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-banner-danger text-xs mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Target Limit ($ / month)</label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              placeholder="e.g. 400.00"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Target Limit'}</span>
          </button>
        </form>

        <div className="mt-6 border-t border-slate-700/50 pt-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Active Budget Targets</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {currentBudgets.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-2">No budget targets set yet.</p>
            ) : (
              currentBudgets.map(b => (
                <div key={b.category} className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-lg text-xs">
                  <span className="font-medium text-slate-200">{b.category}</span>
                  <span className="font-semibold text-emerald-400">${parseFloat(b.monthly_limit).toFixed(2)} / mo</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
