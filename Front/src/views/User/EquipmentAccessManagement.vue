<template>
  <div class="p-4">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">مدیریت دسترسی به انواع تجهیزات</h1>
        <p class="text-sm text-gray-500 mt-1">
          تعیین کنید هر کاربر یا نقش به کدام انواع تجهیزات دسترسی داشته باشد
        </p>
      </div>
      <Button
          label="اعطای دسترسی جدید"
          icon="pi pi-plus"
          @click="openDialog"
      />
    </div>

    <!-- جدول دسترسی‌ها -->
    <Card>
      <template #content>
        <DataTable
            :value="accesses"
            :loading="loading"
            paginator
            :rows="20"
            stripedRows
        >
          <Column field="user" header="کاربر">
            <template #body="{ data }">
              <Tag v-if="data.user" :value="data.user" severity="info" />
              <span v-else class="text-gray-400">-</span>
            </template>
          </Column>
          <Column field="role" header="نقش">
            <template #body="{ data }">
              <Tag v-if="data.role" :value="data.role" severity="success" />
              <span v-else class="text-gray-400">-</span>
            </template>
          </Column>
          <Column field="dl_type_title" header="نوع تجهیز" />
          <Column field="dl_type_ref" header="کد نوع" />
          <Column field="can_view" header="مشاهده">
            <template #body="{ data }">
              <i :class="data.can_view ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
            </template>
          </Column>
          <Column field="can_export" header="خروجی اکسل">
            <template #body="{ data }">
              <i :class="data.can_export ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
            </template>
          </Column>
          <Column header="عملیات">
            <template #body="{ data }">
              <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-sm"
                  @click="deleteAccess(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Dialog اعطای دسترسی -->
    <Dialog
        v-model:visible="dialogVisible"
        header="اعطای دسترسی جدید"
        :style="{ width: '500px' }"
    >
      <form @submit.prevent="saveAccess" class="flex flex-col gap-4">
        <div>
          <label class="block mb-2">نوع دسترسی به</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <RadioButton v-model="form.target_type" value="user" />
              <span>کاربر</span>
            </label>
            <label class="flex items-center gap-2">
              <RadioButton v-model="form.target_type" value="role" />
              <span>نقش</span>
            </label>
          </div>
        </div>

        <div v-if="form.target_type === 'user'">
          <label class="block mb-2">کاربر</label>
          <Dropdown
              v-model="form.user_id"
              :options="users"
              optionLabel="name"
              optionValue="id"
              placeholder="انتخاب کاربر"
              class="w-full"
              filter
          />
        </div>

        <div v-if="form.target_type === 'role'">
          <label class="block mb-2">نقش</label>
          <Dropdown
              v-model="form.role_id"
              :options="roles"
              optionLabel="name"
              optionValue="id"
              placeholder="انتخاب نقش"
              class="w-full"
              filter
          />
        </div>

        <div>
          <label class="block mb-2">نوع تجهیز</label>
          <Dropdown
              v-model="form.dl_type_ref"
              :options="allTypes"
              optionLabel="Title"
              optionValue="DLTypeID"
              placeholder="انتخاب نوع تجهیز"
              class="w-full"
              filter
              @change="onTypeSelect"
          />
        </div>

        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <Checkbox v-model="form.can_view" :binary="true" />
            <span>مشاهده</span>
          </label>
          <label class="flex items-center gap-2">
            <Checkbox v-model="form.can_export" :binary="true" />
            <span>خروجی اکسل</span>
          </label>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="انصراف" class="p-button-text" @click="dialogVisible = false" />
          <Button label="ذخیره" type="submit" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from '@/api/axios.js';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';

const toast = useToast();

const accesses = ref([]);
const allTypes = ref([]);
const users = ref([]);
const roles = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);

const form = reactive({
  target_type: 'user',
  user_id: null,
  role_id: null,
  dl_type_ref: null,
  dl_type_title: null,
  can_view: true,
  can_export: false,
});

const fetchAccesses = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/finance/equipment-access');
    if (res.data.success) accesses.value = res.data.data;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'خطا در دریافت دسترسی‌ها', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const fetchAllTypes = async () => {
  try {
    const res = await axios.get('/finance/equipment-access/all-types');
    if (res.data.success) allTypes.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchUsers = async () => {
  try {
    const res = await axios.get('/finance/equipment-access/users');
    if (res.data.success) {
      users.value = res.data.data;
    }
  } catch (e) {
    console.error('خطا در دریافت کاربران:', e);
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: 'خطا در دریافت لیست کاربران',
      life: 3000,
    });
  }
};

const fetchRoles = async () => {
  try {
    const res = await axios.get('/roles');
    if (res.data.data) roles.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const openDialog = () => {
  Object.assign(form, {
    target_type: 'user',
    user_id: null,
    role_id: null,
    dl_type_ref: null,
    dl_type_title: null,
    can_view: true,
    can_export: false,
  });
  dialogVisible.value = true;
};

const onTypeSelect = () => {
  const selected = allTypes.value.find(t => t.DLTypeID === form.dl_type_ref);
  if (selected) form.dl_type_title = selected.Title;
};

const saveAccess = async () => {
  saving.value = true;
  try {
    const payload = {
      dl_type_ref: form.dl_type_ref,
      dl_type_title: form.dl_type_title,
      can_view: form.can_view,
      can_export: form.can_export,
    };
    if (form.target_type === 'user') payload.user_id = form.user_id;
    else payload.role_id = form.role_id;

    const res = await axios.post('/finance/equipment-access', payload);
    if (res.data.success) {
      toast.add({ severity: 'success', summary: 'موفق', detail: res.data.message, life: 3000 });
      dialogVisible.value = false;
      fetchAccesses();
    }
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'خطا',
      detail: e.response?.data?.message || 'خطا در ذخیره',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

const deleteAccess = async (id) => {
  if (!confirm('آیا از حذف این دسترسی مطمئن هستید؟')) return;
  try {
    const res = await axios.delete(`/finance/equipment-access/${id}`);
    if (res.data.success) {
      toast.add({ severity: 'success', summary: 'موفق', detail: res.data.message, life: 3000 });
      fetchAccesses();
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'خطا در حذف', life: 3000 });
  }
};

onMounted(() => {
  fetchAccesses();
  fetchAllTypes();
  fetchUsers();
  fetchRoles();
});
</script>