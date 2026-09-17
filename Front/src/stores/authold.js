
import { defineStore } from 'pinia'
import api from "@/api/axios.js";




export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null,   // {id, name, mobile, roles:[], permissions:[]}
        token: localStorage.getItem('token') || null,
        loaded: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,

        hasUser: (state) => !!state.user,

        permissions: (state) => state.user?.permissions || [],

        roles: (state) => state.user?.roles || [],

        displayName: (state) => state.user?.name || '',

        can: (state) => (permission) => {
            return (state.user?.permissions || []).includes(permission)
        },

        canAny: (state) => (permissions = []) => {
            return permissions.some(permission =>
                (state.user?.permissions || []).includes(permission)
            )
        },

        canAll: (state) => (permissions = []) => {
            return permissions.every(permission =>
                (state.user?.permissions || []).includes(permission)
            )
        },
    },

    actions: {



        async login(credentials) {
            try {
                const { data } = await api.post('/auth/login', credentials)

                this.setToken(data.token)
                this.setUser(data.user)
                localStorage.setItem('token', this.token)
                await this.fetchMe()
                return data
            } catch (error) {
                throw error
            }
        },

        async initAuth() {
            if (!this.token) {
                this.loaded = true
                return
            }

            try {
                await this.fetchMe()
            } catch (error) {
                // interceptor or fetchMe handles this
            }
        },


        async fetchMe() {
            try {
                const { data } = await api.get(`/auth/me`)
                this.user = data.user
            } catch (error) {
                if (error?.response?.status === 401) {
                    this.clearAuth()
                } else {
                    this.user = null
                }
                throw error
            } finally {
                this.loaded = true
            }
        },

        setToken(token) {
            this.token = token
            if (token) {
                localStorage.setItem('token', token)
            } else {
                localStorage.removeItem('token')
            }
        },

        setUser(user) {
            this.user = user
            this.loaded = true
        },

        clearAuth() {
            this.user = null
            this.token = null
            this.loaded = true
            localStorage.removeItem('token')
        },

        async logout() {
            try {
                await api.post('/auth/logout')
            } catch (error) {
                // حتی اگر logout API خطا داد، فرانت را پاک می‌کنیم
            } finally {
                this.clearAuth()
            }
        },
    },
})


