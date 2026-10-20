// Auto-slide carousel for the "Beragam Pilihan Armada" section.
// Two banner photos from armadatransjava.com, cross-fading every few seconds.
(() => {
    const root = document.querySelector('.armada-carousel');
    if (!root) return;
    const track = root.querySelector('.carousel__track');
    const slides = root.querySelectorAll('.carousel__slide');
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const go = (i) => {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
    };
    const next = () => go(index + 1);

    const start = () => {
        if (reduce) return;
        stop();
        timer = window.setInterval(next, 4000);
    };
    const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };

    // Pause while the tab is hidden or the carousel is hovered/focused.
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
        else if (dragDX >= 40) go(index - 1);
        else go(index);
        start();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    go(0);
    start();
})();