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
          <div class="brand-mark">
            <i
                :class="currentStepIcon"
                aria-hidden="true"
            ></i>
          </div>

          <div class="mt-5">
            <h1 class="auth-title">
              {{ currentStepTitle }}
            </h1>

            <p class="auth-subtitle">
              {{ currentStepDescription }}
            </p>
          </div>
        </header>

        <!-- Step Indicator -->
        <div class="stepper">
          <div
              v-for="item in steps"
              :key="item.id"
              class="step-item"
              :class="{
              active: step === item.id,
              completed: step > item.id
            }"
          >
            <div class="step-circle">
              <i
                  v-if="step > item.id"
                  class="pi pi-check"
              ></i>

              <span v-else>
                {{ item.id }}
              </span>
            </div>

            <span class="step-label">
              {{ item.label }}
            </span>
          </div>

          <div class="step-line">
            <span
                :style="{ width: progressWidth }"
            ></span>
          </div>
        </div>

        <!-- Body -->
        <div class="auth-body">

          <!-- =================================================
               STEP 1
          ================================================== -->

          <form
              v-if="step === 1"
              class="auth-form"
              @submit.prevent="sendOtp"
          >
            <div class="field-group">
              <label
                  for="mobile"
                  class="field-label"
              >
                شماره موبایل
                <span class="required">*</span>
              </label>

              <div class="input-wrapper">
                <i class="pi pi-mobile input-icon"></i>

                <InputText
                    id="mobile"
                    v-model="mobile"
                    type="tel"
                    inputmode="numeric"
                    autocomplete="tel"
                    maxlength="11"
                    dir="ltr"
                    placeholder="09123456789"
                    class="auth-input mobile-input"
                    @input="normalizeMobile"
                />
              </div>

              <small class="field-hint">
                کد تأیید به شماره موبایل ثبت‌شده شما ارسال خواهد شد.
              </small>
            </div>

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

            <Button
                type="submit"
                class="primary-button"
                :loading="loading"
                :disabled="loading"
            >
              <template #default>
                <span v-if="!loading">
                  دریافت کد تأیید
                </span>

                <span v-else>
                  در حال ارسال...
                </span>

                <i
                    v-if="!loading"
                    class="pi pi-arrow-left mr-2"
                ></i>
              </template>
            </Button>

            <button
                type="button"
                class="back-link"
                @click="goToLogin"
            >
              <i class="pi pi-arrow-right"></i>
              بازگشت به صفحه ورود
            </button>
          </form>

          <!-- =================================================
               STEP 2
          ================================================== -->

          <div
              v-else-if="step === 2"
              class="auth-form"
          >
            <!-- Mobile Summary -->
            <div class="mobile-summary">
              <div class="summary-icon">
                <i class="pi pi-mobile"></i>
              </div>

              <div class="summary-content">
                <span>
                  کد تأیید به این شماره ارسال شد:
                </span>

                <strong dir="ltr">
                  {{ formattedMobile }}
                </strong>
              </div>

              <button
                  type="button"
                  class="edit-mobile"
                  :disabled="loading"
                  @click="editMobile"
              >
                ویرایش
              </button>
            </div>

            <!-- OTP -->
            <div class="otp-section">
              <label class="field-label text-center">
                کد ۵ رقمی پیامک‌شده را وارد کنید
              </label>

              <div
                  class="otp-inputs"
                  dir="ltr"
                  @paste="handlePaste"
              >
                <input
                    v-for="(digit, index) in otpDigits"
                    :key="index"
                    :ref="el => setOtpRef(el, index)"
                    v-model="otpDigits[index]"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    maxlength="1"
                    class="otp-input"
                    :class="{
                    filled: otpDigits[index],
                    error: !!errorMessage
                  }"
                    :aria-label="`رقم ${index + 1} کد تأیید`"
                    @input="handleOtpInput($event, index)"
                    @keydown.backspace="handleBackspace($event, index)"
                    @keydown.left.prevent="focusOtp(index - 1)"
                    @keydown.right.prevent="focusOtp(index + 1)"
                />
              </div>
            </div>

            <!-- Timer -->
            <div class="otp-timer">
              <template v-if="timeLeft > 0">
                <span>
                  امکان ارسال مجدد تا
                </span>

                <strong dir="ltr">
                  {{ formattedTime }}
                </strong>
              </template>

              <button
                  v-else
                  type="button"
                  class="resend-button"
                  :disabled="loading"
                  @click="resendOtp"
              >
                <i class="pi pi-refresh"></i>
                ارسال مجدد کد
              </button>
            </div>

            <!-- Messages -->
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

            <transition name="message">
              <div
                  v-if="successMessage"
                  class="success-alert"
                  role="status"
              >
                <i class="pi pi-check-circle"></i>
                <span>{{ successMessage }}</span>
              </div>
            </transition>

            <!-- Verify -->
            <Button
                type="button"
                class="primary-button"
                :loading="loading"
                :disabled="loading || otp.value?.length === 5"
                @click="verifyOtp"
            >
              <template #default>
                <span v-if="!loading">
                  تأیید کد و ادامه
                </span>

                <span v-else>
                  در حال بررسی...
                </span>

                <i
                    v-if="!loading"
                    class="pi pi-arrow-left mr-2"
                ></i>
              </template>
            </Button>

            <button
                type="button"
                class="back-link"
                :disabled="loading"
                @click="editMobile"
            >
              <i class="pi pi-arrow-right"></i>
              تغییر شماره موبایل
            </button>
          </div>

          <!-- =================================================
               STEP 3
          ================================================== -->

          <form
              v-else
              class="auth-form"
              @submit.prevent="resetPassword"
          >
            <div class="field-group">
              <label
                  for="newPassword"
                  class="field-label"
              >
                رمز عبور جدید
                <span class="required">*</span>
              </label>

              <div class="password-wrapper">


                <Password
                    id="newPassword"
                    v-model="newPassword"
                    toggleMask
                    :feedback="false"
                    autocomplete="new-password"
                    inputClass="auth-password-input"
                    class="w-full"
                    fluid
                />
              </div>

              <!-- Password Rules -->
              <div class="password-rules">
                <div
                    class="password-rule"
                    :class="{ valid: passwordRules.minLength }"
                >
                  <i
                      :class="
                      passwordRules.minLength
                        ? 'pi pi-check-circle'
                        : 'pi pi-circle'
                    "
                  ></i>

                  <span>
                    حداقل ۶ کاراکتر
                  </span>
                </div>

                <div
                    class="password-rule"
                    :class="{ valid: passwordRules.hasLetter }"
                >
                  <i
                      :class="
                      passwordRules.hasLetter
                        ? 'pi pi-check-circle'
                        : 'pi pi-circle'
                    "
                  ></i>

                  <span>
                    حداقل یک حرف
                  </span>
                </div>

                <div
                    class="password-rule"
                    :class="{ valid: passwordRules.hasNumber }"
                >
                  <i
                      :class="
                      passwordRules.hasNumber
                        ? 'pi pi-check-circle'
                        : 'pi pi-circle'
                    "
                  ></i>

                  <span>
                    حداقل یک عدد
                  </span>
                </div>
              </div>
            </div>

            <div class="field-group">
              <label
                  for="confirmPassword"
                  class="field-label"
              >
                تکرار رمز عبور
                <span class="required">*</span>
              </label>

              <div
                  class="password-wrapper"
                  :class="{
                  'password-error':
                    confirmPassword &&
                    confirmPassword !== newPassword
                }"
              >


                <Password
                    id="confirmPassword"
                    v-model="confirmPassword"
                    toggleMask
                    :feedback="false"
                    autocomplete="new-password"
                    inputClass="auth-password-input"
                    class="w-full"
                    fluid
                />




              </div>

              <small
                  v-if="
                  confirmPassword &&
                  confirmPassword !== newPassword
                "
                  class="field-error"
              >
                <i class="pi pi-exclamation-circle"></i>
                رمز عبور و تکرار آن یکسان نیستند.
              </small>
            </div>

            <!-- Messages -->
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

            <transition name="message">
              <div
                  v-if="successMessage"
                  class="success-alert"
                  role="status"
              >
                <i class="pi pi-check-circle"></i>
                <span>{{ successMessage }}</span>
              </div>
            </transition>

            <!-- Reset -->
            <Button
                type="submit"
                class="primary-button success-button"
                :loading="loading"
                :disabled="loading || !canResetPassword"
            >
              <template #default>
                <span v-if="!loading">
                  تغییر رمز عبور
                </span>

                <span v-else>
                  در حال تغییر رمز...
                </span>

                <i
                    v-if="!loading"
                    class="pi pi-check mr-2"
                ></i>
              </template>
            </Button>

            <button
                type="button"
                class="back-link"
                :disabled="loading"
                @click="goToLogin"
            >
              <i class="pi pi-arrow-right"></i>
              بازگشت به صفحه ورود
            </button>
          </form>

        </div>

        <!-- Footer -->
        <footer class="auth-footer">
          <div class="footer-divider">
            <span></span>
            <i class="pi pi-shield"></i>
            <span></span>
          </div>

          <p>
            فرآیند بازیابی رمز عبور به‌صورت امن انجام می‌شود.
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
import {
  ref,
  computed,
  onUnmounted,
  watch,
  nextTick
} from 'vue'

import { useRouter } from 'vue-router'
import axios from '@/api/axios.js'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

/* =====================================================
   Router
===================================================== */

const router = useRouter()

/* =====================================================
   Config
===================================================== */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api/v1'

/* =====================================================
   Steps
===================================================== */

const step = ref(1)

const steps = [
  {
    id: 1,
    label: 'شماره موبایل'
  },
  {
    id: 2,
    label: 'تأیید کد'
  },
  {
    id: 3,
    label: 'رمز جدید'
  }
]

const currentStepTitle = computed(() => {
  if (step.value === 1) {
    return 'بازیابی رمز عبور'
  }

  if (step.value === 2) {
    return 'تأیید شماره موبایل'
  }

  return 'ایجاد رمز عبور جدید'
})

const currentStepDescription = computed(() => {
  if (step.value === 1) {
    return 'برای بازیابی رمز عبور، شماره موبایل خود را وارد کنید.'
  }

  if (step.value === 2) {
    return 'کد تأیید ارسال‌شده به شماره موبایل خود را وارد کنید.'
  }

  return 'یک رمز عبور جدید برای حساب کاربری خود انتخاب کنید.'
})

const currentStepIcon = computed(() => {
  if (step.value === 1) {
    return 'pi pi-key'
  }

  if (step.value === 2) {
    return 'pi pi-shield'
  }

  return 'pi pi-lock'
})

const progressWidth = computed(() => {
  if (step.value === 1) {
    return '0%'
  }

  if (step.value === 2) {
    return '50%'
  }

  return '100%'
})

/* =====================================================
   Form
===================================================== */

const mobile = ref('')
const otp = ref('')

const otpDigits = ref([
  '',
  '',
  '',
  '',
  ''
])

const newPassword = ref('')
const confirmPassword = ref('')

/* =====================================================
   State
===================================================== */

const loading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const resendCount = ref(0)

const timeLeft = ref(0)

let timerInterval = null

const otpInputs = ref([])

/* =====================================================
   Formatted Values
===================================================== */

const formattedTime = computed(() => {
  const minutes = Math.floor(
      timeLeft.value / 60
  )
      .toString()
      .padStart(2, '0')

  const seconds = (
      timeLeft.value % 60
  )
      .toString()
      .padStart(2, '0')

  return `${minutes}:${seconds}`
})

const formattedMobile = computed(() => {
  if (!mobile.value) {
    return ''
  }

  return mobile.value.replace(
      /(\d{3})(\d{4})(\d{4})/,
      '$1 $2 $3'
  )
})

/* =====================================================
   Password Rules
===================================================== */

const passwordRules = computed(() => ({
  minLength:
      newPassword.value.length >= 6,

  hasLetter:
      /[A-Za-zآ-ی]/.test(newPassword.value),

  hasNumber:
      /\d/.test(newPassword.value)
}))

const canResetPassword = computed(() => {
  return (
      passwordRules.value.minLength &&
      passwordRules.value.hasLetter &&
      passwordRules.value.hasNumber &&
      newPassword.value === confirmPassword.value
  )
})

/* =====================================================
   Mobile
===================================================== */

const normalizeMobile = () => {
  mobile.value = mobile.value
      .replace(
          /[۰-۹]/g,
          digit =>
              '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)
      )
      .replace(/\D/g, '')
      .slice(0, 11)

  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

/* =====================================================
   OTP Refs
===================================================== */

const setOtpRef = (element, index) => {
  if (element) {
    otpInputs.value[index] = element
  }
}

const focusOtp = index => {
  if (
      index >= 0 &&
      index < otpInputs.value.length
  ) {
    otpInputs.value[index]?.focus()
  }
}

/* =====================================================
   Timer
===================================================== */

const startTimer = () => {
  timeLeft.value = 120

  if (timerInterval) {
    clearInterval(timerInterval)
  }

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }, 1000)
}

/* =====================================================
   OTP Input
===================================================== */

const handleOtpInput = (event, index) => {
  let value = event.target.value

  value = value
      .replace(/[۰-۹]/g, digit =>
          '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)
      )
      .replace(/\D/g, '')

  otpDigits.value[index] =
      value.slice(-1)

  errorMessage.value = ''

  if (
      otpDigits.value[index] &&
      index < otpDigits.value.length - 1
  ) {
    nextTick(() => {
      focusOtp(index + 1)
    })
  }
}

/* =====================================================
   OTP Backspace
===================================================== */

const handleBackspace = (event, index) => {
  if (
      event.key === 'Backspace' &&
      !otpDigits.value[index] &&
      index > 0
  ) {
    nextTick(() => {
      focusOtp(index - 1)
    })
  }
}

/* =====================================================
   OTP Paste
===================================================== */

const handlePaste = event => {
  event.preventDefault()

  const pastedData = event.clipboardData
      .getData('text')
      .replace(/[۰-۹]/g, digit =>
          '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)
      )
      .replace(/\D/g, '')
      .slice(0, 5)

  if (!pastedData) {
    return
  }

  otpDigits.value = [
    '',
    '',
    '',
    '',
    ''
  ]

  pastedData
      .split('')
      .forEach((digit, index) => {
        otpDigits.value[index] = digit
      })

  nextTick(() => {
    focusOtp(
        Math.min(
            pastedData.length,
            4
        )
    )
  })
}

/* =====================================================
   Watch OTP
===================================================== */

watch(
    otpDigits,
    values => {
      otp.value = values.join('')

      if (
          otp.value.length === 5 &&
          !loading.value
      ) {
        verifyOtp()
      }
    },
    {
      deep: true
    }
)

/* =====================================================
   Send OTP
===================================================== */

const sendOtp = async () => {
  const mobileRegex = /^09\d{9}$/

  if (!mobileRegex.test(mobile.value)) {
    errorMessage.value =
        'شماره موبایل واردشده صحیح نیست.'

    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await axios.post(
        `${API_BASE_URL}/auth/forgot-password/send-otp`,
        {
          mobile: mobile.value
        }
    )

    step.value = 2

    otpDigits.value = [
      '',
      '',
      '',
      '',
      ''
    ]

    otp.value = ''

    startTimer()

    await nextTick()

    setTimeout(() => {
      focusOtp(0)
    }, 100)

  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        'ارسال کد تأیید با خطا مواجه شد.'

  } finally {
    loading.value = false
  }
}

/* =====================================================
   Resend OTP
===================================================== */

const resendOtp = async () => {
  if (loading.value) {
    return
  }

  resendCount.value++

  otpDigits.value = [
    '',
    '',
    '',
    '',
    ''
  ]

  otp.value = ''

  errorMessage.value = ''
  successMessage.value = ''

  await sendOtp()
}

/* =====================================================
   Verify OTP
===================================================== */

const verifyOtp = async () => {
  if (otp.value.length !== 5) {
    errorMessage.value =
        'لطفاً کد تأیید ۵ رقمی را کامل وارد کنید.'

    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await axios.post(
        `${API_BASE_URL}/auth/forgot-password/verify-otp`,
        {
          mobile: mobile.value,
          otp: otp.value
        }
    )

    successMessage.value =
        'کد تأیید با موفقیت تأیید شد.'

    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }

    setTimeout(() => {
      step.value = 3
      successMessage.value = ''
    }, 500)

  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        'کد تأیید نامعتبر است.'

    otpDigits.value = [
      '',
      '',
      '',
      '',
      ''
    ]

    otp.value = ''

    await nextTick()

    focusOtp(0)

  } finally {
    loading.value = false
  }
}

/* =====================================================
   Reset Password
===================================================== */

const resetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!canResetPassword.value) {
    if (newPassword.value.length < 6) {
      errorMessage.value =
          'رمز عبور باید حداقل ۶ کاراکتر باشد.'
      return
    }

    if (
        !passwordRules.value.hasLetter
    ) {
      errorMessage.value =
          'رمز عبور باید حداقل شامل یک حرف باشد.'
      return
    }

    if (
        !passwordRules.value.hasNumber
    ) {
      errorMessage.value =
          'رمز عبور باید حداقل شامل یک عدد باشد.'
      return
    }

    if (
        newPassword.value !==
        confirmPassword.value
    ) {
      errorMessage.value =
          'رمز عبور و تکرار آن یکسان نیستند.'
      return
    }

    return
  }

  loading.value = true

  try {
    await axios.post(
        `${API_BASE_URL}/auth/forgot-password/reset`,
        {
          mobile: mobile.value,
          otp: otp.value,
          password: newPassword.value,
          password_confirmation:
          confirmPassword.value
        }
    )

    successMessage.value =
        'رمز عبور با موفقیت تغییر کرد.'

    setTimeout(() => {
      router.push({
        path: '/login',
        query: {
          mobile: mobile.value,
          reset: 'success'
        }
      })
    }, 1000)

  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        'تغییر رمز عبور با خطا مواجه شد.'

  } finally {
    loading.value = false
  }
}

/* =====================================================
   Edit Mobile
===================================================== */

const editMobile = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  step.value = 1

  otpDigits.value = [
    '',
    '',
    '',
    '',
    ''
  ]

  otp.value = ''

  errorMessage.value = ''
  successMessage.value = ''
}

/* =====================================================
   Go Login
===================================================== */

const goToLogin = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  router.push('/login')
}

/* =====================================================
   Cleanup
===================================================== */

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
/* =====================================================
   Page
===================================================== */

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

:deep(auth-password-input) {
  padding-inline-start: 3rem !important;
}


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
   Card
===================================================== */

.auth-shell {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.97);
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
  padding: 34px 36px 26px;
  text-align: center;
}

.brand-mark {
  width: 62px;
  height: 62px;
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
  font-size: 24px;
  box-shadow:
      0 12px 25px rgba(37, 99, 235, 0.20);
}

.auth-title {
  margin: 0;
  color: #0f172a;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.5;
}

.auth-subtitle {
  margin: 8px auto 0;
  max-width: 380px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.9;
}

/* =====================================================
   Stepper
===================================================== */

.stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 42px 28px;
}

.step-item {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 90px;
  color: #94a3b8;
}

.step-circle {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  background: #fff;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  transition: 0.25s ease;
}

.step-label {
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.step-item.active {
  color: #2563eb;
}

.step-item.active .step-circle {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
  box-shadow:
      0 0 0 5px rgba(37, 99, 235, 0.10);
}

.step-item.completed {
  color: #16a34a;
}

.step-item.completed .step-circle {
  border-color: #16a34a;
  background: #16a34a;
  color: #fff;
}

.step-line {
  position: absolute;
  top: 17px;
  right: 14%;
  left: 14%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.step-line span {
  display: block;
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

/* =====================================================
   Body
===================================================== */

.auth-body {
  min-height: 290px;
}

.auth-form {
  padding: 0 36px 28px;
}

/* =====================================================
   Fields
===================================================== */

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
      box-shadow 0.2s ease !important;
}

.auth-input {
  padding-right: 42px !important;
}

.mobile-input {
  text-align: left;
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

.password-wrapper .p-password {
  width: 100%;
  display: block;
}

.password-wrapper .auth-password-input {
  padding-right: 42px !important;
  padding-left: 45px !important;
}

.password-error .auth-password-input {
  border-color: #ef4444 !important;
}

.field-hint {
  display: block;
  margin-top: 7px;
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

/* =====================================================
   Mobile Summary
===================================================== */

.mobile-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 36px 24px;
  padding: 13px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #eff6ff;
}

.summary-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
}

.summary-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-content span {
  color: #64748b;
  font-size: 10px;
}

.summary-content strong {
  color: #1e3a8a;
  font-size: 13px;
  letter-spacing: 0.3px;
}

.edit-mobile {
  padding: 5px 7px;
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.edit-mobile:hover {
  text-decoration: underline;
}

/* =====================================================
   OTP
===================================================== */

.otp-section {
  margin-bottom: 18px;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 15px;
}

.otp-input {
  width: 52px;
  height: 58px;
  text-align: center;
  border: 1px solid #dbe3ed;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
}

.otp-input:hover {
  border-color: #b9c5d4;
}

.otp-input:focus {
  border-color: #2563eb;
  box-shadow:
      0 0 0 4px rgba(37, 99, 235, 0.10);
}

.otp-input.filled {
  border-color: #93c5fd;
  background: #f8fbff;
}

.otp-input.error {
  border-color: #ef4444;
}

/* =====================================================
   Timer
===================================================== */

.otp-timer {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
  color: #64748b;
  font-size: 11px;
}

.otp-timer strong {
  color: #dc2626;
  font-size: 12px;
}

.resend-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.resend-button:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* =====================================================
   Password Rules
===================================================== */

.password-rules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 9px;
}

.password-rule {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 9px;
}

.password-rule i {
  font-size: 10px;
}

.password-rule.valid {
  color: #16a34a;
}

/* =====================================================
   Alerts
===================================================== */

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 12px;
}

.error-alert {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.success-alert {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

/* =====================================================
   Buttons
===================================================== */

.primary-button {
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

.primary-button:hover:not(:disabled) {
  background: #1d4ed8 !important;
  transform: translateY(-1px);
}

.success-button {
  background: #059669 !important;
  box-shadow:
      0 8px 18px rgba(5, 150, 105, 0.18) !important;
}

.success-button:hover:not(:disabled) {
  background: #047857 !important;
}

.back-link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 15px;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
}

.back-link:hover {
  color: #2563eb;
}

/* =====================================================
   Footer
===================================================== */

.auth-footer {
  padding: 0 36px 28px;
  text-align: center;
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.8;
}

.footer-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 9px;
}

.footer-divider span {
  height: 1px;
  flex: 1;
  background: #e2e8f0;
}

.footer-divider i {
  font-size: 10px;
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
.message-leave-active {
  transition: all 0.2s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* =====================================================
   Responsive
===================================================== */

@media (max-width: 640px) {
  .auth-page {
    align-items: flex-start;
    padding: 24px 14px;
  }

  .auth-card {
    border-radius: 20px;
  }

  .auth-header {
    padding: 28px 20px 22px;
  }

  .auth-form {
    padding: 0 20px 24px;
  }

  .mobile-summary {
    margin-left: 20px;
    margin-right: 20px;
  }

  .auth-footer {
    padding: 0 20px 24px;
  }

  .stepper {
    margin-left: 28px;
    margin-right: 28px;
  }

  .otp-inputs {
    gap: 7px;
  }

  .otp-input {
    width: 48px;
    height: 54px;
  }

  .password-rules {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}

@media (max-width: 390px) {
  .auth-page {
    padding: 10px;
  }

  .auth-header {
    padding-left: 16px;
    padding-right: 16px;
  }

  .auth-form {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mobile-summary {
    margin-left: 16px;
    margin-right: 16px;
  }

  .auth-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .stepper {
    margin-left: 18px;
    margin-right: 18px;
  }

  .step-label {
    font-size: 9px;
  }

  .otp-inputs {
    gap: 5px;
  }

  .otp-input {
    width: 44px;
    height: 50px;
    font-size: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
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

</style>
