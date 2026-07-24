/**
 * seed-admin.js
 * ─────────────
 * One-time script to create the first Admin (shop owner) account.
 * Run once: node seed-admin.js
 *
 * Credentials are read from .env:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const email = process.env.ADMIN_EMAIL || 'admin@vastrawise.com';
        const name  = process.env.ADMIN_NAME  || 'Admin';
        const password = process.env.ADMIN_PASSWORD || 'Admin@123';

        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`ℹ️  Admin already exists: ${existing.email} (role: ${existing.role})`);
            process.exit(0);
        }

        const admin = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isActive: true,
        });

        console.log('');
        console.log('🎉 Admin account created successfully!');
        console.log('──────────────────────────────────────');
        console.log(`   Name    : ${admin.name}`);
        console.log(`   Email   : ${admin.email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role    : ${admin.role}`);
        console.log('──────────────────────────────────────');
        console.log('⚠️  Change the password after first login!');
        console.log('');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
}

seedAdmin();
