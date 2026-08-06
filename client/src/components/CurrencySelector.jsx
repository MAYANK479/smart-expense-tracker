import React from 'react';
import { Globe } from 'lucide-react';
import { CURRENCIES, formatCurrency } from '../utils/currencies';
export { formatCurrency };

export default function CurrencySelector({ currentCurrency, onCurrencyChange }) {
  return (
    <div className="flex items-center gap-1.5 bg-purple-950/40 hover:bg-purple-900/50 px-3 py-1.5 rounded-xl border border-purple-500/30 text-xs transition-colors">
      <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
      <select
        value={currentCurrency.code}
        onChange={(e) => {
          const selected = CURRENCIES.find(c => c.code === e.target.value);
          if (selected) onCurrencyChange(selected);
        }}
        className="bg-transparent text-purple-100 font-semibold outline-none cursor-pointer text-xs"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code} style={{ background: '#0A0614', color: '#fff' }}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
