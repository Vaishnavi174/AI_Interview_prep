import React, { useEffect, useState } from 'react'
import QuizPanel from '../components/QuizPanel'
import { getJavaTopics } from '../api/metaApi'

export default function JavaPractice() {
  const [topics, setTopics] = useState([])
  useEffect(() => { getJavaTopics().then(setTopics) }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 className="mb-8" style={{ fontSize: 26 }}>☕ Java Practice</h1>
        <p className="mb-32">Core concepts through advanced JVM internals — filter by difficulty and topic.</p>
        <QuizPanel category="JAVA" topics={topics} />
      </div>
    </div>
  )
}
