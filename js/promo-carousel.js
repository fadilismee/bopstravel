// Auto-advancing carousel for the "Promo & Info Perjalanan" section.
// 3 slides, ordered, with prev/next arrows and dots — matching the reference UI.
(() => {
    const root = document.querySelector('.promo-carousel');
    if (!root) return;
    const track = root.querySelector('.carousel__track');
    const slides = root.querySelectorAll('.carousel__slide');
    if (!track || slides.length < 2) return;

    const posters = [
        {
            image: '/images/hero-bops-pool.webp',
            eyebrow: 'TRAVEL REGULER',
            title: 'Wonosari ↔ Jakarta',
            detail: 'Jemput ke lokasi atau titik temu',
            action: 'Tanya jadwal',
            href: 'https://wa.me/6281904221015?text=Halo%20Bop%27s%20Travel%2C%20saya%20ingin%20tanya%20travel%20Wonosari%20-%20Jakarta.'
        },
        {
            image: '/images/hero-bops-premio.webp',
            eyebrow: 'CARTER HIACE',
            title: 'Perjalanan rombongan',
            detail: 'Wonosari–Jakarta mulai Rp3,5 juta',
            action: 'Tanya carter',
            href: 'https://wa.me/6281904221015?text=Halo%20Bop%27s%20Travel%2C%20saya%20ingin%20tanya%20carter%20Hiace.'
        },
        {
            image: '/images/hero-bops-safety.webp',
            eyebrow: 'RUTE DUA ARAH',
            title: 'Magelang & Semarang ↔ Jakarta',
            detail: 'Tanyakan jadwal dan tarif terbaru ke admin',
            action: 'Lihat rute',
            href: 'rute.html'
        }
    ];

    slides.forEach((slide, i) => {
        const poster = posters[i];
        if (!poster) return;
        slide.innerHTML = `<article class="promo-poster">
            <img src="${poster.image}" alt="" aria-hidden="true" loading="lazy">
            <div class="promo-poster__content">
                <span class="promo-poster__eyebrow">BOP'S TRAVEL · ${poster.eyebrow}</span>
                <strong>${poster.title}</strong>
                <span class="promo-poster__detail">${poster.detail}</span>
                <a href="${poster.href}" ${poster.href.startsWith('https:') ? 'target="_blank" rel="noopener"' : ''} class="promo-poster__action">${poster.action} <span aria-hidden="true">↗</span></a>
            </div>
        </article>`;
    });

    const intro = root.parentElement?.parentElement;
    const introText = intro?.querySelector('p');
    if (introText) {
        introText.textContent = 'Lihat pilihan travel reguler, carter Hiace, dan rute terbaru. Jadwal serta tarif dapat ditanyakan langsung lewat WhatsApp.';
    }

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
