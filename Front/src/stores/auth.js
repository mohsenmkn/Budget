import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loaded: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        hasUser: (state) => !!state.user,
        permissions: (state) => state.user?.permissions ?? [],
        roles: (state) => state.user?.roles ?? [],
        displayName: (state) => state.user?.name ?? '',
        can: (state) => (permission) => state.user?.permissions?.includes(permission) ?? false,
        canAny: (state) => (perms) => perms.some((p) => state.user?.permissions?.includes(p)),
        canAll: (state) => (perms) => perms.every((p) => state.user?.permissions?.includes(p)),
    },

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },

        setUser(user) {
            this.user = user
        },

        clearAuth() {
            this.user = null
            this.token = null
            this.loaded = false
            localStorage.removeItem('token')
        },

        async login(credentials) {
            const { data } = await authService.login(credentials)
            this.setToken(data.token)
            this.setUser(data.user)
            await this.fetchMe()
        },

        async fetchMe() {
            try {
                const { data } = await authService.me()
                this.setUser(data)
            } catch {
                this.clearAuth()
            } finally {
                this.loaded = true
            }
        },

        async initAuth() {
            if (!this.token) {
                this.loaded = true
                return
            }
            await this.fetchMe()
        },

        async logout() {
            try {
                await authService.logout()
            } finally {
                this.clearAuth()
            }
        },
    },
})
