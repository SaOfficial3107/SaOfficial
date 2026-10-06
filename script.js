document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    // 🌌 PARTICLE SYSTEM (ĐEN TRẮNG)
    // ============================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
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
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += (dx / dist) * force * 0.3;
                this.y += (dy / dist) * force * 0.3;
            }
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            ctx.fill();
            
            if (this.size > 0.8) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.08})`;
                ctx.fill();
            }
        }
    }
    
    const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    const opacity = (1 - dist / 100) * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // ============================================
    // TEXT SCRAMBLE EFFECT
    // ============================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const loader = document.getElementById('loader');
    if (loader) {
        const scrambleMain = new TextScramble(document.getElementById('scrambleText'));
        const scrambleSub = new TextScramble(document.getElementById('scrambleSub'));
        
        setTimeout(() => {
            scrambleMain.setText('SA').then(() => {
                setTimeout(() => {
                    scrambleSub.setText('CREATOR · DEVELOPER · ARTIST · PRODUCER');
                }, 300);
            });
        }, 500);

        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 3500);
        
        document.body.style.overflow = 'hidden';
    }

    // ============================================
    // NAVBAR SCROLL
    // ============================================
    const navbar = document.getElementById('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

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
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL
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
    }

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.getElementById('cursor');
    if (cursor && window.innerWidth > 768) {
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

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
            trailX += (mouseX - trailX) * 0.08; trailY += (mouseY - trailY) * 0.08;
            trail.style.left = trailX + 'px'; trail.style.top = trailY + 'px';
            trail.style.opacity = isMoving ? '0.6' : '0';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('[data-hover]').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ============================================
    // SPOTLIGHT
    // ============================================
    const spotlight = document.getElementById('spotlight');
    if (spotlight && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            spotlight.style.left = e.clientX + 'px';
            spotlight.style.top = e.clientY + 'px';
        });
    }

    // ============================================
    // 3D TILT
    // ============================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
                const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ============================================
    // 💰 CRYPTO BALANCE SYSTEM
    // ============================================
    const cryptoData = {
        BTC: { amount: 0.00000000, price: 67000 },
        ETH: { amount: 0.00000000, price: 3500 },
        SOL: { amount: 0.00000000, price: 180 },
        USDT: { amount: 0.00, price: 1 },
        BNB: { amount: 0.00000000, price: 600 },
        XRP: { amount: 0.00000000, price: 0.55 }
    };

    // Load from localStorage or use default
    const savedCrypto = localStorage.getItem('sa_crypto_data');
    if (savedCrypto) {
        try {
            const parsed = JSON.parse(savedCrypto);
            Object.keys(parsed).forEach(key => {
                if (cryptoData[key]) {
                    cryptoData[key].amount = parsed[key].amount;
                }
            });
        } catch(e) {}
    }

    function updateCryptoDisplay() {
        let total = 0;
        Object.keys(cryptoData).forEach(coin => {
            const item = document.querySelector(`.crypto-item[data-coin="${coin}"]`);
            if (item) {
                const amountEl = item.querySelector('.crypto-amount');
                const valueEl = item.querySelector('.crypto-value');
                const value = cryptoData[coin].amount * cryptoData[coin].price;
                total += value;
                
                const decimals = coin === 'USDT' ? 2 : 8;
                amountEl.textContent = cryptoData[coin].amount.toFixed(decimals);
                valueEl.textContent = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        });
        
        const totalEl = document.getElementById('cryptoTotal');
        if (totalEl) {
            totalEl.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    updateCryptoDisplay();

    // Edit Crypto Modal
    const editCryptoBtn = document.getElementById('editCryptoBtn');
    const cryptoModal = document.getElementById('cryptoModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSave = document.getElementById('modalSave');
    const cryptoModalBody = document.getElementById('cryptoModalBody');

    function openCryptoModal() {
        cryptoModalBody.innerHTML = '';
        Object.keys(cryptoData).forEach(coin => {
            const row = document.createElement('div');
            row.className = 'crypto-edit-row';
            row.innerHTML = `
                <label>${coin}</label>
                <input type="number" step="any" id="edit-${coin}" value="${cryptoData[coin].amount}" placeholder="Amount">
            `;
            cryptoModalBody.appendChild(row);
        });
        cryptoModal.classList.add('active');
    }

    function closeCryptoModal() {
        cryptoModal.classList.remove('active');
    }

    function saveCryptoData() {
        Object.keys(cryptoData).forEach(coin => {
            const input = document.getElementById(`edit-${coin}`);
            if (input) {
                cryptoData[coin].amount = parseFloat(input.value) || 0;
            }
        });
        localStorage.setItem('sa_crypto_data', JSON.stringify(cryptoData));
        updateCryptoDisplay();
        closeCryptoModal();
    }

    if (editCryptoBtn) editCryptoBtn.addEventListener('click', openCryptoModal);
    if (modalClose) modalClose.addEventListener('click', closeCryptoModal);
    if (modalCancel) modalCancel.addEventListener('click', closeCryptoModal);
    if (modalSave) modalSave.addEventListener('click', saveCryptoData);

    // ============================================
    // 💝 TOP DONATORS SYSTEM
    // ============================================
    const defaultDonators = [
        { name: 'Anonymous #1', amount: 100 },
        { name: 'Anonymous #2', amount: 75 },
        { name: 'Anonymous #3', amount: 50 },
        { name: 'Anonymous #4', amount: 40 },
        { name: 'Anonymous #5', amount: 30 },
        { name: 'Anonymous #6', amount: 25 },
        { name: 'Anonymous #7', amount: 20 },
        { name: 'Anonymous #8', amount: 15 },
        { name: 'Anonymous #9', amount: 10 },
        { name: 'Anonymous #10', amount: 5 }
    ];

    let donators = [];
    const savedDonators = localStorage.getItem('sa_donators');
    if (savedDonators) {
        try {
            donators = JSON.parse(savedDonators);
        } catch(e) {
            donators = [...defaultDonators];
        }
    } else {
        donators = [...defaultDonators];
    }

    // Sort by amount descending
    donators.sort((a, b) => b.amount - a.amount);

    function renderTopList() {
        const topList = document.getElementById('topList');
        if (!topList) return;
        
        topList.innerHTML = '';
        donators.forEach((donor, index) => {
            const item = document.createElement('div');
            item.className = `top-item top-${index + 1}`;
            item.innerHTML = `
                <div class="top-rank">#${index + 1}</div>
                <div class="top-name">${donor.name}</div>
                <div class="top-amount">$${donor.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            `;
            topList.appendChild(item);
        });
    }

    renderTopList();

    // Edit Donators Modal
    const editDonorsBtn = document.getElementById('editDonorsBtn');
    const donorsModal = document.getElementById('donorsModal');
    const donorsModalClose = document.getElementById('donorsModalClose');
    const donorsModalCancel = document.getElementById('donorsModalCancel');
    const donorsModalSave = document.getElementById('donorsModalSave');
    const donorsModalBody = document.getElementById('donorsModalBody');

    function openDonorsModal() {
        donorsModalBody.innerHTML = '';
        donators.forEach((donor, index) => {
            const row = document.createElement('div');
            row.className = 'crypto-edit-row';
            row.innerHTML = `
                <label>#${index + 1} Name</label>
                <input type="text" id="donor-name-${index}" value="${donor.name}" placeholder="Name">
                <label>#${index + 1} Amount ($)</label>
                <input type="number" step="0.01" id="donor-amount-${index}" value="${donor.amount}" placeholder="Amount">
            `;
            donorsModalBody.appendChild(row);
        });
        donorsModal.classList.add('active');
    }

    function closeDonorsModal() {
        donorsModal.classList.remove('active');
    }

    function saveDonorsData() {
        donators = [];
        for (let i = 0; i < 10; i++) {
            const nameInput = document.getElementById(`donor-name-${i}`);
            const amountInput = document.getElementById(`donor-amount-${i}`);
            if (nameInput && amountInput) {
                donators.push({
                    name: nameInput.value || `Anonymous #${i + 1}`,
                    amount: parseFloat(amountInput.value) || 0
                });
            }
        }
        donators.sort((a, b) => b.amount - a.amount);
        localStorage.setItem('sa_donators', JSON.stringify(donators));
        renderTopList();
        closeDonorsModal();
    }

    if (editDonorsBtn) editDonorsBtn.addEventListener('click', openDonorsModal);
    if (donorsModalClose) donorsModalClose.addEventListener('click', closeDonorsModal);
    if (donorsModalCancel) donorsModalCancel.addEventListener('click', closeDonorsModal);
    if (donorsModalSave) donorsModalSave.addEventListener('click', saveDonorsData);

    // Close modals on outside click
    [cryptoModal, donorsModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    console.log('%c SA OFFICIAL ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
    console.log('%cCreator · Developer · Artist · Producer', 'color: #888; font-size: 12px; letter-spacing: 2px;');
});
