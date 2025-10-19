/**
 * СОВРЕМЕННЫЙ JAVASCRIPT ДЛЯ ЛЕНДИНГА ЕЛЕНЫ ГРЕБЕНЦОВОЙ
 * Эффекты анимации, интерактивность, параллакс
 */

// ========================================
// ГЛАВНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ
// ========================================

const TYPING_SPEED = 80; // Скорость печати
const TYPING_DELAY = 1000; // Задержка перед началом
const PARTICLE_COUNT = 50; // Количество частиц

// Текст для эффекта печатающейся машинки
const typingTexts = [
    "Предприниматель с 1999 года",
    "Квантовый психолог и ментор",
    "Эксперт по раскрытию потенциала",
    "Помогаю достигать прорывных результатов"
];

// ========================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация лендинга Елены Гребенцовой');
    
    // Запуск всех эффектов
    initTypingEffect();
    initScrollAnimations();
    initParticleSystem();
    initParallaxEffect();
    initRippleEffect();
    initSmoothScroll();
    initNavigationEffects();
    
    console.log('✅ Все эффекты инициализированы');
});

// ========================================
// ЭФФЕКТ ПЕЧАТАЮЩЕЙСЯ МАШИНКИ
// ========================================

function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function typeText() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? TYPING_SPEED / 2 : TYPING_SPEED;
        
        if (!isDeleting && charIndex === currentText.length) {
            // Пауза в конце текста
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Запуск с задержкой
    setTimeout(typeText, TYPING_DELAY);
}

// ========================================
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Дополнительные эффекты для специфичных элементов
                if (entry.target.classList.contains('expertise-list')) {
                    animateListItems(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами
    const elementsToAnimate = document.querySelectorAll('.fade-in-element');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Анимация элементов списка по очереди
function animateListItems(listElement) {
    const items = listElement.querySelectorAll('li');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// ========================================
// СИСТЕМА ЧАСТИЦ
// ========================================

function initParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Создание частиц
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Случайные свойства частицы
    const size = Math.random() * 4 + 1;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    const opacity = Math.random() * 0.3 + 0.1;
    
    // Стили частицы
    Object.assign(particle.style, {
        position: 'absolute',
        left: startX + 'px',
        top: startY + 'px',
        width: size + 'px',
        height: size + 'px',
        background: `radial-gradient(circle, rgba(0, 217, 255, ${opacity}) 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: `particleFloat ${duration}s linear infinite`
    });
    
    container.appendChild(particle);
    
    // Удаление и пересоздание частицы
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createParticle(container); // Создаем новую частицу
        }
    }, duration * 1000);
}

// Добавление CSS анимации для частиц
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, -100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// ========================================
// ПАРАЛЛАКС ЭФФЕКТ
// ========================================

function initParallaxEffect() {
    const floatingElements = document.querySelectorAll('.floating-circle');
    
    let mouseX = 0;
    let mouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Отслеживание движения мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Обновление размеров окна
    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    });
    
    // Анимационный цикл для параллакса
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        floatingElements.forEach((element, index) => {
            if (!element) return;
            
            // Разные скорости для разных элементов
            const speed = 0.5 + (index * 0.2);
            const mouseInfluence = 0.02 + (index * 0.01);
            
            // Расчет смещения
            const deltaX = (mouseX - windowWidth / 2) * mouseInfluence;
            const deltaY = (mouseY - windowHeight / 2) * mouseInfluence;
            const scrollOffset = scrollY * speed;
            
            // Применение трансформации
            element.style.transform = `translate(${deltaX}px, ${deltaY - scrollOffset}px) rotate(${scrollY * 0.1}deg)`;
        });
        
        requestAnimationFrame(updateParallax);
    }
    
    // Запуск параллакса только если есть элементы
    if (floatingElements.length > 0) {
        updateParallax();
    }
}

// ========================================
// RIPPLE ЭФФЕКТ ДЛЯ КНОПОК
// ========================================

function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.ripple-button');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Создание ripple элемента
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.appendChild(ripple);
            
            // Удаление ripple после анимации
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// CSS для ripple анимации
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// ПЛАВНАЯ ПРОКРУТКА
// ========================================

function initSmoothScroll() {
    // Обработка кликов по навигационным ссылкам
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Учитываем высоту навигации
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Добавляем эффект активной ссылки
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// ========================================
// ЭФФЕКТЫ НАВИГАЦИИ
// ========================================

function initNavigationEffects() {
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Добавление класса при скролле
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Скрытие/показ навигации при скролле
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Эффект hover для навигационных элементов
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'navItemHover 0.3s ease-out';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

// CSS для навигационных эффектов
const navStyle = document.createElement('style');
navStyle.textContent = `
    nav {
        transition: transform 0.3s ease, background 0.3s ease;
    }
    
    @keyframes navItemHover {
        0% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
        100% { transform: translateY(0); }
    }
    
    nav ul li a.active {
        background: rgba(0, 217, 255, 0.2);
        border-radius: 25px;
    }
`;
document.head.appendChild(navStyle);

// ========================================
// ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ
// ========================================

// Эффект наведения на социальные карточки
document.addEventListener('DOMContentLoaded', function() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            
            // Добавляем эффект свечения
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.filter = 'drop-shadow(0 0 20px currentColor)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.filter = '';
            }
        });
    });
});

// Анимированный счетчик (если будут добавлены числовые данные)
function animateCounter(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 16);
}

// Функция для добавления эффектов производительности
function optimizePerformance() {
    // Дебаунс для ресайза окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Пересчет параметров при изменении размера окна
            console.log('🔄 Адаптация к новому размеру окна');
        }, 250);
    });
    
    // Intersection Observer для экономии ресурсов
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        // Отключение анимаций для пользователей с ограничениями
        document.body.classList.add('reduce-motion');
    }
}

// Запуск оптимизации производительности
document.addEventListener('DOMContentLoaded', optimizePerformance);

// ========================================
// ЭКСПОРТ ФУНКЦИЙ (если необходимо)
// ========================================

// Глобальные функции для возможного использования извне
window.EGLanding = {
    animateCounter,
    initTypingEffect,
    initParticleSystem,
    initParallaxEffect
};

console.log('🎨 Лендинг Елены Гребенцовой готов к работе!');