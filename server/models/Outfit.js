const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema(
    {
        displayId: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Outfit name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: true,
            default: 'Sherwani',
            enum: ['Sherwani', 'Indo-Western', 'Jodhpuri', 'Tuxedo & Suit', 'Kurta Set', 'Accessories', 'Other'],
        },
        rentPrice: {
            type: Number,
            required: [true, 'Rent price is required'],
            min: 0,
        },
        securityDeposit: {
            type: Number,
            default: 2000,
            min: 0,
        },
        status: {
            type: String,
            required: true,
            default: 'available',
            enum: ['available', 'rented', 'maintenance'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        description: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: '40 (M)',
        },
        chestSize: {
            type: String,
            default: '40"',
        },
        waistSize: {
            type: String,
            default: '34"',
        },
        fitType: {
            type: String,
            default: 'Regular Fit',
            enum: ['Slim Fit', 'Regular Fit', 'Royal Tailored'],
        },
        color: {
            type: String,
            default: '',
        },
        includedAccessories: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate displayId before save if not provided
outfitSchema.pre('validate', async function (next) {
    if (!this.displayId) {
        const count = await mongoose.model('Outfit').countDocuments();
        this.displayId = `OUT-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Outfit', outfitSchema);
