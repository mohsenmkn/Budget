```vue
<template>
  <div ref="root" class="notification-wrapper">

    <!-- Trigger -->
    <button
        type="button"
        class="notification-trigger"
        :class="{ 'is-open': isOpen }"
        aria-label="اعلان‌ها"
        @click.stop="toggle"
    >
      <i class="pi pi-bell"></i>

      <span
          v-if="unreadCount > 0"
          class="notification-badge"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>


    <!-- Dropdown -->
    <Transition name="dropdown">

      <div
          v-if="isOpen"
          class="notification-dropdown"
          @click.stop
      >

        <!-- Header -->
        <div class="notification-header">

          <div>
            <div class="notification-title">
              اعلان‌ها
            </div>

            <div class="notification-subtitle">
              {{ unreadCount }}
              اعلان خوانده‌نشده
            </div>
          </div>

          <button
              v-if="unreadCount > 0"
              type="button"
              class="mark-all-btn"
              @click="markAllRead"
          >
            خواندن همه
          </button>

        </div>


        <!-- List -->
        <div class="notification-list">

          <button
              v-for="notification in notifications"
              :key="notification.id"
              type="button"
              class="notification-item"
              :class="{ unread: !notification.read }"
              @click="handleNotification(notification)"
          >

            <div
                class="notification-icon"
                :class="`type-${notification.type}`"
            >
              <i :class="notification.icon"></i>
            </div>

            <div class="notification-content">

              <div class="notification-item-title">
                {{ notification.title }}
              </div>

              <div class="notification-message">
                {{ notification.message }}
              </div>

              <div class="notification-time">
                {{ notification.time }}
              </div>

            </div>

            <span
                v-if="!notification.read"
                class="unread-dot"
            ></span>

          </button>


          <!-- Empty -->
          <div
              v-if="!notifications.length"
              class="notification-empty"
          >
            <div class="empty-icon">
              <i class="pi pi-bell-slash"></i>
            </div>

            <div>
              اعلان جدیدی وجود ندارد
            </div>
          </div>

        </div>


        <!-- Footer -->
        <div class="notification-footer">

          <button
              type="button"
              @click="showAll"
          >
            مشاهده همه اعلان‌ها

            <i class="pi pi-arrow-left"></i>
          </button>

        </div>

      </div>

    </Transition>

  </div>
</template>


<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

const emit = defineEmits([
  'open',
  'notification-click',
  'show-all'
])


// =====================================================
// STATE
// =====================================================

const isOpen = ref(false)


// =====================================================
// SAMPLE DATA
// =====================================================

const notifications = ref([
  {
    id: 1,
    title: 'ارجاع جدید',
    message: 'یک نامه جدید برای شما ارجاع شده است.',
    time: '۵ دقیقه پیش',
    type: 'info',
    icon: 'pi pi-send',
    read: false
  },
  {
    id: 2,
    title: 'درخواست جدید',
    message: 'یک درخواست جدید در انتظار بررسی شماست.',
    time: '۲۵ دقیقه پیش',
    type: 'warning',
    icon: 'pi pi-file',
    read: false
  },
  {
    id: 3,
    title: 'عملیات موفق',
    message: 'عملیات ثبت اطلاعات با موفقیت انجام شد.',
    time: '۱ ساعت پیش',
    type: 'success',
    icon: 'pi pi-check-circle',
    read: true
  }
])


// =====================================================
// COMPUTED
// =====================================================

const unreadCount = computed(() => {

  return notifications.value.filter(
      item => !item.read
  ).length

})


// =====================================================
// TOGGLE
// =====================================================

const toggle = () => {

  isOpen.value = !isOpen.value

  if (isOpen.value) {
    emit('open')
  }

}


// =====================================================
// MARK ALL
// =====================================================

const markAllRead = () => {

  notifications.value.forEach(
      notification => {
        notification.read = true
      }
  )

}


// =====================================================
// CLICK NOTIFICATION
// =====================================================

const handleNotification = (notification) => {

  notification.read = true

  emit(
      'notification-click',
      notification
  )

  isOpen.value = false

}


// =====================================================
// SHOW ALL
// =====================================================

const showAll = () => {

  emit('show-all')

  isOpen.value = false

}


// =====================================================
// OUTSIDE CLICK
// =====================================================

const root = ref(null)

const handleOutsideClick = (event) => {

  if (
      root.value &&
      !root.value.contains(event.target)
  ) {
    isOpen.value = false
  }

}


// =====================================================
// ESC
// =====================================================

const handleKeydown = (event) => {

  if (event.key === 'Escape') {

    isOpen.value = false

  }

}


// =====================================================
// LIFECYCLE
// =====================================================

onMounted(() => {

  document.addEventListener(
      'click',
      handleOutsideClick
  )

  document.addEventListener(
      'keydown',
      handleKeydown
  )

})


onBeforeUnmount(() => {

  document.removeEventListener(
      'click',
      handleOutsideClick
  )

  document.removeEventListener(
      'keydown',
      handleKeydown
  )

})
</script>


<style scoped>

.notification-wrapper {
  position: relative;
}


/* =====================================================
   TRIGGER
   ===================================================== */

.notification-trigger {

  position: relative;

  width: 42px;
  height: 42px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  border:
      1px solid
      rgba(148, 163, 184, 0.15);

  border-radius: 12px;

  background:
      #f8fafc;

  color: #475569;

  cursor: pointer;

  transition:
      all 0.18s ease;

}


.notification-trigger:hover,
.notification-trigger.is-open {

  color: #2563eb;

  background:
      #eff6ff;

  border-color:
      rgba(96, 165, 250, 0.30);

  box-shadow:
      0 5px 15px
      rgba(37, 99, 235, 0.08);

}


.notification-trigger i {

  font-size: 17px;

}


/* =====================================================
   BADGE
   ===================================================== */

.notification-badge {

  position: absolute;

  top: 2px;
  right: 2px;

  min-width: 17px;
  height: 17px;

  padding: 0 4px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
      2px solid
      #fff;

  border-radius: 999px;

  background: #ef4444;

  color: white;

  font-size: 8px;

  font-weight: 800;

  line-height: 1;

}


/* =====================================================
   DROPDOWN
   ===================================================== */

.notification-dropdown {

  position: absolute;

  top: calc(100% + 10px);

  left: 0;

  width: 370px;

  max-width:
      calc(100vw - 24px);

  overflow: hidden;

  border:
      1px solid
      rgba(148, 163, 184, 0.18);

  border-radius: 16px;

  background:
      rgba(255, 255, 255, 0.98);

  box-shadow:
      0 20px 55px
      rgba(15, 23, 42, 0.16);

  backdrop-filter:
      blur(18px);

  -webkit-backdrop-filter:
      blur(18px);

  z-index: 200;

}


/* =====================================================
   HEADER
   ===================================================== */

.notification-header {

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding:
      15px 16px;

  border-bottom:
      1px solid
      rgba(148, 163, 184, 0.13);

}


.notification-title {

  color: #0f172a;

  font-size: 14px;

  font-weight: 750;

}


.notification-subtitle {

  margin-top: 2px;

  color: #94a3b8;

  font-size: 10px;

}


.mark-all-btn {

  border: 0;

  background: transparent;

  color: #2563eb;

  font-family: inherit;

  font-size: 10.5px;

  font-weight: 650;

  cursor: pointer;

}


.mark-all-btn:hover {

  color: #1d4ed8;

}


/* =====================================================
   LIST
   ===================================================== */

.notification-list {

  max-height: 350px;

  overflow-y: auto;

}


.notification-item {

  position: relative;

  width: 100%;

  display: flex;

  align-items: flex-start;

  gap: 10px;

  padding:
      13px 15px;

  border: 0;

  border-bottom:
      1px solid
      rgba(148, 163, 184, 0.08);

  background: transparent;

  text-align: right;

  font-family: inherit;

  cursor: pointer;

  transition:
      background 0.16s ease;

}


.notification-item:hover {

  background:
      #f8fafc;

}


.notification-item.unread {

  background:
      rgba(239, 246, 255, 0.42);

}


.notification-icon {

  width: 34px;
  height: 34px;

  flex: 0 0 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

}


.notification-icon i {

  font-size: 14px;

}


.type-info {

  background: #eff6ff;

  color: #2563eb;

}


.type-warning {

  background: #fffbeb;

  color: #d97706;

}


.type-success {

  background: #ecfdf5;

  color: #059669;

}


.notification-content {

  min-width: 0;

  flex: 1;

}


.notification-item-title {

  color: #1e293b;

  font-size: 12px;

  font-weight: 700;

}


.notification-message {

  margin-top: 3px;

  color: #64748b;

  font-size: 10.5px;

  line-height: 1.7;

}


.notification-time {

  margin-top: 4px;

  color: #94a3b8;

  font-size: 9px;

}


.unread-dot {

  width: 7px;
  height: 7px;

  flex: 0 0 7px;

  margin-top: 6px;

  border-radius: 50%;

  background: #2563eb;

}


/* =====================================================
   EMPTY
   ===================================================== */

.notification-empty {

  padding:
      40px 20px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color: #94a3b8;

  font-size: 11px;

}


.empty-icon {

  width: 42px;
  height: 42px;

  margin-bottom: 10px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #f8fafc;

}


.empty-icon i {

  font-size: 19px;

  opacity: 0.5;

}


/* =====================================================
   FOOTER
   ===================================================== */

.notification-footer {

  padding:
      10px 14px;

  border-top:
      1px solid
      rgba(148, 163, 184, 0.12);

}


.notification-footer button {

  width: 100%;

  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  border: 0;

  border-radius: 9px;

  background:
      #f8fafc;

  color: #475569;

  font-family: inherit;

  font-size: 10.5px;

  font-weight: 600;

  cursor: pointer;

}


.notification-footer button:hover {

  background: #eff6ff;

  color: #2563eb;

}


.notification-footer i {

  font-size: 9px;

}


/* =====================================================
   ANIMATION
   ===================================================== */

.dropdown-enter-active,
.dropdown-leave-active {

  transition:
      opacity 0.18s ease,
      transform 0.18s ease;

}


.dropdown-enter-from,
.dropdown-leave-to {

  opacity: 0;

  transform:
      translateY(-6px)
      scale(0.98);

}


.dropdown-enter-to,
.dropdown-leave-from {

  opacity: 1;

  transform:
      translateY(0)
      scale(1);

}


/* =====================================================
   MOBILE
   ===================================================== */

@media (max-width: 576px) {

  .notification-dropdown {

    position: fixed;

    top: 68px;

    left: 10px;
    right: 10px;

    width: auto;

    max-width: none;

    border-radius: 14px;

  }

}

</style>
```
