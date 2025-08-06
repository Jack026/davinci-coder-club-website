// Events Page JavaScript
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentPage = 1;
        this.eventsPerPage = 9;
        this.currentFilters = {
            category: 'all',
            status: 'upcoming',
            featured: false,
            search: ''
        };
        this.currentView = 'grid';
        this.currentMonth = new Date();
        
        this.init();
    }
    
    init() {
        this.initializeEventListeners();
        this.loadEvents();
        this.initializeCalendar();
    }
    
    initializeEventListeners() {
        // Filter controls
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('featuredFilter')?.addEventListener('click', (e) => {
            this.currentFilters.featured = !this.currentFilters.featured;
            e.target.classList.toggle('active');
            this.applyFilters();
        });
        
        document.getElementById('searchEvents')?.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // View toggle
        document.getElementById('gridView')?.addEventListener('click', () => {
            this.setView('grid');
        });
        
        document.getElementById('listView')?.addEventListener('click', () => {
            this.setView('list');
        });
        
        // Registration modal
        const modal = document.getElementById('registrationModal');
        const closeBtn = modal?.querySelector('.close');
        
        closeBtn?.addEventListener('click', () => {
            this.closeRegistrationModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeRegistrationModal();
            }
        });
        
        // Registration form
        document.getElementById('registrationForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration(e);
        });
        
        // Newsletter form
        document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSignup(e);
        });
        
        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.renderCalendar();
        });
    }
    
    async loadEvents() {
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            
            if (response.ok) {
                this.events = data.events || [];
                this.applyFilters();
                this.renderFeaturedEvents();
                this.renderCalendar();
            } else {
                this.showError('Failed to load events');
            }
        } catch (error) {
            console.error('Error loading events:', error);
            // Load sample data for demo
            this.loadSampleEvents();
        }
        
        this.showLoading(false);
    }
    
    loadSampleEvents() {
        this.events = [
            {
                _id: '1',
                title: 'CodeFest 2024',
                description: '48-hour intense coding marathon with prizes worth ₹1,00,000',
                category: 'Hackathon',
                date: new Date('2024-08-15'),
                endDate: new Date('2024-08-17'),
                time: '9:00 AM',
                venue: 'ADTU Campus',
                capacity: 200,
                registered: 145,
                status: 'upcoming',
                featured: true,
                organizer: 'Da-Vinci Coder Club',
                tags: ['hackathon', 'prizes', 'coding'],
                registrationOpen: true
            },
            {
                _id: '2',
                title: 'AI/ML Bootcamp',
                description: 'Learn cutting-edge machine learning techniques from industry experts',
                category: 'Workshop',
                date: new Date('2024-08-22'),
                endDate: new Date('2024-08-24'),
                time: '10:00 AM',
                venue: 'Computer Lab 1',
                capacity: 50,
                registered: 35,
                status: 'upcoming',
                featured: true,
                organizer: 'Tech Team',
                tags: ['ai', 'ml', 'workshop'],
                registrationOpen: true
            },
            {
                _id: '3',
                title: 'Tech Talk Series',
                description: 'Industry experts share latest trends in technology',
                category: 'Seminar',
                date: new Date('2024-09-05'),
                time: '2:00 PM',
                venue: 'Auditorium',
                capacity: 100,
                registered: 67,
                status: 'upcoming',
                featured: false,
                organizer: 'Guest Speaker Program',
                tags: ['tech', 'trends', 'seminar'],
                registrationOpen: true
            },
            {
                _id: '4',
                title: 'Web Development Workshop',
                description: 'Build modern web applications with React and Node.js',
                category: 'Workshop',
                date: new Date('2024-07-20'),
                time: '10:00 AM',
                venue: 'Computer Lab 2',
                capacity: 40,
                registered: 40,
                status: 'completed',
                featured: false,
                organizer: 'Web Team',
                tags: ['web', 'react', 'nodejs'],
                registrationOpen: false
            },
            {
                _id: '5',
                title: 'Coding Competition',
                description: 'Test your programming skills in this competitive event',
                category: 'Competition',
                date: new Date('2024-08-30'),
                time: '11:00 AM',
                venue: 'Computer Lab 3',
                capacity: 60,
                registered: 25,
                status: 'upcoming',
                featured: false,
                organizer: 'Competitive Programming Team',
                tags: ['competition', 'programming'],
                registrationOpen: true
            }
        ];
        
        this.applyFilters();
        this.renderFeaturedEvents();
        this.renderCalendar();
    }
    
    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Category filter
            if (this.currentFilters.category !== 'all' && event.category !== this.currentFilters.category) {
                return false;
            }
            
            // Status filter
            if (event.status !== this.currentFilters.status) {
                return false;
            }
            
            // Featured filter
            if (this.currentFilters.featured && !event.featured) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchFields = [
                    event.title,
                    event.description,
                    event.category,
                    event.organizer,
                    ...(event.tags || [])
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderEvents();
        this.renderPagination();
    }
    
    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${view}View`)?.classList.add('active');
        
        // Update container class
        const container = document.getElementById('eventsContainer');
        if (container) {
            container.className = view === 'grid' ? 'events-grid' : 'events-grid list-view';
        }
        
        this.renderEvents();
    }
    
    renderFeaturedEvents() {
        const container = document.getElementById('featuredEventsContainer');
        if (!container) return;
        
        const featuredEvents = this.events.filter(event => event.featured);
        
        if (featuredEvents.length === 0) {
            container.innerHTML = '<p class="no-events">No featured events at the moment.</p>';
            return;
        }
        
        container.innerHTML = featuredEvents.map(event => this.createFeaturedEventCard(event)).join('');
        
        // Add event listeners for registration buttons
        this.addEventListeners(container);
    }
    
    renderEvents() {
        const container = document.getElementById('eventsContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const eventsToShow = this.filteredEvents.slice(startIndex, endIndex);
        
        if (eventsToShow.length === 0) {
            container.innerHTML = '<div class="no-events"><p>No events found matching your criteria.</p></div>';
            return;
        }
        
        const isListView = this.currentView === 'list';
        container.innerHTML = eventsToShow.map(event => 
            this.createEventCard(event, isListView)
        ).join('');
        
        // Add event listeners
        this.addEventListeners(container);
    }
    
    createFeaturedEventCard(event) {
        const eventDate = new Date(event.date);
        const capacity = event.capacity || 0;
        const registered = event.registered || 0;
        const capacityPercentage = capacity > 0 ? (registered / capacity) * 100 : 0;
        
        return `
            <div class="featured-event-card" data-event-id="${event._id}">
                <div class="featured-badge">
                    <i class="fas fa-star"></i>
                    Featured
                </div>
                <div class="event-date">
                    <span class="day">${eventDate.getDate()}</span>
                    <span class="month">${eventDate.toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div class="event-content">
                    <div class="event-category">${event.category}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.venue}</span>
                        <span><i class="fas fa-user"></i> ${event.organizer}</span>
                    </div>
                    <div class="event-capacity">
                        <span>${registered}/${capacity} registered</span>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                        </div>
                    </div>
                    <div class="event-actions">
                        ${event.registrationOpen && event.status === 'upcoming' ? 
                            `<button class="event-btn primary" onclick="eventsManager.openRegistrationModal('${event._id}')">
                                <span>Register Now</span>
                                <i class="fas fa-user-plus"></i>
                            </button>` :
                            `<button class="event-btn" disabled>
                                <span>Registration Closed</span>
                            </button>`
                        }
                        <button class="event-btn" onclick="eventsManager.viewEventDetails('${event._id}')">
                            <span>View Details</span>
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createEventCard(event, isListView = false) {
        const eventDate = new Date(event.date);
        const capacity = event.capacity || 0;
        const registered = event.registered || 0;
        const capacityPercentage = capacity > 0 ? (registered / capacity) * 100 : 0;
        
        const cardClass = isListView ? 'event-card list-view' : 'event-card';
        
        return `
            <div class="${cardClass}" data-event-id="${event._id}">
                <div class="event-date">
                    <span class="day">${eventDate.getDate()}</span>
                    <span class="month">${eventDate.toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div class="event-content">
                    <div class="event-category">${event.category}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.venue}</span>
                        <span><i class="fas fa-user"></i> ${event.organizer}</span>
                        <span class="event-status ${event.status}">${event.status}</span>
                    </div>
                    ${!isListView ? `
                        <div class="event-capacity">
                            <span>${registered}/${capacity} registered</span>
                            <div class="capacity-bar">
                                <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="event-actions">
                    ${event.registrationOpen && event.status === 'upcoming' ? 
                        `<button class="event-btn primary" onclick="eventsManager.openRegistrationModal('${event._id}')">
                            <span>Register</span>
                            <i class="fas fa-user-plus"></i>
                        </button>` :
                        `<span class="event-status ${event.status}">${event.status}</span>`
                    }
                    <button class="event-btn" onclick="eventsManager.viewEventDetails('${event._id}')">
                        <span>Details</span>
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    addEventListeners(container) {
        // Event listeners are handled through onclick attributes in the HTML
        // This method can be used for additional event listeners if needed
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="eventsManager.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button onclick="eventsManager.goToPage(${i})" 
                            ${i === this.currentPage ? 'class="active"' : ''}>
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span>...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button onclick="eventsManager.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderEvents();
        this.renderPagination();
        
        // Scroll to events section
        document.getElementById('eventsContainer')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    openRegistrationModal(eventId) {
        const event = this.events.find(e => e._id === eventId);
        if (!event) return;
        
        const modal = document.getElementById('registrationModal');
        const eventIdInput = document.getElementById('eventId');
        
        if (modal && eventIdInput) {
            eventIdInput.value = eventId;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeRegistrationModal() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            const form = document.getElementById('registrationForm');
            if (form) form.reset();
        }
    }
    
    async handleRegistration(event) {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`/api/events/${data.eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Registration successful! Check your email for confirmation.', 'success');
                this.closeRegistrationModal();
                this.loadEvents(); // Refresh events to update registration count
            } else {
                this.showNotification(result.error || 'Registration failed. Please try again.', 'error');