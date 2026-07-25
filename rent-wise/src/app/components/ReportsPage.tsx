"use client"
import React from 'react'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, IndianRupee, XCircle, Clock, FileDown, ShieldCheck, Scissors } from 'lucide-react'
import { Outfit, Customer, Invoice } from '../../lib/data'

interface ReportsPageProps {
    outfits: Outfit[]
    customers: Customer[]
    invoices: Invoice[]
}

function fmtPrice(n: number) {
    return '₹' + n.toLocaleString('en-IN')
}

const REVENUE_DATA = [
    { month: 'Jan', revenue: 48000 },
    { month: 'Feb', revenue: 65000 },
    { month: 'Mar', revenue: 52000 },
    { month: 'Apr', revenue: 78000 },
    { month: 'May', revenue: 62000 },
    { month: 'Jun', revenue: 95000 },
]

const RENTAL_ACTIVITY = [
    { month: 'Jan', rentals: 14 },
    { month: 'Feb', rentals: 28 },
    { month: 'Mar', rentals: 18 },
    { month: 'Apr', rentals: 32 },
    { month: 'May', rentals: 25 },
    { month: 'Jun', rentals: 42 },
]

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6']

const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-focus)', borderRadius: 12, padding: '10px 16px', boxShadow: 'var(--shadow-hover)' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</p>
                <p style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 800 }}>{fmtPrice(payload[0].value)}</p>
            </div>
        )
    }
    return null
}

const CustomRentalTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 16px', boxShadow: 'var(--shadow-hover)' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</p>
                <p style={{ color: 'var(--green)', fontSize: 16, fontWeight: 800 }}>{payload[0].value} Men's Rentals</p>
            </div>
        )
    }
    return null
}

export default function ReportsPage({ outfits, customers, invoices }: ReportsPageProps) {
    const paidInvoices = invoices.filter(i => i.status === 'paid')
    const totalRevThisMonth = paidInvoices.reduce((s, i) => s + i.amount, 0)
    const avgRentalValue = paidInvoices.length ? Math.round(totalRevThisMonth / paidInvoices.length) : 6800
    const totalDepositsHeld = invoices.filter(i => i.depositStatus === 'held').reduce((s, i) => s + (i.securityDeposit || 2000), 0)
    const activeFittings = invoices.filter(i => i.trialDate && i.status === 'pending').length || 2

    // Category breakdown
    const catCounts: Record<string, number> = {}
    outfits.forEach(o => { catCounts[o.category] = (catCounts[o.category] || 0) + 1 })
    const total = outfits.length || 1
    const categoryData = Object.entries(catCounts).map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / total) * 100),
    }))

    // Men's Wear Top Performers
    const performers = [
        { rank: 1, name: 'Royal Heritage Velvet Sherwani', rentals: 28, revenue: 238000 },
        { rank: 2, name: 'Asymmetric Fusion Indo-Western', rentals: 22, revenue: 136400 },
        { rank: 3, name: 'Heritage Jodhpuri Bandhgala Suit', rentals: 19, revenue: 133000 },
        { rank: 4, name: 'Black-Tie Gala Dinner Tuxedo', rentals: 16, revenue: 92800 },
        { rank: 5, name: 'Raw Silk Kurta & Nehru Jacket', rentals: 14, revenue: 53200 },
    ]

    const rankClass = ['gold', 'silver', 'bronze']

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Men's Rental Business Intelligence</h1>
                    <p>Performance metrics for Sherwanis, Groom Wear, Fitting Pipeline & Security Deposits</p>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            const rows = invoices.map(i => `"${i.id}","${i.customerName}","${i.outfitName}","${i.amount}","${i.securityDeposit || 2000}","${i.date}","${i.returnDate}","${i.status}"`)
                            const csv = ['"Invoice ID","Groom Customer","Garment","Rent Amount","Security Deposit","Pickup Date","Return Date","Status"', ...rows].join('\n')
                            const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'VastraWise-MensWear-Report.csv' })
                            a.click()
                        }}
                    >
                        <FileDown size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="stats-grid-4">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Wedding Booking Growth</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>+28.4%</div>
                    <div className="stat-sub positive" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp style={{ width: 12, height: 12 }} /> Peak season trend
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Avg. Groom Rental Value</span>
                        <div className="stat-icon blue"><IndianRupee /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(avgRentalValue)}</div>
                    <div className="stat-sub">Per outfit booking</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Security Deposits Held</span>
                        <div className="stat-icon purple"><ShieldCheck /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(totalDepositsHeld)}</div>
                    <div className="stat-sub">Active liability held</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Fittings In Pipeline</span>
                        <div className="stat-icon orange"><Scissors /></div>
                    </div>
                    <div className="stat-value">{activeFittings} Groom Trials</div>
                    <div className="stat-sub">Scheduled alteration trials</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="chart-grid-2" style={{ marginBottom: 20 }}>
                {/* Revenue Trends */}
                <div className="chart-card">
                    <div className="chart-title">Men's Rental Revenue Trends</div>
                    <div className="chart-subtitle">Monthly revenue from Sherwanis & Groom Wear (6 months)</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={REVENUE_DATA} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => v >= 1000 ? `${v / 1000}k` : String(v)}
                            />
                            <Tooltip content={<CustomRevenueTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
                            <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Rental Activity */}
                <div className="chart-card">
                    <div className="chart-title">Booking Volume Trends</div>
                    <div className="chart-subtitle">Number of Men's outfits rented per month</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={RENTAL_ACTIVITY} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomRentalTooltip />} cursor={{ stroke: 'var(--green)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Line
                                type="monotone"
                                dataKey="rentals"
                                stroke="var(--green)"
                                strokeWidth={2.5}
                                dot={{ r: 5, fill: 'var(--green)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                                activeDot={{ r: 7, fill: 'var(--green)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="chart-grid-2">
                {/* Rentals by Category */}
                <div className="chart-card">
                    <div className="chart-title">Men's Wardrobe Share</div>
                    <div className="chart-subtitle">Distribution across Sherwanis, Tuxedos, Jodhpuris & Accessories</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <ResponsiveContainer width={180} height={200}>
                            <PieChart>
                                <Pie
                                    data={categoryData.length > 0 ? categoryData : [{ name: 'No data', value: 1, pct: 100 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={58}
                                    outerRadius={84}
                                    paddingAngle={3}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    {(categoryData.length > 0 ? categoryData : [{ name: 'No data' }]).map((entry, index) => (
                                        <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any, name: any) => [String(value ?? 0) + ' items', String(name ?? '')]} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="donut-legend" style={{ flex: 1 }}>
                            {categoryData.map((d, i) => (
                                <div key={d.name} className="legend-item">
                                    <div className="legend-dot" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                                    <span className="legend-label">{d.name}</span>
                                    <span className="legend-pct">{d.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="chart-card">
                    <div className="chart-title">Top Rented Men's Garments</div>
                    <div className="chart-subtitle">Most booked groom outfits</div>
                    <div className="top-performers-list">
                        {performers.map((p) => (
                            <div key={p.rank} className="performer-item">
                                <div className={`performer-rank ${rankClass[p.rank - 1] || ''}`}>{p.rank}</div>
                                <div className="performer-info">
                                    <div className="performer-name">{p.name}</div>
                                    <div className="performer-rentals">{p.rentals} bookings</div>
                                </div>
                                <div className="performer-revenue">{fmtPrice(p.revenue)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
