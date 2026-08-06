import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, ShieldCheck, ArrowUpRight, 
  PiggyBank, Sparkles, RefreshCw, Trash2, FileSpreadsheet, Target, Camera
} from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatCurrency } from '../utils/currencies';

export default function SummaryCards({ 
  summary = {}, 
  healthScore = null, 
  currencySymbol = '$',
  user = null,
  onSeedData,
  onClearData,
  onOpenBudgetModal,
  onOpenCSVModal,
  onOpenScannerModal,
  loading
}) {
  const totalIncome = summary.totalIncome || 0;
  const totalSpent = summary.totalSpent || 0;
  const netSavings = summary.netSavings !== undefined ? summary.netSavings : (totalIncome - totalSpent);
  const savingsRate = summary.savingsRate || 0;
  const totalEntries = summary.totalEntries || 0;

  const overspendCategories = (summary.budgetComparison || []).filter(b => b.isOverBudget);

  const greetingName = user ? user.name : 'Financial Leader';

  return (
    <div className="space-y-6 mb-8">
      
      {/* LARGE GREETING & QUICK ACTIONS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950/80 p-6 rounded-3xl border border-purple-500/20 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              OVERVIEW DASHBOARD
            </span>
            <Badge variant="purple" size="sm">
              <Sparkles className="w-3 h-3 text-purple-400" /> Real-time Analytics
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{greetingName}</span> 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Here is your financial pattern summary, cash flow velocity, and budget health score.
          </p>
        </div>

        {/* Quick Action Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenScannerModal}
            icon={Camera}
            title="Scan paper receipt with AI Vision"
          >
            Scan Bill
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenBudgetModal}
            icon={Target}
            title="Set category monthly target limits"
          >
            Budgets
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenCSVModal}
            icon={FileSpreadsheet}
            title="Import bank statement CSV"
          >
            Import CSV
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onSeedData}
            isLoading={loading}
            icon={RefreshCw}
            title="Seed sample transactions"
          >
            Seed Demo
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={onClearData}
            isLoading={loading}
            icon={Trash2}
            title="Clear all records"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* OVERSPEND ALERT BANNER */}
      {overspendCategories.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              ⚠️
            </div>
            <div>
              <span className="font-bold text-rose-200">Budget Limit Warning:</span>
              <p className="text-slate-300">
                You have exceeded monthly target caps in{' '}
                {overspendCategories.map(c => `${c.category} (${formatCurrency(c.spent, currencySymbol)} / ${formatCurrency(c.monthly_limit, currencySymbol)})`).join(', ')}.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* STRIPE / LINEAR STYLE KPI WIDGET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Income Card */}
        <Card interactive glow padding="p-5" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Inflow</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
              {formatCurrency(totalIncome, currencySymbol)}
            </h4>
            <p className="text-xs text-slate-400 mt-1">Recorded revenue & earnings</p>
          </div>
        </Card>

        {/* Total Expenses Outlay Card */}
        <Card interactive glow padding="p-5" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Outlay</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
              {formatCurrency(totalSpent, currencySymbol)}
            </h4>
            <p className="text-xs text-slate-400 mt-1">{totalEntries} entries recorded</p>
          </div>
        </Card>

        {/* Net Cash Flow & Savings Card */}
        <Card interactive glow padding="p-5" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Cash Flow</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${netSavings >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className={`text-2xl md:text-3xl font-extrabold font-heading ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netSavings, currencySymbol)}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold text-emerald-400">{savingsRate}% savings rate</p>
          </div>
        </Card>

        {/* Financial Health Score Card */}
        <Card interactive glow padding="p-5" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Health Score</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
              {healthScore !== null ? `${healthScore} / 100` : 'Pending AI'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {healthScore !== null 
                ? (healthScore > 75 ? 'Optimal spending balance' : 'Optimization suggested') 
                : 'Click Analyze with AI below'}
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}
