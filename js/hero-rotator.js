// Hero banner rotator: crossfade through local Bob Travel photos every few seconds.
(() => {
    const img = document.getElementById('hero-rotator');
    if (!img) return;

    const photos = [
        '/images/hero-bus.jpg',
        '/images/hero-minibus.jpg',
        '/images/hero-malioboro.jpg',
        '/images/hero-borobudur.jpg',
    ];

    // Preload so swaps never flash blank.
    photos.forEach((src) => { const pre = new Image(); pre.src = src; });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let index = 0;
    const swap = () => {
        index = (index + 1) % photos.length;
        img.classList.add('is-fading');
        window.setTimeout(() => {
            img.src = photos[index];
            img.onload = () => img.classList.remove('is-fading');
            // Fallback in case onload already fired from cache.
            window.setTimeout(() => img.classList.remove('is-fading'), 350);
        }, 420);
    };

    let timer = window.setInterval(swap, 5000);
    const host = img.closest('div');
    const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };
    const start = () => { if (!timer) timer = window.setInterval(swap, 5000); };
    if (host) { host.addEventListener('mouseenter', stop); host.addEventListener('mouseleave', start); }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();
