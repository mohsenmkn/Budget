// resources/js/Modules/Library/Services/libraryApi.js
import axios from '@/api/axios.js';

export const libraryApi = {
    // ═══════ کتاب‌ها ═══════
    getBooks(filters = {}) {
        return axios.get('/library/books', { params: filters });
    },

    getBook(id) {
        return axios.get(`/library/books/${id}`);
    },

    getCategories() {
        return axios.get('/library/categories');
    },

    // ═══════ رزروها ═══════
    getMyReservations(status = null) {
        return axios.get('/library/my-reservations', {
            params: status ? { status } : {},
        });
    },

    createReservation(data) {
        return axios.post('/library/reservations', data);
    },

    cancelReservation(id) {
        return axios.put(`/library/reservations/${id}/cancel`);
    },

    // ═══════ اعلان‌ها ═══════
    getMyNotifications(unreadOnly = false) {
        return axios.get('/library/my-notifications', {
            params: { unread: unreadOnly ? 1 : 0 },
        });
    },

    markAsRead(id) {
        return axios.put(`/library/my-notifications/${id}/read`);
    },

    markAllAsRead() {
        return axios.put('/library/my-notifications/read-all');
    },
};