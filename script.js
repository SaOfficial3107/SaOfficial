document.addEventListener("DOMContentLoaded", () => {
    // PARTICLE SYSTEM
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.2 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.015 + 0.008;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY; this.pulse += this.pulseSpeed;
            const dx = this.x - mouseX, dy = this.y - mouseY, dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) { const force = (150 - dist) / 150; this.x += (dx/dist) * force * 0.3; this.y += (dy/dist) * force * 0.3; }
            if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            const o = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255,255,255,${o})`; ctx.fill();
            if (this.size > 0.8) { ctx.beginPath(); ctx.arc(this.x, this.y, this.size*2.5, 0, Math.PI*2); ctx.fillStyle = `rgba(255,255,255,${o*0.08})`; ctx.fill(); }
        }
    }

    const pc = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    for (let i = 0; i < pc; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < 100) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(255,255,255,${(1-dist/100)*0.1})`; ctx.lineWidth = 0.5; ctx.stroke(); }
            }
        }
    }

    function animateParticles() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p => { p.update(); p.draw(); }); drawConnections(); requestAnimationFrame(animateParticles); }
    animateParticles();
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    // TEXT SCRAMBLE
    class TextScramble {
        constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this); }
        setText(newText) {
            const oldText = this.el.innerText, length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) { const from = oldText[i] || '', to = newText[i] || '', s = Math.floor(Math.random()*40), e = s + Math.floor(Math.random()*40); this.queue.push({ from, to, start: s, end: e }); }
            cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise;
        }
        update() {
            let output = '', complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) { complete++; output += to; }
                else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span class="scramble-char">${char}</span>`; }
                else output += from;
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) this.resolve();
            else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
        }
        randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
    }

    const loader = document.getElementById('loader');
    if (loader) {
        const sm = new TextScramble(document.getElementById('scrambleText'));
        const ss = new TextScramble(document.getElementById('scrambleSub'));
        setTimeout(() => { sm.setText('SA').then(() => { setTimeout(() => { ss.setText('CREATOR · DEVELOPER · ARTIST · PRODUCER'); }, 300); }); }, 500);
        setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = 'auto'; initAnimations(); }, 3500);
        document.body.style.overflow = 'hidden';
    }

    const navbar = document.getElementById('nav');
    if (navbar) window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const h = this.getAttribute('href'); if (h === '#' || h.length < 2) return;
            e.preventDefault(); const t = document.querySelector(h);
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    function initAnimations() {
        const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }

    const cursor = document.getElementById('cursor');
    if (cursor && window.innerWidth > 768) {
        const dot = cursor.querySelector('.cursor-dot'), ring = cursor.querySelector('.cursor-ring'), trail = document.getElementById('cursorTrail');
        let mx = 0, my = 0, rx = 0, ry = 0, tx = 0, ty = 0, moving = false, tt;
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; moving = true; dot.style.left = mx+'px'; dot.style.top = my+'px'; clearTimeout(tt); tt = setTimeout(() => { moving = false; }, 100); });
        function anim() { rx += (mx-rx)*0.15; ry += (my-ry)*0.15; ring.style.left = rx+'px'; ring.style.top = ry+'px'; tx += (mx-tx)*0.08; ty += (my-ty)*0.08; trail.style.left = tx+'px'; trail.style.top = ty+'px'; trail.style.opacity = moving ? '0.6' : '0'; requestAnimationFrame(anim); }
        anim();
        document.querySelectorAll('[data-hover]').forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('hover')); el.addEventListener('mouseleave', () => cursor.classList.remove('hover')); });
    }

    const spotlight = document.getElementById('spotlight');
    if (spotlight && window.innerWidth > 768) document.addEventListener('mousemove', (e) => { spotlight.style.left = e.clientX+'px'; spotlight.style.top = e.clientY+'px'; });

    if (window.innerWidth > 768) {
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.transform = `perspective(1000px) rotateX(${((e.clientY-r.top-r.height/2)/(r.height/2))*-5}deg) rotateY(${((e.clientX-r.left-r.width/2)/(r.width/2))*5}deg) scale3d(1.02,1.02,1.02)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'; });
        });
    }

    console.log('%c SA OFFICIAL ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
});
