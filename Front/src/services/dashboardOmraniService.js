// resources/js/services/dashboardOmraniService.js
import api from '@/api/axios'

export const dashboardOmraniService = {
    // خلاصه کلی
    getSummary: () => api.get('/dashboard/summary'),

    // آمار پروژه‌ها بر اساس وضعیت
    getProjectStats: () => api.get('/dashboard/project-stats'),

    // آمار مالی
    getFinancialStats: () => api.get('/dashboard/financial-stats'),

    // پروژه‌های اخیر
    getRecentProjects: () => api.get('/dashboard/recent-projects'),

    // پیشرفت پروژه‌ها
    getProgressStats: () => api.get('/dashboard/progress-stats'),

    // آمار هفتگی
    getWeeklyStats: () => api.get('/dashboard/weekly-stats'),

    // بودجه بر اساس دسته‌بندی
    getBudgetByCategory: () => api.get('/dashboard/budget-by-category'),
}