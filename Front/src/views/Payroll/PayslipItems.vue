<!-- resources/js/Modules/Payroll/Components/PayslipItems.vue -->
<template>
  <Card class="shadow-md">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-list text-primary"></i>
        <span>ریز اقلام حقوقی</span>
      </div>
    </template>
    <template #content>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-3 text-center font-bold text-purple-700 w-1/3">
              <i class="pi pi-clock ml-1"></i>
              کارکرد
            </th>
            <th class="border border-gray-300 px-4 py-3 text-center font-bold text-green-700 w-1/3">
              <i class="pi pi-arrow-up ml-1"></i>
              مزایا
            </th>
            <th class="border border-gray-300 px-4 py-3 text-center font-bold text-red-700 w-1/3">
              <i class="pi pi-arrow-down ml-1"></i>
              کسورات
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="row in tableRows"
              :key="row.index"
              class="hover:bg-gray-50 transition-colors"
          >
            <!-- ستون کارکرد -->
            <td class="border border-gray-300 px-4 py-2 text-purple-700 min-h-[40px]">
              <div v-if="row.work" class="flex justify-between items-center">
                <span>{{ row.work.title }}</span>
                <span class="font-mono font-bold">
                                        {{ formatNumber(row.work.amount) }}
                                    </span>
              </div>
            </td>

            <!-- ستون مزایا -->
            <td class="border border-gray-300 px-4 py-2 text-green-700 min-h-[40px]">
              <div v-if="row.benefit" class="flex justify-between items-center">
                <span>{{ row.benefit.title }}</span>
                <span class="font-mono font-bold">
                                        {{ formatNumber(row.benefit.amount) }}
                                    </span>
              </div>
            </td>

            <!-- ستون کسورات -->
            <td class="border border-gray-300 px-4 py-2 text-red-700 min-h-[40px]">
              <div v-if="row.deduction" class="flex justify-between items-center">
                <span>{{ row.deduction.title }}</span>
                <span class="font-mono font-bold">
                                        {{ formatNumber(row.deduction.amount) }}
                                    </span>
              </div>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr class="bg-blue-50 font-bold">
            <td class="border border-gray-300 px-4 py-3 text-center text-blue-800">
              <!-- خالی -->
            </td>
            <td class="border border-gray-300 px-4 py-3 text-center text-green-800">
              <div class="flex justify-between items-center">
                <span>جمع مزایا:</span>
                <span class="font-mono text-lg">
                                        {{ formatNumber(summary?.total_benefits || 0) }}
                                    </span>
              </div>
            </td>
            <td class="border border-gray-300 px-4 py-3 text-center text-red-800">
              <div class="flex justify-between items-center">
                <span>جمع کسورات:</span>
                <span class="font-mono text-lg">
                                        {{ formatNumber(summary?.total_deductions || 0) }}
                                    </span>
              </div>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import { useFormatter } from '@/composables/useFormatter.js';

const { formatNumber } = useFormatter();

const props = defineProps({
  groupedItems: {
    type: Object,
    required: true,
    default: () => ({}),
  },
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

/**
 * تبدیل آیتم‌های گروه‌بندی شده به ردیف‌های جدول 3 ستونه
 */
const tableRows = computed(() => {
  const workItems = props.groupedItems['کارکرد'] || [];
  const benefitItems = props.groupedItems['مزایا'] || [];
  const deductionItems = props.groupedItems['کسورات'] || [];

  const maxRows = Math.max(
      workItems.length,
      benefitItems.length,
      deductionItems.length
  );

  const rows = [];

  for (let i = 0; i < maxRows; i++) {
    rows.push({
      index: i,
      work: workItems[i] || null,
      benefit: benefitItems[i] || null,
      deduction: deductionItems[i] || null,
    });
  }

  return rows;
});
</script>

<style scoped>
table {
  direction: rtl;
}
th, td {
  text-align: right;
}
</style>