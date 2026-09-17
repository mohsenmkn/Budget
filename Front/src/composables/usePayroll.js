// resources/js/Modules/Payroll/Composables/usePayroll.js
import { ref, computed } from 'vue';
import { payrollApi } from '@/Services/payrollApi';
import { useFormatter } from '@/composables/useFormatter.js';

 export function usePayroll() {
    const { formatYearMonth } = useFormatter();

    const months = ref([]);
    const payslip = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const selectedMonth = ref(null);

    /**
     * بارگذاری لیست ماه‌ها
     */
    const loadMonths = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await payrollApi.getMonths();
            months.value = response.data.data || [];

            // انتخاب اولین ماه به صورت پیش‌فرض
            if (months.value.length > 0 && !selectedMonth.value) {
                selectedMonth.value = months.value[0].value;
                await loadPayslip(selectedMonth.value);
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'خطا در دریافت لیست ماه‌ها';
            console.error('Error loading months:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * بارگذاری فیش حقوقی
     */
    const loadPayslip = async (yearMonth) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await payrollApi.getPayslip(yearMonth);
            payslip.value = response.data.data;
            selectedMonth.value = yearMonth;
        } catch (err) {
            payslip.value = null;
            error.value = err.response?.data?.message || 'خطا در دریافت فیش حقوقی';
            console.error('Error loading payslip:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * دانلود PDF
     */
    const downloadPdf = async (yearMonth = null) => {
        const month = yearMonth || selectedMonth.value;
        if (!month) return;

        loading.value = true;
        try {
            await payrollApi.downloadPdf(month);
        } catch (err) {
            error.value = 'خطا در دانلود PDF';
            console.error('Error downloading PDF:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * چاپ فیش
     */
    const printPayslip = () => {
        window.print();
    };

    /**
     * گروه‌بندی آیتم‌ها بر اساس دسته
     */
    const groupedItems = computed(() => {
        if (!payslip.value?.items) return {};
        return payslip.value.items;
    });

    /**
     * تمام آیتم‌ها به صورت فلت
     */
    const flatItems = computed(() => {
        if (!payslip.value?.items) return [];
        return Object.values(payslip.value.items).flat();
    });

    /**
     * تغییر ماه
     */
    const changeMonth = async (yearMonth) => {
        await loadPayslip(yearMonth);
    };

    return {
        months,
        payslip,
        loading,
        error,
        selectedMonth,
        groupedItems,
        flatItems,
        loadMonths,
        loadPayslip,
        downloadPdf,
        printPayslip,
        changeMonth,
    };
}