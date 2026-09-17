import api from '@/api/axios'

const hrService = {
    /**
     * دریافت درخت چارت سازمانی
     */
    async getOrgChart() {
        const response = await api.get('hr/org-chart')
        return response.data
    },

    /**
     * لیست تخت واحدها
     */
    async getUnits() {
        const response = await api.get('hr/org-chart/units')
        return response.data
    },

    // ✅ جدید — لیست پرسنل
    async getEmployees(params = {}) {
        const response = await api.get('hr/employees', { params })
        return response.data
    },

    // ✅ جدید — پروفایل یک کارمند
    async getEmployeeProfile(userId) {
        const response = await api.get(`hr/employees/${userId}`)
        return response.data
    },

    // ✅ جدید — اطلاعات خانواده کارمند
    async getEmployeeRelatives(userId) {
        const response = await api.get(`hr/employees/${userId}/relatives`)
        return response.data
    },

    // ✅ sync دستی یک کاربر (ادمین)
    async syncUser(userId) {
        const response = await api.post(`hr/sync/user/${userId}`)
        return response.data
    },

// ✅ وضعیت sync (ادمین)
    async getSyncStatus() {
        const response = await api.get('hr/sync/status')
        return response.data
    },

    // ✅ جدید — تاریخچه احکام کارمند
    async getStatuteHistory(userId) {
        const response = await api.get(`hr/employees/${userId}/history`)
        return response.data
    },

    // ✅ جزئیات احکام یک دوره
    async getStatuteHistoryDetails(userId, postRef, jobRef) {
        const response = await api.get(`hr/employees/${userId}/history/details`, {
            params: { post_ref: postRef, job_ref: jobRef }
        })
        return response.data
    },

    // ✅ تردد کارمند
    async getEmployeeAttendance(userId, month = null) {
        const params = month ? { month } : {}
        const response = await api.get(`hr/employees/${userId}/attendance`, { params })
        return response.data
    },
// ✅ ساختار سازمانی — مدیریت
    async getOrgStructure() {
        const response = await api.get('hr/org-structure')
        return response.data
    },

    async updateUnitParent(unitId, parentId) {
        const response = await api.put(`hr/org-structure/${unitId}`, {
            parent_id: parentId
        })
        return response.data
    },

    async resetOrgStructure() {
        const response = await api.post('hr/org-structure/reset')
        return response.data
    },

    // ✅ ایجاد واحد جدید
    async createUnit(payload) {
        const response = await api.post('hr/org-structure', payload)
        return response.data
    },

// ✅ ویرایش واحد
    async updateUnit(unitId, payload) {
        const response = await api.put(`hr/org-structure/${unitId}`, payload)
        return response.data
    },

// ✅ حذف واحد
    async deleteUnit(unitId) {
        const response = await api.delete(`hr/org-structure/${unitId}`)
        return response.data
    },

    // ✅ آموزش پرسنل
    async getEmployeeTraining(userId) {
        const response = await api.get(`hr/employees/${userId}/training`)
        return response.data
    },

    async syncEmployeeTraining(userId) {
        const response = await api.post(`hr/employees/${userId}/training/sync`)
        return response.data
    },

    async enrichTrainingDates(userId) {
        const response = await api.post(`hr/employees/${userId}/training/enrich-dates`)
        return response.data
    },

}

export default hrService