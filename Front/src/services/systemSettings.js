// src/api/systemSettings.js
import api from '@/api/axios.js'

export const databaseConnectionsApi = {
    getAll: () => api.get('/system-settings/database-connections'),

    getOne: (id) => api.get(`/system-settings/database-connections/${id}`),

    create: (data) => api.post('/system-settings/database-connections', data),

    update: (id, data) => api.put(`/system-settings/database-connections/${id}`, data),

    delete: (id) => api.delete(`/system-settings/database-connections/${id}`),

    test: (data) => api.post('/system-settings/database-connections/test', data),

    testSaved: (id) => api.post(`/system-settings/database-connections/${id}/test-saved`),

    toggle: (id) => api.patch(`/system-settings/database-connections/${id}/toggle`),

    clearCache: () => api.post('/system-settings/database-connections/clear-cache'),
}