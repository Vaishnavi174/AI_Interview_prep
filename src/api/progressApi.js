import axiosClient from './axiosClient'

export const getProgress = () => axiosClient.get('/progress').then(r => r.data)
