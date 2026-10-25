// Swipeable + auto-advancing route highlight carousel.
// Desktop: 3-up; HP: 1 card per layar. Bisa digeser manual (drag mouse +
// sapuan jari) DAN bergeser otomatis tiap 4,5 detik (jeda saat disentuh,
// di-hover, atau difokus; hormati prefers-reduced-motion).
(() => {
    const section = document.querySelector('section.carousel-container.no-slide');
    if (!section) return;
    const track = section.querySelector('.carousel__track');
    if (!track) return;
    const routes = [
        { city: 'Wonosari', detail: 'Gunungkidul', photo: '/images/armada/9.webp' },
        { city: 'Magelang', detail: 'Jawa Tengah', photo: '/images/armada/8.webp' },
        { city: 'Semarang', detail: 'Jawa Tengah', photo: '/images/armada/11.webp' },
    ];
    section.querySelectorAll('.carousel__slide').forEach((slide, i) => {
        const route = routes[i];
        if (!route) return;
        const message = encodeURIComponent(`Halo Bop's Travel, saya ingin tanya perjalanan ${route.city} - Jakarta.`);
        slide.innerHTML = `<article class="route-highlight">
            <img class="route-highlight__photo" src="${route.photo}" alt="Armada Bop's Travel" loading="lazy">
            <div class="route-highlight__body">
                <span class="route-highlight__eyebrow">BOP'S TRAVEL · RUTE DUA ARAH</span>
                <strong>${route.city} ↔ Jakarta</strong>
                <span>${route.detail} · Jadwal dan tarif via WhatsApp</span>
                <a href="https://wa.me/6281904221015?text=${message}" target="_blank" rel="noopener">Tanya rute <span aria-hidden="true">↗</span></a>
            </div>
        </article>`;
    });
    // Clone-loop: section hanya punya 3 slide sementara desktop tampil 3-up
    // (maxIndex 0 -> auto tidak bisa gerak, T1 selalu ""). Gandakan isi track
    // agar slides.length > visible, lalu bungkus 0..max seperti biasa.
    let slides = section.querySelectorAll('.carousel__slide');
    if (slides.length < 2) return;
    if (slides.length <= 3) {
        [...slides].forEach((s) => {
            const c = s.cloneNode(true);
            c.removeAttribute('id');
            c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
            track.appendChild(c);
        });
        slides = section.querySelectorAll('.carousel__slide');
    }

    const viewport = section.querySelector('.carousel__viewport') || section;
    viewport.style.touchAction = 'pan-y';
    track.style.cursor = 'grab';
    track.querySelectorAll('img').forEach((img) => { img.draggable = false; });

    const visible = () => (window.innerWidth < 640 ? 1 : 3);
    const maxIndex = () => Math.max(0, slides.length - visible());
    let index = 0;
    let timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const step = () => {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap) || 0;
        return slides[0].getBoundingClientRect().width + gap;
    };
    const paint = () => {
        index = Math.min(Math.max(0, index), maxIndex());
        track.style.transform = index === 0 ? '' : `translateX(-${index * step()}px)`;
    };
    const go = (i) => {
        const max = maxIndex();
        index = i > max ? 0 : (i < 0 ? max : i);
        paint();
    };
    const next = () => go(index + 1);

    const start = () => { if (reduce) return; stop(); timer = window.setInterval(next, 4500); };
    const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', start);

    let dragX = null;
    let dragDX = 0;
    let dragBase = 0;
    track.addEventListener('pointerdown', (e) => {
        dragX = e.clientX;
        dragDX = 0;
        dragBase = -(index * step());
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
    window.addEventListener('resize', paint);

    paint();
    start();
})();
