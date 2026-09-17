<!-- resources/js/Modules/Payroll/Views/AdminPayslips.vue -->
<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="pi pi-users text-primary"></i>
      مدیریت فیش‌های حقوقی
    </h1>

    <!-- جستجوی کارمند -->
    <Card class="shadow-md mb-6">
      <template #content>
        <div class="flex flex-col md:flex-row gap-4">
          <InputText
              v-model="searchQuery"
              placeholder="جستجو با نام، کد پرسنلی یا کد ملی..."
              class="flex-1"
              @keyup.enter="searchEmployees"
          />
          <Button
              label="جستجو"
              icon="pi pi-search"
              :loading="loadingEmployees"
              @click="searchEmployees"
          />
        </div>
      </template>
    </Card>

    <!-- پیام خطا -->
    <Message v-if="error" severity="error" :closable="false" class="mb-4">
      {{ error }}
    </Message>

    <!-- لیست کارمندان -->
    <DataTable
        :value="employees"
        :loading="loadingEmployees"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        class="shadow-md"
        emptyMessage="کارمندی یافت نشد"
    >
      <Column field="PersonnelCode" header="کد پرسنلی" />
      <Column field="FullName" header="نام و نام خانوادگی" />
      <Column field="NationalID" header="کد ملی" />
      <Column field="Mobile" header="موبایل" />
      <Column header="عملیات" style="width: 280px">
        <template #body="slotProps">
          <div class="flex gap-1 flex-wrap">
            <Button
                label="مشاهده"
                icon="pi pi-eye"
                size="small"
                severity="info"
                @click="viewPayslip(slotProps.data)"
            />
            <!-- 🔑 دکمه‌های جدید -->
            <Button
                icon="pi pi-file-pdf"
                size="small"
                severity="danger"
                outlined
                tooltip="دانلود PDF"
                tooltipPosition="top"
                :loading="downloadingPdf === slotProps.data.EmployeeID"
                @click="downloadEmployeePdf(slotProps.data)"
            />
            <Button
                icon="pi pi-print"
                size="small"
                severity="secondary"
                outlined
                tooltip="چاپ"
                tooltipPosition="top"
                @click="printEmployeePayslip(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog نمایش فیش -->
    <Dialog
        v-model:visible="showPayslipDialog"
        :header="`فیش حقوقی - ${selectedEmployee?.FullName}`"
        :style="{ width: '90vw', maxWidth: '1100px' }"
        modal
        :maximizable="true"
    >
      <!-- 🔑 دکمه‌های عملیات در بالای Dialog -->
      <div class="flex justify-end gap-2 mb-4 print:hidden">
        <Button
            label="چاپ"
            icon="pi pi-print"
            severity="secondary"
            outlined
            @click="printCurrentPayslip"
        />
        <Button
            label="دانلود PDF"
            icon="pi pi-file-pdf"
            severity="danger"
            :loading="downloadingPdf === selectedEmployee?.EmployeeID"
            @click="downloadCurrentPdf"
        />
      </div>

      <div v-if="employeePayslip" class="space-y-4">
        <!-- انتخاب ماه -->
        <div class="flex items-center gap-3">
          <label class="text-gray-600 font-medium">انتخاب ماه:</label>
          <Select
              v-model="selectedMonth"
              :options="months"
              optionLabel="label"
              optionValue="value"
              class="w-64"
              @update:modelValue="changeMonth"
          />
        </div>

        <!-- 🔑 محتوای قابل چاپ -->
        <div id="printable-payslip" class="print-area">
          <PayslipHeader :payslip="employeePayslip" />
          <PayslipSummary :summary="employeePayslip.summary" />
          <PayslipItems
              :grouped-items="employeePayslip.items"
              :summary="employeePayslip.summary"
          />
        </div>
      </div>

      <div v-else-if="loadingPayslip" class="flex justify-center py-10">
        <ProgressSpinner />
      </div>

      <div v-else class="text-center py-10 text-gray-500">
        <i class="pi pi-inbox text-5xl mb-3"></i>
        <p>فیش حقوقی یافت نشد</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';

import { payrollApi } from '@/Services/payrollApi.js';
import PayslipHeader from './PayslipHeader.vue';
import PayslipItems from './PayslipItems.vue';
import PayslipSummary from './PayslipSummary.vue';
import { usePayslipPrint } from '@/composables/usePayslipPrint.js';

const toast = useToast();

const searchQuery = ref('');
const employees = ref([]);
const loadingEmployees = ref(false);
const error = ref(null);
const showPayslipDialog = ref(false);
const selectedEmployee = ref(null);
const employeePayslip = ref(null);
const loadingPayslip = ref(false);
const months = ref([]);
const selectedMonth = ref(null);
const downloadingPdf = ref(null);  // 🔑 برای نمایش loading روی دکمه PDF
const { printPayslip } = usePayslipPrint();  // 🔑 جدید

/**
 * جستجوی کارمندان
 */
const searchEmployees = async () => {
  loadingEmployees.value = true;
  error.value = null;
  try {
    const response = await payrollApi.getEmployees(searchQuery.value);
    const data = response.data.data;
    employees.value = data.data || data || [];
  } catch (err) {
    error.value = err.response?.data?.message || 'خطا در جستجوی کارمندان';
    employees.value = [];
  } finally {
    loadingEmployees.value = false;
  }
};








/**
 * مشاهده فیش حقوقی یک کارمند
 */
const viewPayslip = async (employee) => {
  selectedEmployee.value = employee;
  showPayslipDialog.value = true;
  loadingPayslip.value = true;
  employeePayslip.value = null;

  try {
    const monthsResponse = await payrollApi.getMonths();
    const rawMonths = monthsResponse.data.data || [];

    months.value = rawMonths.map(m => ({
      ...m,
      value: Number(m.value),
    }));

    if (months.value.length > 0) {
      selectedMonth.value = Number(months.value[0].value);
      await loadEmployeePayslip(selectedMonth.value);
    }
  } catch (err) {
    console.error('Error loading months:', err);
  } finally {
    loadingPayslip.value = false;
  }
};


/**
 * تغییر ماه در Dialog
 */
const changeMonth = async (yearMonth) => {
  await loadEmployeePayslip(Number(yearMonth));
};

/**
 * بارگذاری فیش حقوقی کارمند انتخابی
 */
const loadEmployeePayslip = async (yearMonth) => {
  if (!selectedEmployee.value || !yearMonth) return;

  loadingPayslip.value = true;
  try {
    const response = await payrollApi.getEmployeePayslip(
        selectedEmployee.value.EmployeeID,
        yearMonth
    );

    const payslipData = response.data.data;

    employeePayslip.value = {
      ...payslipData,
      summary: payslipData.summary || {
        total_benefits: 0,
        total_deductions: 0,
        net_pay: 0,
        effective_days: 0,
      },
      items: payslipData.items || {},
    };
  } catch (err) {
    employeePayslip.value = null;
  } finally {
    loadingPayslip.value = false;
  }
};

/**
 * 🔑 دانلود PDF فیش یک کارمند (از ردیف جدول)
 */
const downloadEmployeePdf = async (employee) => {
  if (!months.value.length) {
    toast.add({
      severity: 'warn',
      summary: 'هشدار',
      detail: 'لطفاً ابتدا فیش را مشاهده کنید',
      life: 3000,
    });
    return;
  }

  downloadingPdf.value = employee.EmployeeID;
  try {
    await payrollApi.downloadEmployeePdf(
        employee.EmployeeID,
        selectedMonth.value || months.value[0].value
    );
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: 'فیش حقوقی دانلود شد',
      life: 3000,
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: err.response?.data?.message || 'خطا در دانلود PDF',
      life: 5000,
    });
  } finally {
    downloadingPdf.value = null;
  }
};

/**
 * 🔑 دانلود PDF فیش فعلی (از داخل Dialog)
 */
const downloadCurrentPdf = async () => {
  if (!selectedEmployee.value || !selectedMonth.value) return;
  await downloadEmployeePdf(selectedEmployee.value);
};

/**
 * 🔑 چاپ فیش یک کارمند (از ردیف جدول)
 */
const printEmployeePayslip = async (employee) => {
  selectedEmployee.value = employee;

  if (!showPayslipDialog.value) {
    await viewPayslip(employee);
  } else {
    await loadEmployeePayslip(selectedMonth.value);
  }

  // صبر کن تا رندر شود
  setTimeout(() => {
    printCurrentPayslip();
  }, 500);
};

/**
 *  چاپ فیش فعلی (از داخل Dialog)
 */
const printCurrentPayslip = () => {
  if (!employeePayslip.value) {
    toast.add({
      severity: 'warn',
      summary: 'هشدار',
      detail: 'فیش حقوقی برای چاپ آماده نیست',
      life: 3000,
    });
    return;
  }
  printPayslip(employeePayslip.value);
};

/**
 *  فرمت عدد فارسی (برای استفاده در HTML چاپ)
 */
const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return Number(value).toLocaleString('fa-IR');
};

/**
 *  ساخت ردیف‌های جدول چاپ (همان منطق tableRows)
 */
const buildPrintTableRows = (items) => {
  const work = items['کارکرد'] || [];
  const benefit = items['مزایا'] || [];
  const deduction = items['کسورات'] || [];
  const maxRows = Math.max(work.length, benefit.length, deduction.length);

  let html = '';
  for (let i = 0; i < maxRows; i++) {
    html += '<tr>';
    html += '<td class="col-work">';
    if (work[i]) {
      html += `<div class="item-row"><span>${work[i].title}</span><span>${formatNumber(work[i].amount)}</span></div>`;
    }
    html += '</td>';
    html += '<td class="col-benefit">';
    if (benefit[i]) {
      html += `<div class="item-row"><span>${benefit[i].title}</span><span>${formatNumber(benefit[i].amount)}</span></div>`;
    }
    html += '</td>';
    html += '<td class="col-deduction">';
    if (deduction[i]) {
      html += `<div class="item-row"><span>${deduction[i].title}</span><span>${formatNumber(deduction[i].amount)}</span></div>`;
    }
    html += '</td>';
    html += '</tr>';
  }
  return html;
};
</script>

<style scoped>
/* استایل‌های مخصوص چاپ */
@media print {
  body * {
    visibility: hidden;
  }
  #printable-payslip, #printable-payslip * {
    visibility: visible;
  }
  #printable-payslip {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .print\:hidden, .no-print {
    display: none !important;
  }
}
</style>