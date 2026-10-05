// =========================================
// LOADING COUNTER
// =========================================
(function() {
    const counterEl = document.getElementById('counter');
    const loader = document.getElementById('loader');
    let count = 0;
    const duration = 2000;
    const intervalTime = duration / 100;
    
    const interval = setInterval(() => {
        count++;
        counterEl.textContent = count.toString().padStart(3, '0');
        
        if (count >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 400);
        }
    }, intervalTime);
})();

// =========================================
// LIVE CLOCK
// =========================================
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 1000);

// =========================================
// SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =========================================
// SCROLL REVEAL
// =========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.game-row, .contact-card, .bento-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Console
console.log('%c DORIS/CCM ', 'background: #000; color: #fff; font-size: 20px; padding: 10px;');
console.log('%cRoblox Content Creator Manager', 'color: #666;');
