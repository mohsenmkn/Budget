<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="pi pi-users text-indigo-500"></i>
          لیست پرسنل
        </h1>
        <p class="text-sm text-gray-400 mt-1">
          فهرست کارکنان سازمان با اطلاعات سمت و واحد
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- جستجو -->
        <IconField iconPosition="right">
          <InputIcon><i class="pi pi-search text-gray-400"></i></InputIcon>
          <InputText
              v-model="filters.search"
              placeholder="جستجو: نام، کد پرسنلی، سمت..."
              class="w-full"
              @keyup.enter="fetchEmployees"
          />
        </IconField>

        <!-- فیلتر واحد -->
        <Select
            v-model="filters.unit_id"
            :options="units"
            optionLabel="title"
            optionValue="id"
            placeholder="همه واحدها"
            showClear
            class="w-full"
            @change="fetchEmployees"
        />

        <!-- فیلتر نوع کاربر -->
        <Select
            v-model="filters.employee_type"
            :options="employeeTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="همه انواع"
            showClear
            class="w-full"
            @change="fetchEmployees"
        />

        <!-- فیلتر وضعیت -->
        <Select
            v-model="filters.is_active"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="همه وضعیت‌ها"
            showClear
            class="w-full"
            @change="fetchEmployees"
        />
      </div>

      <!-- دکمه جستجو -->
      <div class="mt-4 flex justify-end">
        <Button
            label="جستجو"
            icon="pi pi-search"
            @click="fetchEmployees"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <DataTable
          :value="employees"
          :loading="loading"
          lazy
          :rows="pagination.per_page"
          :totalRecords="pagination.total"
          :first="(pagination.current_page - 1) * pagination.per_page"
          @page="onPage"
          paginator
          :rowsPerPageOptions="[10, 15, 25, 50]"
          stripedRows
          responsiveLayout="scroll"
      >
        <!-- نام -->
        <Column field="name" header="نام و نام خانوادگی" style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                {{ data.user?.name?.charAt(0) }}
              </span>
              <div>
                <span class="font-semibold text-gray-800 text-sm block">
                  {{ data.user?.name }}
                </span>
                <span class="text-xs text-gray-400">{{ data.user?.mobile }}</span>
              </div>
            </div>
          </template>
        </Column>

        <!-- کد پرسنلی -->
        <Column field="personnel_code" header="کد پرسنلی" style="width: 100px">
          <template #body="{ data }">
            <Tag :value="data.personnel_code" severity="secondary" />
          </template>
        </Column>

        <!-- واحد -->
        <Column field="unit.title" header="واحد سازمانی" style="min-width: 160px">
          <template #body="{ data }">
            <span v-if="data.unit" class="text-sm text-gray-700 flex items-center gap-1">
              <i class="pi pi-building text-indigo-400 text-xs"></i>
              {{ data.unit.title }}
            </span>
            <span v-else class="text-xs text-gray-300">—</span>
          </template>
        </Column>

        <!-- پست -->
        <Column field="post_title" header="پست سازمانی" style="min-width: 200px">
          <template #body="{ data }">
            <span class="text-sm text-gray-700">{{ data.post_title || '—' }}</span>
          </template>
        </Column>

        <!-- شغل -->
        <Column field="job_title" header="شغل" style="min-width: 180px">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.job_title || '—' }}</span>
          </template>
        </Column>

        <!-- نوع کاربر -->
        <Column header="نوع کاربر" style="width: 110px">
          <template #body="{ data }">
            <Tag
                v-if="getUserType(data) === 'contractor'"
                value="پیمانکار"
                severity="warning"
            />
            <Tag
                v-else
                value="پرسنل"
                severity="success"
            />
          </template>
        </Column>

        <!-- وضعیت -->
        <Column header="وضعیت" style="width: 110px">
          <template #body="{ data }">
            <Tag
                :value="getUserStatus(data) ? 'فعال' : 'غیرفعال'"
                :severity="getUserStatus(data) ? 'success' : 'danger'"
            />
          </template>
        </Column>

        <!-- عملیات -->
        <Column header="عملیات" style="width: 100px" class="text-center">
          <template #body="{ data }">
            <Button
                icon="pi pi-eye"
                severity="info"
                outlined
                rounded
                size="small"
                @click="viewProfile(data.user_id)"
                v-tooltip.top="'مشاهده پروفایل'"
            />
          </template>
        </Column>

        <!-- خالی -->
        <template #empty>
          <div class="text-center py-10 text-gray-400">
            <i class="pi pi-users text-4xl mb-3 block"></i>
            رکوردی یافت نشد.
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import hrService from '@/services/hrService'

const router = useRouter()

const employees = ref([])
const units = ref([])
const loading = ref(true)


const pagination = reactive({
  total: 0,
  per_page: 15,
  current_page: 1,
})

// ✅ گزینه‌های فیلتر نوع کاربر
const employeeTypeOptions = [
  { label: 'پرسنل', value: 'personnel' },
  { label: 'پیمانکار', value: 'contractor' },
]

// ✅ گزینه‌های فیلتر وضعیت
const statusOptions = [
  { label: 'فعال', value: 1 },
  { label: 'غیرفعال', value: 0 },
]


const filters = reactive({
  search: '',
  unit_id: null,
  employee_type: 'personnel', // ✅ فقط پرسنل به‌صورت پیش‌فرض
  is_active: null,
})


const fetchEmployees = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: pagination.per_page,
      search: filters.search || undefined,
      unit_id: filters.unit_id || undefined,
      employee_type: filters.employee_type || undefined,
      is_active: filters.is_active !== null && filters.is_active !== undefined ? filters.is_active : undefined,
    }

    const data = await hrService.getEmployees(params)

    employees.value = data.data
    pagination.total = data.total
    pagination.current_page = data.current_page
    pagination.per_page = data.per_page
  } catch (error) {
    console.error('Fetch employees error:', error)
  } finally {
    loading.value = false
  }
}

const fetchUnits = async () => {
  try {
    const data = await hrService.getUnits()
    units.value = data.units || []
  } catch (e) {
    console.error('Fetch units error:', e)
  }
}

const onPage = (event) => {
  pagination.per_page = event.rows
  fetchEmployees(event.page + 1)
}

const getUserType = (row) => {
  return row?.user?.employee_type
      || row?.employee_type
      || 'personnel';
};

const getUserStatus = (row) => {
  return Boolean(row?.user?.is_active ?? row?.is_active ?? false);
};

const viewProfile = (userId) => {
  router.push({ name: 'hr.employee.profile', params: { id: userId } })
}

onMounted(() => {
  fetchEmployees()
  fetchUnits()
})
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