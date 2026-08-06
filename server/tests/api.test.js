import request from 'supertest';
import app from '../index.js';

describe('Smart Expense Tracker API Integration Tests', () => {

  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Smart Expense Tracker');
  });

  describe('Authentication API', () => {
    const testUser = {
      name: 'Test Candidate',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };

    let userToken = '';

    it('POST /api/auth/register should create user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      userToken = res.body.token;
    });

    it('POST /api/auth/login should authenticate user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('GET /api/auth/me should return current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    });
  });

  describe('Expenses & Budgets CRUD API', () => {
    it('GET /api/expenses should return expenses array', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/expenses should create a new transaction', async () => {
      const newExpense = {
        title: 'Jest Integration Test Expense',
        amount: 45.50,
        category: 'Services & Tech',
        payment_method: 'Credit Card'
      };

      const res = await request(app)
        .post('/api/expenses')
        .send(newExpense);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newExpense.title);
      expect(res.body.data.amount).toBe(newExpense.amount);
    });

    it('POST /api/expenses should reject negative amounts with 400', async () => {
      const invalidExpense = {
        title: 'Invalid Negative Expense',
        amount: -50.00,
        category: 'Shopping'
      };

      const res = await request(app)
        .post('/api/expenses')
        .send(invalidExpense);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/budgets should set category limit', async () => {
      const budgetData = {
        category: 'Services & Tech',
        monthly_limit: 300.00
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(budgetData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.budget.monthly_limit).toBe(300.00);
    });
  });
});
