import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/Auth/LoginView.vue';
import ForgotPasswordView from '@/views/Auth/ForgotPasswordView.vue';
import DashboardLayout from '@/components/layouts/DashboardLayout.vue';
import UsersView from '@/views/User/UsersView.vue';
import ForbiddenPage from '@/views/ForbiddenPage.vue';
import RoleList from '@/views/User/RoleList.vue';
import PayslipShow from '@/views/Payroll/PayslipShow.vue';
import AdminPayslips from '@/views/Payroll/AdminPayslips.vue';
import GroupsView from '@/views/Acl/GroupsView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    redirect: '/dashboard'
  }, {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresGuest: true
    }
  }, {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: {
      requiresGuest: true
    }
  }, {
    path: '/',
    component: DashboardLayout,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/Dashboard.vue'),
      meta: {
        title: 'صفحه اصلی',
        requiresAuth: true
      }
    }, {
      path: 'users',
      name: 'users.index',
      component: UsersView,
      meta: {
        title: 'کاربران',
        permission: 'users.read'
      }
    }, {
      path: '403',
      name: 'forbidden',
      component: ForbiddenPage
    }, {
      path: 'roles',
      name: 'roles.index',
      component: RoleList,
      meta: {
        title: 'نقش ها',
        permission: 'roles.read'
      }
    }, {
      path: '/payroll/payslip',
      name: 'payroll.payslip',
      component: PayslipShow,
      meta: {
        title: 'فیش حقوقی',
        requiresAuth: true,
        permission: 'Payroll.view',
        icon: 'pi pi-file'
      }
    }, {
      path: '/payroll/admin',
      name: 'payroll.admin',
      component: AdminPayslips,
      meta: {
        title: 'مدیریت فیش حقوقی',
        requiresAuth: true,
        permission: 'AdminPayroll.view',
        icon: 'pi pi-users'
      }
    }, {
      path: '/hr/org-chart',
      name: 'hr.org-chart',
      component: () => import('@/views/HR/OrgChart.vue'),
      meta: {
        title: 'چارت سازمانی',
        requiresAuth: true,
        permission: 'hr.view'
      }
    }, {
      path: '/hr/employees',
      name: 'hr.employees',
      component: () => import('@/views/HR/EmployeeList.vue'),
      meta: {
        title: 'لیست پرسنل',
        requiresAuth: true,
        permission: 'hr.view'
      }
    }, {
      path: '/hr/employees/:id',
      name: 'hr.employee.profile',
      component: () => import('@/views/HR/EmployeeProfile.vue'),
      meta: {
        title: 'پروفایل کارمند',
        requiresAuth: true,
        permission: 'hr.view'
      }
    }, {
      path: '/hr/sync',
      name: 'hr.sync',
      component: () => import('@/views/HR/SyncManagement.vue'),
      meta: {
        title: 'مدیریت همگام‌سازی',
        requiresAuth: true,
        permission: 'hr.manage'
      }
    }, {
      path: '/hr/org-structure',
      name: 'hr.org-structure',
      component: () => import('@/views/HR/OrgStructureManagement.vue'),
      meta: {
        title: 'مدیریت ساختار سازمانی',
        requiresAuth: true,
        permission: 'hr.manage'
      }
    }, {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/User/Profile.vue'),
      meta: {
        title: 'پروفایل من',
        requiresAuth: true
      }
    }, {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/User/Settings.vue'),
      meta: {
        title: 'تنظیمات',
        requiresAuth: true
      }
    }, {
      path: 'groups',
      name: 'groups.index',
      component: GroupsView,
      meta: {
        title: 'گروه‌های کاربری',
        permission: 'groups.read'
      }
    }]
  }, {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue')
  }]
});
router.beforeEach(async to => {
  const auth = useAuthStore();
  if (!auth.loaded) await auth.initAuth();
  if (to.meta.requiresGuest && auth.token) return {
    name: 'Dashboard'
  };
  if (to.matched.some(record => record.meta.requiresAuth) && !auth.token) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    };
  }
  const permissions = to.matched.map(record => record.meta.permission).filter(Boolean);
  if (permissions.some(permission => !auth.can(permission))) return {
    name: 'forbidden'
  };
  return true;
});
export default router;
