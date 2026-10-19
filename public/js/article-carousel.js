// Swipeable "Penawaran Spesial & Berita" article carousel.
// Pola sama seperti diskon-carousel.js: desktop 3-up, HP 1 kartu/layar,
// bisa digeser manual (drag mouse + sapuan jari). Layout kartu tidak diubah.
(() => {
    const section = [...document.querySelectorAll('section.carousel-container')]
        .find((s) => s.querySelector('img.blog-img'));
    if (!section) return;
    section.classList.add('article-carousel');
    const track = section.querySelector('.carousel__track');
    const slides = section.querySelectorAll('.carousel__slide');
    if (!track || slides.length < 2) return;

    const viewport = section.querySelector('.carousel__viewport') || section;
    viewport.style.touchAction = 'pan-y';
    track.style.cursor = 'grab';
    track.querySelectorAll('img').forEach((img) => { img.draggable = false; });

    const visible = () => (window.innerWidth < 640 ? 1 : 3);
    const maxIndex = () => Math.max(0, slides.length - visible());
    let index = 0;

    const step = () => {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap) || 0;
        return slides[0].getBoundingClientRect().width + gap;
    };
    const paint = () => {
        index = Math.min(Math.max(0, index), maxIndex());
        track.style.transform = index === 0 ? '' : `translateX(-${index * step()}px)`;
    };
    const go = (i) => { index = i; paint(); };

    let dragX = null;
    let dragDX = 0;
    let dragBase = 0;
    track.addEventListener('pointerdown', (e) => {
        dragX = e.clientX;
        dragDX = 0;
        dragBase = -(index * step());
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', (e) => {
        if (dragX === null) return;
        dragDX = e.clientX - dragX;
        track.style.transform = `translateX(${dragBase + dragDX}px)`;
    });
    const endDrag = () => {
        if (dragX === null) return;
        dragX = null;
        track.style.transition = '';
        track.style.cursor = 'grab';
        if (dragDX <= -40) go(index + 1);
        else if (dragDX >= 40) go(index - 1);
        else paint();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', paint);

    paint();
})();
