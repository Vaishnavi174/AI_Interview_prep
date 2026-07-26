import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import aiImage from "../images/image.jpg";
import "./Login.css";
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res)
      navigate(res.onboardingComplete ? '/dashboard' : '/onboarding')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

 return (
  <div className="login-page">

    {/* Left Side */}

    <div className="login-left">

      <img src={aiImage} alt="AI Interview" className="login-image" />

      <div className="image-overlay">

        <h1>Your AI Partner for Personalized Interview Preparation</h1>

      </div>

    </div>


    {/* Right Side */}

    <div className="login-right">

      <div className="card login-card">

        <div className="text-center mb-24">

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              margin: "0 auto 16px",
              background:
                "linear-gradient(135deg,var(--accent),var(--cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
              color: "#0d1117",
            }}
          >
            P
          </div>

          <h2>Welcome Back</h2>

          <p>Sign in to continue your interview journey.</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="field">

            <label>Email</label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
            />

          </div>

          <div className="field">

            <label>Password</label>

            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="••••••••"
            />

          </div>

          {error && (
            <p
              style={{
                color: "var(--coral)",
                fontSize: 13,
              }}
            >
              {error}
            </p>
          )}

          <button
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p
          className="text-center mt-24"
          style={{ fontSize: 14 }}
        >
          New here?{" "}

          <Link to="/register">
            Create an account
          </Link>

        </p>

      </div>

    </div>

  </div>
);
}
