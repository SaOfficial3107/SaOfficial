// ============================================
// 1. PREMIUM LOADING (Đã sửa khớp với HTML mới)
// ============================================
(function() {
    const digit1 = document.getElementById('digit1');
    const digit2 = document.getElementById('digit2');
    const digit3 = document.getElementById('digit3');
    const barEl = document.getElementById('loaderBar');
    const loader = document.getElementById('loader');
    
    if (!digit1) return; 
    
    let count = 0;
    const duration = 2800;
    const steps = 100;
    const intervalTime = duration / steps;
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const interval = setInterval(() => {
        count++;
        const displayCount = Math.floor(easeOutQuart(count / steps) * 100);
        const padded = displayCount.toString().padStart(3, '0');
        
        digit1.textContent = padded[0];
        digit2.textContent = padded[1];
        digit3.textContent = padded[2];
        if (barEl) barEl.style.width = `${displayCount}%`;
        
        if (count >= steps) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                initAnimations();
            }, 600);
        }
    }, intervalTime);
    document.body.style.overflow = 'hidden';
})();

// ============================================
// 2. NAVBAR SCROLL
// ============================================
(function() {
    const navbar = document.getElementById('nav'); // Đã sửa từ .nav-premium
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 80);
    });
})();

// ============================================
// 3. SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// 4. SCROLL REVEAL & COUNTER
// ============================================
function initAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.value);
                const suffix = el.dataset.suffix || '';
                const duration = 2000;
                const startTime = performance.now();
                const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                
                const animate = (currentTime) => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const current = Math.floor(easeOutQuart(progress) * target);
                    el.textContent = current + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target + suffix;
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-value]').forEach(el => counterObserver.observe(el));
}

// ============================================
// 5. CUSTOM CURSOR
// ============================================
(function() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.matchMedia('(max-width: 768px)').matches) return;
    
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    const trail = document.getElementById('cursorTrail');
    
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, trailX = 0, trailY = 0;
    let isMoving = false, trailTimeout;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY; isMoving = true;
        dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
        clearTimeout(trailTimeout);
        trailTimeout = setTimeout(() => { isMoving = false; }, 100);
    });
    
    function animate() {
        ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
        trailX += (mouseX - trailX) * 0.08; trailY += (mouseY - trailY) * 0.08;
        trail.style.left = trailX + 'px'; trail.style.top = trailY + 'px';
        trail.style.opacity = isMoving ? '0.6' : '0';
        requestAnimationFrame(animate);
    }
    animate();
    
    document.querySelectorAll('[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
})();

// ============================================
// 6. SPOTLIGHT & MAGNETIC & TILT
// ============================================
(function() {
    const spotlight = document.getElementById('spotlight');
    if (spotlight && !window.matchMedia('(max-width: 768px)').matches) {
        document.addEventListener('mousemove', (e) => {
            spotlight.style.left = e.clientX + 'px';
            spotlight.style.top = e.clientY + 'px';
        });
    }
    
    if (!window.matchMedia('(max-width: 768px)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.3}px, ${(e.clientY - rect.top - rect.height / 2) * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
        });

        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
                const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
})();

// ============================================
// 7. PARALLAX & HORIZONTAL SCROLL
// ============================================
(function() {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && !window.matchMedia('(max-width: 1024px)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            heroVisual.querySelectorAll('.visual-ring').forEach((ring, i) => {
                ring.style.transform = `translate(${x * (i + 1) * 0.4}px, ${y * (i + 1) * 0.4}px)`;
            });
        });
    }

    const slider = document.querySelector('.work-horizontal');
    if (slider) {
        let isDown = false, startX, scrollLeft;
        slider.addEventListener('mousedown', (e) => {
            isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 2;
        });
        slider.style.cursor = 'grab';
    }
})();

// Console Branding
console.log('%c DORIS/CCM ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
console.log('%cRoblox Content Creator Manager', 'color: #888; font-size: 12px; letter-spacing: 2px;');
