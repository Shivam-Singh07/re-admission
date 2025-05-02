import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Patient APIs
export const getPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getPatient = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_URL}/patients`, patientData);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Report APIs
export const getPatientReports = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/reports/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports for patient ${patientId}:`, error);
    throw error;
  }
};

// Prediction API
export const predict = async (predictionData) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, predictionData);
    return response.data;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};
