<template>
  <div class="space-y-4 pt-4" dir="rtl">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <i class="pi pi-spinner pi-spin text-3xl text-indigo-500"></i>
    </div>

    <!-- Empty -->
    <div v-else-if="!history.length" class="text-center py-10 text-gray-400">
      <i class="pi pi-history text-4xl mb-3 block"></i>
      تاریخچه‌ای برای این کارمند ثبت نشده است.
    </div>

    <!-- Timeline — راست‌چین -->
    <Timeline
        v-else
        :value="history"
        layout="vertical"
        align="right"
        class="rtl-timeline"
    >
      <!-- Marker -->
      <template #marker="slotProps">
        <span
            class="w-4 h-4 rounded-full flex items-center justify-center shadow-md z-10"
            :class="slotProps.item.is_current
                ? 'bg-green-500 ring-4 ring-green-100'
                : 'bg-indigo-400 ring-2 ring-indigo-50'"
        ></span>
      </template>

      <!-- Content -->
      <template #content="slotProps">
        <div
            class="rounded-xl border p-4 transition-all duration-200 hover:shadow-md mb-3"
            :class="slotProps.item.is_current
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-100'"
        >
          <!-- Header: سمت + وضعیت -->
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-gray-800 text-sm">
              {{ slotProps.item.post_title || 'بدون سمت' }}
            </span>
            <Tag
                v-if="slotProps.item.is_current"
                value="سمت فعلی"
                severity="success"
                style="font-size: 10px"
            />
          </div>

          <!-- شغل -->
          <div class="flex items-center gap-2 text-gray-600 text-xs mb-3">
            <i class="pi pi-briefcase text-indigo-400"></i>
            <span>{{ slotProps.item.job_title || '—' }}</span>
          </div>

          <!-- بازه زمانی + مدت + تعداد حکم -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div class="flex items-center gap-2 text-gray-500 bg-white/60 rounded-lg px-2 py-1.5">
              <i class="pi pi-calendar text-gray-400"></i>
              <span>{{ formatDate(slotProps.item.start_date) }}</span>
              <i class="pi pi-arrow-left text-[9px] text-gray-300"></i>
              <span>{{ slotProps.item.is_current ? 'اکنون' : formatDate(slotProps.item.end_date) }}</span>
            </div>

            <div class="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50/50 rounded-lg px-2 py-1.5">
              <i class="pi pi-clock"></i>
              <span>{{ slotProps.item.duration || '—' }}</span>
            </div>

            <!-- ✅ قابل کلیک — جزئیات احکام -->
            <button
                class="flex items-center gap-2 text-purple-600 bg-purple-50/50 rounded-lg px-2 py-1.5 hover:bg-purple-100 transition-colors cursor-pointer"
                @click="openDetails(slotProps.item)"
            >
              <i class="pi pi-file"></i>
              <span>{{ slotProps.item.statute_count }} حکم</span>
              <i class="pi pi-chevron-left text-[8px]"></i>
            </button>
          </div>
        </div>
      </template>
    </Timeline>

    <!-- ✅ Dialog جزئیات احکام -->
    <Dialog
        v-model:visible="detailsDialogVisible"
        :header="detailsDialogTitle"
        modal
        :style="{ width: '95vw', maxWidth: '650px' }"
        :breakpoints="{ '768px': '95vw' }"
    >
      <!-- Loading جزئیات -->
      <div v-if="detailsLoading" class="flex items-center justify-center py-10">
        <i class="pi pi-spinner pi-spin text-3xl text-indigo-500"></i>
      </div>

      <!-- لیست احکام -->
      <div v-else class="space-y-3" dir="rtl">
        <div
            v-for="(item, index) in detailsList"
            :key="item.gt_statute_id"
            class="rounded-xl border p-4 relative"
            :class="item.is_current
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-100'"
        >
          <!-- Badge شماره حکم -->
          <span
              class="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold"
              :class="item.is_current
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-100 text-indigo-600'"
          >
            حکم #{{ detailsList.length - index }}
          </span>

          <div class="space-y-2 text-sm mt-1">
            <!-- سمت و شغل -->
            <div class="flex items-center gap-2 text-gray-800 font-semibold">
              <i class="pi pi-briefcase text-indigo-500 text-xs"></i>
              <span>{{ item.post_title }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600 text-xs">
              <i class="pi pi-star text-gray-400 text-xs"></i>
              <span>{{ item.job_title || '—' }}</span>
            </div>

            <!-- تاریخ‌ها -->
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div class="flex items-center gap-1.5">
                <i class="pi pi-calendar text-gray-400"></i>
                <span>صدور: {{ formatDate(item.issue_date) }}</span>
              </div>
              <div v-if="item.apply_date" class="flex items-center gap-1.5">
                <i class="pi pi-play text-gray-400"></i>
                <span>اجرا: {{ formatDate(item.apply_date) }}</span>
              </div>
              <div v-if="item.statute_number" class="flex items-center gap-1.5">
                <i class="pi pi-hashtag text-gray-400"></i>
                <span>شماره: {{ item.statute_number }}</span>
              </div>
              <div v-if="item.is_current" class="flex items-center gap-1.5 text-green-600 font-semibold">
                <i class="pi pi-check-circle"></i>
                <span>حکم فعلی</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <Button label="بستن" severity="secondary" outlined @click="detailsDialogVisible = false" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import hrService from '@/services/hrService'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const history = ref([])
const loading = ref(true)

// ── جزئیات Dialog ──
const detailsDialogVisible = ref(false)
const detailsLoading = ref(false)
const detailsList = ref([])
const selectedItem = ref(null)

const detailsDialogTitle = computed(() => {
  if (!selectedItem.value) return 'جزئیات احکام'
  return `جزئیات احکام: ${selectedItem.value.post_title || 'بدون سمت'}`
})

// ── دریافت تاریخچه گروه‌بندی شده ──
const fetchHistory = async () => {
  loading.value = true
  try {
    const data = await hrService.getStatuteHistory(props.userId)
    history.value = data.history || []
  } catch (error) {
    console.error('Fetch history error:', error)
  } finally {
    loading.value = false
  }
}

// ── دریافت جزئیات یک دوره ──
const openDetails = async (item) => {
  // ✅ Debug: بررسی مقادیر قبل از ارسال
  console.log('🔍 openDetails item:', item)
  console.log('🔍 post_ref:', item.post_ref, 'job_ref:', item.job_ref)

  if (!item.post_ref || !item.job_ref) {
    console.error('❌ post_ref یا job_ref موجود نیست!')
    return
  }

  selectedItem.value = item
  detailsDialogVisible.value = true
  detailsLoading.value = true
  detailsList.value = []

  try {
    const data = await hrService.getStatuteHistoryDetails(
        props.userId,
        item.post_ref,
        item.job_ref
    )
    detailsList.value = data.details || []
  } catch (error) {
    console.error('Fetch details error:', error)
  } finally {
    detailsLoading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(fetchHistory)
</script>

<style scoped>
/* ── راست‌چینش Timeline ── */
:deep(.rtl-timeline .p-timeline-event-opposite) {
  display: none;
}

:deep(.rtl-timeline .p-timeline-event-separator) {
  flex-direction: row-reverse;
}

:deep(.rtl-timeline .p-timeline-event-marker) {
  order: 2;
}

:deep(.rtl-timeline .p-timeline-event-content) {
  order: 1;
  text-align: right;
  padding-right: 1rem;
  padding-left: 0;
}

:deep(.rtl-timeline .p-timeline-event-connector) {
  right: 0.5rem;
  left: auto;
}

:deep(.rtl-timeline) {
  direction: rtl;
}

/* خط عمودی Timeline سمت راست */
:deep(.rtl-timeline.p-timeline-vertical .p-timeline-event-separator) {
  flex-direction: row;
}

:deep(.rtl-timeline.p-timeline-vertical .p-timeline-event-marker) {
  margin-left: 0;
  margin-right: 0;
}
</style>