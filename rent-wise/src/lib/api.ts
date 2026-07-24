// ── VastraWise API Service Layer ─────────────────────────────────────────────
// All calls go to the Express backend.
// Access token is passed via Authorization header.
// On 401, the caller should trigger a token refresh.

import type { Outfit, Customer, Invoice } from './data'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Token accessor ────────────────────────────────────────────────────────────
// The auth context keeps the token in memory. We expose a setter here so
// the context can inject the token without creating a circular import.
let _accessToken: string | null = null
let _refreshFn: (() => Promise<string | null>) | null = null

export function setApiToken(token: string | null) {
    _accessToken = token
}

export function setApiRefreshFn(fn: (() => Promise<string | null>) | null) {
    _refreshFn = fn
}

// ── Generic fetch wrapper ────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit, retry = true): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    }
    if (_accessToken) {
        headers['Authorization'] = `Bearer ${_accessToken}`
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include', // needed for refresh cookie
    })

    // If 401 and we have a refresh function → try once to renew the token
    if (res.status === 401 && retry && _refreshFn) {
        const newToken = await _refreshFn()
        if (newToken) {
            return apiFetch<T>(path, options, false) // retry once with new token
        }
        // Refresh failed — redirect to login
        if (typeof window !== 'undefined') window.location.href = '/login'
        throw new Error('Session expired. Please log in again.')
    }

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

export async function deleteInvoiceDB(id: string): Promise<void> {
    await apiFetch(`/invoices/${id}`, { method: 'DELETE' })
}

// ── USERS (admin only) ────────────────────────────────────────────────────────

export interface WorkerUser {
    _id: string
    id?: string
    name: string
    email: string
    role: 'admin' | 'worker'
    isActive: boolean
    createdAt: string
    createdBy?: { name: string; email: string }
}

export async function fetchUsers(): Promise<WorkerUser[]> {
    return apiFetch<WorkerUser[]>('/users')
}

export async function createUser(data: { name: string; email: string; password: string; role: string }): Promise<WorkerUser> {
    return apiFetch<WorkerUser>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateUser(id: string, data: Partial<{ name: string; role: string; isActive: boolean; password: string }>): Promise<WorkerUser> {
    return apiFetch<WorkerUser>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export async function deleteUser(id: string): Promise<void> {
    await apiFetch(`/users/${id}`, { method: 'DELETE' })
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

export async function changePasswordAPI(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
    })
}

// ── UPLOAD ────────────────────────────────────────────────────────────────────
// Sends a multipart/form-data request — does NOT use apiFetch (which sets Content-Type: JSON)
export async function uploadImageAPI(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const headers: Record<string, string> = {}
    if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || `Upload failed: ${res.status}`)
    }
    return res.json()
}
