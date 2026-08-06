const API_BASE = '/api';

export const api = {
  async getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/expenses${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  async addExpense(expenseData) {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    if (!res.ok) throw new Error('Failed to create expense entry');
    return res.json();
  },

  async updateExpense(id, expenseData) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    if (!res.ok) throw new Error('Failed to update expense entry');
    return res.json();
  },

  async deleteExpense(id) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete expense entry');
    return res.json();
  },

  async getSummary() {
    const res = await fetch(`${API_BASE}/expenses/summary`);
    if (!res.ok) throw new Error('Failed to fetch expense summary');
    return res.json();
  },

  async generateAIInsights(filter = {}) {
    const res = await fetch(`${API_BASE}/insights/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to seed sample data');
    return res.json();
  },

  async clearAll() {
    const res = await fetch(`${API_BASE}/expenses/clear`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to clear expenses');
    return res.json();
  }
};
