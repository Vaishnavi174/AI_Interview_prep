import axiosClient from './axiosClient'

export const getJobRoles = () => axiosClient.get('/meta/job-roles').then(r => r.data)
export const getCompanyTypes = () => axiosClient.get('/meta/company-types').then(r => r.data)
export const getExperienceLevels = () => axiosClient.get('/meta/experience-levels').then(r => r.data)
export const getAptitudeTopics = () => axiosClient.get('/meta/aptitude-topics').then(r => r.data)
export const getDsaTopics = () => axiosClient.get('/meta/dsa-topics').then(r => r.data)
export const getJavaTopics = () => axiosClient.get('/meta/java-topics').then(r => r.data)
