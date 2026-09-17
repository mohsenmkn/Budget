<template>
  <div class="equipment-cost-report p-4">
    <!-- هدر صفحه -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">گزارش هزینه تجهیزات</h1>
        <p class="text-sm text-gray-500 mt-1">
          محاسبه هزینه‌های ثبت شده برای هر تجهیز (لودر، دامپتراک، بیل مکانیکی و...)
        </p>
      </div>
      <div class="flex gap-2">
        <Button
            v-if="reportData.costs?.length"
            label="خروجی اکسل"
            icon="pi pi-file-excel"
            class="p-button-success"
            :loading="exporting"
            @click="exportToExcel"
        />
        <Button
            v-if="reportData.costs?.length"
            label="چاپ گزارش"
            icon="pi pi-print"
            class="p-button-secondary"
            @click="printReport"
        />
      </div>
    </div>

    <!-- کارت فیلتر -->
    <Card class="mb-6">
      <template #content>
        <form @submit.prevent="fetchReport" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- نوع تجهیز -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">نوع تجهیز</label>
            <Select
                v-model="filters.type_id"
                :options="equipmentTypes"
                optionLabel="Title"
                optionValue="DLTypeID"
                placeholder="انتخاب کنید"
                class="w-full"
                :loading="loadingTypes"
                @change="onTypeChange"
                filter
                filter-placeholder="جستجوی نوع..."
            />
          </div>

          <!-- تجهیز (با قابلیت جستجو) -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">تجهیز</label>
            <Select
                v-model="filters.equipment_code"
                :options="equipments"
                optionLabel="Title"
                optionValue="Code"
                placeholder="انتخاب یا جستجو کنید"
                class="w-full"
                :loading="loadingEquipments"
                :disabled="!filters.type_id"
                filter
                filter-placeholder="جستجوی تجهیز..."
                show-clear
            />
          </div>

          <!-- از تاریخ -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">از تاریخ</label>
            <DatePicker
                v-model="filters.from_date"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                class="w-full"
            />
          </div>

          <!-- تا تاریخ -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">تا تاریخ</label>
            <DatePicker
                v-model="filters.to_date"
                dateFormat="yy-mm-dd"
                iconDisplay="input"
                class="w-full"
                showIcon
                showButtonBar
            />
          </div>

          <!-- دکمه جستجو -->
          <div class="flex flex-col justify-end">
            <Button
                type="submit"
                label="مشاهده گزارش"
                icon="pi pi-search"
                :loading="loading"
                class="w-full"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- نمایش نتایج -->
    <template v-if="reportData.costs?.length">
      <!-- کارت‌های خلاصه -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div class="flex items-center gap-3">
            <div class="bg-blue-500 p-3 rounded-lg">
              <i class="pi pi-hashtag text-white text-xl"></i>
            </div>
            <div>
              <div class="text-xs text-blue-600 font-medium">تعداد تراکنش</div>
              <div class="text-2xl font-bold text-blue-800">
                {{ reportData.count.toLocaleString('fa-IR') }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div class="flex items-center gap-3">
            <div class="bg-green-500 p-3 rounded-lg">
              <i class="pi pi-dollar text-white text-xl"></i>
            </div>
            <div>
              <div class="text-xs text-green-600 font-medium">مجموع هزینه</div>
              <div class="text-2xl font-bold text-green-800">
                {{ formatCurrency(reportData.total) }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div class="flex items-center gap-3">
            <div class="bg-purple-500 p-3 rounded-lg">
              <i class="pi pi-chart-line text-white text-xl"></i>
            </div>
            <div>
              <div class="text-xs text-purple-600 font-medium">میانگین هزینه</div>
              <div class="text-2xl font-bold text-purple-800">
                {{ formatCurrency(reportData.total / reportData.count) }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div class="flex items-center gap-3">
            <div class="bg-orange-500 p-3 rounded-lg">
              <i class="pi pi-calendar text-white text-xl"></i>
            </div>
            <div>
              <div class="text-xs text-orange-600 font-medium">بازه زمانی</div>
              <div class="text-sm font-bold text-orange-800">
                {{ formatDate(reportData.from_date) }}
                <br />
                تا {{ formatDate(reportData.to_date) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- نمودارها -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- نمودار هزینه بر اساس زمان -->
        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <i class="pi pi-chart-line text-xl"></i>
              <span>روند هزینه‌ها در زمان</span>
            </div>
          </template>
          <template #content>
            <Chart
                type="line"
                :data="chartDataByDate"
                :options="chartOptions"
                class="h-80"
            />
          </template>
        </Card>

        <!-- نمودار هزینه بر اساس نوع حساب -->
        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <i class="pi pi-chart-pie text-xl"></i>
              <span>توزیع هزینه بر اساس سرفصل</span>
            </div>
          </template>
          <template #content>
            <Chart
                type="bar"
                :data="chartDataByAccount"
                :options="chartOptions"
                class="h-80"
            />
          </template>
        </Card>
      </div>

      <!-- جدول نتایج -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-table text-xl"></i>
            <span>جزئیات تراکنش‌ها</span>
          </div>
        </template>
        <template #content>
          <DataTable
              :value="reportData.costs"
              :paginator="true"
              :rows="20"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              responsiveLayout="scroll"
              stripedRows
              :loading="loading"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="{first} تا {last} از {totalRecords}"
          >
            <Column field="voucher_date" header="تاریخ سند" sortable>
              <template #body="{ data }">
                <Tag :value="formatDate(data.voucher_date)" severity="info" />
              </template>
            </Column>
            <Column field="voucher_number" header="شماره سند" sortable />
            <Column field="account_code" header="کد معین" />
            <Column field="account_title" header="سرفصل حساب" sortable />
            <Column field="voucher_description" header="شرح سند" />
            <Column field="amount" header="مبلغ" sortable>
              <template #body="{ data }">
                <span :class="data.amount < 0 ? 'font-bold text-red-600' : 'font-bold text-blue-700'">
                  {{ formatCurrency(data.amount) }}
                </span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </template>

    <!-- پیام خالی -->
    <Card v-else-if="!loading && reportFetched">
      <template #content>
        <div class="text-center py-12">
          <i class="pi pi-info-circle text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">
            هیچ هزینه‌ای برای این تجهیز در بازه زمانی انتخاب شده یافت نشد.
          </p>
        </div>
      </template>
    </Card>

    <!-- پیام اولیه -->
    <Card v-else-if="!loading && !reportFetched">
      <template #content>
        <div class="text-center py-12">
          <i class="pi pi-search text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">
            لطفاً فیلترهای مورد نظر را انتخاب و روی "مشاهده گزارش" کلیک کنید.
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from '@/api/axios';
import Card from 'primevue/card';
//import DatePicker from 'vue3-persian-datetime-picker'
//import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';
import { useToast } from 'primevue/usetoast';
//import * as XLSX from 'xlsx';

const toast = useToast();

// State
const equipmentTypes = ref([]);
const equipments = ref([]);
const loadingTypes = ref(false);
const loadingEquipments = ref(false);
const loading = ref(false);
const exporting = ref(false);
const reportFetched = ref(false);

const reportData = reactive({
  costs: [],
  total: 0,
  count: 0,
  from_date: null,
  to_date: null,
});

const filters = reactive({
  type_id: null,
  equipment_code: null,
  from_date: new Date(new Date().getFullYear(), 0, 1),
  to_date: new Date(),
});

// تنظیمات نمودار
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: {
          family: 'Vazirmatn, sans-serif',
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return new Intl.NumberFormat('fa-IR', {
            style: 'decimal',
            minimumFractionDigits: 0,
          }).format(context.parsed.y) + ' ریال';
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('fa-IR', {
            notation: 'compact',
            compactDisplay: 'short'
          }).format(value);
        }
      }
    }
  }
};

// داده‌های نمودار بر اساس تاریخ
const chartDataByDate = computed(() => {
  if (!reportData.costs.length) return null;

  // گروه‌بندی بر اساس تاریخ
  const groupedByDate = reportData.costs.reduce((acc, item) => {
    const date = item.voucher_date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += Math.abs(item.amount);
    return acc;
  }, {});

  // مرتب‌سازی بر اساس تاریخ
  const sortedDates = Object.keys(groupedByDate).sort();

  return {
    labels: sortedDates.map(date => formatDate(date)),
    datasets: [
      {
        label: 'هزینه روزانه',
        data: sortedDates.map(date => groupedByDate[date]),
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4,
        backgroundColor: '#3b82f6',
      }
    ]
  };
});

// داده‌های نمودار بر اساس سرفصل حساب
const chartDataByAccount = computed(() => {
  if (!reportData.costs.length) return null;

  // گروه‌بندی بر اساس سرفصل حساب
  const groupedByAccount = reportData.costs.reduce((acc, item) => {
    const account = item.account_title || 'سایر';
    if (!acc[account]) {
      acc[account] = 0;
    }
    acc[account] += Math.abs(item.amount);
    return acc;
  }, {});

  const accounts = Object.keys(groupedByAccount);
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  return {
    labels: accounts,
    datasets: [
      {
        label: 'هزینه بر اساس سرفصل',
        data: accounts.map(account => groupedByAccount[account]),
        backgroundColor: accounts.map((_, i) => colors[i % colors.length]),
        borderColor: accounts.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
      }
    ]
  };
});

// Methods
const fetchEquipmentTypes = async () => {
  loadingTypes.value = true;
  try {
    const response = await axios.get('/finance/equipment-costs/types');
    if (response.data.success) {
      equipmentTypes.value = response.data.data;
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: 'خطا در دریافت انواع تجهیزات',
      life: 3000,
    });
  } finally {
    loadingTypes.value = false;
  }
};

const onTypeChange = async () => {
  equipments.value = [];
  filters.equipment_code = null;

  if (!filters.type_id) return;

  loadingEquipments.value = true;
  try {
    const response = await axios.get('/finance/equipment-costs/equipments', {
      params: { type_id: filters.type_id },
    });
    if (response.data.success) {
      equipments.value = response.data.data;
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: 'خطا در دریافت لیست تجهیزات',
      life: 3000,
    });
  } finally {
    loadingEquipments.value = false;
  }
};

const fetchReport = async () => {
  if (!filters.equipment_code || !filters.type_id) {
    toast.add({
      severity: 'warn',
      summary: 'هشدار',
      detail: 'لطفاً نوع تجهیز و تجهیز را انتخاب کنید',
      life: 3000,
    });
    return;
  }

  console.log(' Sending request:', {
    equipment_code: filters.equipment_code,
    type_id: filters.type_id,
    from_date: filters.from_date,
    to_date: filters.to_date,
  });

  loading.value = true;
  reportFetched.value = false;

  try {
    const response = await axios.get('/finance/equipment-costs/report', {
      params: {
        equipment_code: filters.equipment_code,
        type_id: filters.type_id,
        from_date: formatDateForAPI(filters.from_date),
        to_date: formatDateForAPI(filters.to_date),
      },
    });

    console.log('✅ Response received:', response.data);

    if (response.data.success) {
      reportData.costs = response.data.data.costs;
      reportData.total = response.data.data.total;
      reportData.count = response.data.data.count;
      reportData.from_date = response.data.data.from_date;
      reportData.to_date = response.data.data.to_date;
      reportFetched.value = true;

      console.log('📈 Data loaded:', reportData.count, 'records');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Response:', error.response?.data);

    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: error.response?.data?.message || 'خطا در دریافت گزارش هزینه‌ها',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const exportToExcel = async () => {
  if (!reportData.costs?.length) return;

  exporting.value = true;
  try {
    const data = reportData.costs.map((item) => ({
      'تاریخ سند': formatDate(item.voucher_date),
      'شماره سند': item.voucher_number,
      'کد معین': item.account_code,
      'سرفصل حساب': item.account_title,
      'شرح سند': item.voucher_description,
      'مبلغ': item.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش هزینه تجهیزات');

    const fileName = `equipment-costs-${reportData.from_date}-to-${reportData.to_date}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: 'فایل اکسل با موفقیت ایجاد شد',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: 'خطا در ایجاد فایل اکسل',
      life: 3000,
    });
  } finally {
    exporting.value = false;
  }
};

const printReport = () => {
  window.print();
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return '-';
  return new Intl.NumberFormat('fa-IR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' ریال';
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fa-IR');
};

const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Lifecycle
onMounted(() => {
  fetchEquipmentTypes();
});
</script>

<style scoped>
.equipment-cost-report {
  max-width: 1600px;
  margin: 0 auto;
}

@media print {
  .p-button, form {
    display: none;
  }
}
</style>