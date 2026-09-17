<template>
  <div
      class="flex items-center justify-between
           py-3 border-b border-slate-100 last:border-0"
  >
    <div class="flex items-center gap-2">
      <i
          :class="icon"
          class="text-indigo-500 text-sm"
      ></i>

      <span class="text-xs text-slate-500">
        {{ label }}
      </span>
    </div>

    <span
        class="text-xs font-semibold text-slate-700
             text-left max-w-[150px] truncate"
    >
      {{ value || '—' }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: [String, Number]
})
</script>