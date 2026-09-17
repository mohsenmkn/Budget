import api from '@/api/axios'

export const ComplaintService = {
    // =========================
    // سمت پرسنل
    // =========================
    getCategories() {
        return api.get('/complaints/categories')
    },

    getMyComplaints(params = {}) {
        return api.get('/complaints/my', { params })
    },

    getComplaint(id) {
        return api.get(`/complaints/${id}`)
    },

    createComplaint(formData) {
        return api.post('/complaints', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    updateComplaint(id, data) {
        return api.put(`/complaints/${id}`, data)
    },

    deleteComplaint(id) {
        return api.delete(`/complaints/${id}`)
    },

    uploadAttachments(id, formData) {
        return api.post(`/complaints/${id}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // =========================
    // ✅ جدید: معاونت‌ها و مسئولین پیگیری (سمت پرسنل)
    // =========================
    /**
     * لیست معاونت‌های فعال (درختی) برای فرم ثبت شکایت
     */
    getOrganizationalUnits() {
        return api.get('/complaints/organizational-units')
    },

    /**
     * دریافت مسئول پیگیری یک معاونت خاص
     */
    getUnitManager(unitId) {
        return api.get(`/complaints/organizational-units/${unitId}/manager`)
    },

    /**
     * شکایات ارجاع‌شده به کاربر فعلی (مسئول پیگیری)
     */
    getAssignedToMe(params = {}) {
        return api.get('/complaints/assigned-to-me', { params })
    },

    // =========================
    // سمت ادمین
    // =========================
    getAdminComplaints(params = {}) {
        return api.get('/admin/complaints', { params })
    },

    getAdminComplaint(id) {
        return api.get(`/admin/complaints/${id}`)
    },

    updateComplaintStatus(id, payload) {
        return api.put(`/admin/complaints/${id}/status`, payload)
    },

    storeReply(id, data) {
        return api.post(`/admin/complaints/${id}/replies`, data)
    },

    // =========================
    // مدیریت دسته‌بندی‌ها
    // =========================
    getAdminCategories() {
        return api.get('/admin/complaint-categories')
    },

    createCategory(data) {
        return api.post('/admin/complaint-categories', data)
    },

    updateCategory(id, data) {
        return api.put(`/admin/complaint-categories/${id}`, data)
    },

    deleteCategory(id) {
        return api.delete(`/admin/complaint-categories/${id}`)
    },

    // =========================
    // داشبورد آماری
    // =========================
    getStatistics() {
        return api.get('/admin/complaints/statistics')
    },

    // =========================
    // خروجی Excel
    // =========================
    exportComplaints(params = {}) {
        return api.get('/admin/complaints/export', {
            params,
            responseType: 'blob'
        })
    },

    /**
     * لیست مسئولین پیگیری با pagination
     */
    getComplaintManagers(params = {}) {
        return api.get('/admin/complaint-managers', { params })
    },

    /**
     * لیست کاربران برای انتخاب مسئول (با جستجو)
     */
    getUsersForManager(params = {}) {
        return api.get('/admin/complaint-managers/users', { params })
    },

    /**
     * تعیین مسئول پیگیری جدید برای یک معاونت
     */
    createComplaintManager(data) {
        return api.post('/admin/complaint-managers', data)
    },

    /**
     * ویرایش مسئول پیگیری
     */
    updateComplaintManager(id, data) {
        return api.put(`/admin/complaint-managers/${id}`, data)
    },

    /**
     * حذف مسئول پیگیری
     */
    deleteComplaintManager(id) {
        return api.delete(`/admin/complaint-managers/${id}`)
    },




}