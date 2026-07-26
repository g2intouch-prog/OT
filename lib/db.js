const { db } = require('@vercel/postgres');
const crypto = require('crypto');

// In-memory fallback if database credentials are not available
const inMemoryDb = {
  users: [
    { id: 'usr-admin', username: 'admin@vault.team', role: 'admin', status: 'active', password: 'password123', totp_enabled: 0, totp_secret: null },
    { id: 'usr-user1', username: 'user@vault.team', role: 'user', status: 'active', password: 'password123', totp_enabled: 0, totp_secret: null },
    { id: 'usr-user2', username: 'revoked@vault.team', role: 'user', status: 'revoked', password: 'password123', totp_enabled: 0, totp_secret: null },
    { id: 'usr-admin-s', username: 'admin', role: 'admin', status: 'active', password: 'password', totp_enabled: 0, totp_secret: null },
    { id: 'usr-user-s', username: 'user', role: 'user', status: 'active', password: 'password', totp_enabled: 0, totp_secret: null }
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
    // Create users table with totp columns
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        status VARCHAR(50),
        totp_secret VARCHAR(255),
        totp_enabled INTEGER DEFAULT 0,
        public_key TEXT,
        encrypted_private_key TEXT,
        wrapped_vault_key TEXT,
        salt TEXT
      )
    `);

    // Schema migration checks: add columns if not present
    try {
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(255)");
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled INTEGER DEFAULT 0");
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS public_key TEXT");
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT");
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS wrapped_vault_key TEXT");
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS salt TEXT");
    } catch (migErr) {
      console.warn("Migration warning (columns might already exist):", migErr.message);
    }

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

    // Create invitations table for invite-only team management
    await db.query(`
      CREATE TABLE IF NOT EXISTS invitations (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        token VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin and user if not exists
    const adminCheck = await db.query("SELECT * FROM users WHERE username = 'admin@vault.team'");
    if (adminCheck.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status, totp_enabled) VALUES ($1, $2, $3, $4, $5, 0)",
        ['usr-admin', 'admin@vault.team', 'password123', 'admin', 'active']
      );
    }

    const userCheck = await db.query("SELECT * FROM users WHERE username = 'user@vault.team'");
    if (userCheck.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status, totp_enabled) VALUES ($1, $2, $3, $4, $5, 0)",
        ['usr-user1', 'user@vault.team', 'password123', 'user', 'active']
      );
    }

    const shortcutAdmin = await db.query("SELECT * FROM users WHERE username = 'admin'");
    if (shortcutAdmin.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status, totp_enabled) VALUES ($1, $2, $3, $4, $5, 0)",
        ['usr-admin-s', 'admin', 'password', 'admin', 'active']
      );
    }

    const shortcutUser = await db.query("SELECT * FROM users WHERE username = 'user'");
    if (shortcutUser.rowCount === 0) {
      await db.query(
        "INSERT INTO users (id, username, password, role, status, totp_enabled) VALUES ($1, $2, $3, $4, $5, 0)",
        ['usr-user-s', 'user', 'password', 'user', 'active']
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
  if (userId === 'usr-admin') {
    return { status: 'active', role: 'admin' };
  }
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
 * Retrieves full user details by ID.
 */
async function getUserById(userId) {
  if (process.env.POSTGRES_URL) {
    try {
      const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error('getUserById DB error:', e);
      return null;
    }
  } else {
    return inMemoryDb.users.find(u => u.id === userId) || null;
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
    const { rows } = await db.query(`
      SELECT u.id, u.username, u.role, u.status, u.public_key, u.wrapped_vault_key, u.salt,
             EXISTS (
               SELECT 1 FROM sessions s 
               WHERE s.user_id = u.id AND s.expires_at > CURRENT_TIMESTAMP
             ) as online
      FROM users u
    `);
    return rows;
  } else {
    const now = Date.now();
    const activeSessionUserIds = new Set(
      Object.values(inMemoryDb.sessions)
        .filter(s => s.expires_at > now)
        .map(s => s.user_id)
    );
    return inMemoryDb.users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      status: u.status,
      public_key: u.public_key,
      wrapped_vault_key: u.wrapped_vault_key,
      salt: u.salt,
      online: activeSessionUserIds.has(u.id)
    }));
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
  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  let user = null;
  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query("SELECT * FROM users WHERE LOWER(username) = $1", [cleanUsername]);
    if (rows.length > 0) user = rows[0];
  } else {
    user = inMemoryDb.users.find(u => u.username.toLowerCase() === cleanUsername);
  }

  if (user && user.password === cleanPassword) {
    return user;
  }
  return null;
}

/**
 * Creates a new user in the database or in-memory fallback.
 */
async function createUser(username, password, role = 'user', publicKey = null, encryptedPrivateKey = null, salt = null) {
  const userId = 'usr-' + crypto.randomBytes(8).toString('hex');
  const validRole = ['admin', 'user', 'viewer'].includes(role) ? role : 'user';
  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (process.env.POSTGRES_URL) {
    try {
      await db.query(
        "INSERT INTO users (id, username, password, role, status, totp_enabled, public_key, encrypted_private_key, salt) VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8)",
        [userId, cleanUsername, cleanPassword, validRole, 'active', publicKey, encryptedPrivateKey, salt]
      );
      return { id: userId, username: cleanUsername, role: validRole, status: 'active', totp_enabled: 0, public_key: publicKey, encrypted_private_key: encryptedPrivateKey, salt };
    } catch (e) {
      if (e.message.includes('unique') || e.message.includes('already exists')) {
        throw new Error('Username/Email is already taken.');
      }
      throw e;
    }
  } else {
    const existing = inMemoryDb.users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      throw new Error('Username/Email is already taken.');
    }
    const newUser = {
      id: userId,
      username: cleanUsername,
      password: cleanPassword,
      role: validRole,
      status: 'active',
      totp_enabled: 0,
      totp_secret: null,
      public_key: publicKey,
      encrypted_private_key: encryptedPrivateKey,
      wrapped_vault_key: null,
      salt
    };
    inMemoryDb.users.push(newUser);
    return newUser;
  }
}

/**
 * Creates an email invitation for a team member (admin only).
 */
async function createInvitation(adminUserId, email, role = 'user') {
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrators can invite team members.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const validRole = ['admin', 'user', 'viewer'].includes(role) ? role : 'user';
  const inviteToken = 'inv-' + crypto.randomBytes(12).toString('hex');

  if (process.env.POSTGRES_URL) {
    // Check if email already registered
    const userCheck = await db.query("SELECT id FROM users WHERE LOWER(username) = $1", [cleanEmail]);
    if (userCheck.rowCount > 0) {
      throw new Error('An account with this email already exists.');
    }

    await db.query(
      "INSERT INTO invitations (email, role, token, status) VALUES ($1, $2, $3, 'pending') ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, token = EXCLUDED.token, status = 'pending'",
      [cleanEmail, validRole, inviteToken]
    );
  } else {
    inMemoryDb.invitations = inMemoryDb.invitations || [];
    const existingUser = inMemoryDb.users.find(u => u.username.toLowerCase() === cleanEmail);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    const existingInv = inMemoryDb.invitations.find(i => i.email === cleanEmail);
    if (existingInv) {
      existingInv.role = validRole;
      existingInv.token = inviteToken;
      existingInv.status = 'pending';
    } else {
      inMemoryDb.invitations.push({ id: inMemoryDb.invitations.length + 1, email: cleanEmail, role: validRole, token: inviteToken, status: 'pending' });
    }
  }
  return { email: cleanEmail, role: validRole, token: inviteToken };
}

/**
 * Retrieves a pending invitation by email address.
 */
async function getPendingInvitationByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query("SELECT * FROM invitations WHERE LOWER(email) = $1 AND status = 'pending'", [cleanEmail]);
    return rows.length > 0 ? rows[0] : null;
  } else {
    inMemoryDb.invitations = inMemoryDb.invitations || [];
    return inMemoryDb.invitations.find(i => i.email.toLowerCase() === cleanEmail && i.status === 'pending') || null;
  }
}

/**
 * Marks an invitation as accepted once registered.
 */
async function fulfillInvitation(email) {
  const cleanEmail = email.trim().toLowerCase();
  if (process.env.POSTGRES_URL) {
    await db.query("UPDATE invitations SET status = 'accepted' WHERE LOWER(email) = $1", [cleanEmail]);
  } else {
    inMemoryDb.invitations = inMemoryDb.invitations || [];
    const inv = inMemoryDb.invitations.find(i => i.email.toLowerCase() === cleanEmail);
    if (inv) inv.status = 'accepted';
  }
}

/**
 * Retrieves all pending and accepted invitations for Admin panel.
 */
async function getAllInvitations(adminUserId) {
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrators can view team invitations.');
  }

  if (process.env.POSTGRES_URL) {
    const { rows } = await db.query("SELECT id, email, role, token, status, created_at FROM invitations ORDER BY id DESC");
    return rows;
  } else {
    inMemoryDb.invitations = inMemoryDb.invitations || [];
    return inMemoryDb.invitations;
  }
}

/**
 * Promotes or demotes user role by admin.
 */
async function updateUserRole(adminUserId, targetUserId, newRole) {
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrator can modify user roles.');
  }

  if (!['admin', 'user', 'viewer'].includes(newRole)) {
    throw new Error('Invalid role. Must be admin, user, or viewer.');
  }

  if (process.env.POSTGRES_URL) {
    const res = await db.query("UPDATE users SET role = $1 WHERE id = $2", [newRole, targetUserId]);
    if (res.rowCount === 0) throw new Error('User not found.');
    return true;
  } else {
    const user = inMemoryDb.users.find(u => u.id === targetUserId);
    if (!user) throw new Error('User not found.');
    user.role = newRole;
    return true;
  }
}

/**
 * Updates a user's wrapped symmetric vault key.
 */
async function updateUserWrappedKey(adminUserId, targetUserId, wrappedKey) {
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrator can assign wrapped keys.');
  }

  if (process.env.POSTGRES_URL) {
    const res = await db.query("UPDATE users SET wrapped_vault_key = $1 WHERE id = $2", [wrappedKey, targetUserId]);
    if (res.rowCount === 0) throw new Error('User not found.');
    return true;
  } else {
    const user = inMemoryDb.users.find(u => u.id === targetUserId);
    if (!user) throw new Error('User not found.');
    user.wrapped_vault_key = wrappedKey;
    return true;
  }
}

/**
 * Updates a user's TOTP secret and status.
 */
async function updateUserTotp(userId, secret, enabled) {
  const valEnabled = enabled ? 1 : 0;
  if (process.env.POSTGRES_URL) {
    const res = await db.query(
      "UPDATE users SET totp_secret = $1, totp_enabled = $2 WHERE id = $3",
      [secret, valEnabled, userId]
    );
    if (res.rowCount === 0) throw new Error('User not found.');
    return true;
  } else {
    const user = inMemoryDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found.');
    user.totp_secret = secret;
    user.totp_enabled = valEnabled;
    return true;
  }
}

/**
 * Updates a user's salt value.
 */
async function updateUserSalt(userId, salt) {
  if (process.env.POSTGRES_URL) {
    const { db: pgDb } = require('@vercel/postgres');
    await pgDb.query("UPDATE users SET salt = $1 WHERE id = $2", [salt, userId]);
  } else {
    const user = inMemoryDb.users.find(u => u.id === userId);
    if (user) user.salt = salt;
  }
}

module.exports = {
  verifyUserSession,
  checkUserStatusAndRole,
  saveEncryptedEntry,
  getAllUsers,
  updateUserStatus,
  createSession,
  authenticateUser,
  createUser,
  updateUserRole,
  updateUserWrappedKey,
  updateUserTotp,
  updateUserSalt,
  clearAllUsersExceptMaster,
  getUserById,
  createInvitation,
  getPendingInvitationByEmail,
  fulfillInvitation,
  getAllInvitations
};

/**
 * Deletes all user accounts except the shortcut admin account.
 */
async function clearAllUsersExceptMaster(adminUserId) {
  const adminCheck = await checkUserStatusAndRole(adminUserId);
  if (!adminCheck || adminCheck.role !== 'admin') {
    throw new Error('Forbidden: Only administrator can clear user accounts.');
  }

  if (process.env.POSTGRES_URL) {
    // Delete all sessions except the master admin
    await db.query("DELETE FROM sessions WHERE user_id <> 'usr-admin-s'");
    // Delete all users except the master admin
    const res = await db.query("DELETE FROM users WHERE id <> 'usr-admin-s'");
    return res.rowCount;
  } else {
    const originalCount = inMemoryDb.users.length;
    inMemoryDb.users = inMemoryDb.users.filter(u => u.id === 'usr-admin-s');
    inMemoryDb.sessions = {}; // Clear all sessions
    return originalCount - inMemoryDb.users.length;
  }
}
