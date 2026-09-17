<template>
  <div class="org-page" dir="rtl">
    <!-- ═══════════════ Header ═══════════════ -->
    <div class="page-header">
      <div class="header-main">
        <div class="header-icon">
          <i class="pi pi-sitemap"></i>
        </div>
        <div>
          <h1>چارت سازمانی</h1>
          <p>نمایش ساختار سازمانی و درختی واحدها و پرسنل</p>
        </div>
      </div>

      <div class="header-side">
        <div class="sync-info">
          <span class="sync-dot"></span>
          <div class="sync-text">
            <span class="sync-label">آخرین به‌روزرسانی از راهکاران</span>
            <strong>{{ formatSyncDate(stats?.last_sync) }}</strong>
          </div>
        </div>
        <Button
            icon="pi pi-refresh"
            severity="secondary"
            rounded
            :loading="loading"
            v-tooltip.top="'به‌روزرسانی'"
            @click="fetchChart"
        />
      </div>
    </div>

    <!-- ═══════════════ Toolbar ═══════════════ -->
    <div class="toolbar-card">
      <div class="toolbar-group">
        <Button
            icon="pi pi-expand"
            severity="secondary"
            outlined
            rounded
            v-tooltip.top="'تمام صفحه'"
            @click="toggleFullscreen"
        />
        <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
        <Button
            icon="pi pi-minus"
            severity="secondary"
            outlined
            rounded
            v-tooltip.top="'کوچک‌نمایی'"
            @click="zoomOut"
        />
        <Button
            icon="pi pi-plus"
            severity="secondary"
            outlined
            rounded
            v-tooltip.top="'بزرگ‌نمایی'"
            @click="zoomIn"
        />
      </div>

      <div class="search-box">
        <i class="pi pi-search"></i>
        <InputText
            v-model="searchQuery"
            placeholder="جستجو در واحدها و پرسنل..."
        />
        <button
            v-if="searchQuery"
            class="clear-search"
            type="button"
            @click="searchQuery = ''"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="toolbar-group">
        <Button
            label="باز کردن همه"
            icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
            severity="secondary"
            outlined
            @click="expandAll"
        />
        <Button
            label="بستن همه"
            icon="pi pi-arrow-down-left-and-arrow-up-right-to-center"
            severity="secondary"
            outlined
            @click="collapseAll"
        />
        <Button
            label="عملیات"
            icon="pi pi-chevron-down"
            class="ops-button"
            @click="toggleOps"
        />
        <Menu ref="opsMenu" :model="opsItems" popup />
      </div>
    </div>

    <!-- ═══════════════ Loading ═══════════════ -->
    <div v-if="loading" class="state-card">
      <div class="loading-orbit">
        <i class="pi pi-sitemap"></i>
      </div>
      <strong>در حال دریافت چارت سازمانی...</strong>
      <span>لطفاً چند لحظه صبر کنید</span>
    </div>

    <!-- ═══════════════ Empty ═══════════════ -->
    <div v-else-if="!filteredTree.length" class="state-card empty">
      <div class="empty-icon"><i class="pi pi-sitemap"></i></div>
      <strong>{{ searchQuery ? 'نتیجه‌ای یافت نشد' : 'چارت سازمانی خالی است' }}</strong>
      <span>{{ searchQuery ? 'عبارت دیگری را برای جستجو امتحان کنید.' : 'هنوز واحدی از راهکاران همگام‌سازی نشده است.' }}</span>
      <Button
          v-if="!searchQuery"
          label="همگام‌سازی مجدد"
          icon="pi pi-refresh"
          class="mt-3"
          @click="fetchChart"
      />
    </div>

    <!-- ═══════════════ Chart ═══════════════ -->
    <div v-else class="chart-shell" :class="{ 'is-fullscreen': isFullscreen }">
      <div class="chart-viewport">
        <div class="org-tree" :style="{ transform: `scale(${zoom})` }">
          <OrgNode
              v-for="node in filteredTree"
              :key="node.key"
              :node="node"
              :expanded-keys="expandedKeys"
              :search-query="searchQuery"
              @toggle="toggleNode"
              @employee="viewEmployeeProfile"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════ Footer / Legend ═══════════════ -->
    <div class="footer-card">
      <div class="footer-stats">
        <div class="stat-box">
          <div class="stat-text">
            <span>واحدهای فعال</span>
            <strong>{{ faNum(stats?.active_units) }}</strong>
          </div>
          <div class="stat-icon green"><i class="pi pi-check-square"></i></div>
        </div>
        <div class="stat-box">
          <div class="stat-text">
            <span>پرسنل</span>
            <strong>{{ faNum(stats?.total_employees) }}</strong>
          </div>
          <div class="stat-icon indigo"><i class="pi pi-users"></i></div>
        </div>
        <div class="stat-box">
          <div class="stat-text">
            <span>واحد‌های سازمانی</span>
            <strong>{{ faNum(stats?.total_units) }}</strong>
          </div>
          <div class="stat-icon blue"><i class="pi pi-building"></i></div>
        </div>
      </div>

      <div class="footer-legend">
        <span class="legend-item">
          <i class="line-sample dashed"></i>
          ارتباط غیرمستقیم
        </span>
        <span class="legend-item">
          <i class="line-sample solid"></i>
          ارتباط مستقیم
        </span>
        <span class="legend-item">
          <i class="pi pi-user legend-icon"></i>
          پرسنل
        </span>
        <span class="legend-item">
          <i class="pi pi-building legend-icon"></i>
          واحد سازمانی
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import Menu from 'primevue/menu'
import hrService from '@/services/hrService'

const router = useRouter()

const tree = ref([])
const stats = ref(null)
const loading = ref(true)
const searchQuery = ref('')
const expandedKeys = ref({})
const zoom = ref(1)
const isFullscreen = ref(false)
const opsMenu = ref(null)

/**
 * ✅ سطوحی که به‌صورت پیش‌فرض باز می‌شوند
 */
const DEFAULT_EXPAND_LEVEL = 2

// ─────────────────────────────────────────────
//  ابزارها
// ─────────────────────────────────────────────
const faNum = (n) => Number(n || 0).toLocaleString('fa-IR')

const formatSyncDate = (dateStr) => {
  if (!dateStr) return '—'
  const dt = new Date(dateStr)
  return (
      dt.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
      ' - ' +
      dt.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  )
}

// ─────────────────────────────────────────────
//  فیلتر جستجو
// ─────────────────────────────────────────────
const filteredTree = computed(() => {
  if (!searchQuery.value.trim()) return tree.value
  return filterTree(tree.value, searchQuery.value.trim().toLowerCase())
})

function filterTree(nodes, query) {
  return nodes
      .map((node) => {
        const data = node.data || {}
        const nodeMatch =
            data.type === 'unit'
                ? [data.title, data.post_title, data.job_title].some((v) =>
                    String(v || '').toLowerCase().includes(query)
                )
                : [data.name, data.personnel_code, data.post_title, data.job_title].some((v) =>
                    String(v || '').toLowerCase().includes(query)
                )

        const children = node.children?.length ? filterTree(node.children, query) : []

        if (nodeMatch || children.length) {
          return { ...node, children: nodeMatch ? node.children : children }
        }
        return null
      })
      .filter(Boolean)
}

// ─────────────────────────────────────────────
//  دریافت چارت
// ─────────────────────────────────────────────
const fetchChart = async () => {
  loading.value = true
  try {
    const data = await hrService.getOrgChart()
    tree.value = data.tree || []
    stats.value = data.stats || null

    // ✅ باز کردن پیش‌فرض سطوح بالا
    applyDefaultExpand()
  } catch (error) {
    console.error('Org chart fetch error:', error)
  } finally {
    loading.value = false
  }
}

/**
 * ✅ باز کردن پیش‌فرض گره‌های سطوح ۱ و ۲
 */
const applyDefaultExpand = () => {
  const next = {}
  const walk = (nodes) => {
    nodes.forEach((node) => {
      const d = node.data || {}
      if (d.type === 'unit' && (d.level ?? 0) <= DEFAULT_EXPAND_LEVEL && node.children?.length) {
        next[node.key] = true
        walk(node.children)
      }
    })
  }
  walk(tree.value)
  expandedKeys.value = next
}

// ─────────────────────────────────────────────
//  باز / بسته کردن گره‌ها
// ─────────────────────────────────────────────
const toggleNode = (key) => {
  expandedKeys.value = {
    ...expandedKeys.value,
    [key]: !expandedKeys.value[key],
  }
}

const expandAll = () => {
  const next = {}
  const walk = (nodes) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        next[node.key] = true
        walk(node.children)
      }
    })
  }
  walk(tree.value)
  expandedKeys.value = next
}

const collapseAll = () => {
  expandedKeys.value = {}
}

// ─────────────────────────────────────────────
//  زوم و تمام‌صفحه
// ─────────────────────────────────────────────
const zoomIn = () => {
  zoom.value = Math.min(1.5, Math.round((zoom.value + 0.1) * 10) / 10)
}
const zoomOut = () => {
  zoom.value = Math.max(0.5, Math.round((zoom.value - 0.1) * 10) / 10)
}
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// ─────────────────────────────────────────────
//  منوی عملیات
// ─────────────────────────────────────────────
const toggleOps = (event) => {
  opsMenu.value.toggle(event)
}

const opsItems = [
  {
    label: 'همگام‌سازی با راهکاران',
    icon: 'pi pi-refresh',
    command: () => fetchChart(),
  },
  {
    label: 'بازنشانی بزرگ‌نمایی',
    icon: 'pi pi-undo',
    command: () => (zoom.value = 1),
  },
  {
    label: 'چاپ چارت',
    icon: 'pi pi-print',
    command: () => window.print(),
  },
]

// ─────────────────────────────────────────────
//  پروفایل پرسنل
// ─────────────────────────────────────────────
const viewEmployeeProfile = (userId) => {
  if (!userId) return
  router.push({ name: 'hr.employee.profile', params: { id: userId } })
}

// ─────────────────────────────────────────────
//  کامپوننت بازگشتی گره
// ─────────────────────────────────────────────
const OrgNode = defineComponent({
  name: 'OrgNode',
  props: {
    node: { type: Object, required: true },
    expandedKeys: { type: Object, required: true },
    searchQuery: { type: String, default: '' },
  },
  emits: ['toggle', 'employee'],
  setup(props, { emit }) {
    const data = computed(() => props.node.data || {})
    const children = computed(() => props.node.children || [])
    const isUnit = computed(() => data.value.type === 'unit')
    const isRoot = computed(() => isUnit.value && (data.value.level ?? 9) === 1)
    const showIcon = computed(() => isUnit.value && (data.value.level ?? 9) <= 2)
    const isExpanded = computed(() => !!props.expandedKeys[props.node.key])
    const hasChildren = computed(() => children.value.length > 0)

    const initials = computed(() => {
      const name = String(data.value.name || '').trim()
      return name ? name.charAt(0) : '?'
    })

    const roleLabel = computed(() => {
      if (data.value.type !== 'employee') return ''
      return data.value.post_title || data.value.job_title || 'پرسنل'
    })

    const localFa = (n) => Number(n || 0).toLocaleString('fa-IR')

    return () =>
        h(
            'div',
            {
              class: [
                'org-node-wrap',
                isUnit.value ? 'unit-node-wrap' : 'employee-node-wrap',
              ],
            },
            [
              /* ──────── کارت واحد ──────── */
              isUnit.value
                  ? h(
                      'div',
                      {
                        class: [
                          'org-card',
                          'unit-card',
                          isRoot.value ? 'root-card' : '',
                          isExpanded.value ? 'expanded' : '',
                          !hasChildren.value ? 'leaf' : '',
                        ],
                        onClick: () => {
                          // ✅ ریشه هم با کلیک باز/بسته می‌شود
                          if (hasChildren.value) {
                            emit('toggle', props.node.key)
                          }
                        },
                      },
                      [
                        /* دکمه باز/بسته (برای ریشه مخفی) */
                        hasChildren.value && !isRoot.value
                            ? h(
                                'button',
                                {
                                  class: ['expand-button', isExpanded.value ? 'open' : ''],
                                  onClick: (e) => {
                                    e.stopPropagation()
                                    emit('toggle', props.node.key)
                                  },
                                },
                                [
                                  h('i', {
                                    class: [
                                      'pi',
                                      isExpanded.value ? 'pi-chevron-up' : 'pi-chevron-down',
                                    ],
                                  }),
                                ]
                            )
                            : null,

                        /* آیکون واحد (فقط سطح ۱ و ۲) */
                        showIcon.value
                            ? h('div', { class: 'node-icon' }, [
                              h('i', { class: 'pi pi-building' }),
                            ])
                            : null,

                        h('div', { class: 'node-content' }, [
                          h('div', { class: 'node-title' }, data.value.title || 'بدون عنوان'),
                          h('div', { class: 'node-level' }, `سطح ${localFa(data.value.level)}`),
                          h('div', { class: 'node-meta' }, [
                            h('i', { class: 'pi pi-users' }),
                            h('span', `${localFa(data.value.employee_count)} نفر`),
                          ]),
                        ]),
                      ]
                  )
                  : /* ──────── کارت پرسنل ──────── */
                  h(
                      'div',
                      {
                        class: ['org-card', 'employee-card'],
                        onClick: () => {
                          if (data.value.user_id) emit('employee', data.value.user_id)
                        },
                      },
                      [
                        h('div', { class: 'employee-avatar' }, initials.value),
                        h('div', { class: 'node-content' }, [
                          h('div', { class: 'node-title' }, data.value.name || 'بدون نام'),
                          h('div', { class: 'node-meta' }, [
                            h('i', { class: 'pi pi-id-card' }),
                            h('span', data.value.personnel_code || 'بدون کد'),
                          ]),
                          h('div', { class: 'employee-role' }, roleLabel.value),
                        ]),
                        h('i', { class: 'pi pi-angle-left employee-arrow' }),
                      ]
                  ),

              /* ──────── فرزندان ──────── */
              hasChildren.value && isExpanded.value
                  ? h(
                      'div',
                      {
                        class: [
                          'children-branch',
                          isUnit.value && (data.value.level ?? 0) >= 3 ? 'dashed' : '',
                        ],
                      },
                      [
                        h('div', { class: 'branch-line' }),
                        h(
                            'div',
                            { class: 'children-row' },
                            children.value.map((child) =>
                                h(OrgNode, {
                                  key: child.key,
                                  node: child,
                                  expandedKeys: props.expandedKeys,
                                  searchQuery: props.searchQuery,
                                  onToggle: (key) => emit('toggle', key),
                                  onEmployee: (id) => emit('employee', id),
                                })
                            )
                        ),
                      ]
                  )
                  : null,
            ]
        )
  },
})

onMounted(fetchChart)
</script>

<style scoped>
.org-page {
  min-height: 100%;
  color: #1e293b;
  animation: pageIn 0.35s ease-out;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═══════════════ Header ═══════════════ */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.035);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #eef0ff;
  color: #6d5cf0;
  font-size: 1.35rem;
}

.header-main h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #172033;
}

.header-main p {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.header-side {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sync-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

.sync-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sync-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.sync-text strong {
  font-size: 0.8rem;
  color: #334155;
  font-weight: 700;
}

/* ═══════════════ Toolbar ═══════════════ */
.toolbar-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.035);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-label {
  min-width: 48px;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
}

.ops-button {
  background: #1e3a5f;
  border-color: #1e3a5f;
  color: #fff;
  font-weight: 700;
}

.ops-button:hover {
  background: #16304f;
  border-color: #16304f;
  color: #fff;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 560px;
}

.search-box > i {
  position: absolute;
  right: 0.9rem;
  z-index: 1;
  color: #94a3b8;
}

.search-box :deep(input) {
  width: 100%;
  padding-right: 2.5rem;
  padding-left: 2.2rem;
  border-radius: 10px;
  background: #f8fafc;
}

.clear-search {
  position: absolute;
  left: 0.7rem;
  border: 0;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

/* ═══════════════ State cards ═══════════════ */
.state-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 18px;
  color: #64748b;
}

.state-card strong { color: #334155; font-size: 0.9rem; }
.state-card span   { color: #94a3b8; font-size: 0.75rem; }

.loading-orbit,
.empty-icon {
  width: 68px;
  height: 68px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  margin-bottom: 0.5rem;
  background: #eef2ff;
  color: #6366f1;
  font-size: 1.65rem;
}

.loading-orbit { animation: pulse 1.4s infinite ease-in-out; }

@keyframes pulse {
  0%, 100% { transform: scale(0.95); opacity: 0.65; }
  50%      { transform: scale(1); opacity: 1; }
}

.empty-icon { background: #f8fafc; color: #cbd5e1; }

/* ═══════════════ Chart shell ═══════════════ */
.chart-shell {
  overflow: hidden;
  background: #fff;
  border: 1px solid #dfe6ef;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.045);
}

.chart-shell.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1200;
  border-radius: 0;
  border: 0;
}

.chart-viewport {
  overflow: auto;
  min-height: 520px;
  max-height: calc(100vh - 320px);
  padding: 56px 36px 80px;
  background-color: #fdfefe;
}

.chart-shell.is-fullscreen .chart-viewport {
  max-height: none;
  height: 100%;
}

.org-tree {
  width: max-content;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
  transform-origin: top center;
  transition: transform 0.2s ease;
}

/* ═══════════════════════════════════════════════════════
   ✅ استایل گره‌ها — با :deep() چون داخل OrgNode رندر می‌شوند
   ═══════════════════════════════════════════════════════ */
.org-tree :deep(.org-node-wrap) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-tree :deep(.org-card) {
  position: relative;
  background: #fff;
  border: 1px solid #d9e1eb;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  z-index: 2;
}

.org-tree :deep(.org-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.11);
  border-color: #b8c5d6;
}

/* ──────── کارت واحد ──────── */
.org-tree :deep(.unit-card) {
  width: 250px;
  min-height: 100px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  cursor: pointer;
}

.org-tree :deep(.unit-card.leaf) { cursor: default; }

/* کارت ریشه (تیره) */
.org-tree :deep(.unit-card.root-card) {
  width: 280px;
  background: #1e3a5f;
  border-color: #1e3a5f;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(30, 58, 95, 0.35);
}

.org-tree :deep(.unit-card.root-card .node-title) { color: #fff; }

.org-tree :deep(.unit-card.root-card .node-level),
.org-tree :deep(.unit-card.root-card .node-meta) {
  color: rgba(255, 255, 255, 0.75);
}

.org-tree :deep(.unit-card.root-card .node-icon) {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.org-tree :deep(.unit-card.expanded) {
  border-color: #7ea6d8;
  box-shadow: 0 7px 20px rgba(30, 58, 95, 0.12);
}

.org-tree :deep(.node-icon) {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #e8eefc;
  color: #2f5fa8;
  font-size: 1.1rem;
}

.org-tree :deep(.node-content) {
  min-width: 0;
  flex: 1;
  text-align: center;
}

.org-tree :deep(.node-title) {
  overflow: hidden;
  color: #1e293b;
  font-size: 0.8rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-tree :deep(.node-level) {
  margin-top: 0.3rem;
  color: #94a3b8;
  font-size: 0.66rem;
  font-weight: 600;
}

.org-tree :deep(.node-meta) {
  margin-top: 0.45rem;
  color: #64748b;
  font-size: 0.66rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.org-tree :deep(.node-meta i) { font-size: 0.68rem; }

/* دکمه باز/بسته */
.org-tree :deep(.expand-button) {
  position: absolute;
  top: -12px;
  left: -12px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border: 1px solid #dbe3ed;
  border-radius: 50%;
  background: #fff;
  color: #475569;
  font-size: 0.6rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
  transition: all 0.18s ease;
  z-index: 3;
}

.org-tree :deep(.expand-button.open) {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}

/* ──────── کارت پرسنل ──────── */
.org-tree :deep(.employee-card) {
  width: 235px;
  min-height: 86px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 0.9rem;
  cursor: pointer;
  border-top: 3px solid #10b981;
}

.org-tree :deep(.employee-card:hover) {
  border-color: #a7f3d0;
  border-top-color: #059669;
}

.org-tree :deep(.employee-avatar) {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
  font-size: 0.85rem;
  font-weight: 800;
}

.org-tree :deep(.employee-card .node-content) { text-align: right; }

.org-tree :deep(.employee-role) {
  margin-top: 0.3rem;
  overflow: hidden;
  color: #64748b;
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-tree :deep(.employee-arrow) {
  color: #cbd5e1;
  font-size: 0.8rem;
}

/* ═══════════════ Connectors (نسخه نهایی) ═══════════════ */
.org-tree :deep(.children-branch) {
  position: relative;
  padding-top: 22px;
  width: max-content;
  margin: 0 auto;
}

.org-tree :deep(.branch-line) {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 22px;
  background: #1e3a5f;
  transform: translateX(-50%);
}

.org-tree :deep(.children-row) {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 28px;
  width: max-content;
  margin: 0 auto;
  direction: rtl; /* ✅ تضمین می‌کند فرزند اول همیشه سمت راست باشد */
}

.org-tree :deep(.children-row > .org-node-wrap) {
  position: relative;
  padding-top: 24px;
}

/* خط عمودی بالای هر فرزند */
.org-tree :deep(.children-row > .org-node-wrap::before) {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 24px;
  background: #1e3a5f;
  transform: translateX(-50%);
}

/* خط افقی هر فرزند + پوشش gap بین کارت‌ها */
.org-tree :deep(.children-row > .org-node-wrap::after) {
  content: "";
  position: absolute;
  top: 0;
  height: 2px;
  background: #1e3a5f;
  left: -14px;
  right: -14px;
}

/* ✅ فرزند اول (سمت راست): فقط نیمه راستِ بیرونی حذف شود */
.org-tree :deep(.children-row > .org-node-wrap:first-child::after) {
  right: 50%;
  left: -14px;
}

/* ✅ فرزند آخر (سمت چپ): فقط نیمه چپِ بیرونی حذف شود */
.org-tree :deep(.children-row > .org-node-wrap:last-child::after) {
  left: 50%;
  right: -14px;
}

.org-tree :deep(.children-row > .org-node-wrap:only-child::after) {
  display: none;
}

/* ──────── حالت خط‌چین (سطح ۳ به بعد) ──────── */
.org-tree :deep(.children-branch.dashed .branch-line) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::before) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::after) {
  height: 0;
  background: none;
  border-top: 2px dashed #9aa7b8;
}

/* ──────── حالت غیرمستقیم (خط‌چین) ──────── */
.org-tree :deep(.children-branch.dashed .branch-line) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::before) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::after) {
  height: 0;
  background: none;
  border-top: 2px dashed #9aa7b8;
}

/* ──────── حالت غیرمستقیم (خط‌چین) ──────── */
.org-tree :deep(.children-branch.dashed .branch-line) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::before) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::after) {
  height: 0;
  background: none;
  border-top: 2px dashed #9aa7b8;
}

/* ──────── حالت غیرمستقیم (خط‌چین) ──────── */
.org-tree :deep(.children-branch.dashed .branch-line) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::before) {
  width: 0;
  background: none;
  border-left: 2px dashed #9aa7b8;
}

.org-tree :deep(.children-branch.dashed .children-row > .org-node-wrap::after) {
  height: 0;
  background: none;
  border-top: 2px dashed #9aa7b8;
}

/* ═══════════════ Footer ═══════════════ */
.footer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.035);
}

.footer-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  min-width: 150px;
  padding: 0.6rem 0.9rem;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 12px;
}

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat-text span {
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 600;
}

.stat-text strong {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 1rem;
}

.stat-icon.green  { background: #ecfdf5; color: #059669; }
.stat-icon.indigo { background: #eef2ff; color: #4f46e5; }
.stat-icon.blue   { background: #eff6ff; color: #2563eb; }

.footer-legend {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
}

.legend-icon { color: #475569; font-size: 0.8rem; }

.line-sample {
  display: inline-block;
  width: 42px;
  height: 0;
}

.line-sample.solid  { border-top: 2px solid #1e3a5f; }
.line-sample.dashed { border-top: 2px dashed #9aa7b8; }

/* ═══════════════ Scrollbars ═══════════════ */
.chart-viewport::-webkit-scrollbar { width: 8px; height: 8px; }
.chart-viewport::-webkit-scrollbar-track { background: #f1f5f9; }
.chart-viewport::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
.chart-viewport::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* ═══════════════ Responsive ═══════════════ */
@media (max-width: 900px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .toolbar-card { flex-wrap: wrap; }
  .search-box { order: 3; max-width: none; flex-basis: 100%; }
  .footer-card { flex-direction: column; align-items: flex-start; }
}
</style>