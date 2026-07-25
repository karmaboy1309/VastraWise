"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, X, Eye, EyeOff, KeyRound, LogOut, ChevronDown, Shield, User } from 'lucide-react'
import type { AuthUser } from '../../lib/auth'
import { changePasswordAPI } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import ThemeToggle from './ThemeToggle'

interface TopbarProps {
  searchQuery: string
  onSearchChange: (v: string) => void
  user: AuthUser
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSave() {
    if (!form.current || !form.newPass || !form.confirm) {
      setError('All fields are required.'); return
    }
    if (form.newPass.length < 6) {
      setError('New password must be at least 6 characters.'); return
    }
    if (form.newPass !== form.confirm) {
      setError('New passwords do not match.'); return
    }
    setLoading(true)
    try {
      await changePasswordAPI(form.current, form.newPass)
      setSuccess('Password changed successfully!')
      setTimeout(() => onClose(), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="modal-title">Change Password</h2>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>

        {(['current', 'newPass', 'confirm'] as const).map((key) => {
          const labels = { current: 'Current Password', newPass: 'New Password', confirm: 'Confirm New Password' }
          return (
            <div className="form-group" key={key}>
              <label className="form-label">{labels[key]}</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={show[key] ? 'text' : 'password'}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={key === 'current' ? 'Enter current password' : key === 'newPass' ? 'Min 6 characters' : 'Re-enter new password'}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )
        })}

        {error && (
          <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'var(--green-bg)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--green)', marginBottom: 16 }}>
            {success}
          </div>
        )}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────────────
export default function Topbar({ searchQuery, onSearchChange, user }: TopbarProps) {
  const { logout } = useAuth()
  const [panelOpen, setPanelOpen] = useState(false)
  const [showChangePass, setShowChangePass] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    if (panelOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [panelOpen])

  return (
    <>
      <style>{`
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 260px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow-modal);
          z-index: 1000;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-header-section {
          padding: 20px;
          background: var(--accent-soft);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-avatar-lg {
          width: 46px; height: 46px; border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; color: #fff;
          flex-shrink: 0;
        }
        .profile-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .profile-email { font-size: 11px; color: var(--text-muted); margin-top: 2px; word-break: break-all; }
        .profile-role-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;
        }
        .profile-role-badge.admin {
          background: var(--accent-soft); color: var(--accent-text);
          border: 1px solid rgba(99,102,241,0.2);
        }
        .profile-role-badge.worker {
          background: var(--green-bg); color: var(--green);
          border: 1px solid rgba(16,185,129,0.2);
        }
        .profile-menu { padding: 8px; }
        .profile-menu-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          cursor: pointer; transition: background 0.1s;
          font-size: 14px; color: var(--text-secondary);
          background: none; border: none; width: 100%; text-align: left;
          font-family: inherit;
        }
        .profile-menu-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .profile-menu-item.danger:hover { background: var(--red-bg); color: var(--red); }
        .profile-divider { height: 1px; background: var(--border); margin: 4px 8px; }
        .user-chip { cursor: pointer; user-select: none; }
      `}</style>

      <header className="topbar">
        <div className="search-wrapper">
          <Search />
          <input
            className="search-input"
            placeholder="Search outfits, customers, invoices..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="topbar-right">
          <ThemeToggle />
          <button className="notif-btn" title="Notifications">
            <Bell />
            <span className="notif-badge" />
          </button>

          {/* Profile chip — click to open dropdown */}
          <div style={{ position: 'relative' }} ref={panelRef}>
            <div className="user-chip" onClick={() => setPanelOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="user-avatar">{initials}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email" style={{ textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 2, transition: 'transform 0.2s', transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>

            {/* Profile Dropdown Panel */}
            {panelOpen && (
              <div className="profile-dropdown">
                {/* Header */}
                <div className="profile-header-section">
                  <div className="profile-avatar-lg">{initials}</div>
                  <div>
                    <div className="profile-name">{user.name}</div>
                    <div className="profile-email">{user.email}</div>
                    <div className={`profile-role-badge ${user.role}`}>
                      <Shield size={9} />
                      {user.role === 'admin' ? 'Admin' : 'Worker'}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="profile-menu">
                  <button
                    className="profile-menu-item"
                    onClick={() => { setPanelOpen(false); setShowChangePass(true) }}
                  >
                    <KeyRound size={15} style={{ color: '#6366f1' }} />
                    Change Password
                  </button>

                  <div className="profile-divider" />

                  <button
                    className="profile-menu-item danger"
                    onClick={() => { setPanelOpen(false); logout() }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showChangePass && (
        <ChangePasswordModal onClose={() => setShowChangePass(false)} />
      )}
    </>
  )
}
