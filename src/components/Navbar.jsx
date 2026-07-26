import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/java', label: 'Java' },
  { to: '/dsa', label: 'DSA' },
  { to: '/aptitude', label: 'Aptitude' },
  { to: '/resume-analyzer', label: 'Resume AI' },
  { to: '/mock-interview', label: 'Mock Interview' },
  { to: '/progress', label: 'Progress' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(13, 17, 23, 0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div className="container flex items-center justify-between" style={{ height: 64 }}>
        <Link to="/dashboard" className="flex items-center gap-8">
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15, color: '#0d1117'
          }}>P</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>
            PrepGenius
          </span>
        </Link>

        <nav className="flex items-center gap-24" style={{ fontSize: 14 }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                color: location.pathname === l.to ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === l.to ? 600 : 500,
                borderBottom: location.pathname === l.to ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: 21,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-12">
          <span className="text-secondary" style={{ fontSize: 14 }}>{user.fullName?.split(' ')[0]}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}
