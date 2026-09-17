<template>
  <div class="space-y-4 pt-4">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <i class="pi pi-spinner pi-spin text-3xl text-indigo-500"></i>
    </div>

    <!-- Empty -->
    <div v-else-if="!relatives.length" class="text-center py-10 text-gray-400">
      <i class="pi pi-users text-4xl mb-3 block"></i>
      اطلاعاتی برای خانواده ثبت نشده است.
    </div>

    <!-- Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="person in relatives"
          :key="person.EmployeeRelativeID"
          class="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                :class="relationColor(person.RelationCode)"
                          >
                <i :class="relationIcon(person.RelationCode)" v-if="person.RelationCode === 3"></i>
                <span v-else>{{ person.FullName?.charAt(0) || '؟' }}</span>
              </span>
            <div>
              <h4 class="font-bold text-gray-800 text-sm">{{ person.FullName }}</h4>
              <Tag
                  :value="person.RelationTitle"
                  :severity="relationSeverity(person.RelationCode)"
                  class="mt-1"
                  style="font-size: 10px"
              />
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">نام پدر</span>
            <span class="text-gray-800">{{ person.FatherName || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">کد ملی</span>
            <span class="text-gray-800" dir="ltr">{{ person.NationalID || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">شماره شناسنامه</span>
            <span class="text-gray-800" dir="ltr">{{ person.IDNumber || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">تاریخ تولد</span>
            <span class="text-gray-800">{{ formatDate(person.BirthDate) }}</span>
          </div>
          <div v-if="person.MaritalStatusTitle !== '—'" class="flex justify-between">
            <span class="text-gray-500">وضعیت تأهل</span>
            <span class="text-gray-800">{{ person.MaritalStatusTitle }}</span>
          </div>
          <div v-if="person.DegreeTitle !== '—'" class="flex justify-between">
            <span class="text-gray-500">مدرک تحصیلی</span>
            <span class="text-gray-800">{{ person.DegreeTitle }}</span>
          </div>
          <div v-if="person.EducationStateTitle !== '—'" class="flex justify-between">
            <span class="text-gray-500">وضعیت تحصیلی</span>
            <span class="text-gray-800">{{ person.EducationStateTitle }}</span>
          </div>
          <div v-if="person.PhysicalStateTitle !== '—'" class="flex justify-between">
            <span class="text-gray-500">وضعیت جسمانی</span>
            <span class="text-gray-800">{{ person.PhysicalStateTitle }}</span>
          </div>
          <div v-if="person.Job" class="flex justify-between">
            <span class="text-gray-500">شغل</span>
            <span class="text-gray-800">{{ person.Job }}</span>
          </div>
          <div v-if="person.Description" class="pt-2 border-t border-gray-100">
            <span class="text-xs text-gray-400">{{ person.Description }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import hrService from '@/services/hrService'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const relatives = ref([])
const loading = ref(true)

const fetchRelatives = async () => {
  loading.value = true
  try {
    const data = await hrService.getEmployeeRelatives(props.userId)
    relatives.value = data.relatives || []
  } catch (error) {
    console.error('Fetch relatives error:', error)
  } finally {
    loading.value = false
  }
}

// رنگ آواتار بر اساس نسبت



const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}


// رنگ آواتار بر اساس نسبت
const relationColor = (code) => {
  const colors = {
    3: 'bg-pink-500',     // همسر
    7: 'bg-blue-500',     // فرزند پسر
    8: 'bg-purple-500',   // فرزند دختر
    4: 'bg-gray-600',     // پدر / مادر
    1: 'bg-gray-400',     // سایر
  }
  return colors[code] || 'bg-gray-400'
}

const relationSeverity = (code) => {
  const severities = {
    3: 'danger',    // همسر — قرمز
    7: 'info',      // فرزند پسر — آبی
    8: 'warning',   // فرزند دختر — بنفش
    4: 'secondary', // پدر/مادر — خاکستری
    1: 'secondary',
  }
  return severities[code] || 'secondary'
}

// ✅ آیکون بر اساس نسبت
const relationIcon = (code) => {
  const icons = {
    3: 'pi pi-heart',       // همسر
    7: 'pi pi-user',        // فرزند پسر
    8: 'pi pi-user',        // فرزند دختر
    4: 'pi pi-user',        // پدر/مادر
  }
  return icons[code] || 'pi pi-user'
}




onMounted(fetchRelatives)
</script>