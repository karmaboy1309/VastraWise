// Central data store for VastraWise — Men's Wear & Groom Rental System

export interface Outfit {
    id: string
    name: string
    category: string
    rentPrice: number
    securityDeposit?: number
    status: 'available' | 'rented' | 'maintenance'
    imageUrl: string
    description?: string
    size?: string
    chestSize?: string
    waistSize?: string
    fitType?: 'Slim Fit' | 'Regular Fit' | 'Royal Tailored'
    color?: string
    includedAccessories?: string[]
}

export interface Customer {
    id: string
    name: string
    initials: string
    avatarColor: string
    email: string
    phone: string
    location: string
    status: 'active' | 'inactive'
    totalRentals: number
    totalSpent: number
    joinDate: string
}

export interface Invoice {
    id: string
    customerId: string
    customerName: string
    outfitId: string
    outfitName: string
    amount: number
    securityDeposit?: number
    depositStatus?: 'held' | 'refunded' | 'forfeited'
    date: string
    returnDate: string
    trialDate?: string
    eventDate?: string
    includedAccessories?: string[]
    alterationNotes?: string
    status: 'paid' | 'pending' | 'overdue'
}

// ── SEED DATA (Men's Luxury Wear & Groom Collection) ──────────────────────────

export const INITIAL_OUTFITS: Outfit[] = [
    {
        id: 'OUT-001',
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
        id: 'OUT-002',
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
        id: 'OUT-003',
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
        id: 'OUT-004',
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
        id: 'OUT-005',
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
        id: 'OUT-006',
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
]

export const INITIAL_CUSTOMERS: Customer[] = [
    {
        id: 'CUST-001',
        name: 'Vikramaditya Rathore',
        initials: 'VR',
        avatarColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        email: 'vikram.rathore@email.com',
        phone: '+91 98765 43210',
        location: 'Jaipur, Rajasthan',
        status: 'active',
        totalRentals: 8,
        totalSpent: 48500,
        joinDate: 'Jan 2025',
    },
    {
        id: 'CUST-002',
        name: 'Amanpreet Singh',
        initials: 'AS',
        avatarColor: 'linear-gradient(135deg, #a855f7, #7c3aed)',
        email: 'aman.singh@email.com',
        phone: '+91 98765 43211',
        location: 'Chandigarh, Punjab',
        status: 'active',
        totalRentals: 12,
        totalSpent: 72900,
        joinDate: 'Feb 2025',
    },
    {
        id: 'CUST-003',
        name: 'Devendra Mehta',
        initials: 'DM',
        avatarColor: 'linear-gradient(135deg, #ec4899, #be185d)',
        email: 'dev.mehta@email.com',
        phone: '+91 98765 43212',
        location: 'Ahmedabad, Gujarat',
        status: 'active',
        totalRentals: 5,
        totalSpent: 31300,
        joinDate: 'Mar 2025',
    },
    {
        id: 'CUST-004',
        name: 'Rohan Kapoor',
        initials: 'RK',
        avatarColor: 'linear-gradient(135deg, #10b981, #047857)',
        email: 'rohan.kapoor@email.com',
        phone: '+91 98765 43213',
        location: 'Delhi, NCR',
        status: 'active',
        totalRentals: 9,
        totalSpent: 81500,
        joinDate: 'Dec 2024',
    },
    {
        id: 'CUST-005',
        name: 'Karanvir Verma',
        initials: 'KV',
        avatarColor: 'linear-gradient(135deg, #f97316, #c2410c)',
        email: 'karan.verma@email.com',
        phone: '+91 98765 43214',
        location: 'Mumbai, Maharashtra',
        status: 'active',
        totalRentals: 6,
        totalSpent: 59200,
        joinDate: 'Nov 2024',
    },
    {
        id: 'CUST-006',
        name: 'Siddharth Nair',
        initials: 'SN',
        avatarColor: 'linear-gradient(135deg, #14b8a6, #0f766e)',
        email: 'siddharth.nair@email.com',
        phone: '+91 98765 43215',
        location: 'Bengaluru, Karnataka',
        status: 'inactive',
        totalRentals: 3,
        totalSpent: 38900,
        joinDate: 'Oct 2024',
    },
]

export const INITIAL_INVOICES: Invoice[] = [
    {
        id: 'INV-001',
        customerId: 'CUST-001',
        customerName: 'Vikramaditya Rathore',
        outfitId: 'OUT-001',
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
        id: 'INV-002',
        customerId: 'CUST-002',
        customerName: 'Amanpreet Singh',
        outfitId: 'OUT-002',
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
        id: 'INV-003',
        customerId: 'CUST-003',
        customerName: 'Devendra Mehta',
        outfitId: 'OUT-004',
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
        id: 'INV-004',
        customerId: 'CUST-004',
        customerName: 'Rohan Kapoor',
        outfitId: 'OUT-005',
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
        id: 'INV-005',
        customerId: 'CUST-005',
        customerName: 'Karanvir Verma',
        outfitId: 'OUT-003',
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
]
