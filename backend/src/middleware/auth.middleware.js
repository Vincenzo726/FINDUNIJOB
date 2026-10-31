const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authentication required' });
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ success: false, message: 'Invalid authentication' });
    req.user = user;
    next();
  } catch (error) {
    next(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'
      ? Object.assign(new Error('Invalid or expired token'), { statusCode: 401 }) : error);
  }
}
function authorize(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next() : res.status(403).json({ success: false, message: 'Insufficient permissions' });
}
module.exports = { authenticate, authorize };