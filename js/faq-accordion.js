// FAQ accordion: question rows expand to reveal answers, plus rotates.
(() => {
    const items = [...document.querySelectorAll('.faq-item')];
    if (!items.length) return;

    const setItem = (item, open) => {
        item.classList.toggle('open', open);
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.hidden = !open;
        const head = item.querySelector('.faq-toggle');
        if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    items.forEach((item) => {
        const head = item.querySelector('.faq-toggle');
        if (!head) return;
        head.setAttribute('role', 'button');
        head.setAttribute('tabindex', '0');
        const toggle = () => {
            const willOpen = !item.classList.contains('open');
            if (willOpen) items.forEach((i) => { if (i !== item) setItem(i, false); });
            setItem(item, willOpen);
        };
        head.addEventListener('click', toggle);
        head.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });

    const expandAll = document.getElementById('faq-expand-all');
    if (expandAll) {
        expandAll.addEventListener('click', () => {
            const anyClosed = items.some((i) => !i.classList.contains('open'));
            items.forEach((i) => setItem(i, anyClosed));
        });
    }
})();
