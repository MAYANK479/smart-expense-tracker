# 💡 Smart Expense Tracker & AI Pattern Insight Engine

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20%2F%20Groq-4285F4?logo=google-gemini)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://smart-expense-tracker-sable.vercel.app)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://smart-expense-tracker-api-nax2.onrender.com)

An intelligent, full-stack financial tracking web application built with **React**, **Vite**, **Express**, **PostgreSQL**, and **Google Gemini AI**. Tracks your daily transactions, categorizes outlays, visualizes spending velocity with dynamic Recharts analytics, and leverages AI LLMs for automated financial health scoring, anomaly detection, and actionable savings tips.

---

## 🔗 Live Links

* 🌐 **Live Web Application (Vercel)**: [https://smart-expense-tracker-sable.vercel.app](https://smart-expense-tracker-sable.vercel.app)
* ⚡ **Backend REST API (Render)**: [https://smart-expense-tracker-api-nax2.onrender.com](https://smart-expense-tracker-api-nax2.onrender.com)
* 📦 **GitHub Repository**: [https://github.com/MAYANK479/smart-expense-tracker](https://github.com/MAYANK479/smart-expense-tracker)

---

## ✨ Features

- **💸 Full-Stack Expense Management**: Add, update, delete, search, and filter expenses by category, date range, or keywords.
- **🤖 AI Financial Insights Engine**: Integrates Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`), Groq AI (Llama 3.3 70B), or OpenAI to generate personalized spending advice, financial health scores, and anomaly warnings.
- **📊 Dynamic Visual Analytics**: Interactive Recharts components including category pie charts, monthly proportion distribution, and daily spending velocity bar graphs.
- **🛡️ Dual Database Storage Architecture**: 
  - Connects directly to **PostgreSQL** when database environment variables (`DATABASE_URL`) are provided.
  - Features an **Automatic Resilient In-Memory Fallback Storage Engine** if database connection is unavailable.
- **🎨 Glassmorphic Dark UI**: Custom dark-mode aesthetic with CSS micro-animations, toast alerts, confetti celebrations, and responsive mobile-first layouts.

---

## 🛠️ Technology Stack

### **Frontend (`/client`)**
* **Framework**: React 18 + Vite
* **UI Icons & Animations**: `lucide-react`, `canvas-confetti`
* **Data Visualization**: `recharts`
* **HTTP Client**: Native Fetch API with environment variable routing

### **Backend (`/server`)**
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database Driver**: `pg` (PostgreSQL Client with SSL cloud database support)
* **AI Integrations**: `@google/generative-ai`, `openai` (Groq & OpenAI support)

---

## 📁 Repository Structure

```text
smart-expense-tracker/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, SummaryCards, ExpenseForm, ExpenseTable, ChartsView, AIInsights
│   │   ├── services/           # API fetch client (VITE_API_URL configured)
│   │   ├── App.jsx             # Main Application Container & Tab State
│   │   └── index.css           # Global Theme & Glassmorphic Styling
│   ├── package.json
│   └── vercel.json             # Vercel Single-Page Application Rewrites
│
├── server/                     # Node.js + Express Backend API
│   ├── db/                     # PostgreSQL pool & resilient memory fallback store
│   ├── routes/                 # Express API routes (/api/expenses, /api/insights)
│   ├── services/               # AI Engine (Gemini, Groq, OpenAI & Heuristic Engine)
│   ├── schema.sql              # PostgreSQL DDL Table Definitions
│   ├── index.js                # Express Server Entrypoint
│   └── package.json
│
├── package.json                # Monorepo root scripts
├── render.yaml                 # Infrastructure-as-code blueprint for Render
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
# Server Port
PORT=5001

# AI Credentials (Google Gemini or Groq or OpenAI)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL Database (Optional - App includes built-in fallback)
DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_tracker
```

### Frontend (`client/.env`)

```env
VITE_API_URL=https://smart-expense-tracker-api-nax2.onrender.com
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MAYANK479/smart-expense-tracker.git
   cd smart-expense-tracker
   ```

2. **Install all dependencies**:
   ```bash
   npm run postinstall
   ```

3. **Run Development Servers**:
   - Backend API (`http://localhost:5001`):
     ```bash
     npm run dev:server
     ```
   - Frontend UI (`http://localhost:5173`):
     ```bash
     npm run dev:client
     ```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & AI service status |
| `GET` | `/api/expenses` | Fetch expenses (supports `category`, `search`, `startDate`, `endDate`, `sortBy`) |
| `POST` | `/api/expenses` | Add a new expense transaction |
| `PUT` | `/api/expenses/:id` | Update an existing transaction |
| `DELETE` | `/api/expenses/:id` | Delete a transaction |
| `GET` | `/api/expenses/summary` | Get aggregated spending totals and category metrics |
| `POST` | `/api/insights/generate` | Trigger AI LLM analysis & financial health scoring |
| `POST` | `/api/expenses/seed` | Seed default sample expense records |
| `POST` | `/api/expenses/clear` | Clear all expense entries |

---

## 🚢 Deployment Configuration

* **Backend Deployment**: Hosted on **Render** as a Node Web Service listening on port 10000/dynamic port.
* **Frontend Deployment**: Hosted on **Vercel** configured with single-page app rewrites ([vercel.json](file:///Users/mayankpandey/Downloads/Projects/smart-expense-tracker/client/vercel.json)) pointing to the Render backend via `VITE_API_URL`.

---

## 👨‍💻 Author

Developed by **Mayank Pandey** ([MAYANK479](https://github.com/MAYANK479)).
