import React from 'react';
import { DollarSign, TrendingUp, Tag, ShieldCheck, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

export default function SummaryCards({ summary = {}, healthScore = null, currentCurrency }) {
  const totalSpent = summary.totalSpent || 0;
  const totalEntries = summary.totalEntries || 0;
  const avgExpense = summary.avgExpense || 0;

  // Find top category
  let topCategoryName = 'None';
  let topCategoryAmount = 0;
  if (summary.byCategory) {
    Object.entries(summary.byCategory).forEach(([cat, val]) => {
      if (val > topCategoryAmount) {
        topCategoryAmount = val;
        topCategoryName = cat;
      }
    });
  }

  const cards = [
    {
      title: 'Total Outlay',
      value: formatCurrency(totalSpent, currentCurrency),
      subtitle: `${totalEntries} entries recorded`,
      icon: DollarSign,
      color: '#9333EA',
      bgGradient: 'radial-gradient(circle at top right, rgba(147, 51, 234, 0.2), transparent 70%)'
    },
    {
      title: 'Average Expense',
      value: formatCurrency(avgExpense, currentCurrency),
      subtitle: 'Per transaction average',
      icon: TrendingUp,
      color: '#10B981',
      bgGradient: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.2), transparent 70%)'
    },
    {
      title: 'Top Category',
      value: topCategoryName,
      subtitle: topCategoryAmount > 0 ? `${formatCurrency(topCategoryAmount, currentCurrency)} spent` : 'No data',
      icon: Tag,
      color: '#C084FC',
      bgGradient: 'radial-gradient(circle at top right, rgba(192, 132, 252, 0.2), transparent 70%)'
    },
    {
      title: 'AI Health Score',
      value: healthScore !== null ? `${healthScore} / 100` : 'Pending AI Analysis',
      subtitle: healthScore !== null ? (healthScore > 75 ? 'Good spending balance' : 'Optimization suggested') : 'Click Analyze with AI below',
      icon: ShieldCheck,
      color: healthScore > 75 ? '#10B981' : healthScore !== null ? '#F59E0B' : '#06B6D4',
      bgGradient: 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.2), transparent 70%)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index}
            className="glass-card animate-fade-in"
            style={{
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              background: `var(--bg-card), ${card.bgGradient}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${card.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}>
                <Icon size={18} />
              </div>
            </div>
            
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: '#ffffff',
              marginBottom: '4px'
            }}>
              {card.value}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
