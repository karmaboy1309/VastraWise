"use client"
import React from 'react'
import { Search, Bell } from 'lucide-react'

interface TopbarProps {
  searchQuery: string
  onSearchChange: (v: string) => void
}

export default function Topbar({ searchQuery, onSearchChange }: TopbarProps) {
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
          <div className="user-avatar">AU</div>
          <div>
            <div className="user-name">Admin User</div>
            <div className="user-email">admin@vastrawise.com</div>
          </div>
        </div>
      </div>
    </header>
  )
}
