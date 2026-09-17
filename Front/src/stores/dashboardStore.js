import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardService from '@/services/dashboardService'

// نگاشت ماژول‌ها به permissions مربوطه
const MODULE_PERMISSION_MAP = {
    payroll: ['payroll.view', 'payroll.read', 'payroll.manage'],
    project: ['project.view', 'project.read', 'project.manage'],
    contract: ['contract.view', 'contract.read', 'contract.manage'],
    document: ['document.view', 'document.read', 'document.upload'],
    warehouse: ['warehouse.view', 'warehouse.read', 'warehouse.manage'],
    budget: ['budget.view', 'budget.read', 'budget.manage'],
    pettycash: ['pettycash.view', 'pettycash.read', 'pettycash.manage'],
    wbs: ['wbs.view', 'wbs.read', 'wbs.manage'],
    company: ['company.view', 'company.read'],
    user: ['users.read', 'users.update', 'users.manage'],
    auth: ['auth.view', 'auth.manage'],
    acl: ['acl.view', 'acl.manage'],
    dashboard: ['dashboard.view', 'dashboard.read'],
}

// اطلاعات هر ماژول (آیکون، رنگ، مسیر)
const MODULE_INFO = {
    payroll: {
        name: 'فیش حقوقی',
        icon: 'pi pi-money-bill',
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        route: '/payroll',
        description: 'مشاهده و مدیریت فیش حقوقی'
    },
    project: {
        name: 'پروژه‌ها',
        icon: 'pi pi-folder',
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-700',
        route: '/projects',
        description: 'مدیریت پروژه‌ها و وظایف'
    },
    contract: {
        name: 'قراردادها',
        icon: 'pi pi-file-edit',
        color: 'from-purple-500 to-violet-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-700',
        route: '/contracts',
        description: 'مدیریت قراردادها'
    },
    document: {
        name: 'اسناد',
        icon: 'pi pi-file',
        color: 'from-amber-500 to-orange-600',
        bgLight: 'bg-amber-50',
        textColor: 'text-amber-700',
        route: '/documents',
        description: 'مدیریت اسناد و مدارک'
    },
    warehouse: {
        name: 'انبار',
        icon: 'pi pi-box',
        color: 'from-cyan-500 to-sky-600',
        bgLight: 'bg-cyan-50',
        textColor: 'text-cyan-700',
        route: '/warehouse',
        description: 'مدیریت انبار و موجودی'
    },
    budget: {
        name: 'بودجه',
        icon: 'pi pi-chart-bar',
        color: 'from-rose-500 to-pink-600',
        bgLight: 'bg-rose-50',
        textColor: 'text-rose-700',
        route: '/budget',
        description: 'مدیریت بودجه و هزینه‌ها'
    },
    pettycash: {
        name: 'تنخواه',
        icon: 'pi pi-wallet',
        color: 'from-lime-500 to-green-600',
        bgLight: 'bg-lime-50',
        textColor: 'text-lime-700',
        route: '/petty-cash',
        description: 'مدیریت تنخواه گردان'
    },
    wbs: {
        name: 'ساختار شکست کار',
        icon: 'pi pi-sitemap',
        color: 'from-fuchsia-500 to-pink-600',
        bgLight: 'bg-fuchsia-50',
        textColor: 'text-fuchsia-700',
        route: '/wbs',
        description: 'مدیریت WBS و تسک‌ها'
    },
    company: {
        name: 'شرکت',
        icon: 'pi pi-building',
        color: 'from-slate-500 to-gray-600',
        bgLight: 'bg-slate-50',
        textColor: 'text-slate-700',
        route: '/company',
        description: 'اطلاعات شرکت'
    },
    user: {
        name: 'کاربران',
        icon: 'pi pi-users',
        color: 'from-indigo-500 to-blue-600',
        bgLight: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        route: '/users',
        description: 'مدیریت کاربران و دسترسی‌ها'
    },
    auth: {
        name: 'احراز هویت',
        icon: 'pi pi-lock',
        color: 'from-red-500 to-rose-600',
        bgLight: 'bg-red-50',
        textColor: 'text-red-700',
        route: '/auth',
        description: 'مدیریت احراز هویت'
    },
    acl: {
        name: 'کنترل دسترسی',
        icon: 'pi pi-shield',
        color: 'from-teal-500 to-emerald-600',
        bgLight: 'bg-teal-50',
        textColor: 'text-teal-700',
        route: '/acl',
        description: 'مدیریت نقش‌ها و دسترسی‌ها'
    },
    dashboard: {
        name: 'داشبورد',
        icon: 'pi pi-home',
        color: 'from-violet-500 to-purple-600',
        bgLight: 'bg-violet-50',
        textColor: 'text-violet-700',
        route: '/dashboard',
        description: 'نمای کلی سیستم'
    },
}

export const useDashboardStore = defineStore('dashboard', () => {
    const user = ref(null)
    const permissions = ref([])
    const roles = ref([])
    const loading = ref(false)
    const error = ref(null)

    // دریافت لیست ماژول‌هایی که کاربر به آن‌ها دسترسی دارد
    const accessibleModules = computed(() => {
        if (!permissions.value.length) return []

        return Object.entries(MODULE_PERMISSION_MAP)
            .filter(([moduleKey, perms]) =>
                perms.some(perm => permissions.value.includes(perm))
            )
            .map(([moduleKey]) => ({
                key: moduleKey,
                ...MODULE_INFO[moduleKey]
            }))
    })

    // بررسی دسترسی به یک ماژول خاص
    const hasModuleAccess = (moduleKey) => {
        const perms = MODULE_PERMISSION_MAP[moduleKey] || []
        return perms.some(perm => permissions.value.includes(perm))
    }

    // دریافت اطلاعات داشبورد
    async function fetchDashboardData() {
        loading.value = true
        error.value = null
        try {
            const data = await dashboardService.getDashboardData()
            user.value = data.user
            permissions.value = data.user?.permissions || []
            roles.value = data.user?.roles || []
        } catch (err) {
            error.value = err.message || 'خطا در دریافت اطلاعات'
            console.error('Dashboard fetch error:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        permissions,
        roles,
        loading,
        error,
        accessibleModules,
        hasModuleAccess,
        fetchDashboardData
    }
})