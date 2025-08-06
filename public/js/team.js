/* ========================================
   TEAM PAGE JAVASCRIPT
   Updated: 2025-08-06 21:49:20 UTC
   Built for: Jack026
======================================== */

class TeamPage {
    constructor() {
        this.members = [];
        this.filteredMembers = [];
        this.currentFilters = {};
        this.currentSort = 'name';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.Jack026Profile = null;
        
        this.init();
    }
    
    init() {
        this.setupFilters();
        this.setupViewControls();
        this.setupSearch();
        this.setupMemberModal();
        this.loadTeamMembers();
        this.setupJack026Spotlight();
        this.initializeTeamAnalytics();
        
        console.log(`👥 Team page initialized for ${DAVINCI_CONFIG.currentUser}`);
    }
    
    async loadTeamMembers() {
        try {
            this.showLoading();
            
            // Mock API call - replace with actual endpoint
            const response = await this.mockTeamAPI();
            this.members = response.members;
            this.filteredMembers = [...this.members];
            
            // Find Jack026's profile
            this.Jack026Profile = this.members.find(m => m.username === 'Jack026');
            
            this.renderTeamSections();
            this.updateMemberCount();
            this.updateTeamStats();
            this.hideLoading();
            
            daVinciState.analytics.track('team_loaded', {
                totalMembers: this.members.length,
                currentUser: 'Jack026'
            });
            
        } catch (error) {
            console.error('Failed to load team members:', error);
            this.showError('Failed to load team members. Please try again.');
        }
    }
    
    async mockTeamAPI() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return {
            members: [
                {
                    id: 1,
                    username: 'Jack026',
                    name: 'Jack Anderson',
                    position: 'leadership',
                    role: 'Lead Developer & Club President',
                    department: 'Computer Science',
                    year: '4th Year',
                    email: 'Jack026@davincicoders.adtu.ac.in',
                    phone: '+91 87654 32109',
                    avatar: this.generateAvatar('J', '#6366f1'),
                    bio: 'Passionate full-stack developer and team leader with expertise in React, Node.js, and system design. Leading Da-Vinci Coder Club towards innovation and excellence.',
                    skills: ['React', 'Node.js', 'Python', 'System Design', 'Leadership', 'Mentoring'],
                    projects: ['E-Learning Platform', 'Club Management System', 'AI Chatbot'],
                    achievements: ['Best Project Award 2024', 'Outstanding Leadership', 'Top Contributor'],
                    joinDate: '2022-08-15',
                    contributions: 156,
                    isOnline: true,
                    lastSeen: 'now',
                    social: {
                        github: 'https://github.com/Jack026',
                        linkedin: 'https://linkedin.com/in/Jack026',
                        twitter: 'https://twitter.com/Jack026'
                    },
                    featured: true,
                    responseTime: '2 minutes'
                },
                {
                    id: 2,
                    username: 'sarah_dev',
                    name: 'Sarah Kumar',
                    position: 'leadership',
                    role: 'Vice President & Frontend Lead',
                    department: 'Information Technology',
                    year: '3rd Year',
                    email: 'sarah.kumar@davincicoders.adtu.ac.in',
                    avatar: this.generateAvatar('S', '#f43f5e'),
                    bio: 'Creative frontend developer with a passion for UI/UX design and modern web technologies.',
                    skills: ['React', 'Vue.js', 'UI/UX Design', 'TypeScript', 'CSS/Sass'],
                    projects: ['Design System', 'Portfolio Website', 'Mobile App UI'],
                    achievements: ['Best Design Award', 'Innovation Champion'],
                    joinDate: '2022-09-01',
                    contributions: 142,
                    isOnline: true,
                    lastSeen: '5 minutes ago',
                    social: {
                        github: 'https://github.com/sarahdev',
                        linkedin: 'https://linkedin.com/in/sarah-kumar'
                    }
                },
                {
                    id: 3,
                    username: 'alex_backend',
                    name: 'Alex Rodriguez',
                    position: 'core',
                    role: 'Backend Developer',
                    department: 'Computer Science',
                    year: '3rd Year',
                    email: 'alex.rodriguez@davincicoders.adtu.ac.in',
                    avatar: this.generateAvatar('A', '#10b981'),
                    bio: 'Backend enthusiast specializing in scalable systems and database optimization.',
                    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker'],
                    projects: ['API Gateway', 'Microservices Architecture', 'Data Pipeline'],
                    achievements: ['Performance Optimization Expert'],
                    joinDate: '2023-01-15',
                    contributions: 98,
                    isOnline: false,
                    lastSeen: '1 hour ago',
                    social: {
                        github: 'https://github.com/alexbackend'
                    }
                },
                {
                    id: 4,
                    username: 'priya_ai',
                    name: 'Priya Sharma',
                    position: 'core',
                    role: 'AI/ML Specialist',
                    department: 'Computer Science',
                    year: '2nd Year',
                    email: 'priya.sharma@davincicoders.adtu.ac.in',
                    avatar: this.generateAvatar('P', '#8b5cf6'),
                    bio: 'Machine learning enthusiast working on cutting-edge AI applications and research.',
                    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Neural Networks'],
                    projects: ['Chatbot AI', 'Recommendation System', 'Computer Vision App'],
                    achievements: ['AI Innovation Award', 'Research Publication'],
                    joinDate: '2023-08-01',
                    contributions: 67,
                    isOnline: true,
                    lastSeen: 'now',
                    social: {
                        github: 'https://github.com/priyaai',
                        linkedin: 'https://linkedin.com/in/priya-sharma-ai'
                    }
                },
                {
                    id: 5,
                    username: 'dev_mobile',
                    name: 'Rajesh Patel',
                    position: 'member',
                    role: 'Mobile Developer',
                    department: 'Information Technology',
                    year: '2nd Year',
                    email: 'rajesh.patel@davincicoders.adtu.ac.in',
                    avatar: this.generateAvatar('R', '#f59e0b'),
                    bio: 'Mobile app developer creating cross-platform solutions with Flutter and React Native.',
                    skills: ['Flutter', 'React Native', 'Dart', 'JavaScript', 'Firebase'],
                    projects: ['Study Companion App', 'Event Management App'],
                    achievements: ['Mobile Innovation Award'],
                    joinDate: '2024-01-10',
                    contributions: 34,
                    isOnline: false,
                    lastSeen: '3 hours ago',
                    social: {
                        github: 'https://github.com/devmobile'
                    }
                },
                {
                    id: 6,
                    username: 'design_queen',
                    name: 'Ananya Singh',
                    position: 'member',
                    role: 'UI/UX Designer',
                    department: 'Computer Science',
                    year: '1st Year',
                    email: 'ananya.singh@davincicoders.adtu.ac.in',
                    avatar: this.generateAvatar('A', '#ec4899'),
                    bio: 'Creative designer focused on user experience and visual storytelling through design.',
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
                    projects: ['Club Website Redesign', 'Mobile App UI', 'Brand Identity'],
                    achievements: ['Best Design Newcomer'],
                    joinDate: '2024-08-01',
                    contributions: 12,
                    isOnline: true,
                    lastSeen: 'now',
                    social: {
                        github: 'https://github.com/designqueen',
                        linkedin: 'https://linkedin.com/in/ananya-singh-design'
                    }
                }
                // Add more mock members here to reach 150+ total
            ]
        };
    }
    
    generateAvatar(letter, color) {
        return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='${encodeURIComponent(color)}'/><text x='40' y='50' text-anchor='middle' fill='white' font-size='24' font-weight='bold'>${letter}</text></svg>`;
    }
    
    setupFilters() {
        const filterElements = {
            position: DOMUtils.$('#positionFilter'),
            department: DOMUtils.$('#departmentFilter'),
            year: DOMUtils.$('#yearFilter'),
            skill: DOMUtils.$('#skillFilter')
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
        this.renderMembers();
        
        daVinciState.analytics.track('team_filter_applied', {
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
                    <button onclick="teamPage.removeFilter('${type}')">
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
            position: {
                leadership: '👑 Leadership',
                core: '⭐ Core Team',
                senior: '🎯 Senior Members',
                member: '👥 Members',
                alumni: '🎓 Alumni'
            },
            department: {
                'Computer Science': '💻 Computer Science',
                'Information Technology': '🌐 Information Technology',
                'Electronics': '⚡ Electronics & Communication',
                'Mechanical': '⚙️ Mechanical Engineering',
                'Civil': '🏗️ Civil Engineering'
            },
            year: {
                '1st Year': '🌱 1st Year',
                '2nd Year': '🚀 2nd Year',
                '3rd Year': '⭐ 3rd Year',
                '4th Year': '🏆 4th Year',
                'Graduate': '🎓 Graduate'
            },
            skill: {
                'Frontend': '🎨 Frontend Development',
                'Backend': '⚙️ Backend Development',
                'Mobile': '📱 Mobile Development',
                'AI/ML': '🤖 AI/ML',
                'DevOps': '🔧 DevOps',
                'Design': '🎭 UI/UX Design'
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
        this.renderMembers();
        
        daVinciState.analytics.track('team_filter_removed', { filterType });
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
        this.renderMembers();
        
        daVinciState.analytics.track('team_all_filters_cleared');
    }
    
    applyFilters() {
        this.filteredMembers = this.members.filter(member => {
            return Object.entries(this.currentFilters).every(([filterType, filterValue]) => {
                switch (filterType) {
                    case 'position':
                        return member.position === filterValue;
                    case 'department':
                        return member.department === filterValue;
                    case 'year':
                        return member.year === filterValue;
                    case 'skill':
                        return member.skills?.some(skill => 
                            skill.toLowerCase().includes(filterValue.toLowerCase())
                        );
                    default:
                        return true;
                }
            });
        });
        
        // Apply sorting
        this.applySorting();
        this.updateMemberCount();
    }
    
    applySorting() {
        const sortMap = {
            name: (a, b) => a.name.localeCompare(b.name),
            position: (a, b) => {
                const positionOrder = { leadership: 0, core: 1, senior: 2, member: 3, alumni: 4 };
                return positionOrder[a.position] - positionOrder[b.position];
            },
            year: (a, b) => a.year.localeCompare(b.year),
            department: (a, b) => a.department.localeCompare(b.department),
            joined: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
            contributions: (a, b) => b.contributions - a.contributions
        };
        
        const sortFunction = sortMap[this.currentSort] || sortMap.name;
        this.filteredMembers.sort(sortFunction);
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
                this.renderMembers();
                
                daVinciState.analytics.track('team_sorted', {
                    sortBy: this.currentSort
                });
            });
        }
        
        // Random member
        const randomBtn = DOMUtils.$('#randomMemberBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.showRandomMember();
            });
        }
        
        // Shuffle members
        const shuffleBtn = DOMUtils.$('#shuffleMembers');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                this.shuffleMembers();
            });
        }
        
        // Export team
        const exportBtn = DOMUtils.$('#exportTeam');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportTeamList();
            });
        }
    }
    
    changeView(view) {
        this.currentView = view;
        const container = DOMUtils.$('#membersContainer');
        
        if (container) {
            container.className = `members-grid ${view}-view`;
        }
        
        this.renderMembers();
        
        daVinciState.analytics.track('team_view_changed', { view });
    }
    
    setupSearch() {
        const searchInput = DOMUtils.$('#searchTeam');
        let searchDebounce;
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchDebounce);
                searchDebounce = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.filteredMembers = this.members.filter(member => {
                return Object.entries(this.currentFilters).every(([filterType, filterValue]) => {
                    // Apply existing filters
                    switch (filterType) {
                        case 'position':
                            return member.position === filterValue;
                        case 'department':
                            return member.department === filterValue;
                        case 'year':
                            return member.year === filterValue;
                        default:
                            return true;
                    }
                });
            });
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredMembers = this.members.filter(member => {
                const searchableFields = [
                    member.name,
                    member.username,
                    member.role,
                    member.department,
                    member.bio,
                    ...(member.skills || [])
                ].join(' ').toLowerCase();
                
                return searchableFields.includes(searchTerm);
            });
        }
        
        this.applySorting();
        this.currentPage = 1;
        this.renderMembers();
        this.updateMemberCount();
        
        if (query.trim()) {
            daVinciState.analytics.track('team_searched', {
                query,
                resultCount: this.filteredMembers.length
            });
        }
    }
    
    setupJack026Spotlight() {
        if (!this.Jack026Profile) return;
        
        const spotlightContainer = DOMUtils.$('#Jack026-spotlight');
        if (spotlightContainer) {
            this.renderJack026Spotlight();
        }
    }
    
    renderJack026Spotlight() {
        const spotlightCard = DOMUtils.$('.Jack026-featured');
        if (!spotlightCard || !this.Jack026Profile) return;
        
        // Update spotlight card with real data
        const avatarImg = spotlightCard.querySelector('.spotlight-avatar img');
        if (avatarImg) {
            avatarImg.src = this.Jack026Profile.avatar;
            avatarImg.alt = this.Jack026Profile.name;
        }
        
        const nameElement = spotlightCard.querySelector('.member-name');
        if (nameElement) {
            nameElement.textContent = this.Jack026Profile.name;
        }
        
        const titleElement = spotlightCard.querySelector('.member-title');
        if (titleElement) {
            titleElement.textContent = this.Jack026Profile.role;
        }
        
        const departmentElement = spotlightCard.querySelector('.member-department');
        if (departmentElement) {
            departmentElement.textContent = `${this.Jack026Profile.department} • ${this.Jack026Profile.year}`;
        }
        
        // Update achievements
        const achievementsContainer = spotlightCard.querySelector('.member-achievements');
        if (achievementsContainer && this.Jack026Profile.achievements) {
            const achievementItems = [
                { icon: 'fas fa-project-diagram', text: `${this.Jack026Profile.projects?.length || 0}+ Projects Led` },
                { icon: 'fas fa-users', text: '50+ Members Mentored' },
                { icon: 'fas fa-trophy', text: `${this.Jack026Profile.achievements.length}+ Awards Won` }
            ];
            
            achievementsContainer.innerHTML = achievementItems.map(item => `
                <div class="achievement-item">
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                </div>
            `).join('');
        }
        
        // Update skills
        const skillsContainer = spotlightCard.querySelector('.member-skills');
        if (skillsContainer && this.Jack026Profile.skills) {
            skillsContainer.innerHTML = this.Jack026Profile.skills.slice(0, 5).map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        }
    }
    
    renderTeamSections() {
        this.renderLeadershipTeam();
        this.renderCoreTeam();
        this.renderMembers();
    }
    
    renderLeadershipTeam() {
        const container = DOMUtils.$('#leadershipContainer');
        if (!container) return;
        
        const leadership = this.members.filter(m => m.position === 'leadership');
        
        if (leadership.length === 0) {
            container.innerHTML = '<p>Loading leadership team...</p>';
            return;
        }
        
        container.innerHTML = leadership.map(member => 
            this.createLeaderCard(member)
        ).join('');
        
        this.setupMemberCardInteractions();
    }
    
    renderCoreTeam() {
        const container = DOMUtils.$('#coreTeamContainer');
        if (!container) return;
        
        const coreTeam = this.members.filter(m => m.position === 'core');
        
        container.innerHTML = coreTeam.map(member => 
            this.createMemberCard(member)
        ).join('');
        
        this.setupMemberCardInteractions();
    }
    
    renderMembers() {
        const container = DOMUtils.$('#membersContainer');
        if (!container) return;
        
        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMembers = this.filteredMembers.slice(startIndex, endIndex);
        
        if (pageMembers.length === 0) {
            this.showNoMembers();
            return;
        }
        
        container.innerHTML = pageMembers.map(member => 
            this.createMemberCard(member)
        ).join('');
        
        this.updatePagination();
        this.hideNoMembers();
        this.setupMemberCardInteractions();
    }
    
    createLeaderCard(member) {
        const Jack026Class = member.username === 'Jack026' ? 'Jack026-leader' : '';
        const onlineStatus = member.isOnline ? 'online' : 'offline';
        
        return `
            <div class="leader-card ${Jack026Class}" data-id="${member.id}">
                <div class="leader-badge">${member.position}</div>
                <img src="${member.avatar}" alt="${member.name}" class="leader-avatar" width="100" height="100">
                <h3 class="leader-name">${member.name}</h3>
                <p class="leader-position">${member.role}</p>
                <p class="leader-department">${member.department} • ${member.year}</p>
                <p class="leader-bio">${member.bio}</p>
                
                <div class="leader-stats">
                    <div class="stat">
                        <span class="stat-value">${member.contributions}</span>
                        <span class="stat-label">Contributions</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${member.projects?.length || 0}</span>
                        <span class="stat-label">Projects</span>
                    </div>
                </div>
                
                <div class="leader-social">
                    ${Object.entries(member.social || {}).map(([platform, url]) => `
                        <a href="${url}" target="_blank" rel="noopener" class="social-link ${platform}">
                            <i class="fab fa-${platform}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    createMemberCard(member) {
        const Jack026Class = member.username === 'Jack026' ? 'Jack026-profile' : '';
        const onlineStatus = member.isOnline ? 'online' : 'offline';
        
        return `
            <div class="member-card ${Jack026Class}" data-id="${member.id}">
                <div class="member-card-header">
                    <img src="${member.avatar}" alt="${member.name}" class="member-avatar" width="80" height="80">
                    <div class="member-status ${onlineStatus}">${member.isOnline ? 'Online' : 'Offline'}</div>
                </div>
                
                <div class="member-card-body">
                    <h3 class="member-card-name">${member.name}</h3>
                    <p class="member-card-position">${member.role}</p>
                    <p class="member-card-department">${member.department}</p>
                    
                    <div class="member-skills">
                        ${(member.skills || []).slice(0, 3).map(skill => 
                            `<span class="skill-tag">${skill}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="member-stats">
                        <div class="member-stat">
                            <span class="member-stat-value">${member.contributions}</span>
                            <span class="member-stat-label">Contributions</span>
                        </div>
                        <div class="member-stat">
                            <span class="member-stat-value">${member.projects?.length || 0}</span>
                            <span class="member-stat-label">Projects</span>
                        </div>
                        <div class="member-stat">
                            <span class="member-stat-value">${member.achievements?.length || 0}</span>
                            <span class="member-stat-label">Awards</span>
                        </div>
                    </div>
                    
                    <div class="member-actions">
                        <button class="member-btn primary" onclick="teamPage.viewMemberProfile(${member.id})">
                            <i class="fas fa-user"></i>
                            <span>View Profile</span>
                        </button>
                        <button class="member-btn secondary" onclick="teamPage.contactMember(${member.id})">
                            <i class="fas fa-envelope"></i>
                            <span>Contact</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupMemberCardInteractions() {
        const memberCards = DOMUtils.$$('.member-card, .leader-card');
        
        memberCards.forEach(card => {
            // Click tracking
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.member-btn, .social-link')) {
                    const memberId = parseInt(card.dataset.id);
                    this.viewMemberProfile(memberId);
                }
            });
            
            // Hover effects for non-Jack026 cards
            if (!card.classList.contains('Jack026-profile') && !card.classList.contains('Jack026-leader')) {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            }
        });
    }
    
    viewMemberProfile(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;
        
        this.renderMemberModal(member);
        modalSystem.open('memberModal');
        
        daVinciState.analytics.track('member_profile_viewed', {
            memberId,
            memberName: member.name,
            viewedBy: 'Jack026'
        });
    }
    
    renderMemberModal(member) {
        const modalContent = DOMUtils.$('#modalMemberContent');
        if (!modalContent) return;
        
        const modalTitle = DOMUtils.$('#modalMemberName');
        if (modalTitle) {
            modalTitle.textContent = `${member.name}'s Profile`;
        }
        
        const onlineIndicator = member.isOnline ? 
            '<div class="online-indicator active">🟢 Online</div>' : 
            `<div class="online-indicator">🔴 Last seen ${member.lastSeen}</div>`;
        
        modalContent.innerHTML = `
            <div class="member-profile">
                <div class="profile-header">
                    <img src="${member.avatar}" alt="${member.name}" class="profile-avatar" width="120" height="120">
                    <div class="profile-info">
                        <h3>${member.name}</h3>
                        <p class="profile-role">${member.role}</p>
                        <p class="profile-department">${member.department} • ${member.year}</p>
                        ${onlineIndicator}
                        ${member.username === 'Jack026' ? '<div class="profile-badge">👑 That\'s You!</div>' : ''}
                    </div>
                </div>
                
                <div class="profile-body">
                    <div class="profile-section">
                        <h4>About</h4>
                        <p>${member.bio}</p>
                    </div>
                    
                    <div class="profile-section">
                        <h4>Skills & Technologies</h4>
                        <div class="skills-list">
                            ${(member.skills || []).map(skill => 
                                `<span class="skill-badge">${skill}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h4>Projects</h4>
                        <div class="projects-list">
                            ${(member.projects || []).map(project => 
                                `<div class="project-item">
                                    <i class="fas fa-code"></i>
                                    <span>${project}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h4>Achievements</h4>
                        <div class="achievements-list">
                            ${(member.achievements || []).map(achievement => 
                                `<div class="achievement-item">
                                    <i class="fas fa-trophy"></i>
                                    <span>${achievement}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-number">${member.contributions}</span>
                            <span class="stat-label">Total Contributions</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${new Date(member.joinDate).getFullYear()}</span>
                            <span class="stat-label">Member Since</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${member.projects?.length || 0}</span>
                            <span class="stat-label">Active Projects</span>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        ${member.username !== 'Jack026' ? `
                            <button class="btn btn-primary" onclick="teamPage.contactMember(${member.id})">
                                <i class="fas fa-envelope"></i>
                                Send Message
                            </button>
                            <button class="btn btn-secondary" onclick="teamPage.collaborateWith(${member.id})">
                                <i class="fas fa-handshake"></i>
                                Collaborate
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="window.location.href='/profile'">
                                <i class="fas fa-edit"></i>
                                Edit Profile
                            </button>
                            <button class="btn btn-secondary" onclick="teamPage.viewMyContributions()">
                                <i class="fas fa-chart-line"></i>
                                My Contributions
                            </button>
                        `}
                    </div>
                    
                    ${member.social && Object.keys(member.social).length > 0 ? `
                        <div class="profile-social">
                            <h4>Connect</h4>
                            <div class="social-links">
                                ${Object.entries(member.social).map(([platform, url]) => `
                                    <a href="${url}" target="_blank" rel="noopener" class="social-link ${platform}">
                                        <i class="fab fa-${platform}"></i>
                                        <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add special styling for Jack026's modal
        const modal = DOMUtils.$('#memberModal');
        if (modal) {
            if (member.username === 'Jack026') {
                modal.classList.add('Jack026-modal');
            } else {
                modal.classList.remove('Jack026-modal');
            }
        }
    }
    
    contactMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;
        
        // Redirect to contact page with member info
        const contactUrl = `/contact?to=${member.username}&name=${encodeURIComponent(member.name)}`;
        window.location.href = contactUrl;
        
        daVinciState.analytics.track('member_contact_initiated', {
            targetMember: member.username,
            initiatedBy: 'Jack026'
        });
    }
    
    collaborateWith(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;
        
        daVinciState.showNotification(
            `🤝 Collaboration request sent to ${member.name}`,
            'success',
            5000
        );
        
        daVinciState.analytics.track('collaboration_requested', {
            targetMember: member.username,
            requestedBy: 'Jack026'
        });
    }
    
    viewMyContributions() {
        // Show Jack026's contribution dashboard
        window.location.href = '/dashboard';
    }
    
    setupMemberModal() {
        const modal = DOMUtils.$('#memberModal');
        if (!modal) return;
        
        // Modal is already registered by the modal system
        // Just add specific team member modal enhancements
        
        modal.addEventListener('keydown', (e) => {
            // Add keyboard navigation for member profiles
            if (e.key === 'ArrowLeft') {
                this.showPreviousMember();
            } else if (e.key === 'ArrowRight') {
                this.showNextMember();
            }
        });
    }
    
    showPreviousMember() {
        // Implementation for navigating between member profiles
        const currentModal = DOMUtils.$('#memberModal');
        if (!currentModal.classList.contains('show')) return;
        
        // Find current member and show previous
        // This would require tracking current member ID
    }
    
    showNextMember() {
        // Implementation for navigating between member profiles
        const currentModal = DOMUtils.$('#memberModal');
        if (!currentModal.classList.contains('show')) return;
        
        // Find current member and show next
        // This would require tracking current member ID
    }
    
    showRandomMember() {
        if (this.filteredMembers.length === 0) {
            daVinciState.showNotification('No members available', 'warning');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * this.filteredMembers.length);
        const randomMember = this.filteredMembers[randomIndex];
        
        this.viewMemberProfile(randomMember.id);
        
        daVinciState.analytics.track('random_member_viewed', {
            memberId: randomMember.id,
            memberName: randomMember.name
        });
    }
    
    /* Continuing Team Page JavaScript... */

    shuffleMembers() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.filteredMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredMembers[i], this.filteredMembers[j]] = [this.filteredMembers[j], this.filteredMembers[i]];
        }
        
        this.currentPage = 1;
        this.renderMembers();
        
        daVinciState.showNotification(
            '🎲 Team members shuffled!',
            'info',
            3000
        );
        
        daVinciState.analytics.track('team_shuffled', {
            shuffledBy: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    exportTeamList() {
        const exportData = {
            user: 'Jack026',
            timestamp: '2025-08-06 13:23:54',
            filters: this.currentFilters,
            totalMembers: this.members.length,
            exportedMembers: this.filteredMembers.length,
            members: this.filteredMembers.map(m => ({
                name: m.name,
                username: m.username,
                position: m.position,
                role: m.role,
                department: m.department,
                year: m.year,
                skills: m.skills,
                contributions: m.contributions,
                joinDate: m.joinDate
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Jack026-team-export-2025-08-06.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        daVinciState.showNotification(
            '📁 Team list exported successfully',
            'success',
            3000
        );
        
        daVinciState.analytics.track('team_exported', {
            exportedBy: 'Jack026',
            memberCount: this.filteredMembers.length,
            filters: this.currentFilters,
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    updateMemberCount() {
        const countElement = DOMUtils.$('#memberCount');
        if (countElement) {
            const count = this.filteredMembers.length;
            countElement.textContent = `${count} member${count !== 1 ? 's' : ''} found`;
        }
    }
    
    updateTeamStats() {
        // Update hero stats with real data
        const stats = {
            totalMembers: this.members.length,
            leadership: this.members.filter(m => m.position === 'leadership').length,
            coreTeam: this.members.filter(m => m.position === 'core').length,
            projects: this.members.reduce((total, member) => total + (member.projects?.length || 0), 0)
        };
        
        // Update stat counters
        const statElements = {
            'totalMembers': DOMUtils.$$('[data-count="150"]'),
            'leadership': DOMUtils.$$('[data-count="12"]'),
            'awards': DOMUtils.$$('[data-count="25"]'),
            'projects': DOMUtils.$$('[data-count="75"]')
        };
        
        // Update with real data
        statElements.totalMembers.forEach(el => {
            el.setAttribute('data-count', stats.totalMembers);
            new CounterAnimation(el);
        });
        
        // Update department distribution chart
        this.updateDepartmentChart();
        
        // Update year-wise breakdown
        this.updateYearBreakdown();
        
        // Update skill distribution
        this.updateSkillDistribution();
    }
    
    updateDepartmentChart() {
        const canvas = DOMUtils.$('#departmentChart');
        if (!canvas) return;
        
        const departments = {};
        this.members.forEach(member => {
            departments[member.department] = (departments[member.department] || 0) + 1;
        });
        
        // Simple chart representation (replace with actual chart library)
        const ctx = canvas.getContext('2d');
        const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];
        
        let currentAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        Object.entries(departments).forEach(([dept, count], index) => {
            const sliceAngle = (count / this.members.length) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }
    
    updateYearBreakdown() {
        const years = {};
        this.members.forEach(member => {
            years[member.year] = (years[member.year] || 0) + 1;
        });
        
        Object.entries(years).forEach(([year, count]) => {
            const percentage = (count / this.members.length) * 100;
            const yearElement = DOMUtils.$(`.year-item:contains("${year}")`);
            if (yearElement) {
                const fillElement = yearElement.querySelector('.year-fill');
                const countElement = yearElement.querySelector('.year-count');
                
                if (fillElement) fillElement.style.width = `${percentage}%`;
                if (countElement) countElement.textContent = `${count} members`;
            }
        });
    }
    
    updateSkillDistribution() {
        const skillCounts = {};
        this.members.forEach(member => {
            (member.skills || []).forEach(skill => {
                const category = this.categorizeSkill(skill);
                skillCounts[category] = (skillCounts[category] || 0) + 1;
            });
        });
        
        Object.entries(skillCounts).forEach(([skill, count]) => {
            const skillElement = DOMUtils.$(`.skill-item .skill-name:contains("${skill}")`);
            if (skillElement) {
                const countElement = skillElement.parentElement.querySelector('.skill-count');
                if (countElement) countElement.textContent = count;
            }
        });
    }
    
    categorizeSkill(skill) {
        const categories = {
            'Frontend': ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
            'Backend': ['Node.js', 'Python', 'Java', 'C++', 'PHP', 'Ruby', 'Go'],
            'Mobile': ['Flutter', 'React Native', 'iOS', 'Android', 'Dart', 'Swift'],
            'AI/ML': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Neural Networks'],
            'Design': ['UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping']
        };
        
        for (const [category, skills] of Object.entries(categories)) {
            if (skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
                return category;
            }
        }
        
        return 'Other';
    }
    
    updatePagination() {
        const paginationContainer = DOMUtils.$('#pagination');
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredMembers.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage <= 1 ? 'disabled' : ''} 
                    onclick="teamPage.goToPage(${this.currentPage - 1})"
                    aria-label="Previous page">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button onclick="teamPage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button ${i === this.currentPage ? 'class="active"' : ''} 
                        onclick="teamPage.goToPage(${i})"
                        aria-label="Page ${i}">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="teamPage.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button ${this.currentPage >= totalPages ? 'disabled' : ''} 
                    onclick="teamPage.goToPage(${this.currentPage + 1})"
                    aria-label="Next page">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredMembers.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderMembers();
        
        // Scroll to top of members section
        const container = DOMUtils.$('#membersContainer');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth' });
        }
        
        daVinciState.analytics.track('team_pagination_used', { 
            page,
            user: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    showLoading() {
        const containers = ['#leadershipContainer', '#coreTeamContainer', '#membersContainer'];
        
        containers.forEach(selector => {
            const container = DOMUtils.$(selector);
            if (container) {
                container.innerHTML = `
                    <div class="team-loading">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <p>Loading team members for Jack026...</p>
                    </div>
                `;
            }
        });
    }
    
    hideLoading() {
        const loadingElements = DOMUtils.$$('.team-loading');
        loadingElements.forEach(el => el.remove());
    }
    
    showNoMembers() {
        const container = DOMUtils.$('#membersContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-members">
                    <div class="no-members-icon">
                        <i class="fas fa-users-slash"></i>
                    </div>
                    <h3>No Members Found</h3>
                    <p>We couldn't find any team members matching your criteria. Try adjusting your filters or explore our leadership team!</p>
                    <button class="btn btn-primary" onclick="teamPage.clearAllFilters()">
                        <i class="fas fa-refresh"></i>
                        Reset Filters
                    </button>
                </div>
            `;
        }
    }
    
    hideNoMembers() {
        const noMembersElement = DOMUtils.$('.no-members');
        if (noMembersElement) {
            noMembersElement.remove();
        }
    }
    
    showError(message) {
        const containers = ['#leadershipContainer', '#coreTeamContainer', '#membersContainer'];
        
        containers.forEach(selector => {
            const container = DOMUtils.$(selector);
            if (container) {
                container.innerHTML = `
                    <div class="error-state">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Oops! Something went wrong</h3>
                        <p>${message}</p>
                        <button class="btn btn-primary" onclick="teamPage.loadTeamMembers()">
                            <i class="fas fa-refresh"></i>
                            Try Again
                        </button>
                    </div>
                `;
            }
        });
    }
    
    initializeTeamAnalytics() {
        let engagementStartTime = Date.now();
        
        // Track member card interactions
        let memberCardsViewed = new Set();
        
        document.addEventListener('mouseenter', (e) => {
            const memberCard = e.target.closest('.member-card, .leader-card');
            if (memberCard) {
                const memberId = memberCard.dataset.id;
                if (memberId && !memberCardsViewed.has(memberId)) {
                    memberCardsViewed.add(memberId);
                    daVinciState.analytics.track('member_card_viewed', {
                        memberId: parseInt(memberId),
                        viewedBy: 'Jack026',
                        timestamp: '2025-08-06 13:23:54'
                    });
                }
            }
        }, true);
        
        // Track filter usage patterns
        let filterInteractions = 0;
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-select')) {
                filterInteractions++;
                daVinciState.analytics.track('team_filter_interaction', {
                    filterType: e.target.id,
                    value: e.target.value,
                    interactionCount: filterInteractions,
                    user: 'Jack026',
                    timestamp: '2025-08-06 13:23:54'
                });
            }
        });
        
        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - engagementStartTime;
            daVinciState.analytics.track('team_page_time', {
                duration: timeOnPage,
                memberCardsViewed: memberCardsViewed.size,
                filterInteractions,
                user: 'Jack026',
                timestamp: '2025-08-06 13:23:54'
            });
        });
        
        // Track search behavior
        let searchQueries = [];
        const searchInput = DOMUtils.$('#searchTeam');
        if (searchInput) {
            searchInput.addEventListener('blur', () => {
                const query = searchInput.value.trim();
                if (query && !searchQueries.includes(query)) {
                    searchQueries.push(query);
                    daVinciState.analytics.track('team_search_pattern', {
                        query,
                        totalSearches: searchQueries.length,
                        user: 'Jack026',
                        timestamp: '2025-08-06 13:23:54'
                    });
                }
            });
        }
    }
}

// Team Analytics Extension
class TeamAnalytics {
    constructor() {
        this.sessionStartTime = Date.now();
        this.memberInteractions = new Map();
        this.filterUsage = new Map();
        this.searchPatterns = [];
        this.viewModes = [];
        
        this.startTracking();
    }
    
    startTracking() {
        this.trackViewModeChanges();
        this.trackMemberInteractions();
        this.trackFilterUsage();
        this.trackScrollBehavior();
    }
    
    trackViewModeChanges() {
        const viewButtons = DOMUtils.$$('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.id.replace('View', '');
                this.viewModes.push({
                    view,
                    timestamp: Date.now(),
                    user: 'Jack026'
                });
                
                daVinciState.analytics.track('team_view_mode_analytics', {
                    view,
                    totalChanges: this.viewModes.length,
                    user: 'Jack026',
                    timestamp: '2025-08-06 13:23:54'
                });
            });
        });
    }
    
    trackMemberInteractions() {
        document.addEventListener('click', (e) => {
            const memberCard = e.target.closest('.member-card, .leader-card');
            if (memberCard) {
                const memberId = memberCard.dataset.id;
                if (memberId) {
                    const interactions = this.memberInteractions.get(memberId) || 0;
                    this.memberInteractions.set(memberId, interactions + 1);
                    
                    daVinciState.analytics.track('member_interaction_pattern', {
                        memberId: parseInt(memberId),
                        totalInteractions: interactions + 1,
                        interactedBy: 'Jack026',
                        timestamp: '2025-08-06 13:23:54'
                    });
                }
            }
        });
    }
    
    trackFilterUsage() {
        const filterElements = DOMUtils.$$('.filter-select');
        filterElements.forEach(filter => {
            filter.addEventListener('change', () => {
                const filterType = filter.id;
                const usage = this.filterUsage.get(filterType) || 0;
                this.filterUsage.set(filterType, usage + 1);
                
                daVinciState.analytics.track('filter_usage_pattern', {
                    filterType,
                    usageCount: usage + 1,
                    user: 'Jack026',
                    timestamp: '2025-08-06 13:23:54'
                });
            });
        });
    }
    
    trackScrollBehavior() {
        let maxScrollDepth = 0;
        let teamSectionsViewed = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
            }
            
            // Track which team sections are viewed
            const sections = ['leadership-team', 'core-team', 'all-members'];
            sections.forEach(sectionId => {
                const section = DOMUtils.$(`#${sectionId}`);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        if (!teamSectionsViewed.has(sectionId)) {
                            teamSectionsViewed.add(sectionId);
                            daVinciState.analytics.track('team_section_viewed', {
                                section: sectionId,
                                user: 'Jack026',
                                timestamp: '2025-08-06 13:23:54'
                            });
                        }
                    }
                }
            });
        });
        
        // Track final scroll depth on page unload
        window.addEventListener('beforeunload', () => {
            daVinciState.analytics.track('team_scroll_analytics', {
                maxScrollDepth,
                sectionsViewed: Array.from(teamSectionsViewed),
                user: 'Jack026',
                timestamp: '2025-08-06 13:23:54'
            });
        });
    }
    
    generateTeamInsights() {
        return {
            sessionDuration: Date.now() - this.sessionStartTime,
            mostInteractedMembers: Array.from(this.memberInteractions.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            mostUsedFilters: Array.from(this.filterUsage.entries())
                .sort((a, b) => b[1] - a[1]),
            viewModePreferences: this.viewModes.reduce((acc, { view }) => {
                acc[view] = (acc[view] || 0) + 1;
                return acc;
            }, {}),
            searchPatterns: this.searchPatterns,
            user: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        };
    }
}

// Team Real-time Updates
class TeamRealTime {
    constructor() {
        this.onlineMembers = new Set();
        this.lastUpdateTime = Date.now();
        
        this.init();
    }
    
    init() {
        this.setupRealTimeUpdates();
        this.trackOnlineStatus();
        this.setupWebSocketHandlers();
        
        // Update online status every 30 seconds
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000);
    }
    
    setupRealTimeUpdates() {
        // Simulate real-time member status updates
        setInterval(() => {
            this.simulateStatusUpdates();
        }, 60000); // Every minute
    }
    
    simulateStatusUpdates() {
        if (!window.teamPage || !teamPage.members) return;
        
        // Randomly update member statuses
        teamPage.members.forEach(member => {
            // 10% chance of status change
            if (Math.random() < 0.1) {
                member.isOnline = !member.isOnline;
                member.lastSeen = member.isOnline ? 'now' : this.generateLastSeenTime();
                
                this.updateMemberStatusUI(member);
                
                daVinciState.analytics.track('member_status_changed', {
                    memberId: member.id,
                    memberName: member.name,
                    isOnline: member.isOnline,
                    timestamp: '2025-08-06 13:23:54'
                });
            }
        });
    }
    
    generateLastSeenTime() {
        const times = ['2 minutes ago', '5 minutes ago', '15 minutes ago', '1 hour ago', '2 hours ago'];
        return times[Math.floor(Math.random() * times.length)];
    }
    
    updateMemberStatusUI(member) {
        const memberCards = DOMUtils.$$(`[data-id="${member.id}"]`);
        
        memberCards.forEach(card => {
            const statusElement = card.querySelector('.member-status');
            if (statusElement) {
                statusElement.className = `member-status ${member.isOnline ? 'online' : 'offline'}`;
                statusElement.textContent = member.isOnline ? 'Online' : 'Offline';
            }
        });
    }
    
    trackOnlineStatus() {
        // Track Jack026's own online status
        document.addEventListener('visibilitychange', () => {
            const isOnline = !document.hidden;
            
            if (window.teamPage && teamPage.Jack026Profile) {
                teamPage.Jack026Profile.isOnline = isOnline;
                teamPage.Jack026Profile.lastSeen = isOnline ? 'now' : 'just now';
                
                // Update UI if Jack026's profile is visible
                this.updateMemberStatusUI(teamPage.Jack026Profile);
            }
            
            daVinciState.analytics.track('Jack026_status_changed', {
                isOnline,
                timestamp: '2025-08-06 13:23:54'
            });
        });
    }
    
    setupWebSocketHandlers() {
        document.addEventListener('davinciUpdate', (e) => {
            const { type, data } = e.detail;
            
            switch (type) {
                case 'member_joined':
                    this.handleNewMember(data);
                    break;
                case 'member_updated':
                    this.handleMemberUpdate(data);
                    break;
                case 'team_announcement':
                    this.handleTeamAnnouncement(data);
                    break;
            }
        });
    }
    
    handleNewMember(data) {
        const { member } = data;
        
        if (window.teamPage) {
            teamPage.members.push(member);
            teamPage.applyFilters();
            teamPage.renderTeamSections();
            teamPage.updateTeamStats();
        }
        
        daVinciState.showNotification(
            `🎉 Welcome ${member.name} to the team!`,
            'success',
            5000
        );
        
        daVinciState.analytics.track('new_member_joined', {
            memberId: member.id,
            memberName: member.name,
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    handleMemberUpdate(data) {
        const { memberId, updates } = data;
        
        if (window.teamPage) {
            const member = teamPage.members.find(m => m.id === memberId);
            if (member) {
                Object.assign(member, updates);
                
                // Re-render if this member is currently displayed
                if (teamPage.filteredMembers.find(m => m.id === memberId)) {
                    teamPage.renderMembers();
                }
            }
        }
    }
    
    handleTeamAnnouncement(data) {
        const { message, priority, author } = data;
        
        daVinciState.showNotification(
            `📢 ${author}: ${message}`,
            priority || 'info',
            8000
        );
        
        daVinciState.analytics.track('team_announcement_received', {
            author,
            priority,
            timestamp: '2025-08-06 13:23:54'
        });
    }
}

// Team Collaboration Features
class TeamCollaboration {
    constructor() {
        this.collaborationRequests = [];
        this.teamProjects = [];
        this.mentorshipPairs = [];
        
        this.init();
    }
    
    init() {
        this.setupCollaborationFeatures();
        this.loadTeamProjects();
        this.setupMentorshipSystem();
    }
    
    setupCollaborationFeatures() {
        // Add collaboration buttons to member cards
        const memberCards = DOMUtils.$$('.member-card, .leader-card');
        memberCards.forEach(card => {
            this.enhanceCardWithCollaboration(card);
        });
    }
    
    enhanceCardWithCollaboration(card) {
        const memberId = card.dataset.id;
        const member = window.teamPage?.members.find(m => m.id == memberId);
        
        if (!member || member.username === 'Jack026') return;
        
        const actionsContainer = card.querySelector('.member-actions');
        if (actionsContainer) {
            const collaborateBtn = DOMUtils.create('button', {
                className: 'member-btn collaboration',
                innerHTML: '<i class="fas fa-handshake"></i><span>Collaborate</span>',
                attributes: {
                    onclick: `teamCollaboration.initiateCollaboration(${memberId})`
                }
            });
            
            actionsContainer.appendChild(collaborateBtn);
        }
    }
    
    initiateCollaboration(memberId) {
        const member = window.teamPage?.members.find(m => m.id == memberId);
        if (!member) return;
        
        const collaborationModal = this.createCollaborationModal(member);
        document.body.appendChild(collaborationModal);
        modalSystem.register('collaborationModal', collaborationModal);
        modalSystem.open('collaborationModal');
        
        daVinciState.analytics.track('collaboration_initiated', {
            targetMember: member.username,
            initiatedBy: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    createCollaborationModal(member) {
        return DOMUtils.create('div', {
            className: 'modal',
            id: 'collaborationModal',
            innerHTML: `
                <div class="modal-content collaboration-modal">
                    <div class="modal-header">
                        <h3><i class="fas fa-handshake"></i> Collaborate with ${member.name}</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="collaboration-options">
                            <div class="collab-option" onclick="teamCollaboration.requestProjectCollaboration(${member.id})">
                                <i class="fas fa-code"></i>
                                <h4>Project Collaboration</h4>
                                <p>Work together on a coding project</p>
                            </div>
                            <div class="collab-option" onclick="teamCollaboration.requestMentorship(${member.id})">
                                <i class="fas fa-graduation-cap"></i>
                                <h4>Mentorship</h4>
                                <p>Learn from ${member.name}'s expertise</p>
                            </div>
                            <div class="collab-option" onclick="teamCollaboration.scheduleStudySession(${member.id})">
                                <i class="fas fa-users-cog"></i>
                                <h4>Study Session</h4>
                                <p>Plan a collaborative study session</p>
                            </div>
                            <div class="collab-option" onclick="teamCollaboration.inviteToEvent(${member.id})">
                                <i class="fas fa-calendar-plus"></i>
                                <h4>Event Invitation</h4>
                                <p>Invite to upcoming events</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
    }
    
    requestProjectCollaboration(memberId) {
        const member = window.teamPage?.members.find(m => m.id == memberId);
        
        modalSystem.close('collaborationModal');
        
        daVinciState.showNotification(
            `🚀 Project collaboration request sent to ${member.name}`,
            'success',
            5000
        );
        
        daVinciState.analytics.track('project_collaboration_requested', {
            targetMember: member.username,
            requestedBy: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    requestMentorship(memberId) {
        const member = window.teamPage?.members.find(m => m.id == memberId);
        
        modalSystem.close('collaborationModal');
        
        daVinciState.showNotification(
            `🎓 Mentorship request sent to ${member.name}`,
            'success',
            5000
        );
        
        daVinciState.analytics.track('mentorship_requested', {
            mentor: member.username,
            mentee: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    scheduleStudySession(memberId) {
        const member = window.teamPage?.members.find(m => m.id == memberId);
        
        modalSystem.close('collaborationModal');
        
        // Redirect to calendar/scheduling page
        window.location.href = `/schedule?with=${member.username}&type=study`;
        
        daVinciState.analytics.track('study_session_scheduled', {
            participant: member.username,
            organizer: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    inviteToEvent(memberId) {
        const member = window.teamPage?.members.find(m => m.id == memberId);
        
        modalSystem.close('collaborationModal');
        
        daVinciState.showNotification(
            `📅 Event invitation sent to ${member.name}`,
            'success',
            5000
        );
        
        daVinciState.analytics.track('event_invitation_sent', {
            invitee: member.username,
            invitedBy: 'Jack026',
            timestamp: '2025-08-06 13:23:54'
        });
    }
    
    loadTeamProjects() {
        // Load active team projects
        this.teamProjects = [
            {
                id: 1,
                name: 'Da-Vinci Learning Platform',
                lead: 'Jack026',
                participants: ['sarah_dev', 'alex_backend', 'priya_ai'],
                status: 'active',
                progress: 75
            },
            {
                id: 2,
                name: 'Mobile Club App',
                lead: 'dev_mobile',
                participants: ['design_queen', 'Jack026'],
                status: 'planning',
                progress: 20
            }
        ];
    }
    
    setupMentorshipSystem() {
        // Initialize mentorship pairs
        this.mentorshipPairs = [
            {
                mentor: 'Jack026',
                mentee: 'design_queen',
                subject: 'Full-Stack Development',
                startDate: '2024-08-01',
                status: 'active'
            }
        ];
    }
}

// Initialize Team Page
let teamPage, teamAnalytics, teamRealTime, teamCollaboration;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on team page
    if (window.location.pathname === '/team') {
        teamPage = new TeamPage();
        teamAnalytics = new TeamAnalytics();
        teamRealTime = new TeamRealTime();
        teamCollaboration = new TeamCollaboration();
        
        // Make globally available
        window.teamPage = teamPage;
        window.teamAnalytics = teamAnalytics;
        window.teamRealTime = teamRealTime;
        window.teamCollaboration = teamCollaboration;
        
        console.log(`👥 Team page fully initialized for Jack026 at 2025-08-06 13:23:54`);
        console.log(`🎯 Real-time collaboration features ready`);
        console.log(`📊 Advanced analytics tracking enabled`);
        
        // Track page initialization
        daVinciState.analytics.track('team_page_initialized', {
            user: 'Jack026',
            timestamp: '2025-08-06 13:23:54',
            features: ['realTime', 'collaboration', 'analytics'],
            totalMembers: teamPage.members.length
        });
    }
});

// Handle real-time updates
document.addEventListener('davinciUpdate', (e) => {
    const { type, data } = e.detail;
    
    if (type === 'team_notification') {
        daVinciState.showNotification(data.message, data.level);
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TeamPage,
        TeamAnalytics,
        TeamRealTime,
        TeamCollaboration
    };
}

/* ========================================
   END OF TEAM PAGE JAVASCRIPT
   Total Lines: 1500+
   Features: Complete team management system
   Current Time: 2025-08-06 13:23:54 UTC
   Built for: Jack026's leadership experience
======================================== */