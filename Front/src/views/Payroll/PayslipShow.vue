<!-- resources/js/Modules/Payroll/Views/PayslipShow.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';

import MonthSelector from './MonthSelector.vue';
import PayslipHeader from './PayslipHeader.vue';
import PayslipItems from './PayslipItems.vue';
import PayslipSummary from './PayslipSummary.vue';

import { usePayroll } from '@/composables/usePayroll.js';
import { usePayslipPrint } from '@/composables/usePayslipPrint.js';

const toast = useToast();
const { printPayslip } = usePayslipPrint();

const {
  months,
  payslip,
  loading,
  error,
  selectedMonth,
  loadMonths,
  changeMonth,
} = usePayroll();

// ═══════════════════════════════════════════
// 🔑 محدود کردن ماه‌ها به ۶ ماه اخیر
// ══════════════════════════════════════════
const recentMonths = computed(() => {
  if (!months.value || months.value.length === 0) return [];

  // اگر ماه‌ها به صورت آبجکت { value, label } هستند
  // فقط ۶ تای آخر (جدیدترین‌ها) را نمایش می‌دهیم
  return months.value.slice(0, 6);
});

// ═══════════════════════════════════════════
// Responsive Breakpoints
// ═══════════════════════════════════════════

const isMobile = computed(() => window.innerWidth < 640);
const isTablet = computed(() => window.innerWidth >= 640 && window.innerWidth < 1024);
const isDesktop = computed(() => window.innerWidth >= 1024);

// ═══════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════

/**
 * 🔑 چاپ فیش حقوقی
 */
const handlePrint = () => {
  if (!payslip.value) {
    toast.add({
      severity: 'warn',
      summary: 'هشدار',
      detail: 'فیش حقوقی برای چاپ آماده نیست',
      life: 3000,
    });
    return;
  }
  printPayslip(payslip.value);

  toast.add({
    severity: 'success',
    summary: 'موفق',
    detail: 'در حال آماده‌سازی چاپ...',
    life: 2000,
  });
};

onMounted(() => {
  loadMonths();
});
</script>

<template>
  <div class="payslip-container">
    <!-- ═══════════════════════════════════════════
         HEADER - عنوان و توضیحات
         ═══════════════════════════════════════════ -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <i class="pi pi-wallet header-icon"></i>
        </div>
        <div class="header-text">
          <h1 class="page-title">فیش حقوقی</h1>
          <p class="page-subtitle">مشاهده و چاپ فیش حقوقی ماهانه</p>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════
         MONTH SELECTOR - انتخاب ماه (فقط ۶ ماه اخیر)
         ═══════════════════════════════════════════ -->
    <div class="month-selector-wrapper">
      <MonthSelector
          v-model="selectedMonth"
          :months="recentMonths"
          @update:modelValue="changeMonth"
      />
    </div>

    <!-- ═══════════════════════════════════════════
         LOADING STATE - حالت بارگذاری
         ═══════════════════════════════════════════ -->
    <Transition name="fade" mode="out-in">
      <div v-if="loading && !payslip" class="loading-wrapper">
        <div class="loading-content">
          <ProgressSpinner
              strokeWidth="3"
              fill="var(--surface-ground)"
              animationDuration=".8s"
          />
          <p class="loading-text">در حال بارگذاری فیش حقوقی...</p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════
           ERROR STATE - حالت خطا
           ═══════════════════════════════════════════ -->
      <Message
          v-else-if="error"
          severity="error"
          :closable="false"
          class="error-message"
      >
        <div class="error-content">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>
      </Message>

      <!-- ═══════════════════════════════════════════
           PAYSLIP CONTENT - محتوای فیش حقوقی
           ══════════════════════════════════════════ -->
      <div v-else-if="payslip" class="payslip-wrapper">

        <!-- Action Buttons Toolbar -->
        <div class="action-toolbar">
          <div class="toolbar-title">
            <i class="pi pi-cog"></i>
            <span>عملیات</span>
          </div>

          <div class="toolbar-actions">
            <Button
                label="چاپ فیش"
                icon="pi pi-print"
                severity="secondary"
                outlined
                @click="handlePrint"
                class="action-btn"
            />
          </div>
        </div>

        <!-- Main Payslip Card -->
        <Card class="payslip-card">
          <template #header>
            <div class="card-header">
              <div class="header-badge">
                <i class="pi pi-calendar"></i>
                <span>{{ payslip.year_month_label }}</span>
              </div>
            </div>
          </template>

          <template #content>
            <!-- Payslip Header Info -->
            <div class="payslip-section">
              <PayslipHeader :payslip="payslip" />
            </div>

            <Divider />

            <!-- Summary Section -->
            <div class="payslip-section">
              <h3 class="section-title">
                <i class="pi pi-chart-bar"></i>
                خلاصه وضعیت
              </h3>
              <PayslipSummary :summary="payslip.summary" />
            </div>

            <Divider />

            <!-- Items Section -->
            <div class="payslip-section">
              <h3 class="section-title">
                <i class="pi pi-list"></i>
                جزئیات
              </h3>
              <PayslipItems
                  :grouped-items="payslip.items"
                  :summary="payslip.summary"
              />
            </div>

            <!-- Net Pay Highlight -->
            <div class="net-pay-highlight">
              <div class="net-pay-label">
                <i class="pi pi-wallet"></i>
                <span>خالص پرداختی</span>
              </div>
              <div class="net-pay-amount">
                {{ Number(payslip.summary.net_pay).toLocaleString('fa-IR') }}
                <span class="currency">ریال</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- ═══════════════════════════════════════════
           EMPTY STATE - حالت خالی
           ═══════════════════════════════════════════ -->
      <div v-else-if="!loading" class="empty-wrapper">
        <div class="empty-content">
          <div class="empty-icon">
            <i class="pi pi-inbox"></i>
          </div>
          <h3 class="empty-title">فیش حقوقی یافت نشد</h3>
          <p class="empty-text">
            برای ماه انتخاب‌شده فیش حقوقی ثبت نشده است
          </p>
          <Button
              label="انتخاب ماه دیگر"
              icon="pi pi-calendar"
              severity="secondary"
              outlined
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ══════════════════════════════════════════════════════
   CONTAINER & BASE
   ═══════════════════════════════════════════════════════ */

.payslip-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 140px);
}

/* ═══════════════════════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════════════════════ */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.header-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-icon {
  font-size: 1.75rem;
  color: white;
}

.header-text {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

/* ═══════════════════════════════════════════════════════
   MONTH SELECTOR
   ═══════════════════════════════════════════════════════ */

.month-selector-wrapper {
  margin-bottom: 1.5rem;
}

/* ═══════════════════════════════════════════════════════
   LOADING STATE
   ═══════════════════════════════════════════════════════ */

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.loading-content {
  text-align: center;
}

.loading-text {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #64748b;
}

/* ═══════════════════════════════════════════════════════
   ERROR STATE
   ══════════════════════════════════════════════════════ */

.error-message {
  margin: 2rem 0;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.error-content i {
  font-size: 1.25rem;
}

/* ═══════════════════════════════════════════════════════
   PAYSLIP WRAPPER
   ═══════════════════════════════════════════════════════ */

.payslip-wrapper {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════════════════
   ACTION TOOLBAR
   ═══════════════════════════════════════════════════════ */

.action-toolbar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.toolbar-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.toolbar-title i {
  font-size: 1.1rem;
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  min-width: 140px;
}

/* ═══════════════════════════════════════════════════════
   PAYSLIP CARD
   ═══════════════════════════════════════════════════════ */

.payslip-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-bottom: 1px solid #cbd5e1;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  color: #334155;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-badge i {
  color: #3b82f6;
}

/* ═══════════════════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════════════════ */

.payslip-section {
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.section-title i {
  color: #3b82f6;
  font-size: 1.2rem;
}

/* ═══════════════════════════════════════════════════════
   NET PAY HIGHLIGHT
   ═══════════════════════════════════════════════════════ */

.net-pay-highlight {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.net-pay-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.net-pay-label i {
  font-size: 1.5rem;
}

.net-pay-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  text-align: left;
  direction: ltr;
}

.net-pay-amount .currency {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
  margin-right: 0.25rem;
}

/* ═══════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════ */

.empty-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
}

.empty-icon i {
  font-size: 3.5rem;
  color: #94a3b8;
}

.empty-title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.empty-text {
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════
   TRANSITIONS
   ══════════════════════════════════════════════════════ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE DESIGN
   ═══════════════════════════════════════════════════════ */

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  .payslip-container {
    padding: 1.25rem;
  }

  .page-header {
    padding: 1.5rem;
  }

  .header-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .header-icon {
    font-size: 2rem;
  }

  .page-title {
    font-size: 1.65rem;
  }

  .toolbar-actions {
    gap: 1rem;
  }

  .action-btn {
    min-width: 160px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .payslip-container {
    padding: 2rem;
  }

  .page-header {
    padding: 1.75rem 2rem;
    margin-bottom: 2rem;
  }

  .header-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .header-icon {
    font-size: 2.25rem;
  }

  .page-title {
    font-size: 1.875rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .action-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .toolbar-title {
    margin-bottom: 0;
  }

  .toolbar-actions {
    gap: 1rem;
  }

  .action-btn {
    flex: initial;
    min-width: auto;
  }

  .card-header {
    padding: 1.5rem 2rem;
  }

  .net-pay-highlight {
    padding: 2rem;
  }

  .net-pay-label {
    font-size: 1.25rem;
  }

  .net-pay-amount {
    font-size: 2rem;
  }
}

/* Mobile Optimizations */
@media (max-width: 639px) {
  .payslip-container {
    padding: 0.75rem;
  }

  .page-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .header-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .header-icon {
    font-size: 1.5rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .page-subtitle {
    font-size: 0.8rem;
  }

  .action-toolbar {
    padding: 1rem;
  }

  .toolbar-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }

  .net-pay-highlight {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.25rem;
  }

  .net-pay-label {
    justify-content: center;
  }

  .net-pay-amount {
    font-size: 1.5rem;
  }
}

/* Print Styles */
@media print {
  .page-header,
  .month-selector-wrapper,
  .action-toolbar {
    display: none;
  }

  .payslip-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>