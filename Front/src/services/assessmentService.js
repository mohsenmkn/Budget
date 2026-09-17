import api from '@/api/axios.js'

export default {
    // ═══════════════════════════════════════════════
    // چرخه‌ها (Cycles)
    // ══════════════════════════════════════════════
    getCycles: () => api.get('/assessment/cycles').then(r => r.data),
    createCycle: (p) => api.post('/assessment/cycles', p).then(r => r.data),
    activateCycle: (id) => api.post(`/assessment/cycles/${id}/activate`).then(r => r.data),
    closeCycle: (id) => api.post(`/assessment/cycles/${id}/close`).then(r => r.data),

    // ═══════════════════════════════════════════════
    // دوره‌ها (Periods)
    // ═══════════════════════════════════════════════
    getPeriods: (params = {}) => api.get('/assessment/periods', { params }).then(r => r.data),
    createPeriod: (p) => api.post('/assessment/periods', p).then(r => r.data),
    getPeriod: (id) => api.get(`/assessment/periods/${id}`).then(r => r.data),
    updatePeriod: (id, p) => api.put(`/assessment/periods/${id}`, p).then(r => r.data),
    generatePeriod: (id) => api.post(`/assessment/periods/${id}/generate`).then(r => r.data),
    autoAssignPeriod: (id) => api.post(`/assessment/periods/${id}/auto-assign`).then(r => r.data),

    // ═══════════════════════════════════════════════
    // تخصیص خودکار (Auto-Assign)
    // ═══════════════════════════════════════════════
    autoAssignPreview: (cycleId) => api.get('/assessment/auto-assign/preview', { params: { cycle_id: cycleId } }).then(r => r.data),
    autoAssignExecute: (cycleId) => api.post('/assessment/auto-assign/execute', { cycle_id: cycleId }).then(r => r.data),

    // ═══════════════════════════════════════════════
    // شناسنامه‌ها (Posts)
    // ═══════════════════════════════════════════════
    getPosts: (params = {}) => api.get('/assessment/posts', { params }).then(r => r.data),
    getPost: (id) => api.get(`/assessment/posts/${id}`).then(r => r.data),
    createPost: (p) => api.post('/assessment/posts', p).then(r => r.data),
    updatePost: (id, p) => api.put(`/assessment/posts/${id}`, p).then(r => r.data),
    deletePost: (id) => api.delete(`/assessment/posts/${id}`).then(r => r.data),
    getPostQuestions: (id) => api.get(`/assessment/posts/${id}/questions`).then(r => r.data),
    suggestPost: (userId) => api.get('/assessment/suggest-post', { params: { user_id: userId } }).then(r => r.data),

    // ═══════════════════════════════════════════════
    // سوالات (Questions)
    // ═══════════════════════════════════════════════
    createQuestion: (p) => api.post('/assessment/questions', p).then(r => r.data),
    updateQuestion: (id, p) => api.put(`/assessment/questions/${id}`, p).then(r => r.data),
    deleteQuestion: (id) => api.delete(`/assessment/questions/${id}`).then(r => r.data),
    bulkUpdateQuestions: (items) => api.put('/assessment/questions/bulk', { items }).then(r => r.data),

    // ═══════════════════════════════════════════════
    // دسته‌بندی‌ها (Categories)
    // ═══════════════════════════════════════════════
    getCategories: () => api.get('/assessment/categories').then(r => r.data),
    createCategory: (p) => api.post('/assessment/categories', p).then(r => r.data),

    // ═══════════════════════════════════════════════
    // روش‌ها (Methods)
    // ═══════════════════════════════════════════════
    getMethods: (all = false) => api.get('/assessment/methods', { params: { all } }).then(r => r.data),
    createMethod: (p) => api.post('/assessment/methods', p).then(r => r.data),
    updateMethod: (id, p) => api.put(`/assessment/methods/${id}`, p).then(r => r.data),
    deleteMethod: (id) => api.delete(`/assessment/methods/${id}`).then(r => r.data),

    // ═══════════════════════════════════════════════
    // ارزیابی‌ها (Assessments)
    // ═══════════════════════════════════════════════
    getAssessments: (params = {}) => api.get('/assessment/assessments', { params }).then(r => r.data),
    createAssessment: (p) => api.post('/assessment/assessments', p).then(r => r.data),
    bulkCreateAssessment: (p) => api.post('/assessment/assessments/bulk', p).then(r => r.data),
    getAssessment: (id) => api.get(`/assessment/assessments/${id}`).then(r => r.data),
    submitAnswers: (id, scores) => api.post(`/assessment/assessments/${id}/submit`, { scores }).then(r => r.data),
    approve: (id) => api.post(`/assessment/assessments/${id}/approve`).then(r => r.data),
    reject: (id, notes) => api.post(`/assessment/assessments/${id}/reject`, { notes }).then(r => r.data),
    getGaps: (id) => api.get(`/assessment/assessments/${id}/gaps`).then(r => r.data),
    createAction: (id, p) => api.post(`/assessment/assessments/${id}/actions`, p).then(r => r.data),

    // ═══════════════════════════════════════════════
    // Import از اکسل
    // ═══════════════════════════════════════════════
    importPreview: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post('/assessment/import/preview', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => r.data)
    },
    importExcel: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post('/assessment/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => r.data)
    },
    importBulk: (directory) => api.post('/assessment/import/bulk', { directory }).then(r => r.data),

    // ═══════════════════════════════════════════════
    // کاتالوگ‌ها و گزارش‌ها
    // ═══════════════════════════════════════════════
    searchUsers: (search = '') => api.get('/assessment/users', { params: { search } }).then(r => r.data),
    getEmployeeReport: (userId) => api.get(`/assessment/employees/${userId}/report`).then(r => r.data),
    getDashboardStats: () => api.get('/assessment/dashboard/stats').then(r => r.data),


}