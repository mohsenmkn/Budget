<!-- resources/js/Modules/Payroll/Components/PayslipHeader.vue -->
<template>
  <Card class="shadow-md">
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <i class="pi pi-id-card text-primary text-xl"></i>
            <span class="text-gray-600">کد پرسنلی:</span>
            <span class="font-bold text-lg">{{ formatPlain(payslip.personnel_code) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-primary text-xl"></i>
            <span class="text-gray-600">نام:</span>
            <span class="font-bold text-lg">{{ payslip.employee_name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-primary text-xl"></i>
            <span class="text-gray-600">دوره:</span>
            <span class="font-bold text-lg">{{ formatYearMonth(payslip.year_month) }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <i class="pi pi-address-book text-primary text-xl"></i>
            <span class="text-gray-600">کد ملی:</span>
            <span class="font-bold">{{ formatPlain(payslip.national_id) }}</span>
          </div>
          <div class="flex items-center gap-2" v-if="payslip.father_name">
            <i class="pi pi-users text-primary text-xl"></i>
            <span class="text-gray-600">نام پدر:</span>
            <span class="font-bold">{{ payslip.father_name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-primary text-xl"></i>
            <span class="text-gray-600">روزهای کارکرد:</span>
            <span class="font-bold">{{ formatPlain(payslip.summary.effective_days) }} روز</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
import { useFormatter } from '@/composables/useFormatter.js';

const { formatPlain, formatYearMonth } = useFormatter();

defineProps({
  payslip: {
    type: Object,
    required: true,
  },
});
</script>