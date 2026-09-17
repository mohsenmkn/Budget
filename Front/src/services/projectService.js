import api from '@/api/axios'

export const projectService = {
    list: (params) => api.get('/projects', { params }),
    get: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
}
