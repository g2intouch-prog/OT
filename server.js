const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { db } = require('@vercel/postgres');
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 3080;

// Base32 Decoder (RFC 4648)
function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  str = str.replace(/=+$/, '').toUpperCase();
  const length = str.length;
  let bits = 0;
  let value = 0;
  let index = 0;
  const buffer = Buffer.alloc(Math.floor((length * 5) / 8));
  for (let i = 0; i < length; i++) {
    const val = alphabet.indexOf(str.charAt(i));
    if (val === -1) throw new Error('Invalid base32 character');
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      buffer[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  return buffer;
}

// Generate HOTP (HMAC-SHA1)
function generateHOTP(secretBuffer, counter) {
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeUInt32BE(0, 0);
  counterBuf.writeUInt32BE(counter, 4);

  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuf);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const binary = ((digest[offset] & 0x7f) << 24) |
                 ((digest[offset + 1] & 0xff) << 16) |
                 ((digest[offset + 2] & 0xff) << 8) |
                 (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

// Verify TOTP (RFC 6238)
function verifyTOTP(secret, token, window = 1) {
  try {
    const secretBuffer = base32Decode(secret);
    const timeStep = 30;
    const currentTime = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(currentTime / timeStep);

    for (let i = -window; i <= window; i++) {
      const calculatedOtp = generateHOTP(secretBuffer, currentCounter + i);
      if (calculatedOtp === token.trim()) {
        return true;
      }
    }
  } catch (err) {
    console.error('TOTP verification error:', err.message);
  }
  return false;
}

// Generate random Base32 secret
function generateSecret(length = 16) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(randomBytes[i] % alphabet.length);
  }
  return result;
}

// Enable JSON body parsing
app.use(express.json());

// Serve service worker without caching so browser can detect updates immediately
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS config (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified INTEGER DEFAULT 0,
        date TEXT,
        data TEXT
      )
    `);

    const schemaRes = await db.query("SELECT value FROM config WHERE key = 'schema'");
    if (schemaRes.rowCount === 0) {
      const defaultSchema = JSON.stringify([
        { id: 'date', title: 'Date', type: 'date' },
        { id: 'item_name', title: 'Item Name', type: 'text' },
        { id: 'quantity', title: 'Quantity', type: 'number' },
        { id: 'remarks', title: 'Remarks', type: 'text' }
      ]);
      await db.query("INSERT INTO config (key, value) VALUES ('schema', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [defaultSchema]);
    }

    const userRes = await db.query("SELECT value FROM config WHERE key = 'admin_user'");
    if (userRes.rowCount === 0) {
      await db.query("INSERT INTO config (key, value) VALUES ('admin_user', 'admin') ON CONFLICT (key) DO NOTHING");
    }

    const passRes = await db.query("SELECT value FROM config WHERE key = 'admin_pass'");
    if (passRes.rowCount === 0) {
      await db.query("INSERT INTO config (key, value) VALUES ('admin_pass', 'password') ON CONFLICT (key) DO NOTHING");
    }

    console.log('PostgreSQL database check complete.');
  } catch (err) {
    console.error('Error initializing PostgreSQL:', err.message);
  }
}

// Recalculate and re-serialize all records sequentially (sorted by date and TimeOB)
async function recalculateSerials() {
  const { rows: records } = await db.query("SELECT * FROM records");

  const parsedRecords = records.map(row => {
    let dataObj = {};
    try {
      dataObj = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    } catch (e) {
      console.error('Error parsing data for row', row.id, e);
    }
    return {
      id: row.id,
      date: row.date || '',
      timeob: dataObj.timeob || '',
      data: dataObj
    };
  });

  // Helper to convert 12h time string (e.g. "03:15 PM" or "12:05 AM") to minutes since midnight
  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 9999;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (!match) return 9999;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  }

  // Sort: 1st by date ascending, 2nd by time of birth ascending
  parsedRecords.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    
    const timeA = parseTimeToMinutes(a.timeob);
    const timeB = parseTimeToMinutes(b.timeob);
    return timeA - timeB;
  });

  const annualCounters = {};
  const monthlyCounters = {};

  for (const rec of parsedRecords) {
    if (!rec.date) continue;
    const parts = rec.date.split('-');
    if (parts.length !== 3) continue;
    const year = parts[0];
    const month = parts[1];
    const yearMonth = `${year}-${month}`;

    annualCounters[year] = (annualCounters[year] || 0) + 1;
    monthlyCounters[yearMonth] = (monthlyCounters[yearMonth] || 0) + 1;

    rec.data.annual_serial = annualCounters[year];
    rec.data.monthly_sl_no = monthlyCounters[yearMonth];
  }

  await db.query("BEGIN");
  try {
    for (const rec of parsedRecords) {
      await db.query(
        "UPDATE records SET date = $1, data = $2 WHERE id = $3",
        [rec.date, JSON.stringify(rec.data), rec.id]
      );
    }
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
}

// Basic auth middleware (checking dynamic header)
function checkAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (token === 'Bearer authenticated-token-admin') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
}

// In-memory map for temporary login sessions during 2-step TOTP flow
const tempAuthSessions = new Map();

// API Routes

// Get TOTP Status
app.get('/api/settings/totp/status', checkAuth, async (req, res) => {
  try {
    const { rows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
    const enabled = rows.length > 0 ? rows[0].value === '1' : false;
    res.json({ enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Setup TOTP (Generate temporary secret and QR Url)
app.get('/api/settings/totp/setup', checkAuth, async (req, res) => {
  try {
    const secret = generateSecret();
    await db.query("INSERT INTO config (key, value) VALUES ('totp_temp_secret', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [secret]);
    const otpauthUrl = `otpauth://totp/Cloud%20Data%20Entry%20Hub:admin?secret=${secret}&issuer=Cloud%20Data%20Entry%20Hub`;
    res.json({ 
      secret, 
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enable TOTP (Verify and save)
app.post('/api/settings/totp/enable', checkAuth, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Verification code is required.' });

  try {
    const { rows } = await db.query("SELECT value FROM config WHERE key = 'totp_temp_secret'");
    if (rows.length === 0) return res.status(400).json({ error: '2FA setup was not initiated.' });

    const tempSecret = rows[0].value;
    const isValid = verifyTOTP(tempSecret, code);

    if (isValid) {
      await db.query("BEGIN");
      await db.query("INSERT INTO config (key, value) VALUES ('totp_secret', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [tempSecret]);
      await db.query("INSERT INTO config (key, value) VALUES ('totp_enabled', '1') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value");
      await db.query("DELETE FROM config WHERE key = 'totp_temp_secret'");
      await db.query("COMMIT");
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid verification code. Please check your app and try again.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Disable TOTP
app.post('/api/settings/totp/disable', checkAuth, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'TOTP code is required.' });

  try {
    const { rows: secretRows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
    if (secretRows.length > 0) {
      const secret = secretRows[0].value;
      const isValid = verifyTOTP(secret, code);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid TOTP code.' });
      }
    }

    await db.query("BEGIN");
    await db.query("INSERT INTO config (key, value) VALUES ('totp_enabled', '0') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value");
    await db.query("DELETE FROM config WHERE key = 'totp_secret'");
    await db.query("DELETE FROM config WHERE key = 'totp_temp_secret'");
    await db.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get TOTP Enabled Status (unauthenticated, to show TOTP field directly in UI)
app.get('/api/login/totp-status', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
    const enabled = rows.length > 0 ? rows[0].value === '1' : false;
    res.json({ enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication route
app.post('/api/login', async (req, res) => {
  const { username, password, code } = req.body;
  try {
    const { rows: userRows } = await db.query("SELECT value FROM config WHERE key = 'admin_user'");
    const { rows: passRows } = await db.query("SELECT value FROM config WHERE key = 'admin_pass'");
    
    const dbUser = userRows.length > 0 ? userRows[0].value : 'admin';
    const dbPass = passRows.length > 0 ? passRows[0].value : 'password';

    if (username === dbUser && password === dbPass) {
      const { rows: totpRows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
      const isTotpEnabled = totpRows.length > 0 ? totpRows[0].value === '1' : false;
      
      if (isTotpEnabled) {
        if (code) {
          const { rows: secretRows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
          if (secretRows.length === 0) {
            return res.status(500).json({ error: '2FA secret not found. Please setup again.' });
          }
          const isValid = verifyTOTP(secretRows[0].value, code);
          if (isValid) {
            res.json({ success: true, requireOtp: false, token: 'authenticated-token-admin' });
          } else {
            res.status(400).json({ error: 'Invalid 2FA Authenticator Code.' });
          }
        } else {
          const tempToken = 'temp-' + crypto.randomBytes(16).toString('hex');
          tempAuthSessions.set(tempToken, {
            username,
            expires: Date.now() + 5 * 60 * 1000
          });
          res.json({ success: true, requireOtp: true, tempToken });
        }
      } else {
        res.json({ success: true, requireOtp: false, token: 'authenticated-token-admin' });
      }
    } else {
      res.status(400).json({ error: 'Invalid ID or Password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP route
app.post('/api/login/verify-otp', async (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ error: 'Temporary token and 2FA code are required.' });
  }

  const session = tempAuthSessions.get(tempToken);
  if (!session) {
    return res.status(400).json({ error: 'Invalid or expired login session. Please log in again.' });
  }

  if (Date.now() > session.expires) {
    tempAuthSessions.delete(tempToken);
    return res.status(400).json({ error: 'Login session expired. Please log in again.' });
  }

  try {
    const { rows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
    if (rows.length === 0) {
      return res.status(500).json({ error: '2FA settings are corrupted. Please contact administrator.' });
    }

    const secret = rows[0].value;
    const isValid = verifyTOTP(secret, code);

    if (isValid) {
      tempAuthSessions.delete(tempToken);
      res.json({ success: true, token: 'authenticated-token-admin' });
    } else {
      res.status(400).json({ error: 'Invalid 2FA code. Please check your app and try again.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update credentials route
app.post('/api/settings/credentials', checkAuth, async (req, res) => {
  const { currentPassword, newUsername, newPassword, code } = req.body;
  
  if (!currentPassword || !newUsername || !newPassword) {
    return res.status(400).json({ error: 'Current password, new User ID, and new Password are required.' });
  }

  try {
    const { rows: totpRows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
    const isTotpEnabled = totpRows.length > 0 ? totpRows[0].value === '1' : false;

    if (!isTotpEnabled) {
      return res.status(400).json({ error: 'Two-Factor Authentication (2FA) must be enabled before you can change your admin credentials.' });
    }

    if (!code) {
      return res.status(400).json({ error: '2FA verification code is required.' });
    }

    const { rows: secretRows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
    if (secretRows.length === 0) {
      return res.status(500).json({ error: '2FA secret not found. Please re-enable 2FA.' });
    }

    const isValid = verifyTOTP(secretRows[0].value, code);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid 2FA code.' });
    }

    const { rows: passRows } = await db.query("SELECT value FROM config WHERE key = 'admin_pass'");
    const dbPass = passRows.length > 0 ? passRows[0].value : 'password';
    if (currentPassword !== dbPass) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }
    
    await db.query("BEGIN");
    await db.query("INSERT INTO config (key, value) VALUES ('admin_user', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [newUsername.trim()]);
    await db.query("INSERT INTO config (key, value) VALUES ('admin_pass', $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [newPassword]);
    await db.query("COMMIT");
    res.json({ success: true });
  } catch (e) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: 'Failed to update credentials: ' + e.message });
  }
});

// Get current form schema
app.get('/api/schema', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT value FROM config WHERE key = 'schema'");
    res.json(JSON.parse(rows.length > 0 ? rows[0].value : '[]'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update form schema
app.post('/api/schema', checkAuth, async (req, res) => {
  const schema = req.body;
  if (!Array.isArray(schema)) {
    return res.status(400).json({ error: 'Schema must be an array of fields' });
  }

  try {
    await db.query("INSERT INTO config (key, value) VALUES ('schema', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [JSON.stringify(schema)]);
    res.json({ success: true, schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM records ORDER BY date DESC, id DESC");
    const parsedRows = rows.map(row => ({
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    }));
    res.json(parsedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Push/sync offline drafts
app.post('/api/entries/push', checkAuth, async (req, res) => {
  const drafts = req.body;
  if (!Array.isArray(drafts)) {
    return res.status(400).json({ error: 'Drafts must be an array' });
  }

  if (drafts.length === 0) {
    return res.json({ success: true, count: 0 });
  }

  try {
    await db.query("BEGIN");
    for (const draft of drafts) {
      const recordDate = draft.date || new Date().toISOString().split('T')[0];
      const verified = draft.verified ? 1 : 0;
      const recordData = JSON.stringify(draft.data || {});
      await db.query(
        "INSERT INTO records (date, verified, data) VALUES ($1, $2, $3)",
        [recordDate, verified, recordData]
      );
    }
    await db.query("COMMIT");
    await recalculateSerials();
    res.json({ success: true, count: drafts.length });
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: 'Database transaction failed: ' + err.message });
  }
});

// Verify a record
app.post('/api/entries/verify/:id', checkAuth, async (req, res) => {
  const id = req.params.id;
  const { verified } = req.body;
  
  try {
    const result = await db.query("UPDATE records SET verified = $1 WHERE id = $2", [verified ? 1 : 0, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a record
app.post('/api/entries/delete/:id', checkAuth, async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query("DELETE FROM records WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      await recalculateSerials();
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a record and recalculate serials
app.post('/api/entries/update/:id', checkAuth, async (req, res) => {
  const id = req.params.id;
  const { date, data } = req.body;

  if (!date || !data) {
    return res.status(400).json({ error: 'Date and Data are required' });
  }

  try {
    await db.query(
      "UPDATE records SET date = $1, data = $2 WHERE id = $3",
      [date, JSON.stringify(data), id]
    );
    await recalculateSerials();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record: ' + err.message });
  }
});

// Verify TOTP code for sensitive actions (authenticated)
app.post('/api/settings/totp/verify-action', checkAuth, async (req, res) => {
  const { code } = req.body;
  try {
    const { rows: totpRows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
    const isTotpEnabled = totpRows.length > 0 ? totpRows[0].value === '1' : false;

    if (isTotpEnabled) {
      if (!code) {
        return res.status(400).json({ error: '2FA Authenticator Code is required.' });
      }
      const { rows: secretRows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
      if (secretRows.length === 0) {
        return res.status(500).json({ error: '2FA secret not found.' });
      }
      const isValid = verifyTOTP(secretRows[0].value, code);
      if (isValid) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid 2FA Authenticator Code.' });
      }
    } else {
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset database and serial sequence (Postgres SQL syntax)
async function executeClearDatabase(res) {
  try {
    await db.query("BEGIN");
    await db.query("DELETE FROM records");
    await db.query("ALTER SEQUENCE records_id_seq RESTART WITH 1");
    await db.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
}

// Delete all records (requires TOTP verification if enabled)
app.post('/api/entries/clear-all', checkAuth, async (req, res) => {
  const { code } = req.body;
  try {
    const { rows: totpRows } = await db.query("SELECT value FROM config WHERE key = 'totp_enabled'");
    const isTotpEnabled = totpRows.length > 0 ? totpRows[0].value === '1' : false;

    if (isTotpEnabled) {
      if (!code) {
        return res.status(400).json({ error: '2FA Authenticator Code is required to clear database.' });
      }
      const { rows: secretRows } = await db.query("SELECT value FROM config WHERE key = 'totp_secret'");
      if (secretRows.length === 0) {
        return res.status(500).json({ error: '2FA secret not found.' });
      }
      const isValid = verifyTOTP(secretRows[0].value, code);
      if (isValid) {
        await executeClearDatabase(res);
      } else {
        res.status(400).json({ error: 'Invalid 2FA Authenticator Code.' });
      }
    } else {
      await executeClearDatabase(res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vercel Blob backup/export endpoint
app.post('/api/backup/export', checkAuth, async (req, res) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(400).json({ 
      error: 'Vercel Blob token is missing. Please configure the BLOB_READ_WRITE_TOKEN environment variable in your Vercel Dashboard (or in a local .env file when testing locally).' 
    });
  }
  try {
    const { rows } = await db.query("SELECT * FROM records ORDER BY date DESC, id DESC");
    
    // Parse records into simple JSON array or CSV
    const csvHeader = 'ID,Created At,Verified,Date,Data\n';
    const csvRows = rows.map(r => {
      const parsedData = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      const dataEscaped = JSON.stringify(parsedData).replace(/"/g, '""');
      return `${r.id},"${r.created_at}",${r.verified},"${r.date}","${dataEscaped}"`;
    }).join('\n');
    const csvContent = csvHeader + csvRows;

    const filename = `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;
    
    const blob = await put(filename, csvContent, {
      access: 'public',
      contentType: 'text/csv',
    });

    res.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('Backup/export failed:', err.message);
    res.status(500).json({ error: 'Failed to generate cloud backup: ' + err.message });
  }
});

// Fallback to serve index.html for SPA router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  });
} else {
  // Always initialize schema in production
  initializeDatabase();
}

module.exports = app;
