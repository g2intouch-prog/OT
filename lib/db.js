const { db } = require('@vercel/postgres');
const crypto = require('crypto');

// In-memory fallback if database credentials are not available
const inMemoryDb = {
  users: [
    { id: 'usr-admin', username: 'admin@vault.team', role: 'admin', status: 'active', password: 'password123' },
    { id: 'usr-user1', username: 'user@vault.team', role: 'user', status: 'active', password: 'password123' },
    { id: 'usr-user2', username: 'revoked@vault.team', role: 'user', status: 'revoked', password: 'password123' }
  ],
  sessions: {},
  records: []
};

// Ensure database tables exist
async function initDb() {
  if (!process.env.POSTGRES_URL) {
    console.warn('POSTGRES_URL environment variable is missing. Running with in-memory DB mock.');
    return;
  }
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        status VARCHAR(50)
      )
    `);

    // Create sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        expires_at TIMESTAMP
      )
    `);

    // Create encrypted records table
    await db.query(`
      CREATE TABLE IF NOT EXISTS encrypted_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        ciphertext TEXT,
        iv TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin and user if not exists
    const adminCheck = await db.query("SELECT * FROM users WHERE username = 'admin@vault.team'");
    if (adminCheck.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status) VALUES ($1, $2, $3, $4, $5)",
        ['usr-admin', 'admin@vault.team', 'password123', 'admin', 'active']
      );
    }

    const userCheck = await db.query("SELECT * FROM users WHERE username = 'user@vault.team'");
    if (userCheck.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status) VALUES ($1, $2, $3, $4, $5)",
        ['usr-user1', 'user@vault.team', 'password123', 'user', 'active']
      );
    }
  } catch (err) {
    console.error('Failed to initialize database tables:', err.message);
  }
}

// Call initDb asynchronously
initDb();

/**
 * Validates a session token or cookie.
 * Returns the session object { user_id, token, expires_at } or null.
 */
async function verifyUserSession(req) {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-session-token']) {
    token = req.headers['x-session-token'];
  }

  if (!token) return null;

  if (process.env.POSTGRES_URL) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM sessions WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP",
        [token]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error('verifyUserSession DB error:', e);
      return null;
    }
  } else {
    const session = inMemoryDb.sessions[token];
    if (session && session.expires_at > Date.now()) {
      return session;
    }
    return null;
  }
}

/**
 * Returns user status ('active' or 'revoked') and role ('admin' or 'user').
 */
async function checkUserStatusAndRole(userId) {
  if (process.env.POSTGRES_URL) {
    try {
      const { rows } = await db.query("SELECT status, role FROM users WHERE id = $1", [userId]);
      if (rows.length > 0) {
        return { status: rows[0].status, role: rows[0].role };
      }
      return null;
    } catch (e) {
      console.error('checkUserStatusAndRole DB error:', e);
      return null;
    }
  } else {
    const user = inMemoryDb.users.find(u => u.id === userId);
    if (user) {
      return { status: user.status, role: user.role };
    }
    return null;
  }
}

/**
 * Stores data payloads containing user_id, ciphertext, iv, and created_at.
 */
async function saveEncryptedEntry(userId, encryptedPayload) {
  const { ciphertext, iv } = encryptedPayload;
  if (!ciphertext || !iv) {
    throw new Error('Ciphertext and IV are required.');
  }

  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query(
      "INSERT INTO encrypted_records (user_id, ciphertext, iv) VALUES ($1, $2, $3) RETURNING id, created_at",
      [userId, ciphertext, iv]
    );
    return {
      id: rows[0].id,
      user_id: userId,
      ciphertext,
      iv,
      created_at: rows[0].created_at
    };
  } else {
    const newRecord = {
      id: inMemoryDb.records.length + 1,
      user_id: userId,
      ciphertext,
      iv,
      created_at: new Date().toISOString()
    };
    inMemoryDb.records.push(newRecord);
    return newRecord;
  }
}

/**
 * Accessible only by admins; returns list of all team accounts, roles, statuses.
 */
async function getAllUsers() {
  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query("SELECT id, username, role, status FROM users");
    return rows;
  } else {
    return inMemoryDb.users.map(u => ({ id: u.id, username: u.username, role: u.role, status: u.status }));
  }
}

/**
 * Modifies status of the target user if the updater is an admin.
 */
async function updateUserStatus(adminUserId, targetUserId, newStatus) {
  // Validate that updater is admin
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrator can toggle user status.');
  }

  if (!['active', 'revoked'].includes(newStatus)) {
    throw new Error('Invalid status. Must be active or revoked.');
  }

  if (process.env.POSTGRES_URL) {
    const res = await db.query("UPDATE users SET status = $1 WHERE id = $2", [newStatus, targetUserId]);
    if (res.rowCount === 0) throw new Error('User not found.');
    return true;
  } else {
    const user = inMemoryDb.users.find(u => u.id === targetUserId);
    if (!user) throw new Error('User not found.');
    user.status = newStatus;
    return true;
  }
}

/**
 * Helper to create a new session (useful for login API)
 */
async function createSession(userId, expiryMinutes = 60) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  if (process.env.POSTGRES_URL) {
    await db.query(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)",
      [token, userId, expiresAt]
    );
  } else {
    inMemoryDb.sessions[token] = {
      token,
      user_id: userId,
      expires_at: expiresAt.getTime()
    };
  }
  return token;
}

/**
 * Helper to authenticate user (username & password)
 */
async function authenticateUser(username, password) {
  let user = null;
  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (rows.length > 0) user = rows[0];
  } else {
    user = inMemoryDb.users.find(u => u.username === username);
  }

  if (user && user.password === password) {
    return user;
  }
  return null;
}

module.exports = {
  verifyUserSession,
  checkUserStatusAndRole,
  saveEncryptedEntry,
  getAllUsers,
  updateUserStatus,
  createSession,
  authenticateUser
};
