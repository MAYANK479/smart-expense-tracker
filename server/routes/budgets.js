import express from 'express';
import { db } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get category monthly budget targets
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const budgets = await db.getBudgets(userId);
    res.json({
      success: true,
      budgets
    });
  } catch (err) {
    next(err);
  }
});

// Set or update a category budget limit
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { category, monthly_limit } = req.body;
    if (!category || monthly_limit === undefined || monthly_limit === null) {
      return res.status(400).json({ success: false, error: 'Category and monthly_limit are required.' });
    }

    const limitNum = parseFloat(monthly_limit);
    if (isNaN(limitNum) || limitNum < 0) {
      return res.status(400).json({ success: false, error: 'Monthly budget limit must be a non-negative number.' });
    }

    const userId = req.user ? req.user.id : null;
    const budget = await db.setBudget(userId, category, limitNum);

    res.json({
      success: true,
      message: `Budget target for ${category} set to $${limitNum.toFixed(2)}`,
      budget
    });
  } catch (err) {
    next(err);
  }
});

export default router;
