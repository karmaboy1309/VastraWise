const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── protect ───────────────────────────────────────────────────────────────────
// Verifies the JWT sent in Authorization: Bearer <token>
// Attaches the decoded user payload to req.user
// ─────────────────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired. Please refresh your session.' });
            }
            return res.status(401).json({ error: 'Invalid token.' });
        }

        // Fetch fresh user to ensure they're still active
        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User account is inactive or not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error during authentication.' });
    }
};

// ── requireRole ───────────────────────────────────────────────────────────────
// Role-based access control. Pass one or more allowed roles.
// Example: requireRole('admin') — only admins can proceed
//          requireRole('admin', 'worker') — both can proceed
// ─────────────────────────────────────────────────────────────────────────────
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
            });
        }
        next();
    };
};

module.exports = { protect, requireRole };
