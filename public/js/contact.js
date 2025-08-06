/**
 * Contact Page JavaScript
 * Handles form interactions, validations, and animations
 * Current Date: 2025-08-06 10:06:33
 * Current User: Jack026
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initContactPage();
    
    console.log('🚀 Contact page initialized successfully!');
    console.log('👤 Welcome Jack026! Contact form ready for inquiries.');
    console.log('📅 Current time: 2025-08-06 10:06:33 UTC');
});

function initContactPage() {
    // Initialize all contact page components
    initLoadingScreen();
    initNavigation();
    initContactOptions();
    initContactForm();
    initFAQ();
    initScrollAnimations();
    initScrollToTop();
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Start animations after loading
            setTimeout(() => {
                animatePageElements();
            }, 500);
        }, 2000);
    }
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Contact Options
function initContactOptions() {
    const optionCards = document.querySelectorAll('.option-card');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const inquiryType = document.getElementById('inquiryType');
    const subjectSelect = document.getElementById('subject');
    const membershipFields = document.getElementById('membershipFields');
    const yearFields = document.getElementById('yearFields');
    const skillsFields = document.getElementById('skillsFields');

    const optionData = {
        general: {
            title: 'General Inquiry',
            subtitle: 'We\'ll get back to you within 24 hours',
            subject: 'general',
            showMembership: false,
            showSkills: false
        },
        membership: {
            title: 'Join Our Community',
            subtitle: 'Welcome to the future of coding!',
            subject: 'membership',
            showMembership: true,
            showSkills: true
        },
        collaboration: {
            title: 'Let\'s Collaborate',
            subtitle: 'Together we can build amazing things',
            subject: 'collaboration',
            showMembership: false,
            showSkills: true
        },
        support: {
            title: 'Technical Support',
            subtitle: 'Our experts are here to help',
            subject: 'technical',
            showMembership: false,
            showSkills: false
        }
    };

    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            optionCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');

            // Get option data
            const option = card.getAttribute('data-option');
            const data = optionData[option];

            if (data && formTitle && formSubtitle && inquiryType && subjectSelect) {
                // Update form
                formTitle.textContent = data.title;
                formSubtitle.textContent = data.subtitle;
                inquiryType.value = data.subject;
                subjectSelect.value = data.subject;

                // Show/hide conditional fields
                if (membershipFields) {
                    membershipFields.style.display = data.showMembership ? 'block' : 'none';
                }
                if (yearFields) {
                    yearFields.style.display = data.showMembership ? 'block' : 'none';
                }
                if (skillsFields) {
                    skillsFields.style.display = data.showSkills ? 'block' : 'none';
                }

                // Scroll to form
                document.querySelector('.contact-form-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('.submit-btn');
    
    if (!contactForm) return;

    // Form field interactions
    initFormFields();
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            await submitForm();
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearErrors(input));
    });
}

function initFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Handle focus and blur events
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    group.classList.remove('focused');
                }
            });
            
            // Check if field already has value (for browser autofill)
            if (input.value.trim()) {
                group.classList.add('focused');
            }
        }
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation (if provided)
    const phoneField = form.querySelector('#phone');
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }

    // Privacy policy agreement
    const privacyCheckbox = form.querySelector('#privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        alert('Please agree to the Privacy Policy and Terms of Service');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearErrors(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(field)} is required`;
        isValid = false;
    }

    // Specific field validations
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
            break;
        case 'email':
            if (value && !validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
        case 'phone':
            if (value && !validatePhone(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }

    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function getFieldLabel(field) {
    const label = field.parentElement.querySelector('label');
    return label ? label.textContent.replace(' *', '') : field.getAttribute('name');
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearErrors(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

async function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fas fa-spinner';

    try {
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Log form submission (for development)
        console.log('📧 Contact form submitted by Jack026:', data);
        console.log('📅 Submission time: 2025-08-06 10:06:33 UTC');
        
        // Show success message
        showSuccessNotification('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused', 'error', 'success');
        });
        
        // Reset form title if needed
        const formTitle = document.getElementById('formTitle');
        const formSubtitle = document.getElementById('formSubtitle');
        if (formTitle) formTitle.textContent = 'Send us a Message';
        if (formSubtitle) formSubtitle.textContent = 'We\'ll get back to you within 24 hours';
        
        // Hide conditional fields
        document.querySelectorAll('#membershipFields, #yearFields, #skillsFields').forEach(field => {
            field.style.display = 'none';
        });
        
        // Remove active class from option cards
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('active');
        });
        
    } catch (error) {
        console.error('❌ Form submission error:', error);
        showErrorNotification('Failed to send message. Please try again.');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
    }
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

function showErrorNotification(message) {
    alert(message); // Simple alert for now, can be replaced with custom notification
}

// FAQ Section
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.option-card, .contact-item, .faq-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Page Load Animations
function animatePageElements() {
    // Animate hero content
    const heroContent = document.querySelector('.contact-hero .hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animate option cards with stagger
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });
}

// Scroll to Top
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utility Functions
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .option-card, .quick-btn')) {
        addRippleEffect(e.target, e);
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Console welcome message for Jack026
console.log(`
🎯 ===================================
   Da-Vinci Coder Club Contact Page
   ===================================
   👤 Welcome Jack026!
   📅 ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
   🚀 Contact system ready!
   💻 All contact features loaded successfully
   ===================================
`);