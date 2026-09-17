import api from '@/api/axios'

export const authService = {
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    sendOtp: (mobile) => api.post('/auth/send-otp', { mobile }),
    verifyOtp: (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    getCaptcha: () => api.get('/auth/captcha').then(r => r.data),
}


