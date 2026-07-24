"use client"
import React from 'react'
import { Search, Bell } from 'lucide-react'
import type { AuthUser } from '../../lib/auth'

interface TopbarProps {
  searchQuery: string
  onSearchChange: (v: string) => void
  user: AuthUser
}

export default function Topbar({ searchQuery, onSearchChange, user }: TopbarProps) {
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  return (
    <header className="topbar">
      <div className="search-wrapper">
        <Search />
        <input
          className="search-input"
          placeholder="Search outfits, categories, or IDs..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <button className="notif-btn" title="Notifications">
          <Bell />
          <span className="notif-badge" />
        </button>

        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-email" style={{ textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
