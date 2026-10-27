// src/api/chatService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || '/api'}/chatbot/sessions/`;

// Get all chat sessions
const getSessions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create new chat session
const createSession = async (sessionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, sessionData, config);
  return response.data;
};

// Get session by ID
const getSessionById = async (sessionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + sessionId + '/', config);
  return response.data;
};

// Send message
const sendMessage = async (sessionId, message, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + sessionId + '/ask/',
    { message },
    config
  );
  return response.data;
};

const chatService = {
  getSessions,
  createSession,
  getSessionById,
  sendMessage,
};

export default chatService;
