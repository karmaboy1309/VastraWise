// Central data store for VastraWise
// In a real app this would be backed by Supabase; here we keep local state
// that all pages share via props from parent.

export interface Outfit {
    id: string
    name: string
    category: string
    rentPrice: number
    status: 'available' | 'rented' | 'maintenance'
    imageUrl: string
    description?: string
    size?: string
    color?: string
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
    date: string
    returnDate: string
    status: 'paid' | 'pending' | 'overdue'
}

// ── SEED DATA ────────────────────────────────────────────────────────────────

export const INITIAL_OUTFITS: Outfit[] = [
    {
        id: 'OUT-001',
        name: 'Royal Silk Sherwani',
        category: 'Sherwani',
        rentPrice: 7500,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
        description: 'Premium royal silk sherwani with intricate gold embroidery. Perfect for weddings and grand occasions.',
        size: 'M / L',
        color: 'Ivory Gold',
    },
    {
        id: 'OUT-002',
        name: 'Designer Banarasi Saree',
        category: 'Saree',
        rentPrice: 5400,
        status: 'rented',
        imageUrl: 'https://images.unsplash.com/photo-1610189019599-3e0fa1c2a8a2?w=600&q=80',
        description: 'Elegant Banarasi silk saree with zari border. A timeless classic for festive occasions.',
        size: 'Free Size',
        color: 'Deep Teal',
    },
    {
        id: 'OUT-003',
        name: 'Bridal Lehenga Set',
        category: 'Lehenga',
        rentPrice: 12600,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1617501688742-2e8a89b0c2f2?w=600&q=80',
        description: 'Stunning bridal lehenga with heavy embellishment and dupatta. The perfect wedding look.',
        size: 'S / M',
        color: 'Crimson Red',
    },
    {
        id: 'OUT-004',
        name: 'Premium Kurta Pajama',
        category: 'Kurta',
        rentPrice: 3600,
        status: 'rented',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
        description: 'Fine cotton kurta pajama set with subtle embroidery. Ideal for festive and casual occasions.',
        size: 'M / L / XL',
        color: 'Pastel Blue',
    },
    {
        id: 'OUT-005',
        name: 'Classic Bandhgala Suit',
        category: 'Suit',
        rentPrice: 6000,
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80',
        description: 'Tailored bandhgala suit in fine wool blend. A sophisticated choice for formal occasions.',
        size: 'M / L',
        color: 'Charcoal Grey',
    },
    {
        id: 'OUT-006',
        name: 'Anarkali Suit Set',
        category: 'Suit',
        rentPrice: 4800,
        status: 'maintenance',
        imageUrl: 'https://images.unsplash.com/photo-1515704165967-b8cb1ebef4b3?w=600&q=80',
        description: 'Graceful anarkali suit with georgette fabric and thread work. Traditional elegance redefined.',
        size: 'S / M / L',
        color: 'Emerald Green',
    },
]

export const INITIAL_CUSTOMERS: Customer[] = [
    {
        id: 'CUST-001',
        name: 'Rajesh Kumar',
        initials: 'RK',
        avatarColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        status: 'active',
        totalRentals: 8,
        totalSpent: 42500,
        joinDate: 'Jan 2025',
    },
    {
        id: 'CUST-002',
        name: 'Priya Sharma',
        initials: 'PS',
        avatarColor: 'linear-gradient(135deg, #a855f7, #7c3aed)',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43211',
        location: 'Delhi, NCR',
        status: 'active',
        totalRentals: 12,
        totalSpent: 68900,
        joinDate: 'Feb 2025',
    },
    {
        id: 'CUST-003',
        name: 'Amit Patel',
        initials: 'AP',
        avatarColor: 'linear-gradient(135deg, #ec4899, #be185d)',
        email: 'amit.patel@email.com',
        phone: '+91 98765 43212',
        location: 'Ahmedabad, Gujarat',
        status: 'active',
        totalRentals: 5,
        totalSpent: 28300,
        joinDate: 'Mar 2025',
    },
    {
        id: 'CUST-004',
        name: 'Sneha Reddy',
        initials: 'SR',
        avatarColor: 'linear-gradient(135deg, #10b981, #047857)',
        email: 'sneha.reddy@email.com',
        phone: '+91 98765 43213',
        location: 'Hyderabad, Telangana',
        status: 'active',
        totalRentals: 9,
        totalSpent: 78500,
        joinDate: 'Dec 2024',
    },
    {
        id: 'CUST-005',
        name: 'Vikram Singh',
        initials: 'VS',
        avatarColor: 'linear-gradient(135deg, #f97316, #c2410c)',
        email: 'vikram.singh@email.com',
        phone: '+91 98765 43214',
        location: 'Jaipur, Rajasthan',
        status: 'active',
        totalRentals: 6,
        totalSpent: 55200,
        joinDate: 'Nov 2024',
    },
    {
        id: 'CUST-006',
        name: 'Meera Iyer',
        initials: 'MI',
        avatarColor: 'linear-gradient(135deg, #14b8a6, #0f766e)',
        email: 'meera.iyer@email.com',
        phone: '+91 98765 43215',
        location: 'Chennai, Tamil Nadu',
        status: 'inactive',
        totalRentals: 3,
        totalSpent: 34900,
        joinDate: 'Oct 2024',
    },
]

export const INITIAL_INVOICES: Invoice[] = [
    {
        id: 'INV-001',
        customerId: 'CUST-001',
        customerName: 'Rajesh Kumar',
        outfitId: 'OUT-001',
        outfitName: 'Royal Silk Sherwani',
        amount: 7500,
        date: 'Feb 08, 2026',
        returnDate: 'Feb 12, 2026',
        status: 'paid',
    },
    {
        id: 'INV-002',
        customerId: 'CUST-002',
        customerName: 'Priya Sharma',
        outfitId: 'OUT-002',
        outfitName: 'Designer Banarasi Saree',
        amount: 5400,
        date: 'Feb 07, 2026',
        returnDate: 'Feb 10, 2026',
        status: 'paid',
    },
    {
        id: 'INV-003',
        customerId: 'CUST-003',
        customerName: 'Amit Patel',
        outfitId: 'OUT-004',
        outfitName: 'Premium Kurta Pajama',
        amount: 3600,
        date: 'Feb 10, 2026',
        returnDate: 'Feb 14, 2026',
        status: 'pending',
    },
    {
        id: 'INV-004',
        customerId: 'CUST-004',
        customerName: 'Sneha Reddy',
        outfitId: 'OUT-003',
        outfitName: 'Bridal Lehenga Set',
        amount: 12600,
        date: 'Feb 06, 2026',
        returnDate: 'Feb 09, 2026',
        status: 'paid',
    },
    {
        id: 'INV-005',
        customerId: 'CUST-005',
        customerName: 'Vikram Singh',
        outfitId: 'OUT-005',
        outfitName: 'Classic Bandhgala Suit',
        amount: 6000,
        date: 'Feb 09, 2026',
        returnDate: 'Feb 13, 2026',
        status: 'pending',
    },
]
