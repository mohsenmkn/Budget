// resources/js/Modules/Library/Services/libraryAdminApi.js
import axios from '@/api/axios.js';

export const libraryAdminApi = {
    // ═══════ آمار ═══════
    getStatistics() {
        return axios.get('/library/admin/statistics');
    },

    // ═══════ کتاب‌ها ═══════
    getBooks(filters = {}) {
        return axios.get('/library/books', { params: filters });
    },

    createBook(formData) {
        return axios.post('/library/admin/books', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateBook(id, formData) {
        formData.append('_method', 'PUT');
        return axios.post(`/library/admin/books/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteBook(id) {
        return axios.delete(`/library/admin/books/${id}`);
    },

    // ═══════ نسخه‌ها ═══════
    addCopy(bookId, data) {
        return axios.post(`/library/admin/books/${bookId}/copies`, data);
    },

    updateCopy(copyId, data) {
        return axios.put(`/library/admin/copies/${copyId}`, data);
    },

    deleteCopy(copyId) {
        return axios.delete(`/library/admin/copies/${copyId}`);
    },

    // ═══════ دسته‌بندی‌ها ═══════
    createCategory(data) {
        return axios.post('/library/admin/categories', data);
    },

    updateCategory(id, data) {
        return axios.put(`/library/admin/categories/${id}`, data);
    },

    deleteCategory(id) {
        return axios.delete(`/library/admin/categories/${id}`);
    },

    // ═══════ رزروها ═══════
    getReservations(filters = {}) {
        return axios.get('/library/admin/reservations', { params: filters });
    },

    approveReservation(id) {
        return axios.put(`/library/admin/reservations/${id}/approve`);
    },

    rejectReservation(id) {
        return axios.put(`/library/admin/reservations/${id}/reject`);
    },

    pickupReservation(id) {
        return axios.put(`/library/admin/reservations/${id}/pickup`);
    },

    returnReservation(id) {
        return axios.put(`/library/admin/reservations/${id}/return`);
    },
};