// Galeri Kami Carousel Controller
(() => {
    const initGalleryCarousel = () => {
        const carousel = document.querySelector('.galeri-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.galeri-track');
        const slides = carousel.querySelectorAll('.galeri-slide');
        const prevBtn = carousel.querySelector('.galeri-nav-prev');
        const nextBtn = carousel.querySelector('.galeri-nav-next');
        const dotsWrap = carousel.querySelector('.galeri-dots');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const total = slides.length;

        // Create dots if not present
        if (dotsWrap && dotsWrap.children.length === 0) {
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `galeri-dot ${i === 0 ? 'is-active' : ''}`;
                dot.setAttribute('aria-label', `Foto ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        const updateDots = () => {
            if (!dotsWrap) return;
            const dots = dotsWrap.querySelectorAll('.galeri-dot');
            dots.forEach((d, i) => {
                d.classList.toggle('is-active', i === currentIndex);
            });
        };

        const getScrollStep = () => {
            const first = slides[0];
            return first ? first.offsetWidth + 16 : 280;
        };

        const goTo = (index) => {
            currentIndex = Math.max(0, Math.min(index, total - 1));
            const step = getScrollStep();
            track.scrollTo({
                left: currentIndex * step,
                behavior: 'smooth'
            });
            updateDots();
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goTo(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goTo(currentIndex + 1);
            });
        }

        // Sync currentIndex on manual scroll
        let scrollTimer = null;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const step = getScrollStep();
                const newIdx = Math.round(track.scrollLeft / step);
                if (newIdx !== currentIndex) {
                    currentIndex = Math.max(0, Math.min(newIdx, total - 1));
                    updateDots();
                }
            }, 80);
        }, { passive: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleryCarousel);
    } else {
        initGalleryCarousel();
    }
})();
