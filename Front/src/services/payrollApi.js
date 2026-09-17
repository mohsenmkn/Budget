// resources/js/Modules/Payroll/Services/payrollApi.js
import axios from 'axios';
import api from '@/api/axios.js'

export const payrollApi = {
    /**
     * دریافت لیست ماه‌های موجود
     */
    getMonths() {
        return api.get('/payroll/months');
    },

    /**
     * دریافت فیش حقوقی یک ماه
     */
    getPayslip(yearMonth) {
        return api.get(`/payroll/payslip/${yearMonth}`);
    },

    /**
     * دریافت URL دانلود PDF
     */
    getPdfUrl(yearMonth) {
        const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        const token = localStorage.getItem('token') || document.querySelector('meta[name="csrf-token"]')?.content;
        return `${baseUrl}/payroll/payslip/${yearMonth}/pdf?token=${token}`;
    },

    /**
     * دانلود PDF
     */
    async downloadPdf(yearMonth) {
        const response = await api.get(`/payroll/payslip/${yearMonth}/pdf`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fish-hoghooghi-${yearMonth}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    /**
     * لیست کارمندان (برای مدیران) - 🔑 این تابع اضافه شد
     */
    getEmployees(search = '') {
        return api.get('/payroll/employees', {
            params: { search },
        });
    },

    /**
     * فیش حقوقی یک کارمند خاص (برای مدیران) - 🔑 این تابع اضافه شد
     */
    getEmployeePayslip(employeeId, yearMonth) {
        return api.get(`/payroll/employees/${employeeId}/payslip/${yearMonth}`);
    },

    async downloadEmployeePdf(employeeId, yearMonth) {
        const response = await api.get(
            `/payroll/employees/${employeeId}/payslip/${yearMonth}/pdf`,
            { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fish-hoghooghi-${employeeId}-${yearMonth}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};