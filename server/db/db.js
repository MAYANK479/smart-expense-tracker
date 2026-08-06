import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// In-memory data store for local/offline fallback mode
let memoryUsers = [
  { id: 1, name: 'Demo User', email: 'demo@smart-expense.com', password_hash: '$2a$10$w85JdC1vO18gU5X7yJk3ee1mQ4A1f1v1w1' }
];

let memoryBudgets = [
  { id: 1, user_id: 1, category: 'Food & Dining', monthly_limit: 400.00 },
  { id: 2, user_id: 1, category: 'Shopping', monthly_limit: 250.00 },
  { id: 3, user_id: 1, category: 'Utilities', monthly_limit: 150.00 }
];

let memoryExpenses = [
  { id: 1, user_id: 1, title: 'Supermarket Groceries', amount: 142.50, category: 'Food & Dining', date: '2026-08-01', payment_method: 'Credit Card', notes: 'Weekly household restocking', tags: 'groceries,essential' },
  { id: 2, user_id: 1, title: 'Electric Bill', amount: 88.20, category: 'Utilities', date: '2026-08-02', payment_method: 'Bank Transfer', notes: 'Monthly utility bill', tags: 'bills,home' },
  { id: 3, user_id: 1, title: 'Uber Rides', amount: 34.00, category: 'Transportation', date: '2026-08-03', payment_method: 'Credit Card', notes: 'Commute to office', tags: 'commute' },
  { id: 4, user_id: 1, title: 'Coffee & Bakery', amount: 18.50, category: 'Food & Dining', date: '2026-08-04', payment_method: 'Apple Pay', notes: 'Morning team coffee', tags: 'snacks' },
  { id: 5, user_id: 1, title: 'Gym Membership', amount: 65.00, category: 'Health & Fitness', date: '2026-08-05', payment_method: 'Credit Card', notes: 'Monthly subscription', tags: 'fitness' },
  { id: 6, user_id: 1, title: 'Cloud Hosting Subscription', amount: 49.00, category: 'Services & Tech', date: '2026-08-06', payment_method: 'Credit Card', notes: 'AWS / Vercel servers', tags: 'work,recurring' },
  { id: 7, user_id: 1, title: 'Dinner with Friends', amount: 115.00, category: 'Food & Dining', date: '2026-08-06', payment_method: 'Cash', notes: 'Italian restaurant', tags: 'leisure' },
  { id: 8, user_id: 1, title: 'Amazon Electronics purchase', amount: 199.99, category: 'Shopping', date: '2026-08-06', payment_method: 'Credit Card', notes: 'Noise cancelling headphones', tags: 'gadgets' }
];

let nextExpenseId = 9;
let nextUserId = 2;
let nextBudgetId = 4;
let isPostgresConnected = false;
let pool = null;

if (process.env.DATABASE_URL || process.env.PGHOST || process.env.PGUSER) {
  try {
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'expense_tracker',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      connectionTimeoutMillis: 5000
    };

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(poolConfig);

    pool.query('SELECT 1', (err) => {
      if (err) {
        console.warn('⚠️  PostgreSQL connection attempt failed. Falling back to local memory store:', err.message);
        isPostgresConnected = false;
      } else {
        console.log('✅ Connected successfully to PostgreSQL database!');
        isPostgresConnected = true;
        initPgTables();
      }
    });
  } catch (err) {
    console.warn('⚠️  PostgreSQL pool initialization error:', err.message);
    isPostgresConnected = false;
  }
} else {
  console.log('ℹ️  No DATABASE_URL or PG environment variables detected. Operating with built-in resilient database storage engine.');
}

async function initPgTables() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          amount NUMERIC(10, 2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          payment_method VARCHAR(50) DEFAULT 'Card',
          notes TEXT,
          tags VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS budgets (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          category VARCHAR(100) NOT NULL,
          monthly_limit NUMERIC(10, 2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_user_category_budget UNIQUE (user_id, category)
      );
    `);
    console.log('✅ PostgreSQL tables (users, expenses, budgets) verified/created.');
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err.message);
  }
}

export const db = {
  getIsPostgresConnected() {
    return isPostgresConnected;
  },

  // USER AUTH QUERIES
  async createUser({ name, email, passwordHash }) {
    if (isPostgresConnected && pool) {
      const sql = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at';
      const res = await pool.query(sql, [name, email.toLowerCase(), passwordHash]);
      return res.rows[0];
    }
    const newUser = { id: nextUserId++, name, email: email.toLowerCase(), password_hash: passwordHash, created_at: new Date().toISOString() };
    memoryUsers.push(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email, created_at: newUser.created_at };
  },

  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [cleanEmail]);
      return res.rows[0] || null;
    }
    return memoryUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const u = memoryUsers.find(user => user.id === parseInt(id, 10));
    return u ? { id: u.id, name: u.name, email: u.email, created_at: u.created_at } : null;
  },

  // EXPENSE QUERIES
  async getAllExpenses({ userId, category, search, startDate, endDate, sortBy = 'date', sortOrder = 'DESC' } = {}) {
    if (isPostgresConnected && pool) {
      try {
        let sql = 'SELECT id, user_id, title, amount::float, category, to_char(date, \'YYYY-MM-DD\') as date, payment_method, notes, tags FROM expenses WHERE 1=1';
        const params = [];
        let pIndex = 1;

        if (userId) {
          sql += ` AND user_id = $${pIndex++}`;
          params.push(userId);
        }

        if (category && category !== 'All') {
          sql += ` AND category = $${pIndex++}`;
          params.push(category);
        }
        if (search) {
          sql += ` AND (title ILIKE $${pIndex} OR notes ILIKE $${pIndex} OR tags ILIKE $${pIndex})`;
          params.push(`%${search}%`);
          pIndex++;
        }
        if (startDate) {
          sql += ` AND date >= $${pIndex++}`;
          params.push(startDate);
        }
        if (endDate) {
          sql += ` AND date <= $${pIndex++}`;
          params.push(endDate);
        }

        const validSortFields = ['date', 'amount', 'title', 'category'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        sql += ` ORDER BY ${sortField} ${order}, id DESC`;

        const res = await pool.query(sql, params);
        return res.rows;
      } catch (err) {
        console.error('PostgreSQL fetch error, returning memory dataset:', err.message);
      }
    }

    let result = [...memoryExpenses];
    if (userId) {
      result = result.filter(e => e.user_id === parseInt(userId, 10));
    }
    if (category && category !== 'All') {
      result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        (e.notes && e.notes.toLowerCase().includes(q)) || 
        (e.tags && e.tags.toLowerCase().includes(q))
      );
    }
    if (startDate) {
      result = result.filter(e => e.date >= startDate);
    }
    if (endDate) {
      result = result.filter(e => e.date <= endDate);
    }

    const sortField = sortBy || 'date';
    const isAsc = sortOrder.toUpperCase() === 'ASC';
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    return result;
  },

  async addExpense({ userId = null, title, amount, category, date, payment_method, notes, tags }) {
    const formattedAmount = parseFloat(amount) || 0;
    const formattedDate = date || new Date().toISOString().split('T')[0];

    if (isPostgresConnected && pool) {
      try {
        const sql = `
          INSERT INTO expenses (user_id, title, amount, category, date, payment_method, notes, tags)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, user_id, title, amount::float, category, to_char(date, 'YYYY-MM-DD') as date, payment_method, notes, tags;
        `;
        const res = await pool.query(sql, [userId, title, formattedAmount, category, formattedDate, payment_method || 'Card', notes || '', tags || '']);
        return res.rows[0];
      } catch (err) {
        console.error('PostgreSQL insert error, falling back to memory store:', err.message);
      }
    }

    const newExpense = {
      id: nextExpenseId++,
      user_id: userId ? parseInt(userId, 10) : 1,
      title,
      amount: formattedAmount,
      category,
      date: formattedDate,
      payment_method: payment_method || 'Card',
      notes: notes || '',
      tags: tags || ''
    };
    memoryExpenses.unshift(newExpense);
    return newExpense;
  },

  async bulkAddExpenses(userId, items) {
    const inserted = [];
    for (const item of items) {
      const res = await this.addExpense({
        userId,
        title: item.title,
        amount: item.amount,
        category: item.category || 'General',
        date: item.date || new Date().toISOString().split('T')[0],
        payment_method: item.payment_method || 'Card',
        notes: item.notes || '',
        tags: item.tags || 'bulk-import'
      });
      inserted.push(res);
    }
    return inserted;
  },

  async updateExpense(id, userId, { title, amount, category, date, payment_method, notes, tags }) {
    const numericId = parseInt(id, 10);
    const formattedAmount = parseFloat(amount) || 0;

    if (isPostgresConnected && pool) {
      try {
        let sql = `
          UPDATE expenses 
          SET title = $1, amount = $2, category = $3, date = $4, payment_method = $5, notes = $6, tags = $7
          WHERE id = $8
        `;
        const params = [title, formattedAmount, category, date, payment_method, notes, tags, numericId];
        if (userId) {
          sql += ' AND user_id = $9';
          params.push(userId);
        }
        sql += " RETURNING id, user_id, title, amount::float, category, to_char(date, 'YYYY-MM-DD') as date, payment_method, notes, tags;";
        const res = await pool.query(sql, params);
        return res.rows[0] || null;
      } catch (err) {
        console.error('PostgreSQL update error:', err.message);
      }
    }

    const index = memoryExpenses.findIndex(e => e.id === numericId && (!userId || e.user_id === parseInt(userId, 10)));
    if (index !== -1) {
      memoryExpenses[index] = {
        ...memoryExpenses[index],
        title: title || memoryExpenses[index].title,
        amount: formattedAmount,
        category: category || memoryExpenses[index].category,
        date: date || memoryExpenses[index].date,
        payment_method: payment_method || memoryExpenses[index].payment_method,
        notes: notes !== undefined ? notes : memoryExpenses[index].notes,
        tags: tags !== undefined ? tags : memoryExpenses[index].tags
      };
      return memoryExpenses[index];
    }
    return null;
  },

  async deleteExpense(id, userId) {
    const numericId = parseInt(id, 10);
    if (isPostgresConnected && pool) {
      try {
        let sql = 'DELETE FROM expenses WHERE id = $1';
        const params = [numericId];
        if (userId) {
          sql += ' AND user_id = $2';
          params.push(userId);
        }
        sql += ' RETURNING id;';
        const res = await pool.query(sql, params);
        return res.rowCount > 0;
      } catch (err) {
        console.error('PostgreSQL delete error:', err.message);
      }
    }

    const index = memoryExpenses.findIndex(e => e.id === numericId && (!userId || e.user_id === parseInt(userId, 10)));
    if (index !== -1) {
      memoryExpenses.splice(index, 1);
      return true;
    }
    return false;
  },

  // BUDGET QUERIES
  async getBudgets(userId) {
    if (isPostgresConnected && pool) {
      let sql = 'SELECT id, category, monthly_limit::float FROM budgets';
      const params = [];
      if (userId) {
        sql += ' WHERE user_id = $1';
        params.push(userId);
      }
      const res = await pool.query(sql, params);
      return res.rows;
    }
    if (userId) {
      return memoryBudgets.filter(b => b.user_id === parseInt(userId, 10));
    }
    return memoryBudgets;
  },

  async setBudget(userId, category, limit) {
    const numUserId = userId ? parseInt(userId, 10) : 1;
    const formattedLimit = parseFloat(limit) || 0;

    if (isPostgresConnected && pool) {
      const sql = `
        INSERT INTO budgets (user_id, category, monthly_limit)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, category)
        DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit
        RETURNING id, category, monthly_limit::float;
      `;
      const res = await pool.query(sql, [numUserId, category, formattedLimit]);
      return res.rows[0];
    }

    const existingIndex = memoryBudgets.findIndex(b => b.user_id === numUserId && b.category.toLowerCase() === category.toLowerCase());
    if (existingIndex !== -1) {
      memoryBudgets[existingIndex].monthly_limit = formattedLimit;
      return memoryBudgets[existingIndex];
    }

    const newBudget = { id: nextBudgetId++, user_id: numUserId, category, monthly_limit: formattedLimit };
    memoryBudgets.push(newBudget);
    return newBudget;
  },

  async clearAll(userId) {
    if (isPostgresConnected && pool) {
      try {
        if (userId) {
          await pool.query('DELETE FROM expenses WHERE user_id = $1;', [userId]);
        } else {
          await pool.query('TRUNCATE TABLE expenses RESTART IDENTITY;');
        }
      } catch (err) {
        console.error('PostgreSQL truncate error:', err.message);
      }
    }
    if (userId) {
      memoryExpenses = memoryExpenses.filter(e => e.user_id !== parseInt(userId, 10));
    } else {
      memoryExpenses = [];
    }
  }
};
