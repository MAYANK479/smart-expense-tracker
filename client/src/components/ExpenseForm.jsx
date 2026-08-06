import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, CheckCircle, Camera, Sparkles, Loader2, AlertCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
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
    setScanMessage('Analyzing receipt image with AI Vision...');

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
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-white">
                {initialData ? 'Edit Transaction Entry' : 'Log Transaction'}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TYPE TOGGLE: EXPENSE VS INCOME */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Income (Inflow)</span>
            </button>
          </div>

          {/* AI RECEIPT OCR SCANNER DROPZONE */}
          {!initialData && formData.type === 'expense' && (
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-100 flex items-center gap-1">
                    Scan Receipt Image <Sparkles className="w-3 h-3 text-purple-400" />
                  </span>
                  <p className="text-[11px] text-slate-400">Auto-fill merchant, price, date & category</p>
                </div>
              </div>
              <label className="btn-secondary text-xs py-1.5 px-3 cursor-pointer shrink-0 flex items-center gap-1.5">
                {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                <span>{scanning ? 'Scanning...' : 'Scan Image'}</span>
                <input type="file" accept="image/*" onChange={handleReceiptUpload} disabled={scanning} className="hidden" />
              </label>
            </div>
          )}

          {scanMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={formData.type === 'income' ? 'Income Title *' : 'Expense / Merchant *'}
              placeholder={formData.type === 'income' ? 'e.g. Monthly Salary, Freelance Client' : 'e.g. Whole Foods, Netflix, Uber'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={`Amount (${currencySymbol}) *`}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Category *</label>
                <select
                  className="input-primary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {currentCategories.map(cat => (
                    <option key={cat} value={cat} style={{ background: '#0F172A', color: '#fff' }}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Payment Method</label>
                <select
                  className="input-primary"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                >
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm} value={pm} style={{ background: '#0F172A', color: '#fff' }}>{pm}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Notes (Optional)"
              placeholder="e.g. Payroll direct deposit"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <Input
              label="Tags (Comma separated)"
              placeholder="e.g. essential, recurring, work"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={CheckCircle}>
                {initialData ? 'Save Changes' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
