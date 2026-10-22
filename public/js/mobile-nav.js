// Mobile burger menu (<details class="mobile-nav">): close on outside tap,
// on Escape, on any link tap, and when the viewport grows past the phone
// breakpoint. Without this the drawer stays open and covers the page.
(() => {
    const nav = document.querySelector('details.mobile-nav');
    if (!nav) return;

    const close = () => {
        nav.open = false;
    };

    // Outside tap (pointerdown so it fires before the link navigation).
    document.addEventListener('pointerdown', (e) => {
        if (nav.open && !nav.contains(e.target)) close();
    }, true);

    // Any menu link closes the drawer.
    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.open) {
            close();
            const summary = nav.querySelector('summary');
            if (summary) summary.focus();
        }
    });

    // Desktop resize: the drawer is display:none there, but `<details>` would
    // still report open if the user rotates back.
    const desktop = window.matchMedia('(min-width: 641px)');
    const sync = () => { if (desktop.matches) close(); };
    if (desktop.addEventListener) desktop.addEventListener('change', sync);
    else if (desktop.addListener) desktop.addListener(sync);
})();
