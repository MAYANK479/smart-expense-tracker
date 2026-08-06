import React from 'react';
import { DollarSign, Receipt, TrendingUp, Tag, ShieldCheck } from 'lucide-react';

export default function SummaryCards({ summary = {}, healthScore = null }) {
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
      title: 'Total Spending',
      value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${totalEntries} entries recorded`,
      icon: DollarSign,
      color: '#6366F1',
      bgGradient: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 70%)'
    },
    {
      title: 'Average Expense',
      value: `$${parseFloat(avgExpense).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Per transaction average',
      icon: TrendingUp,
      color: '#10B981',
      bgGradient: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%)'
    },
    {
      title: 'Top Category',
      value: topCategoryName,
      subtitle: topCategoryAmount > 0 ? `$${topCategoryAmount.toFixed(2)} spent` : 'No data',
      icon: Tag,
      color: '#8B5CF6',
      bgGradient: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 70%)'
    },
    {
      title: 'AI Health Score',
      value: healthScore !== null ? `${healthScore} / 100` : 'Pending AI Run',
      subtitle: healthScore !== null ? (healthScore > 75 ? 'Good spending balance' : 'Optimization suggested') : 'Click Analyze with AI below',
      icon: ShieldCheck,
      color: healthScore > 75 ? '#10B981' : healthScore !== null ? '#F59E0B' : '#06B6D4',
      bgGradient: 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.15), transparent 70%)'
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
                background: `${card.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}>
                <Icon size={18} />
              </div>
            </div>
            
            <div style={{
              fontSize: '1.5rem',
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
