// Auto-advancing vehicle card slider for the "Beragam Pilihan Armada" section.
// 2 large cards visible; advances one card at a time, looping, using the minibus
// photos from the Bob Travel fleet gallery.
(() => {
    const root = document.querySelector('.armada-cards');
    if (!root) return;
    const track = root.querySelector('.cards-track');
    const cards = root.querySelectorAll('.cards-track .card');
    const dotsWrap = root.querySelector('.cards-dots');
    if (!track || cards.length < 2) return;

    const visible = 2;
    const maxIndex = Math.max(0, cards.length - visible);
    let index = 0;
    let timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dots = [];
    if (dotsWrap) {
        for (let i = 0; i <= maxIndex; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', `Tampilkan armada ${i + 1}`);
            b.addEventListener('click', () => { go(i); restart(); });
            dotsWrap.appendChild(b);
            dots.push(b);
        }
    }

    const paint = () => {
        const card = cards[0];
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
        const step = card.getBoundingClientRect().width + gap;
        track.style.transform = `translateX(-${index * step}px)`;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    };
    const go = (i) => { index = i > maxIndex ? 0 : (i < 0 ? maxIndex : i); paint(); };
    const next = () => go(index + 1);

    const start = () => { if (reduce) return; stop(); timer = window.setInterval(next, 4000); };
    const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    window.addEventListener('resize', paint);

    // Manual drag/swipe (mouse + touch): drag moves the track, release snaps or steps.
    root.style.touchAction = 'pan-y';
    track.querySelectorAll('img').forEach((img) => { img.draggable = false; });
    track.style.cursor = 'grab';
    const dragStep = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
        return cards[0].getBoundingClientRect().width + gap;
    };
    let dragX = null;
    let dragDX = 0;
    let dragBase = 0;
    track.addEventListener('pointerdown', (e) => {
        dragX = e.clientX;
        dragDX = 0;
        dragBase = -(index * dragStep());
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
        stop();
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
        if (dragDX <= -40) next();
        else if (dragDX >= 40) go(index - 1);
        else paint();
        restart();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    go(0);
    start();
})();