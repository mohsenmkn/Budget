<!-- resources/js/views/User/Dashboard.vue -->
<template>
  <div class="dashboard-content">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="page-title">داشبورد مدیریتی</h1>
        <p class="page-subtitle">خلاصه کلی وضعیت پروژه‌ها و فعالیت‌ها</p>
      </div>
      <div class="header-actions">
        <Button
            icon="pi pi-refresh"
            text
            rounded
            @click="refreshData"
            :loading="loading"
            v-tooltip.top="'بروزرسانی'"
        />
        <span class="last-update">آخرین بروزرسانی: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <ProgressSpinner />
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Summary Cards -->
      <div class="summary-grid">
        <div
            v-for="item in summaryItems"
            :key="item.label"
            class="summary-card"
            :style="{ '--card-color': item.color }"
        >
          <div class="card-icon">
            <i :class="item.icon" />
          </div>
          <div class="card-content">
            <span class="card-value">{{ formatNumber(item.value) }}</span>
            <span class="card-label">{{ item.label }}</span>
            <span v-if="item.sub" class="card-sub">{{ item.sub }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="charts-row">
        <!-- Project Status Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>وضعیت پروژه‌ها</h3>
            <span class="chart-badge">توزیع</span>
          </div>
          <div class="chart-container">
            <Chart
                v-if="projectStatusData.labels?.length > 0"
                type="doughnut"
                :data="projectStatusData"
                :options="doughnutOptions"
                class="chart"
            />
            <div v-else class="chart-placeholder">
              <i class="pi pi-chart-pie text-4xl text-muted-color" />
              <p>داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </div>
        </div>

        <!-- Budget by Category -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>توزیع بودجه</h3>
            <span class="chart-badge">بر اساس نوع</span>
          </div>
          <div class="chart-container">
            <Chart
                v-if="budgetCategoryData.labels?.length > 0"
                type="pie"
                :data="budgetCategoryData"
                :options="doughnutOptions"
                class="chart"
            />
            <div v-else class="chart-placeholder">
              <i class="pi pi-chart-pie text-4xl text-muted-color" />
              <p>داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="charts-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h3>روند ۳۰ روز اخیر</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-dot projects-dot"></span>
                پروژه‌ها
              </span>
              <span class="legend-item">
                <span class="legend-dot contracts-dot"></span>
                قراردادها
              </span>
            </div>
          </div>
          <div class="chart-container">
            <Chart
                v-if="weeklyData.labels?.length > 0"
                type="line"
                :data="weeklyData"
                :options="lineOptions"
                class="chart"
            />
            <div v-else class="chart-placeholder">
              <i class="pi pi-chart-line text-4xl text-muted-color" />
              <p>داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </div>
        </div>
      </div>

      <!--Warehouse-->
      <div class="inventory-section">
        <DashboardInventoryWidgets />
      </div>

      <!-- Projects Progress -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>پیشرفت پروژه‌ها</h3>
          <span class="chart-badge">{{ progressData.length }} پروژه</span>
        </div>
        <div class="progress-list">
          <div v-if="progressData.length === 0" class="empty-state">
            <p>هیچ پروژه‌ای یافت نشد</p>
          </div>
          <div
              v-for="project in progressData"
              :key="project.project_id"
              class="progress-item"
          >
            <div class="progress-header">
              <div class="project-info">
                <span class="project-name">{{ project.project_name }}</span>
                <span class="project-tasks">{{ project.completed_tasks }}/{{ project.total_tasks }} تسک</span>
              </div>
              <span class="project-progress" :class="getProgressTextClass(project.progress)">
                {{ project.progress }}%
              </span>
            </div>
            <div class="progress-track">
              <div
                  class="progress-fill"
                  :style="{ width: project.progress + '%' }"
                  :class="getProgressClass(project.progress)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>پروژه‌های اخیر</h3>
          <Button
              label="مشاهده همه"
              text
              size="small"
              @click="$router.push({ name: 'projects.index' })"
          />
        </div>
        <DataTable
            :value="recentProjects"
            stripedRows
            class="recent-table"
            :loading="loading"
        >
          <Column field="name" header="نام پروژه" />
          <Column field="code" header="کد" />
          <Column field="manager" header="مدیر پروژه" />
          <Column field="status_label" header="وضعیت">
            <template #body="{ data }">
              <Tag :value="data.status_label" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column header="پیشرفت">
            <template #body="{ data }">
              <ProgressBar :value="data.progress || 0" :showValue="true" />
            </template>
          </Column>
          <Column header="عملیات">
            <template #body="{ data }">
              <Button
                  icon="pi pi-eye"
                  text
                  rounded
                  severity="info"
                  @click="$router.push({ name: 'projects.detail', params: { id: data.id } })"
                  v-tooltip.top="'مشاهده'"
              />
            </template>
          </Column>
        </DataTable>
      </div>




    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { dashboardOmraniService } from '@/services/dashboardOmraniService.js'
import DashboardInventoryWidgets from "@/views/Warehouse/DashboardInventoryWidgets.vue";





const router = useRouter()
const toast = useToast()

// State
const loading = ref(false)
const summary = ref({})
const projectStatus = ref({})
const financialStats = ref({})
const recentProjects = ref([])
const progressData = ref([])
const weeklyStats = ref({})
const budgetCategory = ref({})
const lastUpdate = ref(new Date().toLocaleTimeString('fa-IR'))
const chartsReady = ref(false) // ✅ اضافه شده

// Summary Items
const summaryItems = computed(() => [
  {
    label: 'کل پروژه‌ها',
    value: summary.value.total_projects || 0,
    icon: 'pi pi-folder-open',
    color: '#3b82f6'
  },
  {
    label: 'پروژه‌های فعال',
    value: summary.value.active_projects || 0,
    icon: 'pi pi-check-circle',
    color: '#22c55e'
  },
  {
    label: 'قراردادهای فعال',
    value: summary.value.active_contracts || 0,
    icon: 'pi pi-file-pdf',
    color: '#f59e0b'
  },
  {
    label: 'کل تسک‌ها',
    value: summary.value.total_tasks || 0,
    icon: 'pi pi-list',
    color: '#8b5cf6'
  },
  {
    label: 'تسک‌های تکمیل شده',
    value: summary.value.completed_tasks || 0,
    icon: 'pi pi-check',
    color: '#10b981'
  },
  {
    label: 'کل اسناد',
    value: summary.value.total_documents || 0,
    icon: 'pi pi-file',
    color: '#ec4899'
  }
])

// Chart Data
const projectStatusData = computed(() => ({
  labels: projectStatus.value.labels || [],
  datasets: [
    {
      data: projectStatus.value.data || [],
      backgroundColor: projectStatus.value.colors || [],
      borderWidth: 0,
    }
  ]
}))

const budgetCategoryData = computed(() => ({
  labels: budgetCategory.value.labels || [],
  datasets: [
    {
      data: budgetCategory.value.data || [],
      backgroundColor: budgetCategory.value.colors || [],
      borderWidth: 0,
    }
  ]
}))

const weeklyData = computed(() => ({
  labels: weeklyStats.value.dates || [],
  datasets: [
    {
      label: 'پروژه‌ها',
      data: weeklyStats.value.projects || [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'قراردادها',
      data: weeklyStats.value.contracts || [],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4,
    }
  ]
}))

// Chart Options
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          family: 'IRANSans'
        }
      }
    }
  },
  cutout: '60%'
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: {
          family: 'IRANSans'
        }
      },
      grid: {
        color: 'rgba(0,0,0,0.05)'
      }
    },
    x: {
      ticks: {
        font: {
          family: 'IRANSans'
        },
        maxRotation: 45,
        minRotation: 45
      },
      grid: {
        display: false
      }
    }
  }
}

// Methods
const loadDashboard = async () => {
  loading.value = true
  try {
    const [
      summaryRes,
      projectStatusRes,
      financialRes,
      recentRes,
      progressRes,
      weeklyRes,
      budgetRes
    ] = await Promise.all([
      dashboardOmraniService.getSummary(),
      dashboardOmraniService.getProjectStats(),
      dashboardOmraniService.getFinancialStats(),
      dashboardOmraniService.getRecentProjects(),
      dashboardOmraniService.getProgressStats(),
      dashboardOmraniService.getWeeklyStats(),
      dashboardOmraniService.getBudgetByCategory()
    ])
    console.log("Summery is:",dashboardOmraniService.getSummary())
    summary.value = summaryRes.data
    projectStatus.value = projectStatusRes.data
    financialStats.value = financialRes.data
    recentProjects.value = recentRes.data
    progressData.value = progressRes.data
    weeklyStats.value = weeklyRes.data
    budgetCategory.value = budgetRes.data

    lastUpdate.value = new Date().toLocaleTimeString('fa-IR')

    // ✅ بعد از بارگذاری داده، منتظر بمان تا DOM به‌روزرسانی شود
    await nextTick()
    chartsReady.value = true

  } catch (error) {
    console.error('Dashboard error:', error)
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: 'بارگذاری اطلاعات داشبورد با خطا مواجه شد',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadDashboard()
  toast.add({
    severity: 'success',
    summary: 'بروزرسانی',
    detail: 'داشبورد با موفقیت بروزرسانی شد',
    life: 2000
  })
}

const formatNumber = (value) => {
  if (value >= 1000) {
    return new Intl.NumberFormat('fa-IR').format(value)
  }
  return value
}

const getStatusSeverity = (status) => {
  const severities = {
    planning: 'warning',
    active: 'success',
    on_hold: 'danger',
    completed: 'info',
    cancelled: 'secondary'
  }
  return severities[status] || 'secondary'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'progress-high'
  if (progress >= 50) return 'progress-medium'
  return 'progress-low'
}

const getProgressTextClass = (progress) => {
  if (progress >= 80) return 'text-success'
  if (progress >= 50) return 'text-warning'
  return 'text-danger'
}


// Auto refresh every 5 minutes
let refreshInterval

onMounted(() => {
  loadDashboard()
  refreshInterval = setInterval(() => {
    loadDashboard()
  }, 300000)
})

watch([projectStatus, budgetCategory, weeklyStats], () => {
  if (!loading.value && chartsReady.value) {
    nextTick(() => {
      // chart ها به صورت خودکار به‌روزرسانی میشن
    })
  }
}, { deep: true })


onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.dashboard-content {
  padding: 0.5rem;
}

/*new*/
.dashboard-content {
  padding: 0.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.last-update {
  font-size: 0.75rem;
  color: #9ca3af;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* ============ SUMMARY GRID ============ */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* ============ CHARTS ============ */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
}

.chart-legend {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.projects-dot {
  background: #3b82f6;
}

.legend-dot.contracts-dot {
  background: #f59e0b;
}

.chart-container {
  height: 260px;
  position: relative;
}

.chart {
  height: 100%;
  width: 100%;
}

/* ============ INVENTORY SECTION ============ */
.inventory-section {
  margin-bottom: 1.5rem;
}

/* ============ PROGRESS LIST ============ */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ============ RECENT TABLE ============ */
.recent-table {
  margin-top: 0.5rem;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 1400px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .chart-card.full-width {
    grid-column: 1;
  }

  .chart-container {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .chart-container {
    height: 180px;
  }

  .dashboard-content {
    padding: 0.25rem;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .chart-container {
    height: 150px;
  }
}
/*end*/

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
  color: #9ca3af;
}

.chart-placeholder p {
  margin: 0;
  font-size: 0.875rem;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.last-update {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: white;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: all 0.3s;
  border-right: 4px solid var(--card-color, #3b82f6);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-color, #3b82f6);
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
  opacity: 0.9;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.card-label {
  display: block;
  font-size: 0.7rem;
  color: #6b7280;
}

.card-sub {
  display: block;
  font-size: 0.65rem;
  color: #9ca3af;
  margin-top: 0.1rem;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
}

.chart-legend {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.projects-dot {
  background: #3b82f6;
}

.legend-dot.contracts-dot {
  background: #f59e0b;
}

.chart-container {
  height: 260px;
  position: relative;
}

.chart {
  height: 100%;
  width: 100%;
}

/* Progress List */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.project-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.9rem;
}

.project-tasks {
  font-size: 0.7rem;
  color: #6b7280;
}

.project-progress {
  font-weight: 600;
  font-size: 0.9rem;
}

.text-success { color: #22c55e; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }

.progress-track {
  height: 6px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

.progress-high {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.progress-medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-low {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

/* Recent Table */
.recent-table {
  margin-top: 0.5rem;
}

:deep(.recent-table .p-datatable-wrapper) {
  border-radius: 8px;
  overflow: hidden;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state p {
  margin: 0;
}

/* Responsive */
@media (max-width: 1400px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .chart-card.full-width {
    grid-column: 1;
  }

  .chart-container {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .summary-card {
    padding: 1rem 0.75rem;
  }

  .card-value {
    font-size: 1rem;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }

  .chart-container {
    height: 180px;
  }

  .dashboard-content {
    padding: 0.25rem;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .summary-card {
    padding: 0.75rem 0.5rem;
  }

  .card-value {
    font-size: 0.9rem;
  }

  .card-label {
    font-size: 0.6rem;
  }

  .card-icon {
    width: 30px;
    height: 30px;
    font-size: 0.75rem;
  }

  .chart-container {
    height: 150px;
  }

  .project-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
  }
}
</style>