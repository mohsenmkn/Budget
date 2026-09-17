import { computed } from 'vue'
import { useAuthStore } from '@/stores/authold.js'

// نگاشت ماژول‌ها به Permissionهای مورد نیاز
const MODULE_CONFIG = {
    payroll: {
        name: 'فیش حقوقی',
        icon: 'pi pi-money-bill',
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        route: { name: 'payroll.payslip' }, // استفاده از نام روت تعریف شده در router شما
        description: 'مشاهده فیش حقوقی',
        permissions: ['Payroll.view']
    },
    payroll_admin: {
        name: 'مدیریت فیش حقوقی',
        icon: 'pi pi-users',
        color: 'from-rose-500 to-pink-600',
        bgLight: 'bg-rose-50',
        textColor: 'text-rose-700',
        route: { name: 'payroll.admin' },
        description: 'مدیریت فیش‌های حقوقی پرسنل',
        permissions: ['AdminPayroll.view']
    },
    project: {
        name: 'پروژه‌ها',
        icon: 'pi pi-folder',
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-700',
        route: { name: 'projects.index' },
        description: 'مدیریت پروژه‌ها و وظایف',
        permissions: ['projects.read', 'projects.view']
    },
    contract: {
        name: 'قراردادها',
        icon: 'pi pi-file-edit',
        color: 'from-purple-500 to-violet-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-700',
        route: { name: 'contracts.index' },
        description: 'مدیریت قراردادها',
        permissions: ['contracts.read', 'contracts.view']
    },
    inventory: {
        name: 'انبار و کالا',
        icon: 'pi pi-box',
        color: 'from-cyan-500 to-sky-600',
        bgLight: 'bg-cyan-50',
        textColor: 'text-cyan-700',
        route: { name: 'inventory.index' },
        description: 'مدیریت انبار و موجودی',
        permissions: ['inventory.read', 'warehouse.view']
    },
    users: {
        name: 'کاربران',
        icon: 'pi pi-users',
        color: 'from-indigo-500 to-blue-600',
        bgLight: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        route: { name: 'users.index' },
        description: 'مدیریت کاربران سیستم',
        permissions: ['users.read']
    },
    roles: {
        name: 'نقش‌ها و دسترسی‌ها',
        icon: 'pi pi-shield',
        color: 'from-teal-500 to-emerald-600',
        bgLight: 'bg-teal-50',
        textColor: 'text-teal-700',
        route: { name: 'roles.index' },
        description: 'مدیریت نقش‌ها و دسترسی‌ها',
        permissions: ['roles.read']
    },
    companies: {
        name: 'شرکت‌ها',
        icon: 'pi pi-building',
        color: 'from-slate-500 to-gray-600',
        bgLight: 'bg-slate-50',
        textColor: 'text-slate-700',
        route: { name: 'companies.index' },
        description: 'اطلاعات شرکت‌ها',
        permissions: ['companies.read']
    }
}

export function useDashboardModules() {
    const authStore = useAuthStore()

    // ماژول‌هایی که کاربر حداقل یکی از دسترسی‌های آن را دارد
    const accessibleModules = computed(() => {
        // اگر کاربر هنوز لود نشده، آرایه خالی برگردان
        if (!authStore.user) return []

        return Object.entries(MODULE_CONFIG)
            .filter(([key, config]) => {
                // بررسی می‌کنیم آیا کاربر حداقل یکی از permissionهای این ماژول را دارد
                return config.permissions.some(perm => authStore.can(perm))
            })
            .map(([key, config]) => ({
                key,
                ...config
            }))
    })

    return {
        accessibleModules,
        user: computed(() => authStore.user),
        roles: computed(() => authStore.user?.roles || [])
    }
}