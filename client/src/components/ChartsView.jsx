import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { formatCurrency } from '../utils/currencies';

const COLOR_PALETTE = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#64748B'  // Slate
];

export default function ChartsView({ expenses = [], currencySymbol = '$' }) {
  if (!expenses || expenses.length === 0) {
    return (
      <Card padding="p-8" className="text-center text-slate-400 space-y-3 mb-6">
        <PieIcon className="w-10 h-10 mx-auto text-purple-400 opacity-60" />
        <p className="text-sm">No transaction entries logged yet to render interactive analytics charts.</p>
      </Card>
    );
  }

  // 1. Category Breakdown for Donut Chart
  const categoryMap = {};
  expenses.forEach(item => {
    const amt = parseFloat(item.amount) || 0;
    const cat = item.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + amt;
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2))
  })).sort((a, b) => b.value - a.value);

  // 2. Daily Spending Trend for Bar & Area Chart
  const dateMap = {};
  expenses.forEach(item => {
    const amt = parseFloat(item.amount) || 0;
    const dt = item.date || 'Unknown';
    dateMap[dt] = (dateMap[dt] || 0) + amt;
  });

  const chartData = Object.entries(dateMap).map(([date, total]) => ({
    date: date.length > 5 ? date.substring(5) : date,
    fullDate: date,
    total: Number(total.toFixed(2))
  })).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-950 border border-purple-500/30 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="text-slate-400 font-semibold">{data.name || data.payload.fullDate}</p>
          <p className="text-white font-extrabold text-sm">
            {formatCurrency(data.value || data.payload.total, currencySymbol)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Category Breakdown Donut Chart */}
      <Card padding="p-6" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Category Allocation</h3>
              <p className="text-xs text-slate-400">Proportional spending distribution</p>
            </div>
          </div>
          <Badge variant="purple" size="sm">Donut View</Badge>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} stroke="rgba(0,0,0,0.3)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span className="text-slate-400 text-xs font-semibold">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily Cashflow Velocity Area Chart */}
      <Card padding="p-6" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Spending Velocity & Daily Outlay</h3>
              <p className="text-xs text-slate-400">Transaction timeline & cash flow curves</p>
            </div>
          </div>
          <Badge variant="indigo" size="sm">Area Spline</Badge>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}
