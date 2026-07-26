import axiosClient from './axiosClient'

export const registerUser = (data) => axiosClient.post('/auth/register', data).then(r => r.data)
export const loginUser = (data) => axiosClient.post('/auth/login', data).then(r => r.data)
export const getMe = () => axiosClient.get('/users/me').then(r => r.data)
export const completeOnboarding = (data) => axiosClient.post('/users/onboarding', data).then(r => r.data)
