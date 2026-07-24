"use client"
import React, { useState } from 'react'
import { CreditCard, Clock, CheckCircle, FileText, Download, X, Plus, Trash2, FileDown } from 'lucide-react'
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
    const [customerId, setCustomerId] = useState('')
    const [outfitId, setOutfitId] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [returnDate, setReturnDate] = useState('')
    const [status, setStatus] = useState<Invoice['status']>('pending')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedOutfit = outfits.find(o => o.id === outfitId)
    const selectedCustomer = customers.find(c => c.id === customerId)

    function validate() {
        const e: Record<string, string> = {}
        if (!customerId) e.customerId = 'Select a customer'
        if (!outfitId) e.outfitId = 'Select an outfit'
        if (!date) e.date = 'Select date'
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
            date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            returnDate: new Date(returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            status,
        }
        onSave(inv)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Invoice</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="form-group">
                    <label className="form-label">Customer *</label>
                    <select className="form-select" value={customerId} onChange={e => { setCustomerId(e.target.value); setErrors(er => ({ ...er, customerId: '' })) }}>
                        <option value="">Select customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.id}</option>)}
                    </select>
                    {errors.customerId && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.customerId}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Outfit *</label>
                    <select className="form-select" value={outfitId} onChange={e => { setOutfitId(e.target.value); setErrors(er => ({ ...er, outfitId: '' })) }}>
                        <option value="">Select outfit...</option>
                        {outfits.filter(o => o.status === 'available').map(o => <option key={o.id} value={o.id}>{o.name} — {fmtPrice(o.rentPrice)}</option>)}
                    </select>
                    {errors.outfitId && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.outfitId}</p>}
                </div>

                {selectedOutfit && (
                    <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(99,102,241,0.2)', fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                        Amount: {fmtPrice(selectedOutfit.rentPrice)} · Status: {selectedOutfit.status}
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Rental Date *</label>
                        <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        {errors.date && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.date}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Return Date *</label>
                        <input className="form-input" type="date" value={returnDate} min={date} onChange={e => setReturnDate(e.target.value)} />
                        {errors.returnDate && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.returnDate}</p>}
                    </div>
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
                    <button className="btn btn-primary" onClick={handleSave}>Create Invoice</button>
                </div>
            </div>
        </div>
    )
}

async function downloadInvoicePDF(inv: Invoice) {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const W = 210   // A4 width
    const MARGIN = 18
    const CONTENT_W = W - MARGIN * 2

    // ── Brand colors ──────────────────────────────────────────
    const INDIGO = [99, 102, 241] as const
    const DARK = [15, 18, 30] as const
    const GRAY = [100, 106, 120] as const
    const LIGHT_BG = [245, 246, 252] as const
    const WHITE = [255, 255, 255] as const
    const GREEN = [16, 185, 129] as const
    const YELLOW = [245, 158, 11] as const
    const RED = [244, 63, 94] as const

    // Helper for typed color calls
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
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('VastraWise', MARGIN + 30, 22)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 200, 255)
    doc.text('RENTAL MANAGER', MARGIN + 30, 29)

    // INVOICE label (right side)
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', W - MARGIN, 22, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 200, 255)
    doc.text(inv.id, W - MARGIN, 30, { align: 'right' })

    // ── STATUS PILL ───────────────────────────────────────────
    const statusColor = inv.status === 'paid' ? GREEN : inv.status === 'pending' ? YELLOW : RED
    const statusLabel = inv.status.toUpperCase()
    doc.setFillColor(...typedColor(statusColor))
    const pillX = W - MARGIN - 28
    doc.roundedRect(pillX, 34, 28, 8, 2, 2, 'F')
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text(statusLabel, pillX + 14, 39.5, { align: 'center' })

    // ── INVOICE META BAND ─────────────────────────────────────
    doc.setFillColor(...typedColor(LIGHT_BG))
    doc.rect(0, 46, W, 38, 'F')

    const col1 = MARGIN
    const col2 = MARGIN + CONTENT_W * 0.33
    const col3 = MARGIN + CONTENT_W * 0.66

    function metaBlock(x: number, label: string, value: string) {
        doc.setTextColor(...typedColor(GRAY))
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(label.toUpperCase(), x, 58)
        doc.setTextColor(...typedColor(DARK))
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(value, x, 67)
    }

    metaBlock(col1, 'Invoice Date', inv.date)
    metaBlock(col2, 'Return Date', inv.returnDate)
    metaBlock(col3, 'Payment', inv.status.charAt(0).toUpperCase() + inv.status.slice(1))

    // Separator line
    doc.setDrawColor(...typedColor(INDIGO))
    doc.setLineWidth(0.4)
    doc.line(MARGIN, 82, W - MARGIN, 82)

    // ── FROM / BILL TO ────────────────────────────────────────
    const secY = 90

    doc.setTextColor(...typedColor(GRAY))
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('FROM', col1, secY)
    doc.text('BILLED TO', col3, secY)

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('VastraWise Rentals', col1, secY + 7)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text(['Mumbai, Maharashtra', 'admin@vastrawise.com', 'GST: 27AAECU0062R1ZX'], col1, secY + 13, { lineHeightFactor: 1.6 })

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(inv.customerName, col3, secY + 7)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text(`Customer ID: ${inv.customerId}`, col3, secY + 13)

    // ── TABLE HEADER ──────────────────────────────────────────
    const tY = 130
    doc.setFillColor(...typedColor(DARK))
    doc.roundedRect(MARGIN, tY, CONTENT_W, 9, 2, 2, 'F')

    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text('#', MARGIN + 4, tY + 6)
    doc.text('DESCRIPTION', MARGIN + 12, tY + 6)
    doc.text('OUTFIT ID', MARGIN + CONTENT_W * 0.5, tY + 6)
    doc.text('DAYS', MARGIN + CONTENT_W * 0.7, tY + 6)
    doc.text('AMOUNT', MARGIN + CONTENT_W - 2, tY + 6, { align: 'right' })

    // ── TABLE ROW ─────────────────────────────────────────────
    const rY = tY + 9
    doc.setFillColor(250, 250, 254)
    doc.rect(MARGIN, rY, CONTENT_W, 12, 'F')

    doc.setTextColor(...typedColor(DARK))
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.text('1', MARGIN + 4, rY + 8)
    doc.setFont('helvetica', 'bold')
    doc.text(inv.outfitName, MARGIN + 12, rY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    doc.text(inv.outfitId, MARGIN + CONTENT_W * 0.5, rY + 8)
    doc.text('—', MARGIN + CONTENT_W * 0.7, rY + 8)
    doc.setTextColor(...typedColor(DARK))
    doc.setFont('helvetica', 'bold')
    doc.text('Rs. ' + inv.amount.toLocaleString('en-IN'), MARGIN + CONTENT_W - 2, rY + 8, { align: 'right' })

    // ── TOTALS BOX ────────────────────────────────────────────
    const totY = rY + 22
    const totX = MARGIN + CONTENT_W * 0.58

    doc.setFillColor(...typedColor(LIGHT_BG))
    doc.roundedRect(totX, totY, CONTENT_W * 0.42, 38, 3, 3, 'F')

    function totRow(label: string, value: string, y: number, bold = false, accent = false) {
        doc.setFontSize(8.5)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...typedColor(accent ? INDIGO : bold ? DARK : GRAY))
        doc.text(label, totX + 6, y)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...typedColor(accent ? INDIGO : bold ? DARK : GRAY))
        doc.text(value, totX + CONTENT_W * 0.42 - 6, y, { align: 'right' })
    }

    totRow('Rental Amount', 'Rs. ' + inv.amount.toLocaleString('en-IN'), totY + 11)
    totRow('Tax / GST (0%)', 'Rs. 0', totY + 21)

    // Total line
    doc.setFillColor(...typedColor(INDIGO))
    doc.roundedRect(totX, totY + 27, CONTENT_W * 0.42, 11, 0, 0, 'F')
    totRow('TOTAL DUE', 'Rs. ' + inv.amount.toLocaleString('en-IN'), totY + 34.5, true, true)
    doc.setTextColor(...typedColor(WHITE))
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL DUE', totX + 6, totY + 34.5)
    doc.text('Rs. ' + inv.amount.toLocaleString('en-IN'), totX + CONTENT_W * 0.42 - 6, totY + 34.5, { align: 'right' })

    // ── PAYMENT STATUS CALLOUT ────────────────────────────────
    const callY = totY + 6
    doc.setFillColor(...(inv.status === 'paid' ? typedColor([220, 252, 231]) : inv.status === 'pending' ? typedColor([254, 243, 199]) : typedColor([254, 226, 226])))
    doc.roundedRect(MARGIN, callY, CONTENT_W * 0.52, 28, 3, 3, 'F')

    doc.setTextColor(...typedColor(statusColor))
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(inv.status === 'paid' ? 'Payment Received' : inv.status === 'pending' ? 'Payment Pending' : 'Payment Overdue', MARGIN + 6, callY + 10)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...typedColor(GRAY))
    const payNote = inv.status === 'paid'
        ? 'Thank you! This invoice has been settled.'
        : inv.status === 'pending'
            ? 'Please complete payment by the return date.'
            : 'Payment is overdue. Please settle immediately.'
    doc.text(payNote, MARGIN + 6, callY + 18, { maxWidth: CONTENT_W * 0.48 })

    // ── DIVIDER + FOOTER ─────────────────────────────────────
    const fY = 262
    doc.setFillColor(...typedColor(INDIGO))
    doc.rect(0, fY, W, 0.8, 'F')

    doc.setFillColor(...typedColor(DARK))
    doc.rect(0, fY, W, 35, 'F')

    doc.setTextColor(160, 165, 220)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text('VastraWise Rental Manager  •  admin@vastrawise.com  •  +91 98765 43210', W / 2, fY + 10, { align: 'center' })
    doc.text('This is a computer-generated invoice and does not require a physical signature.', W / 2, fY + 18, { align: 'center' })

    doc.setTextColor(...typedColor(INDIGO))
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('Thank you for choosing VastraWise!', W / 2, fY + 27, { align: 'center' })

    // ── SAVE ─────────────────────────────────────────────────
    doc.save(`VastraWise-${inv.id}.pdf`)
}


// ── CSV Export ───────────────────────────────────────────────────────────────
function exportToCSV(invoices: Invoice[]) {
    const headers = ['Invoice ID', 'Customer', 'Outfit', 'Amount (₹)', 'Date', 'Return Date', 'Status']
    const rows = invoices.map(inv => [
        inv.id,
        inv.customerName,
        inv.outfitName,
        inv.amount.toString(),
        inv.date,
        inv.returnDate,
        inv.status,
    ])
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VastraWise-Invoices-${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

export default function BillingPage({ invoices, customers, outfits, onAddInvoice, onUpdateInvoice, onDeleteInvoice, searchQuery, userRole }: BillingPageProps) {
    const [showCreate, setShowCreate] = useState(false)
    const isAdmin = userRole === 'admin' || !userRole

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
    const paidCount = invoices.filter(i => i.status === 'paid').length
    const pendingCount = invoices.filter(i => i.status === 'pending').length
    const totalCount = invoices.length

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

    return (
        <div>
            <div className="page-header">
                <h1>Billing & Invoices</h1>
                <p>Track payments and manage your invoices</p>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card glow-green">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Revenue</span>
                        <div className="stat-icon green"><CreditCard /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(totalRevenue)}</div>
                    <div className="stat-sub positive">This month</div>
                </div>
                <div className="stat-card glow-orange">
                    <div className="stat-card-header">
                        <span className="stat-label">Pending Amount</span>
                        <div className="stat-icon orange"><Clock /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(pendingAmount)}</div>
                    <div className="stat-sub" style={{ color: 'var(--orange)' }}>{pendingCount} invoice{pendingCount !== 1 ? 's' : ''}</div>
                </div>
                <div className="stat-card glow-blue">
                    <div className="stat-card-header">
                        <span className="stat-label">Paid Invoices</span>
                        <div className="stat-icon blue"><CheckCircle /></div>
                    </div>
                    <div className="stat-value">{paidCount}</div>
                    <div className="stat-sub">Successfully paid</div>
                </div>
                <div className="stat-card glow-purple">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Invoices</span>
                        <div className="stat-icon purple"><FileText /></div>
                    </div>
                    <div className="stat-value">{totalCount}</div>
                    <div className="stat-sub">This month</div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card">
                <div className="section-header">
                    <div>
                        <div className="section-title">Recent Invoices</div>
                        <div className="section-sub">{filtered.length} records found</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(filtered)} title="Export to CSV">
                            <FileDown size={14} /> Export CSV
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                            <Plus style={{ width: 16, height: 16 }} /> Create Invoice
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Customer</th>
                                <th>Outfit</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No invoices found
                                    </td>
                                </tr>
                            ) : filtered.map(inv => (
                                <tr key={inv.id}>
                                    <td><span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{inv.id}</span></td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inv.customerName}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{inv.outfitName}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmtPrice(inv.amount)}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{inv.date}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{inv.returnDate}</td>
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
                                                colorScheme: 'dark',
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
