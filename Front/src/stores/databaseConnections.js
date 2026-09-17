// src/stores/databaseConnections.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databaseConnectionsApi } from '@/services/systemSettings.js'
import { showToast } from '@/plugins/toast'

export const useDatabaseConnectionsStore = defineStore('databaseConnections', () => {
    const connections = ref([])
    const loading = ref(false)
    const testing = ref(false)
    const currentConnection = ref(null)

    const activeConnections = computed(() =>
        connections.value.filter(c => c.is_active)
    )

    const fetchAll = async () => {
        loading.value = true
        try {
            const { data } = await databaseConnectionsApi.getAll()
            connections.value = data.data
        } catch (error) {
            showToast({ severity: 'error', summary: 'خطا', detail: 'خطا در دریافت لیست اتصالات', life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const create = async (payload) => {
        const { data } = await databaseConnectionsApi.create(payload)
        connections.value.unshift(data.data)
        showToast({ severity: 'success', summary: 'موفق', detail: data.message, life: 3000 })
        return data
    }

    const update = async (id, payload) => {
        const { data } = await databaseConnectionsApi.update(id, payload)
        const index = connections.value.findIndex(c => c.id === id)
        if (index !== -1) connections.value[index] = data.data
        showToast({ severity: 'success', summary: 'موفق', detail: data.message, life: 3000 })
        return data
    }

    const remove = async (id) => {
        await databaseConnectionsApi.delete(id)
        connections.value = connections.value.filter(c => c.id !== id)
        showToast({ severity: 'success', summary: 'موفق', detail: 'اتصال حذف شد', life: 3000 })
    }

    const toggleActive = async (id) => {
        const { data } = await databaseConnectionsApi.toggle(id)
        const conn = connections.value.find(c => c.id === id)
        if (conn) conn.is_active = data.data.is_active
        showToast({ severity: 'info', summary: 'تغییر وضعیت', detail: data.message, life: 2000 })
    }

    const testConnection = async (payload) => {
        testing.value = true
        try {
            const { data } = await databaseConnectionsApi.test(payload)
            showToast({
                severity: data.success ? 'success' : 'error',
                summary: data.success ? 'اتصال موفق' : 'خطا در اتصال',
                detail: data.message,
                life: 4000
            })
            return data
        } finally {
            testing.value = false
        }
    }

    const testSavedConnection = async (id) => {
        testing.value = true
        try {
            const { data } = await databaseConnectionsApi.testSaved(id)
            showToast({
                severity: data.success ? 'success' : 'error',
                summary: data.success ? 'اتصال موفق' : 'خطا',
                detail: data.message,
                life: 4000
            })
            return data
        } finally {
            testing.value = false
        }
    }

    const clearCache = async () => {
        await databaseConnectionsApi.clearCache()
        showToast({ severity: 'success', summary: 'موفق', detail: 'کش پاک شد', life: 2000 })
    }

    return {
        connections, loading, testing, currentConnection, activeConnections,
        fetchAll, create, update, remove, toggleActive,
        testConnection, testSavedConnection, clearCache
    }
})