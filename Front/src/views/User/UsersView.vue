<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-6">
    <!-- هدر صفحه -->
    <div class="page-card bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users class="w-8 h-8 text-blue-600" />
            مدیریت کاربران
          </h1>
          <p class="text-gray-500 mt-2 text-sm">
            مدیریت و نظارت بر کاربران سیستم
          </p>
        </div>
        <div class="flex gap-3">
          <Button
              v-if="can('users.export')"
              label="خروجی Excel"
              icon="pi pi-file-excel"
              severity="success"
              outlined
              @click="exportToExcel"
          />
          <Button
              v-if="can('users.create')"
              label="کاربر جدید"
              icon="pi pi-plus"
              @click="openNew"
              class="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </div>

    <!-- 🔑 بخش جستجو و فیلتر -->
    <div class="page-card bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- جستجو -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            جستجو
          </label>
          <div class="relative">
            <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <InputText
                v-model="searchQuery"
                placeholder="جستجو بر اساس نام، موبایل، کد ملی یا کد پرسنلی..."
                class="w-full pr-10"
                @input="onSearchInput"
            />
            <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- فیلتر بر اساس نقش -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🎭 فیلتر بر اساس نقش
          </label>
          <Select
              v-model="roleFilter"
              :options="availableRoles"
              optionLabel="name"
              optionValue="name"
              placeholder="همه نقش‌ها"
              class="w-full"
              showClear
              @change="onFilterChange"
          />
        </div>
      </div>

      <!-- نمایش فیلترهای فعال -->
      <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-600">فیلترهای فعال:</span>
          <Tag
              v-if="searchQuery"
              :value="`جستجو: ${searchQuery}`"
              severity="info"
              icon="pi pi-times"
              @click="searchQuery = ''"
              class="cursor-pointer"
          />
          <Tag
              v-if="roleFilter"
              :value="`نقش: ${roleFilter}`"
              severity="success"
              icon="pi pi-times"
              @click="roleFilter = null"
              class="cursor-pointer"
          />
          <Button
              label="پاک کردن همه"
              icon="pi pi-filter-slash"
              size="small"
              text
              @click="clearFilters"
          />
        </div>
      </div>
    </div>

    <!-- آمار کاربران -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ filteredUsers.length }}</div>
            <div class="text-sm text-gray-500">کاربران نمایش داده شده</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UserCheck class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ totalRecords }}</div>
            <div class="text-sm text-gray-500">کل کاربران</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ adminUsersCount }}</div>
            <div class="text-sm text-gray-500">مدیران سیستم</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <UserPlus class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ newUsersThisMonth }}</div>
            <div class="text-sm text-gray-500">کاربران جدید این ماه</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔑 جدول کاربران با جستجوی سمت کلاینت -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <DataTable
          v-if="can('users.read')"
          :value="users"
          lazy
          paginator
          responsiveLayout="scroll"
          :rows="rows"
          :totalRecords="totalRecords"
          :loading="loading"
          @page="onPage"
          stripedRows
          class="users-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-gray-800">
              لیست کاربران ({{ filteredUsers.length }} از {{ totalRecords }} نفر)
            </span>
            <div v-if="loading" class="text-sm text-gray-500">
              در حال بارگذاری...
            </div>
          </div>
        </template>

        <Column field="name" header="نام و نام خانوادگی"  style="min-width: 200px">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <Avatar
                  :label="getInitials(slotProps.data.name)"
                  shape="circle"
                  size="large"
                  class="user-avatar"
              />
              <div class="min-w-0">
                <div class="font-semibold text-slate-800 truncate">
                  {{ slotProps.data.name || 'بدون نام' }}
                </div>
                <div class="text-xs text-slate-500 mt-1 truncate">
                  {{ slotProps.data.email || slotProps.data.unit_title || 'بدون اطلاعات تکمیلی' }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column field="mobile" header="موبایل"  style="min-width: 130px">
          <template #body="slotProps">
            <div class="flex items-center gap-2" dir="ltr">
              <Phone class="w-4 h-4 text-gray-400" />
              <span class="font-mono text-sm">{{ slotProps.data.mobile }}</span>
            </div>
          </template>
        </Column>

        <Column field="national_code" header="کد ملی"  style="min-width: 120px">
          <template #body="slotProps">
            <div class="flex items-center gap-2" dir="ltr">
              <CreditCard class="w-4 h-4 text-gray-400" />
              <span class="font-mono text-sm">{{ slotProps.data.national_code }}</span>
            </div>
          </template>
        </Column>

        <Column field="personnel_code" header="کد پرسنلی"  style="min-width: 120px">
          <template #body="slotProps">
            <Badge
                :value="slotProps.data.personnel_code || '-'"
                severity="secondary"
                class="font-mono"
            />
          </template>
        </Column>

        <Column header="واحد سازمانی" style="min-width: 180px">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <span class="table-icon-box unit">
                <i class="pi pi-building"></i>
              </span>
              <span class="text-sm text-slate-700">
                {{ slotProps.data.unit_title || '-' }}
              </span>
            </div>
          </template>
        </Column>


        <Column header="نوع کاربر" style="min-width: 120px">
          <template #body="slotProps">
            <Tag
                v-if="slotProps.data.employee_type === 'contractor'"
                value="پیمانکار"
                severity="warning"
            />

            <Tag
                v-else
                value="پرسنل"
                severity="success"
            />
          </template>
        </Column>

        <Column header="وضعیت" style="min-width: 110px">
          <template #body="slotProps">
            <Tag
                :value="slotProps.data.is_active ? 'فعال' : 'غیرفعال'"
                :severity="slotProps.data.is_active ? 'success' : 'danger'"
            />
          </template>
        </Column>

        <Column header="عملیات" style="min-width: 150px" frozen alignFrozen="left">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                  v-if="can('users.view')"
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info p-button-text"
                  @click="viewUser(slotProps.data)"
                  tooltip="مشاهده"
              />
              <Button
                  v-if="can('users.update')"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success p-button-text"
                  @click="editUser(slotProps.data)"
                  tooltip="ویرایش"
              />
              <Button
                  v-if="can('users.delete')"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="confirmDelete(slotProps.data)"
                  tooltip="حذف"
              />
            </div>
          </template>
        </Column>

      </DataTable>

      <!-- پیام عدم دسترسی -->
      <div v-else class="p-12 text-center">
        <Lock class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-600 mb-2">دسترسی محدود</h3>
        <p class="text-gray-500">شما مجاز به مشاهده لیست کاربران نیستید</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         مودال افزودن/ویرایش کاربر
         ═══════════════════════════════════════════════════════ -->
    <Dialog
        v-model:visible="userDialog"
        :header="isEdit ? 'ویرایش کاربر' : 'کاربر جدید'"
        :modal="true"
        :closable="true"
        :draggable="false"
        class="user-dialog-modern"
        :breakpoints="{ '992px': '90vw', '576px': '95vw' }"
        style="width: 560px"
    >
      <template #header>
        <div class="dialog-header-custom">
          <div class="header-icon-wrapper">
            <User class="header-icon" />
          </div>
          <div class="header-text">
            <h2 class="header-title">{{ isEdit ? 'ویرایش کاربر' : 'کاربر جدید' }}</h2>
            <p class="header-subtitle">{{ isEdit ? 'ویرایش اطلاعات کاربر' : 'ایجاد حساب کاربری جدید' }}</p>
          </div>
        </div>
      </template>

      <div class="dialog-body">
        <div class="form-grid">
          <!-- نام -->
          <div class="form-group full-width">
            <label for="name" class="form-label">
              <User class="label-icon" />
              نام و نام خانوادگی
              <span class="required">*</span>
            </label>
            <InputText
                id="name"
                v-model.trim="user.name"
                required
                autofocus
                :class="{ 'p-invalid': errors.name }"
                placeholder="نام کامل را وارد کنید"
                class="form-input"
            />
            <small class="error-message" v-if="errors.name">{{ errors.name }}</small>
          </div>

          <!-- موبایل -->
          <div class="form-group">
            <label for="mobile" class="form-label">
              <Phone class="label-icon" />
              شماره موبایل
              <span class="required">*</span>
            </label>
            <div class="input-with-icon">
              <Phone class="input-icon" />
              <InputText
                  id="mobile"
                  v-model.trim="user.mobile"
                  required
                  dir="ltr"
                  :class="{ 'p-invalid': errors.mobile || frontErrors.mobile }"
                  placeholder="09123456789"
                  class="form-input"
              />
            </div>
            <small class="error-message" v-if="frontErrors.mobile">{{ frontErrors.mobile }}</small>
            <small class="error-message" v-else-if="errors.mobile">{{ errors.mobile }}</small>
          </div>

          <!-- کد ملی -->
          <div class="form-group">
            <label for="national_code" class="form-label">
              <CreditCard class="label-icon" />
              کد ملی
              <span class="required">*</span>
            </label>
            <div class="input-with-icon">
              <CreditCard class="input-icon" />
              <InputText
                  id="national_code"
                  v-model.trim="user.national_code"
                  required
                  dir="ltr"
                  :class="{ 'p-invalid': errors.national_code }"
                  placeholder="کد ملی 10 رقمی"
                  class="form-input"
              />
            </div>
            <small class="error-message" v-if="errors.national_code">{{ errors.national_code }}</small>
          </div>

          <!-- کد پرسنلی -->
          <div class="form-group">
            <label for="personnel_code" class="form-label">
              <Briefcase class="label-icon" />
              کد پرسنلی
              <span class="required">*</span>
            </label>
            <div class="input-with-icon">
              <Briefcase class="input-icon" />
              <InputText
                  id="personnel_code"
                  v-model.trim="user.personnel_code"
                  required
                  dir="ltr"
                  :class="{ 'p-invalid': errors.personnel_code }"
                  placeholder="کد پرسنلی"
                  class="form-input"
              />
            </div>
            <small class="error-message" v-if="errors.personnel_code">{{ errors.personnel_code }}</small>
          </div>

          <!-- رمز عبور -->
          <div class="form-group" v-if="!isEdit">
            <label for="password" class="form-label">
              <Lock class="label-icon" />
              رمز عبور
              <span class="required">*</span>
            </label>
            <Password
                id="password"
                v-model="user.password"
                required
                :toggleMask="true"
                :feedback="true"
                placeholder="رمز عبور را وارد کنید"
                :class="{ 'p-invalid': errors.password }"
                class="form-input password-input"
                inputClass="w-full"
            />
            <small class="error-message" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <!-- نقش‌ها -->
          <div class="form-group full-width">
            <label class="form-label">
              <Shield class="label-icon" />
              نقش‌های کاربر
              <span class="required">*</span>
            </label>
            <div class="roles-grid">
              <div
                  v-for="role in availableRoles"
                  :key="role.id"
                  class="role-card"
                  :class="{ 'is-selected': user.roles.includes(role.name) }"
                  @click="toggleRole(role.name)"
              >
                <input
                    type="checkbox"
                    :id="'role_' + role.id"
                    :value="role.name"
                    v-model="user.roles"
                    class="role-checkbox"
                    @click.stop
                />
                <div class="role-content">
                  <div class="role-icon-wrapper">
                    <Shield v-if="role.name.toLowerCase().includes('admin')" class="role-icon admin" />
                    <User v-else class="role-icon user" />
                  </div>
                  <label :for="'role_' + role.id" class="role-label">
                    {{ role.name }}
                  </label>
                </div>
              </div>
            </div>
            <small class="error-message" v-if="errors.roles">{{ errors.roles }}</small>
          </div>

          <!-- وضعیت حساب -->
          <div class="form-group full-width">
            <label class="form-label">
              <Activity class="label-icon" />
              وضعیت حساب کاربری
            </label>
            <div class="status-card" :class="{ 'is-active': user.is_active, 'is-inactive': !user.is_active }">
              <div class="status-info">
                <div class="status-icon-wrapper" :class="user.is_active ? 'active' : 'inactive'">
                  <UserCheck v-if="user.is_active" class="status-icon" />
                  <Lock v-else class="status-icon" />
                </div>
                <div class="status-text">
                  <div class="status-title">
                    {{ user.is_active ? 'کاربر فعال است' : 'کاربر غیرفعال است' }}
                  </div>
                  <div class="status-description">
                    {{ user.is_active ? 'کاربر می‌تواند وارد سیستم شود' : 'کاربر امکان ورود به سیستم را ندارد' }}
                  </div>
                </div>
              </div>
              <Checkbox
                  v-model="user.is_active"
                  :binary="true"
                  inputId="is_active"
                  :disabled="user.employee_type === 'contractor'"
                  class="status-checkbox"
              />
            </div>
            <small v-if="user.employee_type === 'contractor'" class="contractor-warning">
              <AlertTriangle class="warning-icon" />
              پیمانکاران امکان ورود به سیستم ندارند و نمی‌توان آن‌ها را فعال کرد.
            </small>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button
              label="انصراف"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="hideDialog"
              class="btn-cancel"
          />
          <Button
              label="ذخیره"
              icon="pi pi-check"
              @click="saveUser"
              :loading="saving"
              class="btn-save"
          />
        </div>
      </template>
    </Dialog>

    <!-- ═══════════════════════════════════════════════════════
         مودال مشاهده کاربر
         ═══════════════════════════════════════════════════════ -->
    <Dialog
        v-model:visible="viewDialog"
        header="اطلاعات کاربر"
        :modal="true"
        :closable="true"
        :draggable="false"
        class="user-view-dialog"
        :breakpoints="{ '992px': '90vw', '576px': '95vw' }"
        style="width: 560px"
    >
      <template #header>
        <div class="dialog-header-custom">
          <div class="header-icon-wrapper view">
            <Eye class="header-icon" />
          </div>
          <div class="header-text">
            <h2 class="header-title">اطلاعات کاربر</h2>
            <p class="header-subtitle">مشاهده جزئیات حساب کاربری</p>
          </div>
        </div>
      </template>

      <div v-if="selectedUser" class="view-dialog-body">
        <!-- پروفایل -->
        <div class="profile-card">
          <div class="profile-avatar">
            <span class="avatar-text">{{ getInitials(selectedUser.name) }}</span>
          </div>
          <div class="profile-info">
            <h3 class="profile-name">{{ selectedUser.name }}</h3>
            <p class="profile-email">
              <Mail class="email-icon" />
              {{ selectedUser.email || 'بدون ایمیل' }}
            </p>
          </div>
        </div>

        <!-- اطلاعات اصلی -->
        <div class="info-grid">
          <div class="info-card mobile">
            <div class="info-icon-wrapper">
              <Phone class="info-icon" />
            </div>
            <div class="info-content">
              <div class="info-label">شماره موبایل</div>
              <div class="info-value" dir="ltr">{{ selectedUser.mobile }}</div>
            </div>
          </div>

          <div class="info-card national">
            <div class="info-icon-wrapper">
              <CreditCard class="info-icon" />
            </div>
            <div class="info-content">
              <div class="info-label">کد ملی</div>
              <div class="info-value" dir="ltr">{{ selectedUser.national_code }}</div>
            </div>
          </div>

          <div class="info-card personnel">
            <div class="info-icon-wrapper">
              <Briefcase class="info-icon" />
            </div>
            <div class="info-content">
              <div class="info-label">کد پرسنلی</div>
              <div class="info-value" dir="ltr">{{ selectedUser.personnel_code }}</div>
            </div>
          </div>

          <div class="info-card date">
            <div class="info-icon-wrapper">
              <Calendar class="info-icon" />
            </div>
            <div class="info-content">
              <div class="info-label">تاریخ ثبت</div>
              <div class="info-value">{{ formatDate(selectedUser.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- نقش‌ها -->
        <div class="roles-section">
          <h4 class="section-title">
            <Shield class="section-icon" />
            نقش‌های کاربر
          </h4>
          <div class="roles-tags">
            <Tag
                v-for="roleName in getRoleNames(selectedUser)"
                :key="roleName"
                :value="roleName"
                :severity="getRoleSeverity(roleName)"
                class="role-tag"
            />
            <span v-if="getRoleNames(selectedUser).length === 0" class="role-empty">
              <i class="pi pi-shield"></i>
              بدون نقش
            </span>
          </div>
        </div>

        <!-- وضعیت‌ها -->
        <div class="status-grid">
          <div class="status-badge">
            <div class="badge-label">نوع کاربر</div>
            <div class="badge-value">
              <Tag
                  v-if="selectedUser.employee_type === 'contractor'"
                  value="پیمانکار"
                  severity="warning"
              />
              <Tag v-else value="پرسنل" severity="success" />
            </div>
          </div>
          <div class="status-badge">
            <div class="badge-label">وضعیت حساب</div>
            <div class="badge-value">
              <Tag
                  :value="selectedUser.is_active ? 'فعال' : 'غیرفعال'"
                  :severity="selectedUser.is_active ? 'success' : 'danger'"
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useApiErrorHandler } from '@/composables/useApiErrorHandler';
import api from '@/api/axios.js';
import { useAuthStore } from '@/stores/authold.js';
const confirm = useConfirm();
const rows = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const toast = useToast();
const { handleApiError } = useApiErrorHandler();
const users = ref([]);
const availableRoles = ref([]);
const loading = ref(false);
const saving = ref(false);
const userDialog = ref(false);
const viewDialog = ref(false);
const isEdit = ref(false);
const user = ref({ roles: [] });
const selectedUser = ref(null);
const errors = ref({});
const frontErrors = ref({});
const authStore = useAuthStore();

// 🔑 فیلترها
const searchQuery = ref('');
const roleFilter = ref(null);

let searchTimeout = null;

// 🔑 کامپیوتد برای فیلتر کردن کاربران سمت کلاینت
const filteredUsers = computed(() => {
  let result = users.value;

  // فیلتر جستجو
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(user => {
      return (
          user.name?.toLowerCase().includes(query) ||
          user.mobile?.includes(query) ||
          user.national_code?.includes(query) ||
          user.personnel_code?.includes(query)
      );
    });
  }

  // فیلتر نقش
  if (roleFilter.value) {
    result = result.filter(user => {
      return getRoleNames(user).some(roleName => roleName === roleFilter.value);
    });
  }

  return result;
});

// 🔑 صفحه‌بندی سمت کلاینت
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * rows.value;
  const end = start + rows.value;
  return filteredUsers.value.slice(start, end);
});

const hasActiveFilters = computed(() => {
  return searchQuery.value || roleFilter.value;
});

const activeUsersCount = computed(() => {
  return users.value.filter(u =>
      getRoleNames(u).some(roleName => roleName !== 'banned')
  ).length;
});

const adminUsersCount = computed(() => {
  return users.value.filter(u =>
      getRoleNames(u).some(roleName =>
          String(roleName).toLowerCase().includes('admin')
      )
  ).length;
});

const newUsersThisMonth = computed(() => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return users.value.filter(u => new Date(u.created_at) >= firstDayOfMonth).length;
});

onMounted(() => {
  loadUsers();
  loadRoles();
});

const can = (permission) => {
  return authStore.permissions?.includes(permission);
};

const loadRoles = async () => {
  try {
    const response = await api.get(`acl/roles/all`);
    availableRoles.value = response.data.data || response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست نقش‌ها', error);
  }
};

/**
 * یکسان‌سازی ساختار کاربر
 *
 * پاسخ فعلی API به شکل زیر است:
 * {
 *   personnel_code: "...",
 *   user: {
 *     name: "...",
 *     mobile: "...",
 *     national_code: "...",
 *     personnel_code: "...",
 *     employee_type: "...",
 *     is_active: true,
 *     ...
 *   },
 *   unit: { ... }
 * }
 *
 * DataTable قبلاً مستقیماً slotProps.data.name و ... را می‌خواند،
 * بنابراین چون name/mobile/national_code داخل data.user بودند،
 * سلول‌ها خالی نمایش داده می‌شدند.
 */
const normalizeUser = (item = {}) => {
  const nestedUser = item.user ?? {};

  const roles =
      item.roles ??
      nestedUser.roles ??
      nestedUser.role ??
      [];

  return {
    ...item,
    ...nestedUser,

    // مقادیر اصلی جدول
    id: nestedUser.id ?? item.user_id ?? item.id,
    user_id: nestedUser.id ?? item.user_id,
    name: nestedUser.name ?? item.name ?? '',
    mobile: nestedUser.mobile ?? item.mobile ?? '',
    national_code: nestedUser.national_code ?? item.national_code ?? '',
    personnel_code: nestedUser.personnel_code ?? item.personnel_code ?? '',
    email: nestedUser.email ?? item.email ?? null,
    employee_type: nestedUser.employee_type ?? item.employee_type ?? 'personnel',
    is_active: nestedUser.is_active ?? item.is_active ?? false,
    created_at: nestedUser.created_at ?? item.created_at ?? null,

    // نقش‌ها
    roles: Array.isArray(roles) ? roles : [],

    // اطلاعات سازمانی
    post_title: item.post_title ?? '',
    job_title: item.job_title ?? '',
    unit: item.unit ?? null,
    unit_title: item.unit?.title ?? '',

    // نگه‌داشتن پاسخ خام برای جاهایی که بعداً لازم می‌شود
    _raw: item,
  };
};

const getRoleNames = (user) => {
  if (!user?.roles || !Array.isArray(user.roles)) return [];

  return user.roles
      .map((role) => {
        if (typeof role === 'string') return role;
        return role?.name ?? role?.title ?? role?.label ?? null;
      })
      .filter(Boolean);
};

// 🔑 بارگذاری همه کاربران (بدون pagination سمت سرور)
const loadUsers = async (page = 1) => {
  loading.value = true;

  try {
    const params = {
      page,
      per_page: rows.value,
    };

    if (searchQuery.value?.trim()) {
      params.search = searchQuery.value.trim();
    }

    if (roleFilter.value) {
      params.role = roleFilter.value;
    }

    const response = await api.get(`/users`, { params });

    const rawUsers = response.data.data ?? [];

    // API فعلی اطلاعات هویتی را داخل user برمی‌گرداند.
    // DataTable برای نمایش صحیح، یک ساختار تخت و یکسان نیاز دارد.
    users.value = rawUsers.map((item) => normalizeUser(item));

    totalRecords.value = response.data.total ?? response.data.meta?.total ?? 0;
    currentPage.value = response.data.current_page ?? response.data.meta?.current_page ?? page;

    console.log('Normalized users:', users.value);
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// 🔑 مدیریت جستجو با debounce

const onSearchInput = () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    loadUsers(1);
  }, 400);
};

const onFilterChange = () => {
  loadUsers(1);
};

const clearFilters = () => {
  searchQuery.value = '';
  roleFilter.value = null;
  loadUsers(1);
};
const onPage = (event) => {
  loadUsers(event.page + 1);
};

const openNew = () => {
  if (!can('users.create')) {
    toast.add({ severity: 'warn', summary: 'اطلاع', detail: 'شما مجاز به این عمل نیستید', life: 3000 });
    return;
  }
  user.value = {
    name: '',
    mobile: '',
    national_code: '',
    personnel_code: '',
    password: '',
    roles: [],
    is_active: true,
    employee_type: 'personnel'
  };
  errors.value = {};
  frontErrors.value = {};
  isEdit.value = false;
  userDialog.value = true;
};

const viewUser = (data) => {
  selectedUser.value = data;
  viewDialog.value = true;
};

const editUser = (data) => {
  if (!can('users.update')) {
    toast.add({ severity: 'warn', summary: 'اطلاع', detail: 'شما مجاز به این عمل نیستید', life: 3000 });
    return;
  }

  const currentRoles = getRoleNames(data);

  user.value = {
    ...data,
    roles: currentRoles,
    employee_type: data.employee_type ?? 'personnel',

    /**
     * پیمانکار همیشه باید غیرفعال نمایش داده شود
     */
    is_active: data.employee_type === 'contractor'
        ? false
        : Boolean(data.is_active ?? true)
  };
  errors.value = {};
  frontErrors.value = {};
  isEdit.value = true;
  userDialog.value = true;
};

const hideDialog = () => {
  userDialog.value = false;
};

const toggleRole = (roleName) => {
  const index = user.value.roles.indexOf(roleName);
  if (index > -1) {
    user.value.roles.splice(index, 1);
  } else {
    user.value.roles.push(roleName);
  }
};

const validateFront = () => {
  frontErrors.value = {};
  let isValid = true;

  const mobileRegex = /^09\d{9}$/;
  const nationalCodeRegex = /^\d{10}$/;

  if (!user.value.name) {
    errors.value.name = 'نام و نام خانوادگی الزامی است';
    isValid = false;
  } else {
    errors.value.name = '';
  }

  if (!user.value.mobile) {
    frontErrors.value.mobile = 'شماره موبایل الزامی است.';
    isValid = false;
  } else if (!mobileRegex.test(user.value.mobile)) {
    frontErrors.value.mobile = 'فرمت شماره موبایل نامعتبر است (مثال: 09123456789).';
    isValid = false;
  } else {
    frontErrors.value.mobile = '';
  }

  if (!user.value.national_code) {
    errors.value.national_code = 'کد ملی الزامیست';
    isValid = false;
  } else if (!nationalCodeRegex.test(user.value.national_code)) {
    errors.value.national_code = 'کد ملی باید 10 رقم باشد';
    isValid = false;
  } else {
    errors.value.national_code = '';
  }

  if (!user.value.personnel_code) {
    errors.value.personnel_code = 'کد پرسنلی الزامیست';
    isValid = false;
  } else {
    errors.value.personnel_code = '';
  }

  if (!isEdit.value && !user.value.password) {
    errors.value.password = 'رمز عبور الزامی است';
    isValid = false;
  } else {
    errors.value.password = '';
  }

  if (user.value.roles.length === 0) {
    errors.value.roles = 'حداقل یک نقش باید انتخاب شود';
    isValid = false;
  } else {
    errors.value.roles = '';
  }

  return isValid;
};

const saveUser = async () => {
  if (!validateFront()) return;

  saving.value = true;
  errors.value = {};
  try {
    if (isEdit.value) {
      await api.put(`/users/${user.value.id}`, user.value);
      toast.add({ severity: 'success', summary: 'موفق', detail: 'کاربر با موفقیت ویرایش شد', life: 3000 });
    } else {
      await api.post('/users', user.value);
      toast.add({ severity: 'success', summary: 'موفق', detail: 'کاربر جدید با موفقیت اضافه شد', life: 3000 });
    }
    userDialog.value = false;
    await loadUsers(); // 🔑 بارگذاری مجدد
  } catch (error) {
    handleApiError(error, {
      setErrors: (validationErrors) => {
        errors.value = validationErrors;
      }
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (data) => {
  confirm.require({
    message: `آیا از حذف کاربر "${data.name}" اطمینان دارید؟`,
    header: 'تایید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'بله، حذف کن',
    rejectLabel: 'خیر',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/users/${data.id}`);
        toast.add({ severity: 'success', summary: 'موفق', detail: 'کاربر حذف شد', life: 3000 });
        await loadUsers();
      } catch (error) {
        handleApiError(error);
      }
    }
  });
};

const exportToExcel = () => {
  toast.add({ severity: 'info', summary: 'اطلاع', detail: 'این قابلیت به زودی اضافه می‌شود', life: 3000 });
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fa-IR');
};

const getRoleSeverity = (roleName) => {
  const role = String(roleName ?? '').toLowerCase();
  if (role.includes('admin')) return 'danger';
  if (role.includes('manager')) return 'warning';
  if (role.includes('user')) return 'info';
  return 'success';
};
</script>

<style scoped>
/* =========================================================
   UNIFIED ENTERPRISE UI
   هماهنگ با طراحی صفحات قبلی
   ========================================================= */

.users-table {
  border: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 5px 14px rgba(37, 99, 235, 0.18);
  flex-shrink: 0;
}

.table-icon-box {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #64748b;
}

.table-icon-box.unit {
  background: #eef2ff;
  color: #4f46e5;
}

.role-empty {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8;
  font-size: 0.8rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 999px;
  padding: 0.3rem 0.6rem;
}

:deep(.users-table .p-datatable-tbody > tr > td) {
  padding: 0.9rem 0.85rem;
  vertical-align: middle;
}

:deep(.users-table .p-datatable-thead > tr > th) {
  padding: 0.9rem 0.85rem;
  font-size: 0.78rem;
  white-space: nowrap;
  border-color: #e2e8f0;
}

:deep(.users-table .p-datatable-tbody > tr) {
  border-color: #eef2f7;
}

:deep(.users-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

:deep(.users-table .p-paginator) {
  border-top: 1px solid #eef2f7;
  padding: 0.75rem 1rem;
  background: #fff;
}

:deep(.users-table .p-datatable-wrapper) {
  scrollbar-width: thin;
}

@media (max-width: 768px) {
  :deep(.users-table .p-datatable-tbody > tr > td) {
    padding: 0.75rem;
  }
}

.users-table :deep(.p-datatable-header) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.users-table :deep(.p-datatable-thead > tr > th) {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

.users-table :deep(.p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

.users-table :deep(.p-datatable-tbody > tr:hover) {
  background: #f9fafb;
}

.user-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
}

.user-dialog :deep(.p-dialog-header .p-dialog-title) {
  color: white;
  font-weight: 700;
}

/* ═══════════════════════════════════════════════════════
   DIALOG BASE
   ═══════════════════════════════════════════════════════ */

:deep(.user-dialog-modern .p-dialog-header),
:deep(.user-view-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

:deep(.user-dialog-modern .p-dialog-content),
:deep(.user-view-dialog .p-dialog-content) {
  padding: 1.5rem;
  background: #ffffff;
}

:deep(.user-dialog-modern .p-dialog-footer),
:deep(.user-view-dialog .p-dialog-footer) {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}

/* ═══════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════ */

.dialog-header-custom {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-icon-wrapper.view {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.header-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.header-text {
  flex: 1;
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}

.header-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

/* ══════════════════════════════════════════════════════
   FORM
   ═══════════════════════════════════════════════════════ */

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
}

.required {
  color: #ef4444;
  margin-right: 0.25rem;
}

.form-input {
  width: 100%;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #94a3b8;
  pointer-events: none;
}

:deep(.input-with-icon .p-inputtext) {
  padding-right: 2.5rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* ═══════════════════════════════════════════════════════
   ROLES
   ═══════════════════════════════════════════════════════ */

.roles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.role-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.role-card:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.role-card.is-selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.role-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.role-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.role-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.role-icon-wrapper:has(.admin) {
  background: rgba(139, 92, 246, 0.1);
}

.role-icon-wrapper:has(.user) {
  background: rgba(59, 130, 246, 0.1);
}

.role-icon {
  width: 16px;
  height: 16px;
}

.role-icon.admin {
  color: #8b5cf6;
}

.role-icon.user {
  color: #3b82f6;
}

.role-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
}

/* ═══════════════════════════════════════════════════════
   STATUS
   ═══════════════════════════════════════════════════════ */

.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid;
  transition: all 0.2s ease;
}

.status-card.is-active {
  background: #f0fdf4;
  border-color: #86efac;
}

.status-card.is-inactive {
  background: #fef2f2;
  border-color: #fecaca;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.status-icon-wrapper.active {
  background: #dcfce7;
}

.status-icon-wrapper.inactive {
  background: #fee2e2;
}

.status-icon {
  width: 20px;
  height: 20px;
}

.status-icon-wrapper.active .status-icon {
  color: #16a34a;
}

.status-icon-wrapper.inactive .status-icon {
  color: #dc2626;
}

.status-text {
  flex: 1;
}

.status-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.status-description {
  font-size: 0.75rem;
  color: #64748b;
}

.contractor-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.warning-icon {
  width: 14px;
  height: 14px;
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  min-width: 100px;
}

.btn-save {
  min-width: 120px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
}

.btn-save:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

/* ═══════════════════════════════════════════════════════
   VIEW DIALOG
   ═══════════════════════════════════════════════════════ */

.view-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 16px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.profile-info {
  flex: 1;
}

.profile-name {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.profile-email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.email-icon {
  width: 14px;
  height: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid;
}

.info-card.mobile {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.info-card.national {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.info-card.personnel {
  background: #faf5ff;
  border-color: #e9d5ff;
}

.info-card.date {
  background: #fff7ed;
  border-color: #fed7aa;
}

.info-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.info-card.mobile .info-icon-wrapper {
  background: #dbeafe;
}

.info-card.national .info-icon-wrapper {
  background: #dcfce7;
}

.info-card.personnel .info-icon-wrapper {
  background: #f3e8ff;
}

.info-card.date .info-icon-wrapper {
  background: #ffedd5;
}

.info-icon {
  width: 18px;
  height: 18px;
}

.info-card.mobile .info-icon {
  color: #2563eb;
}

.info-card.national .info-icon {
  color: #16a34a;
}

.info-card.personnel .info-icon {
  color: #9333ea;
}

.info-card.date .info-icon {
  color: #ea580c;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.roles-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.section-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
}

.roles-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-tag {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.status-badge {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.badge-label {
  font-size: 0.75rem;
  color: #64748b;
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

@media (max-width: 576px) {
  :deep(.p-dialog) {
    margin: 0.5rem;
  }

  :deep(.p-dialog-header),
  :deep(.p-dialog-content),
  :deep(.p-dialog-footer) {
    padding: 1rem;
  }

  .header-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .header-icon {
    width: 20px;
    height: 20px;
  }

  .header-title {
    font-size: 1.125rem;
  }
}
</style>
