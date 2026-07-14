const Outfit = require('../models/Outfit');

// @desc    Get all outfits
// @route   GET /api/outfits
exports.getAll = async (req, res) => {
    try {
        const outfits = await Outfit.find().sort({ createdAt: -1 });
        const mapped = outfits.map(o => ({
            id: o.displayId,
            _id: o._id,
            name: o.name,
            category: o.category,
            rentPrice: o.rentPrice,
            status: o.status,
            imageUrl: o.imageUrl,
            description: o.description,
            size: o.size,
            color: o.color,
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a new outfit
// @route   POST /api/outfits
exports.create = async (req, res) => {
    try {
        const { name, category, rentPrice, status, imageUrl, description, size, color, id } = req.body;
        const outfit = await Outfit.create({
            displayId: id || undefined, // use client-provided ID or auto-generate
            name,
            category,
            rentPrice,
            status,
            imageUrl,
            description,
            size,
            color,
        });
        res.status(201).json({
            id: outfit.displayId,
            _id: outfit._id,
            name: outfit.name,
            category: outfit.category,
            rentPrice: outfit.rentPrice,
            status: outfit.status,
            imageUrl: outfit.imageUrl,
            description: outfit.description,
            size: outfit.size,
            color: outfit.color,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update an outfit
// @route   PUT /api/outfits/:id
exports.update = async (req, res) => {
    try {
        const outfit = await Outfit.findOneAndUpdate(
            { displayId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
        res.json({
            id: outfit.displayId,
            _id: outfit._id,
            name: outfit.name,
            category: outfit.category,
            rentPrice: outfit.rentPrice,
            status: outfit.status,
            imageUrl: outfit.imageUrl,
            description: outfit.description,
            size: outfit.size,
            color: outfit.color,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Delete an outfit
// @route   DELETE /api/outfits/:id
exports.remove = async (req, res) => {
    try {
        const outfit = await Outfit.findOneAndDelete({ displayId: req.params.id });
        if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
        res.json({ message: 'Outfit deleted', id: outfit.displayId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
