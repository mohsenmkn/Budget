<template>
  <div class="space-y-4 pt-4">

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="dashboard-card p-5"><div class="skeleton w-full h-24"></div></div>
      <div class="dashboard-card p-5"><div class="skeleton w-full h-40"></div></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!assessments.length" class="dashboard-card p-12 text-center">
      <i class="pi pi-clipboard text-4xl text-slate-200 mb-3 block"></i>
      <p class="text-sm text-slate-400">هنوز ارزیابی برای این کارمند ثبت نشده است.</p>
    </div>

    <template v-else>
      <!-- ═══ نوار ابزار: تعداد + باز/بست همه ═══ -->
      <div class="flex items-center justify-between">
      <span class="text-xs text-slate-500 flex items-center gap-1">
        <i class="pi pi-list text-indigo-400"></i>
        {{ assessments.length }} ارزیابی ثبت شده
      </span>
        <div class="flex gap-2">
          <Button label="باز کردن همه" icon="pi pi-chevron-down" size="small"
                  severity="secondary" outlined @click="expandAll" />
          <Button label="بستن همه" icon="pi pi-chevron-up" size="small"
                  severity="secondary" outlined @click="collapseAll" />
        </div>
      </div>

      <!-- ═══ کارت هر ارزیابی ═══ -->
      <section
          v-for="a in assessments"
          :key="a.id"
          class="dashboard-card overflow-hidden"
      >
        <!-- هدر -->
        <button
            type="button"
            class="w-full text-right p-5 flex items-center justify-between gap-3
                 bg-gradient-to-br from-indigo-50/70 to-white
                 border-b border-indigo-100/70 hover:bg-indigo-50 transition-colors"
            @click="toggle(a.id)"
        >
          <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <i class="pi pi-clipboard text-indigo-600"></i>
          </span>
            <div>
              <h3 class="font-bold text-slate-800 text-sm">{{ a.cycle_title || 'ارزیابی شایستگی' }}</h3>
              <p class="text-xs text-slate-500 mt-1">
                {{ a.post_title }} • ارزیاب: {{ a.evaluator_name || '—' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Tag :value="a.status_label" :severity="statusSeverity(a.status)" />
            <span
                class="w-8 h-8 rounded-full bg-white border border-slate-200
                     flex items-center justify-center text-slate-400
                     transition-transform duration-300"
                :class="{ 'rotate-180': openCards[a.id] }"
            >
            <i class="pi pi-chevron-down text-xs"></i>
          </span>
          </div>
        </button>

        <!-- بدنه بازشو -->
        <div class="collapse-grid" :class="{ 'is-open': openCards[a.id] }">
          <div class="overflow-hidden">
            <div class="p-5 space-y-5">

              <!-- آمار -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-indigo-50/60 rounded-xl p-3 text-center">
                  <p class="text-xl font-bold text-indigo-600">{{ a.average_score }}</p>
                  <p class="text-[11px] text-slate-500 mt-1">میانگین امتیاز</p>
                </div>
                <div class="bg-red-50/60 rounded-xl p-3 text-center">
                  <p class="text-xl font-bold text-red-500">{{ a.total_weighted_gap }}</p>
                  <p class="text-[11px] text-slate-500 mt-1">گپ وزن‌دار</p>
                </div>
                <div class="bg-amber-50/60 rounded-xl p-3 text-center">
                  <p class="text-xl font-bold text-amber-600">{{ a.gaps_count }}</p>
                  <p class="text-[11px] text-slate-500 mt-1">تعداد گپ</p>
                </div>
                <div class="bg-rose-50/60 rounded-xl p-3 text-center">
                  <p class="text-xl font-bold text-rose-600">{{ a.critical_count }}</p>
                  <p class="text-[11px] text-slate-500 mt-1">گپ بحرانی</p>
                </div>
              </div>

              <!-- گپ‌ها به تفکیک منظر -->
              <div v-if="a.categories.length" class="space-y-4">
                <div v-for="cat in a.categories" :key="cat.title">
                  <h4 class="text-xs font-bold text-slate-500 mb-2">{{ cat.title }}</h4>
                  <div class="space-y-2">
                    <div
                        v-for="g in cat.gaps"
                        :key="g.id"
                        class="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <p class="text-sm text-slate-700 flex-1">{{ g.question }}</p>
                        <Tag
                            :value="g.severity"
                            :severity="g.severity === 'بحرانی' ? 'danger' : g.severity === 'عمده' ? 'warning' : 'info'"
                            style="font-size:10px"
                        />
                      </div>
                      <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>مطلوب: <b class="text-slate-700">{{ g.required_score }}</b></span>
                        <span>واقعی: <b class="text-slate-700">{{ g.actual_score }}</b></span>
                        <span>گپ: <b class="text-red-500">{{ g.gap }}</b></span>
                        <span>وزن‌دار: <b class="text-amber-600">{{ g.weighted_gap }}</b></span>
                      </div>

                      <!-- اقدامات اصلاحی -->
                      <div v-if="g.actions.length" class="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                        <div
                            v-for="act in g.actions"
                            :key="act.title"
                            class="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <i class="pi pi-wrench text-indigo-400"></i>
                          <span>{{ act.title }}</span>
                          <Tag v-if="act.method" :value="act.method" severity="secondary" style="font-size:9px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-6 text-slate-400 text-sm">
                <i class="pi pi-check-circle text-emerald-400 text-2xl mb-2 block"></i>
                گپی ثبت نشده است — سطح فعلی برابر یا بالاتر از مطلوب است. 🎉
              </div>

            </div>
          </div>
        </div>
      </section>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import assessmentService from '@/services/assessmentService'

const props = defineProps({
  userId: { type: [Number, String], required: true },
})

const loading = ref(true)
const assessments = ref([])
const openCards = reactive({})

const toggle = (id) => { openCards[id] = !openCards[id] }

// ✅ باز کردن همه کارت‌ها
const expandAll = () => {
  assessments.value.forEach(a => { openCards[a.id] = true })
}

// ✅ بستن همه کارت‌ها
const collapseAll = () => {
  assessments.value.forEach(a => { openCards[a.id] = false })
}

const statusSeverity = (s) => ({
  draft: 'warning',
  submitted: 'info',
  approved: 'success',
  rejected: 'danger',
}[s] || 'secondary')

const fetchData = async () => {
  loading.value = true
  try {
    const data = await assessmentService.getEmployeeReport(props.userId)
    assessments.value = data.assessments || []

    // ✅ پیش‌فرض: همه ارزیابی‌ها باز نمایش داده شوند
    assessments.value.forEach(a => { openCards[a.id] = true })
  } catch (e) {
    console.error('Fetch assessment report error:', e)
    assessments.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.dashboard-card { @apply bg-white rounded-2xl border border-slate-200/70 overflow-hidden; box-shadow: 0 1px 3px rgb(15 23 42 / 4%); }
.skeleton { @apply relative overflow-hidden rounded-lg bg-slate-200/70; }
.skeleton::after {
  content: ''; @apply absolute inset-0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 55%), transparent);
  animation: skeleton-shimmer 1.5s infinite;
}
@keyframes skeleton-shimmer { 100% { transform: translateX(100%); } }
.collapse-grid { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(.4,0,.2,1); }
.collapse-grid.is-open { grid-template-rows: 1fr; }
.collapse-grid > div { overflow: hidden; }
</style>