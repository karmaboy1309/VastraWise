// ── VastraWise API Service Layer ─────────────────────────────────────────────
// Replaces Supabase helpers. All calls go to the Express backend.
// Each function returns data in the same shape as the old Supabase helpers
// so that zero UI component changes are needed.

import type { Outfit, Customer, Invoice } from './data'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Generic fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || `API error: ${res.status}`)
    }
    return res.json()
}

// ── OUTFITS ──────────────────────────────────────────────────────────────────

export async function fetchOutfits(): Promise<Outfit[]> {
    return apiFetch<Outfit[]>('/outfits')
}

export async function insertOutfit(o: Outfit): Promise<Outfit> {
    return apiFetch<Outfit>('/outfits', {
        method: 'POST',
        body: JSON.stringify(o),
    })
}

export async function updateOutfitDB(o: Outfit): Promise<Outfit> {
    return apiFetch<Outfit>(`/outfits/${o.id}`, {
        method: 'PUT',
        body: JSON.stringify(o),
    })
}

export async function deleteOutfitDB(id: string): Promise<void> {
    await apiFetch(`/outfits/${id}`, { method: 'DELETE' })
}

// ── CUSTOMERS ────────────────────────────────────────────────────────────────

export async function fetchCustomers(): Promise<Customer[]> {
    return apiFetch<Customer[]>('/customers')
}

export async function insertCustomer(c: Customer): Promise<Customer> {
    return apiFetch<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(c),
    })
}

export async function updateCustomerDB(c: Customer): Promise<Customer> {
    return apiFetch<Customer>(`/customers/${c.id}`, {
        method: 'PUT',
        body: JSON.stringify(c),
    })
}

export async function deleteCustomerDB(id: string): Promise<void> {
    await apiFetch(`/customers/${id}`, { method: 'DELETE' })
}

// ── INVOICES ─────────────────────────────────────────────────────────────────
// NOTE: The Express backend now handles ALL business logic:
//   - POST /invoices automatically sets outfit to 'rented' + updates customer stats
//   - PUT  /invoices/:id automatically syncs outfit status on payment transitions
// The frontend simply calls the API and refreshes its local state.

export async function fetchInvoices(): Promise<Invoice[]> {
    return apiFetch<Invoice[]>('/invoices')
}

export async function insertInvoice(inv: Invoice): Promise<Invoice> {
    return apiFetch<Invoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(inv),
    })
}

export async function updateInvoiceDB(inv: Invoice): Promise<Invoice> {
    return apiFetch<Invoice>(`/invoices/${inv.id}`, {
        method: 'PUT',
        body: JSON.stringify(inv),
    })
}
