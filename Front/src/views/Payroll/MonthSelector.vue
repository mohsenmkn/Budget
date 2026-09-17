<!-- resources/js/Modules/Payroll/Components/MonthSelector.vue -->
<template>
  <div class="flex items-center gap-3">
    <label class="text-gray-600 font-medium">انتخاب ماه:</label>
    <Select
        :modelValue="modelValue"
        :options="months"
        optionLabel="label"
        optionValue="value"
        placeholder="یک ماه را انتخاب کنید"
        class="w-64"
        @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import Select from 'primevue/select';

defineProps({
  months: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [Number, String],  // 🔑 هم Number و هم String قبول می‌کند
    default: null,
  },
});

defineEmits(['update:modelValue']);
</script>