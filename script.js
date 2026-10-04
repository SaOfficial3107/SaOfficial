// =========================================
// TYPING EFFECT
// =========================================
const texts = [
    "Full Stack Developer 💻",
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

// =========================================
// LOADING SCREEN LOGIC
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Delay 1.5 giây để người dùng kịp thấy hiệu ứng loading
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Xóa hẳn khỏi DOM sau khi hiệu ứng mờ dần (0.8s) kết thúc
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 1500); 
});

// Console Easter Egg
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cInterested in my code? Let\'s connect!', 'font-size: 14px; color: #ec4899;');