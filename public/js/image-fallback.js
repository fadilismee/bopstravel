(() => {
    const placeholder = (alt = '') => {
        const label = alt.trim() ? alt.trim().slice(0, 48) : 'Gambar belum tersedia';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#f4f7fa"/><stop offset="1" stop-color="#e7eef5"/></linearGradient></defs><rect width="640" height="360" fill="url(#bg)"/><g fill="none" stroke="#9aafc1" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="254" y="92" width="132" height="112" rx="14"/><circle cx="294" cy="130" r="12"/><path d="m266 187 38-39 26 25 20-20 24 34"/></g><text x="320" y="255" text-anchor="middle" fill="#60778b" font-family="Arial,sans-serif" font-size="18">${label.replace(/[&<>"']/g, '')}</text></svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    document.querySelectorAll('.reference-home img').forEach((image) => {
        const applyFallback = () => {
            if (image.dataset.fallbackApplied) return;
            image.dataset.fallbackApplied = 'true';
            image.removeAttribute('srcset');
            image.removeAttribute('data-nuxt-img');
            image.src = placeholder(image.alt);
            image.classList.add('image-fallback');
        };
        image.addEventListener('error', applyFallback, { once: true });
        // Only probe real (http) sources for the "broken image" heuristic. Inline SVG
        // data URIs can report complete/naturalWidth 0 before decode and must not be
        // replaced — they never 404, so the error listener above is enough.
        if (!image.src.startsWith('data:') && image.complete && image.naturalWidth === 0) applyFallback();
    });
})();
