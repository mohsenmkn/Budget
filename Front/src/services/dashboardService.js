import axios from '@/api/axios'

export default {
    /**
     * دریافت تمام اطلاعات داشبورد (پروفایل + فیش + اعلانات)
     */
    async getDashboardData() {
        const response = await axios.get('/dashboard/data')
        return response.data
    },

    /**
     * دریافت خلاصه فیش حقوقی
     */
    async getPayslipSummary() {
        const response = await axios.get('/dashboard/payslip-summary')
        return response.data
    },

    /**
     * دریافت اعلانات
     */
    async getAnnouncements() {
        const response = await axios.get('/dashboard/announcements')
        return response.data.announcements || []
    },

    /**
     * علامت‌گذاری اعلان به عنوان خوانده‌شده
     */
    async markAnnouncementRead(id) {
        const response = await axios.post(`/dashboard/announcements/${id}/read`)
        return response.data
    },

    /**
     * دریافت آخرین ورود و خروج
     */
    async getLatestAttendance() {
        const response = await axios.get('/attendance/latest')
        return response.data.data || {}
    }
}