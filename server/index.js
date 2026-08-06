import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import expensesRouter from './routes/expenses.js';
import insightsRouter from './routes/insights.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/expenses', expensesRouter);
app.use('/api/insights', insightsRouter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Smart Expense Tracker API Server',
    aiSupport: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY
    }
  });
});

import fs from 'fs';

// Serve Static Frontend Bundle from client/dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Fallback to index.html for single-page React app routing or API Landing Page
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API Endpoint Not Found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'ok',
    message: '🚀 Smart Expense Tracker API Backend Server is Running Live!',
    health: '/api/health',
    documentation: {
      expenses: '/api/expenses',
      insights: '/api/insights/generate'
    }
  });
});

// Start Production Server
app.listen(PORT, () => {
  console.log(`🚀 Production Server running on port ${PORT}`);
  console.log(`📱 React Frontend UI served directly at http://localhost:${PORT}`);
});
