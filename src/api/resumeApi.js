import axiosClient from './axiosClient'

export const analyzeResume = (resumeText, targetJobRole) =>
  axiosClient.post('/resume/analyze', { resumeText, targetJobRole }).then(r => r.data)

export const getResumeHistory = () => axiosClient.get('/resume/history').then(r => r.data)
