import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function CSVImportModal({ isOpen, onClose, onImportSuccess }) {
  const [parsedRows, setParsedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);

        if (lines.length < 2) {
          throw new Error('CSV file must contain a header row and at least one data row.');
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
        
        // Match header column indexes
        const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('desc') || h.includes('merchant') || h.includes('payee') || h.includes('name'));
        const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('cost') || h.includes('price') || h.includes('total'));
        const categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));
        const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));
        const paymentIdx = headers.findIndex(h => h.includes('payment') || h.includes('method') || h.includes('card'));

        const rows = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/['"]/g, ''));
          if (cols.length < 2) continue;

          const title = titleIdx !== -1 ? cols[titleIdx] : cols[0] || 'Bank Transaction';
          const amountStr = amountIdx !== -1 ? cols[amountIdx] : cols[1] || '0';
          const amount = Math.abs(parseFloat(amountStr.replace(/[^0-9.-]+/g, '')) || 0);

          if (amount > 0) {
            rows.push({
              title: title || 'Imported Expense',
              amount,
              category: categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : 'General',
              date: dateIdx !== -1 && cols[dateIdx] ? cols[dateIdx] : new Date().toISOString().split('T')[0],
              payment_method: paymentIdx !== -1 && cols[paymentIdx] ? cols[paymentIdx] : 'Bank Transfer',
              notes: 'Imported from CSV bank statement',
              tags: 'csv-import'
            });
          }
        }

        if (rows.length === 0) {
          throw new Error('Could not extract valid transaction amounts from CSV file.');
        }

        setParsedRows(rows);
      } catch (err) {
        setError(err.message || 'Failed to parse CSV file.');
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setError('');

    try {
      await api.bulkAddExpenses(parsedRows);
      setLoading(false);
      onImportSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to import CSV expenses.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-xl">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="modal-title">Import CSV Bank Statement</h3>
              <p className="text-xs text-slate-400">Upload bank statements or CSV logs to bulk import transactions</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="alert-banner alert-banner-danger text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {parsedRows.length === 0 ? (
          <div className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/50 transition-colors rounded-xl p-8 text-center bg-slate-900/40">
            <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3 opacity-80" />
            <p className="text-sm font-medium text-slate-200">Select a CSV file to upload</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Supports headers: Date, Title/Description, Amount, Category, Payment Method</p>
            <label className="btn btn-primary inline-flex items-center gap-2 text-xs py-2 px-4 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Choose CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span className="font-medium text-slate-200">{fileName}</span>
              </div>
              <span className="text-emerald-400 font-semibold">{parsedRows.length} transactions detected</span>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/90 text-slate-400 uppercase tracking-wider text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Category</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parsedRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-2 text-slate-400">{row.date}</td>
                      <td className="p-2 text-slate-200 font-medium">{row.title}</td>
                      <td className="p-2 text-slate-400">{row.category}</td>
                      <td className="p-2 text-right text-slate-100 font-semibold">${row.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 10 && (
                <p className="text-[11px] text-slate-500 text-center py-2 bg-slate-900/60">
                  ...and {parsedRows.length - 10} more entries
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setParsedRows([])}
                className="btn btn-secondary flex-1 py-2 text-xs"
              >
                Choose Different File
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="btn btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Importing...' : `Confirm & Import (${parsedRows.length})`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
