import React, { useEffect, useState } from 'react'
import { getProgress } from '../api/progressApi'

const CATEGORY_LABELS = { JAVA: 'Java', DSA: 'DSA', APTITUDE: 'Aptitude', HR_BEHAVIORAL: 'HR' }
const DIFFICULTY_COLORS = { EASY: 'var(--cyan)', MEDIUM: 'var(--amber)', HARD: 'var(--coral)' }

export default function ProgressPage() {
  const [progress, setProgress] = useState(null)

  useEffect(() => { getProgress().then(setProgress) }, [])

  if (!progress) {
    return <div className="page container flex items-center justify-center" style={{ height: 300 }}><div className="spinner" /></div>
  }

  const categories = Object.keys(progress.attemptedByCategory)

  return (
    <div className="page">
      <div className="container">
        <h1 className="mb-8" style={{ fontSize: 26 }}>📊 My Progress</h1>
        <p className="mb-32">A full picture of how your prep is trending — keep the streak going.</p>

        <div className="grid grid-4 mb-32">
          <Stat label="Total attempted" value={progress.totalAttempted} accent="var(--accent)" />
          <Stat label="Total correct" value={progress.totalCorrect} accent="var(--cyan)" />
          <Stat label="Overall accuracy" value={`${progress.accuracyPercent}%`} accent="var(--amber)" />
          <Stat label="Mock interviews" value={progress.mockInterviewsCompleted} accent="var(--coral)" />
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h4 className="mb-24">Accuracy by category</h4>
            {categories.length === 0 && <p>No practice attempts yet — go answer some questions!</p>}
            {categories.map((cat) => {
              const attempted = progress.attemptedByCategory[cat] || 0
              const correct = progress.correctByCategory[cat] || 0
              const pct = attempted === 0 ? 0 : Math.round((correct / attempted) * 100)
              return (
                <div key={cat} className="mb-16">
                  <div className="flex justify-between mb-8" style={{ fontSize: 13.5 }}>
                    <span>{CATEGORY_LABELS[cat] || cat}</span>
                    <span className="text-secondary">{correct}/{attempted} · {pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <h4 className="mb-24">Accuracy by difficulty</h4>
            {Object.keys(progress.accuracyByDifficulty).length === 0 && <p>Nothing to show yet.</p>}
            {Object.entries(progress.accuracyByDifficulty).map(([diff, pct]) => (
              <div key={diff} className="mb-16">
                <div className="flex justify-between mb-8" style={{ fontSize: 13.5 }}>
                  <span>{diff}</span>
                  <span className="text-secondary">{Math.round(pct)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: DIFFICULTY_COLORS[diff] || 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-24">
          <h4 className="mb-8">Keep the momentum</h4>
          <p>You've run {progress.resumeAnalysesRun} resume scan(s) and completed {progress.mockInterviewsCompleted} mock interview(s). Consistent daily practice compounds — try to answer at least 10 questions a day.</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="card">
      <p style={{ fontSize: 12.5, textTransform: 'uppercase' }}>{label}</p>
      <h2 style={{ fontSize: 26, color: accent, marginTop: 6 }}>{value}</h2>
    </div>
  )
}
