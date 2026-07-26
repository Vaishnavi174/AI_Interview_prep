import React, { useEffect, useState } from 'react'
import { getQuestions, submitAnswer } from '../api/questionApi'
import DifficultyBadge from './DifficultyBadge'

/**
 * Generic MCQ practice panel used by Java / DSA / Aptitude pages.
 * category: "JAVA" | "DSA" | "APTITUDE"
 * topics: string[] of sub-topics for the filter dropdown
 */
export default function QuizPanel({ category, topics = [] }) {
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 })

  const load = async () => {
    setLoading(true)
    setCurrent(0)
    setSelected(null)
    setResult(null)
    try {
      const data = await getQuestions(category, difficulty || undefined, topic || undefined)
      setQuestions(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [difficulty, topic])

  const q = questions[current]

  const handleSelect = async (opt) => {
    if (result) return
    setSelected(opt)
    const res = await submitAnswer(q.id, opt)
    setResult(res)
    setSessionStats((s) => ({
      attempted: s.attempted + 1,
      correct: s.correct + (res.correct ? 1 : 0),
    }))
  }

  const next = () => {
    setSelected(null)
    setResult(null)
    setCurrent((c) => (c + 1) % questions.length)
  }

  const options = q ? [
    ['A', q.optionA], ['B', q.optionB], ['C', q.optionC], ['D', q.optionD],
  ] : []

  return (
    <div>
      <div className="flex items-center gap-16 mb-24" style={{ flexWrap: 'wrap' }}>
        <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All levels</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {topics.length > 0 && (
          <div className="field" style={{ marginBottom: 0, minWidth: 200 }}>
            <label>Topic</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All topics</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        <div className="card" style={{ padding: '10px 18px', marginLeft: 'auto' }}>
          <span className="text-secondary" style={{ fontSize: 13 }}>
            Session: <strong style={{ color: 'var(--text-primary)' }}>{sessionStats.correct}/{sessionStats.attempted}</strong> correct
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center" style={{ height: 200 }}><div className="spinner" /></div>
      )}

      {!loading && questions.length === 0 && (
        <div className="card text-center">
          <p>No questions found for this filter yet. Try a different difficulty or topic.</p>
        </div>
      )}

      {!loading && q && (
        <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-12">
              <DifficultyBadge difficulty={q.difficulty} />
              {q.topic && <span className="badge badge-accent">{q.topic}</span>}
            </div>
            <span className="text-muted" style={{ fontSize: 13 }}>
              Question {current + 1} of {questions.length}
            </span>
          </div>

          <h3 style={{ fontSize: 19, marginBottom: 24, lineHeight: 1.5 }}>{q.questionText}</h3>

          <div className="flex-col gap-12">
            {options.map(([key, text]) => {
              let bg = 'var(--bg-elevated)'
              let border = 'var(--border)'
              if (result && key === result.correctOption) { bg = 'var(--cyan-soft)'; border = 'var(--cyan)' }
              else if (result && key === selected && !result.correct) { bg = 'var(--coral-soft)'; border = 'var(--coral)' }
              else if (selected === key) { border = 'var(--accent)' }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={!!result}
                  style={{
                    textAlign: 'left',
                    padding: '13px 16px',
                    borderRadius: 10,
                    border: `1.5px solid ${border}`,
                    background: bg,
                    color: 'var(--text-primary)',
                    fontSize: 14.5,
                    display: 'flex', gap: 12,
                  }}
                >
                  <strong>{key}</strong> <span>{text}</span>
                </button>
              )
            })}
          </div>

          {result && (
            <div className="mt-24" style={{
              padding: 16, borderRadius: 10,
              background: result.correct ? 'var(--cyan-soft)' : 'var(--coral-soft)',
            }}>
              <strong style={{ color: result.correct ? 'var(--cyan)' : 'var(--coral)' }}>
                {result.correct ? '✓ Correct!' : '✗ Not quite.'}
              </strong>
              {result.explanation && <p className="mt-8" style={{ color: 'var(--text-primary)', opacity: 0.85 }}>{result.explanation}</p>}
            </div>
          )}

          <div className="flex justify-between mt-24">
            <span />
            <button className="btn btn-primary" onClick={next} disabled={!result}>
              Next question →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
