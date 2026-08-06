import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

const COLOR_PALETTE = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#64748B'  // Slate
];

export default function ChartsView({ expenses = [] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No expense data available to render charts. Log some entries or click "Seed Sample Data".
      </div>
    );
  }

  // 1. Process Category Breakdown for Pie Chart
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

  // 2. Process Daily Spending Trend for Bar Chart
  const dateMap = {};
  expenses.forEach(item => {
    const amt = parseFloat(item.amount) || 0;
    const dt = item.date || 'Unknown';
    dateMap[dt] = (dateMap[dt] || 0) + amt;
  });

  const barData = Object.entries(dateMap).map(([date, total]) => ({
    date: date.length > 5 ? date.substring(5) : date,
    fullDate: date,
    total: Number(total.toFixed(2))
  })).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
          fontSize: '0.82rem'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{data.name || data.payload.fullDate}</p>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem' }}>
            ${data.value || data.payload.total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Category Breakdown Donut Chart */}
      <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={18} color="#8B5CF6" />
            Spending by Category
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proportion</span>
        </div>

        <div style={{ width: '100%', height: 260 }}>
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
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} stroke="rgba(0,0,0,0.4)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Spending Bar Chart */}
      <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#6366F1" />
            Spending Velocity & Daily Outlay
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timeline</span>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
