const User = require('../models/User');
const authMiddleware = require('./authMiddleware');

module.exports = async (req, res, next) => {
  // Ensure user is authenticated first
  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  } catch (err) {
    return; // authMiddleware already sent response
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'admin' && user.role !== 'superadmin') return res.status(403).json({ message: 'Admin access required' });
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
