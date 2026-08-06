import express from 'express';
import { db } from '../db/db.js';

const router = express.Router();

// GET /api/expenses - List expenses with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, startDate, endDate, sortBy, sortOrder } = req.query;
    const expenses = await db.getAllExpenses({ category, search, startDate, endDate, sortBy, sortOrder });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/expenses - Add manual expense entry
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, payment_method, notes, tags } = req.body;
    
    if (!title || amount === undefined || amount === null || !category) {
      return res.status(400).json({ success: false, error: 'Title, amount, and category are required fields.' });
    }

    const newExpense = await db.addExpense({
      title,
      amount,
      category,
      date,
      payment_method,
      notes,
      tags
    });

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/expenses/:id - Edit expense entry
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.updateExpense(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Expense entry not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/expenses/:id - Delete expense entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Expense entry not found.' });
    }
    res.json({ success: true, message: 'Expense entry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/expenses/summary - Get aggregated dashboard metrics
router.get('/summary', async (req, res) => {
  try {
    const expenses = await db.getAllExpenses();
    const totalSpent = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const count = expenses.length;
    const avgExpense = count > 0 ? (totalSpent / count).toFixed(2) : 0;

    const byCategory = {};
    const byPayment = {};

    expenses.forEach(item => {
      const amt = parseFloat(item.amount) || 0;
      byCategory[item.category] = (byCategory[item.category] || 0) + amt;
      byPayment[item.payment_method] = (byPayment[item.payment_method] || 0) + amt;
    });

    res.json({
      success: true,
      summary: {
        totalSpent,
        totalEntries: count,
        avgExpense,
        byCategory,
        byPayment,
        isPostgresConnected: db.getIsPostgresConnected()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/expenses/seed - Populate sample data
router.post('/seed', async (req, res) => {
  try {
    const sampleData = [
      { title: 'Supermarket Groceries', amount: 142.50, category: 'Food & Dining', date: '2026-08-01', payment_method: 'Credit Card', notes: 'Weekly restocking', tags: 'groceries' },
      { title: 'Electric Bill', amount: 88.20, category: 'Utilities', date: '2026-08-02', payment_method: 'Bank Transfer', notes: 'Monthly bill', tags: 'bills' },
      { title: 'Uber Taxi Commute', amount: 34.00, category: 'Transportation', date: '2026-08-03', payment_method: 'Credit Card', notes: 'Rainy day commute', tags: 'transit' },
      { title: 'Artisan Coffee & Snack', amount: 18.50, category: 'Food & Dining', date: '2026-08-04', payment_method: 'Apple Pay', notes: 'Team coffee break', tags: 'coffee' },
      { title: 'Gym Fitness Membership', amount: 65.00, category: 'Health & Fitness', date: '2026-08-05', payment_method: 'Credit Card', notes: 'Gym fee', tags: 'health' },
      { title: 'Cloud Infrastructure Subscription', amount: 49.00, category: 'Services & Tech', date: '2026-08-06', payment_method: 'Credit Card', notes: 'Dev server hosting', tags: 'tech' },
      { title: 'Weekend Dining Out', amount: 115.00, category: 'Food & Dining', date: '2026-08-06', payment_method: 'Cash', notes: 'Dinner with friends', tags: 'social' },
      { title: 'Amazon Ergonomic Keyboard', amount: 129.99, category: 'Shopping', date: '2026-08-07', payment_method: 'Credit Card', notes: 'Workplace upgrade', tags: 'hardware' }
    ];

    await db.seedData(sampleData);
    res.json({ success: true, message: 'Sample expense entries pre-populated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/expenses/clear - Clear all data
router.post('/clear', async (req, res) => {
  try {
    await db.clearAll();
    res.json({ success: true, message: 'All expenses cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
