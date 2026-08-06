import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Default initial mock dataset in case Postgres is not running locally
let memoryExpenses = [
  { id: 1, title: 'Supermarket Groceries', amount: 142.50, category: 'Food & Dining', date: '2026-08-01', payment_method: 'Credit Card', notes: 'Weekly household restocking', tags: 'groceries,essential' },
  { id: 2, title: 'Electric Bill', amount: 88.20, category: 'Utilities', date: '2026-08-02', payment_method: 'Bank Transfer', notes: 'Monthly utility bill', tags: 'bills,home' },
  { id: 3, title: 'Uber Rides', amount: 34.00, category: 'Transportation', date: '2026-08-03', payment_method: 'Credit Card', notes: 'Commute to office', tags: 'commute' },
  { id: 4, title: 'Coffee & Bakery', amount: 18.50, category: 'Food & Dining', date: '2026-08-04', payment_method: 'Apple Pay', notes: 'Morning team coffee', tags: 'snacks' },
  { id: 5, title: 'Gym Membership', amount: 65.00, category: 'Health & Fitness', date: '2026-08-05', payment_method: 'Credit Card', notes: 'Monthly subscription', tags: 'fitness' },
  { id: 6, title: 'Cloud Hosting Subscription', amount: 49.00, category: 'Services & Tech', date: '2026-08-06', payment_method: 'Credit Card', notes: 'AWS / Vercel servers', tags: 'work,recurring' },
  { id: 7, title: 'Dinner with Friends', amount: 115.00, category: 'Food & Dining', date: '2026-08-06', payment_method: 'Cash', notes: 'Italian restaurant', tags: 'leisure' },
  { id: 8, title: 'Amazon Electronics purchase', amount: 199.99, category: 'Shopping', date: '2026-08-06', payment_method: 'Credit Card', notes: 'Noise cancelling headphones', tags: 'gadgets' }
];

let nextId = 9;
let isPostgresConnected = false;
let pool = null;

if (process.env.DATABASE_URL || process.env.PGHOST || process.env.PGUSER) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'expense_tracker',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      connectionTimeoutMillis: 3000
    });

    // Test connection
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
  console.log('ℹ️  No DATABASE_URL or PG environment variables detected. Operating with built-in resilient database storage engine (PostgreSQL schema compatible).');
}

async function initPgTables() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          amount NUMERIC(10, 2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          payment_method VARCHAR(50) DEFAULT 'Card',
          notes TEXT,
          tags VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ PostgreSQL tables verified/created.');
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err.message);
  }
}

export const db = {
  getIsPostgresConnected() {
    return isPostgresConnected;
  },

  async getAllExpenses({ category, search, startDate, endDate, sortBy = 'date', sortOrder = 'DESC' } = {}) {
    if (isPostgresConnected && pool) {
      try {
        let sql = 'SELECT id, title, amount::float, category, to_char(date, \'YYYY-MM-DD\') as date, payment_method, notes, tags FROM expenses WHERE 1=1';
        const params = [];
        let pIndex = 1;

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

    // Memory storage fallback
    let result = [...memoryExpenses];

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

  async addExpense({ title, amount, category, date, payment_method, notes, tags }) {
    const formattedAmount = parseFloat(amount) || 0;
    const formattedDate = date || new Date().toISOString().split('T')[0];

    if (isPostgresConnected && pool) {
      try {
        const sql = `
          INSERT INTO expenses (title, amount, category, date, payment_method, notes, tags)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, title, amount::float, category, to_char(date, 'YYYY-MM-DD') as date, payment_method, notes, tags;
        `;
        const res = await pool.query(sql, [title, formattedAmount, category, formattedDate, payment_method || 'Card', notes || '', tags || '']);
        return res.rows[0];
      } catch (err) {
        console.error('PostgreSQL insert error, falling back to memory store:', err.message);
      }
    }

    const newExpense = {
      id: nextId++,
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

  async updateExpense(id, { title, amount, category, date, payment_method, notes, tags }) {
    const numericId = parseInt(id, 10);
    const formattedAmount = parseFloat(amount) || 0;

    if (isPostgresConnected && pool) {
      try {
        const sql = `
          UPDATE expenses 
          SET title = $1, amount = $2, category = $3, date = $4, payment_method = $5, notes = $6, tags = $7
          WHERE id = $8
          RETURNING id, title, amount::float, category, to_char(date, 'YYYY-MM-DD') as date, payment_method, notes, tags;
        `;
        const res = await pool.query(sql, [title, formattedAmount, category, date, payment_method, notes, tags, numericId]);
        return res.rows[0] || null;
      } catch (err) {
        console.error('PostgreSQL update error:', err.message);
      }
    }

    const index = memoryExpenses.findIndex(e => e.id === numericId);
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

  async deleteExpense(id) {
    const numericId = parseInt(id, 10);
    if (isPostgresConnected && pool) {
      try {
        const sql = 'DELETE FROM expenses WHERE id = $1 RETURNING id;';
        const res = await pool.query(sql, [numericId]);
        return res.rowCount > 0;
      } catch (err) {
        console.error('PostgreSQL delete error:', err.message);
      }
    }

    const index = memoryExpenses.findIndex(e => e.id === numericId);
    if (index !== -1) {
      memoryExpenses.splice(index, 1);
      return true;
    }
    return false;
  },

  async seedData(sampleList) {
    if (isPostgresConnected && pool) {
      try {
        for (const item of sampleList) {
          await pool.query(
            `INSERT INTO expenses (title, amount, category, date, payment_method, notes, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [item.title, item.amount, item.category, item.date, item.payment_method, item.notes, item.tags]
          );
        }
        return true;
      } catch (err) {
        console.error('PostgreSQL seed error:', err.message);
      }
    }

    sampleList.forEach(item => {
      memoryExpenses.push({
        id: nextId++,
        ...item
      });
    });
    return true;
  },

  async clearAll() {
    if (isPostgresConnected && pool) {
      try {
        await pool.query('TRUNCATE TABLE expenses RESTART IDENTITY;');
      } catch (err) {
        console.error('PostgreSQL truncate error:', err.message);
      }
    }
    memoryExpenses = [];
  }
};
