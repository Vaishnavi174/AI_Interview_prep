import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import JavaPractice from './pages/JavaPractice'
import DsaPractice from './pages/DsaPractice'
import AptitudePractice from './pages/AptitudePractice'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import MockInterview from './pages/MockInterview'
import ProgressPage from './pages/Progress'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/onboarding" element={
          <ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/java" element={
          <ProtectedRoute><JavaPractice /></ProtectedRoute>
        } />
        <Route path="/dsa" element={
          <ProtectedRoute><DsaPractice /></ProtectedRoute>
        } />
        <Route path="/aptitude" element={
          <ProtectedRoute><AptitudePractice /></ProtectedRoute>
        } />
        <Route path="/resume-analyzer" element={
          <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
        } />
        <Route path="/mock-interview" element={
          <ProtectedRoute><MockInterview /></ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute><ProgressPage /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}
