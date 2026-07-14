"use client"
import React from 'react'
import { Box, CreditCard, Users, BarChart2, HelpCircle } from 'lucide-react'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">VW</div>
        <div>
          <div className="sidebar-logo-name">VastraWise</div>
          <div className="sidebar-logo-sub">Rental Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item w-full text-left${activePage === id ? ' active' : ''}`}
            onClick={() => onNavigate(id)}
            style={{ width: '100%', background: 'none', border: 'none', fontFamily: 'inherit' }}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="contact-support-btn">
          <HelpCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
          <div className="support-label">
            <span>Need help?</span>
            <span>Contact Support</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
