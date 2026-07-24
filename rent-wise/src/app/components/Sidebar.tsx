"use client"
import React from 'react'
import { Box, CreditCard, Users, BarChart2, UserCog, LogOut, HelpCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import type { UserRole } from '../../lib/auth'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  userRole: UserRole
}

const navItems = [
  { id: 'inventory', label: 'Inventory',  icon: Box,       roles: ['admin', 'worker'] },
  { id: 'billing',   label: 'Billing',    icon: CreditCard, roles: ['admin', 'worker'] },
  { id: 'customers', label: 'Customers',  icon: Users,      roles: ['admin', 'worker'] },
  { id: 'reports',   label: 'Reports',    icon: BarChart2,  roles: ['admin'] },
  { id: 'workers',   label: 'Workers',    icon: UserCog,    roles: ['admin'] },
]

export default function Sidebar({ activePage, onNavigate, userRole }: SidebarProps) {
  const { user, logout } = useAuth()

  const visibleItems = navItems.filter(item => item.roles.includes(userRole))

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  async function handleLogout() {
    await logout()
    window.location.href = '/login'
  }

  return (
    <>
      <style>{`
        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #a5b4fc;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .role-chip.worker {
          background: rgba(16,185,129,0.12);
          border-color: rgba(16,185,129,0.3);
          color: #6ee7b7;
        }
        .sidebar-user-section {
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
        }
        .sidebar-user-info { flex: 1; min-width: 0; }
        .sidebar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary, #f8fafc);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .logout-btn:hover {
          color: #f87171;
          background: rgba(239,68,68,0.1);
        }
      `}</style>
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
          {visibleItems.map(({ id, label, icon: Icon }) => (
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
        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          {/* Role chip */}
          <div style={{ padding: '0 16px 12px' }}>
            <div className={`role-chip ${userRole}`}>
              <ShieldCheck size={11} />
              {userRole === 'admin' ? 'Admin' : 'Worker'}
            </div>
          </div>

          {/* Support */}
          <div className="contact-support-btn">
            <HelpCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <div className="support-label">
              <span>Need help?</span>
              <span>Contact Support</span>
            </div>
          </div>

          {/* User + logout */}
          <div className="sidebar-user-section">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
