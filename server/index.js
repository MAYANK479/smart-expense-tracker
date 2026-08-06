import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

import expensesRouter from './routes/expenses.js';
import insightsRouter from './routes/insights.js';
import authRouter from './routes/auth.js';
import budgetsRouter from './routes/budgets.js';
import receiptsRouter from './routes/receipts.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all routes and preflight requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.options('*', cors());

// Security & Headers Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allowed for embedded SPA assets
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply Rate Limiter to API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/receipts', receiptsRouter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Smart Expense Tracker API Server',
    aiSupport: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      groqConfigured: !!process.env.GROQ_API_KEY || (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('gsk_'))
    }
  });
});

// Serve Static Frontend Bundle from client/dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Fallback to index.html for single-page React app routing or API Landing Page
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return notFoundHandler(req, res);
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
      auth: '/api/auth',
      expenses: '/api/expenses',
      budgets: '/api/budgets',
      insights: '/api/insights/generate',
      receipts: '/api/receipts/scan'
    }
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Production Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Production Server running on port ${PORT}`);
    console.log(`📱 API Documentation & Health: http://localhost:${PORT}/api/health`);
  });
}

export default app;
