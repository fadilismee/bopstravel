// Pool & Cabang Google Maps Interactive Toggle Controller
(() => {
    const poolData = {
        jakarta: {
            title: 'Muji Jaya Trans · Area Jakarta',
            badge: 'TITIK TEMU',
            address: 'Jl. Alhusaini, Kampung Prigi, RT.003/RW.010, Tangerang Selatan, Banten 15228',
            mapUrl: 'https://maps.google.com/maps?q=Muji+Jaya+Trans+Jl+Alhusaini+Kampung+Prigi+Tangerang+Selatan&z=17&output=embed',
            directUrl: 'https://maps.google.com/maps/search/Muji%20Jaya%20Trans/@-6.28642453,106.68335078,17z?hl=en'
        },
        jogja: {
            title: 'Cahaya Tour & Travel · Jogja',
            badge: 'TITIK TEMU',
            address: 'Pintu masuk Terminal Jombor, Jombor Lor, Sinduadi, Kec. Mlati, Sleman, D.I. Yogyakarta',
            mapUrl: 'https://maps.google.com/maps?q=Cahaya+Tour+%26+Travel+Terminal+Jombor+Sinduadi+Sleman&z=17&output=embed',
            directUrl: 'https://maps.google.com/maps/search/Cahaya%20Tour%20%26%20Travel%20Terminal%20Jombor/'
        },
        wonosari: {
            title: "Kantor Bop's Travel · Wonosari",
            badge: 'KANTOR',
            address: 'Jl. Dr. Wahidin Sudiro Husodo, Gunungkidul, D.I. Yogyakarta 55811',
            mapUrl: 'https://maps.google.com/maps?q=Bop%27s+Travel+Jl+Dr+Wahidin+Sudiro+Husodo+Gunungkidul&z=17&output=embed',
            directUrl: 'https://maps.google.com/maps/search/Bop%27s%20Travel/@-7.97880499,110.60830071,17z?hl=en'
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
                tabs.forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');

                // Update map iframe src
                iframe.src = data.mapUrl;
                iframe.title = `Peta ${data.title}`;

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
