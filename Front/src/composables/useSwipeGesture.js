// resources/js/Composables/useSwipeGesture.js

import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable برای تشخیص swipe gesture
 * @param {Object} options
 * @param {number} options.threshold - حداقل فاصله برای تشخیص swipe (px)
 * @param {number} options.restraint - حداکثر فاصله عمودی مجاز (px)
 * @param {number} options.maxDuration - حداکثر زمان برای swipe (ms)
 * @param {string} options.edge - ناحیه شروع swipe: 'left' | 'right' | 'both' | 'none'
 * @param {number} options.edgeWidth - عرض ناحیه edge (px)
 */
export function useSwipeGesture(options = {}) {
    const {
        threshold = 60,
        restraint = 100,
        maxDuration = 500,
        edge = 'right', // در RTL، swipe از راست برای باز کردن
        edgeWidth = 30,
    } = options;

    const isSwiping = ref(false);
    const swipeDirection = ref(null);
    const swipeDistance = ref(0);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isTracking = false;

    const callbacks = {
        onSwipeStart: null,
        onSwipeMove: null,
        onSwipeEnd: null,
        onSwipeLeft: null,
        onSwipeRight: null,
    };

    // بررسی اینکه آیا touch در ناحیه edge شروع شده
    const isEdgeTouch = (x) => {
        const windowWidth = window.innerWidth;
        if (edge === 'none') return true;
        if (edge === 'both') return true;
        if (edge === 'right') return x >= windowWidth - edgeWidth;
        if (edge === 'left') return x <= edgeWidth;
        return true;
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();

        // فقط اگر از edge شروع شده باشد
        if (edge !== 'none' && !isEdgeTouch(touchStartX)) {
            isTracking = false;
            return;
        }

        isTracking = true;
        isSwiping.value = false;
        swipeDirection.value = null;
        swipeDistance.value = 0;

        callbacks.onSwipeStart?.({ x: touchStartX, y: touchStartY });
    };

    const handleTouchMove = (e) => {
        if (!isTracking) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // اگر حرکت عمودی بیشتر از افقی باشد، swipe نیست
        if (absDeltaY > restraint && absDeltaY > absDeltaX) {
            isTracking = false;
            isSwiping.value = false;
            return;
        }

        // اگر از threshold بیشتر شد، swipe شروع شده
        if (absDeltaX > 10) {
            isSwiping.value = true;
            swipeDirection.value = deltaX > 0 ? 'right' : 'left';
            swipeDistance.value = absDeltaX;

            callbacks.onSwipeMove?.({
                direction: swipeDirection.value,
                distance: absDeltaX,
                x: touch.clientX,
                y: touch.clientY,
            });
        }
    };

    const handleTouchEnd = (e) => {
        if (!isTracking) {
            resetState();
            return;
        }

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const duration = Date.now() - touchStartTime;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const velocity = absDeltaX / duration; // px/ms

        // تشخیص swipe موفق
        const isSuccessfulSwipe =
            isSwiping.value &&
            absDeltaX >= threshold &&
            absDeltaY <= restraint &&
            duration <= maxDuration;

        // یا swipe سریع (velocity بالا)
        const isFastSwipe = velocity > 0.5 && absDeltaX > 30;

        if (isSuccessfulSwipe || isFastSwipe) {
            const direction = deltaX > 0 ? 'right' : 'left';

            if (direction === 'left') {
                callbacks.onSwipeLeft?.({ distance: absDeltaX, velocity });
            } else {
                callbacks.onSwipeRight?.({ distance: absDeltaX, velocity });
            }

            // Haptic feedback (اگر پشتیبانی شود)
            triggerHaptic('light');
        }

        callbacks.onSwipeEnd?.({
            success: isSuccessfulSwipe || isFastSwipe,
            direction: deltaX > 0 ? 'right' : 'left',
            distance: absDeltaX,
            velocity,
        });

        resetState();
    };

    const resetState = () => {
        isTracking = false;
        isSwiping.value = false;
        swipeDirection.value = null;
        swipeDistance.value = 0;
    };

    // Haptic feedback
    const triggerHaptic = (style = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [50, 50, 50],
            };
            navigator.vibrate(patterns[style] || [10]);
        }
    };

    // ثبت callback ها
    const on = (events) => {
        Object.assign(callbacks, events);
    };

    // شروع گوش دادن به events
    const start = (element = document) => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
    };

    // توقف گوش دادن
    const stop = (element = document) => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
    };

    return {
        isSwiping,
        swipeDirection,
        swipeDistance,
        on,
        start,
        stop,
        triggerHaptic,
    };
}