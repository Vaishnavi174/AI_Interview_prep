import React, { useEffect, useState } from 'react'
import QuizPanel from '../components/QuizPanel'
import { getAptitudeTopics } from '../api/metaApi'

export default function AptitudePractice() {
  const [topics, setTopics] = useState([])
  useEffect(() => { getAptitudeTopics().then(setTopics) }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 className="mb-8" style={{ fontSize: 26 }}>🧠 Aptitude Practice</h1>
        <p className="mb-32">Quantitative, logical reasoning, verbal ability & data interpretation.</p>
        <QuizPanel category="APTITUDE" topics={topics} />
      </div>
    </div>
  )
}
