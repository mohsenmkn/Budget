<template>
  <Dialog :visible="visible" :style="{ width: '800px' }" header="جزئیات پروژه" :modal="true" @update:visible="$emit('update:visible', $event)">

    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">

      <!-- Name (Required) -->
      <div style="margin-bottom: 1rem;">
        <label for="name" style="display: block; margin-bottom: 0.5rem;">نام پروژه <span style="color: red;">*</span></label>
        <InputText id="name" v-model="project.name" style="width: 100%;" :class="{'p-invalid': errors.name}" />
        <small v-if="errors.name" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.name }}</small>
      </div>

      <!-- Code (Required) -->
      <div style="margin-bottom: 1rem;">
        <label for="code" style="display: block; margin-bottom: 0.5rem;">کد پروژه <span style="color: red;">*</span></label>
        <InputText id="code" v-model="project.code" style="width: 100%;" :class="{'p-invalid': errors.code}" />
        <small v-if="errors.code" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.code }}</small>
      </div>

      <!-- Status (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="status" style="display: block; margin-bottom: 0.5rem;">وضعیت</label>
        <Select
            v-model="project.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="انتخاب وضعیت..."
            style="width: 100%;"
        />
      </div>
      </div>

      <!-- Budget (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="budget" style="display: block; margin-bottom: 0.5rem;">بودجه<span style="color: red;">*</span></label>
        <InputText id="budget" v-model="project.budget" style="width: 100%;" />
        <small v-if="errors.budget" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.budget }}</small>
      </div>
      </div>

      <!-- Location (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="location" style="display: block; margin-bottom: 0.5rem;">موقعیت مکانی<span style="color: red;">*</span></label>
        <InputText id="location" v-model="project.location" style="width: 100%;" />
        <small v-if="errors.location" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.location }}</small>
      </div>
      </div>

      <!-- Start Date (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="start_date" style="display: block; margin-bottom: 0.5rem;">تاریخ شروع<span style="color: red;">*</span></label>
        <DatePicker
            v-model="project.start_date"
            format="YYYY-MM-DD"
            display-format="jYYYY/jMM/jDD"
            style="width: 100%;"
        />
        <small v-if="errors.start_date" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.start_date }}</small>
      </div>
      </div>

      <!-- End Date (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="end_date" style="display: block; margin-bottom: 0.5rem;">تاریخ پایان<span style="color: red;">*</span></label>
        <DatePicker
            v-model="project.end_date"
            format="YYYY-MM-DD"
            display-format="jYYYY/jMM/jDD"
            style="width: 100%;"
        />
        <small v-if="errors.end_date" style="color: red; display: block; margin-top: 0.25rem;">{{ errors.end_date }}</small>
      </div>
      </div>

      <!-- Description (Nullable) -->
      <div style="margin-bottom: 1rem;">
      <div>
        <label for="description" style="display: block; margin-bottom: 0.5rem;">توضیحات</label>
        <Textarea id="description" v-model="project.description" rows="3" style="width: 100%;" />
      </div>
      </div>

    </div>

    <template #footer>
      <Button label="لغو"  icon="pi pi-times" text @click="closeForm" />
      <Button label="ذخیره" icon="pi pi-check" text @click="saveProject" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const statusOptions = ref([
  { label: 'در انتظار (Pending)', value: 'pending' },
  { label: 'در حال انجام (In Progress)', value: 'in_progress' },
  { label: 'تکمیل شده (Completed)', value: 'completed' },
  { label: 'متوقف شده (Halted)', value: 'halted' }
]);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectData: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['update:visible', 'save']);

const project = ref({
  name: '',
  code: '',
  status: '',
  budget: '',
  description: '',
  location: '',
  start_date: '',
  end_date: ''
});

const errors = ref({
  name: '',
  code: '',
  budget:'',
  location:'',
  start_date:'',
  end_date:''
});



// وقتی داده‌های جدید پاس داده می‌شود، فرم آپدیت شود (برای ویرایش)
watch(() => props.projectData, (newData) => {
  if (newData) {
    project.value = { ...newData };
  } else {
    project.value = {
      name: '',
      code: '',
      status:'',
      budget: '',
      location: '',
      start_date: '',
      end_date: ''
    };
  }
}, { immediate: true });

const closeForm = () => {
  emit('update:visible', false);
};

const saveProject = () => {
  // پاک کردن خطاهای قبلی
  errors.value = {};
  let isValid = true;

  // بررسی فیلد نام
  if (!project.value.name || project.value.name.trim() === '') {
    errors.value.name = 'وارد کردن نام پروژه الزامی است.';
    isValid = false;
  }

  // بررسی فیلد کد
  if (!project.value.code || project.value.code.trim() === '') {
    errors.value.code = 'وارد کردن کد پروژه الزامی است.';
    isValid = false;
  }

  if (!project.value.budget || project.value.budget.trim() === '') {
    errors.value.budget = 'وارد کردن بودجه اختصاص یافته الزامی است.';
    isValid = false;
  }

  if (!project.value.location || project.value.location.trim() === '') {
    errors.value.location = 'وارد کردن موقعیت پروژه الزامی است.';
    isValid = false;
  }

  if (!project.value.start_date || project.value.start_date.trim() === '') {
    errors.value.start_date = 'وارد کردن تاریخ شروع الزامی است.';
    isValid = false;
  }

  if (!project.value.end_date || project.value.end_date.trim() === '') {
    errors.value.end_date = 'وارد کردن تاریخ پایان الزامی است.';
    isValid = false;
  }


  // اگر فرم معتبر نبود، عملیات متوقف شود
  if (!isValid) {
    return;
  }

  // اگر معتبر بود، اطلاعات ارسال شود
  emit('save', project.value);
};
</script>
