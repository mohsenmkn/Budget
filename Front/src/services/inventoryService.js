// resources/js/services/inventoryService.js
import api from '@/api/axios'

export const inventoryService = {
    // ============================================
    // 1. کالاها (Materials)
    // ============================================

    /**
     * لیست کالاها
     * @param {Object} params - { company_id, category_id, status, search, low_stock, page, per_page }
     */
    getMaterials: (params) => api.get('/materials', { params }),

    /**
     * نمایش یک کالا
     * @param {number|string} id - شناسه کالا
     */
    getMaterial: (id) => api.get(`/materials/${id}`),

    /**
     * ایجاد کالا جدید
     * @param {Object} data - { company_id, category_id, code, name, unit, unit_price, current_stock, min_stock, max_stock, description, status }
     */
    createMaterial: (data) => api.post('/materials', data),

    /**
     * ویرایش کالا
     * @param {number|string} id - شناسه کالا
     * @param {Object} data - { category_id, code, name, unit, unit_price, current_stock, min_stock, max_stock, description, status }
     */
    updateMaterial: (id, data) => api.put(`/materials/${id}`, data),

    /**
     * حذف کالا
     * @param {number|string} id - شناسه کالا
     */
    deleteMaterial: (id) => api.delete(`/materials/${id}`),

    /**
     * دریافت تراکنش‌های یک کالا
     * @param {number|string} materialId - شناسه کالا
     * @param {Object} params - { type, date_from, date_to, page, per_page }
     */
    getMaterialTransactions: (materialId, params) =>
        api.get(`/materials/${materialId}/transactions`, { params }),

    /**
     * دریافت تاریخچه موجودی کالا
     * @param {number|string} materialId - شناسه کالا
     * @param {Object} params - { days }
     */
    getStockHistory: (materialId, params) =>
        api.get(`/materials/${materialId}/stock-history`, { params }),

    /**
     * ✅ دریافت کالاهای یک پروژه (برای تب انبار در پروژه)
     * @param {number|string} projectId - شناسه پروژه
     * @param {Object} params - { search, category_id, status, page, per_page }
     */
    getProjectMaterials: (projectId, params) =>
        api.get(`/projects/${projectId}/materials`, { params }),


    // ============================================
    // 2. دسته‌بندی کالاها (Categories)
    // ============================================

    /**
     * لیست دسته‌بندی‌ها
     * @param {Object} params - { company_id, status, parent_id, search, page, per_page }
     */
    getCategories: (params) => api.get('/inventory-categories', { params }),

    /**
     * دریافت درخت دسته‌بندی‌ها
     * @param {Object} params - { company_id }
     */
    getCategoryTree: (params) => api.get('/inventory-categories/tree', { params }),

    /**
     * نمایش یک دسته‌بندی
     * @param {number|string} id - شناسه دسته‌بندی
     */
    getCategory: (id) => api.get(`/inventory-categories/${id}`),

    /**
     * ایجاد دسته‌بندی جدید
     * @param {Object} data - { company_id, name, code, parent_id, description, status }
     */
    createCategory: (data) => api.post('/inventory-categories', data),

    /**
     * ویرایش دسته‌بندی
     * @param {number|string} id - شناسه دسته‌بندی
     * @param {Object} data - { name, code, parent_id, description, status }
     */
    updateCategory: (id, data) => api.put(`/inventory-categories/${id}`, data),

    /**
     * حذف دسته‌بندی
     * @param {number|string} id - شناسه دسته‌بندی
     */
    deleteCategory: (id) => api.delete(`/inventory-categories/${id}`),


    // ============================================
    // 3. تراکنش‌های انبار (Warehouse Transactions)
    // ============================================

    /**
     * لیست تراکنش‌ها
     * @param {Object} params - { company_id, material_id, project_id, wbs_item_id, type, date_from, date_to, search, page, per_page }
     */
    getTransactions: (params) => api.get('/warehouse-transactions', { params }),

    /**
     * نمایش یک تراکنش
     * @param {number|string} id - شناسه تراکنش
     */
    getTransaction: (id) => api.get(`/warehouse-transactions/${id}`),

    /**
     * ایجاد تراکنش جدید
     * @param {Object} data - { company_id, material_id, project_id, wbs_item_id, contract_id, type, quantity, unit_price, total_price, transaction_date, reference_number, description }
     */
    createTransaction: (data) => api.post('/warehouse-transactions', data),

    /**
     * حذف تراکنش
     * @param {number|string} id - شناسه تراکنش
     */
    deleteTransaction: (id) => api.delete(`/warehouse-transactions/${id}`),

    /**
     * دریافت تراکنش‌های یک کالا
     * @param {number|string} materialId - شناسه کالا
     * @param {Object} params - { type, date_from, date_to, page, per_page }
     */
    getTransactionsByMaterial: (materialId, params) =>
        api.get(`/warehouse-transactions/by-material/${materialId}`, { params }),

    /**
     * دریافت تراکنش‌های یک پروژه
     * @param {number|string} projectId - شناسه پروژه
     * @param {Object} params - { type, date_from, date_to, page, per_page }
     */
    getTransactionsByProject: (projectId, params) =>
        api.get(`/warehouse-transactions/by-project/${projectId}`, { params }),


    // ============================================
    // 4. گزارشات انبار (Reports)
    // ============================================

    /**
     * گزارش موجودی انبار
     * @param {Object} params - { category_id, status }
     */
    getStockReport: (params) => api.get('/inventory-reports/stock', { params }),

    /**
     * گزارش مصرف کلی
     * @param {Object} params - { date_from, date_to }
     */
    getConsumptionReport: (params) => api.get('/inventory-reports/consumption', { params }),

    /**
     * گزارش مصرف یک پروژه
     * @param {number|string} projectId - شناسه پروژه
     * @param {Object} params - { date_from, date_to }
     */
    getProjectConsumption: (projectId, params) =>
        api.get(`/inventory-reports/project-consumption/${projectId}`, { params }),

    /**
     * گزارش مصرف یک WBS Item
     * @param {number|string} wbsItemId - شناسه WBS Item
     * @param {Object} params - { date_from, date_to }
     */
    getWbsConsumption: (wbsItemId, params) =>
        api.get(`/inventory-reports/wbs-consumption/${wbsItemId}`, { params }),

    /**
     * گزارش حرکت کالاها (ورود/خروج)
     * @param {Object} params - { date_from, date_to }
     */
    getMovementReport: (params) => api.get('/inventory-reports/movement', { params }),

    /**
     * گزارش کالاهای با موجودی کم
     * @param {Object} params - { category_id }
     */
    getLowStockReport: (params) => api.get('/inventory-reports/low-stock', { params }),
}