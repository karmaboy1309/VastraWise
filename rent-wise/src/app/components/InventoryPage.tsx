"use client"
import React, { useState, useRef, useCallback } from 'react'
import {
    Box, TrendingUp, IndianRupee, Plus, X, Eye, Edit2, Trash2, Package,
    Upload, ImageIcon, Link, ShieldCheck, CheckCircle2, Flame, Sparkles,
    Tag, Info, ShoppingBag, Award
} from 'lucide-react'
import { Outfit, CATEGORIES } from '../../lib/data'
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

const STATUSES: Outfit['status'][] = ['available', 'rented', 'maintenance']
const CHEST_SIZES = ['36"', '38"', '40"', '42"', '44"', '46"', '48"', 'Custom']
const WAIST_SIZES = ['28"', '30"', '32"', '34"', '36"', '38"', '40"', 'Custom']
const FIT_TYPES = ['Slim Fit', 'Regular Fit', 'Royal Tailored']
const MARKET_DEMANDS = ['High', 'Very High', 'Trending', 'Classic Peak', 'Moderate']
const COMMON_ACCESSORIES = [
    'Royal Turban (Safa)', 'Embroidered Dupatta', 'Designer Brooch', 'Pearl Necklace',
    'Silk Bow Tie', 'Cummerbund', 'Velvet Mojari', 'Pocket Square', 'Kalgi Pin',
    'Ceremonial Sword Strap', 'Angavastram Stole', 'Marathi Pheta Turban'
]

export const CATEGORY_TABS = [
    { id: 'all', label: 'All Collection', icon: '✨' },
    { id: 'Sherwanis', label: 'Sherwanis', icon: '👑' },
    { id: 'Jodhpuri / Bandhgala', label: 'Jodhpuri / Bandhgala', icon: '🤵' },
    { id: 'Indo-Western', label: 'Indo-Western', icon: '👔' },
    { id: 'Kurtas', label: 'Kurtas', icon: '👕' },
    { id: 'Kurta Sets', label: 'Kurta Sets', icon: '👖' },
    { id: 'Jackets', label: 'Jackets & Vests', icon: '🧥' },
    { id: 'Pathani Wear', label: 'Pathani Wear', icon: '🕌' },
    { id: 'Bottom Wear', label: 'Bottom Wear', icon: '👖' },
    { id: 'Dhoti Collection', label: 'Dhoti Collection', icon: '👘' },
    { id: 'Formal / Occasion Wear', label: 'Formal / Tuxedo', icon: '💼' },
    { id: 'Wedding Collection', label: 'Wedding Collection', icon: '🎉' },
    { id: 'Regional Traditional Wear', label: 'Regional Wear', icon: '🌟' },
    { id: 'Premium Collection', label: 'Premium Collection', icon: '💎' },
]

export function matchesCategory(garmentCategory: string, selectedFilter: string): boolean {
    if (!selectedFilter || selectedFilter === 'all') return true
    if (!garmentCategory) return false

    const cat = garmentCategory.trim().toLowerCase()
    const filter = selectedFilter.trim().toLowerCase()

    if (cat === filter) return true

    // Singular, plural, and category alias flexible matching
    if (filter.includes('sherwani') && cat.includes('sherwani')) return true
    if (filter.includes('jodhpuri') && (cat.includes('jodhpuri') || cat.includes('bandhgala'))) return true
    if (filter.includes('indo-western') && (cat.includes('indo-western') || cat.includes('indo western') || cat.includes('fusion'))) return true
    if (filter.includes('kurta set') && (cat.includes('kurta set') || cat.includes('kurta-set') || cat.includes('combo'))) return true
    if ((filter === 'kurtas' || filter === 'kurta') && (cat.includes('kurta') && !cat.includes('set') && !cat.includes('dhoti set'))) return true
    if (filter.includes('jacket') && (cat.includes('jacket') || cat.includes('waistcoat') || cat.includes('vest') || cat.includes('modi'))) return true
    if (filter.includes('pathani') && cat.includes('pathani')) return true
    if (filter.includes('bottom') && (cat.includes('bottom') || cat.includes('churidar') || cat.includes('pajama') || cat.includes('pant') || cat.includes('salwar') || cat.includes('patiala') || cat.includes('trouser'))) return true
    if (filter.includes('dhoti') && cat.includes('dhoti')) return true
    if ((filter.includes('formal') || filter.includes('tuxedo')) && (cat.includes('formal') || cat.includes('tuxedo') || cat.includes('blazer') || cat.includes('suit') || cat.includes('dinner'))) return true
    if (filter.includes('wedding') && (cat.includes('wedding') || cat.includes('groom') || cat.includes('baraat') || cat.includes('reception') || cat.includes('haldi') || cat.includes('mehendi') || cat.includes('sangeet'))) return true
    if (filter.includes('regional') && (cat.includes('regional') || cat.includes('traditional') || cat.includes('kediyu') || cat.includes('angrakha') || cat.includes('veshti') || cat.includes('phiran') || cat.includes('lucknowi'))) return true
    if (filter.includes('premium') && cat.includes('premium')) return true

    return false
}

function fmtPrice(n: number) {
    return '₹' + n.toLocaleString('en-IN')
}

function getDemandBadge(demand?: string) {
    switch (demand) {
        case 'Very High':
            return {
                label: '🔥 Very High Demand',
                bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                border: 'rgba(255, 255, 255, 0.4)',
                shadow: '0 2px 8px rgba(220, 38, 38, 0.5)'
            }
        case 'Trending':
            return {
                label: '📈 Trending 2026',
                bg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                color: '#ffffff',
                border: 'rgba(255, 255, 255, 0.4)',
                shadow: '0 2px 8px rgba(147, 51, 234, 0.5)'
            }
        case 'Classic Peak':
            return {
                label: '👑 Royal Peak',
                bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'rgba(255, 255, 255, 0.4)',
                shadow: '0 2px 8px rgba(217, 119, 6, 0.5)'
            }
        case 'Moderate':
            return {
                label: '⚖️ Moderate Demand',
                bg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: '#ffffff',
                border: 'rgba(255, 255, 255, 0.4)',
                shadow: '0 2px 8px rgba(75, 85, 99, 0.5)'
            }
        default:
            return {
                label: '⭐ High ROI',
                bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'rgba(255, 255, 255, 0.4)',
                shadow: '0 2px 8px rgba(37, 99, 235, 0.5)'
            }
    }
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
        category: 'Sherwanis',
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
        marketRetailPrice: 35000,
        marketDemand: 'High',
        marketTrendNote: 'High wedding season demand with high rental yield.',
    }

    React.useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

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
                    <h2 className="modal-title">{isEdit ? 'Edit Garment & Market Details' : 'Add New Inventory Garment'}</h2>
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
                        <label className="form-label">Rent Price per Event (₹) *</label>
                        <input className="form-input" type="number" value={form.rentPrice || ''} onChange={e => set('rentPrice', Number(e.target.value))} placeholder="e.g. 7500" />
                        {errors.rentPrice && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.rentPrice}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Refundable Security Deposit (₹)</label>
                        <input className="form-input" type="number" value={form.securityDeposit || ''} onChange={e => set('securityDeposit', Number(e.target.value))} placeholder="e.g. 2500" />
                    </div>
                </div>

                {/* Market Info Inputs */}
                <div className="form-row" style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16 }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent)', fontWeight: 600 }}>Estimated Retail Market Price (₹)</label>
                        <input className="form-input" type="number" value={form.marketRetailPrice || ''} onChange={e => set('marketRetailPrice', Number(e.target.value))} placeholder="e.g. 45000" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent)', fontWeight: 600 }}>Today's Market Demand</label>
                        <select className="form-select" value={form.marketDemand || 'High'} onChange={e => set('marketDemand', e.target.value)}>
                            {MARKET_DEMANDS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Today's Market Trend & ROI Note</label>
                    <input className="form-input" value={form.marketTrendNote || ''} onChange={e => set('marketTrendNote', e.target.value)} placeholder="e.g. Top renter for 2026 wedding season with 3.8x ROI" />
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
                        <label className="form-label">Fit Profile</label>
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
                    <label className="form-label">Color & Fabric Specification</label>
                    <input className="form-input" value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="e.g. Ivory Raw Silk & Antique Zardozi Work" />
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
                    <label className="form-label">Garment Photo *</label>

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
                                placeholder="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b"
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
    React.useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const badge = getDemandBadge(outfit.marketDemand)
    const marginPct = outfit.marketRetailPrice ? Math.round(((outfit.rentPrice * 5) / outfit.marketRetailPrice) * 100) : 85

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal" style={{ maxWidth: 580 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Garment & Today's Market Specs</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, aspectRatio: '16/9', background: 'var(--bg-secondary)', position: 'relative' }}>
                    <img
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' }}
                    />
                    <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: badge.bg, color: '#ffffff',
                        border: `1px solid ${badge.border}`,
                        boxShadow: badge.shadow,
                        padding: '5px 12px', borderRadius: 20,
                        fontSize: 12, fontWeight: 700,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '0.02em', zIndex: 2
                    }}>
                        {badge.label}
                    </div>
                </div>

                <div className="detail-row">
                    <span className="detail-key">Item ID</span>
                    <span className="detail-value" style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{outfit.id}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Garment Name</span>
                    <span className="detail-value" style={{ fontWeight: 700 }}>{outfit.name}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Category</span>
                    <span className="detail-value">{outfit.category}</span>
                </div>

                {/* Today's Market Info Block */}
                <div style={{ background: 'var(--accent-soft)', borderRadius: 12, padding: '14px 16px', margin: '14px 0', border: '1px solid var(--border-focus)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                        <TrendingUp size={16} /> TODAY'S MARKET & RENTAL METRICS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>RENT PRICE</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{fmtPrice(outfit.rentPrice)}</div>
                        </div>
                        <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>RETAIL VALUE</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{fmtPrice(outfit.marketRetailPrice || outfit.rentPrice * 5)}</div>
                        </div>
                        <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>SEASONAL ROI</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--green)' }}>~{marginPct}% Yield</div>
                        </div>
                    </div>
                    {outfit.marketTrendNote && (
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <Sparkles size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                            <span>{outfit.marketTrendNote}</span>
                        </div>
                    )}
                </div>

                <div className="detail-row">
                    <span className="detail-key">Refundable Security Deposit</span>
                    <span className="detail-value" style={{ color: 'var(--green)', fontWeight: 600 }}>{fmtPrice(outfit.securityDeposit || 2000)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Current Status</span>
                    <span className={`badge ${outfit.status}`}>{outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Chest & Waist Fit</span>
                    <span className="detail-value">Chest: {outfit.chestSize || '40"'} | Waist: {outfit.waistSize || '34"'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Fit Profile</span>
                    <span className="detail-value">{outfit.fitType || 'Regular Fit'}</span>
                </div>
                {outfit.color && <div className="detail-row"><span className="detail-key">Color & Finish</span><span className="detail-value">{outfit.color}</span></div>}

                {outfit.includedAccessories && outfit.includedAccessories.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Included Royal Accessories</div>
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
    const [filterDemand, setFilterDemand] = useState<string>('all')

    const totalOutfits = outfits.length
    const currentlyRented = outfits.filter(o => o.status === 'rented').length
    const todayRevenue = outfits.filter(o => o.status === 'rented').reduce((s, o) => s + o.rentPrice, 0)
    const totalRetailValuation = outfits.reduce((s, o) => s + (o.marketRetailPrice || o.rentPrice * 5), 0)

    const filtered = outfits.filter(o => {
        const matchSearch = !searchQuery ||
            o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.color && o.color.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchStatus = filterStatus === 'all' || o.status === filterStatus
        const matchCat = matchesCategory(o.category, filterCategory)
        const matchDemand = filterDemand === 'all' || o.marketDemand === filterDemand
        return matchSearch && matchStatus && matchCat && matchDemand
    })

    function handleSave(outfit: Outfit) {
        if (editOutfit) onUpdateOutfit(outfit)
        else onAddOutfit(outfit)
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        Men's Royal Wardrobe & Market Inventory
                        <span style={{ fontSize: 13, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                            {totalOutfits} Wears
                        </span>
                    </h1>
                    <p>Track Sherwanis, Jodhpuri Bandhgalas, Indo-Western, Kurtas, Jackets, Dhotis, Pathani & Regional Collections with Today's Market Rates</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditOutfit(null); setShowAdd(true) }}>
                    <Plus style={{ width: 16, height: 16 }} /> Add Men's Outfit
                </button>
            </div>

            {/* Today's Market Trends & Stats Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                border: '1px solid var(--border-focus)',
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 24,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <ShoppingBag size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Portfolio Retail Value</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{fmtPrice(totalRetailValuation)}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Today's estimated market asset value</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Rental Yield</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)' }}>{fmtPrice(todayRevenue)}</div>
                        <div style={{ fontSize: 11, color: 'var(--green)' }}>{currentlyRented} Outfits active on events</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(234, 179, 8, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
                        <Award size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Market Trend 2026</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Zardozi & Raw Silk High Demand</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Pastels, Velvet & Micro-embroidery</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid-3">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Wardrobe Count</span>
                        <div className="stat-icon blue"><Box /></div>
                    </div>
                    <div className="stat-value">{totalOutfits}</div>
                    <div className="stat-sub">Across 13 specialized categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Active Event Bookings</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value">{currentlyRented}</div>
                    <div className="stat-sub positive">Out for client trials & weddings</div>
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

            {/* Interactive Scrollable Category Tabs Bar */}
            <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 10,
                marginBottom: 16,
                marginTop: 20,
                scrollbarWidth: 'thin'
            }}>
                {CATEGORY_TABS.map(tab => {
                    const count = tab.id === 'all'
                        ? totalOutfits
                        : outfits.filter(o => matchesCategory(o.category, tab.id)).length
                    const active = filterCategory === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setFilterCategory(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                background: active
                                    ? 'linear-gradient(135deg, var(--accent) 0%, #2563eb 100%)'
                                    : 'var(--input-bg)',
                                color: active ? '#ffffff' : 'var(--text-secondary)',
                                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                                boxShadow: active ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            <span style={{
                                fontSize: 11,
                                padding: '2px 7px',
                                borderRadius: 10,
                                background: active ? 'rgba(255, 255, 255, 0.25)' : 'var(--accent-soft)',
                                color: active ? '#ffffff' : 'var(--accent-text)',
                                fontWeight: 700
                            }}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
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
                    <option value="all">All 13 Categories ({totalOutfits})</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <span style={{ margin: '0 6px', color: 'var(--border)' }}>|</span>
                <span className="filter-label">Market Demand:</span>
                <select className="form-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
                    value={filterDemand} onChange={e => setFilterDemand(e.target.value)}>
                    <option value="all">All Market Demands</option>
                    {MARKET_DEMANDS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="card empty-state">
                    <Package />
                    <h3>No Men's outfits found</h3>
                    <p>Try adjusting your search query, category, or market demand filters.</p>
                </div>
            ) : (
                <div className="outfit-grid">
                    {filtered.map(outfit => {
                        const badge = getDemandBadge(outfit.marketDemand)
                        return (
                            <div key={outfit.id} className="outfit-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="outfit-image-wrapper" onClick={() => setViewOutfit(outfit)}>
                                    <img
                                        src={outfit.imageUrl}
                                        alt={outfit.name}
                                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' }}
                                    />
                                    <span className={`outfit-status-badge ${outfit.status}`}>
                                        {outfit.status.charAt(0).toUpperCase() + outfit.status.slice(1)}
                                    </span>
                                    <span style={{
                                        position: 'absolute', bottom: 10, left: 10,
                                        background: badge.bg, color: '#ffffff',
                                        border: `1px solid ${badge.border}`,
                                        boxShadow: badge.shadow,
                                        padding: '4px 10px', borderRadius: 14,
                                        fontSize: 11, fontWeight: 700,
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                                        letterSpacing: '0.02em', zIndex: 2
                                    }}>
                                        {badge.label}
                                    </span>
                                </div>
                                <div className="outfit-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div className="outfit-name">{outfit.name}</div>
                                    <div className="outfit-category">
                                        {outfit.category} • Chest: {outfit.chestSize || outfit.size || '40"'}
                                    </div>

                                    {outfit.marketRetailPrice && (
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Tag size={12} style={{ color: 'var(--accent)' }} />
                                            Retail: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fmtPrice(outfit.marketRetailPrice)}</span>
                                        </div>
                                    )}

                                    {outfit.includedAccessories && outfit.includedAccessories.length > 0 && (
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <ShieldCheck size={12} style={{ color: 'var(--green)' }} />
                                            {outfit.includedAccessories.length} Accessories Included
                                        </div>
                                    )}

                                    <div style={{ marginTop: 'auto' }}>
                                        <div className="outfit-footer">
                                            <div>
                                                <span className="outfit-price">{fmtPrice(outfit.rentPrice)}</span>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>
                                                    Dep: {fmtPrice(outfit.securityDeposit || 2000)}
                                                </span>
                                            </div>
                                            <div className="outfit-actions">
                                                <button className="btn-icon" title="View Details" onClick={() => setViewOutfit(outfit)}><Eye /></button>
                                                <button className="btn-icon" title="Edit" onClick={() => { setEditOutfit(outfit); setShowAdd(true) }}><Edit2 /></button>
                                                {isAdmin && <button className="btn-icon" title="Delete" onClick={() => onDeleteOutfit(outfit.id)} style={{ color: '#ef4444' }}><Trash2 /></button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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
