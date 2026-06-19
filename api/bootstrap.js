const db = require('../lib/db');

module.exports = async (req, res) => {
  // Allow OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const session = await db.verifyUserSession(req);
    if (!session) {
      return res.status(403).json({ action: 'SELF_DESTRUCT', error: 'Invalid or missing session.' });
    }

    const user = await db.checkUserStatusAndRole(session.user_id);
    if (!user) {
      return res.status(403).json({ action: 'SELF_DESTRUCT', error: 'User does not exist.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ action: 'SELF_DESTRUCT', error: 'Access Revoked' });
    }

    // Vault key is held strictly in Vercel env and only delivered to active sessions
    const vaultKey = process.env.TEAM_VAULT_KEY || 'dGhpcy1pcy1hLXNlY3JldC0zMi1ieXRlLWtleS0xMjM='; // Default 32-byte key for development if env is missing
    
    // Feature flag: SHOW_TUTORIAL controlled by NEXT_PUBLIC_SHOW_TUTORIAL env var or default to true
    const showTutorial = process.env.NEXT_PUBLIC_SHOW_TUTORIAL !== 'false';

    return res.status(200).json({
      action: 'PROCEED',
      vaultKey,
      role: user.role,
      showTutorial
    });
  } catch (err) {
    console.error('Bootstrap API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
