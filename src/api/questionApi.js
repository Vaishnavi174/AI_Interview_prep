import axiosClient from './axiosClient'

export const getQuestions = (category, difficulty, topic) =>
  axiosClient.get('/questions', { params: { category, difficulty, topic } }).then(r => r.data)

export const submitAnswer = (questionId, selectedOption) =>
  axiosClient.post('/questions/answer', { questionId, selectedOption }).then(r => r.data)
