import api from '@/api/axios.js';

export default {
    /**
     * دریافت لیست بودجه‌ها با فیلتر
     * @param {Object} params - { project_id, type, fiscal_year, page, per_page }
     */
    getAll(params = {}) {
        return api.get('/budgets', { params });
    },

    /**
     * دریافت یک بودجه
     */
    get(id) {
        return api.get(`/budgets/${id}`);
    },

    /**
     * ایجاد بودجه جدید
     */
    create(data) {
        return api.post('/budgets', data);
    },

    /**
     * ویرایش بودجه
     */
    update(id, data) {
        return api.put(`/budgets/${id}`, data);
    },

    /**
     * حذف بودجه
     */
    delete(id) {
        return api.delete(`/budgets/${id}`);
    },

    /**
     * دریافت خلاصه بودجه پروژه
     */
    getSummary(projectId) {
        return api.get(`/budgets-summary`, { params: { project_id: projectId } });
    }
};
