<template>
  <div class="space-y-4 pt-4">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <i class="pi pi-spinner pi-spin text-3xl text-indigo-500"></i>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
      <i class="pi pi-exclamation-triangle"></i>
      {{ error }}
    </div>

    <template v-else>
      <!-- انتخاب ماه -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h4 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
          <i class="pi pi-clock text-indigo-500"></i>
          خلاصه تردد
        </h4>

        <Select
            v-if="availableMonths.length"
            v-model="selectedMonth"
            :options="availableMonths"
            optionLabel="MonthKey"
            optionValue="MonthKey"
            placeholder="انتخاب ماه"
            class="w-full sm:w-48"
            @change="fetchAttendance"
        />
      </div>

      <!-- کارت‌های خلاصه -->
      <div v-if="summary" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

        <!-- نرخ حضور -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div class="relative w-16 h-16 mx-auto mb-2">
            <svg class="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#e5e7eb" stroke-width="6" fill="none"/>
              <circle
                  cx="32" cy="32" r="28"
                  :stroke="attendanceRateColor"
                  stroke-width="6"
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - ((summary.attendance_rate || 0) / 100) * circumference"
              />
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {{ (summary.attendance_rate || 0).toFixed(1) }}%
            </span>
          </div>
          <p class="text-xs text-gray-400">نرخ حضور</p>
        </div>

        <!-- اضافه کار -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-lg font-bold text-green-600" dir="ltr">{{ formatMin(summary.total_overtime_minutes || summary.totalOvertimeMinutes || 0) }}</p>
          <p class="text-xs text-gray-400 mt-1">اضافه کار</p>
        </div>

        <!-- کسر کار -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-lg font-bold text-red-500" dir="ltr">{{ formatMin(summary.total_shortage_minutes || summary.totalShortageMinutes || 0) }}</p>
          <p class="text-xs text-gray-400 mt-1">کسر کار</p>
        </div>

        <!-- تاخیر -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-lg font-bold text-amber-500" dir="ltr">{{ formatMin(summary.total_late_minutes || summary.totalLateMinutes || 0) }}</p>
          <p class="text-xs text-gray-400 mt-1">تاخیر</p>
        </div>

        <!-- مرخصی -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-lg font-bold text-blue-500">{{ summary.leave_days || summary.leaveDays || 0 }} روز</p>
          <p class="text-xs text-gray-400 mt-1">مرخصی</p>
        </div>

        <!-- مأموریت -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-lg font-bold text-purple-500">{{ summary.mission_days || summary.missionDays || 0 }} روز</p>
          <p class="text-xs text-gray-400 mt-1">مأموریت</p>
        </div>
      </div>

      <!-- آمار روزهای کاری -->
      <div v-if="summary" class="grid grid-cols-3 md:grid-cols-7 gap-2 text-center">
        <div class="bg-gray-50 rounded-lg p-2">
          <p class="text-sm font-bold text-gray-700">{{ summary.total_days || summary.totalDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">کل روزها</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-2">
          <p class="text-sm font-bold text-gray-700">{{ summary.work_days || summary.workDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">روز کاری</p>
        </div>
        <div class="bg-green-50 rounded-lg p-2">
          <p class="text-sm font-bold text-green-600">{{ summary.presence_days || summary.presenceDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">حضور</p>
        </div>
        <div class="bg-red-50 rounded-lg p-2">
          <p class="text-sm font-bold text-red-500">{{ summary.absence_days || summary.absenceDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">غیبت</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-2">
          <p class="text-sm font-bold text-blue-500">{{ summary.leave_days || summary.leaveDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">مرخصی</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-2">
          <p class="text-sm font-bold text-purple-500">{{ summary.mission_days || summary.missionDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">مأموریت</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-2">
          <p class="text-sm font-bold text-gray-600">{{ summary.holiday_days || summary.holidayDays || 0 }}</p>
          <p class="text-[10px] text-gray-400">تعطیل</p>
        </div>
      </div>

      <!-- جدول جزئیات روزانه -->
      <div v-if="daily.length" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
            <i class="pi pi-list text-indigo-500"></i>
            جزئیات روزانه
          </h4>
          <span class="text-xs text-gray-400">{{ daily.length }} روز</span>
        </div>

        <DataTable
            :value="daily"
            stripedRows
            scrollable
            scrollHeight="420px"
            size="small"
            responsiveLayout="scroll"
        >
          <!-- تاریخ -->
          <Column field="date" header="تاریخ" style="min-width: 105px">
            <template #body="{ data }">
              <span class="text-sm text-gray-700" dir="ltr">{{ data.date }}</span>
            </template>
          </Column>

          <!-- روز هفته -->
          <Column field="weekday" header="روز" style="min-width: 70px">
            <template #body="{ data }">
              <span class="text-sm text-gray-600">{{ data.weekday }}</span>
            </template>
          </Column>

          <!-- وضعیت -->
          <Column field="status" header="وضعیت" style="min-width: 70px">
            <template #body="{ data }">
              <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
                  style="font-size: 11px"
              />
            </template>
          </Column>

          <!-- ✅ ورود -->
          <Column field="first_time" header="ورود" style="width: 80px">
            <template #body="{ data }">
              <span
                  class="text-sm font-medium"
                  :class="data.first_time !== '--:--' ? 'text-green-600' : 'text-gray-300'"
                  dir="ltr"
              >
                {{ data.first_time }}
              </span>
            </template>
          </Column>

          <!-- ✅ خروج -->
          <Column field="last_time" header="خروج" style="width: 80px">
            <template #body="{ data }">
              <span
                  class="text-sm font-medium"
                  :class="data.last_time !== '--:--' ? 'text-red-500' : 'text-gray-300'"
                  dir="ltr"
              >
                {{ data.last_time }}
              </span>
            </template>
          </Column>

          <!-- ✅ تعداد پانچ -->
          <Column field="punch_count" header="پانچ" style="width: 70px">
            <template #body="{ data }">
              <div class="flex items-center justify-center gap-1">
                <span class="text-sm text-gray-600">{{ data.punch_count || 0 }}</span>
                <!-- ⚠️ هشدار پانچ ناقص -->
                <i
                    v-if="data.punch_count > 0 && data.punch_count % 2 !== 0"
                    class="pi pi-exclamation-triangle text-amber-400 text-xs"
                    v-tooltip.top="'تعداد پانچ فرد است — احتمالاً یک ورود یا خروج ثبت نشده'"
                ></i>
              </div>
            </template>
          </Column>

          <!-- حضور -->
          <Column field="presence_formatted" header="حضور" style="width: 85px">
            <template #body="{ data }">
              <span class="text-sm text-gray-700 font-medium" dir="ltr">{{ data.presence_formatted }}</span>
            </template>
          </Column>

          <!-- اضافه‌کار -->
          <Column field="overtime_formatted" header="اضافه‌کار" style="width: 90px">
            <template #body="{ data }">
              <span
                  class="text-sm font-medium"
                  :class="data.overtime_minutes > 0 ? 'text-green-600' : 'text-gray-300'"
                  dir="ltr"
              >
                {{ data.overtime_formatted }}
              </span>
            </template>
          </Column>

          <!-- کسر کار -->
          <Column field="shortage_formatted" header="کسر کار" style="width: 90px">
            <template #body="{ data }">
              <span
                  class="text-sm font-medium"
                  :class="data.shortage_minutes > 0 ? 'text-red-500' : 'text-gray-300'"
                  dir="ltr"
              >
                {{ data.shortage_formatted }}
              </span>
            </template>
          </Column>

          <!-- تاخیر -->
          <Column field="late_formatted" header="تاخیر" style="width: 80px">
            <template #body="{ data }">
              <span
                  class="text-sm font-medium"
                  :class="data.late_minutes > 0 ? 'text-amber-500' : 'text-gray-300'"
                  dir="ltr"
              >
                {{ data.late_formatted }}
              </span>
            </template>
          </Column>

          <!-- خالی -->
          <template #empty>
            <div class="text-center py-8 text-gray-400 text-sm">
              رکوردی برای این ماه ثبت نشده است.
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Empty daily -->
      <div v-else class="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
        <i class="pi pi-clock text-3xl mb-2 block"></i>
        داده‌ای برای این ماه یافت نشد.
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import hrService from '@/services/hrService'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const loading = ref(true)
const error = ref(null)
const summary = ref(null)
const daily = ref([])
const availableMonths = ref([])
const selectedMonth = ref(null)

// محیط دایره برای نمودار نرخ حضور
const circumference = 2 * Math.PI * 28

const attendanceRateColor = computed(() => {
  const rate = summary.value?.attendance_rate || summary.value?.attendanceRate || 0
  if (rate >= 90) return '#22c55e'  // سبز
  if (rate >= 75) return '#f59e0b'  // زرد
  return '#ef4444'                   // قرمز
})

// ── تبدیل دقیقه به HH:MM ──
const formatMin = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// ── دریافت تردد ──
const fetchAttendance = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await hrService.getEmployeeAttendance(props.userId, selectedMonth.value)

    if (data.error || data.message) {
      error.value = data.error || data.message
      return
    }

    summary.value = data.summary
    daily.value = data.daily || []
    availableMonths.value = data.available_months || []

    // اگر ماه انتخاب نشده، ماه پیش‌فرض را انتخاب کن
    if (!selectedMonth.value && availableMonths.value.length) {
      selectedMonth.value = availableMonths.value[0]?.MonthKey || availableMonths.value[0]
    }
  } catch (e) {
    console.error('Fetch attendance error:', e)
    error.value = 'خطا در دریافت اطلاعات تردد.'
  } finally {
    loading.value = false
  }
}

// ── رنگ وضعیت ──
const getStatusSeverity = (status) => {
  const map = {
    'حضور': 'success',
    'غیبت': 'danger',
    'مرخصی': 'info',
    'مأموریت': 'warning',
    'تعطیل': 'secondary',
    'استراحت': 'secondary',
    'حضور در تعطیل': 'success',
    'بدون ثبت': 'secondary',
  }
  return map[status] || 'secondary'
}

onMounted(fetchAttendance)
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-size: 12px;
  padding: 0.5rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.4rem 0.5rem;
}
</style>