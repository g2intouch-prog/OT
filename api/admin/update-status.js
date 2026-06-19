const db = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Verify requester session
    const session = await db.verifyUserSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Session missing or invalid.' });
    }

    // 2. Confirm requester role is admin
    const adminUser = await db.checkUserStatusAndRole(session.user_id);
    if (!adminUser || adminUser.role !== 'admin' || adminUser.status !== 'active') {
      return res.status(403).json({ error: 'Forbidden: Admin privilege required.' });
    }

    if (req.method === 'GET') {
      // Expose user listing on GET for administrative convenience
      const users = await db.getAllUsers();
      return res.status(200).json({ users });
    }

    if (req.method === 'POST') {
      const { userId, newStatus } = req.body;
      if (!userId || !newStatus) {
        return res.status(400).json({ error: 'Missing userId or newStatus.' });
      }

      // 3. Update target user status
      await db.updateUserStatus(session.user_id, userId, newStatus);
      return res.status(200).json({ success: true, message: `Status updated to ${newStatus} successfully.` });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Update status API error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
