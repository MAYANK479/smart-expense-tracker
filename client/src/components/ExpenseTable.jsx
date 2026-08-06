import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ArrowUpDown, Edit3, Trash2, Calendar, CreditCard, 
  Download, ArrowUpRight, TrendingDown, Filter, FileSpreadsheet 
} from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';
import { formatCurrency } from '../utils/currencies';

const CATEGORIES = [
  'All',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Health & Fitness',
  'Housing',
  'Services & Tech',
  'Salary & Earnings',
  'Freelance & Business',
  'Miscellaneous'
];

export default function ExpenseTable({ 
  expenses = [], 
  onEdit, 
  onDelete, 
  selectedCategory, 
  onCategoryChange, 
  search, 
  onSearchChange,
  currencySymbol = '$',
  currentCurrency = { code: 'USD', symbol: '$' }
}) {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'amount') {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
    if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    if (!sortedExpenses.length) return;
    const headers = ['ID', 'Type', 'Title', 'Category', 'Amount', 'Date', 'Payment Method', 'Notes', 'Tags'];
    const rows = sortedExpenses.map(e => [
      e.id,
      e.type || 'expense',
      `"${e.title || ''}"`,
      `"${e.category || ''}"`,
      e.amount,
      e.date,
      `"${e.payment_method || ''}"`,
      `"${e.notes || ''}"`,
      `"${e.tags || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_expense_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <Card padding="p-6" className="mb-8 space-y-6">
      
      {/* Table Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-400" />
            Financial Transaction History
          </h3>
          <p className="text-xs text-slate-400">
            Showing {sortedExpenses.length} transaction entries ({currentCurrency ? currentCurrency.code : 'USD'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              className="input-primary pl-10 text-xs"
              placeholder="Search title, merchant, notes..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="input-primary text-xs cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} style={{ background: '#0F172A', color: '#fff' }}>
                  {cat === 'All' ? 'Filter: All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={exportCSV}
            icon={Download}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Content */}
      {sortedExpenses.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          No transaction entries found matching your search or category filter.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">
                    <button onClick={() => toggleSort('title')} className="flex items-center gap-1 hover:text-white">
                      Title & Notes <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold">
                    <button onClick={() => toggleSort('category')} className="flex items-center gap-1 hover:text-white">
                      Category <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold">
                    <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-white">
                      Date <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold">Payment Method</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-white">
                      Amount ({currencySymbol}) <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedExpenses.map((exp) => {
                  const isIncome = exp.type === 'income';
                  return (
                    <motion.tr
                      key={exp.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      className="transition-colors"
                    >
                      {/* Title & Notes */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {isIncome ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span>{exp.title}</span>
                        </div>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{exp.notes}</p>
                        )}
                        {exp.tags && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {exp.tags.split(',').map((t, i) => (
                              <span key={i} className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <Badge variant={isIncome ? 'emerald' : 'purple'} size="sm">
                          {exp.category}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{exp.date}</span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                          <span>{exp.payment_method || 'Card'}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-4 text-right font-extrabold text-sm font-heading ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(exp.amount, currentCurrency)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(exp)}
                            className="p-1.5 text-purple-400 hover:text-purple-300 rounded-lg hover:bg-purple-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(exp.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List Fallback (< 768px) */}
          <div className="md:hidden space-y-3">
            {sortedExpenses.map((exp) => {
              const isIncome = exp.type === 'income';
              return (
                <div key={exp.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{exp.title}</span>
                    <span className={`font-extrabold font-heading text-sm ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(exp.amount, currentCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <Badge variant={isIncome ? 'emerald' : 'purple'} size="sm">
                      {exp.category}
                    </Badge>
                    <span>{exp.date}</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(exp)} icon={Edit3}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(exp.id)} icon={Trash2}>Delete</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </Card>
  );
}
