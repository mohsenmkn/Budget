import { LayoutDashboard, Users, ShieldCheck, Wallet, FileText, SquareStack,
    FolderTree, Building2, Settings, UsersRound, RefreshCw, Network } from 'lucide-vue-next'

// Only link to implemented screens backed by the retained API modules.
export const menuItems = [
    { key: 'dashboard', label: 'داشبورد', to: '/dashboard', icon: LayoutDashboard },
    {
        key: 'system', label: 'مدیریت کاربران', icon: Settings,
        children: [
            { key: 'users', label: 'کاربران', to: '/users', access: 'users.read', icon: Users },
            { key: 'roles', label: 'نقش‌ها و دسترسی‌ها', to: '/roles', access: 'roles.read', icon: ShieldCheck },
            { key: 'groups', label: 'گروه‌های کاربری', to: '/groups', access: 'groups.read', icon: UsersRound },
        ],
    },
    {
        key: 'payroll', label: 'فیش حقوقی', icon: Wallet,
        children: [
            { key: 'salary-view', label: 'مشاهده فیش حقوقی', to: '/payroll/payslip', access: 'Payroll.view', icon: FileText },
            { key: 'salary-admin', label: 'مدیریت فیش حقوقی', to: '/payroll/admin', access: 'AdminPayroll.view', icon: SquareStack },
        ],
    },
    {
        key: 'hr', label: 'منابع انسانی', icon: Building2,
        children: [
            { key: 'org-chart', label: 'چارت سازمانی', to: '/hr/org-chart', access: 'hr.view', icon: FolderTree },
            { key: 'personnel', label: 'لیست پرسنل', to: '/hr/employees', access: 'hr.view', icon: Users },
            { key: 'hr-sync', label: 'مدیریت همگام‌سازی', to: '/hr/sync', access: 'hr.manage', icon: RefreshCw },
            { key: 'org-structure', label: 'ساختار سازمانی', to: '/hr/org-structure', access: 'hr.manage', icon: Network },
        ],
    },
    { key: 'profile', label: 'پروفایل من', to: '/profile', icon: Users },
    { key: 'settings', label: 'تنظیمات', to: '/settings', icon: Settings },
]
