import { createRouter, createWebHistory } from 'vue-router'
import LoginViewold from '../views/Auth/LoginViewold.vue'
import ForgotPasswordViewold from '../views/Auth/ForgotPasswordViewold.vue'
import Dashbord from '../views/User/Dashboard.vue'
import UsersView from '@/views/User/UsersView.vue'
import DashbordLayout from '@/components/layouts/DashboardLayout.vue'
import ForbiddenPage from '@/views/ForbiddenPage.vue'

import { useAuthStore } from '@/stores/authold.js'
import RoleList from "@/views/User/RoleList.vue";
import ContractorsList from "@/views/Contract/ContractList.vue";
import CategoryList from "@/views/Warehouse/CategoryList.vue";
import MaterialList from "@/views/Warehouse/MaterialList.vue";
import PayslipShow from "@/views/Payroll/PayslipShow.vue";
import AdminPayslips from "@/views/Payroll/AdminPayslips.vue";
import AttendanceManagement from "@/views/Attendance/AttendanceManagement.vue";
import LibraryBooks from "@/views/Library/LibraryBooks.vue";
import BookDetails from "@/views/Library/BookDetails.vue";
import MyReservations from "@/views/Library/MyReservations.vue";
import MyNotifications from "@/views/Library/MyNotifications.vue";
import LibraryDashboard from "@/views/Library/LibraryDashboard.vue";
import ManageBooks from "@/views/Library/ManageBooks.vue";
import ManageReservations from  "@/views/Library/ManageReservations.vue"
import GroupsView from "@/views/Acl/GroupsView.vue"




const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/dashboard' },

        {
            path: '/login',
            name: 'login',
            component: LoginViewold,
            meta: { requiresGuest: true },
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: ForgotPasswordViewold,
            meta: { requiresGuest: true },
        },

        {
            path: '/',
            component: DashbordLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    component: () => import('@/views/Dashboard/Dashboard.vue'),
                    meta: {title:'صفحه اصلی', requiresAuth: true }
                },
                {
                    path: 'users',
                    name: 'users.index',
                    component: UsersView,
                    meta: {title:'کاربران', permission: 'users.read' },
                },
                {
                    path: '403',
                    name: 'forbidden',
                    component: ForbiddenPage,
                },
                {
                    path: '/contracts',
                    name: 'contracts.index',
                    component: () => import('@/views/Contract/ContractList.vue'),
                    meta: {title:'قراردادها', requiresAuth: true }
                },
                {
                    path: '/contracts/:id',
                    name: 'contracts.detail',
                    component: () => import('@/views/Contract/ContractDetail.vue'),
                    meta: {title:'قراردادها', requiresAuth: true }
                },
                {
                    path: 'roles',
                    name: 'roles.index',
                    component: RoleList,
                    meta: {title:'نقش ها', permission: 'roles.read' },
                },
                {
                    path: '/projects',
                    name: 'projects.index',
                    component: () => import('@/views/projects/ProjectList.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/projects/:id',
                    name: 'projects.detail',
                    component: () => import('@/views/projects/ProjectDetail.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/companies',
                    name: 'companies.index',
                    component: () => import('@/views/Company/CompanyList.vue'),
                    //meta: { permission: 'companies.read' },
                },
                // ============ ✅ مدیریت انبار ============
                // لیست کالاها
                {
                    path: 'inventory',
                    name: 'inventory.index',
                    component: MaterialList,
                    meta: {title:'لیست کالاها', requiresAuth: true }
                },
                // دسته‌بندی کالاها
                {
                    path: 'inventory/categories',
                    name: 'inventory.categories',
                    component: CategoryList,
                    meta: {title:'دسته‌بندی کالاها', requiresAuth: true }
                },
                // تراکنش‌های انبار
                {
                    path: 'inventory/transactions',
                    name: 'inventory.transactions',
                    component: () => import('@/views/Warehouse/TransactionList.vue'),
                    meta: { requiresAuth: true }
                },
                // گزارش موجودی
                {
                    path: 'inventory/stock',
                    name: 'inventory.stock',
                    component: () => import('@/views/Warehouse/StockReport.vue'),
                    meta: {title:'گزارش موجودی', requiresAuth: true }
                },

                // گزارش موجودی کم
                {
                    path: 'inventory/low-stock',
                    name: 'inventory.low-stock',
                    component: () => import('@/views/Warehouse/LowStockReport.vue'),
                    meta: {title:'گزارش موجودی کم', requiresAuth: true }
                },
                // گزارش مصرف
                {
                    path: 'inventory/consumption',
                    name: 'inventory.consumption',
                    component: () => import('@/views/Warehouse/ConsumptionReport.vue'),
                    meta: {title: 'گزارش مصرف', requiresAuth: true }
                },

                //Payroll
                {
                    path: '/payroll/payslip',
                    name: 'payroll.payslip',
                    component: PayslipShow,
                    meta: {
                        title: 'فیش حقوقی',
                        requiresAuth: true,
                        permission: 'Payroll.view',
                        icon: 'pi pi-file',
                    },
                },
                {
                    path: '/payroll/admin',
                    name: 'payroll.admin',
                    component: AdminPayslips,
                    meta: {
                        title: 'مدیریت فیش حقوقی',
                        requiresAuth: true,
                        permission: 'AdminPayroll.view',
                        icon: 'pi pi-users',
                    },
                },

                //Control Tradod
                {
                    path: '/attendance/management',
                    name: 'attendance.management',
                    component: AttendanceManagement,
                    meta: {
                        title: 'مدیریت تردد پرسنل',
                        requiresAuth: true,
                        permission: 'AdminHr.view',
                        icon: 'pi pi-users',
                    },
                },

                // Labrari Rout
                {
                    path: '/library',
                    name: 'library.books',
                    component: LibraryBooks,
                    meta: { title: 'کتابخانه', requiresAuth: true, permission: 'library.view' },
                },
                {
                    path: '/library/books/:id',
                    name: 'library.book.details',
                    component: BookDetails,
                    meta: { title: 'جزئیات کتاب', requiresAuth: true, permission: 'library.view' },
                },
                {
                    path: '/library/my-reservations',
                    name: 'library.my-reservations',
                    component: MyReservations,
                    meta: { title: 'رزروهای من', requiresAuth: true, permission: 'library.view' },
                },
                {
                    path: '/library/my-notifications',
                    name: 'library.my-notifications',
                    component: MyNotifications,
                    meta: { title: 'اعلان‌های من', requiresAuth: true, permission: 'library.view' },
                },

                //Labrari Admin
                {
                    path: '/library/admin',
                    name: 'library.admin.dashboard',
                    component: LibraryDashboard,
                    meta: { title: 'داشبورد کتابخانه', requiresAuth: true, permission: 'librarystatistics.view' },
                },
                {
                    path: '/library/admin/books',
                    name: 'library.admin.books',
                    component: ManageBooks,
                    meta: { title: 'مدیریت کتاب‌ها', requiresAuth: true, permission: 'librarybooks.manage' },
                },
                {
                    path: '/library/admin/reservations',
                    name: 'library.admin.reservations',
                    component: ManageReservations,
                    meta: { title: 'مدیریت رزروها', requiresAuth: true, permission: 'libraryreservations.manage' },
                },

// =========================
// شکایات و پیشنهادات - پرسنل
// =========================

                {
                    path: '/complaints/my',
                    name: 'complaints.my',
                    component: () => import('@/views/Complaint/MyComplaints.vue'),
                    meta: {
                        title: 'شکایات من',
                        requiresAuth: true,
                        permission: 'complaints.read',
                        icon: 'pi pi-file'
                    }
                },

                {
                    path: '/complaints/create',
                    name: 'complaints.create',
                    component: () => import('@/views/Complaint/ComplaintForm.vue'),
                    meta: {
                        title: 'ثبت شکایت جدید',
                        requiresAuth: true,
                        permission: 'complaints.create',
                        icon: 'pi pi-plus'
                    }
                },

                {
                    path: '/complaints/:id(\\d+)',
                    name: 'complaints.show',
                    component: () => import('@/views/Complaint/ComplaintDetail.vue'),
                    meta: {
                        title: 'جزئیات شکایت',
                        requiresAuth: true,
                        permission: 'complaints.read',
                        icon: 'pi pi-file'
                    }
                },

                {
                    path: '/complaints/:id(\\d+)/edit',
                    name: 'complaints.edit',
                    component: () => import('@/views/Complaint/ComplaintForm.vue'),
                    meta: {
                        title: 'ویرایش شکایت',
                        requiresAuth: true,
                        permission: 'complaints.update',
                        icon: 'pi pi-pencil'
                    }
                },

// =========================
// شکایات و پیشنهادات - ادمین
// =========================

                {
                    path: '/complaints/admin',
                    name: 'complaints.admin.index',
                    component: () => import('@/views/Complaint/AdminComplaints.vue'),
                    meta: {
                        title: 'مدیریت شکایات',
                        requiresAuth: true,
                        permission: 'complaints.manage',
                        icon: 'pi pi-list'
                    }
                },

                {
                    path: '/complaints/admin/:id(\\d+)',
                    name: 'complaints.admin.show',
                    component: () => import('@/views/Complaint/AdminComplaintDetail.vue'),
                    meta: {
                        title: 'جزئیات شکایت - ادمین',
                        requiresAuth: true,
                        permission: 'complaints.manage',
                        icon: 'pi pi-file'
                    }
                },

                {
                    path: '/complaints/categories',
                    name: 'complaints.categories',
                    component: () => import('@/views/Complaint/CategoryManagement.vue'),
                    meta: {
                        title: 'دسته‌بندی شکایات',
                        requiresAuth: true,
                        permission: 'complaintcategories.read',
                        icon: 'pi pi-sitemap'
                    }
                },

                {
                    path: '/complaints/admin/dashboard',
                    name: 'complaints.admin.dashboard',
                    component: () => import('@/views/Complaint/ComplaintDashboard.vue'),
                    meta: {
                        title: 'داشبورد آماری شکایات',
                        requiresAuth: true,
                        permission: 'complaintstatistics.view',
                        icon: 'pi pi-chart-bar'
                    }
                },

                {
                    path: '/admin/complaint-managers',
                    name: 'admin.complaint-managers',
                    component: () => import('@/views/Complaint/ComplaintManagers.vue'),
                    meta: {
                        title: 'مدیریت مسئولین پیگیری شکایات',
                        requiresAuth: true,
                        permissions: ['complaintmanagers.read']
                    }
                },

                {
                    path: '/complaints/assigned-to-me',
                    name: 'complaints.assigned-to-me',
                    component: () => import('@/views/Complaint/AssignedComplaints.vue'),
                    meta: {
                        title: 'شکایات ارجاع‌شده به من',
                        requiresAuth: true,
                        permission: 'complaints.review',
                        icon: 'pi pi-inbox'
                    }
                },

                {
                    path: '/complaints/:id(\\d+)/reply',
                    name: 'complaints.reply',
                    component: () => import('@/views/Complaint/ComplaintReply.vue'),
                    meta: {
                        title: 'پاسخ به شکایت',
                        requiresAuth: true,
                        permission: 'complaints.reply',
                        icon: 'pi pi-comment'
                    }
                },


// ═══════ منابع انسانی ═══════
                {
                    path: '/hr/org-chart',
                    name: 'hr.org-chart',
                    component: () => import('@/views/HR/OrgChart.vue'),
                    meta: {
                        title: 'چارت سازمانی',
                        requiresAuth: true,
                        permission: 'hr.view',
                    },
                },
                // ✅ جدید — لیست پرسنل
                {
                    path: '/hr/employees',
                    name: 'hr.employees',
                    component: () => import('@/views/HR/EmployeeList.vue'),
                    meta: {
                        title: 'لیست پرسنل',
                        requiresAuth: true,
                        permission: 'hr.view',
                    },
                },
                // ✅ جدید — پروفایل کارمند
                {
                    path: '/hr/employees/:id',
                    name: 'hr.employee.profile',
                    component: () => import('@/views/HR/EmployeeProfile.vue'),
                    meta: {
                        title: 'پروفایل کارمند',
                        requiresAuth: true,
                        permission: 'hr.view',
                    },
                },
                {
                    path: '/hr/sync',
                    name: 'hr.sync',
                    component: () => import('@/views/HR/SyncManagement.vue'),
                    meta: {
                        title: 'مدیریت همگام‌سازی',
                        requiresAuth: true,
                        permission: 'hr.manage',
                    },
                },
                {
                    path: '/hr/org-structure',
                    name: 'hr.org-structure',
                    component: () => import('@/views/HR/OrgStructureManagement.vue'),
                    meta: {
                        title: 'مدیریت ساختار سازمانی',
                        requiresAuth: true,
                        permission: 'hr.manage',
                    },
                },

                // اضافه کردن به children های DashbordLayout:

// ═══════ دبیرخانه مجازی ═══════
                {
                    path: '/virtual-secretariat/my-requests',
                    name: 'vs.my-requests',
                    component: () => import('@/views/VirtualSecretariat/MyRequests.vue'),
                    meta: {
                        title: 'درخواست‌های من در دبیرخانه',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.view_requests',
                    },
                },
                {
                    path: '/virtual-secretariat/create',
                    name: 'vs.create',
                    component: () => import('@/views/VirtualSecretariat/CreateRequest.vue'),
                    meta: {
                        title: 'ثبت درخواست جدید',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.create_request',
                    },
                },
                {
                    path: '/virtual-secretariat/requests/:id',
                    name: 'vs.show',
                    component: () => import('@/views/VirtualSecretariat/RequestDetail.vue'),
                    meta: {
                        title: 'جزئیات درخواست',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.view_requests',
                    },
                },
                {
                    path: '/virtual-secretariat/admin/dashboard',
                    name: 'vs.admin.dashboard',
                    component: () => import('@/views/VirtualSecretariat/AdminDashboard.vue'),
                    meta: {
                        title: 'داشبورد دبیرخانه',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.view',
                    },
                },
                {
                    path: '/virtual-secretariat/admin/templates',
                    name: 'vs.admin.templates',
                    component: () => import('@/views/VirtualSecretariat/TemplateManagement.vue'),
                    meta: {
                        title: 'مدیریت قالب‌ها',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.manage_templates',
                    },
                },
                {
                    path: '/virtual-secretariat/admin/requests',
                    name: 'vs.admin.requests',
                    component: () => import('@/views/VirtualSecretariat/AdminRequests.vue'),
                    meta: {
                        title: 'همه درخواست‌ها',
                        requiresAuth: true,
                        permission: 'virtual_secretariat.manage',
                    },
                },
                {
                    path: '/virtual-secretariat/workflow-dashboard',
                    name: 'vs.workflow-dashboard',
                    component: () => import('@/views/VirtualSecretariat/WorkflowDashboard.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'داشبورد فرآیندها',
                        permission: 'virtual_secretariat.manage',

                    }
                },

// ═══════ پروفایل کاربر ═══════
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/User/Profile.vue'),
                    meta: {
                        title: 'پروفایل من',
                        requiresAuth: true,
                    },
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/views/User/Settings.vue'),
                    meta: {
                        title: 'تنظیمات',
                        requiresAuth: true,
                    },
                },

// ═══════════════════════════════════════════════════
// ماژول ارزیابی شایستگی
// ═══════════════════════════════════════════════════
                {
                    path: '/assessment',
                    name: 'assessment.dashboard',
                    component: () => import('@/views/Assessment/AssessmentDashboard.vue'),
                    meta: {
                        title: 'داشبورد ارزیابی',
                        requiresAuth: true,
                        access: 'assessment.view'
                    },
                },
                {
                    path: '/assessment/profiles',
                    name: 'assessment.profiles',
                    component: () => import('@/views/Assessment/AssessmentProfiles.vue'),
                    meta: {
                        title: 'شناسنامه‌های شایستگی',
                        requiresAuth: true,
                        access: 'assessment.manage'
                    },
                },
                {
                    path: '/assessment/profiles/:id',
                    name: 'assessment.profile-editor',
                    component: () => import('@/views/Assessment/AssessmentProfileEditor.vue'),
                    meta: {
                        title: 'ویرایش شناسنامه',
                        requiresAuth: true,
                        access: 'assessment.manage'
                    },
                },
                {
                    path: '/assessment/tasks',
                    name: 'assessment.tasks',
                    component: () => import('@/views/Assessment/AssessmentTasks.vue'),
                    meta: {
                        title: 'ارزیابی‌های من',
                        requiresAuth: true,
                        access: 'assessment.evaluate'
                    },
                },
                {
                    path: '/assessment/auto-assign',
                    name: 'assessment.auto-assign',
                    component: () => import('@/views/Assessment/AssessmentAutoAssign.vue'),
                    meta: {
                        title: 'تخصیص خودکار',
                        requiresAuth: true,
                        access: 'assessment.manage'
                    },
                },
                {
                    path: '/assessment/methods',
                    name: 'assessment.methods',
                    component: () => import('@/views/Assessment/AssessmentMethods.vue'),
                    meta: {
                        title: 'روش‌های رفع خلا',
                        requiresAuth: true,
                        access: 'assessment.view'
                    },
                },
                {
                    path: '/assessment/assessments/:id/form',
                    name: 'assessment.form',
                    component: () => import('@/views/Assessment/AssessmentForm.vue'),
                    meta: {
                        title: 'فرم ارزیابی',
                        requiresAuth: true,
                        permission: 'assessment.evaluate',
                    },
                },
                {
                    path: '/assessment/my-report',
                    name: 'assessment.my-report',
                    component: () => import('@/views/Assessment/MyAssessmentReport.vue'),
                    meta: {
                        title: 'کارنامه شایستگی من',
                        requiresAuth: true,
                        access: 'assessment.view'
                    },
                },
                {
                    path: '/assessment/mappings',
                    name: 'assessment.mappings',
                    component: () => import('@/views/Assessment/AssessmentMappings.vue'),
                    meta: {
                        title: 'نگاشت دستی شناسنامه‌ها',
                        requiresAuth: true,
                        permission: 'assessment.manage'
                    },
                },

                //Sitteng System

                {
                    path: '/system-settings/database-connections',
                    name: 'database-connections',
                    component: () => import('@/views/User/DatabaseConnections.vue'),
                    meta: {
                        title: 'مدیریت اتصالات دیتابیس',
                        requiresAuth: true,
                        permission: 'system_settings.manage_database',
                    },
                },


                {
                    path: '/assessment/methods',
                    name: 'assessment.methods',
                    component: () => import('@/views/Assessment/AssessmentMethods.vue'),
                    meta: { title: 'روش‌های رفع خلا', requiresAuth: true, permission: 'assessment.manage' },
                },

                {
                    path: '/assessment/my-report',
                    name: 'assessment/my-report',
                    component: () => import('@/views/Assessment/MyAssessmentReport.vue'),
                    meta: { title: 'روش‌های رفع خلا', requiresAuth: true, permission: 'assessment.manage' },
                },
                //Group
                {
                    path: 'groups',
                    name: 'groups.index',
                    component: GroupsView,
                    meta: { title: 'گروه‌های کاربری', permission: 'groups.read' },
                },
                {
                    path: '/assessment/auto-assign',
                    name: 'assessment.auto-assign',
                    component: () => import('@/views/Assessment/AssessmentAutoAssign.vue'),
                    meta: { title: 'تخصیص خودکار شایستگی', requiresAuth: true, permission: 'assessment.manage' },
                },


                // ═══════════════════════════════════════
// Warehouse Gtrabar Routes
// ═══════════════════════════════════════
                {
                    path: '/warehouse-gtrabar',
                    name: 'warehouse-gtrabar',
                    meta: {
                        title: 'انبار (Gtrabar)',
                        requiresAuth: true,
                        permission: 'warehouse_gtrabar.view'
                    },
                    children: [
                        // موجودی انبار
                        {
                            path: 'stock',
                            name: 'wg.stock',
                            component: () => import('@/views/WarehouseGtrabar/StockList.vue'),
                            meta: {
                                title: 'موجودی انبار',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.stock_view',
                            },
                        },
                        // تجهیزات
                        {
                            path: 'equipment',
                            name: 'wg.equipment',
                            component: () => import('@/views/WarehouseGtrabar/EquipmentList.vue'),
                            meta: {
                                title: 'تجهیزات',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.equipment_view',
                            },
                        },
                        {
                            path: 'equipment/create',
                            name: 'wg.equipment.create',
                            component: () => import('@/views/WarehouseGtrabar/EquipmentForm.vue'),
                            meta: {
                                title: 'ایجاد تجهیز',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.equipment_manage',
                            },
                        },
                        {
                            path: 'equipment/:id/edit',
                            name: 'wg.equipment.edit',
                            component: () => import('@/views/WarehouseGtrabar/EquipmentForm.vue'),
                            meta: {
                                title: 'ویرایش تجهیز',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.equipment_manage',
                            },
                        },
                        // ردیابی قطعات
                        {
                            path: 'part-trace',
                            name: 'wg.part-trace',
                            component: () => import('@/views/WarehouseGtrabar/PartTraceList.vue'),
                            meta: {
                                title: 'ردیابی قطعات',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.part_trace_view',
                            },
                        },
                        {
                            path: 'part-trace/install',
                            name: 'wg.part-trace.install',
                            component: () => import('@/views/WarehouseGtrabar/PartInstallationForm.vue'),
                            meta: {
                                title: 'نصب قطعه',
                                requiresAuth: true,
                                permission: 'warehouse_gtrabar.part_trace_manage',
                            },
                        },

                        // ═══════ ماژول مالی - گزارش هزینه تجهیزات ═══════
                        {
                            path: '/finance/equipment-costs',
                            name: 'finance.equipment-costs',
                            component: () => import('@/views/Finance/EquipmentCostReport.vue'),
                            meta: {
                                title: 'گزارش هزینه تجهیزات',
                                requiresAuth: true,
                                permission: 'equipment_costs.view',
                            },
                        },
                        // {
                        //     path: '/finance/equipment-costs/compare',
                        //     name: 'finance.equipment-costs.compare',
                        //     component: () => import('@/views/Finance/EquipmentCostCompare.vue'),
                        //     meta: {
                        //         title: 'مقایسه هزینه تجهیزات',
                        //         requiresAuth: true,
                        //         permission: 'equipment_costs.view',
                        //     },
                        // },
                        // {
                        //     path: '/finance/equipment-costs/analysis',
                        //     name: 'finance.equipment-costs.analysis',
                        //     component: () => import('@/views/Finance/EquipmentCostAnalysis.vue'),
                        //     meta: {
                        //         title: 'تحلیل هزینه‌ها',
                        //         requiresAuth: true,
                        //         permission: 'equipment_costs.manage',
                        //     },
                        // },

                        {
                            path: '/finance/equipment-access',
                            name: 'finance.equipment-access',
                            component: () => import('@/views/User/EquipmentAccessManagement.vue'),
                            meta: {
                                title: 'مدیریت دسترسی تجهیزات',
                                requiresAuth: true,
                                permission: 'equipment_costs.manage',
                            },
                        },


                    ],
                },

            ],
        },
    ],
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()


    if (auth.token && !auth.loaded) {
        try {
            if (typeof auth.initAuth === 'function') {
                await auth.initAuth()
            } else {
                await auth.fetchMe()
            }
        } catch (e) {
            // اگر fetchMe خطا دهد:
            // - اگر 401 باشد interceptor معمولاً clearAuth می‌کند
            // - اگر interceptor نداری، fetchMe خودت باید 401 را clearAuth کند
            // اینجا کاری نمی‌کنیم تا guard با state فعلی تصمیم بگیرد
        }
    } else if (!auth.token && !auth.loaded) {
        // اگر token نداریم، loaded را true کن تا guard دفعه بعد منتظر init نباشد
        auth.loaded = true
    }

    const isGuestOnly = !!to.meta.requiresGuest
    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)

    // 2) guest-only: اگر لاگین است، نگذار وارد login/forgot شود
    if (isGuestOnly && auth.token) {
        return { name: 'Dashboard' }
    }

    // 3) requiresAuth: اگر توکن ندارد => login + redirect
    if (requiresAuth && !auth.token) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    // 4) permission check (از matched برای حالت‌های nested)
    const requiredPermission =
        [...to.matched]
            .reverse()
            .find((r) => r.meta && r.meta.permission)?.meta.permission || null

    if (requiredPermission) {
        // اگر هنوز user لود نشده، منطقی نیست permission چک کنی
        // ولی چون بالا initAuth زدیم، معمولاً user آماده است
        if (!auth.can(requiredPermission)) {
            return { name: 'forbidden' }
        }
    }

    return true
})

export default router
