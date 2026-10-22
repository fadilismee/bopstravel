// Bop's Travel: Dark mode / Light mode toggle
(function () {
    var stored = null;
    try { stored = localStorage.getItem('bob-theme'); } catch (e) {}
    var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    function initToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        function updateAria() {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            btn.setAttribute('aria-label', current === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
            btn.setAttribute('title', current === 'dark' ? 'Mode Terang (saat ini Gelap)' : 'Mode Gelap (saat ini Terang)');
        }
        updateAria();

        btn.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('bob-theme', next); } catch (e) {}
            updateAria();
        });

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                var userChoice = null;
                try { userChoice = localStorage.getItem('bob-theme'); } catch (err) {}
                if (!userChoice) {
                    var osTheme = e.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', osTheme);
                    updateAria();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggle);
    } else {
        initToggle();
    }
})();
