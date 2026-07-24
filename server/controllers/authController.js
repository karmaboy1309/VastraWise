const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign tokens ───────────────────────────────────────────────────────
const signAccessToken = (userId, role) =>
    jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

const signRefreshToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

const COOKIE_OPTIONS = {
    httpOnly: true,          // JS cannot read this cookie (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find user and explicitly include password (select: false by default)
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
            // Use generic message to prevent user enumeration
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'Your account has been deactivated. Contact your admin.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Issue tokens
        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id);

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
};

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
const refresh = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ error: 'No refresh token. Please log in again.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            res.clearCookie('refreshToken');
            return res.status(401).json({ error: 'Refresh token expired or invalid. Please log in again.' });
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            res.clearCookie('refreshToken');
            return res.status(401).json({ error: 'User not found or inactive.' });
        }

        const newAccessToken = signAccessToken(user._id, user.role);

        res.json({
            accessToken: newAccessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during token refresh.' });
    }
};

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
const logout = (req, res) => {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully.' });
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Returns current user info. `protect` middleware must run first.
const me = (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
};

module.exports = { login, refresh, logout, me };
