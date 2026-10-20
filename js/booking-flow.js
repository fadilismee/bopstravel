/**
 * Bob Travel - Interactive End-to-End Demo Booking & Payment System
 * Multi-step booking flow: Jadwal -> Kursi & Data -> Pembayaran Demo -> E-Tiket Digital
 */
(() => {
    // State Store
    const state = {
        step: 1,
        origin: 'Jakarta',
        destination: 'Solo',
        date: new Date().toISOString().split('T')[0],
        time: '07:30',
        tripType: 'oneway',
        serviceType: 'Reguler',
        schedule: null,
        selectedSeats: ['2A'],
        seatPrice: 250000,
        passenger: {
            name: 'Budi Santoso',
            phone: '081228746964',
            email: 'budi.santoso@gmail.com',
            pickup: 'Pool Bob Travel Cipinang Melayu (Pusat)',
            dropoff: 'Pool Bob Travel Kerten Laweyan',
            notes: ''
        },
        payment: {
            method: 'qris',
            status: 'pending',
            vaBank: 'BCA',
            vaNumber: '8271 0812 2874 6964'
        },
        bookingCode: 'BOB-782914',
        countdownSec: 900,
        timerInterval: null
    };

    const mockSchedules = [
        {
            id: 'sch-1',
            departureTime: '07:30',
            arrivalTime: '15:30',
            duration: '8 jam',
            vehicle: 'Toyota HiAce Premio Executive',
            class: 'Executive Class',
            availableSeats: 4,
            price: 250000,
            facilities: ['AC Dingin', 'Reclining Seat', 'USB Charger', 'Snack & Mineral', 'Tol Trans Jawa']
        },
        {
            id: 'sch-2',
            departureTime: '13:00',
            arrivalTime: '21:00',
            duration: '8 jam',
            vehicle: 'Toyota HiAce Commuter Luxury',
            class: 'Luxury Class',
            availableSeats: 6,
            price: 230000,
            facilities: ['Full AC', 'Leg Rest', 'Charger HP', 'Air Mineral', 'Tol Express']
        },
        {
            id: 'sch-3',
            departureTime: '19:30',
            arrivalTime: '03:30',
            duration: '8 jam',
            vehicle: 'Toyota HiAce Premio Luxury',
            class: 'Super Executive',
            availableSeats: 3,
            price: 260000,
            facilities: ['AC Dingin', 'Bantal & Selimut', 'Reclining Seat', 'Snack Malam', 'Tol Trans Jawa']
        },
        {
            id: 'sch-4',
            departureTime: '21:00',
            arrivalTime: '05:00',
            duration: '8 jam',
            vehicle: 'Toyota Innova Reborn Captain',
            class: 'Captain Seat (Privat)',
            availableSeats: 2,
            price: 290000,
            facilities: ['Captain Seat', 'Maks 5 Orang', 'Door-to-Door', 'Bantal & Selimut', 'Tol Penuh']
        }
    ];

    const poolLocations = {
        'Jakarta': ['Pool Bob Travel Cipinang Melayu (Pusat)', 'Terminal Pulo Gebang', 'Cilandak Town Square', 'Alamat Sendiri (Door-to-Door)'],
        'Solo': ['Pool Bob Travel Kerten Laweyan', 'Terminal Tirtonadi', 'Stasiun Solo Balapan', 'Alamat Sendiri (Door-to-Door)'],
        'Bandung': ['Pool Bob Travel Pasteur', 'Pool Bob Travel Buah Batu', 'Alamat Sendiri (Door-to-Door)'],
        'Surabaya': ['Pool Bob Travel Gubeng', 'Terminal Bungurasih (Purabaya)', 'Alamat Sendiri (Door-to-Door)'],
        'Semarang': ['Pool Bob Travel Simpang Lima', 'Pool Bob Travel Krapyak', 'Alamat Sendiri (Door-to-Door)'],
        'Yogyakarta': ['Pool Bob Travel Jombor', 'Pool Bob Travel Giwangan', 'Alamat Sendiri (Door-to-Door)'],
        'default': ['Pool Resmi Keberangkatan', 'Terminal Pusat Kota', 'Alamat Sendiri (Door-to-Door)']
    };

    function formatRupiah(amount) {
        return 'Rp ' + Number(amount).toLocaleString('id-ID');
    }

    function formatDateIndo(dateStr) {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        } catch (e) {
            return dateStr;
        }
    }

    // Modal DOM Injection
    function createModalDom() {
        if (document.getElementById('bob-booking-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'bob-booking-modal';
        overlay.className = 'bob-modal-overlay';
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        overlay.style.visibility = 'hidden';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Pemesanan Tiket Bob Travel');

        overlay.innerHTML = `
        <div class="bob-modal-card">
            <!-- Modal Header -->
            <div class="bob-modal-header">
                <div class="bob-modal-top-bar">
                    <div class="bob-modal-title-group">
                        <div class="bob-modal-logo-mark">B</div>
                        <div>
                            <h3 class="bob-modal-title">Pemesanan &amp; Pembayaran Tiket</h3>
                            <p class="bob-modal-subtitle" id="bob-modal-subhead">Bob Travel • Armada Trans Java</p>
                        </div>
                    </div>
                    <button type="button" class="bob-modal-close" id="bob-modal-close-btn" aria-label="Tutup popup">✕</button>
                </div>

                <!-- Breadcrumb Stepper -->
                <div class="bob-modal-stepper">
                    <div class="bob-step-item is-active" id="bob-step-ind-1">
                        <span class="bob-step-num">1</span>
                        <span>Pilih Jadwal</span>
                    </div>
                    <div class="bob-step-divider"></div>
                    <div class="bob-step-item" id="bob-step-ind-2">
                        <span class="bob-step-num">2</span>
                        <span>Kursi &amp; Data</span>
                    </div>
                    <div class="bob-step-divider"></div>
                    <div class="bob-step-item" id="bob-step-ind-3">
                        <span class="bob-step-num">3</span>
                        <span>Bayar Demo</span>
                    </div>
                    <div class="bob-step-divider"></div>
                    <div class="bob-step-item" id="bob-step-ind-4">
                        <span class="bob-step-num">4</span>
                        <span>E-Tiket</span>
                    </div>
                </div>
            </div>

            <!-- Modal Scrollable Body -->
            <div class="bob-modal-body">
                <!-- STEP 1: Jadwal & Armada -->
                <div class="bob-step-pane is-active" id="bob-step-1">
                    <div class="bob-route-summary-bar">
                        <div class="bob-route-cities">
                            <span id="bob-summary-orig">Jakarta</span>
                            <span style="color:#2563eb">➔</span>
                            <span id="bob-summary-dest">Solo</span>
                            <span class="bob-route-badge" id="bob-summary-trip">Sekali Jalan</span>
                        </div>
                        <div style="font-size:13px;color:#64748b;font-weight:600" id="bob-summary-date-text">
                            Hari ini
                        </div>
                    </div>

                    <!-- Tanggal Navigasi Cepat -->
                    <div class="bob-date-pills" id="bob-quick-dates"></div>

                    <!-- Daftar Jadwal Tersedia -->
                    <div class="bob-schedule-list" id="bob-schedule-container"></div>
                </div>

                <!-- STEP 2: Kursi & Data Penumpang -->
                <div class="bob-step-pane" id="bob-step-2">
                    <div class="bob-step2-grid">
                        <!-- Left: Toyota HiAce Cabin Seat Map -->
                        <div class="bob-cabin-box">
                            <div class="bob-cabin-title">Pilih Kursi Anda</div>
                            <div class="bob-seat-legend">
                                <div class="bob-legend-item">
                                    <div class="bob-legend-box bob-legend-available"></div>
                                    <span>Tersedia</span>
                                </div>
                                <div class="bob-legend-item">
                                    <div class="bob-legend-box bob-legend-selected"></div>
                                    <span>Dipilih</span>
                                </div>
                                <div class="bob-legend-item">
                                    <div class="bob-legend-box bob-legend-occupied"></div>
                                    <span>Terisi</span>
                                </div>
                            </div>

                            <div class="bob-van-cabin">
                                <div class="bob-van-front">
                                    <div class="bob-van-driver">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10M12 12 2 12M12 12l7 7M12 12l-7 7"/></svg>
                                        <span>DRIVER</span>
                                    </div>
                                    <button type="button" class="bob-seat-btn" data-seat="1A" style="max-width:80px">1A</button>
                                </div>

                                <div class="bob-van-seats">
                                    <div class="bob-seat-row">
                                        <button type="button" class="bob-seat-btn" data-seat="2A">2A</button>
                                        <button type="button" class="bob-seat-btn" data-seat="2B">2B</button>
                                    </div>
                                    <div class="bob-seat-row">
                                        <button type="button" class="bob-seat-btn" data-seat="3A" disabled title="Kursi terisi">3A</button>
                                        <button type="button" class="bob-seat-btn" data-seat="3B">3B</button>
                                    </div>
                                    <div class="bob-seat-row">
                                        <button type="button" class="bob-seat-btn" data-seat="4A">4A</button>
                                        <button type="button" class="bob-seat-btn" data-seat="4B">4B</button>
                                        <button type="button" class="bob-seat-btn" data-seat="4C" disabled title="Kursi terisi">4C</button>
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top:14px;padding:10px;background:#eff6ff;border-radius:10px;font-size:12px;color:#1e40af;text-align:center">
                                Kursi Terpilih: <b id="bob-selected-seats-badge">2A</b> (<span id="bob-selected-seat-count">1</span> kursi)
                            </div>
                        </div>

                        <!-- Right: Passenger Data Form -->
                        <div class="bob-passenger-card">
                            <div class="bob-form-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Informasi Penumpang &amp; Penjemputan</span>
                            </div>

                            <div class="bob-form-grid">
                                <div class="bob-form-group">
                                    <label class="bob-form-label" for="bob-input-name">Nama Lengkap Penumpang *</label>
                                    <input type="text" id="bob-input-name" class="bob-form-input" placeholder="Contoh: Budi Santoso" value="Budi Santoso">
                                </div>

                                <div class="bob-form-group">
                                    <label class="bob-form-label" for="bob-input-phone">Nomor WhatsApp / HP *</label>
                                    <input type="tel" id="bob-input-phone" class="bob-form-input" placeholder="Contoh: 08123456789" value="081228746964">
                                </div>

                                <div class="bob-form-group is-full">
                                    <label class="bob-form-label" for="bob-input-email">Email untuk E-Tiket</label>
                                    <input type="email" id="bob-input-email" class="bob-form-input" placeholder="Contoh: budi@gmail.com" value="budi.santoso@gmail.com">
                                </div>

                                <div class="bob-form-group">
                                    <label class="bob-form-label" for="bob-input-pickup">Titik Jemput / Pool Asal *</label>
                                    <select id="bob-input-pickup" class="bob-form-select"></select>
                                </div>

                                <div class="bob-form-group">
                                    <label class="bob-form-label" for="bob-input-dropoff">Titik Turun / Pool Tujuan *</label>
                                    <select id="bob-input-dropoff" class="bob-form-select"></select>
                                </div>

                                <div class="bob-form-group is-full">
                                    <label class="bob-form-label" for="bob-input-notes">Catatan Tambahan (Opsional)</label>
                                    <input type="text" id="bob-input-notes" class="bob-form-input" placeholder="Misal: Bawa koper ukuran 24 inch / jemput di lobby hotel">
                                </div>
                            </div>

                            <div class="bob-step2-actions" style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:16px">
                                <button type="button" class="bob-btn-finish" id="bob-back-to-step1">← Kembali ke Jadwal</button>
                                <button type="button" class="bob-btn-select-schedule" id="bob-go-to-step3" style="padding:12px 24px;font-size:14px">
                                    Lanjut ke Pembayaran ➔
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STEP 3: Review & Pembayaran Demo -->
                <div class="bob-step-pane" id="bob-step-3">
                    <div class="bob-demo-alert">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <div>
                            <b>Simulasi Pembayaran (Demo Mode):</b> Tidak ada tagihan riil atau potong saldo. Anda dapat menguji bayar secara instan menggunakan QRIS, Virtual Account, atau E-Wallet demo.
                        </div>
                    </div>

                    <div class="bob-checkout-grid">
                        <!-- Order Summary -->
                        <div class="bob-order-summary">
                            <div class="bob-summary-title">Ringkasan Pemesanan</div>
                            <div class="bob-summary-row">
                                <span>No. Pesanan:</span>
                                <b id="bob-sum-code" style="color:#2563eb;font-family:monospace">BOB-782914</b>
                            </div>
                            <div class="bob-summary-row">
                                <span>Rute Perjalanan:</span>
                                <b id="bob-sum-route">Jakarta ➔ Solo</b>
                            </div>
                            <div class="bob-summary-row">
                                <span>Tanggal &amp; Jam:</span>
                                <b id="bob-sum-datetime">-</b>
                            </div>
                            <div class="bob-summary-row">
                                <span>Armada:</span>
                                <b id="bob-sum-vehicle">-</b>
                            </div>
                            <div class="bob-summary-row">
                                <span>Nomor Kursi:</span>
                                <b id="bob-sum-seats">-</b>
                            </div>
                            <div class="bob-summary-row">
                                <span>Penumpang:</span>
                                <b id="bob-sum-pax">-</b>
                            </div>
                            <div class="bob-summary-row" style="margin-top:10px;padding-top:10px;border-top:1px solid #f1f5f9">
                                <span>Tarif Tiket:</span>
                                <span id="bob-sum-subtotal">-</span>
                            </div>
                            <div class="bob-summary-row">
                                <span>Biaya Layanan &amp; Admin:</span>
                                <span style="color:#16a34a;font-weight:700">Rp 0 (GRATIS)</span>
                            </div>
                            <div class="bob-summary-row is-total">
                                <span>Total Tagihan:</span>
                                <span id="bob-sum-total" style="color:#2563eb">-</span>
                            </div>
                        </div>

                        <!-- Payment Methods Tab -->
                        <div class="bob-payment-methods">
                            <div class="bob-summary-title">Pilih Metode Pembayaran Demo</div>

                            <div class="bob-pay-tabs">
                                <button type="button" class="bob-pay-tab is-active" data-paytab="qris">QRIS Instan</button>
                                <button type="button" class="bob-pay-tab" data-paytab="va">Virtual Account</button>
                                <button type="button" class="bob-pay-tab" data-paytab="ewallet">E-Wallet</button>
                                <button type="button" class="bob-pay-tab" data-paytab="cash">Bayar di Pool</button>
                            </div>

                            <!-- Tab 1: QRIS -->
                            <div class="bob-pay-content is-active" id="bob-paycontent-qris">
                                <div class="bob-qris-box">
                                    <div class="bob-qris-timer">
                                        ⏱️ Sisa Waktu Pembayaran: <span id="bob-qris-clock">14:59</span>
                                    </div>
                                    <div class="bob-qris-frame">
                                        <svg width="160" height="160" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="100" height="100" rx="8" fill="white"/>
                                            <!-- QR Finder Top-Left -->
                                            <rect x="6" y="6" width="26" height="26" rx="4" fill="#1e293b"/>
                                            <rect x="10" y="10" width="18" height="18" rx="2" fill="white"/>
                                            <rect x="14" y="14" width="10" height="10" rx="1" fill="#2563eb"/>
                                            <!-- QR Finder Top-Right -->
                                            <rect x="68" y="6" width="26" height="26" rx="4" fill="#1e293b"/>
                                            <rect x="72" y="10" width="18" height="18" rx="2" fill="white"/>
                                            <rect x="76" y="14" width="10" height="10" rx="1" fill="#2563eb"/>
                                            <!-- QR Finder Bottom-Left -->
                                            <rect x="6" y="68" width="26" height="26" rx="4" fill="#1e293b"/>
                                            <rect x="10" y="72" width="18" height="18" rx="2" fill="white"/>
                                            <rect x="14" y="76" width="10" height="10" rx="1" fill="#2563eb"/>
                                            <!-- QR Code Data Dots -->
                                            <rect x="36" y="8" width="6" height="6" fill="#1e293b"/>
                                            <rect x="46" y="8" width="6" height="12" fill="#1e293b"/>
                                            <rect x="56" y="14" width="8" height="6" fill="#1e293b"/>
                                            <rect x="36" y="22" width="10" height="6" fill="#1e293b"/>
                                            <rect x="52" y="24" width="10" height="8" fill="#1e293b"/>
                                            <rect x="8" y="38" width="8" height="12" fill="#1e293b"/>
                                            <rect x="22" y="44" width="6" height="14" fill="#1e293b"/>
                                            <rect x="34" y="36" width="12" height="12" rx="2" fill="#f59e0b"/>
                                            <rect x="50" y="38" width="8" height="8" fill="#1e293b"/>
                                            <rect x="64" y="36" width="14" height="6" fill="#1e293b"/>
                                            <rect x="82" y="40" width="10" height="14" fill="#1e293b"/>
                                            <rect x="36" y="54" width="8" height="8" fill="#1e293b"/>
                                            <rect x="50" y="52" width="12" height="10" fill="#1e293b"/>
                                            <rect x="68" y="48" width="8" height="14" fill="#1e293b"/>
                                            <rect x="38" y="68" width="10" height="8" fill="#1e293b"/>
                                            <rect x="54" y="68" width="6" height="14" fill="#1e293b"/>
                                            <rect x="66" y="70" width="12" height="6" fill="#1e293b"/>
                                            <rect x="84" y="68" width="8" height="8" fill="#1e293b"/>
                                            <rect x="40" y="82" width="8" height="10" fill="#1e293b"/>
                                            <rect x="64" y="82" width="14" height="8" fill="#1e293b"/>
                                            <rect x="82" y="84" width="10" height="8" fill="#1e293b"/>
                                            <!-- QRIS Badge Centered -->
                                            <rect x="40" y="42" width="20" height="14" rx="2" fill="#ea580c"/>
                                            <text x="50" y="52" font-family="Arial,sans-serif" font-weight="900" font-size="7" fill="white" text-anchor="middle">QRIS</text>
                                        </svg>
                                    </div>
                                    <div style="font-size:12px;color:#64748b">
                                        Scan dengan BCA, Mandiri Livin, BRImo, GoPay, OVO, Dana, dll.
                                    </div>
                                    <button type="button" class="bob-btn-pay-demo" id="bob-btn-pay-qris">
                                        ⚡ Simulasi Bayar QRIS Sekarang (Instan Lunas)
                                    </button>
                                </div>
                            </div>

                            <!-- Tab 2: Virtual Account -->
                            <div class="bob-pay-content" id="bob-paycontent-va">
                                <div class="bob-va-box">
                                    <div class="bob-va-bank-pills" style="display:flex;gap:8px">
                                        <button type="button" class="bob-date-pill is-active" data-bank="BCA">Bank BCA</button>
                                        <button type="button" class="bob-date-pill" data-bank="Mandiri">Bank Mandiri</button>
                                        <button type="button" class="bob-date-pill" data-bank="BRI">Bank BRI</button>
                                    </div>
                                    <div class="bob-va-number-card">
                                        <div>
                                            <small style="color:#64748b;font-size:11px">NOMOR VIRTUAL ACCOUNT</small>
                                            <div class="bob-va-number" id="bob-va-display">8271 0812 2874 6964</div>
                                        </div>
                                        <button type="button" class="bob-btn-copy" id="bob-copy-va-btn">Salin</button>
                                    </div>
                                    <div style="background:#f8fafc;padding:12px;border-radius:10px;font-size:11px;color:#475569;line-height:1.6">
                                        <b>Petunjuk Transfer m-Banking:</b><br>
                                        1. Buka aplikasi m-Banking &amp; pilih menu Transfer &gt; Virtual Account.<br>
                                        2. Masukkan nomor VA di atas.<br>
                                        3. Pastikan nama tertera <b>BOB TRAVEL - <span id="bob-va-pax-name">Budi Santoso</span></b>.<br>
                                        4. Masukkan PIN dan konfirmasi transfer.
                                    </div>
                                    <button type="button" class="bob-btn-pay-demo" id="bob-btn-pay-va">
                                        ⚡ Cek Status Pembayaran VA (Simulasi Lunas)
                                    </button>
                                </div>
                            </div>

                            <!-- Tab 3: E-Wallet -->
                            <div class="bob-pay-content" id="bob-paycontent-ewallet">
                                <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
                                    <label class="bob-form-label">Pilih Dompet Digital</label>
                                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
                                        <label style="border:1.5px solid #cbd5e1;padding:10px;border-radius:10px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer">
                                            <input type="radio" name="ewallet-vendor" value="GoPay" checked> GoPay
                                        </label>
                                        <label style="border:1.5px solid #cbd5e1;padding:10px;border-radius:10px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer">
                                            <input type="radio" name="ewallet-vendor" value="OVO"> OVO
                                        </label>
                                        <label style="border:1.5px solid #cbd5e1;padding:10px;border-radius:10px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer">
                                            <input type="radio" name="ewallet-vendor" value="DANA"> DANA
                                        </label>
                                        <label style="border:1.5px solid #cbd5e1;padding:10px;border-radius:10px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer">
                                            <input type="radio" name="ewallet-vendor" value="ShopeePay"> ShopeePay
                                        </label>
                                    </div>
                                    <div class="bob-form-group">
                                        <label class="bob-form-label">Nomor Handphone Terdaftar</label>
                                        <input type="tel" class="bob-form-input" id="bob-ewallet-phone" value="081228746964">
                                    </div>
                                    <button type="button" class="bob-btn-pay-demo" id="bob-btn-pay-ewallet">
                                        ⚡ Bayar via E-Wallet (Simulasi Konfirmasi)
                                    </button>
                                </div>
                            </div>

                            <!-- Tab 4: Bayar di Pool -->
                            <div class="bob-pay-content" id="bob-paycontent-cash">
                                <div style="display:flex;flex-direction:column;gap:12px;text-align:left;font-size:13px;color:#475569;line-height:1.6">
                                    <div style="background:#eff6ff;padding:14px;border-radius:12px;border:1px solid #bfdbfe;color:#1e40af">
                                        <b>Bayar Langsung di Loket Pool:</b><br>
                                        Anda dapat membayar tiket secara tunai (cash) atau debit di loket kasir Pool Bob Travel selambatnya <b>30 menit sebelum jam keberangkatan</b>.
                                    </div>
                                    <div>
                                        📍 <b>Lokasi Pembayaran:</b> <span id="bob-cash-pool-loc">Pool Bob Travel Cipinang Melayu (Pusat)</span><br>
                                        🎫 Tiket akan langsung di-issued dan kursi Anda otomatis di-reserved.
                                    </div>
                                    <button type="button" class="bob-btn-pay-demo" id="bob-btn-pay-cash">
                                        ⚡ Konfirmasi Reservasi &amp; Bayar di Pool
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:16px;text-align:left">
                        <button type="button" class="bob-btn-finish" id="bob-back-to-step2">← Kembali Ubah Kursi</button>
                    </div>
                </div>

                <!-- STEP 4: Konfirmasi Sukses & E-Tiket Digital -->
                <div class="bob-step-pane" id="bob-step-4">
                    <div class="bob-success-banner">
                        <div class="bob-success-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h2 class="bob-success-title">Pembayaran Berhasil &amp; Tiket Terkonfirmasi!</h2>
                        <p class="bob-success-sub">Terima kasih telah memesan di Bob Travel. Berikut adalah E-Tiket resmi Anda.</p>
                    </div>

                    <!-- Digital E-Ticket Card -->
                    <div class="bob-eticket-card" id="bob-eticket-printable">
                        <div class="bob-ticket-head">
                            <div class="bob-ticket-brand">
                                <span style="background:#f59e0b;padding:2px 8px;border-radius:4px;color:#fff;margin-right:6px">B</span>
                                BOB TRAVEL • BOARDING PASS
                            </div>
                            <span class="bob-ticket-badge-paid" id="bob-ticket-status-badge">LUNAS / CONFIRMED</span>
                        </div>

                        <div class="bob-ticket-body">
                            <div class="bob-ticket-grid">
                                <div class="bob-ticket-col">
                                    <small>KODE BOOKING</small>
                                    <b id="bob-tkt-code" style="color:#2563eb;font-size:18px;font-family:monospace">BOB-782914</b>
                                </div>
                                <div class="bob-ticket-col">
                                    <small>NAMA PENUMPANG</small>
                                    <b id="bob-tkt-name">Budi Santoso</b>
                                </div>
                                <div class="bob-ticket-col">
                                    <small>RUTE PERJALANAN</small>
                                    <b id="bob-tkt-route">Jakarta ➔ Solo</b>
                                </div>
                                <div class="bob-ticket-col">
                                    <small>TANGGAL &amp; JAM</small>
                                    <b id="bob-tkt-datetime">-</b>
                                </div>
                                <div class="bob-ticket-col">
                                    <small>ARMADA &amp; KELAS</small>
                                    <b id="bob-tkt-vehicle">Toyota HiAce Premio Executive</b>
                                </div>
                                <div class="bob-ticket-col">
                                    <small>NOMOR KURSI</small>
                                    <b id="bob-tkt-seat" style="color:#2563eb">Kursi 2A</b>
                                </div>
                                <div class="bob-ticket-col" style="grid-column:1 / -1">
                                    <small>TITIK KEBERANGKATAN (POOL)</small>
                                    <b id="bob-tkt-pickup">-</b>
                                </div>
                                <div class="bob-ticket-col" style="grid-column:1 / -1">
                                    <small>TITIK PENURUNAN (TUJUAN)</small>
                                    <b id="bob-tkt-dropoff">-</b>
                                </div>
                            </div>

                            <div class="bob-ticket-tear"></div>

                            <div class="bob-ticket-footer">
                                <div>
                                    <div class="bob-barcode-sim">||| | |||| | ||||| || |</div>
                                    <div style="font-size:10px;color:#64748b;margin-top:4px">Tunjukkan E-Tiket ini kepada petugas pool / driver sebelum boarding.</div>
                                </div>
                                <div style="text-align:right">
                                    <small style="font-size:10px;color:#94a3b8">TOTAL BAYAR</small>
                                    <div id="bob-tkt-total" style="font-size:16px;font-weight:800;color:#0f172a">Rp 250.000</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="bob-ticket-actions">
                        <button type="button" class="bob-btn-print" id="bob-btn-print-ticket">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            Cetak / Unduh PDF
                        </button>
                        <button type="button" class="bob-btn-wa-ticket" id="bob-btn-wa-ticket">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            Kirim ke WhatsApp
                        </button>
                        <button type="button" class="bob-btn-finish" id="bob-btn-finish-modal">
                            Selesai &amp; Pesan Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Feedback -->
        <div id="bob-toast-feedback" class="bob-toast">Berhasil disalin!</div>
        `;

        document.body.appendChild(overlay);

        // Bind events
        bindModalEvents();
    }

    function showToast(msg) {
        const toast = document.getElementById('bob-toast-feedback');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('is-show');
        setTimeout(() => toast.classList.remove('is-show'), 2800);
    }

    function updateStepIndicator(targetStep) {
        state.step = targetStep;
        for (let i = 1; i <= 4; i++) {
            const ind = document.getElementById(`bob-step-ind-${i}`);
            const pane = document.getElementById(`bob-step-${i}`);
            if (ind) {
                ind.classList.remove('is-active', 'is-completed');
                if (i === targetStep) {
                    ind.classList.add('is-active');
                } else if (i < targetStep) {
                    ind.classList.add('is-completed');
                }
            }
            if (pane) {
                pane.classList.toggle('is-active', i === targetStep);
            }
        }
    }

    function renderSchedules() {
        const container = document.getElementById('bob-schedule-container');
        if (!container) return;

        container.innerHTML = mockSchedules.map((sch, idx) => `
            <div class="bob-schedule-card ${idx === 0 ? 'is-selected' : ''}" data-sch-id="${sch.id}">
                <div class="bob-schedule-time-box">
                    <div class="bob-time-block">
                        <div class="bob-time-val">${sch.departureTime}</div>
                        <div class="bob-time-label">${state.origin}</div>
                    </div>
                    <div class="bob-time-arrow">
                        <span>➔</span>
                        <span>${sch.duration}</span>
                    </div>
                    <div class="bob-time-block">
                        <div class="bob-time-val">${sch.arrivalTime}</div>
                        <div class="bob-time-label">${state.destination}</div>
                    </div>
                </div>

                <div class="bob-schedule-info">
                    <div class="bob-vehicle-title">
                        <span>${sch.vehicle}</span>
                        <span class="bob-seat-badge">${sch.availableSeats} kursi tersisa</span>
                    </div>
                    <div class="bob-facility-tags">
                        ${sch.facilities.map(f => `<span class="bob-facility-tag">✓ ${f}</span>`).join('')}
                    </div>
                </div>

                <div class="bob-schedule-price-box">
                    <div class="bob-price-col">
                        <div class="bob-price-val">${formatRupiah(sch.price)}</div>
                        <div class="bob-price-note">per kursi</div>
                    </div>
                    <button type="button" class="bob-btn-select-schedule" data-sch-id="${sch.id}">Pilih Jadwal ➔</button>
                </div>
            </div>
        `).join('');

        // Select first schedule by default
        state.schedule = mockSchedules[0];
        state.seatPrice = mockSchedules[0].price;

        // Card click / button click
        container.querySelectorAll('.bob-schedule-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = card.dataset.schId;
                const found = mockSchedules.find(s => s.id === id);
                if (found) {
                    state.schedule = found;
                    state.seatPrice = found.price;
                    container.querySelectorAll('.bob-schedule-card').forEach(c => c.classList.remove('is-selected'));
                    card.classList.add('is-selected');

                    // If button was clicked or double click, go directly to Step 2
                    if (e.target.closest('.bob-btn-select-schedule')) {
                        goToStep2();
                    }
                }
            });
        });
    }

    function renderQuickDates() {
        const wrap = document.getElementById('bob-quick-dates');
        if (!wrap) return;

        const dates = [];
        const today = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const iso = d.toISOString().split('T')[0];
            const dateNum = d.getDate();
            const mon = monthNames[d.getMonth()];
            const label = i === 0 ? `Hari Ini (${dateNum} ${mon})` : (i === 1 ? `Besok (${dateNum} ${mon})` : `${dateNum} ${mon}`);
            dates.push({ iso, label });
        }

        wrap.innerHTML = dates.map((item, idx) => `
            <button type="button" class="bob-date-pill ${idx === 0 ? 'is-active' : ''}" data-date="${item.iso}">
                ${item.label}
            </button>
        `).join('');

        wrap.querySelectorAll('.bob-date-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                wrap.querySelectorAll('.bob-date-pill').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                state.date = btn.dataset.date;
                const dateText = document.getElementById('bob-summary-date-text');
                if (dateText) dateText.textContent = formatDateIndo(state.date);
            });
        });
    }

    function renderPoolOptions() {
        const pickupSelect = document.getElementById('bob-input-pickup');
        const dropoffSelect = document.getElementById('bob-input-dropoff');
        if (!pickupSelect || !dropoffSelect) return;

        const origPools = poolLocations[state.origin] || poolLocations['default'];
        const destPools = poolLocations[state.destination] || poolLocations['default'];

        pickupSelect.innerHTML = origPools.map(p => `<option value="${p}">${p}</option>`).join('');
        dropoffSelect.innerHTML = destPools.map(p => `<option value="${p}">${p}</option>`).join('');

        state.passenger.pickup = origPools[0];
        state.passenger.dropoff = destPools[0];

        const cashLoc = document.getElementById('bob-cash-pool-loc');
        if (cashLoc) cashLoc.textContent = origPools[0];
    }

    function updateSeatMap() {
        const seats = document.querySelectorAll('.bob-seat-btn');
        seats.forEach(s => {
            const seatNo = s.dataset.seat;
            if (state.selectedSeats.includes(seatNo)) {
                s.classList.add('is-selected');
            } else {
                s.classList.remove('is-selected');
            }
        });

        const badge = document.getElementById('bob-selected-seats-badge');
        const count = document.getElementById('bob-selected-seat-count');
        if (badge) badge.textContent = state.selectedSeats.length ? state.selectedSeats.join(', ') : '-';
        if (count) count.textContent = state.selectedSeats.length;
    }

    function goToStep2() {
        renderPoolOptions();
        updateSeatMap();
        updateStepIndicator(2);
    }

    function goToStep3() {
        // Read form inputs
        const nameInp = document.getElementById('bob-input-name');
        const phoneInp = document.getElementById('bob-input-phone');
        const emailInp = document.getElementById('bob-input-email');
        const pickupSel = document.getElementById('bob-input-pickup');
        const dropoffSel = document.getElementById('bob-input-dropoff');
        const notesInp = document.getElementById('bob-input-notes');

        if (nameInp && nameInp.value.trim()) state.passenger.name = nameInp.value.trim();
        if (phoneInp && phoneInp.value.trim()) state.passenger.phone = phoneInp.value.trim();
        if (emailInp) state.passenger.email = emailInp.value.trim() || 'penumpang@bobtravel.id';
        if (pickupSel) state.passenger.pickup = pickupSel.value;
        if (dropoffSel) state.passenger.dropoff = dropoffSel.value;
        if (notesInp) state.passenger.notes = notesInp.value.trim();

        if (state.selectedSeats.length === 0) {
            alert('Silakan pilih minimal 1 kursi sebelum melanjutkan.');
            return;
        }

        // Generate Booking Code
        state.bookingCode = 'BOB-' + Math.floor(100000 + Math.random() * 900000);

        // Populate Summary
        const total = state.seatPrice * state.selectedSeats.length;
        document.getElementById('bob-sum-code').textContent = state.bookingCode;
        document.getElementById('bob-sum-route').textContent = `${state.origin} ➔ ${state.destination}`;
        document.getElementById('bob-sum-datetime').textContent = `${formatDateIndo(state.date)} @ ${state.schedule ? state.schedule.departureTime : '07:30'} WIB`;
        document.getElementById('bob-sum-vehicle').textContent = state.schedule ? state.schedule.vehicle : 'Toyota HiAce Premio';
        document.getElementById('bob-sum-seats').textContent = `${state.selectedSeats.join(', ')} (${state.selectedSeats.length} Kursi)`;
        document.getElementById('bob-sum-pax').textContent = `${state.passenger.name} (${state.passenger.phone})`;
        document.getElementById('bob-sum-subtotal').textContent = `${formatRupiah(state.seatPrice)} x ${state.selectedSeats.length} = ${formatRupiah(total)}`;
        document.getElementById('bob-sum-total').textContent = formatRupiah(total);

        const paxNameVA = document.getElementById('bob-va-pax-name');
        if (paxNameVA) paxNameVA.textContent = state.passenger.name;

        // Reset QRIS timer
        startCountdown();

        updateStepIndicator(3);
    }

    function startCountdown() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.countdownSec = 900; // 15 mins
        const clockEl = document.getElementById('bob-qris-clock');

        state.timerInterval = setInterval(() => {
            state.countdownSec--;
            if (state.countdownSec <= 0) {
                clearInterval(state.timerInterval);
                if (clockEl) clockEl.textContent = '00:00';
                return;
            }
            const m = Math.floor(state.countdownSec / 60).toString().padStart(2, '0');
            const s = (state.countdownSec % 60).toString().padStart(2, '0');
            if (clockEl) clockEl.textContent = `${m}:${s}`;
        }, 1000);
    }

    function executePaymentDemo(methodName) {
        state.payment.method = methodName;
        state.payment.status = 'success';

        // Simulated Loading Process
        const overlay = document.getElementById('bob-booking-modal');
        const card = overlay.querySelector('.bob-modal-card');

        const loader = document.createElement('div');
        loader.id = 'bob-pay-loader';
        loader.style.cssText = `
            position: absolute; inset: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(4px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 1000; border-radius: 24px; gap: 14px;
        `;
        loader.innerHTML = `
            <div style="width:48px;height:48px;border:4px solid #e2e8f0;border-top-color:#2563eb;border-radius:50%;animation:bobSpin 0.8s linear infinite"></div>
            <div style="font-weight:800;font-size:16px;color:#0f172a">Memverifikasi Pembayaran...</div>
            <div style="font-size:12px;color:#64748b">Menghubungi sistem bank &amp; menerbitkan E-Tiket Bob Travel</div>
            <style>@keyframes bobSpin { to { transform: rotate(360deg); } }</style>
        `;

        card.style.position = 'relative';
        card.appendChild(loader);

        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
            renderETicket();
            updateStepIndicator(4);
        }, 1200);
    }

    function renderETicket() {
        const total = state.seatPrice * state.selectedSeats.length;
        document.getElementById('bob-tkt-code').textContent = state.bookingCode;
        document.getElementById('bob-tkt-name').textContent = state.passenger.name;
        document.getElementById('bob-tkt-route').textContent = `${state.origin} ➔ ${state.destination}`;
        document.getElementById('bob-tkt-datetime').textContent = `${formatDateIndo(state.date)} • ${state.schedule ? state.schedule.departureTime : '07:30'} WIB`;
        document.getElementById('bob-tkt-vehicle').textContent = state.schedule ? state.schedule.vehicle : 'Toyota HiAce Premio Executive';
        document.getElementById('bob-tkt-seat').textContent = `Kursi ${state.selectedSeats.join(', ')}`;
        document.getElementById('bob-tkt-pickup').textContent = state.passenger.pickup;
        document.getElementById('bob-tkt-dropoff').textContent = state.passenger.dropoff;
        document.getElementById('bob-tkt-total').textContent = formatRupiah(total);

        const badge = document.getElementById('bob-ticket-status-badge');
        if (state.payment.method === 'cash') {
            badge.textContent = 'RESERVASI TERKONFIRMASI (BAYAR DI POOL)';
            badge.style.background = '#d97706';
        } else {
            badge.textContent = 'LUNAS / CONFIRMED';
            badge.style.background = '#22c55e';
        }
    }

    function bindModalEvents() {
        const overlay = document.getElementById('bob-booking-modal');
        const closeBtn = document.getElementById('bob-modal-close-btn');

        // Close modal
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Seat click
        overlay.querySelectorAll('.bob-seat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                const seat = btn.dataset.seat;
                const idx = state.selectedSeats.indexOf(seat);
                if (idx > -1) {
                    if (state.selectedSeats.length > 1) {
                        state.selectedSeats.splice(idx, 1);
                    } else {
                        showToast('Minimal pilih 1 kursi perjalanan.');
                    }
                } else {
                    state.selectedSeats.push(seat);
                }
                updateSeatMap();
            });
        });

        // Step 2 buttons
        document.getElementById('bob-back-to-step1').addEventListener('click', () => updateStepIndicator(1));
        document.getElementById('bob-go-to-step3').addEventListener('click', goToStep3);

        // Step 3 buttons
        document.getElementById('bob-back-to-step2').addEventListener('click', () => updateStepIndicator(2));

        // Payment Tabs
        overlay.querySelectorAll('.bob-pay-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                overlay.querySelectorAll('.bob-pay-tab').forEach(t => t.classList.remove('is-active'));
                overlay.querySelectorAll('.bob-pay-content').forEach(c => c.classList.remove('is-active'));
                tab.classList.add('is-active');
                const target = document.getElementById(`bob-paycontent-${tab.dataset.paytab}`);
                if (target) target.classList.add('is-active');
            });
        });

        // Bank VA selection
        overlay.querySelectorAll('.bob-va-box .bob-date-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.querySelectorAll('.bob-va-box .bob-date-pill').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                const bank = btn.dataset.bank;
                const vaDisplay = document.getElementById('bob-va-display');
                if (bank === 'Mandiri') {
                    vaDisplay.textContent = '8920 0812 2874 6964';
                } else if (bank === 'BRI') {
                    vaDisplay.textContent = '1289 0812 2874 6964';
                } else {
                    vaDisplay.textContent = '8271 0812 2874 6964';
                }
            });
        });

        // Copy VA Button
        document.getElementById('bob-copy-va-btn').addEventListener('click', () => {
            const num = document.getElementById('bob-va-display').textContent;
            navigator.clipboard.writeText(num.replace(/\s+/g, '')).then(() => {
                showToast('Nomor Virtual Account berhasil disalin!');
            }).catch(() => {
                showToast('Nomor VA disalin: ' + num);
            });
        });

        // Pay Actions
        document.getElementById('bob-btn-pay-qris').addEventListener('click', () => executePaymentDemo('qris'));
        document.getElementById('bob-btn-pay-va').addEventListener('click', () => executePaymentDemo('va'));
        document.getElementById('bob-btn-pay-ewallet').addEventListener('click', () => executePaymentDemo('ewallet'));
        document.getElementById('bob-btn-pay-cash').addEventListener('click', () => executePaymentDemo('cash'));

        // Step 4 Actions
        document.getElementById('bob-btn-print-ticket').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('bob-btn-wa-ticket').addEventListener('click', () => {
            showToast(`E-Tiket & Kode ${state.bookingCode} berhasil dikirim ke WhatsApp ${state.passenger.phone}!`);
        });

        document.getElementById('bob-btn-finish-modal').addEventListener('click', () => {
            closeModal();
            showToast('Pemesanan selesai! Selamat menikmati perjalanan bersama Bob Travel.');
        });
    }

    function openModal(options = {}) {
        createModalDom();

        if (options.origin) state.origin = options.origin;
        if (options.destination) state.destination = options.destination;
        if (options.date) state.date = options.date;
        if (options.time) state.time = options.time;
        if (options.tripType) state.tripType = options.tripType;

        // Update header & summary
        document.getElementById('bob-summary-orig').textContent = state.origin;
        document.getElementById('bob-summary-dest').textContent = state.destination;
        document.getElementById('bob-summary-trip').textContent = state.tripType === 'roundtrip' ? 'Pulang Pergi' : 'Sekali Jalan';
        document.getElementById('bob-summary-date-text').textContent = formatDateIndo(state.date);

        // Render Step 1
        renderQuickDates();
        renderSchedules();
        updateStepIndicator(1);

        const overlay = document.getElementById('bob-booking-modal');
        overlay.style.display = 'flex';
        overlay.style.pointerEvents = 'auto';
        overlay.style.visibility = 'visible';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const overlay = document.getElementById('bob-booking-modal');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.style.pointerEvents = 'none';
            overlay.style.visibility = 'hidden';
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
        if (state.timerInterval) clearInterval(state.timerInterval);
    }

    // Expose Global API
    window.BobBooking = {
        open: openModal,
        close: closeModal
    };

    // Auto-hook elements on page
    document.addEventListener('DOMContentLoaded', () => {
        createModalDom();

        // 1. Hook hero search button
        const searchBtn = document.getElementById('search-schedule');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const origEl = document.getElementById('departure-from');
                const destEl = document.getElementById('destination-form');
                const dateEl = document.getElementById('date-form');
                const timeEl = document.getElementById('time-form');
                const roundtripRadio = document.getElementById('trip-roundtrip');

                const orig = (origEl && origEl.value.trim()) ? origEl.value.trim() : 'Jakarta';
                const dest = (destEl && destEl.value.trim()) ? destEl.value.trim() : 'Solo';
                const date = (dateEl && dateEl.value.trim()) ? dateEl.value.trim() : new Date().toISOString().split('T')[0];
                const time = (timeEl && timeEl.value.trim()) ? timeEl.value.trim() : '07:30';
                const tripType = (roundtripRadio && roundtripRadio.checked) ? 'roundtrip' : 'oneway';

                openModal({ origin: orig, destination: dest, date, time, tripType });
            });
        }

        // 2. Hook promo cards "Pilih" buttons
        document.querySelectorAll('.promo-carousel button, li[id^="v-0-12-3-0-0-"] button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal({ origin: 'Jakarta', destination: 'Bandung', tripType: 'oneway' });
            });
        });

        // 3. Hook package cards "Pesan Sekarang" buttons
        document.querySelectorAll('.package-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal({ origin: 'Jakarta', destination: 'Solo', tripType: 'oneway' });
            });
        });

        // 4. Hook route cards on rute.html
        document.querySelectorAll('.route-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const orig = card.dataset.origin || 'Jakarta';
                const dest = card.dataset.dest || 'Solo';
                openModal({ origin: orig, destination: dest });
            });
        });

        // 5. Hook filter-btn on rute.html
        const filterBtn = document.getElementById('filter-btn');
        if (filterBtn) {
            const origSel = document.getElementById('filter-origin');
            const destSel = document.getElementById('filter-destination');
            const dateInp = document.getElementById('filter-date');
            filterBtn.addEventListener('dblclick', () => {
                const orig = origSel ? origSel.value : 'Jakarta';
                const dest = destSel ? destSel.value : 'Solo';
                const date = dateInp ? dateInp.value : '';
                openModal({ origin: orig || 'Jakarta', destination: dest || 'Solo', date });
            });
        }

        // 6. Check URL query params for auto-open
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('book') === '1' || urlParams.get('open_booking') === '1') {
            const orig = urlParams.get('origin') || 'Jakarta';
            const dest = urlParams.get('destination') || 'Solo';
            const date = urlParams.get('date');
            openModal({ origin: orig, destination: dest, date });
        }
    });
})();
