"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth'
import { setApiToken, setApiRefreshFn } from '../lib/api'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import InventoryPage from './components/InventoryPage'
import BillingPage from './components/BillingPage'
import CustomersPage from './components/CustomersPage'
import ReportsPage from './components/ReportsPage'
import WorkersPage from './components/WorkersPage'
import {
  INITIAL_OUTFITS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  Outfit,
  Customer,
  Invoice,
} from '../lib/data'
import {
  fetchOutfits,
  fetchCustomers,
  fetchInvoices,
  insertOutfit,
  updateOutfitDB,
  deleteOutfitDB,
  insertCustomer,
  updateCustomerDB,
  deleteCustomerDB,
  insertInvoice,
  updateInvoiceDB,
} from '../lib/api'

type Page = 'inventory' | 'billing' | 'customers' | 'reports' | 'workers'

export default function App() {
  const { user, token, isLoading, refreshAccessToken } = useAuth()
  const router = useRouter()
  const [activePage, setActivePage] = useState<Page>('inventory')
  const [searchQuery, setSearchQuery] = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  // Shared state – starts empty, filled from Express API
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  // ── Sync token into API layer whenever it changes ──────────────────────────
  useEffect(() => {
    setApiToken(token)
    setApiRefreshFn(refreshAccessToken)
  }, [token, refreshAccessToken])

  // ── Redirect to login if not authenticated ─────────────────────────────────
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  // ── Load data from Express API on mount ───────────────────────────────────
  const loadData = useCallback(async () => {
    if (!user) return
    try {
      const [o, c, i] = await Promise.all([
        fetchOutfits(),
        fetchCustomers(),
        fetchInvoices(),
      ])
      setOutfits(o)
      setCustomers(c)
      setInvoices(i)
    } catch (err) {
      console.warn('API fetch failed, using local seed data:', err)
      setOutfits(INITIAL_OUTFITS)
      setCustomers(INITIAL_CUSTOMERS)
      setInvoices(INITIAL_INVOICES)
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => { loadData() }, [loadData])

  // ── Outfit handlers ──────────────────────────────────────────────────────
  async function addOutfit(o: Outfit) {
    try {
      const saved = await insertOutfit(o)
      setOutfits(prev => [saved, ...prev])
    } catch (err) {
      console.error('Failed to add outfit:', err)
      setOutfits(prev => [o, ...prev])
    }
  }

  async function updateOutfit(o: Outfit) {
    try {
      const saved = await updateOutfitDB(o)
      setOutfits(prev => prev.map(x => x.id === saved.id ? saved : x))
    } catch (err) {
      console.error('Failed to update outfit:', err)
      setOutfits(prev => prev.map(x => x.id === o.id ? o : x))
    }
  }

  async function deleteOutfit(id: string) {
    if (!confirm('Delete this outfit? This cannot be undone.')) return
    try {
      await deleteOutfitDB(id)
      setOutfits(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      console.error('Failed to delete outfit:', err)
    }
  }

  // ── Customer handlers ────────────────────────────────────────────────────
  async function addCustomer(c: Customer) {
    try {
      const saved = await insertCustomer(c)
      setCustomers(prev => [saved, ...prev])
    } catch (err) {
      console.error('Failed to add customer:', err)
      setCustomers(prev => [c, ...prev])
    }
  }

  async function updateCustomer(c: Customer) {
    try {
      const saved = await updateCustomerDB(c)
      setCustomers(prev => prev.map(x => x.id === saved.id ? saved : x))
    } catch (err) {
      console.error('Failed to update customer:', err)
      setCustomers(prev => prev.map(x => x.id === c.id ? c : x))
    }
  }

  async function deleteCustomer(id: string) {
    if (!confirm('Delete this customer? This cannot be undone.')) return
    try {
      await deleteCustomerDB(id)
      setCustomers(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      console.error('Failed to delete customer:', err)
    }
  }

  // ── Invoice handlers ─────────────────────────────────────────────────────
  async function addInvoice(inv: Invoice) {
    try {
      const saved = await insertInvoice(inv)
      setInvoices(prev => [saved, ...prev])
      const [updatedOutfits, updatedCustomers] = await Promise.all([
        fetchOutfits(),
        fetchCustomers(),
      ])
      setOutfits(updatedOutfits)
      setCustomers(updatedCustomers)
    } catch (err) {
      console.error('Failed to add invoice:', err)
      setInvoices(prev => [inv, ...prev])
      setCustomers(prev => prev.map(c => {
        if (c.id === inv.customerId) {
          return { ...c, totalRentals: c.totalRentals + 1, totalSpent: c.totalSpent + inv.amount }
        }
        return c
      }))
      setOutfits(prev => prev.map(o => o.id === inv.outfitId ? { ...o, status: 'rented' } : o))
    }
  }

  async function updateInvoice(inv: Invoice) {
    try {
      const saved = await updateInvoiceDB(inv)
      setInvoices(prev => prev.map(x => x.id === saved.id ? saved : x))
      const updatedOutfits = await fetchOutfits()
      setOutfits(updatedOutfits)
    } catch (err) {
      console.error('Failed to update invoice:', err)
      setInvoices(prev => prev.map(x => x.id === inv.id ? inv : x))
    }
  }

  function handleNavigate(page: string) {
    setActivePage(page as Page)
    setSearchQuery('')
  }

  // Show nothing while auth is resolving (layout handles initial spinner)
  if (isLoading || !user) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} userRole={user.role} />
      <div className="main-layout" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} user={user} />
        <main className="page-content">
          {dataLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading from database…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : (
            <>
              {activePage === 'inventory' && (
                <InventoryPage
                  outfits={outfits}
                  onAddOutfit={addOutfit}
                  onUpdateOutfit={updateOutfit}
                  onDeleteOutfit={deleteOutfit}
                  searchQuery={searchQuery}
                  userRole={user.role}
                />
              )}
              {activePage === 'billing' && (
                <BillingPage
                  invoices={invoices}
                  customers={customers}
                  outfits={outfits}
                  onAddInvoice={addInvoice}
                  onUpdateInvoice={updateInvoice}
                  searchQuery={searchQuery}
                />
              )}
              {activePage === 'customers' && (
                <CustomersPage
                  customers={customers}
                  invoices={invoices}
                  onAddCustomer={addCustomer}
                  onUpdateCustomer={updateCustomer}
                  onDeleteCustomer={deleteCustomer}
                  searchQuery={searchQuery}
                  userRole={user.role}
                />
              )}
              {activePage === 'reports' && user.role === 'admin' && (
                <ReportsPage
                  outfits={outfits}
                  customers={customers}
                  invoices={invoices}
                />
              )}
              {activePage === 'workers' && user.role === 'admin' && (
                <WorkersPage />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}