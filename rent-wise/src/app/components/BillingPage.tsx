"use client"
import React, { useState } from 'react'
import { CreditCard, Clock, CheckCircle, FileText, Download, X, Plus, Trash2, FileDown, ShieldCheck, Calendar, Wrench } from 'lucide-react'
import { Invoice, Customer, Outfit } from '../../lib/data'
import type { UserRole } from '../../lib/auth'

interface BillingPageProps {
    invoices: Invoice[]
    customers: Customer[]
    outfits: Outfit[]
    onAddInvoice: (inv: Invoice) => void
    onUpdateInvoice: (inv: Invoice) => void
    onDeleteInvoice: (id: string) => void
    searchQuery: string
    userRole?: UserRole
}

const COMMON_ACCESSORIES = ['Royal Turban (Safa)', 'Embroidered Dupatta', 'Designer Brooch', 'Pearl Necklace', 'Silk Bow Tie', 'Cummerbund', 'Velvet Mojari', 'Pocket Square']

function fmtPrice(n: number) {
    return '₹' + n.toLocaleString('en-IN')
}

interface InvoiceModalProps {
    customers: Customer[]
    outfits: Outfit[]
    onClose: () => void
    onSave: (inv: Invoice) => void
}

function InvoiceModal({ customers, outfits, onClose, onSave }: InvoiceModalProps) {
    React.useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const [customerId, setCustomerId] = useState('')
    const [outfitId, setOutfitId] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [returnDate, setReturnDate] = useState('')
    const [trialDate, setTrialDate] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [securityDeposit, setSecurityDeposit] = useState(2000)
    const [depositStatus, setDepositStatus] = useState<'held' | 'refunded' | 'forfeited'>('held')
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
    const [alterationNotes, setAlterationNotes] = useState('')
    const [status, setStatus] = useState<Invoice['status']>('pending')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedOutfit = outfits.find(o => o.id === outfitId)
    const selectedCustomer = customers.find(c => c.id === customerId)

    function handleOutfitSelect(id: string) {
        setOutfitId(id)
        setErrors(er => ({ ...er, outfitId: '' }))
        const o = outfits.find(item => item.id === id)
        if (o) {
            if (o.securityDeposit) setSecurityDeposit(o.securityDeposit)
            if (o.includedAccessories) setSelectedAccessories(o.includedAccessories)
        }
    }

    function toggleAccessory(acc: string) {
        setSelectedAccessories(prev =>
            prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
        )
    }

    function validate() {
        const e: Record<string, string> = {}
        if (!customerId) e.customerId = 'Select a customer'
        if (!outfitId) e.outfitId = 'Select a garment'
        if (!date) e.date = 'Select pickup date'
        if (!returnDate) e.returnDate = 'Select return date'
        return e
    }

    function handleSave() {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        const inv: Invoice = {
            id: 'INV-' + Date.now(),
            customerId,
            customerName: selectedCustomer!.name,
            outfitId,
            outfitName: selectedOutfit!.name,
            amount: selectedOutfit!.rentPrice,
            securityDeposit,
            depositStatus,
            date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            returnDate: new Date(returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            trialDate: trialDate ? new Date(trialDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            eventDate: eventDate ? new Date(eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            includedAccessories: selectedAccessories,
            alterationNotes,
            status,
        }
        onSave(inv)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal" style={{ maxWidth: 640 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Create Men's Rental Invoice</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="form-group">
                    <label className="form-label">Groom / Customer Name *</label>
                    <select className="form-select" value={customerId} onChange={e => { setCustomerId(e.target.value); setErrors(er => ({ ...er, customerId: '' })) }}>
                        <option value="">Select customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.location} ({c.id})</option>)}
                    </select>
                    {errors.customerId && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.customerId}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Men's Garment Collection *</label>
                    <select className="form-select" value={outfitId} onChange={e => handleOutfitSelect(e.target.value)}>
                        <option value="">Select garment...</option>
                        {outfits.filter(o => o.status === 'available').map(o => (
                            <option key={o.id} value={o.id}>
                                {o.name} ({o.category}) — Chest: {o.chestSize || o.size} — {fmtPrice(o.rentPrice)}
                            </option>
                        ))}
                    </select>
                    {errors.outfitId && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.outfitId}</p>}
                </div>

                {selectedOutfit && (
                    <div style={{ padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border-focus)', fontSize: 13, color: 'var(--accent-text)', fontWeight: 500 }}>
                        Rent Price: {fmtPrice(selectedOutfit.rentPrice)} · Chest: {selectedOutfit.chestSize || selectedOutfit.size} · Fit: {selectedOutfit.fitType || 'Regular'}
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Pickup Date *</label>
                        <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        {errors.date && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.date}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Return Date *</label>
                        <input className="form-input" type="date" value={returnDate} min={date} onChange={e => setReturnDate(e.target.value)} />
                        {errors.returnDate && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.returnDate}</p>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Fitting / Trial Date</label>
                        <input className="form-input" type="date" value={trialDate} onChange={e => setTrialDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Wedding / Event Date</label>
                        <input className="form-input" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Refundable Security Deposit (₹)</label>
                        <input className="form-input" type="number" value={securityDeposit} onChange={e => setSecurityDeposit(Number(e.target.value))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Deposit Status</label>
                        <select className="form-select" value={depositStatus} onChange={e => setDepositStatus(e.target.value as any)}>
                            <option value="held">Held (Active Rental)</option>
                            <option value="refunded">Refunded (Returned OK)</option>
                            <option value="forfeited">Forfeited (Damage/Late)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Included Accessories Checklist</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginTop: 4 }}>
                        {COMMON_ACCESSORIES.map(acc => {
                            const checked = selectedAccessories.includes(acc)
                            return (
                                <button
                                    key={acc}
                                    type="button"
                                    onClick={() => toggleAccessory(acc)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px',
                                        borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                                        background: checked ? 'var(--accent-soft)' : 'var(--input-bg)',
                                        border: `1px solid ${checked ? 'var(--border-focus)' : 'var(--border)'}`,
                                        color: checked ? 'var(--accent-text)' : 'var(--text-secondary)',
                                        textAlign: 'left', transition: 'all 0.15s'
                                    }}
                                >
                                    <CheckCircle size={13} style={{ color: checked ? 'var(--accent)' : 'var(--text-muted)' }} />
                                    {acc}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Fitting & Alteration Notes</label>
                    <input className="form-input" value={alterationNotes} onChange={e => setAlterationNotes(e.target.value)} placeholder="e.g. Sleeve shortened 0.5 inches; Chest fitted to 40&quot;" />
                </div>

                <div className="form-group">
                    <label className="form-label">Payment Status</label>
                    <select className="form-select" value={status} onChange={e => setStatus(e.target.value as Invoice['status'])}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Generate Invoice</button>
                </div>
            </div>
        </div>
    )
}

async function downloadInvoicePDF(inv: Invoice) {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const W = 210
    const MARGIN = 18
    const CONTENT_W = W - MARGIN * 2

    const INDIGO = [79, 70, 229] as const
    const DARK = [17, 24, 39] as const
    const GRAY = [107, 114, 128] as const
    const LIGHT_BG = [243, 244, 246] as const
    const WHITE = [255, 255, 255] as const
    const GREEN = [5, 150, 105] as const
    const YELLOW = [217, 119, 6] as const
    const RED = [220, 38, 38] as const

    function typedColor(color: readonly [number, number, number]): [number, number, number] {
        return [...color]
    }

    // ── HEADER BAND ───────────────────────────────────────────
    doc.setFillColor(...typedColor(INDIGO))
    doc.rect(0, 0, W, 46, 'F')

    // Logo square
    doc.setFillColor(255, 255, 255, 0.15)
    doc.roundedRect(MARGIN, 10, 26, 26, 5, 5, 'F')
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('VW', MARGIN + 13, 26.5, { align: 'center' })

    // Brand name
    doc.setFontSize(17)
    doc.setFont('helvetica', 'bold')
    doc.text('VastraWise', MARGIN + 30, 21)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(210, 210, 255)
    doc.text('MEN\'S LUXURY WARDROBE & GROOM RENTALS', MARGIN + 30, 28)

    // INVOICE label
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', W - MARGIN, 21, { align: 'right' })
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(210, 210, 255)
    doc.text(inv.id, W - MARGIN, 29, { align: 'right' })

    // Status pill
    const statusColor = inv.status === 'paid' ? GREEN : inv.status === 'pending' ? YELLOW : RED
    const statusLabel = inv.status.toUpperCase()
    doc.setFillColor(...typedColor(statusColor))
    const pillX = W - MARGIN - 28
    doc.roundedRect(pillX, 33, 28, 8, 2, 2, 'F')
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text(statusLabel, pillX + 14, 38.5, { align: 'center' })

    // ── INVOICE META BAND ─────────────────────────────────────
    doc.setFillColor(...typedColor(LIGHT_BG))
    doc.rect(0, 46, W, 38, 'F')

    const col1 = MARGIN
    const col2 = MARGIN + CONTENT_W * 0.25
    const col3 = MARGIN + CONTENT_W * 0.50
    const col4 = MARGIN + CONTENT_W * 0.75

    function metaBlock(x: number, label: string, value: string) {
        doc.setTextColor(...typedColor(GRAY))
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(label.toUpperCase(), x, 57)
        doc.setTextColor(...typedColor(DARK))
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(value || 'N/A', x, 66)
    }

    metaBlock(col1, 'Pickup Date', inv.date)
    metaBlock(col2, 'Trial Date', inv.trialDate || 'N/A')
    metaBlock(col3, 'Event Date', inv.eventDate || 'N/A')
    metaBlock(col4, 'Return Date', inv.returnDate)

    // Separator line
    doc.setDrawColor(...typedColor(INDIGO))
    doc.setLineWidth(0.4)
    doc.line(MARGIN, 82, W - MARGIN, 82)

    // ── STORE / CUSTOMER INFO ────────────────────────────────
    const secY = 90

    doc.setTextColor(...typedColor(GRAY))
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('STORE / ISSUED BY', col1, secY)
    doc.text('GROOM / BILLED TO', col3, secY)

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.text('VastraWise Men\'s Rentals', col1, secY + 6)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text(['Luxury Groom & Festive Wear Studio', 'Jaipur / Delhi / Mumbai', 'Contact: +91 98765 43210'], col1, secY + 12, { lineHeightFactor: 1.5 })

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.text(inv.customerName, col3, secY + 6)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text([`Customer Ref: ${inv.customerId}`, `Security Deposit Status: ${inv.depositStatus?.toUpperCase() || 'HELD'}`], col3, secY + 12, { lineHeightFactor: 1.5 })

    // ── TABLE HEADER ──────────────────────────────────────────
    const tY = 126
    doc.setFillColor(...typedColor(DARK))
    doc.roundedRect(MARGIN, tY, CONTENT_W, 9, 2, 2, 'F')

    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text('#', MARGIN + 4, tY + 6)
    doc.text('DESCRIPTION & GARMENT SPECS', MARGIN + 12, tY + 6)
    doc.text('ITEM ID', MARGIN + CONTENT_W * 0.55, tY + 6)
    doc.text('RENT AMOUNT', MARGIN + CONTENT_W - 2, tY + 6, { align: 'right' })

    // ── TABLE ROW ─────────────────────────────────────────────
    const rY = tY + 9
    doc.setFillColor(250, 250, 254)
    doc.rect(MARGIN, rY, CONTENT_W, 14, 'F')

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.text('1', MARGIN + 4, rY + 9)
    doc.setFont('helvetica', 'bold')
    doc.text(inv.outfitName, MARGIN + 12, rY + 9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text(inv.outfitId, MARGIN + CONTENT_W * 0.55, rY + 9)
    doc.setTextColor(...typedColor(DARK))
    doc.setFont('helvetica', 'bold')
    doc.text('Rs. ' + inv.amount.toLocaleString('en-IN'), MARGIN + CONTENT_W - 2, rY + 9, { align: 'right' })

    // ── ACCESSORIES & ALTERATION NOTES SECTION ───────────────
    let nextY = rY + 22
    if (inv.includedAccessories && inv.includedAccessories.length > 0) {
        doc.setFillColor(...typedColor(LIGHT_BG))
        doc.roundedRect(MARGIN, nextY, CONTENT_W * 0.54, 30, 2, 2, 'F')

        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...typedColor(DARK))
        doc.text('INCLUDED GROOM ACCESSORIES', MARGIN + 6, nextY + 7)

        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...typedColor(GRAY))
        const accText = inv.includedAccessories.join('  •  ')
        doc.text(accText, MARGIN + 6, nextY + 14, { maxWidth: CONTENT_W * 0.50, lineHeightFactor: 1.4 })
    }

    if (inv.alterationNotes) {
        doc.setFontSize(7)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...typedColor(GRAY))
        doc.text(`Fitting Notes: ${inv.alterationNotes}`, MARGIN + 6, nextY + 25)
    }

    // ── TOTALS BOX ────────────────────────────────────────────
    const totY = rY + 22
    const totX = MARGIN + CONTENT_W * 0.58

    doc.setFillColor(...typedColor(LIGHT_BG))
    doc.roundedRect(totX, totY, CONTENT_W * 0.42, 42, 3, 3, 'F')

    function totRow(label: string, value: string, y: number, bold = false, accent = false) {
        doc.setFontSize(8)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...typedColor(accent ? INDIGO : bold ? DARK : GRAY))
        doc.text(label, totX + 6, y)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...typedColor(accent ? INDIGO : bold ? DARK : GRAY))
        doc.text(value, totX + CONTENT_W * 0.42 - 6, y, { align: 'right' })
    }

    const secDep = inv.securityDeposit || 2000
    totRow('Garment Rent Price', 'Rs. ' + inv.amount.toLocaleString('en-IN'), totY + 10)
    totRow('Refundable Sec. Deposit', 'Rs. ' + secDep.toLocaleString('en-IN'), totY + 18)
    totRow('GST / Store Tax (0%)', 'Rs. 0', totY + 26)

    // Total line
    doc.setFillColor(...typedColor(INDIGO))
    doc.roundedRect(totX, totY + 31, CONTENT_W * 0.42, 11, 0, 0, 'F')
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.text('NET TOTAL PAID', totX + 6, totY + 38.5)
    doc.text('Rs. ' + (inv.amount + secDep).toLocaleString('en-IN'), totX + CONTENT_W * 0.42 - 6, totY + 38.5, { align: 'right' })

    // ── FOOTER ─────────────────────────────────────────────
    const fY = 262
    doc.setFillColor(...typedColor(INDIGO))
    doc.rect(0, fY, W, 0.8, 'F')

    doc.setFillColor(...typedColor(DARK))
    doc.rect(0, fY, W, 35, 'F')

    doc.setTextColor(160, 165, 220)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text('VastraWise Men\'s Luxury Wear & Groom Wardrobe Rentals', W / 2, fY + 10, { align: 'center' })
    doc.text('Security deposits are 100% refundable upon return of undamaged garments & accessories.', W / 2, fY + 17, { align: 'center' })

    doc.setTextColor(...typedColor(INDIGO))
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('Thank you for choosing VastraWise Men\'s Collection!', W / 2, fY + 26, { align: 'center' })

    doc.save(`VastraWise-${inv.id}.pdf`)
}

function exportToCSV(invoices: Invoice[]) {
    const headers = ['Invoice ID', 'Customer', 'Outfit', 'Rent Amount (₹)', 'Security Deposit (₹)', 'Deposit Status', 'Pickup Date', 'Trial Date', 'Event Date', 'Return Date', 'Status']
    const rows = invoices.map(inv => [
        inv.id,
        inv.customerName,
        inv.outfitName,
        inv.amount.toString(),
        (inv.securityDeposit || 2000).toString(),
        inv.depositStatus || 'held',
        inv.date,
        inv.trialDate || '',
        inv.eventDate || '',
        inv.returnDate,
        inv.status,
    ])
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VastraWise-MensWear-Invoices-${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

export default function BillingPage({ invoices, customers, outfits, onAddInvoice, onUpdateInvoice, onDeleteInvoice, searchQuery, userRole }: BillingPageProps) {
    const [showCreate, setShowCreate] = useState(false)
    const isAdmin = userRole === 'admin' || !userRole

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
    const totalDeposits = invoices.filter(i => i.depositStatus === 'held').reduce((s, i) => s + (i.securityDeposit || 2000), 0)
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
    const paidCount = invoices.filter(i => i.status === 'paid').length

    const filtered = invoices.filter(inv => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return inv.id.toLowerCase().includes(q) ||
            inv.customerName.toLowerCase().includes(q) ||
            inv.outfitName.toLowerCase().includes(q)
    })

    function handleStatusChange(inv: Invoice, newStatus: Invoice['status']) {
        onUpdateInvoice({ ...inv, status: newStatus })
    }

    function handleDepositStatusChange(inv: Invoice, newDepositStatus: 'held' | 'refunded' | 'forfeited') {
        onUpdateInvoice({ ...inv, depositStatus: newDepositStatus })
    }

    return (
        <div>
            <div className="page-header">
                <h1>Men's Billing & Rental Invoices</h1>
                <p>Manage rental bookings, fitting schedules, security deposits, and printable groom receipts</p>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Rental Revenue</span>
                        <div className="stat-icon green"><CreditCard /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(totalRevenue)}</div>
                    <div className="stat-sub positive">From paid rentals</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Security Deposits Held</span>
                        <div className="stat-icon blue"><ShieldCheck /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(totalDeposits)}</div>
                    <div className="stat-sub">Refundable liability</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Pending Receivables</span>
                        <div className="stat-icon orange"><Clock /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(pendingAmount)}</div>
                    <div className="stat-sub" style={{ color: 'var(--orange)' }}>Active bookings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Settled Invoices</span>
                        <div className="stat-icon purple"><CheckCircle /></div>
                    </div>
                    <div className="stat-value">{paidCount}</div>
                    <div className="stat-sub">Completed transactions</div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card">
                <div className="section-header">
                    <div>
                        <div className="section-title">Rental Booking Register</div>
                        <div className="section-sub">{filtered.length} Men's wear invoices recorded</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(filtered)} title="Export to CSV">
                            <FileDown size={14} /> Export CSV
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                            <Plus style={{ width: 16, height: 16 }} /> Create Rental Invoice
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Groom / Customer</th>
                                <th>Men's Garment</th>
                                <th>Rent Amount</th>
                                <th>Deposit</th>
                                <th>Fitting / Pickup</th>
                                <th>Return Date</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No Men's wear invoices found
                                    </td>
                                </tr>
                            ) : filtered.map(inv => (
                                <tr key={inv.id}>
                                    <td><span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{inv.id}</span></td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inv.customerName}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{inv.outfitName}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmtPrice(inv.amount)}</td>
                                    <td>
                                        <select
                                            value={inv.depositStatus || 'held'}
                                            onChange={e => handleDepositStatusChange(inv, e.target.value as any)}
                                            style={{
                                                border: '1px solid var(--border)',
                                                fontFamily: 'inherit',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: 6,
                                                color: inv.depositStatus === 'refunded' ? 'var(--green)' : inv.depositStatus === 'forfeited' ? 'var(--red)' : 'var(--accent-text)',
                                                backgroundColor: inv.depositStatus === 'refunded' ? 'var(--green-bg)' : inv.depositStatus === 'forfeited' ? 'var(--red-bg)' : 'var(--accent-soft)',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="held">{fmtPrice(inv.securityDeposit || 2000)} (Held)</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="forfeited">Forfeited</option>
                                        </select>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {inv.date}
                                        {inv.trialDate && <div style={{ fontSize: 10, color: 'var(--accent-text)' }}>Trial: {inv.trialDate}</div>}
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.returnDate}</td>
                                    <td>
                                        <select
                                            value={inv.status}
                                            onChange={e => handleStatusChange(inv, e.target.value as Invoice['status'])}
                                            style={{
                                                border: `1px solid ${inv.status === 'paid' ? 'rgba(16,185,129,0.3)' : inv.status === 'pending' ? 'rgba(251,191,36,0.3)' : 'rgba(244,63,94,0.3)'}`,
                                                fontFamily: 'inherit',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                padding: '5px 10px',
                                                borderRadius: 6,
                                                color: inv.status === 'paid' ? 'var(--green)' : inv.status === 'pending' ? 'var(--yellow)' : 'var(--red)',
                                                backgroundColor: inv.status === 'paid' ? 'var(--green-bg)' : inv.status === 'pending' ? 'var(--yellow-bg)' : 'var(--red-bg)',
                                                outline: 'none',
                                            }}
                                        >
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                            <option value="overdue">Overdue</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => downloadInvoicePDF(inv)}
                                                style={{ gap: 6 }}
                                            >
                                                <Download style={{ width: 13, height: 13 }} /> PDF
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    className="btn-icon"
                                                    title="Delete Invoice"
                                                    onClick={() => {
                                                        if (confirm(`Delete invoice ${inv.id}? This cannot be undone.`)) {
                                                            onDeleteInvoice(inv.id)
                                                        }
                                                    }}
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreate && (
                <InvoiceModal
                    customers={customers}
                    outfits={outfits}
                    onClose={() => setShowCreate(false)}
                    onSave={onAddInvoice}
                />
            )}
        </div>
    )
}
