const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        displayId: {
            type: String,
            unique: true,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer is required'],
        },
        customerName: {
            type: String,
            required: true,
        },
        outfitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outfit',
            required: [true, 'Outfit is required'],
        },
        outfitName: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: 0,
        },
        date: {
            type: String,
            required: [true, 'Rental date is required'],
        },
        returnDate: {
            type: String,
            required: [true, 'Return date is required'],
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['paid', 'pending', 'overdue'],
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate displayId before save if not provided
invoiceSchema.pre('validate', async function (next) {
    if (!this.displayId) {
        const count = await mongoose.model('Invoice').countDocuments();
        this.displayId = `INV-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
