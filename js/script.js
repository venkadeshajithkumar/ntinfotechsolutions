/**
 * NT Infotech Solutions — Premium Interactions
 * Particle canvas, parallax tilt, typed text, scroll reveal, stats counter, FAQ, form
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // ───────────────────────────────────────────
    // 1. HEADER SCROLL EFFECT
    // ───────────────────────────────────────────
    const handleHeaderScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ───────────────────────────────────────────
    // 2. MOBILE MENU
    // ───────────────────────────────────────────
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ───────────────────────────────────────────
    // 3. PARTICLE CANVAS (HERO)
    // ───────────────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(true); }
            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : canvas.height + 10;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = -(Math.random() * 0.8 + 0.2);
                this.opacity = Math.random() * 0.6 + 0.2;
                this.color = Math.random() > 0.5 ? '45, 172, 227' : '0, 245, 212';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.y < -10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: 80 }, () => new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(45, 172, 227, ${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            animFrame = requestAnimationFrame(animate);
        };

        init();
        animate();
        window.addEventListener('resize', init, { passive: true });
    }

    // ───────────────────────────────────────────
    // 4. TYPED TEXT ANIMATION
    // ───────────────────────────────────────────
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'Expert IT Repairs & Support.',
            'Tailored Network Solutions.',
            'Secure Cybersecurity Services.',
            'Custom Software Development.',
            '24×7 Remote Assistance.',
        ];
        let pIdx = 0, cIdx = 0, isDeleting = false;

        const cursorEl = document.createElement('span');
        cursorEl.className = 'typed-cursor';
        typedEl.parentNode.insertBefore(cursorEl, typedEl.nextSibling);

        const typeLoop = () => {
            const current = phrases[pIdx];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, cIdx - 1);
                cIdx--;
            } else {
                typedEl.textContent = current.substring(0, cIdx + 1);
                cIdx++;
            }
            let delay = isDeleting ? 50 : 80;
            if (!isDeleting && cIdx === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && cIdx === 0) {
                isDeleting = false;
                pIdx = (pIdx + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(typeLoop, delay);
        };
        setTimeout(typeLoop, 1200);
    }

    // ───────────────────────────────────────────
    // 5. SCROLL REVEAL (STAGGERED)
    // ───────────────────────────────────────────
    const revealObserverCfg = { rootMargin: '0px 0px -8% 0px', threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverCfg);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // Auto-add reveal to common sections/cards
    const autoReveal = document.querySelectorAll(
        '.q-card, .feature-item, .srv-card, .faq-item, .step-box, .service-list-item, .contact-card-simple'
    );
    autoReveal.forEach((el, i) => {
        if (!el.classList.contains('reveal-on-scroll')) {
            el.classList.add('reveal-on-scroll');
            // Stagger within parent
            const siblings = el.parentElement.children;
            const idx = Array.from(siblings).indexOf(el);
            if (idx > 0) el.style.transitionDelay = `${idx * 0.1}s`;
            revealObserver.observe(el);
        }
    });

    // ───────────────────────────────────────────
    // 6. ANIMATED STATS COUNTER
    // ───────────────────────────────────────────
    const counters = document.querySelectorAll('.counter-value');
    let hasCounted = false;
    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2200;
            const startTime = performance.now();
            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    };
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                runCounters();
            }
        }, { threshold: 0.3 }).observe(statsSection);
    }

    // ───────────────────────────────────────────
    // 7. CARD TILT EFFECT
    // ───────────────────────────────────────────
    document.querySelectorAll('.srv-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -6;
            const rotateY = ((x - cx) / cx) * 6;
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ───────────────────────────────────────────
    // 8. SCROLL TO TOP
    // ───────────────────────────────────────────
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('active', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ───────────────────────────────────────────
    // 9. FAQ ACCORDION
    // ───────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });
            if (!isActive) {
                question.classList.add('active');
                question.nextElementSibling.style.maxHeight = question.nextElementSibling.scrollHeight + 'px';
            }
        });
    });

    // ───────────────────────────────────────────
    // 10. CONTACT FORM VALIDATION
    // ───────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form-simple');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            let valid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                    input.addEventListener('input', () => input.classList.remove('error'), { once: true });
                }
            });
            if (!valid) {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('[type=submit]');
                submitBtn.textContent = 'Please fill all fields!';
                setTimeout(() => { submitBtn.innerHTML = 'Send Message'; }, 2000);
            }
        });
    }

    // ───────────────────────────────────────────
    // 11. DARK MODE TOGGLE
    // ───────────────────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // The <head> script already handles the initial flash, 
    // now just set the correct icon on load
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (themeIcon) {
        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            if (themeIcon) {
                if (newTheme === 'dark') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        });
    }
});
