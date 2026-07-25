"use client"
import React, { useState, useRef, useCallback } from 'react'
import { Box, TrendingUp, IndianRupee, Plus, X, Eye, Edit2, Trash2, Package, Upload, ImageIcon, Link, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Outfit } from '../../lib/data'
import type { UserRole } from '../../lib/auth'
import { uploadImageAPI } from '../../lib/api'

interface InventoryPageProps {
    outfits: Outfit[]
    onAddOutfit: (o: Outfit) => void
    onUpdateOutfit: (o: Outfit) => void
    onDeleteOutfit: (id: string) => void
    searchQuery: string
    userRole?: UserRole
}

const CATEGORIES = ['Sherwani', 'Indo-Western', 'Jodhpuri', 'Tuxedo & Suit', 'Kurta Set', 'Accessories', 'Other']
const STATUSES: Outfit['status'][] = ['available', 'rented', 'maintenance']
const CHEST_SIZES = ['36"', '38"', '40"', '42"', '44"', '46"', '48"', 'Custom']
const WAIST_SIZES = ['28"', '30"', '32"', '34"', '36"', '38"', '40"', 'Custom']
const FIT_TYPES = ['Slim Fit', 'Regular Fit', 'Royal Tailored']
const COMMON_ACCESSORIES = ['Royal Turban (Safa)', 'Embroidered Dupatta', 'Designer Brooch', 'Pearl Necklace', 'Silk Bow Tie', 'Cummerbund', 'Velvet Mojari', 'Pocket Square']

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
        rentPrice: 5000,
        securityDeposit: 2000,
        status: 'available',
        imageUrl: '',
        description: '',
        size: '40 (M)',
        chestSize: '40"',
        waistSize: '34"',
        fitType: 'Regular Fit',
        color: '',
        includedAccessories: [],
    }

    const [form, setForm] = useState<Outfit>(outfit ? { ...outfit } : blank)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload')
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    function set(k: keyof Outfit, v: any) {
        setForm(f => ({ ...f, [k]: v }))
        setErrors(e => ({ ...e, [k]: '' }))
    }

    function toggleAccessory(item: string) {
        const current = form.includedAccessories || []
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item]
        set('includedAccessories', updated)
    }

    function validate() {
        const e: Record<string, string> = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!form.rentPrice || form.rentPrice <= 0) e.rentPrice = 'Valid rent price required'
        if (!form.imageUrl.trim()) e.imageUrl = 'Please upload a photo or paste an image URL'
        return e
    }

    async function handleFileUpload(file: File) {
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file (jpg, png, webp, gif).'); return
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image must be under 5 MB.'); return
        }
        setUploading(true)
        setUploadError('')
        try {
            const { url } = await uploadImageAPI(file)
            set('imageUrl', url)
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed. Try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }, [])

    function handleSave() {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        const id = isEdit ? form.id : 'OUT-' + Date.now()
        onSave({ ...form, id })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal" style={{ maxWidth: 640 }}>
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? 'Edit Men\'s Outfit' : 'Add New Men\'s Outfit'}</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Garment Name *</label>
                        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Royal Heritage Velvet Sherwani" />
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
                        <input className="form-input" type="number" value={form.rentPrice || ''} onChange={e => set('rentPrice', Number(e.target.value))} placeholder="e.g. 7500" />
                        {errors.rentPrice && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.rentPrice}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Refundable Security Deposit (₹)</label>
                        <input className="form-input" type="number" value={form.securityDeposit || ''} onChange={e => set('securityDeposit', Number(e.target.value))} placeholder="e.g. 2500" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Chest Size</label>
                        <select className="form-select" value={form.chestSize || '40"'} onChange={e => set('chestSize', e.target.value)}>
                            {CHEST_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Waist Size</label>
                        <select className="form-select" value={form.waistSize || '34"'} onChange={e => set('waistSize', e.target.value)}>
                            {WAIST_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Fit Type</label>
                        <select className="form-select" value={form.fitType || 'Regular Fit'} onChange={e => set('fitType', e.target.value)}>
                            {FIT_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value as Outfit['status'])}>
                            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Color / Fabric Finish</label>
                    <input className="form-input" value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="e.g. Ivory & Antique Gold" />
                </div>

                {/* Accessories Checklist */}
                <div className="form-group">
                    <label className="form-label">Included Accessories</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 6 }}>
                        {COMMON_ACCESSORIES.map(acc => {
                            const checked = (form.includedAccessories || []).includes(acc)
                            return (
                                <button
                                    key={acc}
                                    type="button"
                                    onClick={() => toggleAccessory(acc)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                                        borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                                        background: checked ? 'var(--accent-soft)' : 'var(--input-bg)',
                                        border: `1px solid ${checked ? 'var(--border-focus)' : 'var(--border)'}`,
                                        color: checked ? 'var(--accent-text)' : 'var(--text-secondary)',
                                        textAlign: 'left', transition: 'all 0.15s'
                                    }}
                                >
                                    <CheckCircle2 size={14} style={{ color: checked ? 'var(--accent)' : 'var(--text-muted)' }} />
                                    {acc}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Image Section */}
                <div className="form-group">
                    <label className="form-label">Outfit Photo *</label>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        {(['upload', 'url'] as const).map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setImageTab(tab)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                    cursor: 'pointer', transition: 'all 0.15s',
                                    background: imageTab === tab ? 'var(--accent-soft)' : 'var(--input-bg)',
                                    border: `1px solid ${imageTab === tab ? 'var(--border-focus)' : 'var(--border)'}`,
                                    color: imageTab === tab ? 'var(--accent-text)' : 'var(--text-muted)',
                                }}
                            >
                                {tab === 'upload' ? <Upload size={13} /> : <Link size={13} />}
                                {tab === 'upload' ? 'Upload Photo' : 'Image URL'}
                            </button>
                        ))}
                    </div>

                    {imageTab === 'upload' ? (
                        <div>
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                style={{
                                    border: `2px dashed ${dragOver ? 'var(--accent)' : form.imageUrl ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`,
                                    borderRadius: 12,
                                    padding: form.imageUrl ? '0' : '28px 20px',
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    background: dragOver ? 'var(--accent-soft)' : 'var(--input-bg)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    minHeight: form.imageUrl ? 160 : 'auto',
                                }}
                            >
                                {form.imageUrl ? (
                                    <>
                                        <img
                                            src={form.imageUrl}
                                            alt="Preview"
                                            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                                        />
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center',
                                            opacity: 0, transition: 'opacity 0.2s',
                                            color: '#fff', fontSize: 13, fontWeight: 600, gap: 6,
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                        >
                                            <Upload size={20} />
                                            Click or drop to replace
                                        </div>
                                    </>
                                ) : uploading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                                        <div style={{ width: 32, height: 32, border: '3px solid var(--accent-soft)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        <span style={{ fontSize: 13 }}>Uploading…</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon size={22} style={{ color: 'var(--accent)' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 3 }}>
                                                {dragOver ? '📸 Drop photo here!' : 'Click or drag & drop photo'}
                                            </div>
                                            <div style={{ fontSize: 12 }}>JPG, PNG, WEBP or GIF · Max 5 MB</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
                            />

                            {uploadError && (
                                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{uploadError}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <input
                                className="form-input"
                                value={form.imageUrl}
                                onChange={e => set('imageUrl', e.target.value)}
                                placeholder="https://example.com/men-sherwani.jpg"
                            />
                        </div>
                    )}

                    {errors.imageUrl && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.imageUrl}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Description & Alteration Notes</label>
                    <textarea className="form-textarea" value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Detail fabric quality, embroidery style, or special fitting instructions..." />
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>
                        {uploading ? 'Uploading…' : isEdit ? 'Save Changes' : 'Add Outfit'}
                    </button>
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
            <div className="modal" style={{ maxWidth: 540 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Men's Garment Details</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, aspectRatio: '16/9', background: 'var(--bg-secondary)' }}>
                    <img src={outfit.imageUrl} alt={outfit.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' }} />
                </div>

                <div className="detail-row">
                    <span className="detail-key">Item ID</span>
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
                    <span className="detail-value" style={{ color: 'var(--accent)', fontWeight: 700 }}>{fmtPrice(outfit.rentPrice)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Security Deposit</span>
                    <span className="detail-value" style={{ color: 'var(--green)' }}>{fmtPrice(outfit.securityDeposit || 2000)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Status</span>
                    <span className={`badge ${outfit.status}`}>{outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Chest & Waist</span>
                    <span className="detail-value">Chest: {outfit.chestSize || '40"'} | Waist: {outfit.waistSize || '34"'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Fit Profile</span>
                    <span className="detail-value">{outfit.fitType || 'Regular Fit'}</span>
                </div>
                {outfit.color && <div className="detail-row"><span className="detail-key">Color & Finish</span><span className="detail-value">{outfit.color}</span></div>}

                {outfit.includedAccessories && outfit.includedAccessories.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Included Accessories</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {outfit.includedAccessories.map(acc => (
                                <span key={acc} style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                                    ✓ {acc}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {outfit.description && (
                    <div style={{ marginTop: 14, padding: '14px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{outfit.description}</p>
                    </div>
                )}

                <div className="form-actions">
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

export default function InventoryPage({ outfits, onAddOutfit, onUpdateOutfit, onDeleteOutfit, searchQuery, userRole }: InventoryPageProps) {
    const isAdmin = userRole === 'admin' || !userRole
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

    return (
        <div>
            <div className="page-header">
                <h1>Men's Wardrobe & Groom Inventory</h1>
                <p>Track royal Sherwanis, Indo-Westerns, Jodhpuri Bandhgalas, Tuxedos, Kurta Sets & Accessories</p>
            </div>

            {/* Stats */}
            <div className="stats-grid-3">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Collection</span>
                        <div className="stat-icon blue"><Box /></div>
                    </div>
                    <div className="stat-value">{totalOutfits}</div>
                    <div className="stat-sub">Men's rental outfits</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Active Rentals</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value">{currentlyRented}</div>
                    <div className="stat-sub positive">Out for events</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Active Rental Value</span>
                        <div className="stat-icon purple"><IndianRupee /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(todayRevenue)}</div>
                    <div className="stat-sub">Current active bookings</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <span className="filter-label">Status:</span>
                {(['all', ...STATUSES] as string[]).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline'}`}>
                        {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
                <span style={{ margin: '0 6px', color: 'var(--border)' }}>|</span>
                <span className="filter-label">Category:</span>
                <select className="form-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
                    value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="card empty-state">
                    <Package />
                    <h3>No Men's outfits found</h3>
                    <p>Try adjusting your search query or filters.</p>
                </div>
            ) : (
                <div className="outfit-grid">
                    {filtered.map(outfit => (
                        <div key={outfit.id} className="outfit-card">
                            <div className="outfit-image-wrapper" onClick={() => setViewOutfit(outfit)}>
                                <img
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' }}
                                />
                                <span className={`outfit-status-badge ${outfit.status}`}>
                                    {outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}
                                </span>
                            </div>
                            <div className="outfit-info">
                                <div className="outfit-name">{outfit.name}</div>
                                <div className="outfit-category">
                                    {outfit.category} • Chest: {outfit.chestSize || outfit.size || '40"'}
                                </div>
                                {outfit.includedAccessories && outfit.includedAccessories.length > 0 && (
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <ShieldCheck size={12} style={{ color: 'var(--green)' }} />
                                        {outfit.includedAccessories.length} Accessories Included
                                    </div>
                                )}
                                <div className="outfit-footer">
                                    <div>
                                        <span className="outfit-price">{fmtPrice(outfit.rentPrice)}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>
                                            Dep: {fmtPrice(outfit.securityDeposit || 2000)}
                                        </span>
                                    </div>
                                    <div className="outfit-actions">
                                        <button className="btn-icon" title="View" onClick={() => setViewOutfit(outfit)}><Eye /></button>
                                        <button className="btn-icon" title="Edit" onClick={() => { setEditOutfit(outfit); setShowAdd(true) }}><Edit2 /></button>
                                        {isAdmin && <button className="btn-icon" title="Delete" onClick={() => onDeleteOutfit(outfit.id)} style={{ color: '#ef4444' }}><Trash2 /></button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FAB */}
            <button className="fab" onClick={() => { setEditOutfit(null); setShowAdd(true) }}>
                <Plus /> Add Men's Outfit
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
