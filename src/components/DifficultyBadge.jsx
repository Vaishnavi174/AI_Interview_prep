import React from 'react'

export default function DifficultyBadge({ difficulty }) {
  const cls = {
    EASY: 'badge-easy',
    MEDIUM: 'badge-medium',
    HARD: 'badge-hard',
  }[difficulty] || 'badge-accent'

  return <span className={`badge ${cls}`}>{difficulty}</span>
}
