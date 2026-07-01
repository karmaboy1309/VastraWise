-- ============================================================
-- VastraWise – Supabase Database Setup
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- ============================================================

-- ── 1. TABLES ─────────────────────────────────────────────────

-- Outfits table
CREATE TABLE IF NOT EXISTS outfits (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT 'Other',
    rent_price  NUMERIC NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'available'
                CHECK (status IN ('available', 'rented', 'maintenance')),
    image_url   TEXT NOT NULL DEFAULT '',
    description TEXT,
    size        TEXT,
    color       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    initials       TEXT NOT NULL DEFAULT '',
    avatar_color   TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    email          TEXT NOT NULL DEFAULT '',
    phone          TEXT NOT NULL DEFAULT '',
    location       TEXT NOT NULL DEFAULT '',
    status         TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'inactive')),
    total_rentals  INTEGER NOT NULL DEFAULT 0,
    total_spent    NUMERIC NOT NULL DEFAULT 0,
    join_date      TEXT NOT NULL DEFAULT '',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id             TEXT PRIMARY KEY,
    customer_id    TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    customer_name  TEXT NOT NULL,
    outfit_id      TEXT NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    outfit_name    TEXT NOT NULL,
    amount         NUMERIC NOT NULL DEFAULT 0,
    date           TEXT NOT NULL,
    return_date    TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('paid', 'pending', 'overdue')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── 2. ROW-LEVEL SECURITY (allow anon read/write for dev) ────
-- In production you'd tighten these policies to authenticated users only.

ALTER TABLE outfits   ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the anon role (dev-friendly)
CREATE POLICY "Allow all on outfits"   ON outfits   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on invoices"  ON invoices  FOR ALL USING (true) WITH CHECK (true);


-- ── 3. SEED DATA ─────────────────────────────────────────────

INSERT INTO outfits (id, name, category, rent_price, status, image_url, description, size, color) VALUES
    ('OUT-001', 'Royal Silk Sherwani',    'Sherwani', 7500,  'available',   'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', 'Premium royal silk sherwani with intricate gold embroidery. Perfect for weddings and grand occasions.', 'M / L', 'Ivory Gold'),
    ('OUT-002', 'Designer Banarasi Saree','Saree',    5400,  'rented',      'https://images.unsplash.com/photo-1610189019599-3e0fa1c2a8a2?w=600&q=80', 'Elegant Banarasi silk saree with zari border. A timeless classic for festive occasions.', 'Free Size', 'Deep Teal'),
    ('OUT-003', 'Bridal Lehenga Set',     'Lehenga',  12600, 'available',   'https://images.unsplash.com/photo-1617501688742-2e8a89b0c2f2?w=600&q=80', 'Stunning bridal lehenga with heavy embellishment and dupatta. The perfect wedding look.', 'S / M', 'Crimson Red'),
    ('OUT-004', 'Premium Kurta Pajama',   'Kurta',    3600,  'rented',      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', 'Fine cotton kurta pajama set with subtle embroidery. Ideal for festive and casual occasions.', 'M / L / XL', 'Pastel Blue'),
    ('OUT-005', 'Classic Bandhgala Suit', 'Suit',     6000,  'available',   'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80', 'Tailored bandhgala suit in fine wool blend. A sophisticated choice for formal occasions.', 'M / L', 'Charcoal Grey'),
    ('OUT-006', 'Anarkali Suit Set',      'Suit',     4800,  'maintenance', 'https://images.unsplash.com/photo-1515704165967-b8cb1ebef4b3?w=600&q=80', 'Graceful anarkali suit with georgette fabric and thread work. Traditional elegance redefined.', 'S / M / L', 'Emerald Green')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, initials, avatar_color, email, phone, location, status, total_rentals, total_spent, join_date) VALUES
    ('CUST-001', 'Rajesh Kumar',  'RK', 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 'rajesh.kumar@email.com',  '+91 98765 43210', 'Mumbai, Maharashtra',     'active',   8,  42500, 'Jan 2025'),
    ('CUST-002', 'Priya Sharma',  'PS', 'linear-gradient(135deg, #a855f7, #7c3aed)', 'priya.sharma@email.com',  '+91 98765 43211', 'Delhi, NCR',              'active',  12,  68900, 'Feb 2025'),
    ('CUST-003', 'Amit Patel',    'AP', 'linear-gradient(135deg, #ec4899, #be185d)', 'amit.patel@email.com',    '+91 98765 43212', 'Ahmedabad, Gujarat',      'active',   5,  28300, 'Mar 2025'),
    ('CUST-004', 'Sneha Reddy',   'SR', 'linear-gradient(135deg, #10b981, #047857)', 'sneha.reddy@email.com',   '+91 98765 43213', 'Hyderabad, Telangana',    'active',   9,  78500, 'Dec 2024'),
    ('CUST-005', 'Vikram Singh',  'VS', 'linear-gradient(135deg, #f97316, #c2410c)', 'vikram.singh@email.com',  '+91 98765 43214', 'Jaipur, Rajasthan',       'active',   6,  55200, 'Nov 2024'),
    ('CUST-006', 'Meera Iyer',    'MI', 'linear-gradient(135deg, #14b8a6, #0f766e)', 'meera.iyer@email.com',    '+91 98765 43215', 'Chennai, Tamil Nadu',     'inactive', 3,  34900, 'Oct 2024')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, customer_id, customer_name, outfit_id, outfit_name, amount, date, return_date, status) VALUES
    ('INV-001', 'CUST-001', 'Rajesh Kumar',  'OUT-001', 'Royal Silk Sherwani',    7500,  'Feb 08, 2026', 'Feb 12, 2026', 'paid'),
    ('INV-002', 'CUST-002', 'Priya Sharma',  'OUT-002', 'Designer Banarasi Saree',5400,  'Feb 07, 2026', 'Feb 10, 2026', 'paid'),
    ('INV-003', 'CUST-003', 'Amit Patel',    'OUT-004', 'Premium Kurta Pajama',   3600,  'Feb 10, 2026', 'Feb 14, 2026', 'pending'),
    ('INV-004', 'CUST-004', 'Sneha Reddy',   'OUT-003', 'Bridal Lehenga Set',     12600, 'Feb 06, 2026', 'Feb 09, 2026', 'paid'),
    ('INV-005', 'CUST-005', 'Vikram Singh',  'OUT-005', 'Classic Bandhgala Suit',  6000, 'Feb 09, 2026', 'Feb 13, 2026', 'pending')
ON CONFLICT (id) DO NOTHING;
