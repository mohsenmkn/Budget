import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authold.js'
import { showToast } from '@/plugins/toast'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: { 'Accept': 'application/json' }
})


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiomrani.gttmco.ir/api/v1'

export const apiUrl = (path) => `${BASE_URL}${path}`

let isRedirecting = false
api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const authStore = useAuthStore()
        const status = error.response?.status
        const data = error.response?.data

        if (status === 401) { // Unauthorized: نشست تمام شده
            authStore.clearAuth()
            if (!isRedirecting && router.currentRoute.value.name !== 'login') {
                isRedirecting = true
                showToast({
                    severity: 'warn',
                    summary: 'مدت زمان حضور شما در سامانه منقضی شد.',
                    detail: 'لطفاً دوباره وارد شوید.',
                    life: 3000
                })
                await router.push({
                    name: 'login',
                    query: {
                        redirect: router.currentRoute.value.fullPath,
                        session_expired: 'true'
                    }
                })
            }
        } else if (status === 403) { // Forbidden: دسترسی محدود
            // اینجا toast نمایش می‌دهیم چون router guard ممکن است قبل از این خطا را catch کند
            // و router guard به صفحه forbidden هدایت می‌کند، ولی یک toast هم برای اطمینان خوب است.
            // اگر router guard ما را به forbidden redirect نکرد، این toast نمایش داده می‌شود.
            if (!router.currentRoute.value.name === 'forbidden') { // اگر در صفحه forbidden نیستیم
                showToast({
                    severity: 'error',
                    summary: 'دسترسی محدود',
                    detail: 'شما مجوز انجام این عملیات را ندارید.',
                    life: 3000
                })
            }
            // 403 نیازی به پاک کردن auth و redirect به login ندارد
        }

        // برای خطاهای دیگر، اجازه می‌دهیم useApiErrorHandler آنها را بگیرد
        return Promise.reject(error)
    }
)

export default api
