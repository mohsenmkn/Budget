
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authold.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

// جلوگیری از redirect های پشت سر هم وقتی چند request همزمان 401 می‌خورند
let isRedirectingToLogin = false

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()

        // اگر جایی Authorization دستی ست شده بود، دست نزن
        if (!config.headers) config.headers = {}

        if (!config.headers.Authorization && authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status

        // اگر response نداریم => network error. اینجا فقط reject می‌کنیم
        // toast / پیام را در useApiErrorHandler یا جای دیگر مدیریت کن
        if (!error?.response) {
            return Promise.reject(error)
        }

        // 401 => نشست/توکن معتبر نیست
        if (status === 401) {
            const authStore = useAuthStore()
            authStore.clearAuth()

            const currentRouteName = router.currentRoute.value?.name

            // اگر همین الان در login هستیم، redirect نکن
            if (currentRouteName !== 'login' && !isRedirectingToLogin) {
                isRedirectingToLogin = true
                try {
                    await router.push({
                        name: 'login',
                        query: {
                            // برگشت به صفحه قبلی بعد از لاگین (اختیاری)
                            redirect: router.currentRoute.value?.fullPath || '/',
                        },
                    })
                } finally {
                    isRedirectingToLogin = false
                }
            }
        }

        // 403 را اینجا redirect نکن (معمولاً یعنی مجوز نداری، نه اینکه نشست تمام شده)
        return Promise.reject(error)
    }
)

export default api
