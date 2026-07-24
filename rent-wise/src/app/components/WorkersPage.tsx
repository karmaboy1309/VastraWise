'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { UserCog, Plus, X, Edit2, Trash2, ShieldCheck, UserCheck, UserX, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { fetchUsers, createUser, updateUser, deleteUser, type WorkerUser } from '../../lib/api'

// ── Create/Edit Modal ─────────────────────────────────────────────────────────
interface WorkerModalProps {
  worker?: WorkerUser | null
  onClose: () => void
  onSave: () => void
}

function WorkerModal({ worker, onClose, onSave }: WorkerModalProps) {
  const isEdit = !!worker
  const [form, setForm] = useState({
    name: worker?.name || '',
    email: worker?.email || '',
    password: '',
    role: worker?.role || 'worker',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
    setApiError('')
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!isEdit && !form.email.trim()) e.email = 'Email is required'
    if (!isEdit && !form.password) e.password = 'Password is required'
    if (form.password && form.password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    try {
      if (isEdit && worker) {
        const payload: Parameters<typeof updateUser>[1] = { name: form.name, role: form.role as 'admin' | 'worker' }
        if (form.password) payload.password = form.password
        await updateUser(worker._id, payload)
      } else {
        await createUser({ name: form.name, email: form.email, password: form.password, role: form.role })
      }
      onSave()
      onClose()
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Worker' : 'Add Worker'}</h2>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
            {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="worker">Worker (Staff)</option>
              <option value="admin">Admin (Shop Owner)</option>
            </select>
          </div>
        </div>

        {!isEdit && (
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="worker@vastrawise.com" />
            {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder={isEdit ? 'Enter new password to change…' : 'Min 6 characters'}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
        </div>

        {apiError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 16 }}>
            {apiError}
          </div>
        )}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Worker'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── WorkersPage ───────────────────────────────────────────────────────────────
export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editWorker, setEditWorker] = useState<WorkerUser | null>(null)
  const [error, setError] = useState('')

  const loadWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setWorkers(data)
      setError('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load workers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadWorkers() }, [loadWorkers])

  async function handleToggleActive(worker: WorkerUser) {
    try {
      await updateUser(worker._id, { isActive: !worker.isActive })
      loadWorkers()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  async function handleDelete(worker: WorkerUser) {
    if (!confirm(`Permanently delete "${worker.name}"? This cannot be undone.`)) return
    try {
      await deleteUser(worker._id)
      loadWorkers()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete worker')
    }
  }

  const adminCount  = workers.filter(w => w.role === 'admin').length
  const workerCount = workers.filter(w => w.role === 'worker').length
  const activeCount = workers.filter(w => w.isActive).length

  return (
    <>
      <style>{`
        .workers-table { width: 100%; border-collapse: collapse; }
        .workers-table th {
          text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;
          border-bottom: 1px solid var(--border);
        }
        .workers-table td {
          padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px; color: var(--text-secondary);
          vertical-align: middle;
        }
        .workers-table tr:last-child td { border-bottom: none; }
        .workers-table tr:hover td { background: rgba(255,255,255,0.02); }
        .worker-name-cell { display: flex; align-items: center; gap: 10px; }
        .worker-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0;
        }
        .worker-avatar.worker-role { background: linear-gradient(135deg, #10b981, #047857); }
        .worker-name { font-weight: 600; color: var(--text-primary); font-size: 14px; }
        .worker-email { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .status-dot.active  { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.5); }
        .status-dot.inactive { background: #6b7280; }
        .inactive-row td { opacity: 0.6; }
      `}</style>

      <div>
        <div className="page-header">
          <h1>Worker Management</h1>
          <p>Manage store staff accounts and access permissions</p>
        </div>

        {/* Stats */}
        <div className="stats-grid-3">
          <div className="stat-card glow-blue">
            <div className="stat-card-header">
              <span className="stat-label">Total Accounts</span>
              <div className="stat-icon blue"><UserCog /></div>
            </div>
            <div className="stat-value">{workers.length}</div>
            <div className="stat-sub">{adminCount} admin · {workerCount} workers</div>
          </div>
          <div className="stat-card glow-green">
            <div className="stat-card-header">
              <span className="stat-label">Active</span>
              <div className="stat-icon green"><UserCheck /></div>
            </div>
            <div className="stat-value">{activeCount}</div>
            <div className="stat-sub positive">Can log in</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Deactivated</span>
              <div className="stat-icon"><UserX /></div>
            </div>
            <div className="stat-value">{workers.length - activeCount}</div>
            <div className="stat-sub">Blocked from login</div>
          </div>
        </div>

        {/* Header bar */}
        <div className="section-header">
          <div>
            <div className="section-title">All Accounts</div>
            <div className="section-sub">{workers.length} total</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={loadWorkers}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-primary" onClick={() => { setEditWorker(null); setShowModal(true) }}>
              <Plus size={16} /> Add Worker
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '14px 18px', color: '#fca5a5', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
              <div style={{ width: 28, height: 28, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: 'var(--text-muted)' }}>Loading…</span>
            </div>
          ) : workers.length === 0 ? (
            <div className="empty-state">
              <UserCog />
              <h3>No workers yet</h3>
              <p>Add your first worker account to get started.</p>
            </div>
          ) : (
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(worker => (
                  <tr key={worker._id} className={!worker.isActive ? 'inactive-row' : ''}>
                    {/* Name + email */}
                    <td>
                      <div className="worker-name-cell">
                        <div className={`worker-avatar ${worker.role === 'worker' ? 'worker-role' : ''}`}>
                          {worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div className="worker-name">{worker.name}</div>
                          <div className="worker-email">{worker.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: worker.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.12)',
                        border: `1px solid ${worker.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`,
                        borderRadius: 20, padding: '3px 10px', fontSize: 11,
                        fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase',
                        color: worker.role === 'admin' ? '#a5b4fc' : '#6ee7b7',
                      }}>
                        <ShieldCheck size={11} />
                        {worker.role === 'admin' ? 'Admin' : 'Worker'}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-dot ${worker.isActive ? 'active' : 'inactive'}`} />
                      {worker.isActive ? 'Active' : 'Deactivated'}
                    </td>

                    {/* Created */}
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(worker.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => { setEditWorker(worker); setShowModal(true) }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          title={worker.isActive ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleActive(worker)}
                          style={{ color: worker.isActive ? '#f97316' : '#10b981' }}
                        >
                          {worker.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button
                          className="btn-icon"
                          title="Delete"
                          onClick={() => handleDelete(worker)}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <WorkerModal
            worker={editWorker}
            onClose={() => { setShowModal(false); setEditWorker(null) }}
            onSave={loadWorkers}
          />
        )}
      </div>
    </>
  )
}
