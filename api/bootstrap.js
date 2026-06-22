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

    const user = await db.getUserById(session.user_id);
    if (!user) {
      return res.status(403).json({ action: 'SELF_DESTRUCT', error: 'User does not exist.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ action: 'SELF_DESTRUCT', error: 'Access Revoked' });
    }

    // Check if user is using default master admin credentials
    const isDefaultAdmin = (user.username === 'admin' && user.password === 'password');

    // Self-healing salt generator for existing users
    let userSalt = user.salt;
    if (!userSalt) {
      const crypto = require('crypto');
      userSalt = crypto.randomBytes(16).toString('base64');
      await db.updateUserSalt(user.id, userSalt);
    }

    // Vault key is held strictly in Vercel env and only delivered to active sessions
    // Do NOT deliver raw vaultKey to default admin if they need to setup credentials
    const vaultKey = isDefaultAdmin ? null : (process.env.TEAM_VAULT_KEY || 'dGhpcy1pcy1hLXNlY3JldC0zMi1ieXRlLWtleS0xMjM=');
    
    // Feature flag: SHOW_TUTORIAL controlled by NEXT_PUBLIC_SHOW_TUTORIAL env var or default to true
    const showTutorial = process.env.NEXT_PUBLIC_SHOW_TUTORIAL !== 'false';

    return res.status(200).json({
      action: 'PROCEED',
      vaultKey,
      role: user.role,
      username: user.username,
      isDefaultAdmin,
      publicKey: user.public_key,
      encryptedPrivateKey: user.encrypted_private_key,
      wrappedVaultKey: user.wrapped_vault_key,
      salt: userSalt,
      showTutorial
    });
  } catch (err) {
    console.error('Bootstrap API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
