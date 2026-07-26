import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProgress } from '../api/progressApi'

const modules = [
  { to: '/java', title: 'Java Practice', desc: 'MCQs from basics to JVM internals, by difficulty.', icon: '☕', color: 'var(--amber)' },
  { to: '/dsa', title: 'DSA Practice', desc: 'Arrays to graphs, sharpen problem-solving.', icon: '🧩', color: 'var(--cyan)' },
  { to: '/aptitude', title: 'Aptitude', desc: 'Quant, logical reasoning, verbal & DI.', icon: '🧠', color: 'var(--accent)' },
  { to: '/resume-analyzer', title: 'AI Resume Analyzer', desc: 'Get instant, role-specific resume feedback.', icon: '📄', color: 'var(--coral)' },
  { to: '/mock-interview', title: 'AI Mock Interview', desc: 'Practice with an AI interviewer based on your resume.', icon: '🎤', color: 'var(--accent)' },
  { to: '/progress', title: 'My Progress', desc: 'Track accuracy, streaks and growth over time.', icon: '📊', color: 'var(--cyan)' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)

  useEffect(() => { getProgress().then(setProgress).catch(() => {}) }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="mb-32">
          <h1 style={{ fontSize: 30 }}>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="mt-8">
            Targeting <strong style={{ color: 'var(--text-primary)' }}>{user?.targetJobRole || '—'}</strong>
            {user?.targetLpa ? <> · ₹{user.targetLpa} LPA</> : null}
          </p>
        </div>

        {progress && (
          <div className="grid grid-4 mb-32">
            <StatCard label="Questions attempted" value={progress.totalAttempted} accent="var(--accent)" />
            <StatCard label="Accuracy" value={`${progress.accuracyPercent}%`} accent="var(--cyan)" />
            <StatCard label="Mock interviews done" value={progress.mockInterviewsCompleted} accent="var(--amber)" />
            <StatCard label="Resume scans" value={progress.resumeAnalysesRun} accent="var(--coral)" />
          </div>
        )}

        <h3 className="mb-16">Jump into practice</h3>
        <div className="grid grid-3">
          {modules.map((m) => (
            <Link key={m.to} to={m.to} className="card card-hover">
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16,
              }}>{m.icon}</div>
              <h4 style={{ fontSize: 16.5 }}>{m.title}</h4>
              <p className="mt-8" style={{ fontSize: 13.5 }}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <p style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      <h2 style={{ fontSize: 28, color: accent, marginTop: 6 }}>{value}</h2>
    </div>
  )
}
