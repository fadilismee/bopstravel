// Navbar search popup: collapsed to a 44px icon button; a tap expands it
// into a popup input. Closes on Esc, on outside tap, or on blur when empty.
// Normal form submit (Enter) still goes to /rute?q=...
(() => {
    const form = document.querySelector('.topbar form.nav-search');
    if (!form) return;
    const input = form.querySelector('input');

    form.addEventListener('click', (e) => {
        if (!form.classList.contains('is-open')) {
            e.preventDefault();
            form.classList.add('is-open');
            if (input) input.focus();
        }
    });
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && form.classList.contains('is-open')) {
            form.classList.remove('is-open');
            if (input) input.blur();
            form.focus({ preventScroll: true });
        }
    });
    document.addEventListener('click', (e) => {
        if (form.classList.contains('is-open') && !form.contains(e.target) && !(input && input.value)) {
            form.classList.remove('is-open');
        }
    });
    if (input) input.addEventListener('blur', () => {
        if (!input.value) {
            window.setTimeout(() => {
                if (document.activeElement !== input) form.classList.remove('is-open');
            }, 150);
        }
    });
})();
