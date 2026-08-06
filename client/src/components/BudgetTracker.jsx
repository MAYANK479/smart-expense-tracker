import React from 'react';
import { Target, AlertTriangle, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

export default function BudgetTracker({ budgetComparison = [], onOpenBudgetModal, currencySymbol = '$' }) {
  const overspendList = budgetComparison.filter(b => b.isOverBudget);

  return (
    <div className="glass-card p-5 rounded-2xl border border-purple-500/20 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">Category Budget Caps & Threshold Alerts</h3>
            <p className="text-xs text-slate-400">Monthly category target limits with visual indicators</p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="glow-btn glow-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manage Targets</span>
        </button>
      </div>

      {overspendList.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl mb-4 flex items-center gap-2 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Overspend Warning:</strong> You have exceeded target limits in{' '}
            {overspendList.map(c => c.category).join(', ')}.
          </span>
        </div>
      )}

      {budgetComparison.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
          <p className="text-xs text-slate-400 mb-2">No monthly category budget limits set yet.</p>
          <button onClick={onOpenBudgetModal} className="btn btn-secondary text-xs py-1.5 px-3">
            + Set Category Target Limit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {budgetComparison.map(b => {
            const progressColor = b.isOverBudget ? '#ef4444' : b.isNearLimit ? '#f59e0b' : '#10b981';
            return (
              <div key={b.category} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>{b.category}</span>
                  <span className={b.isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {formatCurrency(b.spent, currencySymbol)} / {formatCurrency(b.monthly_limit, currencySymbol)}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, b.percentUsed)}%`,
                      backgroundColor: progressColor
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{b.percentUsed}% of target cap</span>
                  <span className={b.isOverBudget ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                    {b.isOverBudget ? 'Over Limit' : `${formatCurrency(b.remaining, currencySymbol)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
