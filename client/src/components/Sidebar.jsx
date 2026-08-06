import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Sparkles, PieChart, Receipt, Target, 
  Settings, ChevronLeft, ChevronRight, HelpCircle, ShieldCheck 
} from 'lucide-react';
import Badge from './ui/Badge';

export default function Sidebar({
  activeTab = 'dashboard', // 'dashboard' | 'ai' | 'charts' | 'transactions' | 'budgets' | 'settings'
  onTabChange,
  onOpenBudgetModal,
  onOpenSettingsModal,
  isPostgresConnected
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'ai', label: 'AI Pattern Engine', icon: Sparkles, badge: 'AI' },
    { id: 'charts', label: 'Visual Analytics', icon: PieChart, badge: null },
    { id: 'transactions', label: 'Transaction Log', icon: Receipt, badge: null },
    { id: 'budgets', label: 'Category Budgets', icon: Target, action: onOpenBudgetModal },
    { id: 'settings', label: 'Preferences & Settings', icon: Settings, action: onOpenSettingsModal },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '78px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-3 shadow-2xl shadow-purple-950/20 sticky top-24 h-[calc(100vh-120px)] z-40 select-none"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/80 mb-3">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-white tracking-tight">Navigation</h3>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Suite</p>
            </div>
          </motion.div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors mx-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all relative group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl -z-10 shadow-md shadow-purple-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />

              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between flex-1 truncate"
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="purple" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Status */}
      <div className="pt-3 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Storage Engine
              </span>
              <Badge variant={isPostgresConnected ? 'emerald' : 'amber'} size="sm">
                {isPostgresConnected ? 'PostgreSQL' : 'Local DB'}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-purple-400" title={isPostgresConnected ? 'PostgreSQL Active' : 'Local Storage Engine'}>
            <ShieldCheck size={20} />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
