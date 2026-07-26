import axiosClient from './axiosClient'

export const startMockInterview = (jobRole) =>
  axiosClient.post('/mock-interview/start', { jobRole }).then(r => r.data)

export const sendMockInterviewReply = (sessionId, message) =>
  axiosClient.post(`/mock-interview/${sessionId}/reply`, { message }).then(r => r.data)

export const getMockInterviewMessages = (sessionId) =>
  axiosClient.get(`/mock-interview/${sessionId}/messages`).then(r => r.data)

export const getMockInterviewHistory = () => axiosClient.get('/mock-interview/history').then(r => r.data)

const InterviewApi = {

    startInterview(jobRole){

        return axiosClient.post("/mock-interview/start",{
            jobRole
        });

    },

    sendAnswer(sessionId,message){

        return axiosClient.post(
            `/mock-interview/${sessionId}/reply`,
            {
                message
            }
        );

    },
    finishInterview: (sessionId) =>
    axiosClient.post(`/mock-interview/${sessionId}/finish`),

    getMessages(sessionId){

        return axiosClient.get(
            `/mock-interview/${sessionId}/messages`
        );

    }

};

export default InterviewApi;