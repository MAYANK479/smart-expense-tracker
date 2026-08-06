import express from 'express';
import { db } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware (populates req.user if token is present)
router.use(authenticateToken);

// GET /api/expenses - List expenses with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { category, search, startDate, endDate, sortBy, sortOrder } = req.query;
    const userId = req.user ? req.user.id : null;

    const expenses = await db.getAllExpenses({ userId, category, search, startDate, endDate, sortBy, sortOrder });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses - Add single manual expense entry
router.post('/', async (req, res, next) => {
  try {
    const { title, amount, category, date, payment_method, notes, tags } = req.body;
    
    if (!title || amount === undefined || amount === null || !category) {
      return res.status(400).json({ success: false, error: 'Title, amount, and category are required fields.' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number.' });
    }

    const userId = req.user ? req.user.id : null;
    const newExpense = await db.addExpense({
      userId,
      title: title.trim(),
      amount: numAmount,
      category: category.trim(),
      date,
      payment_method: payment_method ? payment_method.trim() : 'Card',
      notes: notes ? notes.trim() : '',
      tags: tags ? tags.trim() : ''
    });

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses/bulk - Bulk add expenses (for CSV Bank Statement Import)
router.post('/bulk', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Request body must contain an array of items.' });
    }

    const userId = req.user ? req.user.id : null;
    const inserted = await db.bulkAddExpenses(userId, items);

    res.status(201).json({
      success: true,
      count: inserted.length,
      message: `Successfully imported ${inserted.length} expense transactions!`,
      data: inserted
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/expenses/:id - Edit expense entry
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const updated = await db.updateExpense(req.params.id, userId, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Expense entry not found or permission denied.' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/expenses/:id - Delete expense entry
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const deleted = await db.deleteExpense(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Expense entry not found or permission denied.' });
    }
    res.json({ success: true, message: 'Expense entry deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/expenses/summary - Get aggregated dashboard metrics & budget limits
router.get('/summary', async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const expenses = await db.getAllExpenses({ userId });
    const budgets = await db.getBudgets(userId);

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

    // Budget overspend status calculation
    const budgetComparison = budgets.map(b => {
      const spent = byCategory[b.category] || 0;
      const percent = b.monthly_limit > 0 ? Number(((spent / b.monthly_limit) * 100).toFixed(1)) : 0;
      return {
        category: b.category,
        monthly_limit: b.monthly_limit,
        spent,
        remaining: Math.max(0, b.monthly_limit - spent),
        percentUsed: percent,
        isOverBudget: spent > b.monthly_limit,
        isNearLimit: percent >= 80 && percent <= 100
      };
    });

    res.json({
      success: true,
      summary: {
        totalSpent,
        totalEntries: count,
        avgExpense,
        byCategory,
        byPayment,
        budgetComparison,
        isPostgresConnected: db.getIsPostgresConnected()
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses/seed - Populate sample data
router.post('/seed', async (req, res, next) => {
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

    const userId = req.user ? req.user.id : null;
    await db.bulkAddExpenses(userId, sampleData);
    res.json({ success: true, message: 'Sample expense entries pre-populated successfully!' });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses/clear - Clear all user data
router.post('/clear', async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    await db.clearAll(userId);
    res.json({ success: true, message: 'All expenses cleared.' });
  } catch (err) {
    next(err);
  }
});

export default router;
