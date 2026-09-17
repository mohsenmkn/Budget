<template>
  <router-view></router-view>
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authold.js'
import { setToastInstance } from '@/plugins/toast'
import {useToast} from "primevue/usetoast";

const authStore = useAuthStore()
const toast = useToast()

onMounted(async () => {
  setToastInstance(toast)


})

</script>