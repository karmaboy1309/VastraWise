'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

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
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        /* Animated background orbs */
        .login-page::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -200px;
          left: -200px;
          animation: orb1 8s ease-in-out infinite alternate;
        }
        .login-page::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
          animation: orb2 10s ease-in-out infinite alternate;
        }
        @keyframes orb1 { from { transform: translate(0, 0) scale(1); } to { transform: translate(60px, 40px) scale(1.1); } }
        @keyframes orb2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(-50px, -30px) scale(1.15); } }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
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
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: #fff;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .login-logo-text {}
        .login-logo-name {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.3px;
        }
        .login-logo-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 1px;
        }

        /* Heading */
        .login-heading {
          font-size: 28px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .login-subheading {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
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
          color: rgba(255,255,255,0.65);
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
          color: rgba(255,255,255,0.3);
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          font-size: 14px;
          color: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.22); }
        .login-input:focus {
          border-color: rgba(99,102,241,0.7);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          background: rgba(255,255,255,0.07);
        }
        .login-input.error-state {
          border-color: rgba(239,68,68,0.6);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .password-toggle:hover { color: rgba(255,255,255,0.65); }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: #fca5a5;
          margin-bottom: 20px;
          animation: errIn 0.25s ease both;
        }
        @keyframes errIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

        /* Submit button */
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: inherit;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.45);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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
          color: rgba(255,255,255,0.25);
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
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .role-dot.admin  { background: #6366f1; }
        .role-dot.worker { background: #10b981; }
      `}</style>

      <div className="login-page">
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
