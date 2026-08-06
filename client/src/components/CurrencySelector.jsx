import React from 'react';
import { Globe } from 'lucide-react';
import { CURRENCIES, formatCurrency } from '../utils/currencies';
export { formatCurrency };

export default function CurrencySelector({ currentCurrency = { code: 'USD', name: 'USD ($)', symbol: '$' }, onCurrencyChange }) {
  const selectedCode = currentCurrency && currentCurrency.code ? currentCurrency.code : 'USD';
  return (
    <div className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 text-xs transition-colors">
      <Globe className="w-3.5 h-3.5 text-purple-700 shrink-0" />
      <select
        value={selectedCode}
        onChange={(e) => {
          const selected = CURRENCIES.find(c => c.code === e.target.value);
          if (selected && onCurrencyChange) onCurrencyChange(selected);
        }}
        className="bg-transparent text-purple-900 font-bold outline-none cursor-pointer text-xs"
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
