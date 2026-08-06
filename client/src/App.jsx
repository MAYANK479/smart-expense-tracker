import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import ChartsView from './components/ChartsView';
import AIInsights from './components/AIInsights';
import ExpenseTable from './components/ExpenseTable';
import ExpenseForm from './components/ExpenseForm';
import AuthModal from './components/AuthModal';
import BudgetModal from './components/BudgetModal';
import CSVImportModal from './components/CSVImportModal';
import { api } from './services/api';
import { CURRENCIES } from './utils/currencies';

export default function App() {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('smart_expense_currency');
    if (saved) {
      const parsed = CURRENCIES.find(c => c.code === saved);
      if (parsed) return parsed;
    }
    return CURRENCIES[0]; // Default USD ($)
  });

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
  const [editingExpense, setEditingExpense] = useState(null);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('smart_expense_currency', newCurrency.code);
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

      if (expRes.success) setExpenses(expRes.data);
      if (sumRes.success) setSummary(sumRes.summary);
      if (budRes.success) setBudgets(budRes.budgets || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to backend server. Make sure the server is running.');
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
      if (res.success) {
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
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        onSeedData={handleSeedData}
        onClearData={handleClearData}
        isPostgresConnected={summary.isPostgresConnected || false}
        loading={loading}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        flex: 1
      }}>
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fda4af',
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Dashboard Top Summary Metrics & Budget Progress */}
        <SummaryCards 
          summary={summary} 
          healthScore={aiInsights ? aiInsights.healthScore : null}
          currencySymbol={currency.symbol}
        />

        {/* AI Insights & Pattern Report Section */}
        <AIInsights 
          onGenerate={handleGenerateAI}
          insights={aiInsights}
          loading={aiLoading}
          error={error}
        />

        {/* Interactive Charts Dashboard */}
        <ChartsView expenses={expenses} />

        {/* Financial Transactions Log Table */}
        <ExpenseTable 
          expenses={expenses}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          search={searchQuery}
          onSearchChange={setSearchQuery}
          currencySymbol={currency.symbol}
        />
      </main>

      {/* Manual Entry & Receipt OCR Modal */}
      <ExpenseForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        currencySymbol={currency.symbol}
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
        currentBudgets={budgets}
      />

      {/* CSV Bank Statement Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportSuccess={fetchData}
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
        Smart Expense AI &bull; Global Multi-Currency Financial Tracker & AI Insights Engine
      </footer>
    </div>
  );
}
