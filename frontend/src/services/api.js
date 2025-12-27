import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Teams
export const getTeams = () => api.get('/teams/');
export const createTeam = (data) => api.post('/teams/', data);
export const updateTeam = (id, data) => api.put(`/teams/${id}/`, data);
export const deleteTeam = (id) => api.delete(`/teams/${id}/`);
export const getTeamTechnicians = (id) => api.get(`/teams/${id}/technicians/`);

// Technicians
export const getTechnicians = () => api.get('/technicians/');
export const createTechnician = (data) => api.post('/technicians/', data);
export const updateTechnician = (id, data) => api.put(`/technicians/${id}/`, data);
export const deleteTechnician = (id) => api.delete(`/technicians/${id}/`);

// Users
export const getUsers = () => api.get('/users/');

// Equipment
export const getEquipment = () => api.get('/equipment/');
export const getEquipmentById = (id) => api.get(`/equipment/${id}/`);
export const createEquipment = (data) => api.post('/equipment/', data);
export const updateEquipment = (id, data) => api.put(`/equipment/${id}/`, data);
export const deleteEquipment = (id) => api.delete(`/equipment/${id}/`);
export const getEquipmentRequests = (id) => api.get(`/equipment/${id}/maintenance_requests/`);
export const getEquipmentByDepartment = (department) => api.get(`/equipment/by_department/?department=${department}`);

// Maintenance Requests
export const getMaintenanceRequests = () => api.get('/requests/');
export const getMaintenanceRequestById = (id) => api.get(`/requests/${id}/`);
export const createMaintenanceRequest = (data) => api.post('/requests/', data);
export const updateMaintenanceRequest = (id, data) => api.put(`/requests/${id}/`, data);
export const deleteMaintenanceRequest = (id) => api.delete(`/requests/${id}/`);
export const updateRequestStage = (id, stage) => api.patch(`/requests/${id}/update_stage/`, { stage });
export const assignTechnician = (id, technicianId) => api.patch(`/requests/${id}/assign_technician/`, { technician_id: technicianId });
export const getRequestsByStage = (stage) => api.get(`/requests/by_stage/?stage=${stage}`);
export const getRequestsByTeam = (teamId) => api.get(`/requests/by_team/?team_id=${teamId}`);
export const getCalendarRequests = () => api.get('/requests/calendar/');
export const getRequestStatistics = () => api.get('/requests/statistics/');

export default api;


