/* ========================================
   PERFECT EVENTS PAGE JAVASCRIPT
   Updated: 2025-08-06 11:34:34 UTC
   Built by: Jack026 for Jack026
======================================== */

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
        this.currentSort = 'date-asc';
        
        this.init();
    }
    
    init() {
        this.initializeEventListeners();
        this.loadEvents();
        this.initializeCalendar();
        this.updateUserGreeting();
    }
    
    updateUserGreeting() {
        const user = 'Jack026';
        const greetings = document.querySelectorAll('.user-greeting');
        greetings.forEach(el => {
            el.textContent = el.textContent.replace('Jack026', user);
        });
    }
    
    initializeEventListeners() {
        // Filter controls
        this.addEventListenerSafe('categoryFilter', 'change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
            this.updateActiveFilters();
        });
        
        this.addEventListenerSafe('statusFilter', 'change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
            this.updateActiveFilters();
        });
        
        this.addEventListenerSafe('featuredFilter', 'click', (e) => {
            this.currentFilters.featured = !this.currentFilters.featured;
            e.target.classList.toggle('active');
            this.applyFilters();
            this.updateActiveFilters();
        });
        
        this.addEventListenerSafe('searchEvents', 'input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
            this.updateActiveFilters();
        });
        
        // Sort control
        this.addEventListenerSafe('sortEvents', 'change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });
        
        // Clear filters
        this.addEventListenerSafe('clearFilters', 'click', () => {
            this.clearAllFilters();
        });
        
        this.addEventListenerSafe('resetFilters', 'click', () => {
            this.clearAllFilters();
        });
        
        // View toggle
        this.addEventListenerSafe('gridView', 'click', () => {
            this.setView('grid');
        });
        
        this.addEventListenerSafe('listView', 'click', () => {
            this.setView('list');
        });
        
        // Registration modal
        const modal = document.getElementById('registrationModal');
        const closeBtn = modal?.querySelector('.modal-close');
        
        closeBtn?.addEventListener('click', () => {
            this.closeRegistrationModal();
        });
        
        this.addEventListenerSafe('cancelRegistration', 'click', () => {
            this.closeRegistrationModal();
        });
        
        this.addEventListenerSafe('closeSuccess', 'click', () => {
            this.closeRegistrationModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeRegistrationModal();
            }
        });
        
        // Forms
        this.addEventListenerSafe('registrationForm', 'submit', (e) => {
            e.preventDefault();
            this.handleRegistration(e);
        });
        
        this.addEventListenerSafe('newsletterForm', 'submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSignup(e);
        });
        
        // Calendar navigation
        this.addEventListenerSafe('prevMonth', 'click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.renderCalendar();
        });
        
        this.addEventListenerSafe('nextMonth', 'click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.renderCalendar();
        });
        
        this.addEventListenerSafe('todayBtn', 'click', () => {
            this.currentMonth = new Date();
            this.renderCalendar();
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeRegistrationModal();
            }
        });
    }
    
    addEventListenerSafe(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        }
    }
    
    async loadEvents() {
        this.showLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.loadSampleEvents();
        } catch (error) {
            console.error('Error loading events:', error);
            this.showNotification('Failed to load events', 'error');
            this.loadSampleEvents();
        }
        
        this.showLoading(false);
    }
    
    loadSampleEvents() {
        const currentDate = new Date();
        
        this.events = [
            {
                _id: '1',
                title: 'CodeVinci Hackathon 2024',
                description: '48-hour intensive coding marathon with exciting challenges and amazing prizes worth ₹1,00,000. Join Jack026 and 150+ developers in this ultimate coding adventure!',
                category: 'Hackathon',
                date: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                endDate: new Date(currentDate.getTime() + 12 * 24 * 60 * 60 * 1000),
                time: '9:00 AM',
                venue: 'ADTU Main Campus, Tech Park',
                capacity: 200,
                registered: 145,
                status: 'upcoming',
                featured: true,
                organizer: 'Da-Vinci Coder Club',
                tags: ['hackathon', 'prizes', 'coding', 'innovation'],
                registrationOpen: true,
                price: 'Free',
                requirements: 'Laptop, Programming Knowledge'
            },
            {
                _id: '2',
                title: 'AI/ML Bootcamp: Future of Technology',
                description: 'Comprehensive 3-day bootcamp covering machine learning, deep learning, and AI applications. Learn from industry experts and build real-world projects.',
                category: 'Workshop',
                date: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000),
                endDate: new Date(currentDate.getTime() + 17 * 24 * 60 * 60 * 1000),
                time: '10:00 AM',
                venue: 'Computer Science Lab 1',
                capacity: 50,
                registered: 35,
                status: 'upcoming',
                featured: true,
                organizer: 'AI Research Team',
                tags: ['ai', 'ml', 'workshop', 'hands-on'],
                registrationOpen: true,
                price: '₹499',
                requirements: 'Basic Python Knowledge'
            },
            {
                _id: '3',
                title: 'Tech Talk: Industry Trends 2024',
                description: 'Industry leaders from Google, Microsoft, and startups share insights on emerging technologies, career opportunities, and future trends.',
                category: 'Seminar',
                date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                time: '2:00 PM',
                venue: 'Main Auditorium',
                capacity: 300,
                registered: 267,
                status: 'upcoming',
                featured: true,
                organizer: 'Industry Connect Program',
                tags: ['tech-talk', 'industry', 'career', 'networking'],
                registrationOpen: true,
                price: 'Free',
                requirements: 'None'
            },
            {
                _id: '4',
                title: 'Web Development Masterclass',
                description: 'Build modern, responsive web applications using React, Node.js, and MongoDB. Perfect for beginners and intermediate developers.',
                category: 'Workshop',
                date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                time: '10:00 AM',
                venue: 'Computer Lab 2',
                capacity: 40,
                registered: 40,
                status: 'completed',
                featured: false,
                organizer: 'Web Development Team',
                tags: ['web', 'react', 'nodejs', 'fullstack'],
                registrationOpen: false,
                price: '₹299',
                requirements: 'Basic HTML/CSS/JS'
            },
            {
                _id: '5',
                title: 'Competitive Programming Contest',
                description: 'Test your algorithmic thinking and problem-solving skills in this exciting programming competition with cash prizes.',
                category: 'Competition',
                date: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000),
                time: '11:00 AM',
                venue: 'Computer Lab 3',
                capacity: 100,
                registered: 45,
                status: 'upcoming',
                featured: false,
                organizer: 'Competitive Programming Club',
                tags: ['competition', 'algorithms', 'problem-solving'],
                registrationOpen: true,
                price: 'Free',
                requirements: 'Programming Knowledge'
            },
            {
                _id: '6',
                title: 'Mobile App Development with Flutter',
                description: 'Learn to build cross-platform mobile applications using Flutter. Create your first app and deploy it to app stores.',
                category: 'Workshop',
                date: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000),
                time: '9:30 AM',
                venue: 'Mobile Development Lab',
                capacity: 30,
                registered: 18,
                status: 'upcoming',
                featured: false,
                organizer: 'Mobile Dev Team',
                tags: ['mobile', 'flutter', 'cross-platform'],
                registrationOpen: true,
                price: '₹399',
                requirements: 'Basic Programming'
            },
            {
                _id: '7',
                title: 'Blockchain & Cryptocurrency Workshop',
                description: 'Understand blockchain technology, smart contracts, and cryptocurrency. Build your own blockchain project.',
                category: 'Workshop',
                date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                time: '1:00 PM',
                venue: 'Innovation Hub',
                capacity: 25,
                registered: 12,
                status: 'upcoming',
                featured: false,
                organizer: 'Blockchain Research Group',
                tags: ['blockchain', 'cryptocurrency', 'web3'],
                registrationOpen: true,
                price: '₹599',
                requirements: 'Programming Knowledge'
            },
            {
                _id: '8',
                title: 'DevOps and Cloud Computing',
                description: 'Master DevOps practices, CI/CD pipelines, and cloud deployment strategies using AWS and Docker.',
                category: 'Workshop',
                date: new Date(currentDate.getTime() + 35 * 24 * 60 * 60 * 1000),
                time: '10:30 AM',
                venue: 'Cloud Lab',
                capacity: 35,
                registered: 22,
                status: 'upcoming',
                featured: false,
                organizer: 'Cloud Computing Team',
                tags: ['devops', 'cloud', 'aws', 'docker'],
                registrationOpen: true,
                price: '₹699',
                requirements: 'Basic Linux Knowledge'
            }
        ];
        
        this.applyFilters();
        this.renderFeaturedEvents();
        this.renderCalendar();
        this.updateEventsCounter();
    }
    
    clearAllFilters() {
        this.currentFilters = {
            category: 'all',
            status: 'upcoming',
            featured: false,
            search: ''
        };
        
        // Reset UI
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const featuredFilter = document.getElementById('featuredFilter');
        const searchInput = document.getElementById('searchEvents');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'upcoming';
        if (featuredFilter) featuredFilter.classList.remove('active');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
        this.updateActiveFilters();
    }
    
    updateActiveFilters() {
        const filtersList = document.getElementById('filtersList');
        const clearBtn = document.getElementById('clearFilters');
        
        if (!filtersList) return;
        
        const activeFilters = [];
        
        if (this.currentFilters.category !== 'all') {
            activeFilters.push({
                label: `Category: ${this.currentFilters.category}`,
                key: 'category'
            });
        }
        
        if (this.currentFilters.status !== 'upcoming') {
            activeFilters.push({
                label: `Status: ${this.currentFilters.status}`,
                key: 'status'
            });
        }
        
        if (this.currentFilters.featured) {
            activeFilters.push({
                label: 'Featured Only',
                key: 'featured'
            });
        }
        
        if (this.currentFilters.search) {
            activeFilters.push({
                label: `Search: "${this.currentFilters.search}"`,
                key: 'search'
            });
        }
        
        if (activeFilters.length === 0) {
            filtersList.innerHTML = '<span class="no-filters">No active filters</span>';
            if (clearBtn) clearBtn.style.display = 'none';
        } else {
            filtersList.innerHTML = activeFilters.map(filter => `
                <div class="filter-tag">
                    ${filter.label}
                    <button onclick="eventsManager.removeFilter('${filter.key}')" aria-label="Remove filter">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
            if (clearBtn) clearBtn.style.display = 'block';
        }
    }
    
    removeFilter(key) {
        switch (key) {
            case 'category':
                this.currentFilters.category = 'all';
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) categoryFilter.value = 'all';
                break;
            case 'status':
                this.currentFilters.status = 'upcoming';
                const statusFilter = document.getElementById('statusFilter');
                if (statusFilter) statusFilter.value = 'upcoming';
                break;
            case 'featured':
                this.currentFilters.featured = false;
                const featuredFilter = document.getElementById('featuredFilter');
                if (featuredFilter) featuredFilter.classList.remove('active');
                break;
            case 'search':
                this.currentFilters.search = '';
                const searchInput = document.getElementById('searchEvents');
                if (searchInput) searchInput.value = '';
                break;
        }
        
        this.applyFilters();
        this.updateActiveFilters();
    }
    
    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Category filter
            if (this.currentFilters.category !== 'all' && event.category !== this.currentFilters.category) {
                return false;
            }
            
            // Status filter
            if (this.currentFilters.status !== 'all' && event.status !== this.currentFilters.status) {
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
                    event.venue,
                    ...(event.tags || [])
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Apply sorting
        this.sortEvents();
        
        this.currentPage = 1;
        this.renderEvents();
        this.renderPagination();
        this.updateEventsCounter();
        this.showNoEventsMessage();
    }
    
    sortEvents() {
        this.filteredEvents.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'popularity':
                    return (b.registered || 0) - (a.registered || 0);
                default:
                    return 0;
            }
        });
    }
    
    updateEventsCounter() {
        const currentCount = document.getElementById('currentCount');
        const totalCount = document.getElementById('totalCount');
        
        if (currentCount && totalCount) {
            const startIndex = (this.currentPage - 1) * this.eventsPerPage;
            const endIndex = Math.min(startIndex + this.eventsPerPage, this.filteredEvents.length);
            const showing = this.filteredEvents.length > 0 ? `${startIndex + 1}-${endIndex}` : '0';
            
            currentCount.textContent = showing;
            totalCount.textContent = this.filteredEvents.length;
        }
    }
    
    showNoEventsMessage() {
        const noEventsMessage = document.getElementById('noEventsMessage');
        const eventsContainer = document.getElementById('eventsContainer');
        
        if (this.filteredEvents.length === 0) {
            if (noEventsMessage) noEventsMessage.style.display = 'block';
            if (eventsContainer) eventsContainer.style.display = 'none';
        } else {
            if (noEventsMessage) noEventsMessage.style.display = 'none';
            if (eventsContainer) eventsContainer.style.display = 'grid';
        }
    }
    
    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        const activeBtn = document.getElementById(`${view}View`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
        
        // Update container class
        const container = document.getElementById('eventsContainer');
        if (container) {
            container.className = view === 'grid' ? 'events-grid' : 'events-grid list-view';
        }
        
        this.renderEvents();
        
        // Analytics
        this.trackEvent('view_changed', { view: view });
    }
    
    renderFeaturedEvents() {
        const container = document.getElementById('featuredEventsContainer');
        if (!container) return;
        
        const featuredEvents = this.events.filter(event => event.featured && event.status === 'upcoming');
        
        if (featuredEvents.length === 0) {
            container.innerHTML = `
                <div class="events-loading">
                    <div class="no-events-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <p>No featured events at the moment. Check back soon for exciting opportunities!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = featuredEvents.map(event => this.createFeaturedEventCard(event)).join('');
    }
    
    renderEvents() {
        const container = document.getElementById('eventsContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const eventsToShow = this.filteredEvents.slice(startIndex, endIndex);
        
        if (eventsToShow.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const isListView = this.currentView === 'list';
        container.innerHTML = eventsToShow.map(event => 
            this.createEventCard(event, isListView)
        ).join('');
    }
    
    createFeaturedEventCard(event) {
        const eventDate = new Date(event.date);
        const capacity = event.capacity || 0;
        const registered = event.registered || 0;
        const capacityPercentage = capacity > 0 ? Math.min((registered / capacity) * 100, 100) : 0;
        const isAlmostFull = capacityPercentage > 80;
        
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
                    <div class="event-category">${this.getCategoryIcon(event.category)} ${event.category}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.venue}</span>
                        <span><i class="fas fa-user"></i> ${event.organizer}</span>
                        <span><i class="fas fa-tag"></i> ${event.price}</span>
                    </div>
                    <div class="event-capacity">
                        <span>${registered}/${capacity} registered ${isAlmostFull ? '🔥' : ''}</span>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                        </div>
                        ${isAlmostFull ? '<small style="color: var(--warning-500);">Almost full! Register soon.</small>' : ''}
                    </div>
                    <div class="event-actions">
                        ${event.registrationOpen && event.status === 'upcoming' ? 
                            `<button class="event-btn primary" onclick="eventsManager.openRegistrationModal('${event._id}')" aria-label="Register for ${event.title}">
                                <span>Register Now</span>
                                <i class="fas fa-user-plus"></i>
                            </button>` :
                            `<button class="event-btn" disabled aria-label="Registration closed for ${event.title}">
                                <span>Registration Closed</span>
                            </button>`
                        }
                        <button class="event-btn" onclick="eventsManager.viewEventDetails('${event._id}')" aria-label="View details for ${event.title}">
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
        const capacityPercentage = capacity > 0 ? Math.min((registered / capacity) * 100, 100) : 0;
        const isAlmostFull = capacityPercentage > 80;
        
        const cardClass = isListView ? 'event-card list-view' : 'event-card';
        
        return `
            <div class="${cardClass}" data-event-id="${event._id}">
                <div class="event-date">
                    <span class="day">${eventDate.getDate()}</span>