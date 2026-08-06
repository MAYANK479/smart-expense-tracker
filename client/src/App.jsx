import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SummaryCards from './components/SummaryCards';
import BudgetTracker from './components/BudgetTracker';
import ChartsView from './components/ChartsView';
import AIInsights from './components/AIInsights';
import ExpenseTable from './components/ExpenseTable';
import ExpenseForm from './components/ExpenseForm';
import BillScanner from './components/BillScanner';
import AuthModal from './components/AuthModal';
import BudgetModal from './components/BudgetModal';
import CSVImportModal from './components/CSVImportModal';
import SettingsModal from './components/SettingsModal';

import { api } from './services/api';
import { CURRENCIES } from './utils/currencies';

import Sidebar from './components/Sidebar';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard'); // 'landing' | 'dashboard'
  const [sidebarTab, setSidebarTab] = useState('dashboard');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expense_currency');
      if (saved && Array.isArray(CURRENCIES)) {
        const parsed = CURRENCIES.find(c => c.code === saved);
        if (parsed) return parsed;
      }
    } catch (e) {
      console.warn('Currency load warning:', e);
    }
    return (CURRENCIES && CURRENCIES[0]) ? CURRENCIES[0] : { code: 'USD', symbol: '$', name: 'USD ($)' };
  });

  const currencySymbol = (currency && currency.symbol) ? currency.symbol : '$';

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleCurrencyChange = (newCurrency) => {
    if (!newCurrency) return;
    setCurrency(newCurrency);
    try {
      localStorage.setItem('smart_expense_currency', newCurrency.code);
    } catch (e) {
      console.warn('Localstorage error:', e);
    }
  };

  // Check current user session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.getMe();
        if (res && res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Auth session check:', err.message);
      }
    }
    checkAuth();
  }, []);

  // Fetch expenses, summary, and budgets
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [expRes, sumRes, budRes] = await Promise.all([
        api.getExpenses({ category: categoryFilter, search: searchQuery }),
        api.getSummary(),
        api.getBudgets().catch(() => ({ budgets: [] }))
      ]);

      if (expRes && expRes.success) setExpenses(expRes.data || []);
      if (sumRes && sumRes.success) setSummary(sumRes.summary || {});
      if (budRes && budRes.success) setBudgets(budRes.budgets || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to backend server. Operating with offline resilience mode.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    fetchData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    fetchData();
  };

  // Handle Add/Edit Form Submit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await api.updateExpense(editingExpense.id, formData);
      } else {
        await api.addExpense(formData);
      }
      setIsAddModalOpen(false);
      setEditingExpense(null);
      await fetchData();
    } catch (err) {
      alert('Error saving transaction: ' + err.message);
    }
  };

  // Handle OCR Extracted Bill Import
  const handleOCRImport = async (extractedData) => {
    try {
      await api.addExpense(extractedData);
      await fetchData();
    } catch (err) {
      alert('Error importing scanned bill: ' + err.message);
    }
  };

  // Handle Delete Entry
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction entry?')) return;
    try {
      await api.deleteExpense(id);
      await fetchData();
    } catch (err) {
      alert('Error deleting entry: ' + err.message);
    }
  };

  // Handle AI Insights Generation
  const handleGenerateAI = async () => {
    try {
      setAiLoading(true);
      setError('');
      const res = await api.generateAIInsights({
        category: categoryFilter !== 'All' ? categoryFilter : undefined
      });
      if (res && res.success) {
        setAiInsights(res.data);
      }
    } catch (err) {
      console.error('AI error:', err);
      setError('AI Insights Error: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Seed sample data for quick evaluation
  const handleSeedData = async () => {
    try {
      setLoading(true);
      await api.seedData();
      setActiveView('dashboard');
      await fetchData();
    } catch (err) {
      alert('Failed to seed sample data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear all data
  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear recorded entries?')) return;
    try {
      setLoading(true);
      await api.clearAll();
      setAiInsights(null);
      await fetchData();
    } catch (err) {
      alert('Failed to clear entries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Navigation */}
      <Navbar 
        user={user}
        currency={currency || { code: 'USD', symbol: '$', name: 'USD ($)' }}
        onCurrencyChange={handleCurrencyChange}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onOpenScannerModal={() => setIsScannerModalOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        onSeedData={handleSeedData}
        onClearData={handleClearData}
        isPostgresConnected={summary.isPostgresConnected || false}
        loading={loading}
      />

      {/* View Switcher: Public Landing Page vs App Dashboard */}
      <AnimatePresence mode="wait">
        {activeView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <LandingPage
              onLaunchDashboard={() => setActiveView('dashboard')}
              onSeedDemoData={handleSeedData}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 flex-1"
          >
            {/* Floating Collapsible Sidebar */}
            <Sidebar
              activeTab={sidebarTab}
              onTabChange={setSidebarTab}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              isPostgresConnected={summary.isPostgresConnected || false}
            />

            {/* Dashboard Main Content Area */}
            <main className="flex-1 min-w-0 space-y-6">
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 p-4 rounded-2xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Dashboard Summary Metrics Cards */}
              <SummaryCards 
                summary={summary || {}} 
                healthScore={aiInsights ? aiInsights.healthScore : null}
                currencySymbol={currencySymbol}
                user={user}
                onSeedData={handleSeedData}
                onClearData={handleClearData}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                onOpenCSVModal={() => setIsCSVModalOpen(true)}
                onOpenScannerModal={() => setIsScannerModalOpen(true)}
                loading={loading}
              />

              {/* Category Budget Tracker & Progress Bars */}
              <BudgetTracker
                budgetComparison={(summary && summary.budgetComparison) || []}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                currencySymbol={currencySymbol}
              />

              {/* AI Insights & Pattern Analysis Engine */}
              <AIInsights 
                onGenerate={handleGenerateAI}
                insights={aiInsights}
                loading={aiLoading}
                error={error}
              />

              {/* Interactive Recharts Analytics */}
              <ChartsView expenses={expenses || []} currencySymbol={currencySymbol} />

              {/* Financial Transactions Log Table */}
              <ExpenseTable 
                expenses={expenses || []}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                selectedCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
                search={searchQuery}
                onSearchChange={setSearchQuery}
                currencySymbol={currencySymbol}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Entry & Photo Receipt Modal */}
      <ExpenseForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        currencySymbol={currencySymbol}
      />

      {/* AI Bill Scanner Modal */}
      <BillScanner
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onImportExtracted={handleOCRImport}
        currencySymbol={currencySymbol}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Budget Management Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onBudgetUpdated={fetchData}
        currentBudgets={budgets || []}
      />

      {/* CSV Bank Statement Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportSuccess={fetchData}
      />

      {/* Global Preferences & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
        onClearData={handleClearData}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        Smart Expense AI &bull; Free AI Powered Expense Tracker &bull; NPR, CAD, USD, EUR, GBP, INR & 150+ Currencies
      </footer>
    </div>
  );
}
