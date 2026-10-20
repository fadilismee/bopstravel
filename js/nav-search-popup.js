// Navbar search popup: collapsed to a 44px/36px icon button; a tap expands it
// into a popup input (or overlay on mobile). Closes on Esc, close button, outside tap, or blur when empty.
// Normal form submit (Enter) still goes to /rute?q=...
(() => {
    const form = document.querySelector('.topbar form.nav-search');
    if (!form) return;
    const input = form.querySelector('input');
    const closeBtn = form.querySelector('.nav-search-close');

    const openSearch = () => {
        form.classList.add('is-open');
        if (input) {
            input.focus();
            if (input.value) input.select();
        }
    };

    const closeSearch = () => {
        form.classList.remove('is-open');
        if (input) input.blur();
    };

    form.addEventListener('click', (e) => {
        if (closeBtn && (e.target === closeBtn || closeBtn.contains(e.target))) {
            e.preventDefault();
            e.stopPropagation();
            if (input) input.value = '';
            closeSearch();
            return;
        }
        if (!form.classList.contains('is-open')) {
            e.preventDefault();
            openSearch();
        }
    });

    form.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && form.classList.contains('is-open')) {
            e.preventDefault();
            closeSearch();
        }
    });

    document.addEventListener('click', (e) => {
        if (form.classList.contains('is-open') && !form.contains(e.target)) {
            closeSearch();
        }
    });

    if (input) {
        input.addEventListener('blur', () => {
            if (!input.value) {
                window.setTimeout(() => {
                    if (document.activeElement !== input) closeSearch();
                }, 150);
            }
        });
    }
})();
