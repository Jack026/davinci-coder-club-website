// ========================================
// GLOBAL VARIABLES
// ========================================
let isScrolling = false;
let animationFrameId = null;
let intersectionObserver = null;
let scrollTimeout = null;
let typewriterTexts = ['Coder Club', 'Innovation Hub', 'Tech Community', 'Future Builders'];
let typewriterIndex = 0;
let typewriterChar = 0;
let isDeleting = false;

// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoadingScreen();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTypewriter();
    initializeCounters();
    initializeParticles();
    initializeContactForm();
    initializeScrollToTop();
    initializeThemeEffects();
    initializeResourceCards();
    
    // Performance optimization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeLazyLoading();
            initializeAdvancedAnimations();
        });
    } else {
        setTimeout(() => {
            initializeLazyLoading();
            initializeAdvancedAnimations();
        }, 100);
    }
    
    // Add dynamic styles
    addDynamicStyles();
});

// ========================================
// LOADING SCREEN
// ========================================
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (!loadingScreen || !loadingProgress) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                triggerEntranceAnimations();
            }, 500);
        }
    }, 100);
}

function triggerEntranceAnimations() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;
    });
}

// ========================================
// NAVIGATION
// ========================================
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                navLinks.forEach((link, index) => {
                    link.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
                });
            }
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(targetId);
                
                // Close mobile menu
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll effects for navbar
    let lastScrollY = 0;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        updateActiveNavLink();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// SCROLL EFFECTS
// ========================================
function initializeScrollEffects() {
    // Parallax effects
    const parallaxElements = document.querySelectorAll('.hero-background');
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Initialize intersection observer for scroll animations
    initializeIntersectionObserver();
}

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('animate-on-scroll');
                
                // Special animations for specific elements
                if (element.classList.contains('skill-item')) {
                    setTimeout(() => animateSkillBars(element), 200);
                }
                
                if (element.classList.contains('stat-number')) {
                    animateCounter(element);
                }
                
                intersectionObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(`
        .event-card,
        .project-card,
        .team-card,
        .resource-card,
        .skill-item,
        .stat-number,
        .contact-item,
        .about-text
    `);
    
    elementsToObserve.forEach(el => {
        intersectionObserver.observe(el);
    });
}

// ========================================
// ANIMATIONS
// ========================================
function initializeAnimations() {
    // Floating animations for cards
    const floatingCards = document.querySelectorAll('.floating-card, .project-card, .team-card, .resource-card');
    
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effects with throttling
        let hoverTimeout;
        
        card.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            card.style.transform = 'translateY(-15px) scale(1.02)';
            createRippleEffect(card);
        });
        
        card.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
            }, 50);
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            createRippleEffect(button);
        });
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function animateSkillBars(skillItem) {
    const skillProgress = skillItem.querySelector('.skill-progress');
    const level = skillItem.dataset.level;
    
    if (skillProgress && level) {
        skillProgress.style.width = level + '%';
    }
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    function typeWriter() {
        const currentText = typewriterTexts[typewriterIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, typewriterChar - 1);
            typewriterChar--;
            
            if (typewriterChar === 0) {
                isDeleting = false;
                typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, 50);
            }
        } else {
            typewriterElement.textContent = currentText.substring(0, typewriterChar + 1);
            typewriterChar++;
            
            if (typewriterChar === currentText.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
            } else {
                setTimeout(typeWriter, 100);
            }
        }
    }
    
    // Start after initial animation
    setTimeout(typeWriter, 3000);
}

// ========================================
// COUNTERS
// ========================================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        counter.addEventListener('animate', () => {
            animateCounter(counter);
        });
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.dataset.count);
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, stepTime);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
}

// ========================================
// PARTICLES SYSTEM
// ========================================
function initializeParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 30; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 20 + 10;
    const delay = Math.random() * 20;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, ${opacity});
        border-radius: 50%;
        left: ${left}%;
        animation: floatUp ${animationDuration}s linear infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: 1;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, (animationDuration + delay) * 1000);
}

// ========================================
// RESOURCE CARDS
// ========================================
function initializeResourceCards() {
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Stagger animation delay
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Add click tracking for resource links
        const resourceLinks = card.querySelectorAll('a');
        resourceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Track analytics if needed
                console.log('Resource clicked:', link.href);
            });
        });
    });
}

// ========================================
// CONTACT FORM
// ========================================
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Floating label effect
    inputs.forEach(input => {
        const formGroup = input.parentElement;
        
        // Focus events
        input.addEventListener('focus', () => {
            formGroup.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                formGroup.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                formGroup.classList.add('focused');
            } else {
                formGroup.classList.remove('focused');
            }
        });
        
        // Initial check
        if (input.value.trim()) {
            formGroup.classList.add('focused');
        }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(form);
    });
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Basic form validation
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success state
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--success-color)';
        
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            
            // Remove focused classes
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });
        }, 2000);
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const borderColor = type === 'success' ? 'var(--success-color)' : 
                       type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-glass);
        backdrop-filter: blur(20px);
        border: 1px solid ${borderColor};
        border-left: 4px solid ${borderColor};
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-lg);
        color: var(--text-primary);
        z-index: 10000;
        transform: translateX(400px);
        transition: var(--transition-normal);
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ========================================
// SCROLL TO TOP
// ========================================
function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    let isVisible = false;
    let ticking = false;
    
    function updateScrollTopBtn() {
        const shouldShow = window.scrollY > 300;
        
        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            if (isVisible) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollTopBtn);
            ticking = true;
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// THEME EFFECTS
// ========================================
function initializeThemeEffects() {
    // Mouse follow effect (only on non-touch devices)
    if (!('ontouchstart' in window)) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorGlow;
        
        // Create cursor glow
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
        `;
        
        document.body.appendChild(cursorGlow);
        
        function updateCursorGlow(x, y) {
            cursorGlow.style.left = x + 'px';
            cursorGlow.style.top = y + 'px';
        }
        
        document.addEventListener('mousemove', throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateCursorGlow(mouseX, mouseY);
        }, 16));
    }
}

// ========================================
// LAZY LOADING
// ========================================
function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if ('IntersectionObserver' in window && lazyElements.length > 0) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const lazySrc = element.dataset.lazy;
                    
                    if (lazySrc) {
                        if (element.tagName === 'IMG') {
                            element.src = lazySrc;
                        } else {
                            element.style.backgroundImage = `url(${lazySrc})`;
                        }
                        element.removeAttribute('data-lazy');
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// ========================================
// ADVANCED ANIMATIONS
// ========================================
function initializeAdvancedAnimations() {
    // Code rain effect
    createCodeRain();
    
    // Text reveal animations for section titles
    const textElements = document.querySelectorAll('.section-title');
    textElements.forEach(element => {
        const text = element.textContent;
        const chars = text.split('');
        
        element.innerHTML = chars
            .map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('');
        
        const charElements = element.querySelectorAll('.char');
        charElements.forEach((char, index) => {
            char.style.animationDelay = `${index * 0.05}s`;
        });
    });
}

function createCodeRain() {
    const codeRainElement = document.querySelector('.code-rain');
    if (!codeRainElement) return;
    
    const codeChars = '01';
    const lines = 50;
    const charsPerLine = 100;
    
    let rainText = '';
    
    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < charsPerLine; j++) {
            rainText += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
        }
        rainText += '\n';
    }
    
    codeRainElement.textContent = rainText;
    
    // Animate the rain periodically
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to update
            let newRainText = '';
            for (let i = 0; i < lines; i++) {
                for (let j = 0; j < charsPerLine; j++) {
                    newRainText += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
                }
                newRainText += '\n';
            }
            codeRainElement.textContent = newRainText;
        }
    }, 5000);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function createElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
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
}

// ========================================
// DYNAMIC STYLES
// ========================================
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .char {
            display: inline-block;
            opacity: 0;
            animation: charReveal 0.8s ease forwards;
        }
        
        @keyframes charReveal {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .skill-item {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-lg);
        }
        
        .skill-header {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }
        
        .cursor-glow {
            mix-blend-mode: screen;
        }
    `;
    
    document.head.appendChild(style);
}

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send error reports to your analytics service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ========================================
// RESIZE HANDLER
// ========================================
window.addEventListener('resize', debounce(() => {
    // Recalculate positions and sizes on resize
    updateActiveNavLink();
    
    // Reset mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768 && hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Reinitialize particles for new screen size
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        // Clear existing particles
        const existingParticles = particlesContainer.querySelectorAll('.particle');
        existingParticles.forEach(particle => particle.remove());
        
        // Recreate particles for new screen size
        for (let i = 0; i < Math.min(30, Math.floor(window.innerWidth / 50)); i++) {
            createParticle(particlesContainer);
        }
    }
}, 250));

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
document.addEventListener('keydown', (e) => {
    // Add keyboard navigation support
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ========================================
// INITIALIZATION COMPLETE
// ========================================
console.log('Da-Vinci Coder Club website initialized successfully! 🚀');