import {
    LayoutDashboard, Users, ShieldCheck, Wallet, FileText, SquareStack, Clock,
    FolderKanban, Handshake, Warehouse, Package, FolderTree, ArrowLeftRight, GitBranch,
    BarChart3, TrendingDown, UserCog, CalendarCheck, Building2, LibraryBig,Link,
    BookOpen, Bookmark, Book, BookmarkCheck, MessageSquareWarning, PlusCircle,DollarSign,
    ShieldAlert, List, Network, FileSignature, Inbox,User,Activity, AlertTriangle, Eye, Mail, Calendar, Phone, CreditCard,
    Briefcase, Lock, Shield, Settings, Bell, Search, X, Check, Plus, Edit, Trash2,Truck,
    Save,Filter,Download,Upload,RefreshCw,Info,HelpCircle,LogOut, ChevronDown,UsersRound,
    ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,ClipboardCheck,ClipboardList,FileBarChart,Gauge,Database,Wrench
} from 'lucide-vue-next'

export const menuItems = [
    // ═══════ داشبورد ═══════
    {
        key: 'dashboard',
        label: 'داشبورد',
        to: '/dashboard',
        access: 'dashboard.view',
        icon: LayoutDashboard,
        badge: null,
    },

    // ═══════ تنظیمات سیستم ═══════
    {
        key: 'system',
        label: 'تنظیمات سیستم',
        icon: Settings,
        access: 'users.read',
        children: [
            {
                key: 'roles',
                label: 'مدیریت نقش‌ها',
                to: '/roles',
                access: 'roles.read',
                icon: ShieldCheck,
            },
            {
                key: 'users',
                label: 'کاربران',
                to: '/users',
                access: 'users.read',
                icon: Users,
                badge: 0, // 🔑 نمونه badge
                badgeColor: 'red',
            },
            {
                key: 'notifications',
                label: 'اعلان‌ها',
                to: '/notifications',
                access: 'notifications.read',
                icon: Bell,
                badge: 5,
                badgeColor: 'orange',
            },
            {
                key: 'profile',
                label: 'پروفایل من',
                to: '/profile',
                icon: Users,
            },
            {
                key: 'settings',
                label: 'تنظیمات',
                to: '/settings',
                icon: Settings,
            },
            // ═══════ آیتم جدید: مدیریت اتصالات دیتابیس ═══════
            {
                key: 'database-connections',
                label: 'اتصالات دیتابیس',
                to: '/system-settings/database-connections',
                access: 'system_settings.manage_database',
                icon: Database,
                badge: null,
                badgeColor: 'blue',
            },
            {
                key: 'groups',
                label: 'گروه‌های کاربری',
                to: '/groups',
                access: 'groups.read',
                icon: UsersRound,
            },
            {
                key: 'equipment-access',
                label: 'مدیریت دسترسی تجهیزات',
                to: '/finance/equipment-access',
                access: 'users.read',
                icon: ShieldCheck,
            },
        ],
    },

    // ═══════ فیش حقوقی ═══════
    {
        key: 'payroll',
        label: 'فیش حقوقی',
        icon: Wallet,
        access: 'Payroll.view',
        children: [
            {
                key: 'salary-view',
                label: 'مشاهده فیش حقوقی',
                to: '/payroll/payslip',
                access: 'Payroll.view',
                icon: FileText,
            },
            {
                key: 'salary-admin',
                label: 'مدیریت فیش حقوقی',
                to: '/payroll/admin',
                access: 'AdminPayroll.view',
                icon: SquareStack,
            },
        ],
    },

    // ═══════ مدیریت تردد ═══════
    /* {
    //     key: 'attendance',
    //     label: 'مدیریت تردد',
    //     icon: Clock,
    //     access: 'AdminHr.view',
    //     children: [
    //         {
    //             key: 'attendance-management',
    //             label: 'مدیریت تردد پرسنل',
    //             to: '/attendance/management',
    //             access: 'AdminHr.view',
    //             icon: CalendarCheck,
    //         },
    //     ],
    },*/

    // ═══════ کنترل پروژه عمرانی ═══════

    {
        key: 'projects',
        label: 'کنترل پروژه عمرانی',
        icon: Building2,
        access: 'projects.read',
        children: [
            {
                key: 'projects-list',
                label: 'پروژه‌ها',
                to: '/projects',
                access: 'projects.read',
                icon: FolderKanban,
            },
            {
                key: 'contracts',
                label: 'قراردادها',
                to: '/contracts',
                access: 'contracts.read',
                icon: Handshake,
            },
            {
                key: 'warehouse',
                label: 'انبار',
                icon: Warehouse,
                access: 'warehouse.read',
                children: [
                    {
                        key: 'inventory',
                        label: 'لیست کالاها',
                        to: '/inventory',
                        access: 'Material.read',
                        icon: Package,
                    },
                    {
                        key: 'categories',
                        label: 'دسته‌بندی کالاها',
                        to: '/inventory/categories',
                        access: 'categories.read',
                        icon: FolderTree,
                    },
                    {
                        key: 'transactions',
                        label: 'تراکنش‌ها',
                        to: '/inventory/transactions',
                        access: 'transactions.read',
                        icon: ArrowLeftRight,
                    },
                    {
                        key: 'stock-report',
                        label: 'گزارش موجودی',
                        to: '/inventory/stock',
                        access: 'stock.view',
                        icon: BarChart3,
                    },
                    {
                        key: 'low-stock',
                        label: 'موجودی کم',
                        to: '/inventory/low-stock',
                        access: 'low-stock.view',
                        icon: AlertTriangle,
                        badge: 3,
                        badgeColor: 'red',
                    },
                    {
                        key: 'consumption',
                        label: 'گزارش مصرف',
                        to: '/inventory/consumption',
                        access: 'consumption.view',
                        icon: TrendingDown,
                    },
                ],
            },
        ],
    },


    // ═══════کتابخانه ═══════
    // 🔑 اضافه کردن منوی کتابخانه

    {
        key: 'library',
        label: 'کتابخانه',
        icon: LibraryBig,
        access: 'library.view',
        children: [
            {
                key: 'library-books',
                label: 'مشاهده کتاب‌ها',
                to: '/library',
                access: 'librarybooks.view',
                icon: BookOpen,
            },
            {
                key: 'library-my-reservations',
                label: 'رزروهای من',
                to: '/library/my-reservations',
                access: 'libraryreservations.view',
                icon: Bookmark,
            },
            {
                key: 'library-my-notifications',
                label: 'اعلان‌های من',
                to: '/library/my-notifications',
                icon: Bell,
            },
            {
                key: 'library-admin',
                label: 'مدیریت کتابخانه',
                icon: LibraryBig,
                access: 'librarybooks.manage',
                children: [
                    {
                        key: 'library-dashboard',
                        label: 'داشبورد کتابخانه',
                        to: '/library/admin',
                        access: 'librarystatistics.view',
                        icon: BarChart3,
                    },
                    {
                        key: 'library-manage-books',
                        label: 'مدیریت کتاب‌ها',
                        to: '/library/admin/books',
                        access: 'librarybooks.manage',
                        icon: Book,
                    },
                    {
                        key: 'library-manage-reservations',
                        label: 'مدیریت رزروها',
                        to: '/library/admin/reservations',
                        access: 'libraryreservations.manage',
                        icon: BookmarkCheck,
                    },
                ],
            },
        ],
    },


    // ═══════ شکایات و پیشنهادات ═══════
    {
        key: 'complaints',
        label: 'شکایات و پیشنهادات',
        icon: MessageSquareWarning,
        access: 'complaints.read',
        children: [
            {
                key: 'complaints-my',
                label: 'شکایات من',
                to: '/complaints/my',
                access: 'complaints.read',
                icon: FileText
            },
            {
                key: 'complaints-create',
                label: 'ثبت شکایت جدید',
                to: '/complaints/create',
                access: 'complaints.create',
                icon: PlusCircle
            },
            // ✅ جدید: شکایات ارجاع‌شده به من
            {
                key: 'complaints-assigned-to-me',
                label: 'شکایات ارجاع‌شده به من',
                to: '/complaints/assigned-to-me',
                access: 'complaints.review',
                icon: Inbox,  // باید import شود
                badge: null,  // می‌توانید بعداً تعداد شکایات جدید را نمایش دهید
                badgeColor: 'red'
            },
            // ═══════ مدیریت شکایات ═══════
            {
                key: 'complaints-admin',
                label: 'مدیریت شکایات',
                icon: ShieldAlert,
                access: 'complaints.manage',
                children: [

                    // ✅ این آیتم جدید
                    {
                        key: 'complaints-dashboard',
                        label: 'داشبورد آماری',
                        to: '/complaints/admin/dashboard',
                        access: 'complaintstatistics.view',
                        icon: BarChart3,
                    },
                    {
                        key: 'complaints-admin-list',
                        label: 'لیست شکایات',
                        to: '/complaints/admin',
                        access: 'complaints.manage',
                        icon: List,
                    },
                    {
                        key: 'complaints-categories',
                        label: 'دسته‌بندی شکایات',
                        to: '/complaints/categories',
                        access: 'complaintcategories.read',
                        icon: FolderTree,
                    },
                    {
                        key: 'admin.complaint-managers',
                        label: 'مسئولین پیگیری شکایات',
                        to: { name: 'admin.complaint-managers' },
                        access:'complaintmanagers.read',
                        icon: UserCog,
                    }
                ]
            },
        ]
    },

    // ═══════ منابع انسانی ═══════
    {
        key: 'hr',
        label: 'منابع انسانی',
        icon: Building2,           // ← قبلاً import شده ✅
        access: 'hr.view',
        children: [
            {
                key: 'org-chart',
                label: 'چارت سازمانی',
                to: '/hr/org-chart',
                access: 'hr.view',
                icon: FolderTree,  // ← قبلاً import شده ✅
            },
            // ✅ جدید
            {
                key: 'personnel',
                label: 'لیست پرسنل',
                to: '/hr/employees',
                access: 'hr.view',
                icon: Users,
            },
            // در children منوی HR اضافه کنید:
            {
                key: 'hr-sync',
                label: 'مدیریت همگام‌سازی',
                to: '/hr/sync',
                access: 'hr.manage',
                icon: RefreshCw,  // ← باید import شود
            },
            {
                key: 'org-structure',
                label: 'مدیریت ساختار سازمانی',
                to: '/hr/org-structure',
                access: 'hr.manage',
                icon: Network,  // ← باید import شود
            },
            // آیتم‌های ماژول ارزیابی شایستگی
            {
                key: 'assessment',
                label: 'ارزیابی شایستگی',
                icon: ClipboardCheck,
                children: [
                    {
                        key: 'assessment.dashboard',
                        label: 'داشبورد ارزیابی',
                        to: '/assessment',
                        access: 'assessment.view',
                    },
                    {
                        key: 'assessment.profiles',
                        label: 'شناسنامه‌های شایستگی',
                        to: '/assessment/profiles',
                        access: 'assessment.manage',
                    },
                    {
                        key: 'assessment.tasks',
                        label: 'ارزیابی‌های من',
                        to: '/assessment/tasks',
                        access: 'assessment.evaluate',
                    },
                    {
                        key: 'assessment.auto-assign',
                        label: 'تخصیص خودکار شایستگی',
                        to: '/assessment/auto-assign',
                        access: 'assessment.manage',  // ✅ اصلاح شد: permission → access
                    },
                    {
                        key: 'assessment.methods',
                        label: 'روش‌های رفع خلا',
                        to: '/assessment/methods',
                        access: 'assessment.view',
                    },
                    {
                        key: 'assessment.my-report',
                        label: 'کارنامه شایستگی من',
                        to: '/assessment/my-report',
                        access: 'assessment.view',
                    },
                    {
                        key: 'assessment.mappings',
                        label: 'نگاشت دستی شناسنامه‌ها',
                        to: '/assessment/mappings',
                        access: 'assessment.manage',
                        icon: Link,  // از lucide-vue-next import کنید
                    },
                ],
            },
        ],
    },


    // اضافه کردن به آرایه menuItems (قبل از HR یا در جای مناسب):
    {
        key: 'virtual-secretariat',
        label: 'دبیرخانه مجازی',
        icon: Mail,
        access: 'virtual_secretariat.view',
        children: [
            {
                key: 'vs-my-requests',
                label: 'درخواست‌های من',
                to: '/virtual-secretariat/my-requests',
                access: 'virtual_secretariat.view_requests',
                icon: FileText,
            },
            {
                key: 'vs-create-request',
                label: 'ثبت درخواست جدید',
                to: '/virtual-secretariat/create',
                access: 'virtual_secretariat.create_request',
                icon: FileSignature,
            },
            {
                key: 'vs-admin',
                label: 'مدیریت دبیرخانه',
                icon: Settings,
                access: 'virtual_secretariat.manage',
                children: [
                    {
                        key: 'vs-dashboard',
                        label: 'داشبورد',
                        to: '/virtual-secretariat/admin/dashboard',
                        access: 'virtual_secretariat.view',
                        icon: BarChart3,
                    },
                    {
                        key: 'vs-templates',
                        label: 'مدیریت قالب‌ها',
                        to: '/virtual-secretariat/admin/templates',
                        access: 'virtual_secretariat.manage_templates',
                        icon: FolderTree,
                    },
                    {
                        key: 'vs-all-requests',
                        label: 'همه درخواست‌ها',
                        to: '/virtual-secretariat/admin/requests',
                        access: 'virtual_secretariat.manage',
                        icon: List,
                    },
                    {
                        key: 'vs.workflow-dashboard',
                        label: 'داشبورد فرآیندها',
                        to: '/virtual-secretariat/workflow-dashboard',
                        access: 'virtual_secretariat.manage',
                        icon: List,
                    },
                ],
            },
        ],
    },


    // ✅ منوی جدید: Warehouse Gtrabar
    {
        key: 'warehouse-gtrabar',
        label: 'انبار (Gtrabar)',
        access: 'warehouse_gtrabar.view',
        icon: Warehouse,
        children: [
            {
                key: 'wg-stock',
                label: 'موجودی انبار',
                to: '/warehouse-gtrabar/stock',
                access: 'warehouse_gtrabar.stock_view',
                icon: Package,
            },
            {
                key: 'wg-equipment',
                label: 'تجهیزات',
                to: '/warehouse-gtrabar/equipment',
                access: 'warehouse_gtrabar.equipment_view',
                icon: Truck,
            },
            {
                key: 'wg-part-trace',
                label: 'ردیابی قطعات',
                to: '/warehouse-gtrabar/part-trace',
                access: 'warehouse_gtrabar.part_trace_view',
                icon: GitBranch,
            },
        ],
    },

    {
        key: 'finance',
        label: 'مالی و حسابداری',
        icon: DollarSign,
        access: 'finance.view',
        children: [
            {
                key: 'equipment-costs',
                label: 'گزارش هزینه تجهیزات',
                to: '/finance/equipment-costs',
                access: 'equipment_costs.view',
                icon: Truck,
            },
            {
                key: 'equipment-costs-compare',
                label: 'مقایسه هزینه تجهیزات',
                to: '/finance/equipment-costs/compare',
                access: 'equipment_costs.view',
                icon: BarChart3,
            },
            {
                key: 'equipment-costs-analysis',
                label: 'تحلیل هزینه‌ها',
                to: '/finance/equipment-costs/analysis',
                access: 'equipment_costs.manage',
                icon: Wrench,
            },

        ],
    },




];