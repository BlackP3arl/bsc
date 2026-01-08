import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gantt Data
export const getGanttData = async () => {
  const response = await api.get('/gantt-data');
  return response.data;
};

// Perspectives
export const getPerspectives = async () => {
  const response = await api.get('/perspectives');
  return response.data;
};

export const getPerspective = async (id) => {
  const response = await api.get(`/perspectives/${id}`);
  return response.data;
};

// Initiatives
export const getInitiatives = async () => {
  const response = await api.get('/initiatives');
  return response.data;
};

export const getInitiative = async (id) => {
  const response = await api.get(`/initiatives/${id}`);
  return response.data;
};

export const createInitiative = async (data) => {
  const response = await api.post('/initiatives', data);
  return response.data;
};

export const updateInitiative = async (id, data) => {
  const response = await api.put(`/initiatives/${id}`, data);
  return response.data;
};

export const deleteInitiative = async (id) => {
  await api.delete(`/initiatives/${id}`);
};

// Schedules
export const getSchedules = async () => {
  const response = await api.get('/schedules');
  return response.data;
};

export const getSchedule = async (id) => {
  const response = await api.get(`/schedules/${id}`);
  return response.data;
};

export const createSchedule = async (data) => {
  const response = await api.post('/schedules', data);
  return response.data;
};

export const updateSchedule = async (id, data) => {
  const response = await api.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id) => {
  await api.delete(`/schedules/${id}`);
};

export const upsertSchedule = async (initiativeId, data) => {
  const response = await api.patch(`/initiatives/${initiativeId}/schedule`, data);
  return response.data;
};

export const bulkUpdateSchedules = async (schedules) => {
  const response = await api.put('/schedules/bulk', { schedules });
  return response.data;
};

// Teams
export const getTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const getTeam = async (id) => {
  const response = await api.get(`/teams/${id}`);
  return response.data;
};

export const createTeam = async (data) => {
  const response = await api.post('/teams', data);
  return response.data;
};

export const updateTeam = async (id, data) => {
  const response = await api.put(`/teams/${id}`, data);
  return response.data;
};

export const deleteTeam = async (id) => {
  await api.delete(`/teams/${id}`);
};


