import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const projectService = {

  getAll: () => api.get('/projects'),
  
 
  getById: (id) => api.get(`/projects/${id}`),

  create: (data) => api.post('/projects', data),
  

  update: (id, data) => api.put(`/projects/${id}`, data),
  

  delete: (id) => api.delete(`/projects/${id}`),
  
 
  search: (params) => api.get('/projects/search', { params })
};


export const skillService = {

  getAll: () => api.get('/skills'),
  
  create: (data) => api.post('/skills', data),
  

  delete: (id) => api.delete(`/skills/${id}`)
};

export default api;