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
            default: 'Other',
            enum: ['Sherwani', 'Saree', 'Lehenga', 'Kurta', 'Suit', 'Other'],
        },
        rentPrice: {
            type: Number,
            required: [true, 'Rent price is required'],
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
            default: '',
        },
        color: {
            type: String,
            default: '',
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
