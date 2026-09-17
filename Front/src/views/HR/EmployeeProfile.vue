<template>
  <div dir="rtl" class="employee-profile-page">

    <!-- =========================================================
         Loading State
    ========================================================== -->
    <template v-if="loading">
      <div class="space-y-5 animate-fade-in">

        <!-- Header Skeleton -->
        <section class="profile-card overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <div class="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
          </div>

          <div class="p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div class="w-20 h-20 rounded-2xl bg-slate-100 animate-pulse"></div>

              <div class="flex-1 space-y-3">
                <div class="h-6 w-48 bg-slate-100 rounded animate-pulse"></div>
                <div class="h-4 w-64 bg-slate-100 rounded animate-pulse"></div>
                <div class="h-3 w-40 bg-slate-100 rounded animate-pulse"></div>
              </div>

              <div class="h-10 w-32 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 border-t border-slate-100">
            <div
                v-for="item in 4"
                :key="item"
                class="p-5 border-l last:border-l-0 border-slate-100"
            >
              <div class="h-5 w-20 bg-slate-100 rounded mx-auto animate-pulse"></div>
              <div class="h-3 w-16 bg-slate-100 rounded mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        <!-- Content Skeleton -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
              v-for="card in 2"
              :key="card"
              class="profile-card p-6 space-y-5"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-100 animate-pulse"></div>
              <div class="h-5 w-28 bg-slate-100 rounded animate-pulse"></div>
            </div>

            <div
                v-for="row in 5"
                :key="row"
                class="flex items-center justify-between py-3 border-b border-slate-100"
            >
              <div class="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
              <div class="h-3 w-32 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <!-- =========================================================
         Error / Not Found State
    ========================================================== -->
    <section
        v-else-if="!employee"
        class="profile-card min-h-[420px] flex items-center justify-center p-8"
    >
      <div class="text-center max-w-md">

        <div
            class="w-20 h-20 mx-auto rounded-2xl
                 bg-slate-50 border border-slate-100
                 flex items-center justify-center"
        >
          <i class="pi pi-user-slash text-3xl text-slate-300"></i>
        </div>

        <h2 class="mt-5 text-lg font-bold text-slate-800">
          اطلاعات پرسنل یافت نشد
        </h2>

        <p class="mt-2 text-sm text-slate-400 leading-7">
          اطلاعات کارمند موردنظر در حال حاضر قابل دریافت نیست
          یا کارمند موردنظر وجود ندارد.
        </p>

        <Button
            label="بازگشت به لیست پرسنل"
            icon="pi pi-arrow-right"
            severity="secondary"
            class="mt-6"
            @click="goBack"
        />
      </div>
    </section>

    <!-- =========================================================
         Main Profile
    ========================================================== -->
    <template v-else>

      <div class="space-y-5 animate-fade-in">

        <!-- =====================================================
             Breadcrumb
        ====================================================== -->
        <nav class="flex items-center gap-2 px-1 text-sm">

          <router-link
              :to="{ name: 'hr.employees' }"
              class="breadcrumb-link"
          >
            <i class="pi pi-users text-xs"></i>
            <span>پرسنل</span>
          </router-link>

          <i class="pi pi-chevron-left text-[9px] text-slate-300"></i>

          <span class="text-slate-500 font-medium truncate max-w-[220px]">
            {{ employee.name }}
          </span>

        </nav>


        <!-- =====================================================
             Profile Header
        ====================================================== -->
        <section class="profile-card overflow-hidden">

          <!-- Main Header -->
          <div class="p-5 md:p-6">

            <div
                class="flex flex-col md:flex-row
                     items-start md:items-center
                     justify-between gap-5"
            >

              <!-- Employee Identity -->
              <div class="flex items-center gap-4 min-w-0">

                <!-- Avatar -->
                <div class="employee-avatar shrink-0">
                  <span>
                    {{ employee.name?.charAt(0) || '؟' }}
                  </span>
                </div>

                <!-- Name / Position -->
                <div class="min-w-0">

                  <div class="flex flex-wrap items-center gap-2">

                    <h1 class="text-xl md:text-2xl font-bold text-slate-800 truncate">
                      {{ employee.name }}
                    </h1>

                    <Tag
                        :value="employee.employment?.is_active ? 'فعال' : 'غیرفعال'"
                        :severity="employee.employment?.is_active ? 'success' : 'danger'"
                        rounded
                    />

                  </div>

                  <div
                      v-if="employee.post?.title"
                      class="flex items-center gap-2 mt-2 text-sm text-slate-500"
                  >
                    <i class="pi pi-briefcase text-slate-400"></i>
                    <span>{{ employee.post.title }}</span>
                  </div>

                  <div
                      v-if="employee.unit?.title"
                      class="flex items-center gap-2 mt-1 text-xs text-slate-400"
                  >
                    <i class="pi pi-building"></i>
                    <span>{{ employee.unit.title }}</span>
                  </div>

                </div>
              </div>


              <!-- Actions -->
              <div class="flex items-center gap-2 w-full md:w-auto">

                <Button
                    label="بازگشت"
                    icon="pi pi-arrow-right"
                    severity="secondary"
                    outlined
                    class="w-full md:w-auto"
                    @click="goBack"
                />

              </div>

            </div>
          </div>


          <!-- ===================================================
               Quick Information
          ==================================================== -->
          <div class="profile-stats">

            <!-- Personnel Code -->
            <div class="profile-stat">

              <div class="stat-icon bg-indigo-50 text-indigo-600">
                <i class="pi pi-id-card"></i>
              </div>

              <div class="min-w-0">
                <p class="stat-label">کد پرسنلی</p>
                <p class="stat-value">
                  {{ employee.personnel_code || '—' }}
                </p>
              </div>

            </div>


            <!-- National Code -->
            <div class="profile-stat">

              <div class="stat-icon bg-sky-50 text-sky-600">
                <i class="pi pi-credit-card"></i>
              </div>

              <div class="min-w-0">
                <p class="stat-label">کد ملی</p>
                <p class="stat-value">
                  {{ employee.national_code || '—' }}
                </p>
              </div>

            </div>


            <!-- Employment Number -->
            <div class="profile-stat">

              <div class="stat-icon bg-violet-50 text-violet-600">
                <i class="pi pi-hashtag"></i>
              </div>

              <div class="min-w-0">
                <p class="stat-label">شماره استخدام</p>
                <p class="stat-value">
                  {{ employee.employment?.employment_number || '—' }}
                </p>
              </div>

            </div>


            <!-- Status -->
            <div class="profile-stat">

              <div
                  class="stat-icon"
                  :class="
                  employee.employment?.is_active
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                "
              >
                <i
                    :class="
                    employee.employment?.is_active
                      ? 'pi pi-check-circle'
                      : 'pi pi-times-circle'
                  "
                ></i>
              </div>

              <div>
                <p class="stat-label">وضعیت پرسنل</p>

                <p
                    class="stat-value"
                    :class="
                    employee.employment?.is_active
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  "
                >
                  {{ employee.employment?.is_active ? 'فعال' : 'غیرفعال' }}
                </p>
              </div>

            </div>

          </div>

        </section>


        <!-- =====================================================
             Tabs
        ====================================================== -->
        <section class="profile-card employee-tabs">

          <TabView>

            <!-- =================================================
                 Basic Information
            ================================================== -->
            <TabPanel header="اطلاعات پایه">

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-5">

                <!-- =============================================
                     Personal Information
                ============================================== -->
                <div class="info-card">

                  <div class="info-card-header">

                    <div class="section-icon bg-indigo-50 text-indigo-600">
                      <i class="pi pi-user"></i>
                    </div>

                    <div>
                      <h3>اطلاعات شخصی</h3>
                      <p>اطلاعات هویتی و ارتباطی</p>
                    </div>

                  </div>


                  <div class="info-list">

                    <InfoRow
                        label="نام و نام خانوادگی"
                        :value="employee.name"
                    />

                    <InfoRow
                        label="موبایل"
                        :value="employee.mobile"
                        dir="ltr"
                    />

                    <InfoRow
                        label="ایمیل"
                        :value="employee.email || '—'"
                        dir="ltr"
                    />

                    <InfoRow
                        label="کد ملی"
                        :value="employee.national_code || '—'"
                    />

                    <InfoRow
                        label="کد پرسنلی"
                        :value="employee.personnel_code || '—'"
                    />

                  </div>

                </div>


                <!-- =============================================
                     Organization Information
                ============================================== -->
                <div class="info-card">

                  <div class="info-card-header">

                    <div class="section-icon bg-violet-50 text-violet-600">
                      <i class="pi pi-sitemap"></i>
                    </div>

                    <div>
                      <h3>اطلاعات سازمانی</h3>
                      <p>سمت، واحد و اطلاعات استخدامی</p>
                    </div>

                  </div>


                  <div class="info-list">

                    <InfoRow
                        label="واحد سازمانی"
                        :value="employee.unit?.title || '—'"
                    />

                    <div
                        v-if="employee.unit?.breadcrumb?.length > 1"
                        class="info-row"
                    >
                      <span class="info-label">
                        مسیر سازمانی
                      </span>

                      <span class="info-value text-xs text-slate-500 text-left leading-6">
                        {{ employee.unit.breadcrumb.join(' ← ') }}
                      </span>
                    </div>


                    <div class="info-row">

                      <span class="info-label">
                        پست سازمانی
                      </span>

                      <div class="text-left">

                        <span class="info-value block">
                          {{ employee.post?.title || '—' }}
                        </span>

                        <span
                            v-if="employee.post?.code"
                            class="info-meta"
                        >
                          کد: {{ employee.post.code }}
                        </span>

                      </div>

                    </div>


                    <div class="info-row">

                      <span class="info-label">
                        شغل
                      </span>

                      <div class="text-left">

                        <span class="info-value block">
                          {{ employee.job?.title || '—' }}
                        </span>

                        <span
                            v-if="employee.job?.code"
                            class="info-meta"
                        >
                          کد: {{ employee.job.code }}
                        </span>

                      </div>

                    </div>


                    <InfoRow
                        label="تاریخ استخدام"
                        :value="formatDate(employee.employment?.employment_date)"
                    />


                    <div class="info-row">

                      <span class="info-label">
                        آخرین حکم
                      </span>

                      <span class="info-value">
                        {{ employee.employment?.last_statute_number || '—' }}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </TabPanel>


            <!-- =================================================
                 Family
            ================================================== -->
            <TabPanel header="خانواده و افراد تحت تکفل">

              <div class="tab-content-wrapper">
                <FamilyInfoSection :user-id="employee.user_id" />
              </div>

            </TabPanel>


            <!-- =================================================
                 Statute History
            ================================================== -->
            <TabPanel header="تاریخچه سمت">

              <div class="tab-content-wrapper">
                <StatuteHistorySection :user-id="employee.user_id" />
              </div>

            </TabPanel>


            <!-- =================================================
                 Attendance
            ================================================== -->
            <TabPanel header="تردد">

              <div class="tab-content-wrapper">
                <AttendanceSection :user-id="employee.user_id" />
              </div>

            </TabPanel>


            <!-- =================================================
                 Training
            ================================================== -->
            <TabPanel header="آموزش پرسنل">

              <div class="tab-content-wrapper">
                <TrainingSection :user-id="employee.user_id" />
              </div>

            </TabPanel>

            <!-- =================================================
              Assessment Report (کارنامه شایستگی)
            ================================================= -->
            <TabPanel header="کارنامه شایستگی">
              <div class="tab-content-wrapper">
                <AssessmentReportSection :user-id="employee.user_id" />
              </div>
            </TabPanel>

          </TabView>

        </section>


        <!-- =====================================================
             Sync Information
        ====================================================== -->
        <section class="sync-card">

          <div class="flex items-center gap-3">

            <div class="sync-icon">
              <i class="pi pi-sync"></i>
            </div>

            <div>
              <p class="text-sm font-medium text-slate-700">
                همگام‌سازی اطلاعات
              </p>

              <p class="text-xs text-slate-400 mt-0.5">
                آخرین دریافت اطلاعات از راهکاران
              </p>
            </div>

          </div>


          <div class="text-left">

            <p class="text-sm font-semibold text-slate-600">
              {{ formatDateTime(employee.synced_at) }}
            </p>

            <p class="text-[11px] text-slate-400 mt-1">
              اطلاعات ممکن است با تأخیر به‌روزرسانی شوند
            </p>

          </div>

        </section>

      </div>

    </template>

  </div>
</template>


<script setup>
import { ref, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import hrService from '@/services/hrService'

import FamilyInfoSection from './FamilyInfoSection.vue'
import StatuteHistorySection from '@/views/HR/StatuteHistorySection.vue'
import AttendanceSection from '@/views/HR/AttendanceSection.vue'
import TrainingSection from '@/views/HR/TrainingSection.vue'
import AssessmentReportSection from '@/views/HR/AssessmentReportSection.vue'


const route = useRoute()
const router = useRouter()


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const employee = ref(null)
const loading = ref(true)


/*
|--------------------------------------------------------------------------
| Fetch Employee Profile
|--------------------------------------------------------------------------
*/

const fetchProfile = async () => {

  loading.value = true

  try {

    const data = await hrService.getEmployeeProfile(route.params.id)

    employee.value = data.employee

  } catch (error) {

    console.error('Fetch profile error:', error)

    employee.value = null

  } finally {

    loading.value = false

  }

}


/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

const goBack = () => {

  if (window.history.length > 2) {

    router.back()

  } else {

    router.push({
      name: 'hr.employees'
    })

  }

}


/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

const formatDate = (dateStr) => {

  if (!dateStr) return '—'

  try {

    return new Date(dateStr).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  } catch {

    return '—'

  }

}


/*
|--------------------------------------------------------------------------
| Format DateTime
|--------------------------------------------------------------------------
*/

const formatDateTime = (dateStr) => {

  if (!dateStr) return '—'

  try {

    return new Date(dateStr).toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  } catch {

    return '—'

  }

}


/*
|--------------------------------------------------------------------------
| Info Row Component
|--------------------------------------------------------------------------
|
| یک کامپوننت کوچک داخلی برای جلوگیری از تکرار
| ساختار ردیف‌های اطلاعاتی.
|
*/

const InfoRow = (props) => {

  return h(
      'div',
      {
        class: 'info-row'
      },
      [

        h(
            'span',
            {
              class: 'info-label'
            },
            props.label
        ),

        h(
            'span',
            {
              class: 'info-value',
              dir: props.dir || 'rtl'
            },
            props.value ?? '—'
        )

      ]
  )

}


/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(fetchProfile)
</script>


<style scoped>
/* ================================================================
   Page
================================================================ */

.employee-profile-page {
  width: 100%;
  color: #334155;
}


/* ================================================================
   Generic Card
================================================================ */

.profile-card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 1rem;
  box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.02),
      0 4px 16px rgba(15, 23, 42, 0.03);
}


/* ================================================================
   Breadcrumb
================================================================ */

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  color: #94a3b8;

  transition:
      color 0.2s ease,
      transform 0.2s ease;
}

.breadcrumb-link:hover {
  color: #4f46e5;
}


/* ================================================================
   Employee Avatar
================================================================ */

.employee-avatar {
  width: 5rem;
  height: 5rem;

  border-radius: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
      linear-gradient(
          135deg,
          #eef2ff 0%,
          #e0e7ff 100%
      );

  border: 1px solid #c7d2fe;

  color: #4f46e5;

  font-size: 1.75rem;
  font-weight: 800;

  box-shadow:
      0 4px 12px rgba(79, 70, 229, 0.08);
}


/* ================================================================
   Profile Stats
================================================================ */

.profile-stats {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  border-top: 1px solid #eef2f7;
}

@media (min-width: 768px) {
  .profile-stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}


.profile-stat {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 0.8rem;

  padding: 1.15rem 1.25rem;

  border-left: 1px solid #eef2f7;
}

.profile-stat:last-child {
  border-left: 0;
}

@media (max-width: 767px) {

  .profile-stat:nth-child(2) {
    border-left: 0;
  }

  .profile-stat:nth-child(-n + 2) {
    border-bottom: 1px solid #eef2f7;
  }
}


.stat-icon {
  width: 2.5rem;
  height: 2.5rem;

  flex-shrink: 0;

  border-radius: 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.95rem;
}


.stat-label {
  color: #94a3b8;

  font-size: 0.7rem;

  margin-bottom: 0.25rem;
}


.stat-value {
  color: #334155;

  font-size: 0.9rem;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* ================================================================
   Tabs
================================================================ */

.employee-tabs {
  overflow: hidden;
}


/*
 * PrimeVue TabView
 */

:deep(.p-tabview-nav) {
  padding: 0 1.25rem;

  border-color: #eef2f7;

  background: transparent;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  background: transparent;

  border-color: transparent;

  color: #94a3b8;

  font-size: 0.85rem;
  font-weight: 500;

  padding: 1rem 1.1rem;

  transition:
      color 0.2s ease,
      border-color 0.2s ease;
}

:deep(.p-tabview-nav li .p-tabview-nav-link:hover) {
  color: #4f46e5;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #4f46e5;

  border-color: #4f46e5;
}

:deep(.p-tabview-panels) {
  padding: 0 1.25rem 1.25rem;

  background: transparent;
}


/* ================================================================
   Tab Content
================================================================ */

.tab-content-wrapper {
  padding-top: 1.25rem;
}


/* ================================================================
   Information Cards
================================================================ */

.info-card {
  background: #ffffff;

  border: 1px solid #e8edf3;

  border-radius: 0.9rem;

  padding: 1.25rem;
}


.info-card-header {
  display: flex;
  align-items: center;

  gap: 0.75rem;

  padding-bottom: 1rem;

  margin-bottom: 0.25rem;

  border-bottom: 1px solid #eef2f7;
}


.info-card-header h3 {
  color: #334155;

  font-size: 0.95rem;
  font-weight: 700;
}


.info-card-header p {
  color: #94a3b8;

  font-size: 0.7rem;

  margin-top: 0.2rem;
}


.section-icon {
  width: 2.35rem;
  height: 2.35rem;

  flex-shrink: 0;

  border-radius: 0.7rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.85rem;
}


/* ================================================================
   Information List
================================================================ */

.info-list {
  display: flex;
  flex-direction: column;
}


.info-row {
  min-height: 3.1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding: 0.7rem 0;

  border-bottom: 1px solid #f1f5f9;
}


.info-row:last-child {
  border-bottom: 0;
}


.info-label {
  flex-shrink: 0;

  color: #94a3b8;

  font-size: 0.78rem;
}


.info-value {
  color: #475569;

  font-size: 0.8rem;
  font-weight: 600;

  text-align: left;

  overflow-wrap: anywhere;
}


.info-meta {
  display: block;

  color: #a1a1aa;

  font-size: 0.65rem;

  margin-top: 0.2rem;
}


/* ================================================================
   Sync Card
================================================================ */

.sync-card {
  min-height: 4.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding: 1rem 1.25rem;

  background: #ffffff;

  border: 1px solid #e8edf3;

  border-radius: 1rem;

  box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.02);
}


.sync-icon {
  width: 2.25rem;
  height: 2.25rem;

  border-radius: 0.7rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f8fafc;

  color: #64748b;

  font-size: 0.85rem;
}


/* ================================================================
   Animation
================================================================ */

.animate-fade-in {
  animation: fadeIn 0.35s ease-out;
}


@keyframes fadeIn {

  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }

}


/* ================================================================
   Responsive
================================================================ */

@media (max-width: 640px) {

  .employee-avatar {
    width: 4rem;
    height: 4rem;

    border-radius: 1rem;

    font-size: 1.4rem;
  }


  .profile-stat {
    padding: 1rem;
  }


  .stat-icon {
    width: 2.2rem;
    height: 2.2rem;
  }


  .info-row {
    align-items: flex-start;
  }


  .sync-card {
    align-items: flex-start;
    flex-direction: column;
  }

}
</style>

