import React, { useEffect, useState } from 'react'
import QuizPanel from '../components/QuizPanel'
import { getDsaTopics } from '../api/metaApi'

export default function DsaPractice() {
  const [topics, setTopics] = useState([])
  useEffect(() => { getDsaTopics().then(setTopics) }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 className="mb-8" style={{ fontSize: 26 }}>🧩 DSA Practice</h1>
        <p className="mb-32">Data structures & algorithms, from arrays to graphs.</p>
        <QuizPanel category="DSA" topics={topics} />
      </div>
    </div>
  )
}
