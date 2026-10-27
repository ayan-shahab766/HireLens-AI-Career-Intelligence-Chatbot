import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';
const API_URL = `${API_BASE}/intelligence/`;
const authConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const createJob = async (job, token) => (await axios.post(`${API_URL}jobs/`, job, authConfig(token))).data;
const analyzeMatch = async (payload, token) => (await axios.post(`${API_URL}analyses/analyze/`, payload, authConfig(token))).data;
const createInterview = async (payload, token) => (await axios.post(`${API_URL}interviews/`, payload, authConfig(token))).data;
const nextQuestion = async (sessionId, token) => (await axios.post(`${API_URL}interviews/${sessionId}/next_question/`, {}, authConfig(token))).data;
const submitAnswer = async (sessionId, questionId, answer, token) => (await axios.post(`${API_URL}interviews/${sessionId}/questions/${questionId}/answer/`, { answer }, authConfig(token))).data;

export default { createJob, analyzeMatch, createInterview, nextQuestion, submitAnswer };
