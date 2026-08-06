import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import ChartsView from './components/ChartsView';
import AIInsights from './components/AIInsights';
import ExpenseTable from './components/ExpenseTable';
import ExpenseForm from './components/ExpenseForm';
import { api } from './services/api';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses and summary from backend API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [expRes, sumRes] = await Promise.all([
        api.getExpenses({ category: categoryFilter, search: searchQuery }),
        api.getSummary()
      ]);

      if (expRes.success) setExpenses(expRes.data);
      if (sumRes.success) setSummary(sumRes.summary);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to backend server. Make sure the server is running on http://localhost:5001');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Add/Edit Form Submit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await api.updateExpense(editingExpense.id, formData);
      } else {
        await api.addExpense(formData);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      await fetchData();
    } catch (err) {
      alert('Error saving expense: ' + err.message);
    }
  };

  // Handle Delete Entry
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense entry?')) return;
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
    if (!window.confirm('Are you sure you want to clear ALL recorded expenses?')) return;
    try {
      setLoading(true);
      await api.clearAll();
      setAiInsights(null);
      await fetchData();
    } catch (err) {
      alert('Failed to clear expenses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Navigation */}
      <Navbar 
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

        {/* Dashboard Top Summary Metrics */}
        <SummaryCards 
          summary={summary} 
          healthScore={aiInsights ? aiInsights.healthScore : null} 
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

        {/* Expense Log Table */}
        <ExpenseTable 
          expenses={expenses}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          search={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>

      {/* Manual Entry Modal */}
      <ExpenseForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
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
        Smart Expense Tracker with AI Insights &bull; Built with ReactJS, NodeJS, PostgreSQL & OpenAI/Gemini
      </footer>
    </div>
  );
}
