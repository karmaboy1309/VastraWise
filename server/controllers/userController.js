const User = require('../models/User');

// ── GET /api/users ────────────────────────────────────────────────────────────
// Admin only — list all users (excludes password)
const getAll = async (req, res) => {
    try {
        const users = await User.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

// ── POST /api/users ───────────────────────────────────────────────────────────
// Admin only — create a new worker (or admin) account
const create = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'worker',
            createdBy: req.user._id,
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to create user.' });
    }
};

// ── PUT /api/users/:id ────────────────────────────────────────────────────────
// Admin only — update user name, role, or isActive status
const update = async (req, res) => {
    try {
        const { name, role, isActive, password } = req.body;

        // Prevent an admin from deactivating themselves
        if (req.params.id === req.user._id.toString() && isActive === false) {
            return res.status(400).json({ error: 'You cannot deactivate your own account.' });
        }

        const user = await User.findById(req.params.id).select('+password');
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (name !== undefined) user.name = name;
        if (role !== undefined) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        if (password) user.password = password; // pre-save hook will re-hash

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to update user.' });
    }
};

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
// Admin only — hard delete (use update isActive=false for soft delete in UI)
const remove = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot delete your own account.' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};

module.exports = { getAll, create, update, remove };
