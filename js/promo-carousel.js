// Auto-advancing carousel for the "Promo & Info Perjalanan" section.
// 3 slides, ordered, with prev/next arrows and dots — matching the reference UI.
(() => {
    const root = document.querySelector('.promo-carousel');
    if (!root) return;
    const track = root.querySelector('.carousel__track');
    const slides = root.querySelectorAll('.carousel__slide');
    if (!track || slides.length < 2) return;

    const prevBtn = root.querySelector('.custom-nav--prev');
    const nextBtn = root.querySelector('.custom-nav--next');
    const dots = [...root.querySelectorAll('.custom-pagination__btn')];
    let index = 0;
    let timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const paint = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('custom-pagination__btn--active', i === index);
            d.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });
    };
    const go = (i) => { index = (i + slides.length) % slides.length; paint(); };
    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    const start = () => { if (reduce) return; stop(); timer = window.setInterval(next, 5000); };
    const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Manual drag/swipe (mouse + touch): drag moves the slide, release snaps or steps.
    const viewport = root.querySelector('.carousel__viewport') || root;
    viewport.style.touchAction = 'pan-y';
    track.querySelectorAll('img').forEach((img) => { img.draggable = false; });
    track.style.cursor = 'grab';
    let dragX = null;
    let dragDX = 0;
    track.addEventListener('pointerdown', (e) => {
        dragX = e.clientX;
        dragDX = 0;
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
        stop();
    });
    window.addEventListener('pointermove', (e) => {
        if (dragX === null) return;
        dragDX = e.clientX - dragX;
        track.style.transform = `translateX(calc(-${index * 100}% + ${dragDX}px))`;
    });
    const endDrag = () => {
        if (dragX === null) return;
        dragX = null;
        track.style.transition = '';
        track.style.cursor = 'grab';
        if (dragDX <= -40) next();
        else if (dragDX >= 40) prev();
        else paint();
        restart();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    paint();
    start();
})();
