<template>
  <main class="auth-page" dir="rtl">
    <!-- Background -->
    <div class="auth-background" aria-hidden="true">
      <div class="background-shape shape-one"></div>
      <div class="background-shape shape-two"></div>
      <div class="background-grid"></div>
    </div>

    <section class="auth-shell">
      <div class="auth-card">

        <!-- Header -->
        <header class="auth-header">
          <div class="brand-mark" aria-hidden="true">
            <i class="pi pi-building"></i>
          </div>

          <div class="mt-5">
            <h1 class="auth-title">
              سیستم یکپارچه گهرترابر
            </h1>

            <p class="auth-subtitle">
              برای ورود به حساب کاربری خود، اطلاعات زیر را وارد کنید.
            </p>
          </div>
        </header>

        <!-- Reset Success -->
        <transition name="message">
          <div
              v-if="resetSuccess"
              class="success-alert"
              role="status"
          >
            <div class="alert-icon">
              <i class="pi pi-check"></i>
            </div>

            <div class="min-w-0">
              <p class="font-semibold text-sm">
                رمز عبور با موفقیت تغییر کرد.
              </p>
              <p class="text-xs mt-1 opacity-80">
                اکنون می‌توانید با رمز جدید وارد سامانه شوید.
              </p>
            </div>

            <button
                type="button"
                class="alert-close"
                aria-label="بستن پیام"
                @click="resetSuccess = false"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </transition>

        <!-- Form -->
        <form
            class="auth-form"
            autocomplete="on"
            @submit.prevent="handleLogin"
        >

          <!-- Mobile -->
          <div class="field-group">
            <label
                for="mobile"
                class="field-label"
            >
              شماره موبایل
              <span class="required">*</span>
            </label>

            <div
                class="input-wrapper"
                :class="{ 'input-error': mobileError }"
            >
              <i class="pi pi-mobile input-icon"></i>

              <InputText
                  id="mobile"
                  v-model="mobile"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="username"
                  dir="ltr"
                  maxlength="11"
                  placeholder="09123456789"
                  class="auth-input mobile-input"
                  :invalid="!!mobileError"
                  @input="normalizeMobile"
              />
            </div>

            <transition name="message">
              <small
                  v-if="mobileError"
                  class="field-error"
              >
                <i class="pi pi-exclamation-circle"></i>
                {{ mobileError }}
              </small>
            </transition>

            <small
                v-if="!mobileError"
                class="field-hint"
            >
              شماره موبایل ثبت‌شده در سامانه را وارد کنید.
            </small>
          </div>

          <!-- Password -->
          <div class="field-group">
            <div class="flex items-center justify-between mb-2">
              <label
                  for="password"
                  class="field-label mb-0"
              >
                رمز عبور
                <span class="required">*</span>
              </label>
            </div>

            <div
                class="password-wrapper"
                :class="{
                'password-error': errorMessage,
                'password-highlight': shouldHighlightPassword
              }"
            >
              <i class="pi pi-lock input-icon"></i>
              <Password
                  ref="passwordRef"
                  id="password"
                  v-model="password"
                  :feedback="false"
                  toggleMask
                  autocomplete="current-password"
                  inputClass="auth-password-input"
                  class="w-full"
                  :invalid="!!errorMessage"
                  fluid
              />

            </div>

            <transition name="message">
              <div
                  v-if="shouldHighlightPassword"
                  class="password-hint"
              >
                <i class="pi pi-info-circle"></i>
                <span>رمز عبور جدید خود را وارد کنید.</span>
              </div>
            </transition>
          </div>

          <!-- Captcha -->
          <transition name="captcha">
            <div
                v-if="requireCaptcha"
                class="captcha-box"
            >
              <div class="captcha-header">
                <div>
                  <p class="captcha-title">
                    تأیید امنیتی
                  </p>
                  <p class="captcha-description">
                    کد داخل تصویر را وارد کنید.
                  </p>
                </div>

                <button
                    type="button"
                    class="captcha-refresh"
                    title="تصویر جدید"
                    aria-label="دریافت تصویر امنیتی جدید"
                    :disabled="loading"
                    @click="fetchCaptcha"
                >
                  <i class="pi pi-refresh"></i>
                </button>
              </div>

              <div class="captcha-content">
                <button
                    type="button"
                    class="captcha-image-button"
                    :disabled="loading"
                    @click="fetchCaptcha"
                >
                  <img
                      v-if="captchaImg"
                      :src="captchaImg"
                      alt="کد امنیتی"
                      class="captcha-image"
                  />

                  <div
                      v-else
                      class="captcha-loading"
                  >
                    <i class="pi pi-spin pi-spinner"></i>
                  </div>
                </button>

                <InputText
                    v-model="captchaInput"
                    inputmode="numeric"
                    autocomplete="off"
                    maxlength="10"
                    placeholder="کد امنیتی"
                    class="captcha-input"
                    :disabled="loading"
                />
              </div>
            </div>
          </transition>

          <!-- Error -->
          <transition name="message">
            <div
                v-if="errorMessage"
                class="error-alert"
                role="alert"
            >
              <i class="pi pi-exclamation-triangle"></i>

              <span>{{ errorMessage }}</span>
            </div>
          </transition>

          <!-- Forgot Password -->
          <div class="forgot-row">
            <router-link
                to="/forgot-password"
                class="forgot-link"
            >
              <i class="pi pi-key"></i>
              <span>رمز عبور خود را فراموش کرده‌اید؟</span>
            </router-link>
          </div>

          <!-- Submit -->
          <Button
              type="submit"
              class="login-button"
              :loading="loading"
              :disabled="loading"
          >
            <template #default>
              <span v-if="!loading">
                ورود به سامانه
              </span>

              <span v-else>
                در حال ورود...
              </span>

              <i
                  v-if="!loading"
                  class="pi pi-arrow-left mr-2"
              ></i>
            </template>
          </Button>

        </form>

        <!-- Footer -->
        <footer class="auth-footer">
          <div class="footer-divider">
            <span></span>
            <i class="pi pi-shield"></i>
            <span></span>
          </div>

          <p>
            دسترسی شما به سامانه به‌صورت امن مدیریت می‌شود.
          </p>

          <p class="footer-brand">
            سیستم یکپارچه گهرترابر
          </p>
        </footer>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authold.js'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import axios from 'axios'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

/* -------------------------------------------------------
 * Router / Store
 * ----------------------------------------------------- */

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const { handleApiError } = useApiErrorHandler()

/* -------------------------------------------------------
 * Config
 * ----------------------------------------------------- */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://apiomrani.gttmco.ir/api/v1'

/* -------------------------------------------------------
 * Form State
 * ----------------------------------------------------- */

const mobile = ref('')
const password = ref('')

const mobileError = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const loading = ref(false)

const passwordRef = ref(null)

/* -------------------------------------------------------
 * Reset Password State
 * ----------------------------------------------------- */

const resetSuccess = ref(false)
const shouldHighlightPassword = ref(false)

/* -------------------------------------------------------
 * Captcha
 * ----------------------------------------------------- */

const requireCaptcha = ref(false)
const captchaImg = ref('')
const captchaKey = ref('')
const captchaInput = ref('')

/* -------------------------------------------------------
 * Mobile Normalization
 * ----------------------------------------------------- */

const normalizeMobile = () => {
  mobile.value = mobile.value
      .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
      .replace(/\D/g, '')
      .slice(0, 11)

  if (mobileError.value) {
    validateMobile()
  }
}

/* -------------------------------------------------------
 * Validation
 * ----------------------------------------------------- */

const validateMobile = () => {
  if (!mobile.value) {
    mobileError.value = 'شماره موبایل را وارد کنید.'
    return false
  }

  if (!/^09\d{9}$/.test(mobile.value)) {
    mobileError.value = 'شماره موبایل باید با 09 شروع شده و 11 رقم باشد.'
    return false
  }

  mobileError.value = ''
  return true
}

/* -------------------------------------------------------
 * Captcha
 * ----------------------------------------------------- */

const fetchCaptcha = async () => {
  try {
    const response = await axios.get(
        `${API_BASE_URL}/auth/captcha`
    )

    captchaImg.value = response.data.img
    captchaKey.value = response.data.key
    captchaInput.value = ''
  } catch (error) {
    console.error('خطا در دریافت کپچا:', error)

    errorMessage.value =
        'دریافت تصویر امنیتی با خطا مواجه شد. دوباره تلاش کنید.'
  }
}

/* -------------------------------------------------------
 * Login
 * ----------------------------------------------------- */

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateMobile()) {
    return
  }

  if (!password.value) {
    errorMessage.value = 'رمز عبور را وارد کنید.'
    focusOnPassword()
    return
  }

  if (requireCaptcha.value && !captchaInput.value.trim()) {
    errorMessage.value = 'لطفاً کد امنیتی را وارد کنید.'
    return
  }

  loading.value = true

  try {
    const payload = {
      mobile: mobile.value,
      password: password.value
    }

    if (requireCaptcha.value) {
      payload.captcha = captchaInput.value.trim()
      payload.captcha_key = captchaKey.value
    }

    await authStore.login(payload)

    router.push({
      name: 'Dashboard'
    })

  } catch (error) {
    handleApiError(error, {
      setErrors: (validationErrors) => {
        errorMessage.value = validationErrors
      }
    })

    if (error.response?.status === 429) {
      requireCaptcha.value = true
      await fetchCaptcha()
    } else if (
        error.response?.status === 400 &&
        requireCaptcha.value
    ) {
      await fetchCaptcha()
    }

  } finally {
    loading.value = false
  }
}

/* -------------------------------------------------------
 * Password Focus
 * ----------------------------------------------------- */

const focusOnPassword = () => {
  nextTick(() => {
    const inputElement =
        passwordRef.value?.$el?.querySelector('input')

    if (inputElement) {
      inputElement.focus()
      inputElement.select()
    }
  })
}

/* -------------------------------------------------------
 * Mounted
 * ----------------------------------------------------- */

onMounted(() => {
  const queryMobile = route.query.mobile
  const isFromReset = route.query.reset === 'success'

  if (queryMobile) {
    mobile.value = String(queryMobile)
  }

  if (isFromReset) {
    resetSuccess.value = true
    shouldHighlightPassword.value = true

    nextTick(() => {
      setTimeout(() => {
        focusOnPassword()
      }, 350)
    })

    router.replace({
      path: '/login'
    })

    setTimeout(() => {
      shouldHighlightPassword.value = false
    }, 5000)
  }
})

/* -------------------------------------------------------
 * Watchers
 * ----------------------------------------------------- */

watch(mobile, () => {
  if (shouldHighlightPassword.value) {
    shouldHighlightPassword.value = false
  }

  if (mobileError.value) {
    validateMobile()
  }
})
</script>

<style scoped>
/* =====================================================
   Page
===================================================== */

.auth-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  overflow: hidden;
  background:
      radial-gradient(
          circle at 10% 10%,
          rgba(59, 130, 246, 0.08),
          transparent 30%
      ),
      radial-gradient(
          circle at 90% 90%,
          rgba(16, 185, 129, 0.07),
          transparent 30%
      ),
      #f8fafc;
}

/* =====================================================
   Background
===================================================== */

.auth-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.background-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
}

.shape-one {
  width: 320px;
  height: 320px;
  top: -160px;
  right: -100px;
  background: rgba(59, 130, 246, 0.10);
}

.shape-two {
  width: 280px;
  height: 280px;
  bottom: -150px;
  left: -80px;
  background: rgba(16, 185, 129, 0.08);
}

.background-grid {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  background-image:
      linear-gradient(
          rgba(148, 163, 184, 0.08) 1px,
          transparent 1px
      ),
      linear-gradient(
          90deg,
          rgba(148, 163, 184, 0.08) 1px,
          transparent 1px
      );
  background-size: 32px 32px;
}

/* =====================================================
   Shell / Card
===================================================== */

.auth-shell {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 470px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  box-shadow:
      0 20px 50px rgba(15, 23, 42, 0.08),
      0 4px 12px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

/* =====================================================
   Header
===================================================== */

.auth-header {
  padding: 38px 36px 30px;
  text-align: center;
}

.brand-mark {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: linear-gradient(
      145deg,
      #2563eb,
      #1d4ed8
  );
  color: #fff;
  font-size: 25px;
  box-shadow:
      0 12px 25px rgba(37, 99, 235, 0.22);
}

.auth-title {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.5;
}

.auth-subtitle {
  margin: 8px auto 0;
  max-width: 340px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.9;
}

/* =====================================================
   Form
===================================================== */

.auth-form {
  padding: 0 36px 28px;
}

.field-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.required {
  color: #ef4444;
  margin-right: 2px;
}

.input-wrapper,
.password-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s ease;
}

.auth-input,
.auth-password-input {
  width: 100% !important;
  min-height: 48px;
  border: 1px solid #dbe3ed !important;
  border-radius: 12px !important;
  background: #fff !important;
  color: #0f172a !important;
  font-size: 14px !important;
  box-shadow: none !important;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease !important;
}

.auth-input {
  padding-right: 42px !important;
}

.mobile-input {
  text-align: left;
}

.auth-input:hover,
.auth-password-input:hover {
  border-color: #b9c5d4 !important;
}

.auth-input:focus,
.auth-password-input:focus {
  border-color: #3b82f6 !important;
  box-shadow:
      0 0 0 3px rgba(59, 130, 246, 0.10) !important;
}

.input-wrapper:focus-within .input-icon,
.password-wrapper:focus-within .input-icon {
  color: #2563eb;
}

.field-hint {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 11px;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  color: #dc2626;
  font-size: 11px;
}

.input-error .auth-input {
  border-color: #ef4444 !important;
}

.password-error .auth-password-input {
  border-color: #ef4444 !important;
}

/* =====================================================
   Password
===================================================== */

.password-wrapper .p-password {
  width: 100%;
  display: block;
}

.password-wrapper .auth-password-input {
  padding-right: 42px !important;
  padding-left: 45px !important;
}

.password-highlight .auth-password-input {
  border-color: #2563eb !important;
  box-shadow:
      0 0 0 4px rgba(37, 99, 235, 0.10) !important;
}

.password-hint {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  color: #2563eb;
  font-size: 11px;
}

/* =====================================================
   Captcha
===================================================== */

.captcha-box {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.captcha-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.captcha-title {
  margin: 0;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
}

.captcha-description {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 10px;
}

.captcha-refresh {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe3ed;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition: 0.2s ease;
}

.captcha-refresh:hover {
  color: #2563eb;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.captcha-content {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.captcha-image-button {
  width: 145px;
  min-width: 145px;
  height: 48px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #dbe3ed;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.captcha-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.captcha-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.captcha-input {
  width: 100%;
  min-height: 48px;
  text-align: center;
  border-radius: 10px !important;
}

/* =====================================================
   Alerts
===================================================== */

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  font-size: 12px;
}

.error-alert {
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.success-alert {
  margin: 0 36px 22px;
  padding: 13px 14px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.alert-icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #dcfce7;
}

.alert-close {
  margin-right: auto;
  color: #86efac;
  cursor: pointer;
}

.alert-close:hover {
  color: #166534;
}

/* =====================================================
   Forgot
===================================================== */

.forgot-row {
  display: flex;
  justify-content: flex-start;
  margin: 2px 0 18px;
}

.forgot-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* =====================================================
   Login Button
===================================================== */

.login-button {
  width: 100%;
  min-height: 50px;
  border: 0 !important;
  border-radius: 12px !important;
  background: #2563eb !important;
  color: #fff !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  box-shadow:
      0 8px 18px rgba(37, 99, 235, 0.20) !important;
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease !important;
}

.login-button:hover:not(:disabled) {
  background: #1d4ed8 !important;
  transform: translateY(-1px);
  box-shadow:
      0 10px 22px rgba(37, 99, 235, 0.25) !important;
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

/* =====================================================
   Footer
===================================================== */

.auth-footer {
  padding: 0 36px 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.8;
}

.footer-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.footer-divider span {
  height: 1px;
  flex: 1;
  background: #e2e8f0;
}

.footer-divider i {
  color: #94a3b8;
  font-size: 11px;
}

.footer-brand {
  margin-top: 2px;
  color: #64748b;
  font-weight: 600;
}

/* =====================================================
   Transitions
===================================================== */

.message-enter-active,
.message-leave-active,
.captcha-enter-active,
.captcha-leave-active {
  transition: all 0.22s ease;
}

.message-enter-from,
.message-leave-to,
.captcha-enter-from,
.captcha-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* =====================================================
   Responsive
===================================================== */

@media (max-width: 640px) {
  .auth-page {
    padding: 16px;
    align-items: flex-start;
    padding-top: 28px;
  }

  .auth-card {
    border-radius: 20px;
  }

  .auth-header {
    padding: 30px 22px 24px;
  }

  .auth-form {
    padding: 0 22px 24px;
  }

  .auth-footer {
    padding: 0 22px 24px;
  }

  .success-alert {
    margin-left: 22px;
    margin-right: 22px;
  }

  .auth-title {
    font-size: 21px;
  }

  .captcha-content {
    flex-direction: column;
  }

  .captcha-image-button {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .auth-page {
    padding: 10px;
  }

  .auth-header {
    padding: 26px 18px 20px;
  }

  .auth-form {
    padding: 0 18px 22px;
  }

  .auth-footer {
    padding: 0 18px 22px;
  }

  .success-alert {
    margin-left: 18px;
    margin-right: 18px;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.password-field {
  position: relative;
}

.password-icon {
  position: absolute;
  inset-inline-start: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
}

:deep(.auth-password-input) {
  padding-inline-start: 3rem !important;
}
</style>

