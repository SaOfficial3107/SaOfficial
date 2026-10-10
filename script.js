document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 100x UPGRADE: CINEMATIC LOADER
    // =========================================
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const percent = document.getElementById('loaderPercent');
    const scrambleText = document.getElementById('scrambleText');
    
    // Text Scramble Effect
    class TextScramble {
        constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this); }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '', to = newText[i] || '';
                const start = Math.floor(Math.random() * 40), end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise;
        }
        update() {
            let output = '', complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) { complete++; output += to; }
                else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span style="color:var(--accent)">${char}</span>`; }
                else output += from;
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) this.resolve();
            else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
        }
        randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
    }

    if (loader) {
        const scrambler = new TextScramble(scrambleText);
        scrambler.setText('SA').then(() => {
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 3;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.classList.add('hidden');
                        document.body.style.overflow = 'auto';
                        initScrollAnimations();
                    }, 600);
                }
                progress.style.width = width + '%';
                percent.textContent = Math.floor(width) + '%';
            }, 30);
        });
        document.body.style.overflow = 'hidden';
    }

    // =========================================
    // CUSTOM CURSOR
    // =========================================
    const cursor = document.getElementById('cursor');
    if (cursor && window.innerWidth > 768) {
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
        
        function anim() {
            rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
            ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
            requestAnimationFrame(anim);
        }
        anim();
        
        document.querySelectorAll('[data-hover]').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // =========================================
    // MAGNETIC BUTTONS
    // =========================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
        });

        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.transform = `perspective(1000px) rotateX(${((e.clientY-r.top-r.height/2)/(r.height/2))*-5}deg) rotateY(${((e.clientX-r.left-r.width/2)/(r.width/2))*5}deg) scale3d(1.02,1.02,1.02)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'; });
        });
    }

    // =========================================
    // SCROLL ANIMATIONS
    // =========================================
    function initScrollAnimations() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
    }

    // =========================================
    // NAVBAR SCROLL & SMOOTH SCROLL
    // =========================================
    const navbar = document.getElementById('nav');
    if (navbar) window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const h = this.getAttribute('href'); if (h === '#' || h.length < 2) return;
            e.preventDefault(); const t = document.querySelector(h);
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    console.log('%c SA OFFICIAL ', 'background: #000; color: #a78bfa; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
});
