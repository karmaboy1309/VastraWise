"use client"
import React, { useState } from 'react'
import { Users, TrendingUp, IndianRupee, Mail, Phone, MapPin, Plus, X, Eye, Edit2, Trash2 } from 'lucide-react'
import { Customer, Invoice } from '../../lib/data'

interface CustomersPageProps {
    customers: Customer[]
    invoices: Invoice[]
    onAddCustomer: (c: Customer) => void
    onUpdateCustomer: (c: Customer) => void
    onDeleteCustomer: (id: string) => void
    searchQuery: string
}

function fmtPrice(n: number) {
    return '₹' + n.toLocaleString('en-IN')
}

function getInitials(name: string) {
    return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'linear-gradient(135deg, #a855f7, #7c3aed)',
    'linear-gradient(135deg, #ec4899, #be185d)',
    'linear-gradient(135deg, #10b981, #047857)',
    'linear-gradient(135deg, #f97316, #c2410c)',
    'linear-gradient(135deg, #14b8a6, #0f766e)',
    'linear-gradient(135deg, #f59e0b, #92400e)',
    'linear-gradient(135deg, #6366f1, #4338ca)',
]

interface CustomerModalProps {
    customer?: Customer | null
    onClose: () => void
    onSave: (c: Customer) => void
    existingCount: number
}

function CustomerModal({ customer, onClose, onSave, existingCount }: CustomerModalProps) {
    const isEdit = !!customer
    const blank: Customer = {
        id: '',
        name: '',
        initials: '',
        avatarColor: AVATAR_COLORS[existingCount % AVATAR_COLORS.length],
        email: '',
        phone: '',
        location: '',
        status: 'active',
        totalRentals: 0,
        totalSpent: 0,
        joinDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    }

    const [form, setForm] = useState<Customer>(customer ? { ...customer } : blank)
    const [errors, setErrors] = useState<Record<string, string>>({})

    function set(k: keyof Customer, v: any) {
        setForm(f => ({ ...f, [k]: v }))
        setErrors(e => ({ ...e, [k]: '' }))
    }

    function validate() {
        const e: Record<string, string> = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!form.email.trim()) e.email = 'Email is required'
        if (!form.phone.trim()) e.phone = 'Phone is required'
        if (!form.location.trim()) e.location = 'Location is required'
        return e
    }

    function handleSave() {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        const id = isEdit ? form.id : 'CUST-' + Date.now()
        const initials = getInitials(form.name)
        onSave({ ...form, id, initials })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rahul Mehta" />
                        {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@email.com" />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                        {errors.phone && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location *</label>
                        <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State" />
                        {errors.location && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.location}</p>}
                    </div>
                </div>

                {isEdit && (
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Total Rentals</label>
                            <input className="form-input" type="number" min={0} value={form.totalRentals} onChange={e => set('totalRentals', Number(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Spent (₹)</label>
                            <input className="form-input" type="number" min={0} value={form.totalSpent} onChange={e => set('totalSpent', Number(e.target.value))} />
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Customer'}</button>
                </div>
            </div>
        </div>
    )
}

interface DetailModalProps {
    customer: Customer
    invoices: Invoice[]
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

function CustomerDetailModal({ customer, invoices, onClose, onEdit, onDelete }: DetailModalProps) {
    const custInvoices = invoices.filter(i => i.customerId === customer.id)
    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal" style={{ maxWidth: 540 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Customer Profile</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div className="customer-avatar" style={{ background: customer.avatarColor, width: 56, height: 56, fontSize: 18, borderRadius: 14, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                        {customer.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{customer.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                            <span className={`badge ${customer.status}`}>{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Since {customer.joinDate}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-row"><span className="detail-key">Email</span><span className="detail-value">{customer.email}</span></div>
                <div className="detail-row"><span className="detail-key">Phone</span><span className="detail-value">{customer.phone}</span></div>
                <div className="detail-row"><span className="detail-key">Location</span><span className="detail-value">{customer.location}</span></div>
                <div className="detail-row"><span className="detail-key">Total Rentals</span><span className="detail-value">{customer.totalRentals}</span></div>
                <div className="detail-row"><span className="detail-key">Total Spent</span><span className="detail-value" style={{ color: 'var(--accent)' }}>{fmtPrice(customer.totalSpent)}</span></div>

                {custInvoices.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rental History</div>
                        {custInvoices.slice(0, 4).map(inv => (
                            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{inv.outfitName}</span>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmtPrice(inv.amount)}</span>
                                    <span className={`badge ${inv.status}`} style={{ fontSize: 11 }}>{inv.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => { onDelete(); onClose() }}>
                        <Trash2 style={{ width: 14, height: 14 }} /> Delete
                    </button>
                    <div style={{ flex: 1 }} />
                    <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
                    <button className="btn btn-primary btn-sm" onClick={onEdit}>
                        <Edit2 style={{ width: 14, height: 14 }} /> Edit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CustomersPage({ customers, invoices, onAddCustomer, onUpdateCustomer, onDeleteCustomer, searchQuery }: CustomersPageProps) {
    const [showModal, setShowModal] = useState(false)
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)

    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === 'active').length
    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)

    const filtered = customers.filter(c => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
    })

    function handleSave(c: Customer) {
        if (editCustomer) onUpdateCustomer(c)
        else onAddCustomer(c)
    }

    return (
        <div>
            <div className="page-header">
                <h1>Customer Management</h1>
                <p>View and manage your customer base</p>
            </div>

            {/* Stats */}
            <div className="stats-grid-3">
                <div className="stat-card glow-blue">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Customers</span>
                        <div className="stat-icon blue"><Users /></div>
                    </div>
                    <div className="stat-value">{totalCustomers}</div>
                    <div className="stat-sub">Registered users</div>
                </div>
                <div className="stat-card glow-green">
                    <div className="stat-card-header">
                        <span className="stat-label">Active Customers</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value">{activeCustomers}</div>
                    <div className="stat-sub positive">Currently renting</div>
                </div>
                <div className="stat-card glow-purple">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Revenue</span>
                        <div className="stat-icon purple"><IndianRupee /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(totalRevenue)}</div>
                    <div className="stat-sub">From all customers</div>
                </div>
            </div>

            {/* Add button bar */}
            <div className="section-header">
                <div>
                    <div className="section-title">All Customers</div>
                    <div className="section-sub">{filtered.length} of {customers.length} customers</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditCustomer(null); setShowModal(true) }}>
                    <Plus style={{ width: 16, height: 16 }} /> Add Customer
                </button>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="card empty-state">
                    <Users />
                    <h3>No customers found</h3>
                    <p>Try adjusting your search or add a new customer.</p>
                </div>
            ) : (
                <div className="customer-cards-grid">
                    {filtered.map(c => (
                        <div key={c.id} className="customer-card">
                            <div className="customer-header">
                                <div className="customer-avatar" style={{ background: c.avatarColor }}>
                                    {c.initials}
                                </div>
                                <div className="customer-info-block">
                                    <div className="customer-name">{c.name}</div>
                                    <span className={`badge ${c.status}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" title="Edit" onClick={() => { setEditCustomer(c); setShowModal(true) }}><Edit2 /></button>
                                    <button className="btn-icon" title="Delete" onClick={() => onDeleteCustomer(c.id)} style={{ color: '#ef4444' }}><Trash2 /></button>
                                </div>
                            </div>

                            <div className="customer-details">
                                <div className="customer-detail-row"><Mail />{c.email}</div>
                                <div className="customer-detail-row"><Phone />{c.phone}</div>
                                <div className="customer-detail-row"><MapPin />{c.location}</div>
                            </div>

                            <div className="customer-stats">
                                <div className="customer-stat-item">
                                    <span className="customer-stat-label">Total Rentals</span>
                                    <span className="customer-stat-value">{c.totalRentals}</span>
                                </div>
                                <div className="customer-stat-item">
                                    <span className="customer-stat-label">Total Spent</span>
                                    <span className="customer-stat-value highlight">{fmtPrice(c.totalSpent)}</span>
                                </div>
                            </div>

                            <button className="customer-view-btn" onClick={() => setViewCustomer(c)}>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* FAB */}
            <button className="fab" onClick={() => { setEditCustomer(null); setShowModal(true) }}>
                <Plus /> Add Customer
            </button>

            {showModal && (
                <CustomerModal
                    customer={editCustomer}
                    onClose={() => { setShowModal(false); setEditCustomer(null) }}
                    onSave={handleSave}
                    existingCount={customers.length}
                />
            )}
            {viewCustomer && (
                <CustomerDetailModal
                    customer={viewCustomer}
                    invoices={invoices}
                    onClose={() => setViewCustomer(null)}
                    onEdit={() => { setEditCustomer(viewCustomer); setViewCustomer(null); setShowModal(true) }}
                    onDelete={() => onDeleteCustomer(viewCustomer.id)}
                />
            )}
        </div>
    )
}
