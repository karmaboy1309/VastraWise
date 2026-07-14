const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
exports.getAll = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        const mapped = customers.map(c => ({
            id: c.displayId,
            _id: c._id,
            name: c.name,
            initials: c.initials,
            avatarColor: c.avatarColor,
            email: c.email,
            phone: c.phone,
            location: c.location,
            status: c.status,
            totalRentals: c.totalRentals,
            totalSpent: c.totalSpent,
            joinDate: c.joinDate,
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a customer
// @route   POST /api/customers
exports.create = async (req, res) => {
    try {
        const { name, initials, avatarColor, email, phone, location, status, totalRentals, totalSpent, joinDate, id } = req.body;
        const customer = await Customer.create({
            displayId: id || undefined,
            name,
            initials,
            avatarColor,
            email,
            phone,
            location,
            status,
            totalRentals,
            totalSpent,
            joinDate,
        });
        res.status(201).json({
            id: customer.displayId,
            _id: customer._id,
            name: customer.name,
            initials: customer.initials,
            avatarColor: customer.avatarColor,
            email: customer.email,
            phone: customer.phone,
            location: customer.location,
            status: customer.status,
            totalRentals: customer.totalRentals,
            totalSpent: customer.totalSpent,
            joinDate: customer.joinDate,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
exports.update = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { displayId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json({
            id: customer.displayId,
            _id: customer._id,
            name: customer.name,
            initials: customer.initials,
            avatarColor: customer.avatarColor,
            email: customer.email,
            phone: customer.phone,
            location: customer.location,
            status: customer.status,
            totalRentals: customer.totalRentals,
            totalSpent: customer.totalSpent,
            joinDate: customer.joinDate,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
exports.remove = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ displayId: req.params.id });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted', id: customer.displayId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
