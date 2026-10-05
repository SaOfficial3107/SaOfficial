// ============================================
// PREMIUM LOADING SEQUENCE
// ============================================
(function() {
    const counterEl = document.getElementById('counter');
    const barEl = document.getElementById('loaderBar');
    const loader = document.getElementById('loader');
    
    let count = 0;
    const duration = 2500;
    const steps = 100;
    const intervalTime = duration / steps;
    
    // Easing function for smooth counting
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const interval = setInterval(() => {
        count++;
        const progress = count / steps;
        const easedProgress = easeOutQuart(progress);
        const displayCount = Math.floor(easedProgress * 100);
        
        counterEl.textContent = displayCount.toString().padStart(3, '0');
        barEl.style.width = `${displayCount}%`;
        
        if (count >= steps) {
            clearInterval(interval);
            counterEl.textContent = '100';
            barEl.style.width = '100%';
            
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                initAnimations();
            }, 500);
        }
    }, intervalTime);
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
})();

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.nav-premium');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initAnimations() {
    const revealElements = document.querySelectorAll(
        '.work-card, .service-card, .contact-card, .hero-stat, .achievement'
    );
    
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.05}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
    
    // Animate stat counters
    animateCounters();
}

// ============================================
// STAT COUNTER ANIMATION
// ============================================
function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-value]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.value);
                const duration = 2000;
                const startTime = performance.now();
                
                const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutQuart(progress);
                    const current = Math.floor(easedProgress * target);
                    
                    el.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target;
                    }
                };
                
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(el => counterObserver.observe(el));
}

// ============================================
// PARALLAX EFFECT ON HERO VISUAL
// ============================================
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const rings = heroVisual.querySelectorAll('.visual-ring');
        rings.forEach((ring, index) => {
            const factor = (index + 1) * 0.5;
            ring.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        // Simple toggle - you can expand this with a full mobile menu
    });
}

// ============================================
// CONSOLE BRANDING
// ============================================
console.log('%c DORIS/CCM ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif;');
console.log('%cRoblox Content Creator Manager', 'color: #888; font-size: 12px; letter-spacing: 2px;');
console.log('%c— Built with precision —', 'color: #555; font-size: 11px; font-style: italic;');
