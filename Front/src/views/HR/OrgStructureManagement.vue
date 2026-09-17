<template>
  <div class="space-y-6 animate-fade-in">

    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="pi pi-sitemap text-indigo-500"></i>
          مدیریت ساختار سازمانی
        </h1>
        <p class="text-sm text-gray-400 mt-1">
          ایجاد، ویرایش و تعیین سلسله‌مراتب واحدهای سازمانی
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- ✅ دکمه ایجاد واحد جدید -->
        <Button
            icon="pi pi-plus"
            label="واحد جدید"
            @click="openCreateDialog"
        />
        <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            :loading="loading"
            @click="fetchUnits"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <i class="pi pi-spinner pi-spin text-4xl text-indigo-500"></i>
    </div>

    <!-- Tree -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <TreeTable
          :value="tree"
          :expandedKeys="expandedKeys"
          scrollable
          scrollHeight="flex"
      >
        <!-- ستون نام -->
        <Column field="title" expander header="واحد سازمانی" style="min-width: 300px">
          <template #body="{ node }">
            <div class="flex items-center gap-2 py-1">
              <span
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="node.data.is_custom
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-indigo-50 text-indigo-600'"
              >
                <i :class="node.data.is_custom ? 'pi pi-star' : 'pi pi-building'" class="text-sm"></i>
              </span>
              <div>
                <span class="font-semibold text-gray-800 text-sm">{{ node.data.title }}</span>
                <Tag
                    :value="`سطح ${node.data.level}`"
                    :severity="node.data.level === 1 ? 'info' : 'secondary'"
                    class="mr-2"
                    style="font-size: 10px"
                />
                <!-- ✅ برچسب واحد دستی -->
                <Tag
                    v-if="node.data.is_custom"
                    value="دستی"
                    severity="warning"
                    class="mr-1"
                    style="font-size: 10px"
                />
              </div>
            </div>
          </template>
        </Column>

        <!-- ستون کد -->
        <Column field="code" header="کد" style="width: 100px">
          <template #body="{ node }">
            <span class="text-sm text-gray-500" dir="ltr">{{ node.data.code || '—' }}</span>
          </template>
        </Column>

        <!-- ستون والد -->
        <Column header="والد" style="min-width: 180px">
          <template #body="{ node }">
            <span v-if="node.data.parent_id" class="text-sm text-gray-600">
              {{ getParentTitle(node.data.parent_id) }}
            </span>
            <Tag v-else value="ریشه" severity="info" style="font-size: 10px" />
          </template>
        </Column>

        <!-- ستون عملیات -->
        <Column header="عملیات" style="width: 220px" class="text-center">
          <template #body="{ node }">
            <div class="flex items-center justify-center gap-1">
              <!-- ویرایش -->
              <Button
                  icon="pi pi-pencil"
                  severity="info"
                  outlined
                  rounded
                  size="small"
                  v-tooltip.top="'ویرایش'"
                  @click="openEditDialog(node.data)"
              />
              <!-- ایجاد زیرمجموعه -->
              <Button
                  icon="pi pi-plus"
                  severity="success"
                  outlined
                  rounded
                  size="small"
                  v-tooltip.top="'ایجاد زیرمجموعه'"
                  @click="openCreateDialog(node.data.id)"
              />
              <!-- حذف -->
              <Button
                  icon="pi pi-trash"
                  severity="danger"
                  outlined
                  rounded
                  size="small"
                  v-tooltip.top="'حذف'"
                  @click="confirmDelete(node.data)"
              />
            </div>
          </template>
        </Column>
      </TreeTable>
    </div>

    <!-- ✅ Dialog ایجاد/ویرایش واحد -->
    <!-- ✅ Dialog ایجاد/ویرایش واحد -->
    <Dialog
        v-model:visible="formDialogVisible"
        :header="isEditMode ? 'ویرایش واحد' : 'ایجاد واحد جدید'"
        modal
        :style="{ width: '95vw', maxWidth: '550px' }"
    >
      <form @submit.prevent="saveUnit" class="space-y-4">

        <!-- عنوان -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            عنوان واحد <span class="text-red-500">*</span>
          </label>
          <InputText
              v-model="form.title"
              placeholder="مثال: معاونت اداری و منابع انسانی"
              class="w-full"
              :class="{ 'p-invalid': formErrors.title }"
          />
          <small v-if="formErrors.title" class="text-red-500 text-xs mt-1">
            {{ formErrors.title }}
          </small>
        </div>

        <!-- کد -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">کد واحد</label>
          <InputText
              v-model="form.code"
              placeholder="مثال: HR-01 (اختیاری)"
              class="w-full"
              dir="ltr"
          />
        </div>

        <!-- ✅ والد — Select ساده به جای TreeSelect -->
        <!-- والد -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">واحد والد</label>
          <Select
              v-model="form.parent_id"
              :options="parentOptions"
              optionLabel="label"
              optionValue="id"
              placeholder="بدون والد (ریشه)"
              showClear
              class="w-full"
          />
          <small class="text-gray-400 text-xs mt-1">
            خالی بگذارید تا واحد در سطح ریشه قرار گیرد.
          </small>
        </div>

        <!-- توضیحات -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <Textarea
              v-model="form.description"
              placeholder="توضیحات اختیاری..."
              rows="3"
              class="w-full"
          />
        </div>

      </form>

      <template #footer>
        <Button label="انصراف" severity="secondary" outlined @click="formDialogVisible = false" />
        <Button
            :label="isEditMode ? 'ذخیره تغییرات' : 'ایجاد واحد'"
            icon="pi pi-check"
            :loading="saving"
            @click="saveUnit"
        />
      </template>
    </Dialog>

    <!-- ✅ Dialog تأیید حذف -->
    <Dialog
        v-model:visible="deleteDialogVisible"
        header="تأیید حذف"
        modal
        :style="{ width: '95vw', maxWidth: '400px' }"
    >
      <div v-if="deleteTarget" class="text-center space-y-3">
        <span class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <i class="pi pi-trash text-2xl"></i>
        </span>
        <p class="text-gray-700">
          آیا از حذف واحد
          <strong>«{{ deleteTarget.title }}»</strong>
          مطمئن هستید؟
        </p>
        <p class="text-xs text-gray-400">
          این عملیات قابل بازگشت نیست.
        </p>
      </div>

      <template #footer>
        <Button label="انصراف" severity="secondary" outlined @click="deleteDialogVisible = false" />
        <Button
            label="حذف"
            icon="pi pi-trash"
            severity="danger"
            :loading="saving"
            @click="doDelete"
        />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import hrService from '@/services/hrService'

const toast = useToast()

const units = ref([])
const tree = ref([])
const loading = ref(true)
const saving = ref(false)
const expandedKeys = ref({})

// ── فرم ایجاد/ویرایش ──
const formDialogVisible = ref(false)
const isEditMode = ref(false)
const editTargetId = ref(null)
const form = ref({
  title: '',
  code: '',
  parent_id: null,
  description: '',
})
const formErrors = ref({})

// ── حذف ──
const deleteDialogVisible = ref(false)
const deleteTarget = ref(null)

// ── دریافت واحدها ──
const fetchUnits = async () => {
  loading.value = true
  try {
    const data = await hrService.getOrgStructure()
    units.value = data.units || []
    buildTree()
    tree.value.forEach(node => {
      expandedKeys.value[node.key] = true
    })
  } catch (error) {
    console.error('Fetch org structure error:', error)
  } finally {
    loading.value = false
  }
}

// ── ساخت درخت ──
const buildTree = () => {
  const map = {}
  const roots = []

  units.value.forEach(unit => {
    map[unit.id] = {
      key: String(unit.id),
      data: { ...unit },
      children: [],
    }
  })

  units.value.forEach(unit => {
    if (unit.parent_id && map[unit.parent_id]) {
      map[unit.parent_id].children.push(map[unit.id])
    } else {
      roots.push(map[unit.id])
    }
  })

  tree.value = roots
}

const getParentTitle = (parentId) => {
  const parent = units.value.find(u => u.id === parentId)
  return parent?.title || '—'
}


// ── گزینه‌های والد ──
// ── گزینه‌های والد (تخت + تورفتگی بر اساس سطح) ──
const parentOptions = computed(() => {
  const excludeIds = new Set()

  if (isEditMode.value && editTargetId.value) {
    excludeIds.add(editTargetId.value)
    getDescendantIds(editTargetId.value).forEach(id => excludeIds.add(id))
  }

  return units.value
      .filter(u => !excludeIds.has(u.id))
      .slice()
      .sort((a, b) => (a.level - b.level) || (a.id - b.id))
      .map(u => ({
        id: u.id,   // ✅ عدد — بدون نیاز به parseInt
        label: (u.level > 1 ? '─ '.repeat(u.level - 1) : '') + u.title,
      }))
})

const getDescendantIds = (unitId) => {
  const ids = new Set()
  units.value
      .filter(u => u.parent_id === unitId)
      .forEach(child => {
        ids.add(child.id)
        getDescendantIds(child.id).forEach(id => ids.add(id))
      })
  return ids
}

// ── باز کردن Dialog ایجاد ──
const openCreateDialog = (parentId = null) => {
  isEditMode.value = false
  editTargetId.value = null
  form.value = {
    title: '',
    code: '',
    parent_id: parentId,   // ✅ عدد یا null
    description: '',
  }
  formErrors.value = {}
  formDialogVisible.value = true
}

// ── باز کردن Dialog ویرایش ──
const openEditDialog = (unit) => {
  isEditMode.value = true
  editTargetId.value = unit.id
  form.value = {
    title: unit.title,
    code: unit.code || '',
    parent_id: unit.parent_id || null,   // ✅ عدد یا null
    description: unit.description || '',
  }
  formErrors.value = {}
  formDialogVisible.value = true
}

// ── ذخیره واحد ──
const saveUnit = async () => {
  if (!form.value.title.trim()) {
    formErrors.value.title = 'عنوان واحد الزامی است.'
    return
  }

  saving.value = true
  formErrors.value = {}

  const payload = {
    title: form.value.title.trim(),
    code: form.value.code || null,
    parent_id: form.value.parent_id || null,   // ✅ مستقیم — بدون parseInt
    description: form.value.description || null,
  }

  console.log('📤 payload ارسالی:', payload)   // برای اطمینان (بعداً قابل حذف)

  try {
    if (isEditMode.value) {
      await hrService.updateUnit(editTargetId.value, payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'واحد با موفقیت به‌روز شد.', life: 3000 })
    } else {
      await hrService.createUnit(payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'واحد جدید ایجاد شد.', life: 3000 })
    }

    formDialogVisible.value = false
    await fetchUnits()
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در ذخیره واحد'
    toast.add({ severity: 'error', summary: 'خطا', detail: message, life: 5000 })
  } finally {
    saving.value = false
  }
}


// ── حذف واحد ──
const confirmDelete = (unit) => {
  deleteTarget.value = unit
  deleteDialogVisible.value = true
}

const doDelete = async () => {
  saving.value = true
  try {
    await hrService.deleteUnit(deleteTarget.value.id)
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: 'واحد با موفقیت حذف شد.',
      life: 3000,
    })
    deleteDialogVisible.value = false
    await fetchUnits()
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در حذف واحد'
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: message,
      life: 5000,
    })
  } finally {
    saving.value = false
  }
}

onMounted(fetchUnits)
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