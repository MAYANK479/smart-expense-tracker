import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Target, PiggyBank, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

export default function SummaryCards({ summary = {}, healthScore = null, currencySymbol = '$' }) {
  const totalIncome = summary.totalIncome || 0;
  const totalSpent = summary.totalSpent || 0;
  const netSavings = summary.netSavings !== undefined ? summary.netSavings : (totalIncome - totalSpent);
  const savingsRate = summary.savingsRate || 0;

  const totalEntries = summary.totalEntries || 0;
  const budgetComparison = summary.budgetComparison || [];

  const overspendCategories = budgetComparison.filter(b => b.isOverBudget);

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome, currencySymbol),
      subtitle: 'Recorded inflow',
      icon: ArrowUpRight,
      color: '#10B981',
      bgGradient: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%)'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalSpent, currencySymbol),
      subtitle: `${totalEntries} entries recorded`,
      icon: TrendingDown,
      color: '#F43F5E',
      bgGradient: 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.15), transparent 70%)'
    },
    {
      title: 'Net Cash Flow',
      value: formatCurrency(netSavings, currencySymbol),
      subtitle: `${savingsRate}% savings rate`,
      icon: PiggyBank,
      color: netSavings >= 0 ? '#10B981' : '#F43F5E',
      bgGradient: netSavings >= 0 
        ? 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%)' 
        : 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.15), transparent 70%)'
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
    <div className="space-y-4 mb-6">
      {/* OVERSPEND WARNING BANNER */}
      {overspendCategories.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-rose-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Budget Overspend Alert:</strong> You have exceeded monthly targets in{' '}
              {overspendCategories.map(c => `${c.category} (${formatCurrency(c.spent, currencySymbol)} / ${formatCurrency(c.monthly_limit, currencySymbol)})`).join(', ')}.
            </span>
          </div>
        </div>
      )}

      {/* SUMMARY KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
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
                fontSize: '1.4rem',
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

      {/* BUDGET PROGRESS TRACKERS */}
      {budgetComparison.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200 tracking-wide">Category Budget Progress</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {budgetComparison.map(b => {
              const progressColor = b.isOverBudget ? '#ef4444' : b.isNearLimit ? '#f59e0b' : '#10b981';
              return (
                <div key={b.category} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 text-xs">
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>{b.category}</span>
                    <span className={b.isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {formatCurrency(b.spent, currencySymbol)} / {formatCurrency(b.monthly_limit, currencySymbol)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, b.percentUsed)}%`,
                        backgroundColor: progressColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
