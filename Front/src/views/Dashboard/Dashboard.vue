<template>
  <div class="dashboard-page">

    <!-- ═════════════════════════════════════════════
         HERO
    ═════════════════════════════════════════════ -->

    <section
        v-if="loading"
        class="dashboard-hero"
    >
      <div class="flex items-center gap-4">

        <div class="skeleton skeleton-circle w-14 h-14"></div>

        <div class="space-y-2">
          <div class="skeleton w-44 h-6"></div>
          <div class="skeleton w-64 h-4"></div>
          <div class="skeleton w-48 h-3"></div>
        </div>

      </div>
    </section>


    <section
        v-else
        class="dashboard-hero"
    >

      <div class="hero-decoration hero-decoration-one"></div>
      <div class="hero-decoration hero-decoration-two"></div>

      <div class="relative z-10">

        <div class="flex flex-col md:flex-row
                    md:items-center md:justify-between gap-5">

          <div>

            <div class="flex items-center gap-2 mb-2">

              <span class="hero-status"></span>

              <span class="text-xs text-slate-500">
                سامانه فعال است
              </span>

            </div>

            <h1 class="hero-title">
              سلام {{ profile?.name || 'کاربر گرامی' }} 👋
            </h1>

            <p class="hero-subtitle">
              به سامانه جامع سازمانی خوش آمدید
            </p>

            <div class="flex items-center flex-wrap gap-3 mt-4">

              <div class="hero-meta">
                <i class="pi pi-clock"></i>
                <span>{{ currentTime }}</span>
              </div>

              <span class="text-slate-300">•</span>

              <div class="hero-meta">
                <i class="pi pi-calendar"></i>
                <span>{{ todayDate }}</span>
              </div>

            </div>

          </div>


          <div
              v-if="roles.length"
              class="flex flex-wrap gap-2 md:max-w-xs md:justify-end"
          >

            <span
                v-for="role in roles"
                :key="role"
                class="role-badge"
            >
              {{ role }}
            </span>

          </div>

        </div>

      </div>

    </section>


    <!-- ═════════════════════════════════════════════
         QUICK STATS
    ═════════════════════════════════════════════ -->
    <DashboardStats
        :attendance-rate="attendanceRate"
        :leave-days="leaveDays"
        :latest-attendance="latestAttendance"
        :latest-attendance-loading="latestAttendanceLoading"
        :unread-announcements="unreadAnnouncements.length"
        :loading="loading"
    />


    <!-- ═════════════════════════════════════════════
         QUICK ACCESS
    ═════════════════════════════════════════════ -->

    <QuickAccess
        :modules="accessibleModules"
        :loading="loading"
    />


    <!-- ═════════════════════════════════════════════
         MAIN GRID
    ═════════════════════════════════════════════ -->

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">

      <!-- Personal Info -->

      <PersonalInfoCard
          :profile="profile"
          :synced-at="positionSyncedAt"
          :sync-failed="positionSyncFailed"
          :loading="loading"
      />


      <!-- Payslip -->

      <section>

        <div class="dashboard-card overflow-hidden">

          <button
              type="button"
              class="w-full text-right p-5
                     flex items-center justify-between gap-3
                     bg-gradient-to-br
                     from-violet-50/70
                     to-white
                     border-b border-violet-100/70
                     transition-colors"
              :class="payslipOpen
                ? 'hover:bg-violet-50'
                : 'hover:bg-white'"
              @click="togglePayslip"
          >

            <div class="flex items-center gap-3">

              <div
                  class="w-10 h-10 rounded-xl
                         bg-violet-50
                         border border-violet-100
                         flex items-center justify-center"
              >

                <i class="pi pi-wallet text-violet-600 text-lg"></i>

              </div>

              <div>

                <h3 class="font-bold text-slate-800 text-base">
                  فیش حقوقی
                </h3>

                <p class="text-xs text-slate-500 mt-1">
                  {{ latestMonth || 'آخرین فیش صادر شده' }}
                </p>

              </div>

            </div>


            <div class="flex items-center gap-2">

              <span
                  v-if="!payslipOpen"
                  class="hidden sm:flex
                         items-center gap-1
                         text-[10px] text-slate-400"
              >

                <i class="pi pi-lock"></i>

                اطلاعات محفوظ

              </span>


              <span
                  class="w-8 h-8 rounded-full
                         bg-white
                         border border-slate-200
                         flex items-center justify-center
                         text-slate-400
                         transition-transform duration-300"
                  :class="{ 'rotate-180': payslipOpen }"
              >

                <i class="pi pi-chevron-down text-xs"></i>

              </span>

            </div>

          </button>


          <div
              class="collapse-grid"
              :class="{ 'is-open': payslipOpen }"
          >

            <div class="overflow-hidden">

              <div class="p-5">

                <PayslipSummaryCard
                    :payslip="latestPayslip"
                    :month="latestMonth"
                    :loading="loading"
                />

              </div>

            </div>

          </div>

        </div>


        <p
            class="flex items-center justify-center gap-1
                   text-[10px] text-slate-400 mt-2"
        >

          <i class="pi pi-lock"></i>

          اطلاعات مالی فقط با درخواست شما نمایش داده می‌شود

        </p>

      </section>


      <!-- Leave -->

      <LeaveInfoCard
          :leave-data="leaveData"
          :loading="loading"
      />


      <!-- Attendance -->

      <AttendanceDashboardCard
          :loading="attendanceLoading"
      />

    </div>


    <!-- ═════════════════════════════════════════════
         ANNOUNCEMENTS
    ═════════════════════════════════════════════ -->

    <AnnouncementsList
        :announcements="announcements"
        :loading="loading"
        @mark-read="handleMarkAsRead"
    />

  </div>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

import { useDashboardModules } from '@/composables/useDashboardModules'

import dashboardService from '@/services/dashboardService'

import DashboardStats
  from '@/views/Dashboard/DashboardStats.vue'

import PersonalInfoCard
  from '@/components/Dashboard/PersonalInfoCard.vue'

import PayslipSummaryCard
  from '@/components/Dashboard/PayslipSummaryCard.vue'

import AnnouncementsList
  from '@/components/Dashboard/AnnouncementsList.vue'

import QuickAccess
  from '@/components/Dashboard/QuickAccess.vue'

import LeaveInfoCard
  from '@/components/Dashboard/LeaveInfoCard.vue'

import AttendanceDashboardCard
  from '@/views/Attendance/AttendanceDashboardCard.vue'

import api from '@/api/axios.js'


const { accessibleModules } =
    useDashboardModules()


/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */

const profile = ref(null)

const roles = ref([])

const announcements = ref([])

const latestPayslip = ref(null)

const latestMonth = ref(null)

const loading = ref(true)

const leaveData = ref({})

const attendanceData = ref([])

const attendanceLoading = ref(true)

const latestAttendance = ref(null)

const latestAttendanceLoading = ref(true)

const positionSyncedAt = ref(null)

const positionSyncFailed = ref(false)

const payslipOpen = ref(false)

const userInteractedWithPayslip = ref(false)

const currentTime = ref('')

let clockTimer = null

let payslipPreviewTimers = []


/* ═══════════════════════════════════════
   CLOCK
═══════════════════════════════════════ */

const updateClock = () => {

  currentTime.value =
      new Date().toLocaleTimeString(
          'fa-IR',
          {
            hour: '2-digit',
            minute: '2-digit'
          }
      )

}


const todayDate = computed(() => {

  return new Date().toLocaleDateString(
      'fa-IR',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
  )

})


/* ═══════════════════════════════════════
   ATTENDANCE
═══════════════════════════════════════ */

const fetchAttendanceSummary = async () => {

  attendanceLoading.value = true
  latestAttendanceLoading.value = true

  try {

    const response =
        await api.get('/attendance/summary')

    attendanceData.value =
        response.data?.data || []


    const currentMonth =
        attendanceData.value.find(
            item =>
                item.month_title === 'ماه جاری'
        )


    if (currentMonth) {

      /*
       * اگر API اطلاعات روزانه را داخل
       * summary برگرداند.
       */

      const days =
          currentMonth.daily ||
          currentMonth.days_data ||
          []


      if (days.length) {

        latestAttendance.value =
            days[0]

      }

    }

  } catch (error) {

    console.error(
        'Attendance summary error:',
        error
    )

    attendanceData.value = []

  } finally {

    attendanceLoading.value = false

    latestAttendanceLoading.value = false

  }

}


/* ═══════════════════════════════════════
   ATTENDANCE RATE
═══════════════════════════════════════ */

const attendanceRate = computed(() => {

  const currentMonth =
      attendanceData.value.find(
          item =>
              item.month_title === 'ماه جاری'
      )


  if (!currentMonth) {
    return 0
  }


  const apiRate =
      Number(currentMonth.attendance_rate)


  if (
      Number.isFinite(apiRate)
      &&
      apiRate >= 0
  ) {

    return Math.round(apiRate)

  }


  const presence =
      Number(
          currentMonth.days?.presence ||
          currentMonth.presence_days ||
          0
      )


  const absence =
      Number(
          currentMonth.days?.absence ||
          currentMonth.absence_days ||
          0
      )


  const total =
      presence + absence


  if (!total) {
    return 0
  }


  return Math.round(
      (presence / total) * 100
  )

})


/* ═══════════════════════════════════════
   LEAVE
═══════════════════════════════════════ */

const leaveDays = computed(() => {

  return (
      leaveData.value?.summary?.current_remainder_days ??
      leaveData.value?.summary?.total_remainder_days ??
      0
  )

})


/* ═══════════════════════════════════════
   PAYSLIP
═══════════════════════════════════════ */

const clearPayslipPreviewTimers = () => {

  payslipPreviewTimers.forEach(
      timer => clearTimeout(timer)
  )

  payslipPreviewTimers = []

}


const togglePayslip = () => {

  userInteractedWithPayslip.value = true

  clearPayslipPreviewTimers()

  payslipOpen.value =
      !payslipOpen.value

}


/* ═══════════════════════════════════════
   DASHBOARD API
═══════════════════════════════════════ */

const fetchDashboardData = async () => {

  try {

    const [
      dashboard,
      announcementData
    ] = await Promise.all([

      dashboardService.getDashboardData(),

      dashboardService.getAnnouncements()

    ])


    profile.value =
        dashboard.profile

    roles.value =
        dashboard.roles || []

    latestPayslip.value =
        dashboard.latest_payslip

    latestMonth.value =
        dashboard.latest_month

    announcements.value =
        announcementData || []

    leaveData.value =
        dashboard.leave || {}

    positionSyncedAt.value =
        dashboard.position_synced_at || null

    positionSyncFailed.value =
        dashboard.position_sync_failed || false


  } catch (error) {

    console.error(
        'Dashboard fetch error:',
        error
    )

  } finally {

    loading.value = false

  }

}


/* ═══════════════════════════════════════
   ANNOUNCEMENTS
═══════════════════════════════════════ */

const handleMarkAsRead =
    async id => {

      try {

        await dashboardService
            .markAnnouncementRead(id)

        announcements.value =
            announcements.value.filter(
                item => item.id !== id
            )

      } catch (error) {

        console.error(
            'Mark as read error:',
            error
        )

      }

    }

const fetchLatestAttendance = async () => {
  latestAttendanceLoading.value = true

  try {
    latestAttendance.value =
        await dashboardService.getLatestAttendance()

  } catch (error) {

    console.error(
        'Latest attendance error:',
        error
    )

    latestAttendance.value = null

  } finally {

    latestAttendanceLoading.value = false

  }
}

const unreadAnnouncements =
    computed(() => {

      return announcements.value.filter(
          a => !a.is_read
      )

    })


/* ═══════════════════════════════════════
   LIFECYCLE
═══════════════════════════════════════ */

onMounted(() => {

  updateClock()

  clockTimer =
      setInterval(
          updateClock,
          30000
      )


  fetchDashboardData()

  fetchAttendanceSummary()
  fetchLatestAttendance()

})


onBeforeUnmount(() => {

  clearPayslipPreviewTimers()

  if (clockTimer) {
    clearInterval(clockTimer)
  }

})

</script>


<style scoped>

.dashboard-page {
  @apply space-y-5;

  animation:
      dashboard-enter .45s ease-out;
}


/* ═══════════════════════════════════════
   SKELETON
═══════════════════════════════════════ */

.skeleton {
  @apply relative overflow-hidden
  rounded-lg
  bg-slate-200/70;
}


.skeleton::after {

  content: '';

  @apply absolute inset-0;

  transform: translateX(-100%);

  background:
      linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 55%),
          transparent
      );

  animation:
      skeleton-shimmer 1.5s infinite;

}


.skeleton-circle {
  @apply rounded-full;
}


@keyframes skeleton-shimmer {

  100% {
    transform: translateX(100%);
  }

}


/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */

.dashboard-hero {

  @apply relative overflow-hidden
  rounded-3xl
  border border-indigo-100/70
  p-6 md:p-8;

  background:
      linear-gradient(
          135deg,
          rgb(238 242 255),
          rgb(248 250 252) 55%,
          rgb(245 243 255)
      );

  box-shadow:
      0 8px 30px rgb(79 70 229 / 5%);

}


.hero-decoration {

  @apply absolute
  rounded-full
  pointer-events-none;

  filter: blur(50px);

}


.hero-decoration-one {

  width: 220px;
  height: 220px;

  background:
      rgb(129 140 248 / 12%);

  top: -100px;
  left: -60px;

}


.hero-decoration-two {

  width: 180px;
  height: 180px;

  background:
      rgb(167 139 250 / 12%);

  bottom: -100px;
  right: -50px;

}


.hero-title {

  @apply text-2xl md:text-3xl
  font-bold
  text-slate-800
  tracking-tight;

}


.hero-subtitle {

  @apply text-sm md:text-base
  text-slate-500
  mt-1;

}


.hero-status {

  @apply w-2 h-2
  rounded-full
  bg-emerald-500;

  box-shadow:
      0 0 0 4px
      rgb(16 185 129 / 10%);

}


.hero-meta {

  @apply flex
  items-center
  gap-1.5
  text-xs
  text-slate-500;

}


.hero-meta i {

  @apply text-slate-400;

}


.role-badge {

  @apply px-3 py-1.5
  rounded-full
  bg-white/80
  border border-white
  shadow-sm
  text-[11px]
  font-medium
  text-slate-600
  backdrop-blur-sm;

}


/* ═══════════════════════════════════════
   CARD
═══════════════════════════════════════ */

.dashboard-card {

  @apply bg-white
  rounded-2xl
  border border-slate-200/70
  overflow-hidden;

  box-shadow:
      0 1px 3px
      rgb(15 23 42 / 4%);

}


/* ═══════════════════════════════════════
   COLLAPSE
═══════════════════════════════════════ */

.collapse-grid {

  display: grid;

  grid-template-rows: 0fr;

  transition:
      grid-template-rows
      .45s cubic-bezier(.4,0,.2,1);

}


.collapse-grid.is-open {

  grid-template-rows: 1fr;

}


.collapse-grid > div {

  overflow: hidden;

}


/* ═══════════════════════════════════════
   ANIMATION
═══════════════════════════════════════ */

@keyframes dashboard-enter {

  from {

    opacity: 0;

    transform:
        translateY(8px);

  }

  to {

    opacity: 1;

    transform:
        translateY(0);

  }

}

</style>