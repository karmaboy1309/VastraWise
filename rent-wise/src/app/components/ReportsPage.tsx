"use client"
import React from 'react'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, IndianRupee, XCircle, Clock, FileDown } from 'lucide-react'
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
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 51000 },
    { month: 'Mar', revenue: 47000 },
    { month: 'Apr', revenue: 62000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 70000 },
]

const RENTAL_ACTIVITY = [
    { month: 'Jan', rentals: 19 },
    { month: 'Feb', rentals: 32 },
    { month: 'Mar', rentals: 20 },
    { month: 'Apr', rentals: 30 },
    { month: 'May', rentals: 27 },
    { month: 'Jun', rentals: 40 },
]

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6']

const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
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
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</p>
                <p style={{ color: 'var(--green)', fontSize: 16, fontWeight: 800 }}>{payload[0].value} rentals</p>
            </div>
        )
    }
    return null
}

export default function ReportsPage({ outfits, customers, invoices }: ReportsPageProps) {
    // Computed stats
    const paidInvoices = invoices.filter(i => i.status === 'paid')
    const totalRevThisMonth = paidInvoices.reduce((s, i) => s + i.amount, 0)
    const avgRentalValue = paidInvoices.length ? Math.round(totalRevThisMonth / paidInvoices.length) : 8950
    const cancellationRate = 4.2
    const avgRentalDays = 3.8

    // Category breakdown
    const catCounts: Record<string, number> = {}
    outfits.forEach(o => { catCounts[o.category] = (catCounts[o.category] || 0) + 1 })
    const total = outfits.length || 1
    const categoryData = Object.entries(catCounts).map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / total) * 100),
    }))

    // Top performers
    const performers = [
        { rank: 1, name: 'Royal Silk Sherwani', rentals: 24, revenue: 60000 },
        { rank: 2, name: 'Bridal Lehenga Set', rentals: 18, revenue: 75600 },
        { rank: 3, name: 'Designer Banarasi Saree', rentals: 15, revenue: 54000 },
        { rank: 4, name: 'Classic Bandhgala Suit', rentals: 12, revenue: 36000 },
        { rank: 5, name: 'Premium Kurta Pajama', rentals: 10, revenue: 28900 },
    ]

    const rankClass = ['gold', 'silver', 'bronze']

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Reports &amp; Analytics</h1>
                    <p>Track performance and gain insights</p>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            const rows = invoices.map(i => `"${i.id}","${i.customerName}","${i.outfitName}","${i.amount}","${i.date}","${i.returnDate}","${i.status}"`)
                            const csv = ['"Invoice ID","Customer","Outfit","Amount","Date","Return Date","Status"', ...rows].join('\n')
                            const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'VastraWise-Report.csv' })
                            a.click()
                        }}
                    >
                        <FileDown size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="stats-grid-4">
                <div className="stat-card glow-green">
                    <div className="stat-card-header">
                        <span className="stat-label">Monthly Growth</span>
                        <div className="stat-icon green"><TrendingUp /></div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>+23.5%</div>
                    <div className="stat-sub positive" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp style={{ width: 12, height: 12 }} /> vs last month
                    </div>
                </div>
                <div className="stat-card glow-blue">
                    <div className="stat-card-header">
                        <span className="stat-label">Avg. Rental Value</span>
                        <div className="stat-icon blue"><IndianRupee /></div>
                    </div>
                    <div className="stat-value">{fmtPrice(avgRentalValue)}</div>
                    <div className="stat-sub">Per transaction</div>
                </div>
                <div className="stat-card glow-red">
                    <div className="stat-card-header">
                        <span className="stat-label">Cancellation Rate</span>
                        <div className="stat-icon red"><XCircle /></div>
                    </div>
                    <div className="stat-value">{cancellationRate}%</div>
                    <div className="stat-sub positive" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp style={{ width: 12, height: 12 }} /> Improved by 1.2%
                    </div>
                </div>
                <div className="stat-card glow-purple">
                    <div className="stat-card-header">
                        <span className="stat-label">Avg. Rental Days</span>
                        <div className="stat-icon purple"><Clock /></div>
                    </div>
                    <div className="stat-value">{avgRentalDays} days</div>
                    <div className="stat-sub">Per rental</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="chart-grid-2" style={{ marginBottom: 20 }}>
                {/* Revenue Trends */}
                <div className="chart-card">
                    <div className="chart-title">Revenue Trends</div>
                    <div className="chart-subtitle">Monthly revenue over 6 months</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={REVENUE_DATA} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#4b5563' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => v >= 1000 ? `${v / 1000}k` : String(v)}
                            />
                            <Tooltip content={<CustomRevenueTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Rental Activity */}
                <div className="chart-card">
                    <div className="chart-title">Rental Activity</div>
                    <div className="chart-subtitle">Number of rentals per month</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={RENTAL_ACTIVITY} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomRentalTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Line
                                type="monotone"
                                dataKey="rentals"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                dot={{ r: 5, fill: '#10b981', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                                activeDot={{ r: 7, fill: '#10b981', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="chart-grid-2">
                {/* Rentals by Category */}
                <div className="chart-card">
                    <div className="chart-title">Rentals by Category</div>
                    <div className="chart-subtitle">Distribution across outfit types</div>
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
                                <Tooltip formatter={(value: any, name: any) => [String(value ?? 0) + ' outfits', String(name ?? '')]} />
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
                            {categoryData.length === 0 && (
                                <p style={{ fontSize: 13, color: '#94a3b8' }}>No outfit data</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="chart-card">
                    <div className="chart-title">Top Performing Outfits</div>
                    <div className="chart-subtitle">Best sellers this month</div>
                    <div className="top-performers-list">
                        {performers.map((p) => (
                            <div key={p.rank} className="performer-item">
                                <div className={`performer-rank ${rankClass[p.rank - 1] || ''}`}>{p.rank}</div>
                                <div className="performer-info">
                                    <div className="performer-name">{p.name}</div>
                                    <div className="performer-rentals">{p.rentals} rentals</div>
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
