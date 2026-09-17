// resources/js/services/contractService.js
import api from '@/api/axios'

export const contractService = {
    // لیست قراردادها
    list: (params) => api.get('/contracts', { params }),

    // نمایش یک قرارداد
    get: (id) => api.get(`/contracts/${id}`),

    // ایجاد قرارداد جدید
    create: (data) => api.post('/contracts', data),

    // ویرایش قرارداد
    update: (id, data) => api.put(`/contracts/${id}`, data),

    // حذف قرارداد
    delete: (id) => api.delete(`/contracts/${id}`),

    // تغییر وضعیت
    changeStatus: (id, status) => api.patch(`/contracts/${id}/status`, { status }),

    // خلاصه مالی
    getSummary: (id) => api.get(`/contracts/${id}/summary`),

    // ✅ پیمانکاران
    getContractors: (params) => api.get('/contractors', { params }),
    getContractor: (id) => api.get(`/contractors/${id}`),
    createContractor: (data) => api.post('/contractors', data),
    updateContractor: (id, data) => api.put(`/contractors/${id}`, data),
    deleteContractor: (id) => api.delete(`/contractors/${id}`),
}