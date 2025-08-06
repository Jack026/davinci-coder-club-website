/**
 * ========================================
 * DA-VINCI CODER CLUB - MOBILE RESPONSIVE SCRIPT
 * Enhanced Mobile-First JavaScript
 * Updated: 2025-08-06 10:36:41 UTC
 * Built by: Jack026
 * ========================================
 */

// Global Configuration
const CONFIG = {
    user: 'Jack026',
    timestamp: '2025-08-06 10:36:41',
    version: '2.1.0',
    debug: false,
    mobile: {
        breakpoints: {
            xs: 320,
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1440
        }
    }
};

// Enhanced Mobile Detection and Device Information
class DeviceDetector {
    constructor() {
        this.userAgent = navigator.userAgent;
        this.platform = navigator.platform;
        this.touchSupported = 'ontouchstart' in window;
        this.deviceType = this.detectDeviceType();
        this.os = this.detectOS();
        this.browser = this.detectBrowser();
        this.viewport = this.getViewportInfo();
        
        this.init();
    }

    detectDeviceType() {
        const width = window.innerWidth;
        const isTouchDevice = this.touchSupported;
        
        if (width <= CONFIG.mobile.breakpoints.sm) return 'mobile-small';
        if (width <= CONFIG.mobile.breakpoints.md) return 'mobile-large';
        if (width <= CONFIG.mobile.breakpoints.lg) return 'tablet';
        if (isTouchDevice && width <= CONFIG.mobile.breakpoints.xl) return 'tablet-large';
        return 'desktop';
    }

    detectOS() {
        const ua = this.userAgent;
        if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        if (/Windows Phone/.test(ua)) return 'windows-phone';
        if (/Mac/.test(this.platform)) return 'macos';
        if (/Win/.test(this.platform)) return 'windows';
        if (/Linux/.test(this.platform)) return 'linux';
        return 'unknown';
    }

    detectBrowser() {
        const ua = this.userAgent;
        if (/Chrome/.test(ua) && !/Edge/.test(ua)) return 'chrome';
        if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'safari';
        if (/Firefox/.test(ua)) return 'firefox';
        if (/Edge/.test(ua)) return 'edge';
        return 'unknown';
    }

    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            pixelRatio: window.devicePixelRatio || 1
        };
    }

    isMobile() {
        return this.deviceType.includes('mobile') || this.deviceType === 'tablet';
    }

    isTablet() {
        return this.deviceType.includes('tablet');
    }

    isDesktop() {
        return this.deviceType === 'desktop';
    }

    init() {
        document.documentElement.setAttribute('data-device', this.deviceType);
        document.documentElement.setAttribute('data-os', this.os);
        document.documentElement.setAttribute('data-browser', this.browser);
        document.documentElement.setAttribute('data-touch', this.touchSupported);
        
        if (CONFIG.debug) {
            console.log('🔍 Device Detection:', {
                type: this.deviceType,
                os: this.os,
                browser: this.browser,
                touch: this.touchSupported,
                viewport: this.viewport
            });
        }
    }

    updateViewport() {
        this.viewport = this.getViewportInfo();
        this.deviceType = this.detectDeviceType();
        document.documentElement.setAttribute('data-device', this.deviceType);
        document.documentElement.setAttribute('data-orientation', this.viewport.orientation);
    }
}

// Enhanced Mobile Navigation Manager
class MobileNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.body = document.body;
        
        this.isOpen = false;
        this.scrollPosition = 0;
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        // Mobile menu toggle
        this.hamburger.addEventListener('click', this.toggleMenu.bind(this));
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle scroll behavior
        this.initScrollBehavior();

        // Touch gestures
        this.initTouchGestures();
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.scrollPosition = window.pageYOffset;
        
        // Update DOM
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll on mobile
        if (deviceDetector.isMobile()) {
            this.body.style.position = 'fixed';
            this.body.style.top = `-${this.scrollPosition}px`;
            this.body.style.width = '100%';
        }

        // Focus management
        setTimeout(() => {
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
        }, 300);

        // Analytics
        this.trackEvent('mobile_menu_opened');
    }

    closeMenu() {
        this.isOpen = false;
        
        // Update DOM
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        if (deviceDetector.isMobile()) {
            this.body.style.position = '';
            this.body.style.top = '';
            this.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }

        // Analytics
        this.trackEvent('mobile_menu_closed');
    }

    initScrollBehavior() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset;
                    const scrollDifference = currentScrollY - this.lastScrollY;
                    
                    this.isScrollingDown = scrollDifference > 0;
                    
                    // Auto-hide navbar on mobile when scrolling down
                    if (deviceDetector.isMobile() && !this.isOpen) {
                        if (this.isScrollingDown && currentScrollY > 100) {
                            this.navbar.style.transform = 'translateY(-100%)';
                        } else {
                            this.navbar.style.transform = 'translateY(0)';
                        }
                    }
                    
                    // Add scrolled class
                    if (currentScrollY > 50) {
                        this.navbar.classList.add('scrolled');
                    } else {
                        this.navbar.classList.remove('scrolled');
                    }
                    
                    this.lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    initTouchGestures() {
        if (!deviceDetector.touchSupported) return;

        let startY = 0;
        let startX = 0;
        let distanceY = 0;
        let distanceX = 0;

        this.navMenu.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.navMenu.addEventListener('touchmove', (e) => {
            if (!this.isOpen) return;
            
            distanceY = e.touches[0].clientY - startY;
            distanceX = e.touches[0].clientX - startX;
            
            // Swipe up to close menu
            if (distanceY < -100 && Math.abs(distanceX) < 50) {
                this.closeMenu();
            }
        }, { passive: true });
    }

    trackEvent(action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'Mobile Navigation',
                event_label: deviceDetector.deviceType,
                custom_map: { user: CONFIG.user }
            });
        }
    }
}

// Enhanced Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.querySelector('.loading-progress');
        this.loadingTip = document.querySelector('.loading-tip');
        this.loadingTimestamp = document.querySelector('.loading-timestamp');
        
        this.progress = 0;
        this.startTime = Date.now();
        this.tips = [
            '💡 Welcome Jack026! Building the future...',
            '🚀 Initializing innovation systems...',
            '💻 Loading Da-Vinci magic...',
            '🎨 Where art meets algorithm!',
            '🌟 Creativity loading at 100%...',
            '⚡ Supercharging your experience...'
        ];
        
        this.init();
    }

    init() {
        if (!this.loadingScreen) return;

        // Update timestamp
        if (this.loadingTimestamp) {
            this.loadingTimestamp.textContent = `🕒 ${CONFIG.timestamp} UTC`;
        }

        // Start loading simulation
        this.simulateLoading();
        
        // Handle real page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.completeLoading();
            });
        } else {
            setTimeout(() => this.completeLoading(), 1000);
        }
    }

    simulateLoading() {
        const duration = deviceDetector.isMobile() ? 2000 : 3000;
        const interval = 50;
        const increment = 100 / (duration / interval);
        
        const timer = setInterval(() => {
            this.progress += increment;
            
            if (this.progressBar) {
                this.progressBar.style.width = `${Math.min(this.progress, 100)}%`;
            }
            
            // Update loading tip
            if (this.loadingTip && Math.random() < 0.1) {
                const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
                this.loadingTip.textContent = randomTip;
            }
            
            if (this.progress >= 100) {
                clearInterval(timer);
            }
        }, interval);
    }

    completeLoading() {
        const loadTime = Date.now() - this.startTime;
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
                
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }
            
            // Initialize other components after loading
            this.initializeApp();
            
            // Analytics
            this.trackLoadingComplete(loadTime);
        }, 500);
    }

    initializeApp() {
        // Initialize animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                disable: deviceDetector.isMobile() ? 'phone' : false
            });
        }

        // Initialize other components
        new StatCounter();
        new ScrollToTop();
        new HeroAnimations();
        new FormValidation();
        new TouchOptimizations();
        
        console.log(`🎯 Da-Vinci Coder Club initialized for ${CONFIG.user}`);
        console.log(`📱 Device: ${deviceDetector.deviceType} | OS: ${deviceDetector.os}`);
    }

    trackLoadingComplete(loadTime) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_complete', {
                event_category: 'Performance',
                event_label: deviceDetector.deviceType,
                value: loadTime,
                custom_map: { user: CONFIG.user }
            });
        }
    }
}

// Enhanced Scroll to Top with Mobile Optimizations
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.threshold = deviceDetector.isMobile() ? 300 : 500;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        if (!this.button) return;

        // Handle scroll visibility
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset > this.threshold;
                    
                    if (scrolled && !this.isVisible) {
                        this.show();
                    } else if (!scrolled && this.isVisible) {
                        this.hide();
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle click
        this.button.addEventListener('click', this.scrollToTop.bind(this));

        // Touch optimization for mobile
        if (deviceDetector.touchSupported) {
            this.button.addEventListener('touchstart', () => {
                this.button.style.transform = 'translateY(-2px) scale(0.95)';
            }, { passive: true });

            this.button.addEventListener('touchend', () => {
                this.button.style.transform = '';
            }, { passive: true });
        }
    }

    show() {
        this.isVisible = true;
        this.button.classList.add('visible');
    }

    hide() {
        this.isVisible = false;
        this.button.classList.remove('visible');
    }

    scrollToTop() {
        const startPosition = window.pageYOffset;
        const duration = deviceDetector.isMobile() ? 800 : 1000;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition * (1 - easeInOutCubic));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_to_top', {
                event_category: 'Navigation',
                event_label: deviceDetector.deviceType
            });
        }
    }
}

// Mobile-Optimized Statistics Counter
class StatCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        
        this.init();
    }

    init() {
        if (!this.stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateStats();
                }
            });
        }, {
            threshold: deviceDetector.isMobile() ? 0.3 : 0.5
        });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateStats() {
        this.stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = deviceDetector.isMobile() ? 1500 : 2000;
            const startTime = performance.now();
            const delay = index * 100;

            setTimeout(() => {
                const animateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(target * easeOutCubic);
                    
                    stat.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateCount);
                    } else {
                        stat.textContent = target;
                    }
                };

                requestAnimationFrame(animateCount);
            }, delay);
        });
    }
}

// Enhanced Hero Animations for Mobile
class HeroAnimations {
    constructor() {
        this.typewriter = document.getElementById('typewriter');
        this.floatingCard = document.querySelector('.floating-card');
        this.particles = document.querySelector('.particles');
        
        this.init();
    }

    init() {
        this.initTypewriter();
        this.initParticles();
        this.initCardInteraction();
    }

    initTypewriter() {
        if (!this.typewriter) return;

        const text = this.typewriter.getAttribute('data-text') || 'Coder Club';
        const speed = deviceDetector.isMobile() ? 100 : 150;
        
        let i = 0;
        this.typewriter.textContent = '';

        const typeChar = () => {
            if (i < text.length) {
                this.typewriter.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };

        setTimeout(typeChar, 1000);
    }

    initParticles() {
        if (!this.particles || deviceDetector.isMobile()) return;

        // Add more particles for desktop
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-500);
                border-radius: 50%;
                animation: particleFloat ${8 + i * 2}s ease-in-out infinite;
                animation-delay: ${i * 1.5}s;
                top: ${20 + i * 20}%;
                left: ${10 + i * 30}%;
                box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            `;
            this.particles.appendChild(particle);
        }
    }

    initCardInteraction() {
        if (!this.floatingCard || !deviceDetector.touchSupported) return;

        let isPressed = false;

        this.floatingCard.addEventListener('touchstart', (e) => {
            isPressed = true;
            this.floatingCard.style.transform = 'scale(0.98)';
        }, { passive: true });

        this.floatingCard.addEventListener('touchend', () => {
            if (isPressed) {
                this.floatingCard.style.transform = '';
                isPressed = false;
            }
        }, { passive: true });

        this.floatingCard.addEventListener('touchcancel', () => {
            this.floatingCard.style.transform = '';
            isPressed = false;
        }, { passive: true });
    }
}

// Enhanced Form Validation for Mobile
class FormValidation {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (emailInput && submitButton) {
                this.setupFormValidation(form, emailInput, submitButton);
            }
        });
    }

    setupFormValidation(form, emailInput, submitButton) {
        const errorMessage = form.querySelector('.error-message') || this.createErrorMessage(form);
        
        // Real-time validation
        emailInput.addEventListener('input', () => {
            this.validateEmail(emailInput, errorMessage);
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateEmail(emailInput, errorMessage)) {
                this.handleFormSubmission(form, emailInput, submitButton);
            }
        });

        // Mobile-specific enhancements
        if (deviceDetector.isMobile()) {
            emailInput.addEventListener('focus', () => {
                // Scroll input into view on mobile
                setTimeout(() => {
                    emailInput.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            });
        }
    }

    createErrorMessage(form) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        
        const formGroup = form.querySelector('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorDiv);
        }
        
        return errorDiv;
    }

    validateEmail(input, errorMessage) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            this.showError(input, errorMessage, '');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(input, errorMessage, 'Please enter a valid email address');
            return false;
        }
        
        this.showSuccess(input, errorMessage);
        return true;
    }

    showError(input, errorMessage, message) {
        input.classList.add('is-error');
        input.classList.remove('is-success');
        errorMessage.textContent = message;
        errorMessage.style.display = message ? 'block' : 'none';
    }

    showSuccess(input, errorMessage) {
        input.classList.remove('is-error');
        input.classList.add('is-success');
        errorMessage.style.display = 'none';
    }

    async handleFormSubmission(form, emailInput, submitButton) {
        const originalText = submitButton.textContent;
        const email = emailInput.value.trim();
        
        // Update button state
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        submitButton.classList.add('is-loading');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success state
            submitButton.textContent = 'Subscribed! ✓';
            submitButton.classList.remove('is-loading');
            submitButton.classList.add('is-success');
            
            // Reset form
            setTimeout(() => {
                emailInput.value = '';
                emailInput.classList.remove('is-success');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.classList.remove('is-success');
            }, 3000);
            
            // Show success message
            this.showToast('Successfully subscribed to newsletter!', 'success');
            
            // Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'Engagement',
                    event_label: deviceDetector.deviceType,
                    custom_map: { user: CONFIG.user }
                });
            }
            
        } catch (error) {
            // Error state
            submitButton.textContent = 'Try Again';
            submitButton.classList.remove('is-loading');
            submitButton.disabled = false;
            
            this.showToast('Subscription failed. Please try again.', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : 'var(--danger-500)'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: var(--z-toast);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Mobile Touch Optimizations
class TouchOptimizations {
    constructor() {
        this.init();
    }

    init() {
        if (!deviceDetector.touchSupported) return;

        this.optimizeButtons();
        this.optimizeCards();
        this.handleTouchFeedback();
        this.preventZoom();
    }

    optimizeButtons() {
        const buttons = document.querySelectorAll('.btn, .preview-link, .scroll-arrow');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = button.style.transform.replace('scale(1)', 'scale(0.95)') || 'scale(0.95)';
            }, { passive: true });

            button.addEventListener('touchend', () => {
                button.style.transform = button.style.transform.replace('scale(0.95)', 'scale(1)');
            }, { passive: true });

            button.addEventListener('touchcancel', () => {
                button.style.transform = button.style.transform.replace('scale(0.95)', 'scale(1)');
            }, { passive: true });
        });
    }

    optimizeCards() {
        const cards = document.querySelectorAll('.preview-card, .feature-card, .floating-card');
        
        cards.forEach(card => {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            card.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                isDragging = true;
                card.style.transition = 'none';
            }, { passive: true });

            card.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                
                // Subtle movement feedback
                if (Math.abs(deltaY) < 20) {
                    card.style.transform = `translateY(${deltaY * 0.1}px)`;
                }
            }, { passive: true });

            card.addEventListener('touchend', () => {
                isDragging = false;
                card.style.transition = '';
                card.style.transform = '';
            }, { passive: true });
        });
    }

    handleTouchFeedback() {
        // Add haptic feedback for supported devices
        const addHapticFeedback = (element) => {
            element.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
        };

        document.querySelectorAll('.btn-primary, .nav-link, .scroll-top').forEach(addHapticFeedback);
    }

    preventZoom() {
        // Prevent zoom on double tap for specific elements
        const preventZoomElements = document.querySelectorAll('.floating-card, .preview-card');
        
        preventZoomElements.forEach(element => {
            let lastTouchEnd = 0;
            
            element.addEventListener('touchend', (e) => {
                const now = new Date().getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        });
    }
}

// Viewport and Orientation Manager
class ViewportManager {
    constructor() {
        this.currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        this.viewportHeight = window.innerHeight;
        
        this.init();
    }

    init() {
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Set initial viewport height for mobile
        this.setViewportHeight();
    }

    handleOrientationChange() {
        const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        
        if (newOrientation !== this.currentOrientation) {
            this.currentOrientation = newOrientation;
            document.documentElement.setAttribute('data-orientation', newOrientation);
            
            // Update device detector
            deviceDetector.updateViewport();
            
            // Adjust layout for orientation
            this.adjustForOrientation();
            
            // Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'orientation_change', {
                    event_category: 'Device',
                    event_label: newOrientation,
                    custom_map: { device: deviceDetector.deviceType }
                });
            }
        }
        
        this.setViewportHeight();
    }

    handleResize() {
        deviceDetector.updateViewport();
        this.setViewportHeight();
        
        // Close mobile menu if viewport becomes desktop
        if (deviceDetector.isDesktop() && mobileNav && mobileNav.isOpen) {
            mobileNav.closeMenu();
        }
    }

    setViewportHeight() {
        // Set CSS custom property for accurate mobile viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    adjustForOrientation() {
        if (deviceDetector.isMobile()) {
            const hero = document.querySelector('.hero');
            if (hero) {
                if (this.currentOrientation === 'landscape') {
                    hero.style.minHeight = '100vh';
                } else {
                    hero.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
                }
            }
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            device: deviceDetector.deviceType,
            connection: this.getConnectionInfo()
        };
        
        this.init();
    }

    init() {
        // Measure load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = Date.now() - performance.timing.navigationStart;
            this.reportMetrics();
        });

        // Measure DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.domContentLoaded = Date.now() - performance.timing.navigationStart;
            });
        }

        // Get paint metrics
        this.getPaintMetrics();
    }

    getPaintMetrics() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                });
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt
            };
        }
        return null;
    }

    reportMetrics() {
        if (CONFIG.debug) {
            console.table(this.metrics);
        }

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', {
                event_category: 'Performance',
                event_label: deviceDetector.deviceType,
                value: this.metrics.loadTime,
                custom_map: {
                    user: CONFIG.user,
                    device: this.metrics.device,
                    viewport: this.metrics.viewport
                }
            });
        }

        // Update performance monitor div
        const monitor = document.getElementById('performance-monitor');
        if (monitor) {
            monitor.querySelector('#load-time').textContent = this.metrics.loadTime;
            monitor.querySelector('#user-agent').textContent = this.metrics.userAgent;
            if (monitor.querySelector('#viewport-size')) {
                monitor.querySelector('#viewport-size').textContent = this.metrics.viewport;
            }
        }
    }
}

// Initialize Application
let deviceDetector;
let mobileNav;
let loadingManager;
let viewportManager;
let performanceMonitor;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log(`🚀 Da-Vinci Coder Club - Mobile Responsive Script Loading...`);
    console.log(`👤 User: ${CONFIG.user} | Time: ${CONFIG.timestamp}`);
    
    // Initialize core components
    deviceDetector = new DeviceDetector();
    mobileNav = new MobileNavigation();
    loadingManager = new LoadingManager();
    viewportManager = new ViewportManager();
    performanceMonitor = new PerformanceMonitor();
    
    console.log(`✅ All components initialized successfully!`);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (typeof gtag !== 'undefined') {
        gtag('event', document.hidden ? 'page_hidden' : 'page_visible', {
            event_category: 'Engagement',
            event_label: deviceDetector.deviceType
        });
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_unload', {
            event_category: 'Session',
            event_label: deviceDetector.deviceType,
            custom_map: { 
                user: CONFIG.user,
                session_duration: Date.now() - performance.timing.navigationStart
            }
        });
    }
});

// Export for external use
window.DaVinciClub = {
    deviceDetector,
    mobileNav,
    CONFIG,
    version: CONFIG.version
};

console.log(`📱 Mobile-responsive features loaded for ${deviceDetector?.deviceType || 'unknown'} device`);