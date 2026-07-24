'use client'
/**
 * auth.tsx — VastraWise Auth Context
 * ────────────────────────────────────
 * Manages JWT access token (in-memory only — no localStorage to prevent XSS)
 * and silent refresh via the HTTP-only refresh token cookie.
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Types ──────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'worker'

export interface AuthUser {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthContextValue {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    refreshAccessToken: () => Promise<string | null>
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true) // true until initial refresh attempt

    // Ref to hold refresh timer so we can clear it on logout
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Silent refresh ─────────────────────────────────────────────────────────
    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include', // sends the HTTP-only refresh cookie
            })
            if (!res.ok) {
                setUser(null)
                setToken(null)
                return null
            }
            const data = await res.json()
            setToken(data.accessToken)
            setUser(data.user)
            scheduleRefresh()
            return data.accessToken
        } catch {
            setUser(null)
            setToken(null)
            return null
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Schedule auto-refresh 1 minute before the 15-min access token expires ──
    const scheduleRefresh = useCallback(() => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = setTimeout(() => {
            refreshAccessToken()
        }, 14 * 60 * 1000) // 14 minutes
    }, [refreshAccessToken])

    // ── On mount: attempt silent refresh to restore session ───────────────────
    useEffect(() => {
        refreshAccessToken().finally(() => setIsLoading(false))
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
        }
    }, [refreshAccessToken])

    // ── login ──────────────────────────────────────────────────────────────────
    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // so the refresh cookie is set
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Login failed')

        setToken(data.accessToken)
        setUser(data.user)
        scheduleRefresh()
    }, [scheduleRefresh])

    // ── logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).catch(() => {}) // ignore network errors on logout
        setToken(null)
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    )
}
