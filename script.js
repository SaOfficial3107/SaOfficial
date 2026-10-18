document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // SAFETY: Loader LUÔN ẩn sau 3.5 giây
    // =========================================
    const loader = document.getElementById('loader');
    let loaderHidden = false;
    
    function hideLoader() {
        if (loaderHidden) return;
        loaderHidden = true;
        if (loader) {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        // Khởi động reveal animations sau khi loader ẩn
        setTimeout(initRevealAnimations, 200);
    }
    
    // Fallback: forced hide sau 3.5 giây
    const safetyTimer = setTimeout(hideLoader, 3500);

    // =========================================
    // LOADER SCRAMBLE + PROGRESS
    // =========================================
    try {
        const progress = document.getElementById('loaderProgress');
        const percent = document.getElementById('loaderPercent');
        const scrambleText = document.getElementById('scrambleText');
        
        if (scrambleText) {
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            const targetText = 'SA';
            let frame = 0;
            
            function scramble() {
                let output = '';
                for (let i = 0; i < targetText.length; i++) {
                    if (frame > 20 + i * 10) {
                        output += targetText[i];
                    } else {
                        output += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                scrambleText.textContent = output;
                
                if (output === targetText) {
                    // Start progress bar
                    let width = 0;
                    const interval = setInterval(() => {
                        width += Math.random() * 5;
                        if (width >= 100) {
                            width = 100;
                            clearInterval(interval);
                            clearTimeout(safetyTimer);
                            setTimeout(hideLoader, 400);
                        }
                        if (progress) progress.style.width = width + '%';
                        if (percent) percent.textContent = Math.floor(width) + '%';
                    }, 40);
                } else {
                    frame++;
                    requestAnimationFrame(scramble);
                }
            }
            scramble();
        } else {
            hideLoader();
        }
    } catch(e) {
        console.log('Loader error:', e);
        hideLoader();
    }
    
    document.body.style.overflow = 'hidden';

    // =========================================
    // HORIZONTAL SCROLLBAR
    // =========================================
    const hScrollbar = document.getElementById('hScrollbar');
    const scrollPercentLabel = document.getElementById('scrollPercent');
    const hScrollbarLabel = document.querySelector('.horizontal-scrollbar-label');
    
    window.addEventListener('scroll', () => {
        try {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            if (hScrollbar) hScrollbar.style.width = pct + '%';
            if (scrollPercentLabel) scrollPercentLabel.textContent = Math.floor(pct) + '%';
            if (hScrollbarLabel) {
                hScrollbarLabel.classList.toggle('visible', scrollTop > 100);
            }
        } catch(e) {}
    }, { passive: true });

    // =========================================
    // CURSOR
    // =========================================
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    
    if (dot && ring && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });
        
        document.querySelectorAll('a, button, [data-hover], .copy-email').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
        
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // =========================================
    // SPOTLIGHT EFFECT (CHO TẤT CẢ CARDS)
    // =========================================
    document.querySelectorAll('.prof-card, .service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
        });
    });

    // =========================================
    // HERO CANVAS PARTICLES
    // =========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && window.innerWidth > 768) {
        try {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let cmx = 0, cmy = 0;
            
            function resize() {
                const hero = document.getElementById('hero');
                if (hero) { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; }
            }
            resize();
            window.addEventListener('resize', resize);
            
            const heroEl = document.getElementById('hero');
            if (heroEl) {
                heroEl.addEventListener('mousemove', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    cmx = e.clientX - rect.left;
                    cmy = e.clientY - rect.top;
                });
            }
            
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    sx: (Math.random() - 0.5) * 0.3,
                    sy: (Math.random() - 0.5) * 0.3
                });
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p, i) => {
                    p.x += p.sx; p.y += p.sy;
                    if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.sy *= -1;
                    
                    const dx = cmx - p.x, dy = cmy - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) { p.x -= dx * 0.01; p.y -= dy * 0.01; }
                    
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                    
                    for (let j = i+1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const d = Math.sqrt((p.x-p2.x)**2 + (p.y-p2.y)**2);
                        if (d < 100) {
                            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - d/100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                        }
                    }
                });
                requestAnimationFrame(animate);
            }
            animate();
        } catch(e) { console.log('Canvas error:', e); }
    }

    // =========================================
    // REVEAL ANIMATIONS (IntersectionObserver)
    // =========================================
    function initRevealAnimations() {
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        } catch(e) {
            console.log('Observer error:', e);
            // Fallback: hiện tất cả
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }
    }

    // =========================================
    // NAVBAR SCROLL
    // =========================================
    const navbar = document.getElementById('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const h = this.getAttribute('href');
            if (h === '#' || h.length < 2) return;
            e.preventDefault();
            const t = document.querySelector(h);
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    // =========================================
    // AD STICKY
    // =========================================
    const stickyAd = document.getElementById('stickyAd');
    const closeAdBtn = document.getElementById('closeAdBtn');
    if (stickyAd && closeAdBtn && window.innerWidth > 1024) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) stickyAd.classList.add('visible');
        }, { passive: true });
        closeAdBtn.addEventListener('click', () => { stickyAd.style.display = 'none'; });
    }

    // =========================================
    // COPY EMAIL
    // =========================================
    document.querySelectorAll('.copy-email').forEach(card => {
        card.addEventListener('click', async (e) => {
            e.stopPropagation();
            const email = card.getAttribute('data-email');
            const icon = card.querySelector('.cc-arrow i');
            const emailText = card.querySelector('.email-text');
            if (!email || !icon || !emailText) return;
            
            const origText = emailText.textContent;
            const origIcon = icon.className;
            
            try {
                await navigator.clipboard.writeText(email);
                icon.className = 'fas fa-check';
                emailText.textContent = 'Copied!';
                setTimeout(() => {
                    icon.className = origIcon;
                    emailText.textContent = origText;
                }, 2000);
            } catch(err) { console.log('Copy failed'); }
        });
    });

    console.log('%c SA OFFICIAL ', 'background: #000; color: #fff; font-size: 20px; padding: 10px 20px; font-family: serif;');
});
