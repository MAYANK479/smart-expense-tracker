import express from 'express';
import { db } from '../db/db.js';
import { generateAIInsights } from '../services/aiService.js';

const router = express.Router();

// POST /api/insights/generate - Aggregate entries and request AI pattern report
router.post('/generate', async (req, res) => {
  try {
    const { category, startDate, endDate, timePeriod } = req.body || {};
    
    // Fetch aggregated target dataset based on current active view filter
    const expenses = await db.getAllExpenses({ category, startDate, endDate });

    if (!expenses || expenses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No expenses found matching the selected filter to generate insights.'
      });
    }

    const report = await generateAIInsights(expenses, timePeriod || 'All Time');
    
    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Error generating AI insights:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights: ' + err.message
    });
  }
});

export default router;
