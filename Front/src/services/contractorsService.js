import api from '@/api/axios.js'; // همان فایل مرکزی axios که در مرحله ۱ ساختید

export default {
    getContractors(page = 1) {
        return api.get(`/contractors?page=${page}`)
    },
    getShowcontractors(id) {
        return api.get(`/contractors/${id}`);
    },
    createContractors(data) {
        return api.post('/contractors', data);
    },
    updateContractors(id, data) {
        return api.put(`/contractors/${id}`, data);
    },
    deleteContractors(id) {
        return api.delete(`/contractors/${id}`);
    }
};
