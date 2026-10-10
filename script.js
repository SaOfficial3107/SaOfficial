document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 100x EFFECT: MOUSE TRACKING FOR SPOTLIGHT CARDS
    // =========================================
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // =========================================
    // 100x EFFECT: ADVANCED CURSOR WITH TRAIL
    // =========================================
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const trail = document.getElementById('cursorTrail');
    
    if (dot && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        document.querySelectorAll('[data-hover], a, button').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            trailX += (mouseX - trailX) * 0.08;
            trailY += (mouseY - trailY) * 0.08;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // =========================================
    // 100x EFFECT: INTERACTIVE HERO CANVAS PARTICLES
    // =========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && window.innerWidth > 768) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let canvasMouseX = 0, canvasMouseY = 0;

        function resizeCanvas() {
            const hero = document.getElementById('hero');
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.getElementById('hero').addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            canvasMouseX = e.clientX - rect.left;
            canvasMouseY = e.clientY - rect.top;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction
                const dx = canvasMouseX - this.x;
                const dy = canvasMouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                // Draw connections
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // =========================================
    // CINEMATIC LOADER
    // =========================================
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const percent = document.getElementById('loaderPercent');
    const scrambleText = document.getElementById('scrambleText');
    
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
                else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span style="color:var(--fg)">${char}</span>`; }
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
                width += Math.random() * 4;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.classList.add('hidden');
                        document.body.style.overflow = 'auto';
                        initScrollAnimations();
                    }, 500);
                }
                progress.style.width = width + '%';
                percent.textContent = Math.floor(width) + '%';
            }, 30);
        });
        document.body.style.overflow = 'hidden';
    }

    // =========================================
    // MAGNETIC BUTTONS & 3D TILT
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

        document.querySelectorAll('.tilt-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.transform = `perspective(1000px) rotateX(${((e.clientY-r.top-r.height/2)/(r.height/2))*-8}deg) rotateY(${((e.clientX-r.left-r.width/2)/(r.width/2))*8}deg) scale3d(1.03,1.03,1.03)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'; });
        });
    }

    // =========================================
    // CINEMATIC SCROLL ANIMATIONS
    // =========================================
    function initScrollAnimations() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
        
        document.querySelectorAll('.reveal-cinematic').forEach(el => obs.observe(el));
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

    console.log('%c SA OFFICIAL ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
});
