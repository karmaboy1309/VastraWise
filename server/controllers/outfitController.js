const Outfit = require('../models/Outfit');

const mapOutfit = o => ({
    id: o.displayId,
    _id: o._id,
    name: o.name,
    category: o.category,
    rentPrice: o.rentPrice,
    securityDeposit: o.securityDeposit || 2000,
    status: o.status,
    imageUrl: o.imageUrl,
    description: o.description || '',
    size: o.size || '',
    chestSize: o.chestSize || '40"',
    waistSize: o.waistSize || '34"',
    fitType: o.fitType || 'Regular Fit',
    color: o.color || '',
    includedAccessories: o.includedAccessories || [],
});

// @desc    Get all outfits
// @route   GET /api/outfits
exports.getAll = async (req, res) => {
    try {
        const outfits = await Outfit.find().sort({ createdAt: -1 });
        res.json(outfits.map(mapOutfit));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a new outfit
// @route   POST /api/outfits
exports.create = async (req, res) => {
    try {
        const {
            name, category, rentPrice, securityDeposit, status,
            imageUrl, description, size, chestSize, waistSize,
            fitType, color, includedAccessories, id
        } = req.body;

        const outfit = await Outfit.create({
            displayId: id && !id.startsWith('OUT-1') ? id : undefined, // auto-generate clean OUT-XXX displayId if temporary client timestamp ID passed
            name,
            category: category || 'Sherwani',
            rentPrice: Number(rentPrice) || 0,
            securityDeposit: Number(securityDeposit) || 2000,
            status: status || 'available',
            imageUrl,
            description: description || '',
            size: size || '40 (M)',
            chestSize: chestSize || '40"',
            waistSize: waistSize || '34"',
            fitType: fitType || 'Regular Fit',
            color: color || '',
            includedAccessories: Array.isArray(includedAccessories) ? includedAccessories : [],
        });

        res.status(201).json(mapOutfit(outfit));
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
        res.json(mapOutfit(outfit));
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
