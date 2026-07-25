'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const { login, user, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) router.replace('/')
  }, [user, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return null // layout will show loading

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          position: relative;
          padding: 24px;
          transition: background 0.3s ease;
        }

        .login-theme-toggle {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 10;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 44px 40px;
          box-shadow: var(--shadow-modal);
          animation: cardIn 0.3s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .login-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
        }
        .login-logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: #fff;
          flex-shrink: 0;
        }
        .login-logo-text {}
        .login-logo-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }
        .login-logo-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        /* Heading */
        .login-heading {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .login-subheading {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        /* Form */
        .login-field {
          margin-bottom: 18px;
        }
        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.2px;
        }
        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .login-input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: var(--text-muted); }
        .login-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: var(--input-bg-focus);
        }
        .login-input.error-state {
          border-color: rgba(239,68,68,0.5);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .password-toggle:hover { color: var(--text-primary); }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--red-bg);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: var(--red);
          margin-bottom: 20px;
          animation: errIn 0.2s ease both;
        }
        @keyframes errIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        /* Submit button */
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: var(--accent);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          font-family: inherit;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Spinner */
        .login-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer note */
        .login-footer-note {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 28px;
          line-height: 1.5;
        }

        /* Role badges below the card */
        .login-roles {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 24px;
          position: relative;
          z-index: 1;
        }
        .role-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .role-dot.admin  { background: var(--accent); }
        .role-dot.worker { background: var(--green); }
      `}</style>

      <div className="login-page">
        <div className="login-theme-toggle">
          <ThemeToggle />
        </div>

        <div>
          <div className="login-card">
            {/* Logo */}
            <div className="login-logo">
              <div className="login-logo-icon">VW</div>
              <div className="login-logo-text">
                <div className="login-logo-name">VastraWise</div>
                <div className="login-logo-sub">Rental Manager</div>
              </div>
            </div>

            <h1 className="login-heading">Welcome back</h1>
            <p className="login-subheading">Sign in to your store account to continue</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email address</label>
                <div className="login-input-wrap">
                  <Mail className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className={`login-input${error ? ' error-state' : ''}`}
                    placeholder="you@vastrawise.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <Lock className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`login-input${error ? ' error-state' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="login-error">
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="login-btn"
                disabled={submitting || !email || !password}
              >
                {submitting ? (
                  <>
                    <span className="login-spinner" />
                    Signing in…
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="login-footer-note">
              Contact your shop owner if you need access
            </p>
          </div>

          {/* Role indicators */}
          <div className="login-roles">
            <div className="role-badge">
              <span className="role-dot admin" />
              Admin (Shop Owner)
            </div>
            <div className="role-badge">
              <span className="role-dot worker" />
              Worker (Staff)
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
