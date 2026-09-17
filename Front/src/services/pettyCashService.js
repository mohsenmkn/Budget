import api from '@/api/axios'

export const pettyCashService = {
    // Petty Cash
    list: (params) => api.get('/petty-cashes', { params }),
    get: (id) => api.get(`/petty-cashes/${id}`),
    create: (data) => api.post('/petty-cashes', data),
    update: (id, data) => api.put(`/petty-cashes/${id}`, data),
    delete: (id) => api.delete(`/petty-cashes/${id}`),

    // Transactions
    getTransactions: (pettyCashId, params) =>
        api.get(`/petty-cashes/${pettyCashId}/transactions`, { params }),
    createTransaction: (pettyCashId, data) =>
        api.post(`/petty-cashes/${pettyCashId}/transactions`, data),
    deleteTransaction: (pettyCashId, transactionId) =>
        api.delete(`/petty-cashes/${pettyCashId}/transactions/${transactionId}`),

    // Summary
    getSummary: (pettyCashId) =>
        api.get(`/petty-cashes/${pettyCashId}/summary`),
}