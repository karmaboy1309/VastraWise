const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        displayId: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        initials: {
            type: String,
            default: '',
        },
        avatarColor: {
            type: String,
            default: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
        },
        phone: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            required: true,
            default: 'active',
            enum: ['active', 'inactive'],
        },
        totalRentals: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
        joinDate: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate displayId before save if not provided
customerSchema.pre('validate', async function (next) {
    if (!this.displayId) {
        const count = await mongoose.model('Customer').countDocuments();
        this.displayId = `CUST-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Customer', customerSchema);
