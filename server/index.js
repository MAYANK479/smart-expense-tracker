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

// Serve Static Frontend Bundle from client/dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for single-page React app routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start Production Server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Production Server running on http://127.0.0.1:${PORT}`);
  console.log(`📱 React Frontend UI served directly at http://127.0.0.1:${PORT}`);
});
