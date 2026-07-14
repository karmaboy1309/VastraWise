const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Outfit = require('../models/Outfit');
const Customer = require('../models/Customer');

// ── Helper: map a Mongoose invoice doc to the API response shape ─────
function mapInvoice(inv) {
    return {
        id: inv.displayId,
        _id: inv._id,
        customerId: inv.customerId?.displayId || inv.customerId,
        customerName: inv.customerName,
        outfitId: inv.outfitId?.displayId || inv.outfitId,
        outfitName: inv.outfitName,
        amount: inv.amount,
        date: inv.date,
        returnDate: inv.returnDate,
        status: inv.status,
    };
}

// @desc    Get all invoices
// @route   GET /api/invoices
exports.getAll = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('customerId', 'displayId')
            .populate('outfitId', 'displayId')
            .sort({ createdAt: -1 });
        res.json(invoices.map(mapInvoice));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create invoice + auto-sync outfit to 'rented' + update customer stats
// @route   POST /api/invoices
exports.create = async (req, res) => {
    try {
        const { customerId, customerName, outfitId, outfitName, amount, date, returnDate, status } = req.body;

        // 1. Resolve outfit by displayId and validate availability
        const outfit = await Outfit.findOne({ displayId: outfitId });
        if (!outfit) {
            return res.status(404).json({ error: `Outfit '${outfitId}' not found` });
        }
        if (outfit.status !== 'available') {
            return res.status(400).json({ error: `Outfit '${outfitId}' is currently '${outfit.status}', not available for rental` });
        }

        // 2. Resolve customer by displayId
        const customer = await Customer.findOne({ displayId: customerId });
        if (!customer) {
            return res.status(404).json({ error: `Customer '${customerId}' not found` });
        }

        // 3. Create the invoice (uses ObjectId refs internally)
        const invoice = await Invoice.create({
            displayId: undefined, // auto-generate
            customerId: customer._id,
            customerName,
            outfitId: outfit._id,
            outfitName,
            amount,
            date,
            returnDate,
            status: status || 'pending',
        });

        // 4. ── BUSINESS LOGIC: Update outfit status to 'rented' ──────
        outfit.status = 'rented';
        await outfit.save();

        // 5. ── BUSINESS LOGIC: Update customer rental statistics ─────
        customer.totalRentals += 1;
        customer.totalSpent += amount;
        await customer.save();

        // 6. Populate refs for response
        await invoice.populate('customerId', 'displayId');
        await invoice.populate('outfitId', 'displayId');

        res.status(201).json(mapInvoice(invoice));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update invoice + auto-sync outfit status on payment transitions
// @route   PUT /api/invoices/:id
exports.update = async (req, res) => {
    try {
        // 1. Fetch the existing invoice to detect status transitions
        const existingInvoice = await Invoice.findOne({ displayId: req.params.id });
        if (!existingInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const previousStatus = existingInvoice.status;
        const newStatus = req.body.status || previousStatus;

        // Clean up and resolve payload to avoid Mongoose validation/casting issues
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        delete updateData.displayId;

        if (updateData.customerId && typeof updateData.customerId === 'string') {
            const customer = await Customer.findOne({ displayId: updateData.customerId });
            if (customer) {
                updateData.customerId = customer._id;
            } else if (!mongoose.Types.ObjectId.isValid(updateData.customerId)) {
                delete updateData.customerId;
            }
        }

        if (updateData.outfitId && typeof updateData.outfitId === 'string') {
            const outfit = await Outfit.findOne({ displayId: updateData.outfitId });
            if (outfit) {
                updateData.outfitId = outfit._id;
            } else if (!mongoose.Types.ObjectId.isValid(updateData.outfitId)) {
                delete updateData.outfitId;
            }
        }

        // 2. Update the invoice document
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { displayId: req.params.id },
            { ...updateData, status: newStatus },
            { new: true, runValidators: true }
        )
            .populate('customerId', 'displayId')
            .populate('outfitId', 'displayId');

        // 3. ── BUSINESS LOGIC: Outfit status auto-sync on payment transitions ──
        if (previousStatus !== newStatus) {
            const outfit = await Outfit.findById(existingInvoice.outfitId);
            if (outfit) {
                if (newStatus === 'paid' && previousStatus !== 'paid') {
                    // Invoice is being marked as PAID → release the outfit
                    outfit.status = 'available';
                    await outfit.save();
                } else if (newStatus !== 'paid' && previousStatus === 'paid') {
                    // Invoice reverting from PAID → lock the outfit again
                    outfit.status = 'rented';
                    await outfit.save();
                }
            }
        }

        res.json(mapInvoice(updatedInvoice));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

