// === ELENA GREBENTSOVA LANDING - SCRIPT.JS ===
// Современные анимации и интерактивные эффекты

// === КОНФИГУРАЦИЯ ===
const CONFIG = {
    typingSpeed: 100,
    typingDelay: 2000,
    particlesCount: 50,
    animationDelay: 100,
    scrollThreshold: 0.1
};

// === DOM ELEMENTS ===
const elements = {
    navbar: document.getElementById('navbar'),
    typingText: document.querySelector('.typing-text'),
    cursor: document.querySelector('.cursor'),
    particlesCanvas: document.getElementById('particles'),
    heroSection: document.querySelector('.hero-section'),
    aboutCards: document.querySelectorAll('.about-card'),
    expertiseItems: document.querySelectorAll('.expertise-item'),
    contactCards: document.querySelectorAll('.contact-card'),
    rippleButtons: document.querySelectorAll('.ripple'),
    navLinks: document.querySelectorAll('.nav-link'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    scrollElements: document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up')
};

// === TYPING ANIMATION ===
class TypingAnimation {
    constructor(element, texts, speed = 100, delay = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.delay = delay;
        this.currentText = 0;
        this.currentChar = 0;
        this.isDeleting = false;

        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const current = this.currentText;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.element.textContent = fullText.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = fullText.substring(0, this.currentChar + 1);
            this.currentChar++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.currentChar === fullText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentText = (this.currentText + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === PARTICLES SYSTEM ===
class ParticlesSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsla(${Math.random() * 60 + 260}, 70%, 70%, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.x -= dx * 0.002;
                particle.y -= dy * 0.002;
            }

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Connect nearby particles
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = '#8B5CF6';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// === SCROLL ANIMATIONS ===
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: CONFIG.scrollThreshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.init();
    }

    init() {
        elements.scrollElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.style.animationPlayState = 'running';
            }
        });
    }
}

// === RIPPLE EFFECT ===
class RippleEffect {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        elements.rippleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');

        const ripple = button.getElementsByClassName('ripple-effect')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    }
}

// === NAVBAR SCROLL EFFECT ===
class NavbarEffects {
    constructor() {
        this.lastScrollY = 0;
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }

    handleSmoothScroll(event) {
        const href = event.target.getAttribute('href');
        if (href.startsWith('#')) {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        elements.hamburger.classList.toggle('active');
    }
}

// === PARALLAX EFFECT ===
class ParallaxEffect {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleParallax());
        window.addEventListener('mousemove', (e) => this.handleMouseParallax(e));
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (elements.heroSection) {
            elements.heroSection.style.transform = `translateY(${rate}px)`;
        }
    }

    handleMouseParallax(event) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth) - 0.5;
        const yPos = (clientY / innerHeight) - 0.5;

        document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = xPos * 50 * speed;
            const y = yPos * 50 * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// === CARD ANIMATIONS ===
class CardAnimations {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // About cards hover effects
        elements.aboutCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateCard(card, true));
            card.addEventListener('mouseleave', () => this.animateCard(card, false));
        });

        // Expertise items animations
        elements.expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.animateExpertise(item, true));
            item.addEventListener('mouseleave', () => this.animateExpertise(item, false));
        });

        // Contact cards effects
        elements.contactCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateContactCard(card, true));
            card.addEventListener('mouseleave', () => this.animateContactCard(card, false));
        });
    }

    animateCard(card, isHover) {
        const icon = card.querySelector('.card-icon');
        if (icon) {
            if (isHover) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    animateExpertise(item, isHover) {
        const icon = item.querySelector('.expertise-icon');
        if (icon) {
            if (isHover) {
                icon.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 500);
            }
        }
    }

    animateContactCard(card, isHover) {
        const icon = card.querySelector('.contact-icon');
        if (icon) {
            if (isHover) {
                icon.style.transform = 'scale(1.2) rotate(15deg)';
                icon.style.filter = 'drop-shadow(0 0 20px var(--accent-cyan))';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'none';
            }
        }
    }
}

// === PERFORMANCE MONITORING ===
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Optimize animations based on device capabilities
        const isLowPerformance = this.detectLowPerformance();

        if (isLowPerformance) {
            document.body.classList.add('reduced-motion');
        }

        // Lazy load heavy animations
        this.setupLazyAnimations();
    }

    detectLowPerformance() {
        // Simple heuristic to detect low-performance devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return true;

        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);

        // Check for known low-performance indicators
        return /PowerVR|Mali|Adreno 3|Intel.*HD/.test(renderer) ||
               navigator.hardwareConcurrency < 4 ||
               navigator.deviceMemory < 4;
    }

    setupLazyAnimations() {
        const heavyElements = document.querySelectorAll('.gradient-orb');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        });

        heavyElements.forEach(el => observer.observe(el));
    }
}

// === UTILITY FUNCTIONS ===
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Elena Grebentsova Landing - Initializing...');

    // Initialize typing animation
    if (elements.typingText) {
        new TypingAnimation(elements.typingText, [
            'Квантовый психолог и ментор',
            'Предприниматель с 1999 года',
            'Эксперт по раскрытию потенциала',
            'Достижение прорывных результатов'
        ], CONFIG.typingSpeed, CONFIG.typingDelay);
    }

    // Initialize particles system
    if (elements.particlesCanvas) {
        new ParticlesSystem(elements.particlesCanvas);
    }

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize effects
    new RippleEffect();
    new NavbarEffects();
    new ParallaxEffect();
    new CardAnimations();
    new PerformanceMonitor();

    // Add custom CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }

        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);

    console.log('✨ Elena Grebentsova Landing - Ready!');
});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('Landing page error:', e);
});

// === EXPORT FOR DEBUGGING ===
if (typeof window !== 'undefined') {
    window.LandingDebug = {
        CONFIG,
        elements,
        utils
    };
}
