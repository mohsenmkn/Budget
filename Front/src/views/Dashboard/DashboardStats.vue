
<template>

  <div
      class="grid grid-cols-2
             lg:grid-cols-4
             gap-3 md:gap-4"
  >

    <!-- ═══════════════════════════════
         ATTENDANCE RATE
    ═══════════════════════════════ -->

    <div class="stat-card">

      <template v-if="loading">

        <div class="stat-icon-skeleton"></div>

        <div class="flex-1 space-y-2">

          <div class="skeleton w-16 h-3"></div>
          <div class="skeleton w-20 h-6"></div>
          <div class="skeleton w-12 h-2"></div>

        </div>

      </template>

      <template v-else>

        <div
            class="stat-icon
                   bg-indigo-50
                   border-indigo-100
                   text-indigo-600"
        >
          <i class="pi pi-clock"></i>
        </div>

        <div class="min-w-0">

          <p class="stat-label">
            نرخ حضور
          </p>

          <div class="flex items-baseline gap-1">

            <span class="stat-value">
              {{ attendanceRate }}%
            </span>

          </div>

          <p class="stat-meta">
            این ماه
          </p>

        </div>

      </template>

    </div>


    <!-- ═══════════════════════════════
         LEAVE
    ═══════════════════════════════ -->

    <div class="stat-card">

      <template v-if="loading">

        <div class="stat-icon-skeleton"></div>

        <div class="flex-1 space-y-2">

          <div class="skeleton w-20 h-3"></div>
          <div class="skeleton w-14 h-6"></div>
          <div class="skeleton w-16 h-2"></div>

        </div>

      </template>

      <template v-else>

        <div
            class="stat-icon
                   bg-emerald-50
                   border-emerald-100
                   text-emerald-600"
        >
          <i class="pi pi-calendar-minus"></i>
        </div>

        <div class="min-w-0">

          <p class="stat-label">
            مانده مرخصی
          </p>

          <div class="flex items-baseline gap-1">

            <span class="stat-value">
              {{ leaveDays }}
            </span>

            <span class="text-xs text-slate-400">
              روز
            </span>

          </div>

          <p class="stat-meta">
            استحقاقی
          </p>

        </div>

      </template>

    </div>


    <!-- ═══════════════════════════════
         LATEST ATTENDANCE
    ═══════════════════════════════ -->

    <div class="stat-card">

      <!-- Skeleton -->

      <template v-if="latestAttendanceLoading">

        <div class="stat-icon-skeleton"></div>

        <div class="flex-1 space-y-2">

          <div class="skeleton w-20 h-3"></div>
          <div class="skeleton w-28 h-6"></div>
          <div class="skeleton w-24 h-2"></div>

        </div>

      </template>


      <!-- Content -->

      <template v-else>

        <div
            class="stat-icon"
            :class="attendanceIconClass"
        >
          <i :class="attendanceIcon"></i>
        </div>


        <div class="min-w-0 flex-1">

          <div class="flex items-center justify-between gap-2">

            <p class="stat-label">
              آخرین تردد
            </p>

            <!-- تعداد تردد -->

            <span
                v-if="latestAttendance"
                class="attendance-count"
            >
              <i class="pi pi-sync text-[9px]"></i>

              {{ latestAttendance.punch_count || 0 }}

              تردد
            </span>

          </div>


          <!-- وقتی تردد وجود دارد -->

          <template v-if="latestAttendance">

            <!-- ساعات ورود / خروج -->

            <div
                class="flex items-center
                       flex-wrap gap-2 mt-1"
            >

              <!-- ورود -->

              <div class="attendance-time">

                <i
                    class="pi pi-sign-in
                           text-emerald-500
                           text-[10px]"
                ></i>

                <span>
                  {{ latestAttendance.first_time || '--:--' }}
                </span>

              </div>


              <span class="text-slate-300">
                →
              </span>


              <!-- خروج -->

              <div class="attendance-time">

                <i
                    class="pi pi-sign-out
                           text-amber-500
                           text-[10px]"
                ></i>

                <span
                    v-if="
                      latestAttendance.last_time &&
                      latestAttendance.last_time !== '--:--'
                    "
                >
                  {{ latestAttendance.last_time }}
                </span>

                <span
                    v-else
                    class="text-[10px]
                           text-amber-600
                           font-medium"
                >
                  بدون خروج
                </span>

              </div>

            </div>


            <!-- تاریخ + وضعیت -->

            <div
                class="flex items-center
                       justify-between
                       gap-2 mt-1"
            >

              <p class="stat-meta">
                {{ latestAttendance.date }}
              </p>


              <!-- وضعیت حضور -->

              <span
                  class="attendance-status"
                  :class="attendanceStatus.class"
              >

                <i :class="attendanceStatus.icon"></i>

                {{ attendanceStatus.label }}

              </span>

            </div>

          </template>


          <!-- بدون تردد -->

          <template v-else>

            <p
                class="text-sm
                       text-slate-400
                       mt-1"
            >
              هنوز ترددی ثبت نشده است
            </p>

            <p class="stat-meta">
              امروز
            </p>

          </template>

        </div>

      </template>

    </div>


    <!-- ═══════════════════════════════
         ANNOUNCEMENTS
    ═══════════════════════════════ -->

    <div class="stat-card">

      <template v-if="loading">

        <div class="stat-icon-skeleton"></div>

        <div class="flex-1 space-y-2">

          <div class="skeleton w-16 h-3"></div>
          <div class="skeleton w-10 h-6"></div>
          <div class="skeleton w-20 h-2"></div>

        </div>

      </template>


      <template v-else>

        <div
            class="stat-icon
                   bg-amber-50
                   border-amber-100
                   text-amber-600"
        >
          <i class="pi pi-bell"></i>
        </div>

        <div class="min-w-0">

          <p class="stat-label">
            اعلانات
          </p>

          <div class="flex items-baseline gap-1">

            <span class="stat-value">
              {{ unreadAnnouncements }}
            </span>

            <span class="text-xs text-slate-400">
              مورد
            </span>

          </div>

          <p class="stat-meta">
            خوانده نشده
          </p>

        </div>

      </template>

    </div>

  </div>

</template>


<script setup>

import { computed } from 'vue'


const props = defineProps({

  attendanceRate: {
    type: [Number, String],
    default: 0
  },

  leaveDays: {
    type: [Number, String],
    default: 0
  },

  unreadAnnouncements: {
    type: Number,
    default: 0
  },

  latestAttendance: {
    type: Object,
    default: null
  },

  latestAttendanceLoading: {
    type: Boolean,
    default: false
  },

  loading: {
    type: Boolean,
    default: false
  }

})


/* ═══════════════════════════════════════
   وضعیت آخرین تردد
═══════════════════════════════════════ */

const attendanceStatus = computed(() => {

  if (!props.latestAttendance) {

    return {
      label: 'بدون تردد',
      icon: 'pi pi-minus',
      class: 'status-neutral'
    }

  }


  /*
   * حالت ایده‌آل:
   *
   * API باید last_punch_type را
   * به صورت entry / exit برگرداند.
   */

  const type =
      props.latestAttendance.last_punch_type


  if (type === 'entry') {

    return {

      label: 'داخل سازمان',

      icon: 'pi pi-sign-in',

      class: 'status-inside'

    }

  }


  if (type === 'exit') {

    return {

      label: 'خارج سازمان',

      icon: 'pi pi-sign-out',

      class: 'status-outside'

    }

  }


  /*
   * Fallback برای API فعلی
   *
   * اگر خروج ثبت نشده باشد،
   * احتمالاً آخرین تردد ورود است.
   */

  const lastTime =
      props.latestAttendance.last_time


  if (
      !lastTime ||
      lastTime === '--:--'
  ) {

    return {

      label: 'داخل سازمان',

      icon: 'pi pi-sign-in',

      class: 'status-inside'

    }

  }


  return {

    label: 'خارج سازمان',

    icon: 'pi pi-sign-out',

    class: 'status-outside'

  }

})


/* ═══════════════════════════════════════
   آیکون کارت
═══════════════════════════════════════ */

const attendanceIcon = computed(() => {

  if (!props.latestAttendance) {
    return 'pi pi-sign-in'
  }

  if (
      props.latestAttendance.last_punch_type === 'exit'
  ) {

    return 'pi pi-sign-out'

  }

  return 'pi pi-sign-in'

})


/* ═══════════════════════════════════════
   رنگ آیکون
═══════════════════════════════════════ */

const attendanceIconClass = computed(() => {

  if (!props.latestAttendance) {

    return [
      'bg-slate-50',
      'border-slate-100',
      'text-slate-400'
    ]

  }


  if (
      props.latestAttendance.last_punch_type === 'exit'
  ) {

    return [
      'bg-amber-50',
      'border-amber-100',
      'text-amber-600'
    ]

  }


  return [
    'bg-sky-50',
    'border-sky-100',
    'text-sky-600'
  ]

})

</script>


<style scoped>

.stat-card {

  @apply bg-white
  rounded-2xl
  border border-slate-200/70
  p-4 md:p-5
  flex items-center gap-3
  transition-all duration-300;

}


.stat-card:hover {

  @apply border-indigo-100 shadow-md;

  transform:
      translateY(-2px);

}


.stat-icon {

  @apply w-11 h-11
  md:w-12 md:h-12
  rounded-xl
  border
  flex items-center
  justify-center
  flex-shrink-0
  transition-transform duration-300;

}


.stat-card:hover .stat-icon {

  transform:
      scale(1.06);

}


.stat-icon i {

  @apply text-lg md:text-xl;

}


/* ═══════════════════════════════════════
   ATTENDANCE
═══════════════════════════════════════ */

.attendance-time {

  @apply flex
  items-center
  gap-1
  text-base
  md:text-lg
  font-bold
  text-slate-800;

}


.attendance-count {

  @apply inline-flex
  items-center
  gap-1
  px-1.5
  py-0.5
  rounded-full
  bg-indigo-50
  text-indigo-600
  text-[9px]
  font-medium
  whitespace-nowrap;

}


.attendance-status {

  @apply inline-flex
  items-center
  gap-1
  px-1.5
  py-0.5
  rounded-full
  text-[9px]
  font-medium
  whitespace-nowrap;

}


.status-inside {

  @apply bg-emerald-50
  text-emerald-600;

}


.status-outside {

  @apply bg-amber-50
  text-amber-600;

}


.status-neutral {

  @apply bg-slate-50
  text-slate-500;

}


/* ═══════════════════════════════════════
   TEXT
═══════════════════════════════════════ */

.stat-label {

  @apply text-xs
  text-slate-500
  mb-1;

}


.stat-value {

  @apply text-xl md:text-2xl
  font-bold
  text-slate-800
  tracking-tight;

}


.stat-meta {

  @apply text-[10px]
  md:text-[11px]
  text-slate-400
  mt-0.5;

}


/* ═══════════════════════════════════════
   SKELETON
═══════════════════════════════════════ */

.stat-icon-skeleton {

  @apply w-11 h-11
  md:w-12 md:h-12
  rounded-xl
  bg-slate-200
  flex-shrink-0
  relative
  overflow-hidden;

}


.stat-icon-skeleton::after {

  content: '';

  @apply absolute inset-0;

  background:
      linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 60%),
          transparent
      );

  animation:
      skeleton-shimmer 1.5s infinite;

}


.skeleton {

  @apply relative
  overflow-hidden
  rounded-md
  bg-slate-200/70;

}


.skeleton::after {

  content: '';

  @apply absolute inset-0;

  background:
      linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 60%),
          transparent
      );

  transform:
      translateX(-100%);

  animation:
      skeleton-shimmer 1.5s infinite;

}


@keyframes skeleton-shimmer {

  100% {

    transform:
        translateX(100%);

  }

}

</style>
