<!-- resources/js/Modules/Payroll/Components/PayslipSummary.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- جمع مزایا -->
    <Card class="shadow-md border-r-4 border-green-500">
      <template #content>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i class="pi pi-arrow-up text-green-600 text-2xl"></i>
            <span class="text-gray-600 font-medium">جمع کل مزایا</span>
          </div>
          <div class="text-2xl font-bold text-green-700">
            {{ formatCurrency(summary?.total_benefits || 0) }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ formatToToman(summary?.total_benefits || 0) }}
          </div>
        </div>
      </template>
    </Card>

    <!-- جمع کسورات -->
    <Card class="shadow-md border-r-4 border-red-500">
      <template #content>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i class="pi pi-arrow-down text-red-600 text-2xl"></i>
            <span class="text-gray-600 font-medium">جمع کل کسورات</span>
          </div>
          <div class="text-2xl font-bold text-red-700">
            {{ formatCurrency(summary?.total_deductions || 0) }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ formatToToman(summary?.total_deductions || 0) }}
          </div>
        </div>
      </template>
    </Card>

    <!-- خالص پرداختی -->
    <Card class="shadow-md border-r-4 border-blue-600 bg-blue-50">
      <template #content>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i class="pi pi-wallet text-blue-700 text-2xl"></i>
            <span class="text-gray-700 font-bold">خالص پرداختی</span>
          </div>
          <div class="text-3xl font-extrabold text-blue-800">
            {{ formatCurrency(summary?.net_pay || 0) }}
          </div>
          <div class="text-sm text-gray-600 mt-1 font-medium">
            {{ formatToToman(summary?.net_pay || 0) }}
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import { useFormatter } from '@/composables/useFormatter.js';

const { formatCurrency, formatToToman } = useFormatter();

defineProps({
  summary: {
    type: Object,
    // 🔑 دیگر required نیست
    default: () => ({
      total_benefits: 0,
      total_deductions: 0,
      net_pay: 0,
      effective_days: 0,
    }),
  },
});
</script>