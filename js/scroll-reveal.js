// Smooth reveal-on-scroll for cards across the home page.
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    const els = document.querySelectorAll(
        '.reference-home #slots a, .reference-home .fleet-card, ' +
        '.reference-home .armada-cards .card, .reference-home [class*="payment-card-shadow"]'
    );
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
    }, { threshold: 0.1 });

    els.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
})();
