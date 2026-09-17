<template>
  <div class="space-y-4 pt-4">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <i class="pi pi-spinner pi-spin text-3xl text-indigo-500"></i>
    </div>

    <template v-else>
      <!-- Header + دکمه sync -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
        <h4 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
          <i class="pi pi-book text-indigo-500"></i>
          دوره‌های آموزشی<Button
            label="همگام‌سازی مجدد"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            size="small"
            :loading="syncing"
            @click="syncTraining"
        /> <Button
            label="تکمیل تاریخ‌ها"
            icon="pi pi-calendar-plus"
            severity="help"
            outlined
            size="small"
            :loading="enriching"
            @click="enrichDates"
        />

        </h4>
      </div>



      <!-- کارت‌های خلاصه -->
      <div v-if="summary" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-indigo-600">{{ summary.total_courses }}</p>
          <p class="text-xs text-gray-400 mt-1">تعداد دوره</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ summary.total_hours }}</p>
          <p class="text-xs text-gray-400 mt-1">ساعت آموزشی</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-emerald-600">{{ summary.completed_count }}</p>
          <p class="text-xs text-gray-400 mt-1">تکمیل شده</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-amber-500">{{ summary.in_progress_count }}</p>
          <p class="text-xs text-gray-400 mt-1">در حال برگزاری</p>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!trainings.length" class="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100">
        <i class="pi pi-book text-4xl mb-3 block"></i>
        دوره آموزشی ثبت نشده است.
      </div>

      <!-- جدول دوره‌ها -->
      <DataTable
          v-else
          :value="trainings"
          stripedRows
          scrollable
          scrollHeight="500px"
          size="small"
          responsiveLayout="scroll"
          :paginator="trainings.length > 10"
          :rows="10"
      >
        <Column field="course_title" header="عنوان دوره" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs flex-shrink-0">
                <i class="pi pi-book"></i>
              </span>
              <div>
                <span class="font-semibold text-gray-800 text-sm block">{{ data.course_title }}</span>
                <span class="text-xs text-gray-400" dir="ltr">کد: {{ data.course_code }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="date_label" header="تاریخ برگزاری" style="min-width: 140px">
          <template #body="{ data }">
        <span class="text-sm text-gray-600 flex items-center gap-1">
            <i class="pi pi-calendar text-gray-400 text-xs"></i>
            {{ data.date_label || 'نامشخص' }}
        </span>
          </template>
        </Column>

        <Column field="session_duration" header="مدت جلسه" style="width: 250px">
          <template #body="{ data }">
            <span class="text-sm font-mono text-gray-700" dir="ltr">
              {{ data.session_duration || '—' }}
            </span>
          </template>
        </Column>

        <Column field="performance_hours" header="ساعت عملکرد" style="width: 280px">
          <template #body="{ data }">
            <span class="text-sm font-bold text-green-600">
              {{ data.performance_hours }} ساعت
            </span>
          </template>
        </Column>


        <Column field="post_title" header="پست سازمانی" style="min-width: 200px">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.post_title || '—' }}</span>
          </template>
        </Column>

        <Column field="status" header="وضعیت" style="width: 130px">
          <template #body="{ data }">
            <Tag
                :value="data.status"
                :severity="data.status_severity"
                style="font-size: 11px"
            />
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8 text-gray-400 text-sm">
            دوره‌ای یافت نشد.
          </div>
        </template>
      </DataTable>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import hrService from '@/services/hrService'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const toast = useToast()

const loading = ref(true)
const syncing = ref(false)
const trainings = ref([])
const summary = ref(null)



const enriching = ref(false)

const enrichDates = async () => {
  enriching.value = true
  try {
    const result = await hrService.enrichTrainingDates(props.userId)
    toast.add({ severity: 'success', summary: 'موفق', detail: result.message, life: 3000 })
    await fetchTrainings()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'خطا در تکمیل تاریخ‌ها', life: 5000 })
  } finally {
    enriching.value = false
  }
}

const fetchTrainings = async () => {
  loading.value = true
  try {
    const data = await hrService.getEmployeeTraining(props.userId)
    trainings.value = data.trainings || []
    summary.value = data.summary || null
  } catch (error) {
    console.error('Fetch trainings error:', error)
  } finally {
    loading.value = false
  }
}

const syncTraining = async () => {
  syncing.value = true
  try {
    const result = await hrService.syncEmployeeTraining(props.userId)
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: result.message,
      life: 3000,
    })
    await fetchTrainings()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: error.response?.data?.message || 'خطا در همگام‌سازی',
      life: 5000,
    })
  } finally {
    syncing.value = false
  }
}

onMounted(fetchTrainings)
</script>