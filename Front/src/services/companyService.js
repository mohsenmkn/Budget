import api from '@/api/axios.js'

export default {
    getCompanies(params = {}) {
        return api.get('/companies', { params })
    },
    getCompany(id) {
        return api.get(`/companies/${id}`)
    },
    createCompany(data) {
        return api.post('/companies', data)
    },
    updateCompany(id, data) {
        return api.put(`/companies/${id}`, data)
    },
    deleteCompany(id) {
        return api.delete(`/companies/${id}`)
    },
}
