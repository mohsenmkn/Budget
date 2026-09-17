```vue
<template>
  <header class="topbar" dir="rtl">

    <!-- =====================================================
         RIGHT SIDE
         ===================================================== -->
    <div class="topbar__right">

      <!-- Mobile Menu -->
      <button
          class="mobile-menu-btn"
          type="button"
          aria-label="باز کردن منو"
          @click="emit('open-sidebar')"
      >
        <Menu :size="21" />
      </button>

      <!-- Page Title -->
      <div class="page-info">
        <div class="page-title">
          {{ pageTitle }}
        </div>

        <div class="page-subtitle">
          پنل مدیریت
        </div>
      </div>

    </div>


    <!-- =====================================================
         LEFT SIDE
         ===================================================== -->
    <div class="topbar__left">

      <!-- =================================================
           NOTIFICATIONS
           ================================================= -->
      <div
          ref="notificationWrapper"
          class="notification-wrapper"
      >

        <button
            type="button"
            class="topbar-icon-btn notification-btn"
            :class="{ active: notificationOpen }"
            aria-label="اعلان‌ها"
            @click="toggleNotifications"
        >
          <Bell :size="20" />

          <!-- Unread Badge -->
          <Transition name="badge">
            <span
                v-if="unreadCount > 0"
                class="notification-badge"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </Transition>
        </button>


        <!-- Notification Dropdown -->
        <Transition name="notification-dropdown">
          <div
              v-if="notificationOpen"
              class="notification-panel"
          >

            <!-- Header -->
            <div class="notification-header">

              <div>
                <div class="notification-title">
                  اعلان‌ها
                </div>

                <div class="notification-count">
                  {{
                    unreadCount > 0
                        ? `${unreadCount} اعلان خوانده‌نشده`
                        : 'همه اعلان‌ها خوانده شده‌اند'
                  }}
                </div>
              </div>

              <button
                  v-if="unreadCount > 0"
                  type="button"
                  class="mark-all-btn"
                  @click="markAllAsRead"
              >
                همه خوانده شد
              </button>

            </div>


            <!-- Loading -->
            <div
                v-if="notificationsLoading"
                class="notification-loading"
            >
              <LoaderCircle
                  class="spin"
                  :size="24"
              />

              <span>
                در حال دریافت اعلان‌ها...
              </span>
            </div>


            <!-- Empty -->
            <div
                v-else-if="announcements.length === 0"
                class="notification-empty"
            >
              <div class="empty-icon">
                <BellOff :size="26" />
              </div>

              <div class="empty-title">
                اعلانی وجود ندارد
              </div>

              <div class="empty-text">
                در حال حاضر اطلاعیه جدیدی برای شما وجود ندارد.
              </div>
            </div>


            <!-- Notifications -->
            <div
                v-else
                class="notification-list"
            >

              <button
                  v-for="announcement in announcements"
                  :key="announcement.id"
                  type="button"
                  class="notification-item"
                  :class="{
                  unread: !announcement.is_read
                }"
                  @click="handleNotificationClick(announcement)"
              >

                <!-- Type Icon -->
                <div
                    class="notification-type"
                    :class="`type-${announcement.type || 'info'}`"
                >
                  <component
                      :is="getNotificationIcon(announcement.type)"
                      :size="17"
                  />
                </div>


                <!-- Content -->
                <div class="notification-content">

                  <div class="notification-item-top">

                    <span class="notification-item-title">
                      {{ announcement.title }}
                    </span>

                    <span
                        v-if="!announcement.is_read"
                        class="unread-dot"
                    ></span>

                  </div>

                  <div class="notification-description">
                    {{ announcement.description }}
                  </div>

                  <div class="notification-meta">

                    <Clock :size="12" />

                    <span>
                      {{ formatRelativeTime(announcement.published_at || announcement.created_at) }}
                    </span>

                    <span
                        v-if="announcement.is_global"
                        class="global-label"
                    >
                      عمومی
                    </span>

                  </div>

                </div>

              </button>

            </div>


            <!-- Footer -->
            <div class="notification-footer">

              <button
                  type="button"
                  @click="goToAnnouncements"
              >
                <span>
                  مشاهده همه اعلان‌ها
                </span>

                <ArrowLeft :size="16" />
              </button>

            </div>

          </div>
        </Transition>

      </div>


      <!-- =================================================
           DIVIDER
           ================================================= -->
      <div class="topbar-divider"></div>


      <!-- =================================================
           USER MENU
           ================================================= -->
      <div
          ref="userWrapper"
          class="user-wrapper"
      >

        <button
            type="button"
            class="user-trigger"
            :class="{ active: userMenuOpen }"
            @click="toggleUserMenu"
        >

          <!-- Avatar -->
          <div class="user-avatar">
            {{ userInitial }}
          </div>

          <!-- User Info -->
          <div class="user-info">

            <div class="user-name">
              {{ auth.displayName || 'کاربر' }}
            </div>

            <div class="user-role">
              کاربر سامانه
            </div>

          </div>

          <ChevronDown
              class="user-chevron"
              :class="{ rotated: userMenuOpen }"
              :size="16"
          />

        </button>


        <!-- User Dropdown -->
        <Transition name="user-dropdown">
          <div
              v-if="userMenuOpen"
              class="user-panel"
          >

            <!-- User Header -->
            <div class="user-panel-header">

              <div class="user-avatar large">
                {{ userInitial }}
              </div>

              <div class="user-panel-info">

                <div class="user-panel-name">
                  {{ auth.displayName || 'کاربر' }}
                </div>

                <div class="user-panel-caption">
                  حساب کاربری شما
                </div>

              </div>

            </div>


            <div class="user-panel-divider"></div>


            <!-- Profile -->
            <button
                type="button"
                class="user-menu-item"
                @click="goToProfile"
            >
              <div class="user-menu-icon">
                <User :size="17" />
              </div>

              <div class="user-menu-text">
                <span>پروفایل من</span>
                <small>مشاهده اطلاعات حساب</small>
              </div>

              <ChevronLeft :size="15" />
            </button>


            <!-- Settings -->
            <button
                type="button"
                class="user-menu-item"
                @click="goToSettings"
            >
              <div class="user-menu-icon">
                <Settings :size="17" />
              </div>

              <div class="user-menu-text">
                <span>تنظیمات</span>
                <small>تنظیمات سامانه</small>
              </div>

              <ChevronLeft :size="15" />
            </button>


            <div class="user-panel-divider"></div>


            <!-- Logout -->
            <button
                type="button"
                class="user-menu-item logout-item"
                @click="onLogout"
            >
              <div class="user-menu-icon">
                <LogOut :size="17" />
              </div>

              <div class="user-menu-text">
                <span>خروج از حساب</span>
                <small>خروج امن از سامانه</small>
              </div>
            </button>

          </div>
        </Transition>

      </div>

    </div>

  </header>
</template>


<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

import {
  useRouter,
  useRoute
} from 'vue-router'

import {
  Menu,
  Bell,
  BellOff,
  LoaderCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  User,
  Settings,
  LogOut,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/authold.js'

import dashboardApi from '@/services/dashboardService.js'


// =====================================================
// ROUTER / AUTH
// =====================================================

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const emit = defineEmits(['open-sidebar'])


// =====================================================
// STATE
// =====================================================

const notificationOpen = ref(false)
const userMenuOpen = ref(false)

const notificationsLoading = ref(false)

const announcements = ref([])

const notificationWrapper = ref(null)
const userWrapper = ref(null)


// =====================================================
// PAGE TITLE
// =====================================================

const pageTitle = computed(() => {

  return route.meta?.title || 'داشبورد'

})


// =====================================================
// USER
// =====================================================

const userInitial = computed(() => {

  const name = auth.displayName || 'ک'

  return name
      .trim()
      .charAt(0)

})


// =====================================================
// UNREAD COUNT
// =====================================================

const unreadCount = computed(() => {

  return announcements.value.filter(
      item => !item.is_read
  ).length

})


// =====================================================
// LOAD ANNOUNCEMENTS
// =====================================================

const loadAnnouncements = async () => {

  notificationsLoading.value = true

  try {

    const data = await dashboardApi.getAnnouncements()

    announcements.value = Array.isArray(data)
        ? data
        : []

  } catch (error) {

    console.error(
        'خطا در دریافت اعلان‌ها:',
        error
    )

    announcements.value = []

  } finally {

    notificationsLoading.value = false

  }

}


// =====================================================
// TOGGLE NOTIFICATIONS
// =====================================================

const toggleNotifications = async () => {

  notificationOpen.value =
      !notificationOpen.value

  if (notificationOpen.value) {

    userMenuOpen.value = false

    await loadAnnouncements()

  }

}


// =====================================================
// TOGGLE USER MENU
// =====================================================

const toggleUserMenu = () => {

  userMenuOpen.value =
      !userMenuOpen.value

  if (userMenuOpen.value) {

    notificationOpen.value = false

  }

}


// =====================================================
// MARK ONE AS READ
// =====================================================

const markAsRead = async (announcement) => {

  if (announcement.is_read) {
    return
  }

  try {

    await dashboardApi.markAnnouncementRead(
        announcement.id
    )

    announcement.is_read = true

  } catch (error) {

    console.error(
        'خطا در خوانده‌شدن اعلان:',
        error
    )

  }

}


// =====================================================
// HANDLE NOTIFICATION CLICK
// =====================================================

const handleNotificationClick = async (
    announcement
) => {

  await markAsRead(announcement)

  /*
   * فعلاً اعلان مقصد خاصی ندارد.
   * اگر بعداً برای Announcement فیلد route
   * اضافه کردی می‌توانیم Navigation انجام دهیم.
   */

}


// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllAsRead = async () => {

  const unread =
      announcements.value.filter(
          item => !item.is_read
      )

  if (!unread.length) {
    return
  }

  for (const announcement of unread) {

    await markAsRead(announcement)

  }

}


// =====================================================
// NOTIFICATION ICON
// =====================================================

const getNotificationIcon = (type) => {

  switch (type) {

    case 'success':
      return CheckCircle

    case 'warning':
      return AlertTriangle

    case 'danger':
    case 'error':
      return XCircle

    case 'info':
    default:
      return Info

  }

}


// =====================================================
// RELATIVE TIME
// =====================================================

const formatRelativeTime = (date) => {

  if (!date) {
    return ''
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  const now = new Date()

  const diff =
      Math.floor(
          (now.getTime() - parsed.getTime()) / 1000
      )

  if (diff < 60) {
    return 'همین الان'
  }

  const minutes =
      Math.floor(diff / 60)

  if (minutes < 60) {
    return `${minutes} دقیقه پیش`
  }

  const hours =
      Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} ساعت پیش`
  }

  const days =
      Math.floor(hours / 24)

  if (days < 7) {
    return `${days} روز پیش`
  }

  return parsed.toLocaleDateString(
      'fa-IR'
  )

}


// =====================================================
// PROFILE
// =====================================================

const goToProfile = () => {

  userMenuOpen.value = false

  router.push({
    name: 'profile'
  })

}


// =====================================================
// SETTINGS
// =====================================================

const goToSettings = () => {

  userMenuOpen.value = false

  router.push({
    name: 'settings'
  })

}


// =====================================================
// ANNOUNCEMENTS
// =====================================================

const goToAnnouncements = () => {

  notificationOpen.value = false

  /*
   * در صورت داشتن صفحه اختصاصی اعلان‌ها
   * Route آن را اینجا قرار بده.
   *
   * فعلاً چون Route صفحه اعلان‌ها را نداریم
   * فقط Dropdown بسته می‌شود.
   */

}


// =====================================================
// LOGOUT
// =====================================================

const onLogout = async () => {

  userMenuOpen.value = false

  try {

    await auth.logout()

  } finally {

    router.push('/login')

  }

}


// =====================================================
// CLICK OUTSIDE
// =====================================================

const handleOutsideClick = (event) => {

  const target = event.target

  if (
      notificationWrapper.value &&
      !notificationWrapper.value.contains(target)
  ) {

    notificationOpen.value = false

  }

  if (
      userWrapper.value &&
      !userWrapper.value.contains(target)
  ) {

    userMenuOpen.value = false

  }

}


// =====================================================
// ESC
// =====================================================

const handleKeydown = (event) => {

  if (event.key === 'Escape') {

    notificationOpen.value = false

    userMenuOpen.value = false

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

/* =====================================================
   TOPBAR
   ===================================================== */

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;

  width: 100%;
  min-height: 72px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;

  background:
      rgba(255, 255, 255, 0.92);

  border-bottom:
      1px solid
      rgba(226, 232, 240, 0.85);

  backdrop-filter:
      blur(18px);

  -webkit-backdrop-filter:
      blur(18px);

  box-shadow:
      0 1px 3px
      rgba(15, 23, 42, 0.03);
}


/* =====================================================
   RIGHT
   ===================================================== */

.topbar__right {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 14px;
}


/* =====================================================
   PAGE INFO
   ===================================================== */

.page-info {
  min-width: 0;
}

.page-title {
  color: #0f172a;

  font-size: 15px;
  font-weight: 750;

  line-height: 1.5;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-subtitle {
  margin-top: 1px;

  color: #94a3b8;

  font-size: 10.5px;

  line-height: 1.4;
}


/* =====================================================
   MOBILE MENU
   ===================================================== */

.mobile-menu-btn {
  display: none;

  width: 40px;
  height: 40px;

  align-items: center;
  justify-content: center;

  border:
      1px solid
      #e2e8f0;

  border-radius: 11px;

  background: #fff;

  color: #334155;

  cursor: pointer;

  transition:
      background .18s ease,
      color .18s ease,
      border-color .18s ease,
      transform .18s ease;
}

.mobile-menu-btn:hover {
  background: #f8fafc;
  color: #2563eb;
  border-color: #cbd5e1;
}

.mobile-menu-btn:active {
  transform: scale(.96);
}


/* =====================================================
   LEFT
   ===================================================== */

.topbar__left {
  display: flex;
  align-items: center;

  gap: 10px;
}


/* =====================================================
   DIVIDER
   ===================================================== */

.topbar-divider {
  width: 1px;
  height: 30px;

  margin: 0 4px;

  background:
      #e2e8f0;
}


/* =====================================================
   ICON BUTTON
   ===================================================== */

.topbar-icon-btn {
  position: relative;

  width: 42px;
  height: 42px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border:
      1px solid
      transparent;

  border-radius: 12px;

  background: transparent;

  color: #64748b;

  cursor: pointer;

  transition:
      background .18s ease,
      color .18s ease,
      border-color .18s ease,
      transform .18s ease;
}

.topbar-icon-btn:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.topbar-icon-btn.active {
  background:
      #eff6ff;

  color:
      #2563eb;

  border-color:
      #dbeafe;
}

.topbar-icon-btn:active {
  transform: scale(.95);
}


/* =====================================================
   NOTIFICATION BADGE
   ===================================================== */

.notification-badge {
  position: absolute;

  top: 1px;
  right: 1px;

  min-width: 18px;
  height: 18px;

  padding: 0 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  border:
      2px solid
      #fff;

  border-radius: 999px;

  background:
      #ef4444;

  color: #fff;

  font-size: 9px;
  font-weight: 800;

  line-height: 1;

  box-shadow:
      0 2px 6px
      rgba(239, 68, 68, .28);
}


/* =====================================================
   NOTIFICATION PANEL
   ===================================================== */

.notification-wrapper,
.user-wrapper {
  position: relative;
}

.notification-panel {
  position: absolute;

  top: calc(100% + 12px);
  left: 0;

  width: 390px;
  max-width: calc(100vw - 24px);

  max-height: 560px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background: #fff;

  border:
      1px solid
      #e2e8f0;

  border-radius: 18px;

  box-shadow:
      0 24px 60px
      rgba(15, 23, 42, .14),
      0 4px 12px
      rgba(15, 23, 42, .06);

  z-index: 100;
}


/* =====================================================
   NOTIFICATION HEADER
   ===================================================== */

.notification-header {
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 16px 17px;

  border-bottom:
      1px solid
      #f1f5f9;
}

.notification-title {
  color: #0f172a;

  font-size: 15px;
  font-weight: 750;
}

.notification-count {
  margin-top: 3px;

  color: #94a3b8;

  font-size: 10.5px;
}

.mark-all-btn {
  border: 0;

  padding: 7px 9px;

  border-radius: 8px;

  background:
      #eff6ff;

  color:
      #2563eb;

  font-family: inherit;

  font-size: 10.5px;
  font-weight: 650;

  cursor: pointer;

  white-space: nowrap;

  transition:
      background .18s ease;
}

.mark-all-btn:hover {
  background:
      #dbeafe;
}


/* =====================================================
   NOTIFICATION LIST
   ===================================================== */

.notification-list {
  flex: 1 1 auto;

  min-height: 0;

  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color:
      #cbd5e1
      transparent;
}

.notification-list::-webkit-scrollbar {
  width: 5px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}


/* =====================================================
   NOTIFICATION ITEM
   ===================================================== */

.notification-item {
  position: relative;

  width: 100%;

  display: flex;
  align-items: flex-start;

  gap: 11px;

  padding: 13px 15px;

  border: 0;
  border-bottom:
      1px solid
      #f8fafc;

  background: #fff;

  text-align: right;

  font-family: inherit;

  cursor: pointer;

  transition:
      background .18s ease;
}

.notification-item:hover {
  background:
      #f8fafc;
}

.notification-item.unread {
  background:
      #f8fbff;
}

.notification-item.unread:hover {
  background:
      #f0f7ff;
}


/* =====================================================
   TYPE ICON
   ===================================================== */

.notification-type {
  flex: 0 0 34px;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
}

.type-info {
  background: #eff6ff;
  color: #2563eb;
}

.type-success {
  background: #ecfdf5;
  color: #059669;
}

.type-warning {
  background: #fffbeb;
  color: #d97706;
}

.type-danger,
.type-error {
  background: #fef2f2;
  color: #dc2626;
}


/* =====================================================
   CONTENT
   ===================================================== */

.notification-content {
  min-width: 0;
  flex: 1;
}

.notification-item-top {
  display: flex;
  align-items: center;

  gap: 6px;
}

.notification-item-title {
  min-width: 0;

  color: #1e293b;

  font-size: 12.5px;
  font-weight: 700;

  line-height: 1.6;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-description {
  margin-top: 3px;

  color: #64748b;

  font-size: 11.5px;

  line-height: 1.7;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.notification-meta {
  margin-top: 7px;

  display: flex;
  align-items: center;

  gap: 4px;

  color: #94a3b8;

  font-size: 9.5px;
}

.global-label {
  margin-right: 5px;

  padding: 2px 6px;

  border-radius: 999px;

  background: #f1f5f9;

  color: #64748b;

  font-size: 8.5px;
}

.unread-dot {
  flex: 0 0 auto;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #2563eb;

  box-shadow:
      0 0 0 3px
      rgba(37, 99, 235, .10);
}


/* =====================================================
   EMPTY
   ===================================================== */

.notification-empty {
  padding: 55px 25px;

  text-align: center;
}

.empty-icon {
  width: 54px;
  height: 54px;

  margin: 0 auto 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;

  background: #f8fafc;

  color: #94a3b8;
}

.empty-title {
  color: #334155;

  font-size: 13px;
  font-weight: 700;
}

.empty-text {
  margin-top: 5px;

  color: #94a3b8;

  font-size: 10.5px;

  line-height: 1.7;
}


/* =====================================================
   LOADING
   ===================================================== */

.notification-loading {
  min-height: 180px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #64748b;

  font-size: 11px;
}

.spin {
  animation:
      spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* =====================================================
   FOOTER
   ===================================================== */

.notification-footer {
  flex: 0 0 auto;

  padding: 10px 14px;

  border-top:
      1px solid
      #f1f5f9;
}

.notification-footer button {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 8px;

  border: 0;
  border-radius: 9px;

  background: transparent;

  color: #2563eb;

  font-family: inherit;

  font-size: 11px;
  font-weight: 650;

  cursor: pointer;

  transition:
      background .18s ease;
}

.notification-footer button:hover {
  background: #eff6ff;
}


/* =====================================================
   USER TRIGGER
   ===================================================== */

.user-trigger {
  display: flex;
  align-items: center;

  gap: 9px;

  min-height: 46px;

  padding: 4px 7px;

  border:
      1px solid
      transparent;

  border-radius: 13px;

  background: transparent;

  font-family: inherit;

  cursor: pointer;

  transition:
      background .18s ease,
      border-color .18s ease;
}

.user-trigger:hover,
.user-trigger.active {
  background: #f8fafc;

  border-color:
      #e2e8f0;
}


/* =====================================================
   AVATAR
   ===================================================== */

.user-avatar {
  width: 36px;
  height: 36px;

  flex: 0 0 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );

  color: #fff;

  font-size: 14px;
  font-weight: 800;

  box-shadow:
      0 4px 10px
      rgba(37, 99, 235, .20);
}

.user-avatar.large {
  width: 42px;
  height: 42px;

  flex-basis: 42px;

  border-radius: 12px;

  font-size: 15px;
}


/* =====================================================
   USER INFO
   ===================================================== */

.user-info {
  min-width: 0;

  text-align: right;
}

.user-name {
  max-width: 130px;

  color: #1e293b;

  font-size: 11.5px;
  font-weight: 700;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin-top: 2px;

  color: #94a3b8;

  font-size: 9px;
}

.user-chevron {
  color: #94a3b8;

  transition:
      transform .2s ease;
}

.user-chevron.rotated {
  transform: rotate(180deg);
}


/* =====================================================
   USER PANEL
   ===================================================== */

.user-panel {
  position: absolute;

  top: calc(100% + 12px);
  left: 0;

  width: 285px;
  max-width: calc(100vw - 24px);

  padding: 8px;

  background: #fff;

  border:
      1px solid
      #e2e8f0;

  border-radius: 17px;

  box-shadow:
      0 24px 60px
      rgba(15, 23, 42, .14),
      0 4px 12px
      rgba(15, 23, 42, .06);

  z-index: 100;
}


/* =====================================================
   USER PANEL HEADER
   ===================================================== */

.user-panel-header {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 10px;
}

.user-panel-info {
  min-width: 0;
}

.user-panel-name {
  color: #0f172a;

  font-size: 12.5px;
  font-weight: 750;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-panel-caption {
  margin-top: 3px;

  color: #94a3b8;

  font-size: 9.5px;
}


/* =====================================================
   DIVIDER
   ===================================================== */

.user-panel-divider {
  height: 1px;

  margin: 5px 4px;

  background:
      #f1f5f9;
}


/* =====================================================
   USER MENU ITEM
   ===================================================== */

.user-menu-item {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 10px;

  border: 0;

  border-radius: 11px;

  background: transparent;

  color: #334155;

  font-family: inherit;

  text-align: right;

  cursor: pointer;

  transition:
      background .18s ease,
      color .18s ease;
}

.user-menu-item:hover {
  background: #f8fafc;
  color: #2563eb;
}

.user-menu-icon {
  width: 32px;
  height: 32px;

  flex: 0 0 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #f8fafc;

  color: #64748b;
}

.user-menu-item:hover .user-menu-icon {
  background: #eff6ff;
  color: #2563eb;
}

.user-menu-text {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
}

.user-menu-text span {
  font-size: 11.5px;
  font-weight: 650;
}

.user-menu-text small {
  margin-top: 2px;

  color: #94a3b8;

  font-size: 8.5px;
}

.user-menu-item > svg {
  flex: 0 0 auto;

  color: #cbd5e1;
}

.logout-item {
  color: #dc2626;
}

.logout-item .user-menu-icon {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.logout-item:hover .user-menu-icon {
  background: #fee2e2;
  color: #dc2626;
}


/* =====================================================
   TRANSITIONS
   ===================================================== */

.notification-dropdown-enter-active,
.notification-dropdown-leave-active,
.user-dropdown-enter-active,
.user-dropdown-leave-active {
  transition:
      opacity .18s ease,
      transform .18s ease;
}

.notification-dropdown-enter-from,
.notification-dropdown-leave-to,
.user-dropdown-enter-from,
.user-dropdown-leave-to {
  opacity: 0;

  transform:
      translateY(-6px)
      scale(.98);
}

.notification-dropdown-enter-to,
.notification-dropdown-leave-from,
.user-dropdown-enter-to,
.user-dropdown-leave-from {
  opacity: 1;

  transform:
      translateY(0)
      scale(1);
}

.badge-enter-active,
.badge-leave-active {
  transition:
      opacity .18s ease,
      transform .18s ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(.5);
}


/* =====================================================
   FOCUS
   ===================================================== */

button:focus-visible {
  outline:
      2px solid
      rgba(37, 99, 235, .55);

  outline-offset: 2px;
}


/* =====================================================
   MOBILE
   ===================================================== */

@media (max-width: 1024px) {

  .topbar {
    min-height: 64px;

    padding:
        0 14px;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .page-subtitle {
    display: none;
  }

  .user-info,
  .user-chevron {
    display: none;
  }

  .user-trigger {
    padding: 4px;
  }

  .topbar-divider {
    height: 26px;
  }

}


@media (max-width: 576px) {

  .topbar {
    padding:
        0 10px;
  }

  .topbar__right {
    gap: 8px;
  }

  .topbar__left {
    gap: 4px;
  }

  .page-title {
    font-size: 13px;
  }

  .topbar-icon-btn {
    width: 40px;
    height: 40px;
  }

  .user-avatar {
    width: 34px;
    height: 34px;

    flex-basis: 34px;
  }

  .notification-panel {
    position: fixed;

    top: 64px;
    left: 10px;
    right: 10px;

    width: auto;
    max-width: none;

    max-height:
        calc(100vh - 76px);

    border-radius: 16px;
  }

  .user-panel {
    position: fixed;

    top: 64px;
    left: 10px;

    width:
        min(285px, calc(100vw - 20px));
  }

}


@media (max-width: 360px) {

  .page-title {
    max-width: 105px;
  }

  .topbar-divider {
    display: none;
  }

}

</style>
```
