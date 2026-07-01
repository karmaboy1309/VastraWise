"use client"
import React, { useState } from 'react'
import { Box, TrendingUp, IndianRupee, Plus, X, Eye, Edit2, Trash2, Package } from 'lucide-react'
import { Outfit } from '../../lib/data'

interface InventoryPageProps {
    outfits: Outfit[]
    onAddOutfit: (o: Outfit) => void
    onUpdateOutfit: (o: Outfit) => void
    onDeleteOutfit: (id: string) => void
    searchQuery: string
}

const CATEGORIES = ['Sherwani', 'Saree', 'Lehenga', 'Kurta', 'Suit', 'Other']
const STATUSES: Outfit['status'][] = ['available', 'rented', 'maintenance']

function fmtPrice(n: number) {
    return '₹' + n.toLocaleString('en-IN')
}

interface OutfitModalProps {
    outfit?: Outfit | null
    onClose: () => void
    onSave: (o: Outfit) => void
}

function OutfitModal({ outfit, onClose, onSave }: OutfitModalProps) {
    const isEdit = !!outfit
    const blank: Outfit = {
        id: '',
        name: '',
        category: 'Sherwani',
        rentPrice: 0,
        status: 'available',
        imageUrl: '',
        description: '',
        size: '',
        color: '',
    }

    const [form, setForm] = useState<Outfit>(outfit ? { ...outfit } : blank)
    const [errors, setErrors] = useState<Record<string, string>>({})

    function set(k: keyof Outfit, v: any) {
        setForm(f => ({ ...f, [k]: v }))
        setErrors(e => ({ ...e, [k]: '' }))
    }

    function validate() {
        const e: Record<string, string> = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!form.rentPrice || form.rentPrice <= 0) e.rentPrice = 'Valid price required'
        if (!form.imageUrl.trim()) e.imageUrl = 'Image URL is required'
        return e
    }

    function handleSave() {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        const id = isEdit ? form.id : 'OUT-' + Date.now()
        onSave({ ...form, id })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? 'Edit Outfit' : 'Add New Outfit'}</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Outfit Name *</label>
                        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Royal Silk Sherwani" />
                        {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Rent Price (₹) *</label>
                        <input className="form-input" type="number" value={form.rentPrice || ''} onChange={e => set('rentPrice', Number(e.target.value))} placeholder="e.g. 5000" />
                        {errors.rentPrice && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.rentPrice}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value as Outfit['status'])}>
                            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Size</label>
                        <input className="form-input" value={form.size || ''} onChange={e => set('size', e.target.value)} placeholder="e.g. M / L / XL" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Color</label>
                        <input className="form-input" value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="e.g. Ivory Gold" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Image URL *</label>
                    <input className="form-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
                    {errors.imageUrl && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.imageUrl}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Brief description of the outfit..." />
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Outfit'}</button>
                </div>
            </div>
        </div>
    )
}

interface DetailModalProps {
    outfit: Outfit
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

function DetailModal({ outfit, onClose, onEdit, onDelete }: DetailModalProps) {
    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal" style={{ maxWidth: 520 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Outfit Details</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, aspectRatio: '16/9', background: 'var(--bg-secondary)' }}>
                    <img src={outfit.imageUrl} alt={outfit.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }} />
                </div>

                <div className="detail-row">
                    <span className="detail-key">ID</span>
                    <span className="detail-value" style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{outfit.id}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Name</span>
                    <span className="detail-value">{outfit.name}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Category</span>
                    <span className="detail-value">{outfit.category}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Rent Price</span>
                    <span className="detail-value" style={{ color: 'var(--accent)' }}>{fmtPrice(outfit.rentPrice)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Status</span>
                    <span className={`badge ${outfit.status}`}>{outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}</span>
                </div>
                {outfit.size && <div className="detail-row"><span className="detail-key">Size</span><span className="detail-value">{outfit.size}</span></div>}
                {outfit.color && <div className="detail-row"><span className="detail-key">Color</span><span className="detail-value">{outfit.color}</span></div>}
                {outfit.description && (
                    <div style={{ marginTop: 12, padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{outfit.description}</p>
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

export default function InventoryPage({ outfits, onAddOutfit, onUpdateOutfit, onDeleteOutfit, searchQuery }: InventoryPageProps) {
    const [showAdd, setShowAdd] = useState(false)
    const [editOutfit, setEditOutfit] = useState<Outfit | null>(null)
    const [viewOutfit, setViewOutfit] = useState<Outfit | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [filterCategory, setFilterCategory] = useState<string>('all')

    const totalOutfits = outfits.length
    const currentlyRented = outfits.filter(o => o.status === 'rented').length
    const todayRevenue = outfits.filter(o => o.status === 'rented').reduce((s, o) => s + o.rentPrice, 0)

    const filtered = outfits.filter(o => {
        const matchSearch = !searchQuery ||
            o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === 'all' || o.status === filterStatus
        const matchCat = filterCategory === 'all' || o.category === filterCategory
        return matchSearch && matchStatus && matchCat
    })

    function handleSave(outfit: Outfit) {
        if (editOutfit) onUpdateOutfit(outfit)
        else onAddOutfit(outfit)
    }

    const categories = Array.from(new Set(outfits.map(o => o.category)))

    return (
        <div>
            <div className="page-header">
                <h1>Inventory Management</h1>
                <p>Manage your rental outfits and track availability</p>
            </div>

            {/* Stats */}
            <div className="stats-grid-3">
                <div className="stat-card glow-blue">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Outfits</span>
                        <div className="stat-icon blue"><Box /></div>
                    </div>
                    <div className="stat-value">{totalOutfits}</div>
                    <div className="stat-sub">Items in inventory</div>
                </div>
                <div className="stat-card glow-green">
                    <div className="stat-card-header">
                        <span className="stat-label">Currently Rented</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value">{currentlyRented}</div>
                    <div className="stat-sub positive">Active rentals</div>
                </div>
                <div className="stat-card glow-purple">
                    <div className="stat-card-header">
                        <span className="stat-label">Today's Revenue</span>
                        <div className="stat-icon purple"><IndianRupee /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(todayRevenue)}</div>
                    <div className="stat-sub">From active rentals</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <span className="filter-label">Filter:</span>
                {(['all', ...STATUSES] as string[]).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline'}`}>
                        {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
                <span style={{ margin: '0 6px', color: 'rgba(255,255,255,0.1)' }}>|</span>
                <select className="form-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
                    value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="card empty-state">
                    <Package />
                    <h3>No outfits found</h3>
                    <p>Try adjusting your filters or add a new outfit.</p>
                </div>
            ) : (
                <div className="outfit-grid">
                    {filtered.map(outfit => (
                        <div key={outfit.id} className="outfit-card">
                            <div className="outfit-image-wrapper" onClick={() => setViewOutfit(outfit)}>
                                <img
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }}
                                />
                                <span className={`outfit-status-badge ${outfit.status}`}>
                                    {outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}
                                </span>
                            </div>
                            <div className="outfit-info">
                                <div className="outfit-name">{outfit.name}</div>
                                <div className="outfit-category">{outfit.category} {outfit.size ? `• ${outfit.size}` : ''}</div>
                                <div className="outfit-footer">
                                    <span className="outfit-price">{fmtPrice(outfit.rentPrice)}</span>
                                    <div className="outfit-actions">
                                        <button className="btn-icon" title="View" onClick={() => setViewOutfit(outfit)}><Eye /></button>
                                        <button className="btn-icon" title="Edit" onClick={() => { setEditOutfit(outfit); setShowAdd(true) }}><Edit2 /></button>
                                        <button className="btn-icon" title="Delete" onClick={() => onDeleteOutfit(outfit.id)} style={{ color: '#ef4444' }}><Trash2 /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FAB */}
            <button className="fab" onClick={() => { setEditOutfit(null); setShowAdd(true) }}>
                <Plus /> Add New Outfit
            </button>

            {/* Modals */}
            {showAdd && (
                <OutfitModal
                    outfit={editOutfit}
                    onClose={() => { setShowAdd(false); setEditOutfit(null) }}
                    onSave={handleSave}
                />
            )}
            {viewOutfit && (
                <DetailModal
                    outfit={viewOutfit}
                    onClose={() => setViewOutfit(null)}
                    onEdit={() => { setEditOutfit(viewOutfit); setViewOutfit(null); setShowAdd(true) }}
                    onDelete={() => onDeleteOutfit(viewOutfit.id)}
                />
            )}
        </div>
    )
}
