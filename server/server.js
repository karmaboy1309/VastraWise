const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent cross-origin
}));
app.use(express.json());
app.use(cookieParser()); // Parse HTTP-only cookies (for refresh token)

// ── Public Auth Routes (no JWT required) ─────────────────────
// Must be mounted BEFORE the protected routes below
app.use('/api/auth', require('./routes/authRoutes'));

// ── Protected API Routes (JWT required via route-level middleware) ─────────────
app.use('/api/outfits', require('./routes/outfitRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ── Health check (public) ────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ VastraWise server running on http://localhost:${PORT}`);
});
