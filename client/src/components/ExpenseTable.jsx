import React, { useState } from 'react';
import { 
  Search, ArrowUpDown, Edit3, Trash2, Calendar, CreditCard, Download
} from 'lucide-react';

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
  'Miscellaneous'
];

export default function ExpenseTable({ expenses = [], onEdit, onDelete, selectedCategory, onCategoryChange, search, onSearchChange }) {
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

  const exportToCSV = () => {
    if (sortedExpenses.length === 0) return;
    const headers = ['Date', 'Title / Merchant', 'Category', 'Amount', 'Payment Method', 'Notes', 'Tags'];
    const csvRows = [headers.join(',')];

    sortedExpenses.forEach(exp => {
      const row = [
        `"${exp.date || ''}"`,
        `"${(exp.title || '').replace(/"/g, '""')}"`,
        `"${exp.category || ''}"`,
        parseFloat(exp.amount || 0).toFixed(2),
        `"${exp.payment_method || 'Card'}"`,
        `"${(exp.notes || '').replace(/"/g, '""')}"`,
        `"${(exp.tags || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expense_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
      {/* Table Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#ffffff' }}>
            Expense Transactions Log
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {sortedExpenses.length} manual & imported entries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            disabled={sortedExpenses.length === 0}
            className="glow-btn glow-btn-secondary text-xs"
            title="Download CSV report"
          >
            <Download size={14} />
            Export CSV
          </button>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '180px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="input-field"
              style={{ paddingLeft: '34px' }}
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div style={{ position: 'relative' }}>
            <select 
              className="input-field"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              style={{ paddingRight: '28px', cursor: 'pointer' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} style={{ background: '#0F172A', color: '#fff' }}>
                  {cat === 'All' ? 'Filter: All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {sortedExpenses.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No expense entries found matching your filter criteria.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <button onClick={() => toggleSort('title')} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Title & Description <ArrowUpDown size={13} />
                  </button>
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <button onClick={() => toggleSort('category')} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Category <ArrowUpDown size={13} />
                  </button>
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <button onClick={() => toggleSort('date')} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Date <ArrowUpDown size={13} />
                  </button>
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Payment Method</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>
                  <button onClick={() => toggleSort('amount')} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                    Amount ($) <ArrowUpDown size={13} />
                  </button>
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((exp) => (
                <tr 
                  key={exp.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Title & Notes */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{exp.title}</div>
                    {exp.notes && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {exp.notes}
                      </div>
                    )}
                    {exp.tags && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {exp.tags.split(',').map((t, i) => (
                          <span key={i} style={{ fontSize: '0.68rem', color: '#a5b4fc', background: 'rgba(99,102,241,0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-indigo">
                      {exp.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      {exp.date}
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CreditCard size={13} color="var(--text-muted)" />
                      {exp.payment_method || 'Card'}
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    ${parseFloat(exp.amount).toFixed(2)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => onEdit(exp)}
                        style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', padding: '4px' }}
                        title="Edit Entry"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        onClick={() => onDelete(exp.id)}
                        style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer', padding: '4px' }}
                        title="Delete Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
