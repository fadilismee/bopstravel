/**
 * Bop's Travel - Universal Responsive Guardian & Anti-Overlap Engine
 * Memastikan tampilan web selalu rapi, proporsional, dan bebas tumpang tindih (overlap)
 * di semua ukuran layar (Mobile 320px, Tablet 768px-1024px, Desktop, hingga Ultrawide 4K).
 */
(() => {
    'use strict';

    const enforceResponsiveHarmony = () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

        // 1. Ensure natural vertical scrolling is never locked by inline overflow or height
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.overflowX = 'clip';
        document.body.style.overflowY = 'visible';
        document.body.style.overflowX = 'clip';
        document.body.style.height = 'auto';
        document.body.style.position = 'static';
        document.body.style.touchAction = 'pan-y pinch-zoom';

        // 2. Safeguard Hero Banner & Booking Card Stack
        const hero = document.getElementById('hero-banner');
        if (hero) {
            hero.style.overflow = 'visible';
            hero.style.overflowY = 'visible';
            hero.style.overflowX = 'clip';
            if (hero.style.height && hero.style.height !== 'auto') {
                hero.style.height = 'auto';
            }
        }

        const heroRotator = document.getElementById('hero-rotator');
        if (heroRotator) {
            heroRotator.style.pointerEvents = 'none';
        }

        // 3. Prevent Table / Grid Overflow on ultra-narrow screens (< 360px)
        const grids = document.querySelectorAll('.grid, .flex');
        grids.forEach(el => {
            if (el.scrollWidth > el.clientWidth && vw < 480) {
                el.style.maxWidth = '100%';
            }
        });
    };

    // Jalankan saat DOM siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enforceResponsiveHarmony);
    } else {
        enforceResponsiveHarmony();
    }

    // Debounced Resize Listener untuk efisiensi CPU dan bebas jank
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(enforceResponsiveHarmony, 100);
    }, { passive: true });
})();
