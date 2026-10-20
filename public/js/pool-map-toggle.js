// Pool & Cabang Google Maps Interactive Toggle Controller
(() => {
    const poolData = {
        jakarta: {
            title: 'DKI Jakarta (Pusat)',
            badge: 'PUSAT',
            address: 'Jl. Inspeksi Tarum Barat Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur',
            mapUrl: 'https://maps.google.com/maps?q=Jl.+Inspeksi+Tarum+Barat+Cipinang+Melayu+Jakarta+Timur&t=&z=14&ie=UTF8&iwloc=&output=embed',
            directUrl: 'https://maps.google.com/?q=Jl.+Inspeksi+Tarum+Barat+Cipinang+Melayu+Jakarta+Timur'
        },
        jogja: {
            title: 'DI Yogyakarta (Cabang)',
            badge: 'CABANG',
            address: 'Jl. Jombor Lor, Sinduadi, Kec. Mlati, Kabupaten Sleman, D.I. Yogyakarta',
            mapUrl: 'https://maps.google.com/maps?q=Jl.+Jombor+Lor+Sinduadi+Sleman+Yogyakarta&t=&z=14&ie=UTF8&iwloc=&output=embed',
            directUrl: 'https://maps.google.com/?q=Jl.+Jombor+Lor+Sinduadi+Sleman+Yogyakarta'
        },
        bali: {
            title: 'Bali Denpasar (Cabang)',
            badge: 'CABANG',
            address: 'Jl. Gn. Kalimutu X, Pemecutan Klod, Kec. Denpasar Barat, Kota Denpasar, Bali',
            mapUrl: 'https://maps.google.com/maps?q=Jl.+Gunung+Kalimutu+X+Denpasar+Bali&t=&z=14&ie=UTF8&iwloc=&output=embed',
            directUrl: 'https://maps.google.com/?q=Jl.+Gunung+Kalimutu+X+Denpasar+Bali'
        }
    };

    const initPoolMapToggle = () => {
        const tabs = document.querySelectorAll('.pool-tab-btn');
        const iframe = document.getElementById('pool-map-iframe');
        const titleEl = document.getElementById('pool-detail-title-text');
        const badgeEl = document.getElementById('pool-detail-badge');
        const addrEl = document.getElementById('pool-detail-address');
        const directLink = document.getElementById('pool-direct-link');

        if (!tabs.length || !iframe) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetKey = tab.dataset.pool;
                const data = poolData[targetKey];
                if (!data) return;

                // Update active tab styles
                tabs.forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');

                // Update map iframe src
                iframe.src = data.mapUrl;

                // Update text details
                if (titleEl) titleEl.textContent = data.title;
                if (badgeEl) badgeEl.textContent = data.badge;
                if (addrEl) addrEl.textContent = data.address;
                if (directLink) directLink.href = data.directUrl;
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPoolMapToggle);
    } else {
        initPoolMapToggle();
    }
})();
