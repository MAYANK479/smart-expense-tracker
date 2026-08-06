const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${BASE_URL.replace(/\/$/, '')}/api`;

const getHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('smart_expense_token');
  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // AUTHENTICATION API
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      localStorage.setItem('smart_expense_token', data.token);
    }
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    if (data.token) {
      localStorage.setItem('smart_expense_token', data.token);
    }
    return data;
  },

  async getMe() {
    const token = localStorage.getItem('smart_expense_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      localStorage.removeItem('smart_expense_token');
      return null;
    }
    return res.json();
  },

  logout() {
    localStorage.removeItem('smart_expense_token');
  },

  // EXPENSES API
  async getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/expenses${query ? `?${query}` : ''}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  async addExpense(expenseData) {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expenseData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create expense entry');
    return data;
  },

  async bulkAddExpenses(items) {
    const res = await fetch(`${API_BASE}/expenses/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to import expenses');
    return data;
  },

  async updateExpense(id, expenseData) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(expenseData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update expense entry');
    return data;
  },

  async deleteExpense(id) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete expense entry');
    return data;
  },

  async getSummary() {
    const res = await fetch(`${API_BASE}/expenses/summary`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch expense summary');
    return res.json();
  },

  // BUDGETS API
  async getBudgets() {
    const res = await fetch(`${API_BASE}/budgets`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  async setBudget(category, monthly_limit) {
    const res = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ category, monthly_limit })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to set budget limit');
    return data;
  },

  // RECEIPT OCR VISION API
  async scanReceipt(imageBase64, mimeType = 'image/jpeg') {
    const res = await fetch(`${API_BASE}/receipts/scan`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ imageBase64, mimeType })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Receipt scan failed');
    return data;
  },

  // AI INSIGHTS API
  async generateAIInsights(filter = {}) {
    const res = await fetch(`${API_BASE}/insights/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(filter)
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate AI insights');
    }
    return res.json();
  },

  async seedData() {
    const res = await fetch(`${API_BASE}/expenses/seed`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to seed sample data');
    return res.json();
  },

  async clearAll() {
    const res = await fetch(`${API_BASE}/expenses/clear`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear expenses');
    return res.json();
  }
};
