// resources/js/Composables/useMobileOptimization.js

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useMobileOptimization() {
    const route = useRoute();
    const router = useRouter();

    const windowWidth = ref(window.innerWidth);
    const windowHeight = ref(window.innerHeight);
    const isMobile = computed(() => windowWidth.value <= 1024);
    const isTablet = computed(() => windowWidth.value > 768 && windowWidth.value <= 1024);
    const isPhone = computed(() => windowWidth.value <= 768);
    const isSmallPhone = computed(() => windowWidth.value <= 480);

    // Safe area insets (برای notch و home indicator)
    const safeArea = ref({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    // تشخیص جهت دستگاه
    const orientation = ref('portrait');

    // بررسی capability های دستگاه
    const capabilities = ref({
        hasHaptic: 'vibrate' in navigator,
        hasTouch: 'ontouchstart' in window,
        hasStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isPWA: window.navigator.standalone === true,
    });

    // به‌روزرسانی ابعاد
    const updateDimensions = () => {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
        orientation.value = windowHeight.value > windowWidth.value ? 'portrait' : 'landscape';
    };

    // محاسبه safe area
    const updateSafeArea = () => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        safeArea.value = {
            top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
            right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
            bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
            left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
        };
    };

    // Lock body scroll (وقتی منو باز است)
    const lockBodyScroll = () => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
    };

    const unlockBodyScroll = () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    };

    // مدیریت back button در موبایل
    const handleBackButton = () => {
        if (!isMobile.value) return;

        // اگر منو باز است، ببند
        const sidebarOpen = document.querySelector('.sidebar.is-open');
        if (sidebarOpen) {
            window.dispatchEvent(new CustomEvent('close-sidebar'));
            return;
        }

        // اگر modal باز است، ببند
        const modal = document.querySelector('.modal.active');
        if (modal) {
            window.dispatchEvent(new CustomEvent('close-modal'));
            return;
        }

        // در غیر این صورت، back برو
        if (window.history.length > 1) {
            router.back();
        }
    };

    // جلوگیری از zoom روی input ها در iOS
    const preventZoomOnFocus = () => {
        if (!isMobile.value) return;

        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
            input.addEventListener('focus', () => {
                // تنظیم viewport برای جلوگیری از zoom
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute(
                        'content',
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                }
            });

            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute(
                        'content',
                        'width=device-width, initial-scale=1.0'
                    );
                }
            });
        });
    };

    // Lifecycle
    onMounted(() => {
        window.addEventListener('resize', updateDimensions);
        window.addEventListener('orientationchange', updateDimensions);
        updateSafeArea();
        preventZoomOnFocus();

        // گوش دادن به popstate برای back button
        window.addEventListener('popstate', handleBackButton);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('orientationchange', updateDimensions);
        window.removeEventListener('popstate', handleBackButton);
    });

    return {
        windowWidth,
        windowHeight,
        isMobile,
        isTablet,
        isPhone,
        isSmallPhone,
        safeArea,
        orientation,
        capabilities,
        lockBodyScroll,
        unlockBodyScroll,
    };
}