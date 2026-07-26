import React, { useState } from 'react'
import { analyzeResume } from '../api/resumeApi'
import { useAuth } from '../context/AuthContext'

export default function ResumeAnalyzer() {
  const { user } = useAuth()
  const [resumeText, setResumeText] = useState('')
  const [jobRole, setJobRole] = useState(user?.targetJobRole || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await analyzeResume(resumeText, jobRole)
      setResult(res)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="mb-8" style={{ fontSize: 26 }}>📄 AI Resume Analyzer</h1>
        <p className="mb-32">Paste your resume text below. Claude will score it against your target role and tell you exactly what to fix.</p>

        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <form onSubmit={handleAnalyze} className="card">
            <div className="field">
              <label>Target job role</label>
              <input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. Backend Developer" />
            </div>
            <div className="field">
              <label>Resume text</label>
              <textarea
                required
                rows={16}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here..."
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Analyzing with AI...' : 'Analyze My Resume'}
            </button>
            {error && <p className="mt-16" style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
          </form>

          <div>
            {!result && !loading && (
              <div className="card text-center" style={{ padding: 48 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <p>Your AI feedback will appear here — score, strengths, gaps, and missing keywords.</p>
              </div>
            )}

            {loading && (
              <div className="card flex items-center justify-center" style={{ height: 200 }}>
                <div className="spinner" />
              </div>
            )}

            {result && (
              <div className="card">
                <div className="flex items-center gap-16 mb-24">
                  <ScoreRing score={result.overallScore} />
                  <div>
                    <p style={{ fontSize: 12.5, textTransform: 'uppercase' }}>Overall Score</p>
                    <h2 style={{ fontSize: 24 }}>{result.overallScore}/100</h2>
                  </div>
                </div>

                {result.strengths && (
                  <Section title="✅ Strengths" content={result.strengths} color="var(--cyan)" />
                )}
                {result.weaknesses && (
                  <Section title="⚠️ Weaknesses" content={result.weaknesses} color="var(--amber)" />
                )}
                {result.suggestions && (
                  <Section title="💡 Suggestions" content={result.suggestions} color="var(--accent-hover)" />
                )}
                {result.missingKeywords && (
                  <div className="mt-16">
                    <h4 style={{ fontSize: 14.5, marginBottom: 10 }}>🔑 Missing keywords</h4>
                    <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                      {result.missingKeywords.split(',').filter(k => k.trim()).map((k) => (
                        <span key={k} className="badge badge-accent">{k.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, content, color }) {
  return (
    <div className="mt-16">
      <h4 style={{ fontSize: 14.5, color, marginBottom: 8 }}>{title}</h4>
      <p style={{ whiteSpace: 'pre-line', fontSize: 14 }}>{content}</p>
    </div>
  )
}

function ScoreRing({ score }) {
  const color = score >= 75 ? 'var(--cyan)' : score >= 50 ? 'var(--amber)' : 'var(--coral)'
  const circumference = 2 * Math.PI * 30
  const offset = circumference - (score / 100) * circumference
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="30" stroke="var(--border)" strokeWidth="6" fill="none" />
      <circle
        cx="36" cy="36" r="30" stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 36 36)"
      />
    </svg>
  )
}
