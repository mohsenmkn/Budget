<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="pi pi-sync text-indigo-500"></i>
          مدیریت همگام‌سازی
        </h1>
        <p class="text-sm text-gray-400 mt-1">وضعیت و مدیریت sync داده‌ها از گستراب</p>
      </div>
      <Button
          icon="pi pi-refresh"
          label="به‌روزرسانی"
          outlined
          @click="fetchStatus"
          :loading="loading"
      />
    </div>

    <!-- Stats Cards -->
    <div v-if="status" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-indigo-600">{{ status.positions }}</p>
        <p class="text-xs text-gray-400 mt-1">سمت‌ها</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ status.relatives }}</p>
        <p class="text-xs text-gray-400 mt-1">اعضای خانواده</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-purple-600">{{ status.units }}</p>
        <p class="text-xs text-gray-400 mt-1">واحدهای سازمانی</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-emerald-600">{{ status.today_success }}</p>
        <p class="text-xs text-gray-400 mt-1">sync موفق امروز</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-red-600">{{ status.today_failed }}</p>
        <p class="text-xs text-gray-400 mt-1">sync ناموفق امروز</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-sm font-bold text-gray-700 mt-2">{{ formatDateTime(status.last_sync) }}</p>
        <p class="text-xs text-gray-400 mt-1">آخرین sync</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <i class="pi pi-spinner pi-spin text-4xl text-indigo-500"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import hrService from '@/services/hrService'

const status = ref(null)
const loading = ref(true)

const fetchStatus = async () => {
  loading.value = true
  try {
    status.value = await hrService.getSyncStatus()
  } catch (error) {
    console.error('Fetch sync status error:', error)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('fa-IR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(fetchStatus)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>