// src/api/cvService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || '/api'}/cvs/`;

// Get all CVs
const getCVs = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get CV by ID
const getCVById = async (cvId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + cvId + '/', config);
  return response.data;
};

// Create new CV
const createCV = async (cvData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(API_URL, cvData, config);
  return response.data;
};

// Update CV
const updateCV = async (cvId, cvData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.put(API_URL + cvId + '/', cvData, config);
  return response.data;
};

// Delete CV
const deleteCV = async (cvId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + cvId + '/', config);
  return response.data;
};

const cvService = {
  getCVs,
  getCVById,
  createCV,
  updateCV,
  deleteCV,
};

export default cvService;
