// Booking widget: Sekali Jalan / Pulang Pergi toggle (titik radio ikut pindah,
// kolom Tanggal Pulang muncul saat Pulang Pergi) + tombol Cari -> /rute.
// Asal/tujuan berupa select kota; ikon swap menukar keduanya.
(() => {
    const oneway = document.getElementById('oneway-button');
    const roundtrip = document.getElementById('roundtrip-button');
    const onewayRadio = document.getElementById('trip-oneway');
    const roundtripRadio = document.getElementById('trip-roundtrip');
    const returnWrap = document.getElementById('return-date-wrap');
    const ON = ['activeBtn', 'custom-shadow', 'bg-custom', 'custom-border'];
    const ON_TEXT = ['font-medium'];
    const OFF_TEXT = ['text-font-gray'];
    const OFF_BORDER = ['border', 'border-[#E5E7EB]'];
    let mode = 'oneway';

    const setTrip = (which) => {
        mode = which === 'roundtrip' ? 'roundtrip' : 'oneway';
        const on = mode === 'oneway' ? oneway : roundtrip;
        const off = mode === 'oneway' ? roundtrip : oneway;
        // Active pill: gradient + ring ON, gray text + flat border OFF —
        // otherwise the idle pill keeps its gray/border look after switching.
        if (on) { on.classList.add(...ON, ...ON_TEXT); on.classList.remove(...OFF_TEXT, ...OFF_BORDER); on.setAttribute('aria-pressed', 'true'); }
        if (off) { off.classList.remove(...ON, ...ON_TEXT); off.classList.add(...OFF_TEXT, ...OFF_BORDER); off.setAttribute('aria-pressed', 'false'); }
        if (onewayRadio) onewayRadio.checked = mode === 'oneway';
        if (roundtripRadio) roundtripRadio.checked = mode === 'roundtrip';
        if (returnWrap) returnWrap.style.display = mode === 'roundtrip' ? '' : 'none';
    };

    if (oneway) oneway.addEventListener('click', () => setTrip('oneway'));
    if (roundtrip) roundtrip.addEventListener('click', () => setTrip('roundtrip'));
    if (onewayRadio) onewayRadio.addEventListener('change', () => setTrip('oneway'));
    if (roundtripRadio) roundtripRadio.addEventListener('change', () => setTrip('roundtrip'));

    const fromSel = document.getElementById('departure-from');
    const toSel = document.getElementById('destination-form');
    const swap = document.querySelector('img[alt="Swap Icon"]');
    if (swap && fromSel && toSel) {
        swap.style.cursor = 'pointer';
        swap.setAttribute('role', 'button');
        swap.setAttribute('tabindex', '0');
        swap.setAttribute('aria-label', 'Tukar kota asal dan tujuan');
        const doSwap = () => {
            const a = fromSel.value;
            fromSel.value = toSel.value;
            toSel.value = a;
        };
        swap.addEventListener('click', doSwap);
        swap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSwap(); }
        });
    }

    const depart = document.getElementById('date-form');
    const time = document.getElementById('time-form');
    const ret = document.getElementById('return-date-form');
    if (depart && ret) {
        depart.addEventListener('change', () => {
            if (depart.value) {
                ret.min = depart.value;
                if (ret.value && ret.value < depart.value) ret.value = depart.value;
            }
        });
    }

    const btn = document.getElementById('search-schedule');
    if (btn) {
        btn.type = 'button';
        btn.addEventListener('click', () => {
            const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
            const params = new URLSearchParams();
            const orig = val('departure-from');
            const dest = val('destination-form');
            const date = val('date-form');
            const jam = time ? time.value.trim() : '';
            if (orig) params.set('origin', orig);
            if (dest) params.set('destination', dest);
            if (date) params.set('date', date);
            if (jam) params.set('time', jam);
            params.set('trip', mode === 'roundtrip' ? 'pp' : 'oj');
            if (mode === 'roundtrip') {
                const back = val('return-date-form');
                if (back) params.set('return_date', back);
            }
            const qs = params.toString();
            window.location.href = qs ? `/rute?${qs}` : '/rute';
        });
    }

    setTrip('oneway');
})();
