// Real "Rute Populer / Semua Rute" tabs on the home page.
// "Rute Populer" shows only routes flagged is_featured; "Semua Rute" shows every active route.
// Data comes from /api/rute. If the request fails, the static list stays untouched.
(() => {
    const slot = document.getElementById('list-slot');
    const grid = slot ? slot.querySelector('#slots') : null;
    const tabs = [...document.querySelectorAll('[data-route-tab]')];
    if (!slot || !grid || tabs.length < 2) return;

    const PIN = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%232563EB%27%20stroke-width%3D%271.6%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M12%2021s-6-5.2-6-10a6%206%200%200%201%2012%200c0%204.8-6%2010-6%2010z%27%2F%3E%3Ccircle%20cx%3D%2712%27%20cy%3D%2711%27%20r%3D%272.1%27%2F%3E%3C%2Fsvg%3E";

    const ACTIVE = ['bg-[#2563EB]', 'font-bold', 'text-[#FAFAFA]'];
    const IDLE = ['bg-[#FAFAFA]', 'font-medium', 'text-[#1F2937]'];

    const paint = (active) => {
        tabs.forEach((btn) => {
            const on = btn.getAttribute('data-route-tab') === active;
            btn.classList.remove(...(on ? IDLE : ACTIVE));
            btn.classList.add(...(on ? ACTIVE : IDLE));
            btn.setAttribute('aria-selected', on ? 'true' : 'false');
        });
    };

    const item = (route) => {
        const wrap = document.createElement('div');
        const link = document.createElement('a');
        link.href = route.url;
        link.className = 'flex items-center gap-2 text-base leading-[100%] text-[#1F2937] hover:underline hover:text-primary';
        const icon = document.createElement('img');
        icon.src = PIN;
        icon.alt = '';
        icon.loading = 'lazy';
        icon.width = 35;
        icon.height = 35;
        icon.className = 'h-5 w-5 shrink-0 rounded object-contain';
        link.append(icon, document.createTextNode(` ${route.origin} – ${route.destination}`));
        wrap.append(link);
        return wrap;
    };

    const render = (list, key) => {
        grid.replaceChildren();
        if (!list.length) {
            const note = document.createElement('p');
            note.className = 'text-base text-[#4B5563]';
            note.textContent = key === 'popular'
                ? 'Belum ada rute populer. Pilih "Semua Rute" untuk melihat pilihan lengkap.'
                : 'Belum ada rute aktif saat ini.';
            grid.append(note);
            return;
        }
        list.forEach((route) => grid.append(item(route)));
    };

    let cache = null;
    const show = (key) => {
        paint(key);
        if (cache) {
            render(cache[key] || [], key);
            return;
        }
        fetch('/api/rute', { headers: { Accept: 'application/json' } })
            .then((res) => {
                if (!res.ok) throw new Error(`status ${res.status}`);
                return res.json();
            })
            .then((data) => {
                cache = data;
                render(data[key] || [], key);
            })
            .catch(() => { /* keep the static list on failure */ });
    };

    // Load the real popular routes immediately so "Rute Populer" never shows the full list.
    show('popular');
    tabs.forEach((btn) => btn.addEventListener('click', () => show(btn.getAttribute('data-route-tab'))));
})();
