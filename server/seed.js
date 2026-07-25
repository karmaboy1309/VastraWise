/**
 * VastraWise Men's Wear Database Seeder
 * Run: node seed.js
 *
 * Populates MongoDB with Men's Groom Wear & Festive Wardrobe collection data.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Outfit = require('./models/Outfit');
const Customer = require('./models/Customer');
const Invoice = require('./models/Invoice');

const OUTFITS = [
    {
        displayId: 'OUT-001',
        name: 'Royal Heritage Velvet Sherwani',
        category: 'Sherwani',
        rentPrice: 8500,
        securityDeposit: 3000,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
        description: 'Royal velvet groom sherwani with intricate zardosi gold work, paired with churidar and matching dupatta.',
        size: '40 (M)',
        chestSize: '40"',
        waistSize: '34"',
        fitType: 'Royal Tailored',
        color: 'Ivory & Antique Gold',
        includedAccessories: ['Royal Turban (Safa)', 'Embroidered Dupatta', 'Designer Brooch', 'Pearl Necklace'],
    },
    {
        displayId: 'OUT-002',
        name: 'Asymmetric Fusion Indo-Western Set',
        category: 'Indo-Western',
        rentPrice: 6200,
        securityDeposit: 2500,
        status: 'rented',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
        description: 'Modern asymmetric cut jacket with cowl kurta and slim trousers. Chic for Sangeet & Reception nights.',
        size: '38 (S)',
        chestSize: '38"',
        waistSize: '32"',
        fitType: 'Slim Fit',
        color: 'Midnight Navy Blue',
        includedAccessories: ['Pocket Square', 'Metallic Brooch'],
    },
    {
        displayId: 'OUT-003',
        name: 'Heritage Jodhpuri Bandhgala Suit',
        category: 'Jodhpuri',
        rentPrice: 7000,
        securityDeposit: 2500,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80',
        description: 'Classic Rajasthan Jodhpuri suit crafted from fine Italian wool blend with handcrafted brass buttons.',
        size: '42 (L)',
        chestSize: '42"',
        waistSize: '36"',
        fitType: 'Regular Fit',
        color: 'Charcoal Grey & Gold',
        includedAccessories: ['Silk Pocket Square', 'Custom Cufflinks'],
    },
    {
        displayId: 'OUT-004',
        name: 'Black-Tie Gala Dinner Tuxedo',
        category: 'Tuxedo & Suit',
        rentPrice: 5800,
        securityDeposit: 2000,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
        description: 'Premium satin lapel tuxedo with pleated tuxedo shirt, silk bow tie, and cummerbund.',
        size: '40 (M)',
        chestSize: '40"',
        waistSize: '33"',
        fitType: 'Slim Fit',
        color: 'Jet Black & Satin',
        includedAccessories: ['Silk Bow Tie', 'Cummerbund', 'Silver Studs'],
    },
    {
        displayId: 'OUT-005',
        name: 'Raw Silk Kurta & Nehru Jacket Combo',
        category: 'Kurta Set',
        rentPrice: 3800,
        securityDeposit: 1500,
        status: 'rented',
        imageUrl: 'https://images.unsplash.com/photo-1610189019599-3e0fa1c2a8a2?w=600&q=80',
        description: 'Handwoven raw silk kurta pajama coupled with floral embroidered Nehru jacket for Haldi / Mehendi ceremonies.',
        size: '44 (XL)',
        chestSize: '44"',
        waistSize: '38"',
        fitType: 'Regular Fit',
        color: 'Emerald Green & Gold',
        includedAccessories: ['Matching Pocket Square'],
    },
    {
        displayId: 'OUT-006',
        name: 'Royal Groom Accessory Bundle',
        category: 'Accessories',
        rentPrice: 2800,
        securityDeposit: 1000,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1515704165967-b8cb1ebef4b3?w=600&q=80',
        description: 'Complete Groom accessory suite including handcrafted Banarasi Safa, royal Kalgi, Pearl Mala, and Velvet Mojari.',
        size: 'Free Size / Mojari 9',
        chestSize: 'N/A',
        waistSize: 'N/A',
        fitType: 'Regular Fit',
        color: 'Maroon & Gold',
        includedAccessories: ['Royal Turban (Safa)', 'Groom Kalgi', 'Multi-layer Pearl Mala', 'Matching Velvet Mojari'],
    },
];

const CUSTOMERS = [
    { displayId: 'CUST-001', name: 'Vikramaditya Rathore', initials: 'VR', avatarColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', email: 'vikram.rathore@email.com', phone: '+91 98765 43210', location: 'Jaipur, Rajasthan', status: 'active', totalRentals: 8, totalSpent: 48500, joinDate: 'Jan 2025' },
    { displayId: 'CUST-002', name: 'Amanpreet Singh', initials: 'AS', avatarColor: 'linear-gradient(135deg, #a855f7, #7c3aed)', email: 'aman.singh@email.com', phone: '+91 98765 43211', location: 'Chandigarh, Punjab', status: 'active', totalRentals: 12, totalSpent: 72900, joinDate: 'Feb 2025' },
    { displayId: 'CUST-003', name: 'Devendra Mehta', initials: 'DM', avatarColor: 'linear-gradient(135deg, #ec4899, #be185d)', email: 'dev.mehta@email.com', phone: '+91 98765 43212', location: 'Ahmedabad, Gujarat', status: 'active', totalRentals: 5, totalSpent: 31300, joinDate: 'Mar 2025' },
    { displayId: 'CUST-004', name: 'Rohan Kapoor', initials: 'RK', avatarColor: 'linear-gradient(135deg, #10b981, #047857)', email: 'rohan.kapoor@email.com', phone: '+91 98765 43213', location: 'Delhi, NCR', status: 'active', totalRentals: 9, totalSpent: 81500, joinDate: 'Dec 2024' },
    { displayId: 'CUST-005', name: 'Karanvir Verma', initials: 'KV', avatarColor: 'linear-gradient(135deg, #f97316, #c2410c)', email: 'karan.verma@email.com', phone: '+91 98765 43214', location: 'Mumbai, Maharashtra', status: 'active', totalRentals: 6, totalSpent: 59200, joinDate: 'Nov 2024' },
    { displayId: 'CUST-006', name: 'Siddharth Nair', initials: 'SN', avatarColor: 'linear-gradient(135deg, #14b8a6, #0f766e)', email: 'siddharth.nair@email.com', phone: '+91 98765 43215', location: 'Bengaluru, Karnataka', status: 'inactive', totalRentals: 3, totalSpent: 38900, joinDate: 'Oct 2024' },
];

const INVOICES_RAW = [
    {
        displayId: 'INV-001',
        custDisplayId: 'CUST-001',
        customerName: 'Vikramaditya Rathore',
        outDisplayId: 'OUT-001',
        outfitName: 'Royal Heritage Velvet Sherwani',
        amount: 8500,
        securityDeposit: 3000,
        depositStatus: 'held',
        date: 'Feb 10, 2026',
        returnDate: 'Feb 14, 2026',
        trialDate: 'Feb 07, 2026',
        eventDate: 'Feb 12, 2026',
        includedAccessories: ['Royal Turban (Safa)', 'Embroidered Dupatta', 'Designer Brooch'],
        alterationNotes: 'Sleeve shortened 0.5 inches; Chest fitted to 40"',
        status: 'paid',
    },
    {
        displayId: 'INV-002',
        custDisplayId: 'CUST-002',
        customerName: 'Amanpreet Singh',
        outDisplayId: 'OUT-002',
        outfitName: 'Asymmetric Fusion Indo-Western Set',
        amount: 6200,
        securityDeposit: 2500,
        depositStatus: 'held',
        date: 'Feb 12, 2026',
        returnDate: 'Feb 15, 2026',
        trialDate: 'Feb 10, 2026',
        eventDate: 'Feb 14, 2026',
        includedAccessories: ['Pocket Square', 'Metallic Brooch'],
        alterationNotes: 'Waist taken in 1 inch',
        status: 'pending',
    },
    {
        displayId: 'INV-003',
        custDisplayId: 'CUST-003',
        customerName: 'Devendra Mehta',
        outDisplayId: 'OUT-004',
        outfitName: 'Black-Tie Gala Dinner Tuxedo',
        amount: 5800,
        securityDeposit: 2000,
        depositStatus: 'refunded',
        date: 'Feb 05, 2026',
        returnDate: 'Feb 08, 2026',
        trialDate: 'Feb 03, 2026',
        eventDate: 'Feb 07, 2026',
        includedAccessories: ['Silk Bow Tie', 'Cummerbund'],
        alterationNotes: 'Trousers hemmed 1 inch',
        status: 'paid',
    },
    {
        displayId: 'INV-004',
        custDisplayId: 'CUST-004',
        customerName: 'Rohan Kapoor',
        outDisplayId: 'OUT-005',
        outfitName: 'Raw Silk Kurta & Nehru Jacket Combo',
        amount: 3800,
        securityDeposit: 1500,
        depositStatus: 'held',
        date: 'Feb 14, 2026',
        returnDate: 'Feb 17, 2026',
        trialDate: 'Feb 12, 2026',
        eventDate: 'Feb 15, 2026',
        includedAccessories: ['Matching Pocket Square'],
        alterationNotes: 'Standard fit',
        status: 'pending',
    },
    {
        displayId: 'INV-005',
        custDisplayId: 'CUST-005',
        customerName: 'Karanvir Verma',
        outDisplayId: 'OUT-003',
        outfitName: 'Heritage Jodhpuri Bandhgala Suit',
        amount: 7000,
        securityDeposit: 2500,
        depositStatus: 'refunded',
        date: 'Feb 01, 2026',
        returnDate: 'Feb 04, 2026',
        trialDate: 'Jan 29, 2026',
        eventDate: 'Feb 03, 2026',
        includedAccessories: ['Silk Pocket Square', 'Custom Cufflinks'],
        alterationNotes: 'Shoulders adjusted 0.5"',
        status: 'paid',
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for Men\'s Wear seeding');

        // Drop existing data
        await Outfit.deleteMany({});
        await Customer.deleteMany({});
        await Invoice.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed outfits
        const outfits = await Outfit.insertMany(OUTFITS);
        console.log(`📦 Seeded ${outfits.length} Men's outfits`);

        // Seed customers
        const customers = await Customer.insertMany(CUSTOMERS);
        console.log(`👥 Seeded ${customers.length} customers`);

        // Seed invoices (resolve displayId references to ObjectIds)
        const outfitMap = {};
        outfits.forEach(o => { outfitMap[o.displayId] = o._id; });
        const customerMap = {};
        customers.forEach(c => { customerMap[c.displayId] = c._id; });

        const invoiceDocs = INVOICES_RAW.map(inv => ({
            displayId: inv.displayId,
            customerId: customerMap[inv.custDisplayId],
            customerName: inv.customerName,
            outfitId: outfitMap[inv.outDisplayId],
            outfitName: inv.outfitName,
            amount: inv.amount,
            securityDeposit: inv.securityDeposit,
            depositStatus: inv.depositStatus,
            date: inv.date,
            returnDate: inv.returnDate,
            trialDate: inv.trialDate,
            eventDate: inv.eventDate,
            includedAccessories: inv.includedAccessories,
            alterationNotes: inv.alterationNotes,
            status: inv.status,
        }));

        const invoices = await Invoice.insertMany(invoiceDocs);
        console.log(`🧾 Seeded ${invoices.length} Men's wear invoices`);

        console.log('\n✅ Men\'s Wear Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
