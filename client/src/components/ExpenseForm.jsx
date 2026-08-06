import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle, Camera, Sparkles, Loader2, AlertCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import { api } from '../services/api';

const EXPENSE_CATEGORIES = [
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

const INCOME_CATEGORIES = [
  'Salary & Earnings',
  'Freelance & Business',
  'Investments & Dividends',
  'Gifts & Allowances',
  'Other Income'
];

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Apple Pay',
  'Bank Transfer'
];

export default function ExpenseForm({ isOpen, onClose, onSubmit, initialData = null, currencySymbol = '$' }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Credit Card',
    notes: '',
    tags: ''
  });

  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? initialData.amount : '',
        category: initialData.category || (initialData.type === 'income' ? 'Salary & Earnings' : 'Food & Dining'),
        date: initialData.date || new Date().toISOString().split('T')[0],
        payment_method: initialData.payment_method || 'Credit Card',
        notes: initialData.notes || '',
        tags: initialData.tags || ''
      });
    } else {
      setFormData({
        type: 'expense',
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
    setScanMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const currentCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    }));
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setError('');
    setScanMessage('Analyzing receipt with AI Vision...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result;
        const res = await api.scanReceipt(base64, file.type);
        setScanning(false);

        if (res.data) {
          const { title, amount, category, date, payment_method, notes, extractionReasoning } = res.data;
          setFormData(prev => ({
            ...prev,
            type: 'expense',
            title: title || prev.title,
            amount: amount ? amount.toString() : prev.amount,
            category: EXPENSE_CATEGORIES.includes(category) ? category : prev.category,
            date: date || prev.date,
            payment_method: PAYMENT_METHODS.includes(payment_method) ? payment_method : prev.payment_method,
            notes: notes || extractionReasoning || 'Scanned via AI Vision'
          }));
          setScanMessage(`✨ Successfully extracted: ${title} (${currencySymbol}${amount})`);
        }
      } catch (err) {
        setScanning(false);
        setError(err.message || 'Failed to scan receipt image.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a title / merchant name.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid positive amount.');
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
        maxWidth: '540px',
        background: '#0F172A',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#6366F1" />
            {initialData ? 'Edit Transaction Entry' : 'Log New Transaction'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* TYPE TOGGLE: EXPENSE VS INCOME */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              formData.type === 'expense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Expense (Outflow)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              formData.type === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Income (Inflow)</span>
          </button>
        </div>

        {/* AI RECEIPT OCR SCANNER DROPZONE (for expenses) */}
        {!initialData && formData.type === 'expense' && (
          <div className="mb-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-indigo-200">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-100 flex items-center gap-1">
                  Scan Receipt Image <Sparkles className="w-3 h-3 text-indigo-400" />
                </span>
                <p className="text-[11px] text-slate-400">Upload a photo to auto-fill merchant, price, date & category</p>
              </div>
            </div>
            <label className="btn btn-secondary text-xs py-1.5 px-3 cursor-pointer shrink-0 flex items-center gap-1.5">
              {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              <span>{scanning ? 'Scanning...' : 'Scan Image'}</span>
              <input type="file" accept="image/*" onChange={handleReceiptUpload} disabled={scanning} className="hidden" />
            </label>
          </div>
        )}

        {scanMessage && (
          <div className="alert-banner alert-banner-success text-xs mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-banner-danger text-xs mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">{formData.type === 'income' ? 'Income Source / Title *' : 'Expense Title / Merchant *'}</label>
            <input 
              type="text"
              className="input-field"
              placeholder={formData.type === 'income' ? 'e.g. Monthly Salary, Freelance Client, Dividend' : 'e.g. Whole Foods Market, Netflix, Uber'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Amount ({currencySymbol}) *</label>
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
                {currentCategories.map(cat => (
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
              placeholder="e.g. Payroll direct deposit, Family groceries"
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
              {initialData ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
