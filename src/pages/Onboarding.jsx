import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeOnboarding } from '../api/authApi'
import { getJobRoles, getCompanyTypes, getExperienceLevels } from '../api/metaApi'
import { useAuth } from '../context/AuthContext'

export default function Onboarding() {
  const [jobRoles, setJobRoles] = useState([])
  const [companyTypes, setCompanyTypes] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [form, setForm] = useState({
    targetJobRole: '', targetCompanyType: '', targetLpa: '', experienceLevel: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getJobRoles().then(setJobRoles)
    getCompanyTypes().then(setCompanyTypes)
    getExperienceLevels().then(setExperienceLevels)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await completeOnboarding({ ...form, targetLpa: parseFloat(form.targetLpa) })
      updateUser({ onboardingComplete: true })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card" style={{ width: 480 }}>
        <h2 className="mb-8">Let's personalize your prep</h2>
        <p className="mb-24">This tunes your questions, mock interviews, and resume feedback to what actually matters for your goal.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Target job role</label>
            <select required value={form.targetJobRole}
              onChange={(e) => setForm({ ...form, targetJobRole: e.target.value })}>
              <option value="">Select a role</option>
              {jobRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Target company type</label>
            <select value={form.targetCompanyType}
              onChange={(e) => setForm({ ...form, targetCompanyType: e.target.value })}>
              <option value="">Any</option>
              {companyTypes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Target CTC (LPA)</label>
            <input type="number" step="0.5" min="0" required value={form.targetLpa}
              onChange={(e) => setForm({ ...form, targetLpa: e.target.value })} placeholder="e.g. 12" />
          </div>

          <div className="field">
            <label>Experience level</label>
            <select required value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
              <option value="">Select</option>
              {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {error && <p style={{ color: 'var(--coral)', fontSize: 13.5 }} className="mb-16">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Saving...' : 'Start Prepping →'}
          </button>
        </form>
      </div>
    </div>
  )
}
