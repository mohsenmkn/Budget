// resources/js/services/wbsService.js
import api from '@/api/axios'

export const wbsService = {
    // WBS Items
    list: (params) => api.get('/wbs', { params }),

    // ✅ اصلاح متد get با مدیریت خطا
    get: async (id) => {
        try {
            return await api.get(`/wbs/${id}`)
        } catch (error) {
            console.error('❌ Error fetching WBS item:', error)
            throw error
        }
    },


    create: (data) => api.post('/wbs', data),
    update: (id, data) => api.put(`/wbs/${id}`, data),
    delete: (id) => api.delete(`/wbs/${id}`),
    tree: (projectId) => api.get('/wbs/tree', { params: { project_id: projectId } }),

    // Tasks
    getTasks: (wbsItemId, params) => {
        return api.get(`/wbs/${wbsItemId}/tasks`, { params })
    },

    createTask: (wbsItemId, data) => {
        // ✅ حذف wbs_item_id از payload
        const { wbs_item_id, ...cleanData } = data;

        console.log('📤 Creating task for wbsItemId:', wbsItemId, cleanData)
        return api.post(`/wbs/${wbsItemId}/tasks`, cleanData)
            .then(response => {
                console.log('📥 Task created:', response)
                return response
            })
            .catch(error => {
                console.error('❌ Create task error:', error.response?.data)
                throw error
            })
    },

    updateTask: (wbsItemId, taskId, data) => {
        return api.put(`/wbs/${wbsItemId}/tasks/${taskId}`, data)
    },

    deleteTask: (wbsItemId, taskId) => {
        return api.delete(`/wbs/${wbsItemId}/tasks/${taskId}`)
    },

    completeTask: (wbsItemId, taskId) => {
        return api.patch(`/wbs/${wbsItemId}/tasks/${taskId}/complete`)
    },
}