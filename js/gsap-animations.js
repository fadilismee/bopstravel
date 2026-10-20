/**
 * Bop's Travel - High-Performance & Non-Destructive GSAP Animation Suite
 * Designed to work harmoniously with existing styles, carousels, and layout controllers.
 */
(() => {
    'use strict';

    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initGsapAnimations() {
        if (typeof gsap === 'undefined') return;

        // Register plugins
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        if (typeof ScrollToPlugin !== 'undefined') {
            gsap.registerPlugin(ScrollToPlugin);
        }

        /* ==========================================================================
           1. TOP SCROLL PROGRESS BAR (Silky smooth ScrollTrigger scrub)
           ========================================================================== */
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar && typeof ScrollTrigger !== 'undefined') {
            gsap.to(progressBar, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.25
                }
            });
        }

        if (prefersReducedMotion) return;

        /* ==========================================================================
           2. BRAND LOGO & NAV CTA MICRO-INTERACTIONS
           (Strictly preserves .topbar transform & navbar-reveal.js behavior)
           ========================================================================== */
        const brand = document.querySelector('.topbar .brand');
        const brandMark = document.querySelector('.topbar .brand-mark');
        if (brand && brandMark) {
            brand.addEventListener('mouseenter', () => {
                gsap.to(brandMark, {
                    rotation: '+=360',
                    duration: 0.55,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
        }

        const navCta = document.querySelector('.topbar .nav-cta');
        if (navCta) {
            // Gentle attention breathing pulse
            gsap.to(navCta, {
                scale: 1.03,
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            navCta.addEventListener('mouseenter', () => {
                gsap.to(navCta, { scale: 1.07, duration: 0.2, ease: 'back.out(2)' });
            });
            navCta.addEventListener('mouseleave', () => {
                gsap.to(navCta, { scale: 1.03, duration: 0.25, ease: 'power2.out' });
            });
        }

        /* ==========================================================================
           3. HERO SECTION CINEMATIC DRIFT & TEXT ENTRANCE
           ========================================================================== */
        const heroBanner = document.getElementById('hero-banner');
        if (heroBanner) {
            // Ken-Burns gentle cinematic zoom on hero background
            const heroImg = document.getElementById('hero-rotator');
            if (heroImg) {
                gsap.to(heroImg, {
                    scale: 1.05,
                    duration: 8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }

            // Headline & Subtitle smooth entrance (clears props immediately on completion)
            const h1 = heroBanner.querySelector('h1');
            const h3 = heroBanner.querySelector('h3, .hero-subtitle');
            if (h1 && h3) {
                const tl = gsap.timeline({
                    delay: 0.1,
                    onComplete: () => {
                        gsap.set([h1, h3], { clearProps: 'all' });
                    }
                });
                tl.fromTo(h1,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }
                );
                tl.fromTo(h3,
                    { y: 14, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
                    '-=0.4'
                );
            }

            // Swap icon spin on click
            const swapIcon = heroBanner.querySelector('img[alt="Swap Icon"]');
            if (swapIcon) {
                swapIcon.addEventListener('click', () => {
                    gsap.fromTo(swapIcon,
                        { rotation: 0 },
                        { rotation: 360, duration: 0.45, ease: 'back.out(1.5)', clearProps: 'transform' }
                    );
                });
            }

            // Search button micro-press
            const searchBtn = document.getElementById('search-schedule');
            if (searchBtn) {
                searchBtn.addEventListener('mouseenter', () => {
                    gsap.to(searchBtn, { scale: 1.04, duration: 0.2, ease: 'power1.out' });
                });
                searchBtn.addEventListener('mouseleave', () => {
                    gsap.to(searchBtn, { scale: 1, duration: 0.25, ease: 'power1.out' });
                });
                searchBtn.addEventListener('mousedown', () => {
                    gsap.to(searchBtn, { scale: 0.96, duration: 0.1 });
                });
                searchBtn.addEventListener('mouseup', () => {
                    gsap.to(searchBtn, { scale: 1.04, duration: 0.18 });
                });
            }
        }

        /* ==========================================================================
           4. SCROLLTRIGGER SECTION HEADER REVEALS
           ========================================================================== */
        if (typeof ScrollTrigger !== 'undefined') {
            const headings = document.querySelectorAll(
                '.reference-home h2, .routes-header h1, .fleet-header h1'
            );

            headings.forEach((heading) => {
                gsap.fromTo(heading,
                    { y: 22, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: heading,
                            start: 'top 88%',
                            once: true
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.65,
                        ease: 'power2.out',
                        onComplete: () => gsap.set(heading, { clearProps: 'transform,opacity' })
                    }
                );
            });

            // Floating CTA badge in download apps section
            const downloadTitle = document.getElementById('download-apps-title');
            if (downloadTitle) {
                const downloadSection = downloadTitle.closest('section') || downloadTitle.parentElement;
                if (downloadSection) {
                    const badge = downloadSection.querySelector('img');
                    if (badge) {
                        gsap.to(badge, {
                            y: -6,
                            duration: 2.2,
                            repeat: -1,
                            yoyo: true,
                            ease: 'sine.inOut'
                        });
                    }
                }
            }
        }

        /* ==========================================================================
           5. SMOOTH ANCHOR SCROLLING (ScrollToPlugin)
           ========================================================================== */
        if (typeof ScrollToPlugin !== 'undefined') {
            document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href="#!"])').forEach((link) => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    try {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            e.preventDefault();
                            gsap.to(window, {
                                duration: 0.75,
                                scrollTo: {
                                    y: targetEl,
                                    offsetY: 76
                                },
                                ease: 'power2.inOut'
                            });
                        }
                    } catch (err) {}
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGsapAnimations);
    } else {
        initGsapAnimations();
    }
})();
