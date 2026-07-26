import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ width: 400 }}>
        <div className="text-center mb-24">
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 20, color: '#0d1117'
          }}>P</div>
          <h2>Create your account</h2>
          <p className="mt-8">Start prepping smarter with AI</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
          </div>

          {error && <p style={{ color: 'var(--coral)', fontSize: 13.5 }} className="mb-16">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-24" style={{ fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
