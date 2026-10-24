// Galeri Kami — Infinite marquee (kanan → kiri, loop seamless tanpa jeda)
// Teknik: clone semua slide lalu geser track selembar setengahnya (50%) secara berulang.
(() => {
    const initGalleryCarousel = () => {
        const carousel = document.querySelector('.galeri-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.galeri-track');
        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.galeri-slide'));
        if (slides.length === 0) return;

        // Clone setiap slide agar akhir menyatu halus dengan awal (seamless loop)
        slides.forEach((slide) => {
            track.appendChild(slide.cloneNode(true));
        });

        const originalCount = slides.length;
        let step = 0;
        let pos = 0;
        let rafId = null;
        let paused = false;

        const measure = () => {
            const first = slides[0];
            // gap-4 = 1rem (16px); gabungkan lebar slide + gap agar pergeseran selembar utuh
            step = first ? first.offsetWidth + 16 : 296;
        };

        const loop = () => {
            if (!paused) {
                pos -= 0.35; // kecepatan pergeseran (px per frame)
                if (pos <= -step * originalCount) {
                    pos = 0; // reset ke awal — terlihat seamless karena slide duplikat identik
                }
                track.style.transform = `translateX(${pos}px)`;
            }
            rafId = requestAnimationFrame(loop);
        };

        measure();
        window.addEventListener('resize', measure, { passive: true });

        track.style.willChange = 'transform';
        track.style.display = 'flex';

        loop();

        // Optional: hentikan sementara saat interaksi (klik / kursor di atas) agar nyaman dilihat
        carousel.addEventListener('mouseenter', () => { paused = true; }, { passive: true });
        carousel.addEventListener('mouseleave', () => { paused = false; }, { passive: true });
        track.addEventListener('pointerdown', () => { paused = true; }, { passive: true });
        track.addEventListener('pointerup', () => { paused = false; }, { passive: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleryCarousel);
    } else {
        initGalleryCarousel();
    }
})();
