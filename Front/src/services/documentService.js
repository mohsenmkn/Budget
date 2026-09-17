// resources/js/services/documentService.js
import api from '@/api/axios'

export const documentService = {
    // لیست اسناد
    list: (params) => api.get('/documents', { params }),

    // نمایش یک سند
    get: (id) => api.get(`/documents/${id}`),

    // آپلود فایل
    upload: (data) => {
        // ✅ استفاده از FormData برای آپلود فایل
        const formData = new FormData()

        // افزودن فایل
        if (data.file) {
            formData.append('file', data.file)
        }

        // افزودن سایر فیلدها
        const fields = ['company_id', 'documentable_type','type', 'documentable_id', 'title', 'category', 'description']
        fields.forEach(field => {
            if (data[field] !== undefined && data[field] !== null) {
                formData.append(field, data[field])
            }
        })

        return api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // دانلود فایل
    download: async (id) => {
        try {
            // دریافت توکن از localStorage
            const token = localStorage.getItem('token')
		
            // استفاده از fetch برای دریافت فایل با هدرهای احراز هویت
            const response = await fetch(`https://apiomrani.gttmco.ir/api/v1/documents/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/octet-stream',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // دریافت نام فایل از هدرها
            const contentDisposition = response.headers.get('content-disposition')
            let filename = 'document'
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/)
                if (filenameMatch) {
                    filename = filenameMatch[1]
                }
            }

            // تبدیل به blob
            const blob = await response.blob()

            // ساخت URL برای دانلود
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()

            // پاکسازی
            setTimeout(() => {
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }, 100)

            return true
        } catch (error) {
            console.error('❌ Download error:', error)

            // اگر fetch failed، از روش جایگزین استفاده کن
            return fallbackDownload(id)
        }
    },


    // حذف سند
    delete: (id) => api.delete(`/documents/${id}`),
}