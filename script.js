// =========================================
// CINEMATIC LOADING COUNTER
// =========================================
(function() {
    const counterEl = document.getElementById('counter');
    const loader = document.getElementById('loader');
    let count = 0;
    const duration = 2500; // 2.5 giây total
    const intervalTime = duration / 100;
    
    const interval = setInterval(() => {
        count++;
        counterEl.textContent = count;
        
        if (count >= 100) {
            clearInterval(interval);
            // Đợi 300ms sau khi đạt 100% rồi mới fade out
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 300);
        }
    }, intervalTime);
})();

// =========================================
// TYPING EFFECT
// =========================================
const texts = [
    "Full Stack Developer ",
    "UI/UX Enthusiast 🎨",
    "Problem Solver 🧩",
    "Coffee Lover ☕"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing');

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

type();

// =========================================
// SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =========================================
// SCROLL REVEAL ANIMATION
// =========================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    observer.observe(el);
});

// Console Easter Egg
console.log('%c Hey there, curious developer!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cInterested in my code? Let\'s connect!', 'font-size: 14px; color: #ec4899;');
