<template>
  <div class="budget-auth-layout">
    <!-- بخش پس‌زمینه و کارت مرکزی -->
    <div class="auth-card-wrapper">
      <div class="auth-card">

        <!-- هدر کارت و آیکون مرحله -->
        <div class="brand-header">
          <div class="logo-placeholder">
            <i :class="currentStepIcon"></i>
          </div>
          <h1>{{ currentStepTitle }}</h1>
          <p>{{ currentStepDescription }}</p>
        </div>

        <!-- استپر مراحل (۳ مرحله) -->
        <div class="stepper-container">
          <div class="step-progress-track">
            <div class="step-progress-bar" :style="{ width: progressWidth }"></div>
          </div>
          <div class="steps-wrapper">
            <div
                v-for="s in steps"
                :key="s.number"
                class="step-item"
                :class="{
                'active': step === s.number,
                'completed': step > s.number
              }"
            >
              <div class="step-circle">
                <i v-if="step > s.number" class="pi pi-check"></i>
                <span v-else>{{ s.number }}</span>
              </div>
              <span class="step-title">{{ s.title }}</span>
            </div>
          </div>
        </div>

        <!-- پیام‌های خطا و موفقیت -->
        <Transition name="fade">
          <div v-if="errorMessage" class="alert alert-danger">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="successMessage" class="alert alert-success">
            <i class="pi pi-check-circle"></i>
            <span>{{ successMessage }}</span>
          </div>
        </Transition>

        <!-- مرحله ۱: ورود شماره موبایل -->
        <form v-if="step === 1" @submit.prevent="sendOtp" class="auth-form">
          <div class="form-group">
            <label for="mobile">شماره موبایل حساب کاربری</label>
            <span class="p-input-icon-right full-width">
              <i class="pi pi-mobile" />
              <InputText
                  id="mobile"
                  v-model="mobile"
                  class="full-width p-inputtext-lg dir-ltr"
                  placeholder="09123456789"
                  maxlength="11"
                  @input="normalizeMobile"
                  :disabled="loading"
              />
            </span>
            <small class="hint-text">کد تأیید به این شماره پیامک خواهد شد.</small>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || mobile.length < 11">
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span v-else>ارسال کد تأیید</span>
          </button>

          <div class="back-link-wrapper">
            <router-link to="/login" class="back-link">
              <i class="pi pi-arrow-right"></i>
              بازگشت به صفحه ورود
            </router-link>
          </div>
        </form>

        <!-- مرحله ۲: وارد کردن کد تأیید (OTP) -->
        <form v-else-if="step === 2" @submit.prevent="verifyOtp" class="auth-form">
          <div class="mobile-summary">
            <span>کد تأیید به شماره <strong>{{ formattedMobile }}</strong> ارسال شد.</span>
            <button type="button" class="edit-mobile-btn" @click="editMobile" title="ویرایش شماره">
              <i class="pi pi-pencil"></i> ویرایش
            </button>
          </div>

          <div class="form-group">
            <label class="center-label">کد ۵ رقمی پیامک شده را وارد کنید</label>
            <div class="otp-inputs-wrapper dir-ltr">
              <input
                  v-for="(digit, idx) in otpDigits"
                  :key="idx"
                  :ref="el => setOtpRef(el, idx)"
                  v-model="otpDigits[idx]"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="1"
                  class="otp-digit-box"
                  :class="{ 'filled': digit !== '', 'has-error': errorMessage }"
                  @input="e => handleOtpInput(e, idx)"
                  @keydown="e => handleBackspace(e, idx)"
                  @paste="handlePaste"
              />
            </div>
          </div>

          <!-- تایمر و ارسال مجدد -->
          <div class="timer-wrapper">
            <span v-if="timeLeft > 0" class="timer-countdown">
              <i class="pi pi-clock"></i>
              ارسال مجدد تا {{ formattedTime }}
            </span>
            <button
                v-else
                type="button"
                class="resend-btn"
                @click="resendOtp"
                :disabled="loading"
            >
              <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
              ارسال مجدد کد تأیید
            </button>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || otp.length < 5">
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span v-else>تأیید و ادامه</span>
          </button>

          <div class="back-link-wrapper">
            <button type="button" class="back-link" @click="editMobile">
              <i class="pi pi-arrow-right"></i>
              تغییر شماره موبایل
            </button>
          </div>
        </form>

        <!-- مرحله ۳: تعیین رمز عبور جدید -->
        <form v-else-if="step === 3" @submit.prevent="resetPassword" class="auth-form">
          <!-- رمز عبور جدید -->
          <div class="form-group">
            <label for="new-password">رمز عبور جدید</label>
            <Password
                id="new-password"
                v-model="newPassword"
                class="full-width p-inputtext-lg dir-ltr"
                :feedback="false"
                toggleMask
                placeholder="••••••••"
            />
          </div>

          <!-- چک‌لیست قوانین رمز عبور -->
          <div class="password-rules-box">
            <div class="rule-item" :class="{ 'valid': passwordRules.minLength }">
              <i :class="passwordRules.minLength ? 'pi pi-check' : 'pi pi-circle'"></i>
              <span>حداقل ۶ کاراکتر</span>
            </div>
            <div class="rule-item" :class="{ 'valid': passwordRules.hasLetter }">
              <i :class="passwordRules.hasLetter ? 'pi pi-check' : 'pi pi-circle'"></i>
              <span>شامل حروف لاتین</span>
            </div>
            <div class="rule-item" :class="{ 'valid': passwordRules.hasNumber }">
              <i :class="passwordRules.hasNumber ? 'pi pi-check' : 'pi pi-circle'"></i>
              <span>شامل عدد</span>
            </div>
          </div>

          <!-- تکرار رمز عبور -->
          <div class="form-group">
            <label for="confirm-password">تکرار رمز عبور جدید</label>
            <Password
                id="confirm-password"
                v-model="confirmPassword"
                class="full-width p-inputtext-lg dir-ltr"
                :feedback="false"
                toggleMask
                placeholder="••••••••"
            />
            <small
                v-if="confirmPassword && newPassword !== confirmPassword"
                class="error-text"
            >
              تکرار رمز عبور با رمز عبور جدید مطابقت ندارد.
            </small>
          </div>

          <button
              type="submit"
              class="submit-btn success-btn"
              :disabled="loading || !canResetPassword"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span v-else>ثبت رمز عبور جدید و ورود</span>
          </button>

          <div class="back-link-wrapper">
            <router-link to="/login" class="back-link">
              انصراف و بازگشت به صفحه ورود
            </router-link>
          </div>
        </form>

        <!-- فوتر کارت -->
        <div class="auth-footer">
          <div class="security-badge">
            <i class="pi pi-shield"></i>
            <span>سامانه امن مدیریت بودجه و اعتبارات</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios.js'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const router = useRouter()

// --- حالت‌های عمومی (State) ---
const step = ref(1)
const steps = [
  { number: 1, title: 'شماره همراه' },
  { number: 2, title: 'کد تأیید' },
  { number: 3, title: 'رمز جدید' }
]

const mobile = ref('')
const otp = ref('')
const otpDigits = reactive(['', '', '', '', ''])
const newPassword = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const resendCount = ref(0)
const timeLeft = ref(120)
const otpInputs = ref([])
let timerInterval = null

// --- مقادیر محاسباتی (Computed) ---
const currentStepTitle = computed(() => {
  if (step.value === 1) return 'بازیابی رمز عبور'
  if (step.value === 2) return 'تأیید شماره همراه'
  return 'تعیین رمز عبور جدید'
})

const currentStepDescription = computed(() => {
  if (step.value === 1) return 'جهت بازیابی حساب، شماره موبایل خود را وارد نمایید'
  if (step.value === 2) return 'کد ۵ رقمی پیامک شده را وارد کنید'
  return 'یک رمز عبور قوی و مطمئن برای حساب خود تعیین نمایید'
})

const currentStepIcon = computed(() => {
  if (step.value === 1) return 'pi pi-mobile'
  if (step.value === 2) return 'pi pi-key'
  return 'pi pi-lock'
})

const progressWidth = computed(() => {
  if (step.value === 1) return '0%'
  if (step.value === 2) return '50%'
  return '100%'
})

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const formattedMobile = computed(() => {
  if (mobile.value.length === 11) {
    return `${mobile.value.slice(0, 4)} ${mobile.value.slice(4, 7)} ${mobile.value.slice(7)}`
  }
  return mobile.value
})

const passwordRules = computed(() => ({
  minLength: newPassword.value.length >= 6,
  hasLetter: /[a-zA-Zآ-ی]/.test(newPassword.value),
  hasNumber: /\d/.test(newPassword.value)
}))

const canResetPassword = computed(() => {
  return (
      passwordRules.value.minLength &&
      passwordRules.value.hasLetter &&
      passwordRules.value.hasNumber &&
      newPassword.value === confirmPassword.value
  )
})

// --- توابع کمکی ---
const toLatinDigits = (str) => {
  if (!str) return ''
  return str
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
}

const normalizeMobile = () => {
  mobile.value = toLatinDigits(mobile.value).replace(/\D/g, '')
}

const setOtpRef = (el, idx) => {
  if (el) otpInputs.value[idx] = el
}

const focusOtp = (idx) => {
  nextTick(() => {
    if (otpInputs.value[idx]) {
      otpInputs.value[idx].focus()
      otpInputs.value[idx].select?.()
    }
  })
}

const resetOtp = () => {
  for (let i = 0; i < 5; i++) otpDigits[i] = ''
  otp.value = ''
}

const clearTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
}

const startTimer = (seconds = 120) => {
  clearTimer()
  timeLeft.value = seconds
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearTimer()
    }
  }, 1000)
}

// --- مدیریت ورودی‌های OTP ---
const handleOtpInput = (e, idx) => {
  const val = toLatinDigits(e.target.value).replace(/\D/g, '')
  otpDigits[idx] = val ? val.slice(-1) : ''

  if (val && idx < 4) {
    focusOtp(idx + 1)
  }
}

const handleBackspace = (e, idx) => {
  if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
    focusOtp(idx - 1)
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const pasted = toLatinDigits(e.clipboardData.getData('text')).replace(/\D/g, '').slice(0, 5)
  if (!pasted) return

  for (let i = 0; i < 5; i++) {
    otpDigits[i] = pasted[i] || ''
  }

  const nextEmpty = otpDigits.findIndex(d => !d)
  if (nextEmpty !== -1) {
    focusOtp(nextEmpty)
  } else {
    focusOtp(4)
  }
}

// ارسال خودکار پس از ۵ رقمی شدن
watch(
    otpDigits,
    () => {
      otp.value = otpDigits.join('')
      if (otp.value.length === 5 && !loading.value) {
        verifyOtp()
      }
    },
    { deep: true }
)

// --- ارتباط با API ---
const sendOtp = async () => {
  if (!/^09\d{9}$/.test(mobile.value)) {
    errorMessage.value = 'شماره موبایل وارد شده معتبر نمی‌باشد (مثال: 09123456789)'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await axios.post('/auth/forgot-password/send-otp', {
      mobile: mobile.value
    })
    step.value = 2
    resetOtp()
    startTimer(120)
    focusOtp(0)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  if (timeLeft.value > 0 || loading.value) return
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await axios.post('/auth/forgot-password/send-otp', {
      mobile: mobile.value
    })
    resendCount.value++
    resetOtp()
    startTimer(120)
    focusOtp(0)
    successMessage.value = 'کد تأیید مجدداً ارسال گردید.'
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'ارسال مجدد کد با خطا مواجه شد.'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  if (otp.value.length !== 5) {
    errorMessage.value = 'لطفاً کد تأیید ۵ رقمی را به طور کامل وارد کنید.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // در صورت وجود اندپوینت اعتبارسنجی مجزا
    try {
      await axios.post('/auth/forgot-password/verify-otp', {
        mobile: mobile.value,
        otp: otp.value
      })
    } catch (apiErr) {
      if (apiErr.response?.status !== 404) {
        throw apiErr
      }
    }

    step.value = 3
    clearTimer()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'کد تأیید وارد شده نامعتبر یا منقضی شده است.'
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!canResetPassword.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    await axios.post('/auth/forgot-password/reset', {
      mobile: mobile.value,
      otp: otp.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value
    })

    successMessage.value = 'رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...'
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { mobile: mobile.value, reset: 'success' }
      })
    }, 1500)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'تغییر رمز عبور با خطا مواجه شد.'
  } finally {
    loading.value = false
  }
}

const editMobile = () => {
  step.value = 1
  clearTimer()
  resetOtp()
  errorMessage.value = ''
  successMessage.value = ''
}

onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped>
.budget-auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
  direction: rtl;
  font-family: 'Vazirmatn', IRANSans, Tahoma, sans-serif;
  padding: 1.5rem;
}

.auth-card-wrapper {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
}

/* --- هدر کارت --- */
.brand-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-placeholder {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 0.75rem auto;
}

.brand-header h1 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.35rem 0;
}

.brand-header p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* --- استپر مراحل --- */
.stepper-container {
  position: relative;
  margin-bottom: 1.75rem;
  padding: 0 0.5rem;
}

.step-progress-track {
  position: absolute;
  top: 15px;
  left: 30px;
  right: 30px;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 1;
}

.step-progress-bar {
  height: 100%;
  background-color: #1d4ed8;
  transition: width 0.3s ease;
}

.steps-wrapper {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #cbd5e1;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-title {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.step-item.active .step-circle {
  border-color: #1d4ed8;
  color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
}

.step-item.active .step-title {
  color: #1d4ed8;
  font-weight: 600;
}

.step-item.completed .step-circle {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
  color: #ffffff;
}

/* --- فرم‌ها و ورودی‌ها --- */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.center-label {
  text-align: center;
}

.full-width, .full-width :deep(.p-inputtext) {
  width: 100%;
}

.dir-ltr {
  direction: ltr;
  text-align: left;
}

.hint-text {
  font-size: 0.75rem;
  color: #64748b;
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

/* خلاصه شماره موبایل در استپ ۲ */
.mobile-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #475569;
}

.edit-mobile-btn {
  background: none;
  border: none;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: inherit;
}

.edit-mobile-btn:hover {
  text-decoration: underline;
}

/* کادرهای OTP */
.otp-inputs-wrapper {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 0.5rem 0;
}

.otp-digit-box {
  width: 48px;
  height: 54px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #0f172a;
  transition: all 0.2s;
  outline: none;
}

.otp-digit-box:focus {
  border-color: #1d4ed8;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
}

.otp-digit-box.filled {
  border-color: #94a3b8;
  background-color: #ffffff;
}

.otp-digit-box.has-error {
  border-color: #ef4444;
}

/* تایمر */
.timer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
}

.timer-countdown {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.resend-btn {
  background: none;
  border: none;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: inherit;
}

.resend-btn:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

/* قوانین پسورد */
.password-rules-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.65rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #94a3b8;
}

.rule-item i {
  font-size: 0.65rem;
}

.rule-item.valid {
  color: #16a34a;
  font-weight: 600;
}

/* دکمه‌ها */
.submit-btn {
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1e40af;
}

.submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.success-btn {
  background-color: #16a34a;
}

.success-btn:hover:not(:disabled) {
  background-color: #15803d;
}

.back-link-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
}

.back-link {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0f172a;
}

/* آلرت‌ها */
.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* فوتر */
.auth-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* انیمیشن‌ها */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  .otp-digit-box {
    width: 42px;
    height: 48px;
    font-size: 1.1rem;
  }
  .password-rules-box {
    grid-template-columns: 1fr;
  }
}
</style>
