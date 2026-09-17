<template>
  <div class="space-y-6" dir="rtl">
    <section class="rounded-2xl bg-white border border-slate-200 p-6">
      <h2 class="text-2xl font-bold text-slate-800">سلام {{ user?.name || 'کاربر گرامی' }}</h2>
      <p class="mt-2 text-slate-500">به سامانه سازمانی خوش آمدید</p>
      <p class="mt-3 text-sm text-slate-500">{{ today }}</p>
      <div class="flex flex-wrap gap-2 mt-4"><Tag v-for="role in roles" :key="role" :value="role" /></div>
    </section>
    <section>
      <h2 class="font-bold text-lg mb-3">دسترسی سریع</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <RouterLink v-for="item in accessibleModules" :key="item.key" :to="item.to"
          class="flex items-center gap-3 p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors">
          <component :is="item.icon" class="text-blue-600" :size="24" />
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>
      </div>
      <p v-if="!accessibleModules.length" class="text-slate-500">دسترسی ماژولی برای حساب شما تعریف نشده است.</p>
    </section>
    <section class="rounded-2xl bg-white border border-slate-200 p-6">
      <div class="flex items-center justify-between gap-3 mb-4">
        <h2 class="font-bold text-lg">آخرین تردد من</h2>
        <Button icon="pi pi-refresh" text rounded aria-label="بروزرسانی تردد" :loading="loading" @click="loadAttendance" />
      </div>
      <p v-if="loading" class="text-slate-500">در حال دریافت اطلاعات...</p>
      <Message v-else-if="error" severity="warn" :closable="false">{{ error }}</Message>
      <dl v-else-if="attendance?.date" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><dt class="text-sm text-slate-500">تاریخ</dt><dd class="mt-1">{{ attendance.date }}</dd></div>
        <div><dt class="text-sm text-slate-500">اولین ورود</dt><dd class="mt-1">{{ attendance.first_time || '—' }}</dd></div>
        <div><dt class="text-sm text-slate-500">آخرین خروج</dt><dd class="mt-1">{{ attendance.has_exit ? attendance.last_time : 'ثبت نشده' }}</dd></div>
      </dl>
      <p v-else class="text-slate-500">ترددی برای نمایش وجود ندارد.</p>
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardModules } from '@/composables/useDashboardModules'
import api from '@/api/axios'
const { accessibleModules, user, roles } = useDashboardModules()
const today = new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const attendance = ref(null)
const loading = ref(false)
const error = ref('')
async function loadAttendance() {
  error.value = ''
  if (!user.value?.personnel_code) {
    error.value = 'کد پرسنلی برای حساب شما تعریف نشده است.'
    return
  }
  loading.value = true
  try {
    const { data } = await api.get('/attendance/latest')
    attendance.value = data.data
  } catch (e) {
    error.value = e.response?.data?.message || 'دریافت اطلاعات تردد انجام نشد. دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}
onMounted(loadAttendance)
</script>
