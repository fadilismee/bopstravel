// Fleet showcase slider for "Pilihan Armada Untuk Kamu".
// 6 cards visible on desktop (3 tablet, 2 mobile); advances one card at a time, looping.
(() => {
    const root = document.querySelector('.fleet-showcase');
    if (!root) return;
    const track = root.querySelector('.fleet-track');
    const cards = root.querySelectorAll('.fleet-track .fleet-card');
    const dotsWrap = root.querySelector('.fleet-dots');
    if (!track || cards.length < 2) return;

    const visible = () => {
        if (window.innerWidth < 640) return 2;
        if (window.innerWidth < 1024) return 3;
        return 6;
    };
    const maxIndex = () => Math.max(0, cards.length - visible());

    let index = 0;
    let timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = [];

    if (dotsWrap) {
        const count = maxIndex() + 1;
        for (let i = 0; i < count; i += 1) {
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
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        const step = card.getBoundingClientRect().width + gap;
        const safe = Math.min(index, maxIndex());
        index = safe;
        track.style.transform = `translateX(-${safe * step}px)`;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === safe));
    };

    const go = (i) => {
        const max = maxIndex();
        index = i > max ? 0 : (i < 0 ? max : i);
        paint();
    };
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
    const viewport = root.querySelector('.fleet-track-wrap') || root;
    viewport.style.touchAction = 'pan-y';
    track.querySelectorAll('img').forEach((img) => { img.draggable = false; });
    track.style.cursor = 'grab';
    const dragStep = () => {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return cards[0].getBoundingClientRect().width + gap;
    };
    let dragX = null;
    let dragDX = 0;
    let dragBase = 0;
    track.addEventListener('pointerdown', (e) => {
        dragX = e.clientX;
        dragDX = 0;
        dragBase = -(Math.min(index, maxIndex()) * dragStep());
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
