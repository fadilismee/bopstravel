// Navbar pill: hidden while the hero banner is on screen, slides in on scroll.
// Only applies on pages with #hero-banner; other pages keep the bar visible.
(() => {
    const bar = document.querySelector('.topbar');
    if (!bar) return;
    const hero = document.getElementById('hero-banner');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let hidden = null;
    const paint = (past) => {
        const hide = !past;
        if (hide === hidden) return;
        hidden = hide;
        bar.classList.toggle('is-hidden', hide);
    };
    const onScroll = () => paint(window.scrollY > Math.max(0, hero.offsetHeight - 140));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
})();
