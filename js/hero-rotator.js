// Hero banner rotator: smooth crossfade through Bop's Travel photos
(() => {
    'use strict';
    const img = document.getElementById('hero-rotator');
    if (!img) return;

    const photos = [
        '/images/hero-bus.webp',
        '/images/hero-minibus.webp',
        '/images/hero-malioboro.webp',
        '/images/hero-borobudur.webp',
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let index = 0;
    let timer = null;
    const ROTATION_INTERVAL = 8500; // 8.5s for calm, premium pacing

    const preloadNext = (idx) => {
        const nextSrc = photos[idx];
        if (nextSrc) {
            const pre = new Image();
            pre.src = nextSrc;
        }
    };

    const swap = () => {
        index = (index + 1) % photos.length;
        img.classList.add('is-fading');
        window.setTimeout(() => {
            img.src = photos[index];
            img.onload = () => img.classList.remove('is-fading');
            // Fallback in case onload already fired from cache
            window.setTimeout(() => img.classList.remove('is-fading'), 350);
            // Preload the one after this
            preloadNext((index + 1) % photos.length);
        }, 420);
    };

    const stop = () => {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    };

    const start = () => {
        if (!timer) {
            timer = window.setInterval(swap, ROTATION_INTERVAL);
        }
    };

    // Defer start and first preload until page is idle so LCP is pure & unthrottled
    const init = () => {
        preloadNext(1);
        start();
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setTimeout(init, 3000), { timeout: 6000 });
    } else {
        setTimeout(init, 4000);
    }

    const host = img.closest('div');
    if (host) {
        host.addEventListener('mouseenter', stop, { passive: true });
        host.addEventListener('mouseleave', start, { passive: true });
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();
