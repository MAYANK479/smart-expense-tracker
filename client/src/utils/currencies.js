export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'USD ($)' },
  { code: 'EUR', symbol: '€', name: 'EUR (€)' },
  { code: 'GBP', symbol: '£', name: 'GBP (£)' },
  { code: 'INR', symbol: '₹', name: 'INR (₹)' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD (CA$)' },
  { code: 'NPR', symbol: 'Rs', name: 'NPR (Rs)' },
  { code: 'AUD', symbol: 'A$', name: 'AUD (A$)' },
  { code: 'JPY', symbol: '¥', name: 'JPY (¥)' }
];

export function formatCurrency(amount, currencySymbol = '$') {
  const num = parseFloat(amount) || 0;
  return `${currencySymbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
