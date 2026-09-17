// resources/js/Modules/Payroll/Composables/useFormatter.js

export function useFormatter() {
    const monthNames = {
        1: 'فروردین', 2: 'اردیبهشت', 3: 'خرداد',
        4: 'تیر', 5: 'مرداد', 6: 'شهریور',
        7: 'مهر', 8: 'آبان', 9: 'آذر',
        10: 'دی', 11: 'بهمن', 12: 'اسفند',
    };

    /**
     * تبدیل عدد به فرمت فارسی با جداکننده هزارگان (برای مبالغ)
     */
    const formatNumber = (value) => {
        if (value === null || value === undefined) return '۰';
        const num = Number(value);
        return num.toLocaleString('fa-IR');
    };

    /**
     * تبدیل عدد به فرمت ساده بدون جداکننده (برای کد ملی، کد پرسنلی و...)
     */
    const formatPlain = (value) => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    /**
     * تبدیل مبلغ به فرمت فارسی + "ریال"
     */
    const formatCurrency = (value) => {
        return `${formatNumber(value)} ریال`;
    };

    /**
     * تبدیل مبلغ به تومان (تقسیم بر ۱۰)
     */
    const formatToToman = (value) => {
        const toman = Math.round(value / 10);
        return `${formatNumber(toman)} تومان`;
    };

    /**
     * تبدیل سال‌ماه به نام فارسی
     */
    const formatYearMonth = (yearMonth) => {
        const year = Math.floor(yearMonth / 100);
        const month = yearMonth % 100;
        return `${monthNames[month] || 'نامشخص'} ${year}`;
    };

    const getYear = (yearMonth) => Math.floor(yearMonth / 100);
    const getMonth = (yearMonth) => yearMonth % 100;

    return {
        monthNames,
        formatNumber,      // با جداکننده (برای مبالغ)
        formatPlain,       // بدون جداکننده (برای کد ملی، کد پرسنلی)
        formatCurrency,
        formatToToman,
        formatYearMonth,
        getYear,
        getMonth,
    };
}