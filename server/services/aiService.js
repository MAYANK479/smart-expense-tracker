import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

dotenv.config();

/**
 * Generate structured insights for aggregated expense data using Gemini, OpenAI, or local AI fallback.
 */
export async function generateAIInsights(expenses, timePeriod = 'All Time') {
  if (!expenses || expenses.length === 0) {
    return {
      summary: 'No expenses available to analyze. Please add some expenses first!',
      healthScore: 100,
      totalSpent: 0,
      patterns: [],
      anomalies: [],
      suggestions: [],
      categoryBreakdown: [],
      generatedBy: 'System'
    };
  }

  // Aggregate numbers
  const totalSpent = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const categoryTotals = {};
  const paymentTotals = {};
  const dateTotals = {};

  expenses.forEach(item => {
    const amt = parseFloat(item.amount) || 0;
    const cat = item.category || 'Uncategorized';
    const pay = item.payment_method || 'Card';
    const dt = item.date || 'Unknown';

    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    paymentTotals[pay] = (paymentTotals[pay] || 0) + amt;
    dateTotals[dt] = (dateTotals[dt] || 0) + amt;
  });

  const categoryArray = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Number(((amount / totalSpent) * 100).toFixed(1))
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryArray[0] || { category: 'None', percentage: 0 };
  const avgExpense = (totalSpent / expenses.length).toFixed(2);

  // Prepare prompt for AI LLM
  const prompt = `
You are an expert AI Financial Advisor and Expense Analyst.
Analyze the following expense data for a user over period "${timePeriod}":

Total Expenses: $${totalSpent.toFixed(2)} across ${expenses.length} entries.
Average Transaction: $${avgExpense}
Category Breakdown: ${JSON.stringify(categoryArray)}
Payment Methods: ${JSON.stringify(paymentTotals)}
Raw Expense Sample: ${JSON.stringify(expenses.slice(0, 20))}

Provide your analysis strictly in JSON format matching this structure:
{
  "summary": "Short 2-3 sentence overview of spending behavior and overall financial health.",
  "healthScore": 78, // Number from 0 to 100 rating overall spending balance
  "patterns": [
    { "title": "Pattern Title", "description": "Specific observation about recurring costs or category weight.", "impact": "High" | "Medium" | "Low" }
  ],
  "anomalies": [
    { "title": "Anomaly Title", "description": "Unusual high single transaction or spike in a category.", "amount": 199.99 }
  ],
  "suggestions": [
    { "title": "Actionable Tip", "description": "Step-by-step recommendation to save money.", "potentialSavings": "$50/mo" }
  ]
}
Return ONLY valid JSON without markdown formatting or backticks.
`;

  // 1. Try Gemini API if GEMINI_API_KEY is available
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('🤖 Invoking Gemini API for insights generation...');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const response = await model.generateContent(prompt);
      const responseText = response.response.text() || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        totalSpent,
        categoryBreakdown: categoryArray,
        generatedBy: `Google Gemini (${modelName})`
      };
    } catch (err) {
      console.warn('⚠️ Gemini API execution failed or error parsing response:', err.message);
    }
  }

  // 2. Try OpenAI API if OPENAI_API_KEY is available
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log('🤖 Invoking OpenAI API for insights generation...');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a financial analysis assistant that outputs strictly valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });

      const parsed = JSON.parse(completion.choices[0].message.content);
      return {
        ...parsed,
        totalSpent,
        categoryBreakdown: categoryArray,
        generatedBy: 'OpenAI GPT'
      };
    } catch (err) {
      console.warn('⚠️ OpenAI API execution failed:', err.message);
    }
  }

  // 3. Smart Heuristic Local AI Fallback Engine
  console.log('🧠 Generating local AI smart insights engine report...');
  
  const highExpenses = expenses.filter(e => parseFloat(e.amount) > parseFloat(avgExpense) * 1.8);
  const patterns = [];
  const anomalies = [];
  const suggestions = [];

  if (topCategory.percentage > 35) {
    patterns.push({
      title: `Heavy concentration in ${topCategory.category}`,
      description: `${topCategory.percentage}% of total expenses ($${topCategory.amount.toFixed(2)}) were spent on ${topCategory.category}.`,
      impact: topCategory.percentage > 50 ? 'High' : 'Medium'
    });
  }

  const cardPercent = paymentTotals['Credit Card'] ? ((paymentTotals['Credit Card'] / totalSpent) * 100).toFixed(0) : 0;
  if (cardPercent > 60) {
    patterns.push({
      title: 'Credit Card Dominance',
      description: `${cardPercent}% of payments were executed via Credit Card. Ensure monthly balances are paid off to avoid interest fees.`,
      impact: 'Medium'
    });
  }

  highExpenses.forEach(exp => {
    anomalies.push({
      title: `High Single Purchase: ${exp.title}`,
      description: `$${parseFloat(exp.amount).toFixed(2)} spent on ${exp.date} in category ${exp.category}.`,
      amount: parseFloat(exp.amount)
    });
  });

  if (topCategory.category === 'Food & Dining') {
    suggestions.push({
      title: 'Reduce Dining & Takeout Expenses',
      description: 'Food & Dining is your highest expense area. Planning meal preps 3 days a week could save around 25%.',
      potentialSavings: `$${(topCategory.amount * 0.25).toFixed(2)}/mo`
    });
  } else if (topCategory.category === 'Shopping') {
    suggestions.push({
      title: 'Enforce a 48-Hour Impulse Buy Delay',
      description: 'Before making non-essential shopping purchases over $50, wait 48 hours to determine necessity.',
      potentialSavings: `$${(topCategory.amount * 0.2).toFixed(2)}/mo`
    });
  }

  suggestions.push({
    title: 'Audit Recurring Digital Subscriptions',
    description: 'Review recurring tech and entertainment bills. Cancel unused services to maximize cash savings.',
    potentialSavings: '$35.00/mo'
  });

  const healthScore = Math.max(40, Math.min(95, Math.round(100 - (topCategory.percentage * 0.6) - (anomalies.length * 5))));

  return {
    summary: `Based on your ${expenses.length} recorded entries totaling $${totalSpent.toFixed(2)}, your highest spending area is ${topCategory.category} (${topCategory.percentage}%). Your spending pattern indicates a financial health score of ${healthScore}/100.`,
    healthScore,
    totalSpent,
    patterns: patterns.length > 0 ? patterns : [{ title: 'Balanced Category Distribution', description: 'Your spending is well distributed across multiple categories.', impact: 'Low' }],
    anomalies: anomalies.length > 0 ? anomalies : [{ title: 'No major anomalous spikes', description: 'No extreme outlay outliers detected.', amount: 0 }],
    suggestions,
    categoryBreakdown: categoryArray,
    generatedBy: 'Smart AI Analytics Engine (Local Mode)'
  };
}
