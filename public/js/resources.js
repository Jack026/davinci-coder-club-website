/* ========================================
   RESOURCES PAGE JAVASCRIPT
   Updated: 2025-08-06 13:08:47 UTC
   Built for: Jack026
======================================== */

class ResourcesPage {
    constructor() {
        this.resources = [];
        this.filteredResources = [];
        this.currentFilters = {};
        this.currentSort = 'recent';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.jack026Progress = {
            tutorials: 65,
            documentation: 45,
            tools: 80,
            challenges: 55,
            downloads: 35,
            articles: 70
        };
        
        this.init();
    }
    
    init() {
        this.setupFilters();
        this.setupViewControls();
        this.setupSearch();
        this.setupPersonalizedDashboard();
        this.loadResources();
        this.setupInfiniteScroll();
        this.updateUserProgress();
        
        console.log(`📚 Resources page initialized for ${DAVINCI_CONFIG.currentUser}`);
    }
    
    async loadResources() {
        try {
            this.showLoading();
            
            // Mock API call - replace with actual endpoint
            const response = await this.mockResourcesAPI();
            this.resources = response.resources;
            this.filteredResources = [...this.resources];
            
            this.renderResources();
            this.updateResourceCount();
            this.hideLoading();
            
            daVinciState.analytics.track('resources_loaded', {
                count: this.resources.length
            });
            
        } catch (error) {
            console.error('Failed to load resources:', error);
            this.showError('Failed to load resources. Please try again.');
        }
    }
    
    async mockResourcesAPI() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            resources: [
                {
                    id: 1,
                    title: 'Advanced React Patterns',
                    description: 'Master advanced React patterns including render props, higher-order components, and custom hooks.',
                    category: 'tutorials',
                    difficulty: 'advanced',
                    technology: 'react',
                    type: 'video',
                    duration: '2h 30m',
                    rating: 4.8,
                    views: 15420,
                    author: 'Jack026',
                    date: '2025-08-01',
                    bookmarked: true,
                    completed: false,
                    progress: 60,
                    tags: ['react', 'javascript', 'patterns', 'hooks'],
                    featured: true
                },
                {
                    id: 2,
                    title: 'Python for Data Science',
                    description: 'Complete guide to using Python for data analysis, visualization, and machine learning.',
                    category: 'tutorials',
                    difficulty: 'intermediate',
                    technology: 'python',
                    type: 'course',
                    duration: '8h 15m',
                    rating: 4.9,
                    views: 23150,
                    author: 'Data Science Team',
                    date: '2025-07-28',
                    bookmarked: false,
                    completed: false,
                    progress: 0,
                    tags: ['python', 'data-science', 'pandas', 'numpy'],
                    featured: true
                },
                {
                    id: 3,
                    title: 'Docker Containerization Guide',
                    description: 'Learn how to containerize applications using Docker and deploy them efficiently.',
                    category: 'documentation',
                    difficulty: 'intermediate',
                    technology: 'docker',
                    type: 'guide',
                    pages: 45,
                    rating: 4.7,
                    views: 8930,
                    author: 'DevOps Team',
                    date: '2025-07-25',
                    bookmarked: true,
                    completed: true,
                    progress: 100,
                    tags: ['docker', 'containers', 'devops', 'deployment']
                },
                {
                    id: 4,
                    title: 'VS Code Extensions Pack',
                    description: 'Essential VS Code extensions for web development, including themes and productivity tools.',
                    category: 'tools',
                    difficulty: 'beginner',
                    technology: 'javascript',
                    type: 'extension',
                    downloads: 12500,
                    rating: 4.6,
                    views: 5240,
                    author: 'Jack026',
                    date: '2025-07-20',
                    bookmarked: false,
                    completed: false,
                    progress: 0,
                    tags: ['vscode', 'extensions', 'productivity', 'tools']
                },
                {
                    id: 5,
                    title: 'Algorithm Challenge: Binary Trees',
                    description: 'Practice binary tree algorithms with progressive difficulty levels and detailed solutions.',
                    category: 'challenges',
                    difficulty: 'advanced',
                    technology: 'algorithms',
                    type: 'challenge',
                    problems: 15,
                    rating: 4.5,
                    views: 3420,
                    author: 'Algorithm Team',
                    date: '2025-07-15',
                    bookmarked: false,
                    completed: false,
                    progress: 40,
                    tags: ['algorithms', 'binary-trees', 'data-structures', 'coding-challenge']
                },
                {
                    id: 6,
                    title: 'React Component Library',
                    description: 'Complete React component library with TypeScript support and Storybook documentation.',
                    category: 'downloads',
                    difficulty: 'intermediate',
                    technology: 'react',
                    type: 'library',
                    fileSize: '2.5 MB',
                    downloads: 8750,
                    rating: 4.8,
                    views: 6890,
                    author: 'Frontend Team',
                    date: '2025-07-10',
                    bookmarked: true,
                    completed: false,
                    progress: 0,
                    tags: ['react', 'typescript', 'components', 'ui-library']
                }
                // Add more mock resources here...
            ]
        };
    }
    
    setupFilters() {
        const filterElements = {
            category: DOMUtils.$('#categoryFilter'),
            difficulty: DOMUtils.$('#difficultyFilter'),
            technology: DOMUtils.$('#technologyFilter'),
            sort: DOMUtils.$('#sortBy')
        };
        
        Object.entries(filterElements).forEach(([key, element]) => {
            if (element) {
                element.addEventListener('change', (e) => {
                    this.handleFilterChange(key, e.target.value);
                });
            }
        });
        
        // Clear filters button
        const clearFiltersBtn = DOMUtils.$('#clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        // Reset filters button
        const resetFiltersBtn = DOMUtils.$('#resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    
    handleFilterChange(filterType, value) {
        if (value === 'all' || value === '') {
            delete this.currentFilters[filterType];
        } else {
            this.currentFilters[filterType] = value;
        }
        
        this.updateActiveFilters();
        this.applyFilters();
        this.currentPage = 1;
        this.renderResources();
        
        daVinciState.analytics.track('resource_filter_applied', {
            filterType,
            value,
            activeFilters: Object.keys(this.currentFilters).length
        });
    }
    
    updateActiveFilters() {
        const filtersList = DOMUtils.$('#filtersList');
        const clearFiltersBtn = DOMUtils.$('#clearFilters');
        
        if (!filtersList) return;
        
        filtersList.innerHTML = '';
        
        Object.entries(this.currentFilters).forEach(([type, value]) => {
            const filterTag = DOMUtils.create('div', {
                className: 'filter-tag',
                innerHTML: `
                    <span>${this.formatFilterValue(type, value)}</span>
                    <button onclick="resourcesPage.removeFilter('${type}')">
                        <i class="fas fa-times"></i>
                    </button>
                `
            });
            
            filtersList.appendChild(filterTag);
        });
        
        // Show/hide clear button
        if (clearFiltersBtn) {
            clearFiltersBtn.style.display = Object.keys(this.currentFilters).length > 0 ? 'block' : 'none';
        }
    }
    
    formatFilterValue(type, value) {
        const formatMap = {
            category: {
                tutorials: '📚 Tutorials',
                documentation: '📖 Documentation',
                tools: '🔧 Tools',
                challenges: '🏆 Challenges',
                downloads: '📦 Downloads',
                articles: '📰 Articles'
            },
            difficulty: {
                beginner: '🌱 Beginner',
                intermediate: '🚀 Intermediate',
                advanced: '⭐ Advanced',
                expert: '🏆 Expert'
            },
            technology: {
                javascript: '🟨 JavaScript',
                python: '🐍 Python',
                react: '⚛️ React',
                nodejs: '🟢 Node.js',
                java: '☕ Java',
                cpp: '⚡ C++',
                flutter: '🦋 Flutter',
                'ai-ml': '🤖 AI/ML'
            }
        };
        
        return formatMap[type]?.[value] || value;
    }
    
    removeFilter(filterType) {
        delete this.currentFilters[filterType];
        
        // Reset UI element
        const filterElement = DOMUtils.$(`#${filterType}Filter`);
        if (filterElement) {
            filterElement.value = 'all';
        }
        
        this.updateActiveFilters();
        this.applyFilters();
        this.renderResources();
        
        daVinciState.analytics.track('resource_filter_removed', { filterType });
    }
    
    clearAllFilters() {
        this.currentFilters = {};
        
        // Reset all filter elements
        const filterElements = DOMUtils.$$('.filter-select');
        filterElements.forEach(element => {
            element.value = element.querySelector('option').value;
        });
        
        this.updateActiveFilters();
        this.applyFilters();
        this.renderResources();
        
        daVinciState.analytics.track('all_filters_cleared');
    }
    
    applyFilters() {
        this.filteredResources = this.resources.filter(resource => {
            return Object.entries(this.currentFilters).every(([filterType, filterValue]) => {
                switch (filterType) {
                    case 'category':
                        return resource.category === filterValue;
                    case 'difficulty':
                        return resource.difficulty === filterValue;
                    case 'technology':
                        return resource.technology === filterValue || 
                               resource.tags?.includes(filterValue);
                    default:
                        return true;
                }
            });
        });
        
        // Apply sorting
        this.applySorting();
        this.updateResourceCount();
    }
    
    applySorting() {
        const sortMap = {
            recent: (a, b) => new Date(b.date) - new Date(a.date),
            popular: (a, b) => b.views - a.views,
            rating: (a, b) => b.rating - a.rating,
            alphabetical: (a, b) => a.title.localeCompare(b.title),
            recommended: (a, b) => {
                // Personalized sorting for Jack026
                const jack026Boost = (resource) => {
                    let score = 0;
                    if (resource.author === 'Jack026') score += 10;
                    if (resource.bookmarked) score += 5;
                    if (resource.progress > 0) score += 3;
                    if (resource.featured) score += 2;
                    return score;
                };
                return jack026Boost(b) - jack026Boost(a);
            },
            bookmarked: (a, b) => {
                if (a.bookmarked && !b.bookmarked) return -1;
                if (!a.bookmarked && b.bookmarked) return 1;
                return new Date(b.date) - new Date(a.date);
            }
        };
        
        const sortFunction = sortMap[this.currentSort] || sortMap.recent;
        this.filteredResources.sort(sortFunction);
    }
    
    setupViewControls() {
        const viewButtons = DOMUtils.$$('.view-btn');
        const sortSelect = DOMUtils.$('#sortBy');
        
        // View toggle
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.id.replace('View', '');
                this.changeView(view);
                
                // Update active button
                viewButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            });
        });
        
        // Sort change
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
                this.renderResources();
                
                daVinciState.analytics.track('resources_sorted', {
                    sortBy: this.currentSort
                });
            });
        }
        
        // Random resource
        const randomBtn = DOMUtils.$('#randomResource');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.showRandomResource();
            });
        }
        
        // Export resources
        const exportBtn = DOMUtils.$('#exportResources');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportResourcesList();
            });
        }
    }
    
    changeView(view) {
        this.currentView = view;
        const container = DOMUtils.$('#resourcesContainer');
        
        if (container) {
            container.className = `resources-grid ${view}-view`;
        }
        
        this.renderResources();
        
        daVinciState.analytics.track('view_changed', { view });
    }
    
    setupSearch() {
        const searchInput = DOMUtils.$('#searchResources');
        let searchDebounce;
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchDebounce);
                searchDebounce = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
            
            // Search button
            const searchBtn = searchInput.parentNode.querySelector('.search-btn');
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.handleSearch(searchInput.value);
                });
            }
        }
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.filteredResources = this.resources.filter(resource => {
                return Object.entries(this.currentFilters).every(([filterType, filterValue]) => {
                    // Apply existing filters
                    switch (filterType) {
                        case 'category':
                            return resource.category === filterValue;
                        case 'difficulty':
                            return resource.difficulty === filterValue;
                        case 'technology':
                            return resource.technology === filterValue;
                        default:
                            return true;
                    }
                });
            });
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredResources = this.resources.filter(resource => {
                const searchableFields = [
                    resource.title,
                    resource.description,
                    resource.author,
                    ...(resource.tags || [])
                ].join(' ').toLowerCase();
                
                return searchableFields.includes(searchTerm);
            });
        }
        
        this.applySorting();
        this.currentPage = 1;
        this.renderResources();
        this.updateResourceCount();
        
        if (query.trim()) {
            daVinciState.analytics.track('resources_searched', {
                query,
                resultCount: this.filteredResources.length
            });
        }
    }
    
    setupPersonalizedDashboard() {
        const dashboardBtn = DOMUtils.$('#personalizedBtn');
        const dashboard = DOMUtils.$('#personalized-dashboard');
        
        if (dashboardBtn && dashboard) {
            dashboardBtn.addEventListener('click', () => {
                const isVisible = dashboard.style.display !== 'none';
                dashboard.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    this.updatePersonalizedDashboard();
                    dashboard.scrollIntoView({ behavior: 'smooth' });
                }
                
                daVinciState.analytics.track('personalized_dashboard_toggled', {
                    visible: !isVisible
                });
            });
        }
    }
    
    updatePersonalizedDashboard() {
        // Update progress stats
        const stats = {
            tutorials: { completed: 42, total: 65 },
            challenges: { completed: 15, total: 27 },
            projects: { completed: 8, total: 12 },
            certificates: { earned: 15, available: 20 }
        };
        
        Object.entries(stats).forEach(([key, value]) => {
            const element = DOMUtils.$(`.${key}-progress`);
            if (element) {
                const percentage = Math.round((value.completed / value.total) * 100);
                element.style.width = `${percentage}%`;
                
                const textElement = DOMUtils.$(`.${key}-text`);
                if (textElement) {
                    textElement.textContent = `${value.completed}/${value.total}`;
                }
            }
        });
        
        // Update current learning items
        this.updateCurrentLearning();
        
        // Update bookmarks
        this.updateBookmarksList();
        
        // Update recommendations
        this.updateRecommendations();
    }
    
    updateCurrentLearning() {
        const currentLearning = this.resources.filter(r => r.progress > 0 && r.progress < 100);
        const container = DOMUtils.$('.current-items');
        
        if (container && currentLearning.length > 0) {
            container.innerHTML = currentLearning.slice(0, 3).map(resource => `
                <div class="learning-item">
                    <div class="item-icon">
                        <i class="${this.getCategoryIcon(resource.category)}"></i>
                    </div>
                    <div class="item-info">
                        <span class="item-title">${resource.title}</span>
                        <div class="item-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${resource.progress}%;"></div>
                            </div>
                            <span class="progress-text">${resource.progress}%</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    updateBookmarksList() {
        const bookmarked = this.resources.filter(r => r.bookmarked);
        const container = DOMUtils.$('.bookmark-list');
        
        if (container && bookmarked.length > 0) {
            container.innerHTML = bookmarked.slice(0, 5).map(resource => `
                <div class="bookmark-item">
                    <i class="fas fa-bookmark"></i>
                    <span>${resource.title}</span>
                </div>
            `).join('');
        }
    }
    
    updateRecommendations() {
        // Generate personalized recommendations for Jack026
        const recommendations = [
            {
                title: 'Kubernetes Basics',
                reason: 'Based on your Docker progress',
                icon: 'fab fa-docker'
            },
            {
                title: 'Database Design Patterns',
                reason: 'Popular among React developers',
                icon: 'fas fa-database'
            },
            {
                title: 'System Design Interview',
                reason: 'Recommended for senior developers',
                icon: 'fas fa-sitemap'
            }
        ];
        
        const container = DOMUtils.$('.recommendation-list');
        if (container) {
            container.innerHTML = recommendations.map(rec => `
                <div class="recommendation-item">
                    <div class="rec-icon">
                        <i class="${rec.icon}"></i>
                    </div>
                    <div class="rec-info">
                        <span class="rec-title">${rec.title}</span>
                        <span class="rec-reason">${rec.reason}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    renderResources() {
        const container = DOMUtils.$('#resourcesContainer');
        const featuredContainer = DOMUtils.$('#featuredResourcesContainer');
        
        if (!container) return;
        
        // Render featured resources
        if (featuredContainer) {
            const featuredResources = this.resources.filter(r => r.featured);
            featuredContainer.innerHTML = featuredResources.map(resource => 
                this.createResourceCard(resource, true)
            ).join('');
        }
        
        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResources = this.filteredResources.slice(startIndex, endIndex);
        
        if (pageResources.length === 0) {
            this.showNoResults();
            return;
        }
        
        container.innerHTML = pageResources.map(resource => 
            this.createResourceCard(resource)
        ).join('');
        
        this.updatePagination();
        this.hideNoResults();
        
        // Initialize resource card interactions
        this.setupResourceCardInteractions();
    }
    
    createResourceCard(resource, isFeatured = false) {
        const jack026Classes = this.getJack026Classes(resource);
        const progressInfo = this.getProgressInfo(resource);
        
        return `
            <div class="resource-card ${jack026Classes}" data-id="${resource.id}">
                <div class="resource-card-header">
                    <i class="resource-icon ${this.getCategoryIcon(resource.category)}"></i>
                    <div class="resource-difficulty ${resource.difficulty}">${resource.difficulty}</div>
                    <div class="resource-type">${this.formatResourceType(resource.type)}</div>
                    ${resource.bookmarked ? '<div class="bookmark-indicator"><i class="fas fa-bookmark"></i></div>' : ''}
                </div>
                
                <div class="resource-card-body">
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    
                    <div class="resource-tech-tags">
                        ${(resource.tags || []).slice(0, 3).map(tag => 
                            `<span class="tech-tag">${tag}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="resource-meta">
                        <div class="resource-stat">
                            <i class="fas fa-eye"></i>
                            <span>${this.formatNumber(resource.views)}</span>
                        </div>
                        <div class="resource-stat">
                            <i class="fas fa-star"></i>
                            <span>${resource.rating}</span>
                        </div>
                        <div class="resource-stat">
                            <i class="fas fa-clock"></i>
                            <span>${resource.duration || resource.pages + ' pages' || 'Quick read'}</span>
                        </div>
                        <div class="resource-stat">
                            <i class="fas fa-user"></i>
                            <span>${resource.author}</span>
                        </div>
                    </div>
                    
                    ${progressInfo}
                    
                    <div class="resource-actions">
                        <a href="#" class="resource-btn primary" onclick="resourcesPage.openResource(${resource.id})">
                            <i class="fas fa-play"></i>
                            <span>${this.getActionText(resource)}</span>
                        </a>
                        <button class="resource-btn secondary" onclick="resourcesPage.toggleBookmark(${resource.id})">
                            <i class="fas fa-bookmark"></i>
                            <span>${resource.bookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getJack026Classes(resource) {
        let classes = [];
        
        if (resource.bookmarked) classes.push('jack026-bookmarked');
        if (resource.completed) classes.push('jack026-completed');
        if (resource.progress > 0 && resource.progress < 100) classes.push('jack026-in-progress');
        if (resource.author === 'Jack026') classes.push('jack026-authored');
        
        return classes.join(' ');
    }
    
    getProgressInfo(resource) {
        if (resource.progress > 0) {
            return `
                <div class="resource-progress">
                    <div class="progress-label">Your Progress</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${resource.progress}%;"></div>
                    </div>
                    <div class="progress-text">${resource.progress}% complete</div>
                </div>
            `;
        }
        return '';
    }
    
    getCategoryIcon(category) {
        const icons = {
            tutorials: 'fas fa-graduation-cap',
            documentation: 'fas fa-book',
            tools: 'fas fa-tools',
            challenges: 'fas fa-trophy',
            downloads: 'fas fa-download',
            articles: 'fas fa-newspaper'
        };
        return icons[category] || 'fas fa-file';
    }
    
    formatResourceType(type) {
        const typeMap = {
            video: '🎥 Video',
            course: '📚 Course',
            guide: '📖 Guide',
            extension: '🔧 Extension',
            challenge: '🏆 Challenge',
            library: '📦 Library',
            article: '📰 Article'
        };
        return typeMap[type] || type;
    }
    
    getActionText(resource) {
        if (resource.completed) return 'Review';
        if (resource.progress > 0) return 'Continue';
        return 'Start';
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    setupResourceCardInteractions() {
        const resourceCards = DOMUtils.$$('.resource-card');
        
        resourceCards.forEach(card => {
            // Click tracking
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.resource-btn')) {
                    const resourceId = parseInt(card.dataset.id);
                    this.openResource(resourceId);
                }
            });
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    openResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Track resource access
        daVinciState.analytics.track('resource_opened', {
            resourceId,
            title: resource.title,
            category: resource.category,
            author: resource.author
        });
        
        // Update views
        resource.views += 1;
        
        // Simulate opening resource (replace with actual navigation)
        daVinciState.showNotification(
            `Opening: ${resource.title}`,
            'info',
            3000
        );
        
        // Update progress if it's Jack026's resource
        if (resource.author === DAVINCI_CONFIG.currentUser) {
            this.updateResourceProgress(resourceId, Math.min(resource.progress + 10, 100));
        }
    }
    
    toggleBookmark(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        resource.bookmarked = !resource.bookmarked;
        
        // Update UI
        this.renderResources();
        this.updatePersonalizedDashboard();
        
        // Show feedback
        daVinciState.showNotification(
            resource.bookmarked ? 
                `📑 Added "${resource.title}" to bookmarks` : 
                `🗑️ Removed "${resource.title}" from bookmarks`,
            'success',
            3000
        );
        
        // Track action
        daVinciState.analytics.track('resource_bookmarked', {
            resourceId,
            bookmarked: resource.bookmarked,
            title: resource.title
        });
    }
    
    updateResourceProgress(resourceId, progress) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        resource.progress = Math.min(100, Math.max(0, progress));
        
        if (resource.progress === 100 && !resource.completed) {
            resource.completed = true;
            daVinciState.showNotification(
                `🎉 Congratulations! You completed "${resource.title}"`,
                'success',
                5000
            );
        }
        
        // Update UI
        this.renderResources();
        this.updateUserProgress();
        
        // Track progress
        daVinciState.analytics.track('resource_progress_updated', {
            resourceId,
            progress,
            completed: resource.completed
        });
    }
    
    updateUserProgress() {
        // Update category progress indicators
        Object.entries(this.jack026Progress).forEach(([category, progress]) => {
            const progressElements = DOMUtils.$$(`.${category}-progress`);
            progressElements.forEach(element => {
                element.style.width = `${progress}%`;
            });
            
            const textElements = DOMUtils.$$(`.${category}-text`);
            textElements.forEach(element => {
                element.textContent = `${progress}% completed by Jack026`;
            });
        });
        
        // Update overall progress in navigation
        const overallProgress = Object.values(this.jack026Progress).reduce((a, b) => a + b, 0) / Object.keys(this.jack026Progress).length;
        const navProgressElements = DOMUtils.$$('.progress-fill');
        navProgressElements.forEach(element => {
            if (element.closest('.nav-user')) {
                element.style.width = `${Math.round(overallProgress)}%`;
            }
        });
    }
    
    showRandomResource() {
        if (this.filteredResources.length === 0) {
            daVinciState.showNotification('No resources available', 'warning');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * this.filteredResources.length);
        const randomResource = this.filteredResources[randomIndex];
        
        // Show random resource modal or navigate to it
        this.openResource(randomResource.id);
        
        daVinciState.analytics.track('random_resource_accessed', {
            resourceId: randomResource.id
        });
    }
    
    exportResourcesList() {
        const exportData = {
            user: DAVINCI_CONFIG.currentUser,
            timestamp: new Date().toISOString(),
            filters: this.currentFilters,
            resources: this.filteredResources.map(r => ({
                title: r.title,
                category: r.category,
                difficulty: r.difficulty,
                author: r.author,
                rating: r.rating,
                progress: r.progress,
                bookmarked: r.bookmarked
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jack026-resources-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        daVinciState.showNotification(
            '📁 Resources list exported successfully',
            'success',
            3000
        );
        
        daVinciState.analytics.track('resources_exported', {
            count: this.filteredResources.length,
            filters: this.currentFilters
        });
    }
    
    updateResourceCount() {
        const countElement = DOMUtils.$('#resourceCount');
        if (countElement) {
            const count = this.filteredResources.length;
            countElement.textContent = `${count} resource${count !== 1 ? 's' : ''} found`;
        }
    }
    
    updatePagination() {
        const paginationContainer = DOMUtils.$('#pagination');
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage <= 1 ? 'disabled' : ''} 
                    onclick="resourcesPage.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button onclick="resourcesPage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button ${i === this.currentPage ? 'class="active"' : ''} 
                        onclick="resourcesPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="resourcesPage.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button ${this.currentPage >= totalPages ? 'disabled' : ''} 
                    onclick="resourcesPage.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderResources();
        
        // Scroll to top of resources
        const container = DOMUtils.$('#resourcesContainer');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth' });
        }
        
        daVinciState.analytics.track('pagination_used', { page });
    }
    
    setupInfiniteScroll() {
        // Optional: Implement infinite scroll as alternative to pagination
        let isLoading = false;
        
        window.addEventListener('scroll', () => {
            if (isLoading) return;
            
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if (scrollTop + clientHeight >= scrollHeight - 1000) {
                isLoading = true;
                
                // Load more resources
                setTimeout(() => {
                    if (this.currentPage < Math.ceil(this.filteredResources.length / this.itemsPerPage)) {
                        this.currentPage++;
                        this.renderMoreResources();
                    }
                    isLoading = false;
                }, 1000);
            }
        });
    }
    
    /* Continuing Resources Page JavaScript... */

    renderMoreResources() {
        const container = DOMUtils.$('#resourcesContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResources = this.filteredResources.slice(startIndex, endIndex);
        
        if (pageResources.length === 0) return;
        
        // Append new resources
        const newResourcesHTML = pageResources.map(resource => 
            this.createResourceCard(resource)
        ).join('');
        
        container.insertAdjacentHTML('beforeend', newResourcesHTML);
        this.setupResourceCardInteractions();
        
        daVinciState.analytics.track('infinite_scroll_loaded', {
            page: this.currentPage,
            resourcesLoaded: pageResources.length
        });
    }
    
    showLoading() {
        const container = DOMUtils.$('#resourcesContainer');
        if (container) {
            container.innerHTML = `
                <div class="resources-loading">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Loading resources for Jack026...</p>
                </div>
            `;
        }
    }
    
    hideLoading() {
        const loadingElement = DOMUtils.$('.resources-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    showNoResults() {
        const container = DOMUtils.$('#resourcesContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-resources">
                    <div class="no-resources-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No Resources Found</h3>
                    <p>We couldn't find any resources matching your criteria. Try adjusting your filters or search terms.</p>
                    <button class="btn btn-primary" onclick="resourcesPage.clearAllFilters()">
                        <i class="fas fa-refresh"></i>
                        Clear Filters
                    </button>
                </div>
            `;
        }
    }
    
    hideNoResults() {
        const noResultsElement = DOMUtils.$('.no-resources');
        if (noResultsElement) {
            noResultsElement.remove();
        }
    }
    
    showError(message) {
        const container = DOMUtils.$('#resourcesContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="resourcesPage.loadResources()">
                        <i class="fas fa-refresh"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Resources Analytics Extension
class ResourcesAnalytics {
    constructor() {
        this.sessionStartTime = Date.now();
        this.resourcesViewed = new Set();
        this.categoriesExplored = new Set();
        this.filtersUsed = new Set();
        this.searchQueries = [];
        
        this.startTracking();
    }
    
    startTracking() {
        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
        
        // Track scroll behavior
        this.trackScrollBehavior();
        
        // Track resource interactions
        this.trackResourceInteractions();
    }
    
    trackScrollBehavior() {
        let maxScrollDepth = 0;
        let scrollCheckpoints = [25, 50, 75, 100];
        let reachedCheckpoints = [];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                scrollCheckpoints.forEach(checkpoint => {
                    if (scrollPercent >= checkpoint && !reachedCheckpoints.includes(checkpoint)) {
                        reachedCheckpoints.push(checkpoint);
                        daVinciState.analytics.track('resources_scroll_depth', {
                            depth: checkpoint,
                            user: 'Jack026'
                        });
                    }
                });
            }
        });
    }
    
    trackResourceInteractions() {
        // Track resource card hovers
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.resource-card')) {
                const resourceId = e.target.closest('.resource-card').dataset.id;
                if (resourceId && !this.resourcesViewed.has(resourceId)) {
                    this.resourcesViewed.add(resourceId);
                    daVinciState.analytics.track('resource_viewed', {
                        resourceId: parseInt(resourceId),
                        user: 'Jack026'
                    });
                }
            }
        }, true);
    }
    
    trackSessionEnd() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        
        daVinciState.analytics.track('resources_session_end', {
            duration: sessionDuration,
            resourcesViewed: this.resourcesViewed.size,
            categoriesExplored: this.categoriesExplored.size,
            filtersUsed: this.filtersUsed.size,
            searchQueries: this.searchQueries.length,
            user: 'Jack026',
            timestamp: '2025-08-06 13:15:22'
        });
    }
}

// Resources Real-time Updates
class ResourcesRealTime {
    constructor() {
        this.lastUpdateTime = Date.now();
        this.updateInterval = 30000; // 30 seconds
        
        this.init();
    }
    
    init() {
        this.startRealTimeUpdates();
        this.setupWebSocketHandlers();
    }
    
    startRealTimeUpdates() {
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
    }
    
    async checkForUpdates() {
        try {
            // Simulate checking for new resources
            const updates = await this.fetchResourceUpdates();
            
            if (updates.newResources.length > 0) {
                this.handleNewResources(updates.newResources);
            }
            
            if (updates.updatedResources.length > 0) {
                this.handleUpdatedResources(updates.updatedResources);
            }
            
        } catch (error) {
            console.warn('Failed to check for resource updates:', error);
        }
    }
    
    async fetchResourceUpdates() {
        // Mock API call for resource updates
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    newResources: Math.random() > 0.8 ? [
                        {
                            id: Date.now(),
                            title: 'New: Advanced TypeScript Patterns',
                            category: 'tutorials',
                            author: 'Jack026',
                            featured: true
                        }
                    ] : [],
                    updatedResources: []
                });
            }, 500);
        });
    }
    
    handleNewResources(newResources) {
        newResources.forEach(resource => {
            daVinciState.showNotification(
                `🆕 New resource available: "${resource.title}" by ${resource.author}`,
                'info',
                5000
            );
            
            // Add to resources array if resourcesPage exists
            if (window.resourcesPage) {
                resourcesPage.resources.unshift(resource);
                resourcesPage.applyFilters();
                resourcesPage.renderResources();
            }
        });
        
        daVinciState.analytics.track('new_resources_received', {
            count: newResources.length,
            timestamp: '2025-08-06 13:15:22'
        });
    }
    
    handleUpdatedResources(updatedResources) {
        updatedResources.forEach(resource => {
            if (window.resourcesPage) {
                const index = resourcesPage.resources.findIndex(r => r.id === resource.id);
                if (index !== -1) {
                    resourcesPage.resources[index] = { ...resourcesPage.resources[index], ...resource };
                }
            }
        });
        
        if (window.resourcesPage && updatedResources.length > 0) {
            resourcesPage.renderResources();
        }
    }
    
    setupWebSocketHandlers() {
        document.addEventListener('davinciUpdate', (e) => {
            const { type, data } = e.detail;
            
            switch (type) {
                case 'resource_updated':
                    this.handleResourceUpdate(data);
                    break;
                case 'jack026_progress':
                    this.handleProgressUpdate(data);
                    break;
                case 'new_bookmark':
                    this.handleBookmarkUpdate(data);
                    break;
            }
        });
    }
    
    handleResourceUpdate(data) {
        if (window.resourcesPage) {
            const resource = resourcesPage.resources.find(r => r.id === data.resourceId);
            if (resource) {
                Object.assign(resource, data.updates);
                resourcesPage.renderResources();
            }
        }
    }
    
    handleProgressUpdate(data) {
        if (data.user === 'Jack026' && window.resourcesPage) {
            resourcesPage.updateResourceProgress(data.resourceId, data.progress);
        }
    }
    
    handleBookmarkUpdate(data) {
        if (data.user === 'Jack026') {
            daVinciState.showNotification(
                `📑 Resource "${data.title}" ${data.bookmarked ? 'added to' : 'removed from'} bookmarks`,
                'success',
                3000
            );
        }
    }
}

// Resources Personalization Engine
class ResourcesPersonalization {
    constructor() {
        this.jack026Preferences = {
            favoriteCategories: ['tutorials', 'tools', 'challenges'],
            skillLevel: 'advanced',
            preferredAuthors: ['Jack026', 'Tech Team'],
            recentTopics: ['react', 'nodejs', 'docker', 'algorithms'],
            learningGoals: ['full-stack', 'system-design', 'leadership']
        };
        
        this.init();
    }
    
    init() {
        this.loadPersonalizedData();
        this.setupPersonalizationFeatures();
    }
    
    loadPersonalizedData() {
        // Load Jack026's personalized data from localStorage
        const savedPrefs = localStorage.getItem('jack026_resource_preferences');
        if (savedPrefs) {
            try {
                const parsed = JSON.parse(savedPrefs);
                this.jack026Preferences = { ...this.jack026Preferences, ...parsed };
            } catch (error) {
                console.warn('Failed to load saved preferences:', error);
            }
        }
    }
    
    savePersonalizedData() {
        localStorage.setItem('jack026_resource_preferences', 
            JSON.stringify(this.jack026Preferences));
    }
    
    setupPersonalizationFeatures() {
        // Smart recommendations based on Jack026's activity
        this.generateSmartRecommendations();
        
        // Personalized sorting
        this.enhancePersonalizedSorting();
        
        // Custom dashboard widgets
        this.setupCustomDashboard();
    }
    
    generateSmartRecommendations() {
        const recommendations = [];
        
        // Based on recent activity
        this.jack026Preferences.recentTopics.forEach(topic => {
            if (window.resourcesPage) {
                const relatedResources = resourcesPage.resources.filter(r => 
                    r.tags && r.tags.includes(topic) && !r.completed
                );
                
                if (relatedResources.length > 0) {
                    recommendations.push({
                        type: 'topic_based',
                        topic,
                        resources: relatedResources.slice(0, 3),
                        reason: `Continue learning ${topic}`
                    });
                }
            }
        });
        
        // Based on skill progression
        const nextLevelResources = this.getNextLevelResources();
        if (nextLevelResources.length > 0) {
            recommendations.push({
                type: 'skill_progression',
                resources: nextLevelResources,
                reason: 'Level up your skills'
            });
        }
        
        return recommendations;
    }
    
    getNextLevelResources() {
        if (!window.resourcesPage) return [];
        
        // Find resources slightly above Jack026's current level
        return resourcesPage.resources.filter(r => {
            const currentSkill = this.jack026Preferences.skillLevel;
            const resourceDifficulty = r.difficulty;
            
            if (currentSkill === 'intermediate' && resourceDifficulty === 'advanced') return true;
            if (currentSkill === 'advanced' && resourceDifficulty === 'expert') return true;
            
            return false;
        }).slice(0, 5);
    }
    
    enhancePersonalizedSorting() {
        if (!window.resourcesPage) return;
        
        // Add Jack026's personalized scoring to resources
        resourcesPage.resources.forEach(resource => {
            resource.jack026Score = this.calculatePersonalizedScore(resource);
        });
    }
    
    calculatePersonalizedScore(resource) {
        let score = 0;
        
        // Favorite categories bonus
        if (this.jack026Preferences.favoriteCategories.includes(resource.category)) {
            score += 10;
        }
        
        // Preferred authors bonus
        if (this.jack026Preferences.preferredAuthors.includes(resource.author)) {
            score += 15;
        }
        
        // Recent topics relevance
        const topicMatches = resource.tags?.filter(tag => 
            this.jack026Preferences.recentTopics.includes(tag)
        ).length || 0;
        score += topicMatches * 5;
        
        // Skill level appropriateness
        if (resource.difficulty === this.jack026Preferences.skillLevel) {
            score += 8;
        }
        
        // Progress bonus
        if (resource.progress > 0 && resource.progress < 100) {
            score += 12; // Encourage completion
        }
        
        // Bookmarked bonus
        if (resource.bookmarked) {
            score += 7;
        }
        
        // Rating bonus
        score += resource.rating * 2;
        
        return score;
    }
    
    setupCustomDashboard() {
        // Create Jack026's custom learning dashboard
        const dashboardHTML = `
            <div class="jack026-custom-dashboard">
                <div class="dashboard-header">
                    <h3>Welcome back, Jack026! 👋</h3>
                    <p>Continue your learning journey • ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="learning-streak">
                    <div class="streak-icon">🔥</div>
                    <div class="streak-info">
                        <span class="streak-text">Learning streak: <span class="streak-count">12</span> days</span>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button class="quick-action" onclick="resourcesPage.continueLastResource()">
                        <i class="fas fa-play"></i>
                        <span>Continue Learning</span>
                    </button>
                    <button class="quick-action" onclick="resourcesPage.showBookmarks()">
                        <i class="fas fa-bookmark"></i>
                        <span>My Bookmarks</span>
                    </button>
                    <button class="quick-action" onclick="resourcesPage.showRecommended()">
                        <i class="fas fa-star"></i>
                        <span>Recommended</span>
                    </button>
                </div>
                
                <div class="achievement-showcase">
                    <h4>Recent Achievements</h4>
                    <div class="jack026-achievements">
                        <div class="achievement-badge">
                            <i class="fas fa-trophy"></i>
                            <span>React Master</span>
                        </div>
                        <div class="achievement-badge">
                            <i class="fas fa-fire"></i>
                            <span>12-Day Streak</span>
                        </div>
                        <div class="achievement-badge new">
                            <i class="fas fa-star"></i>
                            <span>Top Contributor</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert dashboard if container exists
        const dashboardContainer = DOMUtils.$('#jack026Dashboard');
        if (dashboardContainer) {
            dashboardContainer.innerHTML = dashboardHTML;
        }
    }
    
    trackPersonalizationData(action, data) {
        // Update Jack026's preferences based on actions
        switch (action) {
            case 'resource_opened':
                this.updateTopicInterest(data.tags);
                break;
            case 'category_filtered':
                this.updateCategoryPreference(data.category);
                break;
            case 'resource_bookmarked':
                this.updateBookmarkPatterns(data);
                break;
        }
        
        this.savePersonalizedData();
    }
    
    updateTopicInterest(tags) {
        if (!tags) return;
        
        tags.forEach(tag => {
            const index = this.jack026Preferences.recentTopics.indexOf(tag);
            if (index > -1) {
                // Move to front if already exists
                this.jack026Preferences.recentTopics.splice(index, 1);
            }
            this.jack026Preferences.recentTopics.unshift(tag);
        });
        
        // Keep only top 10 recent topics
        this.jack026Preferences.recentTopics = this.jack026Preferences.recentTopics.slice(0, 10);
    }
    
    updateCategoryPreference(category) {
        const index = this.jack026Preferences.favoriteCategories.indexOf(category);
        if (index > -1) {
            // Move to front
            this.jack026Preferences.favoriteCategories.splice(index, 1);
        }
        this.jack026Preferences.favoriteCategories.unshift(category);
        
        // Keep only top 5 categories
        this.jack026Preferences.favoriteCategories = this.jack026Preferences.favoriteCategories.slice(0, 5);
    }
    
    updateBookmarkPatterns(data) {
        // Analyze bookmarking patterns to improve recommendations
        const { category, difficulty, author, tags } = data;
        
        // Update preferences based on bookmarked content
        if (category && !this.jack026Preferences.favoriteCategories.includes(category)) {
            this.jack026Preferences.favoriteCategories.push(category);
        }
        
        if (author && !this.jack026Preferences.preferredAuthors.includes(author)) {
            this.jack026Preferences.preferredAuthors.push(author);
        }
        
        if (tags) {
            this.updateTopicInterest(tags);
        }
    }
}

// Initialize Resources Page
let resourcesPage, resourcesAnalytics, resourcesRealTime, resourcesPersonalization;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on resources page
    if (window.location.pathname === '/resources') {
        resourcesPage = new ResourcesPage();
        resourcesAnalytics = new ResourcesAnalytics();
        resourcesRealTime = new ResourcesRealTime();
        resourcesPersonalization = new ResourcesPersonalization();
        
        // Make globally available
        window.resourcesPage = resourcesPage;
        
        // Add Jack026 specific methods
        resourcesPage.continueLastResource = function() {
            const inProgressResources = this.resources.filter(r => r.progress > 0 && r.progress < 100);
            if (inProgressResources.length > 0) {
                this.openResource(inProgressResources[0].id);
            } else {
                daVinciState.showNotification('No resources in progress', 'info');
            }
        };
        
        resourcesPage.showBookmarks = function() {
            this.currentFilters = { bookmarked: true };
            this.filteredResources = this.resources.filter(r => r.bookmarked);
            this.renderResources();
            this.updateActiveFilters();
        };
        
        resourcesPage.showRecommended = function() {
            this.currentSort = 'recommended';
            this.applyFilters();
            this.renderResources();
        };
        
        console.log(`📚 Resources page fully initialized for Jack026 at 2025-08-06 13:15:22`);
        console.log(`🎯 Personalized learning experience ready for ${DAVINCI_CONFIG.currentUser}`);
        
        // Track page initialization
        daVinciState.analytics.track('resources_page_initialized', {
            user: 'Jack026',
            timestamp: '2025-08-06 13:15:22',
            userPreferences: resourcesPersonalization.jack026Preferences
        });
    }
});

// Handle real-time updates
document.addEventListener('davinciUpdate', (e) => {
    const { type, data } = e.detail;
    
    if (type === 'resources_notification') {
        daVinciState.showNotification(data.message, data.level);
    }
    
    // Track personalization data
    if (resourcesPersonalization && data.user === 'Jack026') {
        resourcesPersonalization.trackPersonalizationData(type, data);
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ResourcesPage,
        ResourcesAnalytics,
        ResourcesRealTime,
        ResourcesPersonalization
    };
}