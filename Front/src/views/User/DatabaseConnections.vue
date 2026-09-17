<!-- src/views/system-settings/DatabaseConnections.vue -->
<template>
  <div class="card">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">مدیریت اتصالات دیتابیس</h2>
        <p class="text-sm text-gray-500 mt-1">اتصالات SQL Server و سایر دیتابیس‌ها را مدیریت کنید</p>
      </div>
      <div class="flex gap-2">
        <Button
            label="پاک کردن کش"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            @click="store.clearCache()"
            :loading="store.loading"
        />
        <Button
            label="اتصال جدید"
            icon="pi pi-plus"
            @click="openNewDialog"
        />
      </div>
    </div>

    <!-- DataTable -->
    <DataTable
        :value="store.connections"
        :loading="store.loading"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[10, 25, 50]"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        size="small"
        dataKey="id"
        :filters="filters"
    >
      <template #header>
        <div class="flex justify-between">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters.global.value" placeholder="جستجو..." />
          </IconField>
        </div>
      </template>

      <template #empty>هیچ اتصالی ثبت نشده است</template>

      <Column field="name" header="نام اتصال" sortable>
        <template #body="{ data }">
          <div class="font-mono text-sm">{{ data.name }}</div>
          <div v-if="data.title" class="text-xs text-gray-500">{{ data.title }}</div>
        </template>
      </Column>

      <Column field="driver" header="درایور" sortable>
        <template #body="{ data }">
          <Tag :value="data.driver" :severity="getDriverSeverity(data.driver)" />
        </template>
      </Column>

      <Column field="host" header="هاست" sortable>
        <template #body="{ data }">
          <div class="font-mono text-sm">{{ data.host }}:{{ data.port }}</div>
        </template>
      </Column>

      <Column field="database" header="دیتابیس" sortable />

      <Column field="username" header="نام کاربری" sortable />

      <Column field="is_active" header="وضعیت" sortable>
        <template #body="{ data }">
          <InputSwitch
              v-model="data.is_active"
              @change="store.toggleActive(data.id)"
          />
        </template>
      </Column>

      <Column header="عملیات" :exportable="false" style="width: 180px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
                icon="pi pi-bolt"
                rounded
                outlined
                severity="info"
                size="small"
                v-tooltip="'تست اتصال'"
                @click="handleTestSaved(data.id)"
                :loading="store.testing"
            />
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                severity="success"
                size="small"
                v-tooltip="'ویرایش'"
                @click="editConnection(data)"
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                size="small"
                v-tooltip="'حذف'"
                @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Create/Edit -->
    <Dialog
        v-model:visible="dialogVisible"
        :style="{ width: '650px' }"
        :header="isEdit ? 'ویرایش اتصال' : 'اتصال دیتابیس جدید'"
        :modal="true"
        :closable="true"
        dismissableMask
    >
      <form @submit.prevent="handleSubmit" class="p-fluid">
        <div class="grid gap-4">
          <!-- Row 1: Name & Title -->
          <div class="col-12 md:col-6">
            <label class="block mb-2">
              نام اتصال <span class="text-red-500">*</span>
              <small class="text-gray-400 block">انگلیسی، بدون فاصله</small>
            </label>
            <InputText
                v-model="form.name"
                :invalid="errors.name"
                placeholder="مثال: gtarabar"
                :disabled="isEdit"
            />
            <small v-if="errors.name" class="text-red-500">{{ errors.name[0] }}</small>
          </div>

          <div class="col-12 md:col-6">
            <label class="block mb-2">عنوان فارسی</label>
            <InputText
                v-model="form.title"
                placeholder="مثال: دیتابیس گستر‌بار"
            />
          </div>

          <!-- Row 2: Host & Port -->
          <div class="col-12 md:col-8">
            <label class="block mb-2">
              هاست <span class="text-red-500">*</span>
            </label>
            <InputText
                v-model="form.host"
                :invalid="errors.host"
                placeholder="192.168.1.100 یا SERVERNAME\INSTANCE"
            />
            <small v-if="errors.host" class="text-red-500">{{ errors.host[0] }}</small>
          </div>

          <div class="col-12 md:col-4">
            <label class="block mb-2">پورت</label>
            <InputText
                v-model="form.port"
                placeholder="1433"
            />
          </div>

          <!-- Row 3: Database -->
          <div class="col-12">
            <label class="block mb-2">
              نام دیتابیس <span class="text-red-500">*</span>
            </label>
            <InputText
                v-model="form.database"
                :invalid="errors.database"
                placeholder="DatabaseName"
            />
          </div>

          <!-- Row 4: Username & Password -->
          <div class="col-12 md:col-6">
            <label class="block mb-2">
              نام کاربری <span class="text-red-500">*</span>
            </label>
            <InputText
                v-model="form.username"
                :invalid="errors.username"
            />
          </div>

          <div class="col-12 md:col-6">
            <label class="block mb-2">
              کلمه عبور <span class="text-red-500" v-if="!isEdit">*</span>
            </label>
            <Password
                v-model="form.password"
                toggleMask
                :feedback="false"
                :invalid="errors.password"
                :placeholder="isEdit ? '•••••••• (برای تغییر وارد کنید)' : ''"
                class="w-full"
                inputClass="w-full"
            />
          </div>

          <!-- Row 5: Charset & Collation -->
          <div class="col-12 md:col-6">
            <label class="block mb-2">Charset</label>
            <InputText v-model="form.charset" placeholder="utf8" />
          </div>

          <div class="col-12 md:col-6">
            <label class="block mb-2">Collation</label>
            <InputText v-model="form.collation" placeholder="Persian_100_CI_AI_SC" />
          </div>

          <!-- Row 6: Options -->
          <div class="col-12">
            <Divider />
            <div class="flex gap-6">
              <div class="flex items-center gap-2">
                <Checkbox
                    v-model="form.options.TrustServerCertificate"
                    :binary="true"
                    inputId="trust"
                />
                <label for="trust">TrustServerCertificate</label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox
                    v-model="form.options.Encrypt"
                    :binary="true"
                    inputId="encrypt"
                />
                <label for="encrypt">Encrypt</label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox
                    v-model="form.is_active"
                    :binary="true"
                    inputId="active"
                />
                <label for="active">فعال</label>
              </div>
            </div>
          </div>

          <!-- Row 7: Description -->
          <div class="col-12">
            <label class="block mb-2">توضیحات</label>
            <Textarea
                v-model="form.description"
                rows="2"
                placeholder="توضیحات اختیاری درباره این اتصال..."
            />
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <Button
              label="تست اتصال"
              icon="pi pi-bolt"
              severity="help"
              outlined
              @click="handleTestForm"
              :loading="store.testing"
          />
          <div class="flex gap-2">
            <Button
                label="انصراف"
                icon="pi pi-times"
                text
                @click="dialogVisible = false"
            />
            <Button
                :label="isEdit ? 'بروزرسانی' : 'ذخیره'"
                icon="pi pi-check"
                @click="handleSubmit"
                :loading="submitting"
            />
          </div>
        </div>
      </template>
    </Dialog>

    <!-- Confirm Delete Dialog -->
    <Dialog
        v-model:visible="deleteDialog"
        :style="{ width: '450px' }"
        header="تایید حذف"
        :modal="true"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500" />
        <div>
          <p class="font-bold">آیا از حذف مطمئن هستید؟</p>
          <p class="text-sm text-gray-600 mt-1">
            اتصال <strong>{{ selectedConnection?.name }}</strong> حذف خواهد شد.
          </p>
        </div>
      </div>
      <template #footer>
        <Button label="انصراف" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="حذف" icon="pi pi-trash" severity="danger" @click="handleDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useDatabaseConnectionsStore } from '@/stores/databaseConnections'
import { showToast } from '@/plugins/toast'

// PrimeVue Components (auto-imported in PrimeVue 4)
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const store = useDatabaseConnectionsStore()

// State
const dialogVisible = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const selectedConnection = ref(null)
const errors = ref({})

const defaultForm = {
  name: '',
  title: '',
  driver: 'sqlsrv',
  host: '',
  port: '1433',
  database: '',
  username: '',
  password: '',
  charset: 'utf8',
  collation: 'Persian_100_CI_AI_SC',
  options: {
    TrustServerCertificate: true,
    Encrypt: true,
  },
  is_active: true,
  description: '',
}

const form = reactive({ ...defaultForm })

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Methods
const resetForm = () => {
  Object.assign(form, defaultForm)
  form.options = { ...defaultForm.options }
  errors.value = {}
}

const openNewDialog = () => {
  resetForm()
  isEdit.value = false
  selectedConnection.value = null
  dialogVisible.value = true
}

const editConnection = (data) => {
  resetForm()
  Object.assign(form, {
    ...data,
    password: '', // پسورد خالی برای نمایش placeholder
    options: { ...defaultForm.options, ...(data.options || {}) },
  })
  isEdit.value = true
  selectedConnection.value = data
  dialogVisible.value = true
}

const confirmDelete = (data) => {
  selectedConnection.value = data
  deleteDialog.value = true
}

const handleDelete = async () => {
  try {
    await store.remove(selectedConnection.value.id)
    deleteDialog.value = false
  } catch (error) {
    showToast({ severity: 'error', summary: 'خطا', detail: 'خطا در حذف', life: 3000 })
  }
}

const handleSubmit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    const payload = { ...form }
    // اگر ویرایش است و پسورد خالی است، آن را حذف کن
    if (isEdit.value && !payload.password) {
      delete payload.password
    }
    payload.is_edit = isEdit.value

    if (isEdit.value) {
      await store.update(selectedConnection.value.id, payload)
    } else {
      await store.create(payload)
    }
    dialogVisible.value = false
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      showToast({
        severity: 'error',
        summary: 'خطا',
        detail: error.response?.data?.message || 'خطا در ذخیره',
        life: 3000
      })
    }
  } finally {
    submitting.value = false
  }
}

const handleTestForm = async () => {
  if (!form.host || !form.database || !form.username || !form.password) {
    showToast({
      severity: 'warn',
      summary: 'توجه',
      detail: 'لطفاً ابتدا فیلدهای ضروری را پر کنید',
      life: 3000
    })
    return
  }
  await store.testConnection(form)
}

const handleTestSaved = async (id) => {
  await store.testSavedConnection(id)
}

const getDriverSeverity = (driver) => {
  const map = {
    sqlsrv: 'info',
    mysql: 'success',
    pgsql: 'warn',
  }
  return map[driver] || 'secondary'
}

// Lifecycle
onMounted(() => {
  store.fetchAll()
})
</script>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
}
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>