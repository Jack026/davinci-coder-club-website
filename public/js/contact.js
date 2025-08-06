/* ========================================
   CONTACT PAGE JAVASCRIPT
   Updated: 2025-08-06 13:03:05 UTC
   Built for: Jack026
======================================== */

class ContactPage {
    constructor() {
        this.form = DOMUtils.$('#contactForm');
        this.currentStep = 1;
        this.validationRules = this.setupValidationRules();
        this.liveChatWidget = DOMUtils.$('#liveChatWidget');
        this.emergencyMode = false;
        
        this.init();
    }
    
    init() {
        this.setupFormHandling();
        this.setupLiveChat();
        this.setupFAQ();
        this.setupContactOptions();
        this.setupEmergencyMode();
        this.updateOfficeStatus();
        this.initializeContactAnalytics();
        
        console.log('📞 Contact page initialized for Jack026');
    }
    
    setupFormHandling() {
        if (!this.form) return;
        
        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
        
        // Subject change handling
        const subjectSelect = DOMUtils.$('#subject');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                this.handleSubjectChange(e.target.value);
            });
        }
        
        // Character counter
        const messageField = DOMUtils.$('#message');
        const charCount = DOMUtils.$('#charCount');
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                this.updateCharacterCount(messageField, charCount);
            });
        }
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        
        // Auto-save
        this.setupAutoSave();
    }
    
    setupValidationRules() {
        return {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: false,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            subject: {
                required: true,
                message: 'Please select a subject'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }
    
    validateField(field) {
        const fieldName = field.name;
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        
        // Pattern validation
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        
        // Length validation
        else if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
        }
        
        else if (value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be less than ${rules.maxLength} characters`;
        }
        
        // Update field UI
        if (isValid) {
            FormUtils.clearFieldError(field);
            FormUtils.showFieldSuccess(field);
        } else {
            FormUtils.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }
    
    handleSubjectChange(subject) {
        // Show/hide conditional fields
        const membershipFields = DOMUtils.$('#membershipFields');
        const yearFields = DOMUtils.$('#yearFields');
        const skillsFields = DOMUtils.$('#skillsFields');
        const priorityFields = DOMUtils.$('#priorityFields');
        
        // Hide all conditional fields first
        [membershipFields, yearFields, skillsFields, priorityFields].forEach(field => {
            if (field) field.style.display = 'none';
        });
        
        // Show relevant fields based on subject
        switch (subject) {
            case 'membership':
                if (membershipFields) membershipFields.style.display = 'block';
                if (yearFields) yearFields.style.display = 'block';
                if (skillsFields) skillsFields.style.display = 'block';
                this.updateFormTitle('Join Our Amazing Team!', 'Jack026 will personally review your application');
                break;
                
            case 'collaboration':
                if (priorityFields) priorityFields.style.display = 'block';
                this.updateFormTitle('Partnership Opportunity', 'Let\'s discuss how we can work together');
                break;
                
            case 'technical':
                if (priorityFields) priorityFields.style.display = 'block';
                if (skillsFields) skillsFields.style.display = 'block';
                this.updateFormTitle('Technical Support Request', 'Our experts are ready to help you');
                break;
                
            default:
                this.updateFormTitle('Send us a Message', 'Jack026 will personally review your message and respond within 2 minutes');
        }
        
        // Track subject selection
        daVinciState.analytics.track('contact_subject_selected', { subject });
    }
    
    updateFormTitle(title, subtitle) {
        const formTitle = DOMUtils.$('#formTitle');
        const formSubtitle = DOMUtils.$('#formSubtitle');
        
        if (formTitle) formTitle.textContent = title;
        if (formSubtitle) formSubtitle.textContent = subtitle;
    }
    
    updateCharacterCount(messageField, charCount) {
        const count = messageField.value.length;
        const maxLength = 1000;
        
        charCount.textContent = count;
        
        // Update color based on usage
        if (count > maxLength * 0.9) {
            charCount.style.color = '#ef4444';
        } else if (count > maxLength * 0.8) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#6b7280';
        }
        
        // Update progress indicator
        const progress = (count / maxLength) * 100;
        charCount.style.background = `linear-gradient(90deg, var(--primary-500) ${progress}%, transparent ${progress}%)`;
    }
    
    async handleFormSubmission() {
        // Validate all fields
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        let isFormValid = true;
        
        // Validate all required fields
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            daVinciState.showNotification('Please fix the errors below', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Add metadata
            data.timestamp = new Date().toISOString();
            data.user = DAVINCI_CONFIG.currentUser;
            data.page = window.location.pathname;
            data.userAgent = navigator.userAgent;
            
            // Check for emergency
            if (data.urgent === 'on' || data.priority === 'emergency') {
                this.handleEmergencyContact(data);
                return;
            }
            
            // Submit form
            const response = await this.submitContactForm(data);
            
            if (response.success) {
                this.showSuccessModal(response);
                this.form.reset();
                this.clearFormErrors();
                
                daVinciState.analytics.track('contact_form_submitted', {
                    subject: data.subject,
                    priority: data.priority || 'normal'
                });
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            daVinciState.showNotification('Failed to send message. Please try again.', 'error');
            
            daVinciState.analytics.track('contact_form_error', {
                error: error.message
            });
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    async submitContactForm(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Message sent successfully!',
                    responseTime: '2 minutes',
                    ticketId: `DVCC-${Date.now()}`
                });
            }, 1500);
        });
    }
    
    showSuccessModal(response) {
        const modal = DOMUtils.$('#contactSuccessModal');
        if (modal) {
            modalSystem.open('contactSuccessModal');
            
            // Update modal content with response data
            const ticketInfo = modal.querySelector('.ticket-info');
            if (ticketInfo) {
                ticketInfo.innerHTML = `
                    <p><strong>Ticket ID:</strong> ${response.ticketId}</p>
                    <p><strong>Expected Response:</strong> ${response.responseTime}</p>
                `;
            }
        } else {
            daVinciState.showNotification(response.message, 'success');
        }
    }
    
    handleEmergencyContact(data) {
        this.emergencyMode = true;
        
        // Show emergency overlay
        const emergencyOverlay = DOMUtils.$('#emergencyOverlay');
        if (emergencyOverlay) {
            emergencyOverlay.style.display = 'flex';
            this.startEmergencyTimer();
        }
        
        // Send emergency notification
        this.sendEmergencyNotification(data);
        
        daVinciState.analytics.track('emergency_contact_activated', {
            urgency: data.priority || 'high'
        });
    }
    
    startEmergencyTimer() {
        const timerElement = DOMUtils.$('.timer-count');
        if (!timerElement) return;
        
        let timeLeft = 120; // 2 minutes
        
        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft--;
                setTimeout(updateTimer, 1000);
            } else {
                timerElement.textContent = 'Response incoming...';
            }
        };
        
        updateTimer();
    }
    
    async sendEmergencyNotification(data) {
        // Send immediate notification to Jack026 and emergency team
        try {
            await fetch(`${DAVINCI_CONFIG.apiEndpoint}/emergency-contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.warn('Emergency notification failed:', error);
        }
    }
    
    setupAutoSave() {
        if (!daVinciState.preferences.autoSave) return;
        
        const saveKey = `contact_form_${DAVINCI_CONFIG.currentUser}`;
        
        // Load saved data
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field && field.type !== 'password') {
                        field.value = data[key];
                    }
                });
            } catch (error) {
                console.warn('Failed to load saved form data:', error);
            }
        }
        
        // Auto-save on input
        this.form.addEventListener('input', () => {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = setTimeout(() => {
                this.saveFormData(saveKey);
            }, 2000);
        });
    }
    
    saveFormData(key) {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Remove sensitive fields
        delete data.privacy;
        delete data.newsletter;
        
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    clearFormErrors() {
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    setupLiveChat() {
        if (!this.liveChatWidget) return;
        
        const chatToggle = this.liveChatWidget.querySelector('.chat-toggle');
        const chatWindow = this.liveChatWidget.querySelector('.chat-window');
        const chatClose = this.liveChatWidget.querySelector('.chat-close');
        const chatInput = this.liveChatWidget.querySelector('.chat-input input');
        const chatSend = this.liveChatWidget.querySelector('.chat-input button');
        
        // Toggle chat
        chatToggle.addEventListener('click', () => {
            this.toggleLiveChat();
        });
        
        // Close chat
        chatClose.addEventListener('click', () => {
            this.closeLiveChat();
        });
        
        // Send message
        chatSend.addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        // Enter key to send
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // Auto-open after delay
        setTimeout(() => {
            if (!this.chatOpened) {
                this.showChatNotification();
            }
        }, 30000);
    }
    
    toggleLiveChat() {
        const chatWindow = this.liveChatWidget.querySelector('.chat-window');
        const isVisible = chatWindow.style.display === 'flex';
        
        if (isVisible) {
            this.closeLiveChat();
        } else {
            this.openLiveChat();
        }
    }
    
    openLiveChat() {
        const chatWindow = this.liveChatWidget.querySelector('.chat-window');
        const chatNotification = this.liveChatWidget.querySelector('.chat-notification');
        
        chatWindow.style.display = 'flex';
        if (chatNotification) chatNotification.style.display = 'none';
        
        this.chatOpened = true;
        
        // Send welcome message if first time
        if (!this.welcomeMessageSent) {
            this.addChatMessage('Hi! I\'m Jack026. How can I help you today? 👋', 'received');
            this.welcomeMessageSent = true;
        }
        
        daVinciState.analytics.track('live_chat_opened');
    }
    
    closeLiveChat() {
        const chatWindow = this.liveChatWidget.querySelector('.chat-window');
        chatWindow.style.display = 'none';
        
        daVinciState.analytics.track('live_chat_closed');
    }
    
    sendChatMessage() {
        const chatInput = this.liveChatWidget.querySelector('.chat-input input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage(message, 'sent');
        chatInput.value = '';
        
        // Simulate Jack026 response
        setTimeout(() => {
            const response = this.generateChatResponse(message);
            this.addChatMessage(response, 'received');
        }, 1000 + Math.random() * 2000);
        
        daVinciState.analytics.track('chat_message_sent', { message });
    }
    
    addChatMessage(message, type) {
        const chatMessages = this.liveChatWidget.querySelector('.chat-messages');
        
        const messageElement = DOMUtils.create('div', {
            className: `message ${type}`,
            innerHTML: `
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `
        });
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /* Continuing Contact Page JavaScript... */

    generateChatResponse(userMessage) {
        const responses = {
            greetings: [
                "Hello! Great to meet you! How can Jack026 help you today?",
                "Hi there! I'm here to help. What can I do for you?",
                "Hey! Welcome to Da-Vinci Coder Club! What brings you here?"
            ],
            membership: [
                "That's awesome! We'd love to have you join our team. Let me connect you with our membership coordinator.",
                "Perfect timing! We're always looking for passionate developers. What's your background?",
                "Great choice! Jack026 will personally review your application. What technologies are you interested in?"
            ],
            contact: [
                "I can help you get in touch with the right person. What do you need assistance with?",
                "Jack026 is available right now! What would you like to discuss?",
                "Let me connect you directly with Jack026. He typically responds within 2 minutes."
            ],
            projects: [
                "We have some amazing projects going on! Are you interested in contributing or starting something new?",
                "Our project portfolio is growing fast! Check out our GitHub for the latest updates.",
                "Jack026 loves discussing new project ideas. What kind of project are you thinking about?"
            ],
            default: [
                "That's interesting! Let me get Jack026 to give you a detailed answer.",
                "Great question! I'll make sure Jack026 sees this and responds personally.",
                "Thanks for reaching out! Jack026 will have the perfect answer for you."
            ]
        };
        
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomResponse(responses.greetings);
        } else if (message.includes('join') || message.includes('member')) {
            return this.getRandomResponse(responses.membership);
        } else if (message.includes('contact') || message.includes('jack026')) {
            return this.getRandomResponse(responses.contact);
        } else if (message.includes('project')) {
            return this.getRandomResponse(responses.projects);
        } else {
            return this.getRandomResponse(responses.default);
        }
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showChatNotification() {
        const chatNotification = this.liveChatWidget.querySelector('.chat-notification');
        if (chatNotification) {
            chatNotification.style.display = 'block';
            chatNotification.textContent = '1';
        }
        
        // Pulse animation
        this.liveChatWidget.style.animation = 'chatPulse 2s ease-in-out infinite';
        
        setTimeout(() => {
            this.liveChatWidget.style.animation = '';
        }, 10000);
    }
    
    setupFAQ() {
        const faqItems = DOMUtils.$$('.faq-item');
        const faqSearch = DOMUtils.$('#faqSearch');
        const faqCategories = DOMUtils.$$('.faq-category');
        
        // FAQ accordion
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    daVinciState.analytics.track('faq_opened', {
                        question: question.querySelector('h4').textContent
                    });
                }
            });
        });
        
        // FAQ search
        if (faqSearch) {
            faqSearch.addEventListener('input', (e) => {
                this.searchFAQ(e.target.value);
            });
        }
        
        // FAQ categories
        faqCategories.forEach(category => {
            category.addEventListener('click', () => {
                this.filterFAQByCategory(category.dataset.category);
                
                // Update active category
                faqCategories.forEach(cat => cat.classList.remove('active'));
                category.classList.add('active');
            });
        });
        
        // Helpful buttons
        this.setupFAQHelpfulButtons();
    }
    
    searchFAQ(query) {
        const faqItems = DOMUtils.$$('.faq-item');
        const searchTerm = query.toLowerCase().trim();
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // Highlight search terms
                if (searchTerm !== '') {
                    this.highlightSearchTerms(item, searchTerm);
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        if (query) {
            daVinciState.analytics.track('faq_searched', { query });
        }
    }
    
    highlightSearchTerms(item, searchTerm) {
        const question = item.querySelector('.faq-question h4');
        const answer = item.querySelector('.faq-answer p');
        
        [question, answer].forEach(element => {
            const text = element.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlightedText = text.replace(regex, '<mark>$1</mark>');
            element.innerHTML = highlightedText;
        });
    }
    
    filterFAQByCategory(category) {
        const faqItems = DOMUtils.$$('.faq-item');
        
        faqItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        daVinciState.analytics.track('faq_category_filtered', { category });
    }
    
    setupFAQHelpfulButtons() {
        const helpfulButtons = DOMUtils.$$('.helpful-btn');
        
        helpfulButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const isHelpful = button.dataset.helpful === 'yes';
                const faqItem = button.closest('.faq-item');
                const question = faqItem.querySelector('.faq-question h4').textContent;
                
                // Visual feedback
                button.style.background = isHelpful ? 'var(--success-500)' : 'var(--danger-500)';
                button.style.color = 'var(--text-primary)';
                button.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
                
                // Disable other button in the pair
                const otherButton = faqItem.querySelector(`[data-helpful="${isHelpful ? 'no' : 'yes'}"]`);
                if (otherButton) {
                    otherButton.disabled = true;
                    otherButton.style.opacity = '0.5';
                }
                
                button.disabled = true;
                
                // Track feedback
                daVinciState.analytics.track('faq_feedback', {
                    question,
                    helpful: isHelpful
                });
                
                // Show thank you message
                daVinciState.showNotification(
                    `Thanks for your feedback! ${isHelpful ? '👍' : 'We\'ll improve this answer 👍'}`,
                    'info',
                    3000
                );
            });
        });
    }
    
    setupContactOptions() {
        const optionCards = DOMUtils.$$('.option-card');
        
        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const option = card.dataset.option;
                this.selectContactOption(option);
                
                // Scroll to form
                const form = DOMUtils.$('#contact-form');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                daVinciState.analytics.track('contact_option_selected', { option });
            });
        });
    }
    
    selectContactOption(option) {
        const subjectSelect = DOMUtils.$('#subject');
        const inquiryTypeField = DOMUtils.$('#inquiryType');
        
        if (subjectSelect) {
            // Map option to subject value
            const subjectMap = {
                general: 'general',
                membership: 'membership',
                collaboration: 'collaboration',
                support: 'technical'
            };
            
            const subjectValue = subjectMap[option] || 'general';
            subjectSelect.value = subjectValue;
            
            // Trigger change event
            subjectSelect.dispatchEvent(new Event('change'));
        }
        
        if (inquiryTypeField) {
            inquiryTypeField.value = option;
        }
        
        // Update form styling
        const formContainer = DOMUtils.$('.contact-form-container');
        if (formContainer) {
            formContainer.classList.add(`option-${option}`);
        }
    }
    
    setupEmergencyMode() {
        const emergencyCheckbox = DOMUtils.$('#urgent');
        const emergencyOverlay = DOMUtils.$('#emergencyOverlay');
        const emergencyClose = DOMUtils.$('.emergency-close');
        
        if (emergencyCheckbox) {
            emergencyCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showEmergencyWarning();
                }
            });
        }
        
        if (emergencyClose) {
            emergencyClose.addEventListener('click', () => {
                emergencyOverlay.style.display = 'none';
                this.emergencyMode = false;
            });
        }
    }
    
    showEmergencyWarning() {
        const modal = modalSystem.modals.get('emergencyWarning') || this.createEmergencyWarningModal();
        modalSystem.open('emergencyWarning');
    }
    
    createEmergencyWarningModal() {
        const modal = DOMUtils.create('div', {
            className: 'modal',
            id: 'emergencyWarning',
            innerHTML: `
                <div class="modal-content emergency-warning">
                    <div class="modal-header emergency-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Emergency Contact</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>You've marked this as urgent. This will:</p>
                        <ul>
                            <li>🚨 Immediately notify Jack026 and our emergency team</li>
                            <li>📞 Trigger our emergency response protocol</li>
                            <li>⚡ Guarantee response within 15 minutes</li>
                            <li>📋 Create a high-priority support ticket</li>
                        </ul>
                        <p><strong>Continue only if this requires immediate attention.</strong></p>
                        <div class="emergency-actions">
                            <button class="btn btn-danger" onclick="contactPage.confirmEmergency()">
                                <i class="fas fa-exclamation-circle"></i>
                                Yes, This is Urgent
                            </button>
                            <button class="btn btn-secondary" onclick="contactPage.cancelEmergency()">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `
        });
        
        document.body.appendChild(modal);
        modalSystem.register('emergencyWarning', modal);
        
        return modal;
    }
    
    confirmEmergency() {
        modalSystem.close('emergencyWarning');
        this.emergencyMode = true;
        
        // Update form styling
        const formContainer = DOMUtils.$('.contact-form-container');
        if (formContainer) {
            formContainer.classList.add('emergency-mode');
        }
        
        // Show priority notice
        daVinciState.showNotification(
            '🚨 Emergency mode activated. Jack026 has been notified.',
            'warning',
            10000
        );
        
        daVinciState.analytics.track('emergency_mode_confirmed');
    }
    
    cancelEmergency() {
        modalSystem.close('emergencyWarning');
        
        const emergencyCheckbox = DOMUtils.$('#urgent');
        if (emergencyCheckbox) {
            emergencyCheckbox.checked = false;
        }
        
        this.emergencyMode = false;
    }
    
    updateOfficeStatus() {
        const statusElement = DOMUtils.$('#office-status');
        if (!statusElement) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday
        
        let status = 'Closed';
        let className = 'closed';
        
        // Check if office is open
        if (currentDay >= 1 && currentDay <= 5) { // Monday to Friday
            if (currentHour >= 9 && currentHour < 18) {
                status = 'Open';
                className = 'open';
            }
        } else if (currentDay === 6) { // Saturday
            if (currentHour >= 10 && currentHour < 16) {
                status = 'Open';
                className = 'open';
            }
        }
        
        statusElement.textContent = `Currently ${status}`;
        statusElement.className = `current-status ${className}`;
        
        // Add next opening time if closed
        if (className === 'closed') {
            const nextOpening = this.getNextOpeningTime(now);
            if (nextOpening) {
                statusElement.textContent += ` • Opens ${nextOpening}`;
            }
        }
    }
    
    getNextOpeningTime(now) {
        const currentDay = now.getDay();
        const currentHour = now.getHours();
        
        // If it's a weekday and before 9 AM
        if (currentDay >= 1 && currentDay <= 5 && currentHour < 9) {
            return 'at 9:00 AM';
        }
        
        // If it's Friday evening or weekend
        if (currentDay === 5 && currentHour >= 18) {
            return 'Monday at 9:00 AM';
        }
        
        if (currentDay === 6 && currentHour >= 16) {
            return 'Monday at 9:00 AM';
        }
        
        if (currentDay === 0) { // Sunday
            return 'Monday at 9:00 AM';
        }
        
        // If it's a weekday evening
        if (currentDay >= 1 && currentDay <= 4 && currentHour >= 18) {
            return 'tomorrow at 9:00 AM';
        }
        
        return null;
    }
    
    initializeContactAnalytics() {
        // Track page engagement
        let engagementStartTime = Date.now();
        
        // Track form field interactions
        if (this.form) {
            this.form.addEventListener('focusin', (e) => {
                daVinciState.analytics.track('form_field_focused', {
                    field: e.target.name || e.target.id
                });
            });
        }
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track milestones
                if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                    daVinciState.analytics.track('scroll_depth_25');
                } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                    daVinciState.analytics.track('scroll_depth_50');
                } else if (maxScrollDepth >= 75) {
                    daVinciState.analytics.track('scroll_depth_75');
                }
            }
        });
        
        // Track time on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - engagementStartTime;
            daVinciState.analytics.track('page_time', {
                duration: timeOnPage,
                maxScrollDepth
            });
        });
        
        // Track clicks on important elements
        const trackableElements = DOMUtils.$$('[data-analytics]');
        trackableElements.forEach(element => {
            element.addEventListener('click', () => {
                const action = element.dataset.analytics;
                daVinciState.analytics.track('element_clicked', { action });
            });
        });
    }
}

// Contact Analytics Extension
class ContactAnalytics {
    constructor() {
        this.metrics = {
            formStarted: false,
            formCompleted: false,
            fieldsInteracted: new Set(),
            errorsEncountered: [],
            helpSectionVisited: false,
            chatOpened: false,
            emergencyActivated: false
        };
        
        this.startTime = Date.now();
    }
    
    trackFormProgress(fieldName) {
        if (!this.metrics.formStarted) {
            this.metrics.formStarted = true;
            daVinciState.analytics.track('contact_form_started');
        }
        
        this.metrics.fieldsInteracted.add(fieldName);
        
        // Calculate completion percentage
        const totalFields = 6; // firstName, lastName, email, subject, message, privacy
        const completionPercentage = (this.metrics.fieldsInteracted.size / totalFields) * 100;
        
        if (completionPercentage >= 50 && !this.metrics.halfwayReached) {
            this.metrics.halfwayReached = true;
            daVinciState.analytics.track('contact_form_halfway');
        }
    }
    
    trackFormError(fieldName, error) {
        this.metrics.errorsEncountered.push({
            field: fieldName,
            error,
            timestamp: Date.now()
        });
        
        daVinciState.analytics.track('contact_form_error', {
            field: fieldName,
            error
        });
    }
    
    trackFormCompletion() {
        this.metrics.formCompleted = true;
        
        const completionTime = Date.now() - this.startTime;
        const errorCount = this.metrics.errorsEncountered.length;
        
        daVinciState.analytics.track('contact_form_completed', {
            completionTime,
            errorCount,
            fieldsInteracted: this.metrics.fieldsInteracted.size
        });
    }
}

// Real-time Contact Updates
class ContactRealTime {
    constructor() {
        this.isConnected = false;
        this.responseTime = '2 minutes';
        this.queuePosition = 1;
        
        this.init();
    }
    
    init() {
        this.updateRealTimeStats();
        this.setupRealTimeUpdates();
        
        // Update every 30 seconds
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);
    }
    
    updateRealTimeStats() {
        // Update response time
        const responseTimeElements = DOMUtils.$$('.response-time span');
        responseTimeElements.forEach(el => {
            el.textContent = this.responseTime;
        });
        
        // Update queue position
        const queueElements = DOMUtils.$$('.queue-position');
        queueElements.forEach(el => {
            el.textContent = this.queuePosition === 1 ? 'Next' : `#${this.queuePosition}`;
        });
        
        // Update Jack026 status
        this.updateJack026Status();
    }
    
    updateJack026Status() {
        const statusElements = DOMUtils.$$('.jack026-status, .user-status');
        const availabilityElements = DOMUtils.$$('.contact-availability');
        
        // Simulate Jack026's availability (he's usually online!)
        const isOnline = Math.random() > 0.1; // 90% chance he's online
        
        statusElements.forEach(el => {
            el.textContent = isOnline ? 'Online' : 'Away';
            el.className = isOnline ? 'status online' : 'status away';
        });
        
        availabilityElements.forEach(el => {
            el.textContent = isOnline ? 'Available now' : 'Back soon';
        });
    }
    
    setupRealTimeUpdates() {
        // Listen for WebSocket updates
        document.addEventListener('davinciUpdate', (e) => {
            const { type, data } = e.detail;
            
            switch (type) {
                case 'contact_response_time':
                    this.responseTime = data.responseTime;
                    break;
                case 'jack026_status':
                    this.updateJack026StatusFromServer(data);
                    break;
                case 'queue_update':
                    this.queuePosition = data.position;
                    break;
            }
        });
    }
    
    updateJack026StatusFromServer(data) {
        const { isOnline, lastSeen, responseTime } = data;
        
        // Update UI elements with real data
        const statusElements = DOMUtils.$$('.jack026-status');
        statusElements.forEach(el => {
            el.textContent = isOnline ? 'Online' : `Last seen ${lastSeen}`;
            el.className = isOnline ? 'status online' : 'status offline';
        });
        
        if (responseTime) {
            this.responseTime = responseTime;
        }
    }
}

// Initialize Contact Page
let contactPage, contactAnalytics, contactRealTime;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on contact page
    if (window.location.pathname === '/contact') {
        contactPage = new ContactPage();
        contactAnalytics = new ContactAnalytics();
        contactRealTime = new ContactRealTime();
        
        // Make globally available
        window.contactPage = contactPage;
        
        console.log(`📞 Contact page fully initialized for ${DAVINCI_CONFIG.currentUser} at ${new Date().toISOString()}`);
    }
});

// Handle real-time notifications
document.addEventListener('davinciUpdate', (e) => {
    const { type, data } = e.detail;
    
    if (type === 'contact_notification') {
        daVinciState.showNotification(data.message, data.level);
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContactPage,
        ContactAnalytics,
        ContactRealTime
    };
}