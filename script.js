document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    // 💰 HARD CODE DỮ LIỆU - SỬA TRỰC TIẾP Ở ĐÂY
    // ============================================
    
    // Lịch sử số dư - Thêm entry mới theo format: { date: 'YYYY-MM-DD', value: số_tiền, note: 'ghi_chú' }
    // Sắp xếp theo thời gian (cũ → mới)
    const portfolioHistory = [
        { date: '2026-01-01', value: 0, note: 'Bắt đầu theo dõi' },
        { date: '2026-01-15', value: 100, note: 'Nhận donate đầu tiên' },
        { date: '2026-02-01', value: 250, note: 'Tháng 2' },
        { date: '2026-03-01', value: 180, note: 'Tháng 3' },
        { date: '2026-10-10', value: 500, note: 'Hôm nay' }  // ← Thêm entry mới ở đây
    ];

    // Top 10 người donate - Sắp xếp theo amount giảm dần
    const donators = [
        { name: 'Alex Gaming', amount: 500 },
        { name: 'Maria Art', amount: 350 },
        { name: 'John Dev', amount: 200 },
        { name: 'Sarah Music', amount: 150 },
        { name: 'Mike Roblox', amount: 100 },
        { name: 'Emma Creator', amount: 80 },
        { name: 'David Fan', amount: 50 },
        { name: 'Lisa Supporter', amount: 30 },
        { name: 'Tom Viewer', amount: 20 },
        { name: 'Anonymous', amount: 10 }
    ];

    // ============================================
    // 🌌 PARTICLE SYSTEM
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
    // 💰 PORTFOLIO CHART - HARDCODED
    // ============================================
    function formatCurrency(value) {
        return '$' + value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    function shortDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
    }

    // Update current balance display
    function updateBalanceDisplay() {
        const current = portfolioHistory[portfolioHistory.length - 1];
        const previous = portfolioHistory.length > 1 ? portfolioHistory[portfolioHistory.length - 2] : null;
        
        const totalEl = document.getElementById('cryptoTotal');
        const changeEl = document.getElementById('cryptoChange');
        const changeValueEl = document.getElementById('changeValue');
        const changePercentEl = document.getElementById('changePercent');
        
        if (totalEl) totalEl.textContent = formatCurrency(current.value);
        
        if (previous && changeEl) {
            const change = current.value - previous.value;
            const percent = previous.value > 0 ? (change / previous.value * 100) : 0;
            
            if (changeValueEl) {
                changeValueEl.textContent = (change >= 0 ? '+' : '') + formatCurrency(change);
            }
            if (changePercentEl) {
                changePercentEl.textContent = `(${change >= 0 ? '+' : ''}${percent.toFixed(2)}%)`;
            }
            
            if (change >= 0) {
                changeEl.classList.remove('negative');
                changeEl.querySelector('i').className = 'fas fa-arrow-up';
            } else {
                changeEl.classList.add('negative');
                changeEl.querySelector('i').className = 'fas fa-arrow-down';
            }
        }
    }

    // Update stats
    function updateStats() {
        const values = portfolioHistory.map(h => h.value);
        const high = Math.max(...values);
        const low = Math.min(...values);
        const first = portfolioHistory[0];
        
        const highEl = document.getElementById('statHigh');
        const lowEl = document.getElementById('statLow');
        const countEl = document.getElementById('statCount');
        const firstEl = document.getElementById('statFirst');
        
        if (highEl) highEl.textContent = formatCurrency(high);
        if (lowEl) lowEl.textContent = formatCurrency(low);
        if (countEl) countEl.textContent = portfolioHistory.length;
        if (firstEl) firstEl.textContent = first ? formatDate(first.date) : '—';
    }

    // Render chart
    let balanceChart = null;

    function renderChart() {
        const ctx = document.getElementById('balanceChart');
        if (!ctx) return;
        
        const labels = portfolioHistory.map(h => shortDate(h.date));
        const data = portfolioHistory.map(h => h.value);
        
        if (balanceChart) {
            balanceChart.destroy();
        }
        
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(167, 139, 250, 0.3)');
        gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
        
        balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Balance (USD)',
                    data: data,
                    borderColor: '#a78bfa',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#a78bfa',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#a78bfa',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#a78bfa',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 15,
                        titleFont: { family: 'JetBrains Mono', size: 12 },
                        bodyFont: { family: 'Playfair Display', size: 16, weight: 'bold' },
                        displayColors: false,
                        callbacks: {
                            title: function(items) {
                                const idx = items[0].dataIndex;
                                const note = portfolioHistory[idx].note;
                                return note ? `${formatDate(portfolioHistory[idx].date)} — ${note}` : formatDate(portfolioHistory[idx].date);
                            },
                            label: function(item) {
                                return formatCurrency(item.raw);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.04)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            font: { family: 'JetBrains Mono', size: 11 },
                            maxRotation: 45
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.04)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            font: { family: 'JetBrains Mono', size: 11 },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    updateBalanceDisplay();
    updateStats();
    renderChart();

    // ============================================
    // 💝 TOP DONATORS - HARDCODED
    // ============================================
    function renderTopList() {
        const topList = document.getElementById('topList');
        if (!topList) return;
        
        // Sort by amount descending
        const sorted = [...donators].sort((a, b) => b.amount - a.amount);
        
        topList.innerHTML = '';
        sorted.forEach((donor, index) => {
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

    console.log('%c SA OFFICIAL ', 'background: #000; color: #fff; font-size: 24px; padding: 15px 25px; font-family: serif; border: 1px solid #333;');
    console.log('%cCreator · Developer · Artist · Producer', 'color: #888; font-size: 12px; letter-spacing: 2px;');
});
