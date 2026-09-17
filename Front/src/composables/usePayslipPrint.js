// resources/js/Modules/Payroll/Composables/usePayslipPrint.js

/**
 * Composable برای چاپ فیش حقوقی در یک صفحه A4
 * به صورت هوشمند سایز را بر اساس تعداد داده‌ها تنظیم می‌کند
 */
export function usePayslipPrint() {

    /**
     * محاسبه استایل بهینه بر اساس تعداد ردیف‌ها
     */
    const calculatePrintStyles = (totalRows) => {
        // A4 با margin 10mm: ارتفاع قابل استفاده ≈ 277mm
        // هدر + اطلاعات + جمع‌ها + فوتر ≈ 85mm ثابت
        // باقی‌مانده برای جدول: ≈ 192mm

        let fontSize, rowHeight, padding, headerFontSize;

        if (totalRows <= 20) {
            // حالت عادی - فضای کافی
            fontSize = '13px';
            rowHeight = '8mm';
            padding = '8px 10px';
            headerFontSize = '15px';
        } else if (totalRows <= 30) {
            // حالت متوسط
            fontSize = '11px';
            rowHeight = '6mm';
            padding = '5px 8px';
            headerFontSize = '13px';
        } else if (totalRows <= 40) {
            // حالت فشرده
            fontSize = '10px';
            rowHeight = '4.5mm';
            padding = '3px 6px';
            headerFontSize = '12px';
        } else if (totalRows <= 50) {
            // حالت خیلی فشرده
            fontSize = '9px';
            rowHeight = '3.5mm';
            padding = '2px 5px';
            headerFontSize = '11px';
        } else {
            // حالت فوق فشرده - استفاده از scale
            fontSize = '8px';
            rowHeight = '3mm';
            padding = '2px 4px';
            headerFontSize = '10px';
        }

        return { fontSize, rowHeight, padding, headerFontSize };
    };

    /**
     * فرمت عدد فارسی
     */
    const formatNumber = (value) => {
        if (value === null || value === undefined) return '0';
        return Number(value).toLocaleString('fa-IR');
    };

    /**
     * ساخت ردیف‌های جدول HTML
     */
    const buildPrintTableRows = (items, styles) => {
        const work = items['کارکرد'] || [];
        const benefit = items['مزایا'] || [];
        const deduction = items['کسورات'] || [];
        const maxRows = Math.max(work.length, benefit.length, deduction.length);

        let html = '';
        for (let i = 0; i < maxRows; i++) {
            html += `<tr style="height: ${styles.rowHeight};">`;
            html += `<td class="col-work" style="padding: ${styles.padding}; font-size: ${styles.fontSize};">`;
            if (work[i]) {
                html += `<div class="item-row"><span>${work[i].title}</span><span>${formatNumber(work[i].amount)}</span></div>`;
            }
            html += '</td>';
            html += `<td class="col-benefit" style="padding: ${styles.padding}; font-size: ${styles.fontSize};">`;
            if (benefit[i]) {
                html += `<div class="item-row"><span>${benefit[i].title}</span><span>${formatNumber(benefit[i].amount)}</span></div>`;
            }
            html += '</td>';
            html += `<td class="col-deduction" style="padding: ${styles.padding}; font-size: ${styles.fontSize};">`;
            if (deduction[i]) {
                html += `<div class="item-row"><span>${deduction[i].title}</span><span>${formatNumber(deduction[i].amount)}</span></div>`;
            }
            html += '</td>';
            html += '</tr>';
        }
        return html;
    };

    /**
     * تابع اصلی چاپ فیش حقوقی
     */
    const printPayslip = (payslipData) => {
        if (!payslipData) return;

        // محاسبه تعداد کل ردیف‌ها
        const workCount = (payslipData.items['کارکرد'] || []).length;
        const benefitCount = (payslipData.items['مزایا'] || []).length;
        const deductionCount = (payslipData.items['کسورات'] || []).length;
        const maxRows = Math.max(workCount, benefitCount, deductionCount);

        // محاسبه استایل بهینه
        const styles = calculatePrintStyles(maxRows);

        // محاسبه scale برای موارد خیلی بزرگ
        const needsScale = maxRows > 50;
        const scaleValue = needsScale ? Math.max(0.7, 50 / maxRows) : 1;
        //import logoUrl from '@/images/logo-gahrtarabar.png';
        const companyLogoUrl = 'http://127.0.0.1:8000/storage/logo-gahrtarabar.png';
        const companyName = 'شرکت حمل و نقل ترکیبی مواد معدنی گهر ترابر سیرجان (سهامی عام)';

        const htmlContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>فیش حقوقی - ${payslipData.employee_name}</title>
                <style>
                    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
                    
                    @page {
                        size: A4;
                        margin: 8mm;
                    }
                    
                    * {
                        font-family: 'Vazirmatn', Tahoma, sans-serif;
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    
                    body {
                        direction: rtl;
                        font-size: ${styles.fontSize};
                        color: #000;
                        ${needsScale ? `transform: scale(${scaleValue}); transform-origin: top right; width: ${100/scaleValue}%;` : ''}
                    }
                    
                    .print-container {
                        width: 100%;
                        max-width: 195mm;
                        margin: 0 auto;
                    }
                    
                    .print-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 8px;
                        margin-bottom: 10px;
                    }
                    
                    .company-logo {
                        width: 60px;
                        height: 60px;
                        object-fit: contain;
                    }
                    
                    .company-info {
                        text-align: center;
                        flex: 1;
                    }
                    
                    .company-name {
                        font-size: ${styles.headerFontSize};
                        font-weight: bold;
                        margin-bottom: 3px;
                    }
                    
                    .payslip-title {
                        font-size: ${styles.fontSize};
                        color: #555;
                    }
                    
                    .employee-info {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 5px;
                        background: #f5f5f5;
                        padding: 8px;
                        border-radius: 3px;
                        margin-bottom: 10px;
                        font-size: ${styles.fontSize};
                    }
                    
                    .employee-info div {
                        display: flex;
                        gap: 4px;
                    }
                    
                    .employee-info .label {
                        font-weight: bold;
                        color: #555;
                    }
                    
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 8px;
                        table-layout: fixed;
                    }
                    
                    .items-table th {
                        background: #2c3e50;
                        color: white;
                        padding: 6px;
                        text-align: center;
                        font-size: ${styles.fontSize};
                        font-weight: bold;
                    }
                    
                    .items-table td {
                        border: 1px solid #ccc;
                        vertical-align: top;
                        overflow: hidden;
                    }
                    
                    .items-table tr:nth-child(even) {
                        background: #fafafa;
                    }
                    
                    .item-row {
                        display: flex;
                        justify-content: space-between;
                        gap: 5px;
                    }
                    
                    .col-work { color: #6b21a8; }
                    .col-benefit { color: #15803d; }
                    .col-deduction { color: #b91c1c; }
                    
                    .summary-row td {
                        border: 1px solid #333;
                        padding: 6px 8px;
                        font-weight: bold;
                        font-size: ${styles.fontSize};
                    }
                    
                    .total-benefits { color: #15803d; }
                    .total-deductions { color: #b91c1c; }
                    
                    .net-pay-box {
                        border: 2px solid #1e40af;
                        padding: 8px;
                        text-align: center;
                        font-size: ${styles.fontSize};
                        font-weight: bold;
                        margin-top: 8px;
                        background: #eff6ff;
                    }
                    
                    .print-footer {
                        margin-top: 15px;
                        text-align: left;
                        font-size: 9px;
                        color: #666;
                        border-top: 1px solid #ccc;
                        padding-top: 5px;
                    }
                    
                    @media print {
                        body { 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="print-header">
                        <img src="${companyLogoUrl}" alt="لوگو" class="company-logo" 
                             onerror="this.style.display='none'">
                        <div class="company-info">
                            <div class="company-name">${companyName}</div>
                            <div class="payslip-title">فیش حقوقی - ${payslipData.year_month_label}</div>
                        </div>
                        <div style="width: 60px;"></div>
                    </div>

                    <div class="employee-info">
                        <div><span class="label">کد پرسنلی:</span> ${payslipData.personnel_code}</div>
                        <div><span class="label">نام:</span> ${payslipData.employee_name}</div>
                        <div><span class="label">کد ملی:</span> ${payslipData.national_id}</div>
                        <div><span class="label">نام پدر:</span> ${payslipData.father_name || '-'}</div>
                        <div><span class="label">روزهای کارکرد:</span> ${payslipData.summary.effective_days} روز</div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 33%;">کارکرد</th>
                                <th style="width: 34%;">مزایا</th>
                                <th style="width: 33%;">کسورات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${buildPrintTableRows(payslipData.items, styles)}
                        </tbody>
                        <tfoot>
                            <tr class="summary-row">
                                <td></td>
                                <td class="total-benefits">
                                    <div class="item-row">
                                        <span>جمع مزایا:</span>
                                        <span>${formatNumber(payslipData.summary.total_benefits)}</span>
                                    </div>
                                </td>
                                <td class="total-deductions">
                                    <div class="item-row">
                                        <span>جمع کسورات:</span>
                                        <span>${formatNumber(payslipData.summary.total_deductions)}</span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div class="net-pay-box">
                        خالص پرداختی: ${formatNumber(payslipData.summary.net_pay)} ریال
                    </div>

                    <div class="print-footer">
                        HRM-FO-۲۳-۰ | تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')}
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                            setTimeout(() => window.close(), 300);
                        }, 200);
                    };
                <\/script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return {
        printPayslip,
        calculatePrintStyles,
        formatNumber,
    };
}