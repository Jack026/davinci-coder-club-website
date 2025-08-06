// Projects Page JavaScript (continued from previous)
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentPage = 1;
        this.projectsPerPage = 9;
        this.currentFilters = {
            category: 'all',
            status: 'all',
            technology: 'all',
            featured: false,
            search: ''
        };
        this.currentSort = 'recent';
        this.currentView = 'grid';
        
        this.init();
    }
    
    
    // ... (previous methods remain the same)
    init() {
        this.initializeEventListeners();
        this.loadProjects();
        this.animateCounters();
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
        
        document.getElementById('technologyFilter')?.addEventListener('change', (e) => {
            this.currentFilters.technology = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('featuredFilter')?.addEventListener('click', (e) => {
            this.currentFilters.featured = !this.currentFilters.featured;
            e.target.classList.toggle('active');
            this.applyFilters();
        });
        
        document.getElementById('searchProjects')?.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // Sort control
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });
        
        // View toggle
        document.getElementById('gridView')?.addEventListener('click', () => {
            this.setView('grid');
        });
        
        document.getElementById('listView')?.addEventListener('click', () => {
            this.setView('list');
        });
        
        // Project modal
        const modal = document.getElementById('projectModal');
        const closeBtn = modal?.querySelector('.close');
        
        closeBtn?.addEventListener('click', () => {
            this.closeProjectModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });
    }
    
    async loadProjects() {
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            
            if (response.ok) {
                this.projects = data.projects || [];
                this.applyFilters();
                this.renderFeaturedProjects();
                this.updateProjectCount();
            } else {
                this.showError('Failed to load projects');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            // Load sample data for demo
            this.loadSampleProjects();
        }
        
        this.showLoading(false);
    }
    
    loadSampleProjects() {
        this.projects = [
            {
                _id: '1',
                title: 'EcoTrack',
                description: 'AI-powered sustainability tracker helping users monitor their carbon footprint and make eco-friendly decisions.',
                longDescription: 'EcoTrack is a comprehensive environmental monitoring application that uses machine learning to analyze user behavior and provide personalized recommendations for reducing carbon footprint. The app tracks daily activities, transportation methods, and consumption patterns to generate detailed sustainability reports.',
                category: 'AI/ML',
                technologies: ['React', 'Node.js', 'MongoDB', 'TensorFlow', 'Python'],
                githubUrl: 'https://github.com/davinci-coder-club/ecotrack',
                liveUrl: 'https://ecotrack-demo.netlify.app',
                image: '/images/projects/ecotrack.jpg',
                screenshots: ['/images/projects/ecotrack-1.jpg', '/images/projects/ecotrack-2.jpg'],
                team: [
                    { name: 'Arjun Sharma', role: 'Full Stack Developer', github: 'arjun-sharma' },
                    { name: 'Priya Devi', role: 'UI/UX Designer', github: 'priya-devi' },
                    { name: 'Rohit Kumar', role: 'AI Engineer', github: 'rohit-kumar' }
                ],
                status: 'completed',
                featured: true,
                likes: 156,
                views: 2500,
                downloads: 1200,
                tags: ['environment', 'ai', 'sustainability', 'carbon-tracking'],
                createdAt: new Date('2024-03-15'),
                updatedAt: new Date('2024-07-20')
            },
            {
                _id: '2',
                title: 'StudyBuddy',
                description: 'Smart study companion app with AI-driven learning recommendations and collaborative features.',
                longDescription: 'StudyBuddy revolutionizes the way students learn by providing personalized study plans, progress tracking, and AI-powered content recommendations. The app includes features like spaced repetition, study groups, and gamification elements to enhance learning engagement.',
                category: 'Mobile App',
                technologies: ['Flutter', 'Firebase', 'Python', 'Machine Learning', 'Dart'],
                githubUrl: 'https://github.com/davinci-coder-club/studybuddy',
                liveUrl: 'https://play.google.com/store/apps/details?id=com.davinci.studybuddy',
                image: '/images/projects/studybuddy.jpg',
                screenshots: ['/images/projects/studybuddy-1.jpg', '/images/projects/studybuddy-2.jpg'],
                team: [
                    { name: 'Sneha Patil', role: 'Mobile Developer', github: 'sneha-patil' },
                    { name: 'Vikram Singh', role: 'Backend Developer', github: 'vikram-singh' }
                ],
                status: 'completed',
                featured: true,
                likes: 234,
                views: 5000,
                downloads: 3500,
                tags: ['education', 'mobile', 'ai', 'learning'],
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-06-15')
            },
            {
                _id: '3',
                title: 'HealthVision',
                description: 'Computer vision system for early disease detection in medical imaging using deep learning.',
                longDescription: 'HealthVision employs advanced computer vision and deep learning techniques to assist medical professionals in early disease detection. The system can analyze various types of medical images including X-rays, CT scans, and MRIs to identify potential health issues with high accuracy.',
                category: 'AI/ML',
                technologies: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'NumPy'],
                githubUrl: 'https://github.com/davinci-coder-club/healthvision',
                liveUrl: 'https://healthvision-demo.herokuapp.com',
                image: '/images/projects/healthvision.jpg',
                screenshots: ['/images/projects/healthvision-1.jpg', '/images/projects/healthvision-2.jpg'],
                team: [
                    { name: 'Dr. Rajesh Kumar', role: 'AI Researcher', github: 'rajesh-kumar' },
                    { name: 'Ananya Sharma', role: 'Data Scientist', github: 'ananya-sharma' },
                    { name: 'Karan Mehta', role: 'Backend Developer', github: 'karan-mehta' }
                ],
                status: 'in-progress',
                featured: true,
                likes: 198,
                views: 3200,
                downloads: 890,
                tags: ['healthcare', 'computer-vision', 'deep-learning', 'medical'],
                createdAt: new Date('2024-02-20'),
                updatedAt: new Date('2024-08-01')
            },
            {
                _id: '4',
                title: 'CryptoWallet',
                description: 'Secure blockchain-based cryptocurrency wallet with multi-currency support.',
                longDescription: 'CryptoWallet is a comprehensive cryptocurrency management solution built on blockchain technology. It supports multiple cryptocurrencies, provides secure transaction handling, real-time market data, and advanced security features including multi-signature authentication.',
                category: 'Blockchain',
                technologies: ['Solidity', 'Web3.js', 'React', 'Node.js', 'Ethereum'],
                githubUrl: 'https://github.com/davinci-coder-club/cryptowallet',
                liveUrl: 'https://cryptowallet-davinci.netlify.app',
                image: '/images/projects/cryptowallet.jpg',
                screenshots: ['/images/projects/cryptowallet-1.jpg', '/images/projects/cryptowallet-2.jpg'],
                team: [
                    { name: 'Aditya Verma', role: 'Blockchain Developer', github: 'aditya-verma' },
                    { name: 'Ravi Patel', role: 'Smart Contract Developer', github: 'ravi-patel' }
                ],
                status: 'completed',
                featured: false,
                likes: 167,
                views: 2800,
                downloads: 1100,
                tags: ['blockchain', 'cryptocurrency', 'web3', 'ethereum'],
                createdAt: new Date('2024-04-05'),
                updatedAt: new Date('2024-07-10')
            },
            {
                _id: '5',
                title: 'SmartHome IoT',
                description: 'Comprehensive IoT solution for home automation and energy management.',
                longDescription: 'SmartHome IoT is an integrated system that connects various home devices through IoT technology. It provides centralized control over lighting, temperature, security systems, and energy consumption monitoring with real-time analytics and mobile app integration.',
                category: 'IoT',
                technologies: ['Arduino', 'Raspberry Pi', 'Python', 'MQTT', 'React Native'],
                githubUrl: 'https://github.com/davinci-coder-club/smarthome-iot',
                liveUrl: null,
                image: '/images/projects/smarthome.jpg',
                screenshots: ['/images/projects/smarthome-1.jpg', '/images/projects/smarthome-2.jpg'],
                team: [
                    { name: 'Manish Kumar', role: 'IoT Developer', github: 'manish-kumar' },
                    { name: 'Sita Ram', role: 'Hardware Engineer', github: 'sita-ram' },
                    { name: 'Neha Gupta', role: 'Mobile Developer', github: 'neha-gupta' }
                ],
                status: 'in-progress',
                featured: false,
                likes: 89,
                views: 1500,
                downloads: 450,
                tags: ['iot', 'automation', 'smart-home', 'arduino'],
                createdAt: new Date('2024-05-12'),
                updatedAt: new Date('2024-08-05')
            },
            {
                _id: '6',
                title: 'GameHub',
                description: 'Multiplayer gaming platform with real-time chat and tournament features.',
                longDescription: 'GameHub is a comprehensive gaming platform that allows users to play various games, participate in tournaments, and connect with other gamers. It features real-time multiplayer capabilities, chat systems, leaderboards, and tournament management.',
                category: 'Game Development',
                technologies: ['Unity', 'C#', 'Socket.io', 'Node.js', 'PostgreSQL'],
                githubUrl: 'https://github.com/davinci-coder-club/gamehub',
                liveUrl: 'https://gamehub-davinci.com',
                image: '/images/projects/gamehub.jpg',
                screenshots: ['/images/projects/gamehub-1.jpg', '/images/projects/gamehub-2.jpg'],
                team: [
                    { name: 'Amit Joshi', role: 'Game Developer', github: 'amit-joshi' },
                    { name: 'Pooja Singh', role: 'UI/UX Designer', github: 'pooja-singh' }
                ],
                status: 'completed',
                featured: false,
                likes: 145,
                views: 2200,
                downloads: 800,
                tags: ['gaming', 'multiplayer', 'unity', 'tournaments'],
                createdAt: new Date('2024-03-01'),
                updatedAt: new Date('2024-06-20')
            }
        ];
        
        this.applyFilters();
        this.renderFeaturedProjects();
        this.updateProjectCount();
    }
    
    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Category filter
            if (this.currentFilters.category !== 'all' && project.category !== this.currentFilters.category) {
                return false;
            }
            
            // Status filter
            if (this.currentFilters.status !== 'all' && project.status !== this.currentFilters.status) {
                return false;
            }
            
            // Technology filter
            if (this.currentFilters.technology !== 'all') {
                const hasTechnology = project.technologies.some(tech => 
                    tech.toLowerCase().includes(this.currentFilters.technology.toLowerCase())
                );
                if (!hasTechnology) return false;
            }
            
            // Featured filter
            if (this.currentFilters.featured && !project.featured) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchFields = [
                    project.title,
                    project.description,
                    project.category,
                    ...(project.technologies || []),
                    ...(project.tags || [])
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Apply sorting
        this.sortProjects();
        
        this.currentPage = 1;
        this.renderProjects();
        this.renderPagination();
        this.updateProjectCount();
    }
    
    sortProjects() {
        switch (this.currentSort) {
            case 'recent':
                this.filteredProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'popular':
                this.filteredProjects.sort((a, b) => b.views - a.views);
                break;
            case 'likes':
                this.filteredProjects.sort((a, b) => b.likes - a.likes);
                break;
            case 'alphabetical':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${view}View`)?.classList.add('active');
        
        // Update container class
        const container = document.getElementById('projectsContainer');
        if (container) {
            container.className = view === 'grid' ? 'projects-grid' : 'projects-grid list-view';
        }
        
        this.renderProjects();
    }
    
    renderFeaturedProjects() {
        const container = document.getElementById('featuredProjectsContainer');
        if (!container) return;
        
        const featuredProjects = this.projects.filter(project => project.featured);
        
        if (featuredProjects.length === 0) {
            container.innerHTML = '<p class="no-projects">No featured projects at the moment.</p>';
            return;
        }
        
        container.innerHTML = featuredProjects.map(project => this.createFeaturedProjectCard(project)).join('');
    }
    
    renderProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);
        
        if (projectsToShow.length === 0) {
            container.innerHTML = '<div class="no-projects"><p>No projects found matching your criteria.</p></div>';
            return;
        }
        
        const isListView = this.currentView === 'list';
        container.innerHTML = projectsToShow.map(project => 
            this.createProjectCard(project, isListView)
        ).join('');
    }
    
    createFeaturedProjectCard(project) {
        const teamAvatars = project.team.slice(0, 3).map((member, index) => 
            `<div class="team-avatar" style="background: linear-gradient(135deg, hsl(${index * 60}, 70%, 60%), hsl(${index * 60 + 30}, 70%, 70%))">${member.name.charAt(0)}</div>`
        ).join('');
        
        const additionalMembers = project.team.length > 3 ? `<div class="team-avatar">+${project.team.length - 3}</div>` : '';
        
        return `
            <div class="featured-project-card" data-project-id="${project._id}">
                <div class="featured-badge">
                    <i class="fas fa-star"></i>
                    Featured
                </div>
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" class="project-preview" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-actions">
                            <button class="action-btn" onclick="projectsManager.openProjectModal('${project._id}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="action-btn" title="View Code">
                                <i class="fab fa-github"></i>
                            </a>` : ''}
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="action-btn" title="Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-tech">
                        ${project.technologies.slice(0, 4).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                        ${project.technologies.length > 4 ? `<span class="tech-tag">+${project.technologies.length - 4}</span>` : ''}
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-stats">
                        <span><i class="fas fa-heart"></i> ${project.likes}</span>
                        <span><i class="fas fa-eye"></i> ${project.views}</span>
                        <span><i class="fas fa-download"></i> ${project.downloads}</span>
                    </div>
                    <div class="project-team">
                        <div class="team-avatars">
                            ${teamAvatars}
                            ${additionalMembers}
                        </div>
                        <span class="team-count">${project.team.length} contributor${project.team.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="project-links">
                        <button class="project-btn primary" onclick="projectsManager.openProjectModal('${project._id}')">
                            <span>View Details</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-btn secondary">
                            <span>Live Demo</span>
                            <i class="fas fa-external-link-alt"></i>
                        </a>` : `<a href="${project.githubUrl || '#'}" target="_blank" class="project-btn secondary">
                            <span>View Code</span>
                            <i class="fab fa-github"></i>
                        </a>`}
                    </div>
                </div>
            </div>
        `;
    }
    
    createProjectCard(project, isListView = false) {
        const cardClass = isListView ? 'project-card list-view' : 'project-card';
        const teamAvatars = project.team.slice(0, 2).map((member, index) => 
            `<div class="team-avatar" style="background: linear-gradient(135deg, hsl(${index * 60}, 70%, 60%), hsl(${index * 60 + 30}, 70%, 70%))">${member.name.charAt(0)}</div>`
        ).join('');
        
        return `
            <div class="${cardClass}" data-project-id="${project._id}">
                <div class="project-status ${project.status}">${project.status.replace('-', ' ')}</div>
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" class="project-preview" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-actions">
                            <button class="action-btn" onclick="projectsManager.openProjectModal('${project._id}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="action-btn" title="View Code">
                                <i class="fab fa-github"></i>
                            </a>` : ''}
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="action-btn" title="Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-tech">
                        ${project.technologies.slice(0, 3).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                        ${project.technologies.length > 3 ? `<span class="tech-tag">+${project.technologies.length - 3}</span>` : ''}
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    ${!isListView ? `
                        <div class="project-stats">
                            <span><i class="fas fa-heart"></i> ${project.likes}</span>
                            <span><i class="fas fa-eye"></i> ${project.views}</span>
                            <span><i class="fas fa-download"></i> ${project.downloads}</span>
                        </div>
                        <div class="project-team">
                            <div class="team-avatars">
                                ${teamAvatars}
                                ${project.team.length > 2 ? `<div class="team-avatar">+${project.team.length - 2}</div>` : ''}
                            </div>
                            <span class="team-count">${project.team.length} contributor${project.team.length !== 1 ? 's' : ''}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="project-links">
                    <button class="project-btn primary" onclick="projectsManager.openProjectModal('${project._id}')">
                        <span>Details</span>
                        <i class="fas fa-info-circle"></i>
                    </button>
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-btn secondary">
                        <span>Demo</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : `<a href="${project.githubUrl || '#'}" target="_blank" class="project-btn secondary">
                        <span>Code</span>
                        <i class="fab fa-github"></i>
                    </a>`}
                </div>
            </div>
        `;
    }
    
    openProjectModal(projectId) {
        const project = this.projects.find(p => p._id === projectId);
        if (!project) return;
        
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalProjectTitle');
        const modalContent = document.getElementById('modalProjectContent');
        
        if (modal && modalTitle && modalContent) {
            modalTitle.textContent = project.title;
            modalContent.innerHTML = this.createProjectModalContent(project);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Track view
            this.trackProjectView(projectId);
        }
    }
    
    createProjectModalContent(project) {
        const teamMembers = project.team.map(member => `
            <div class="modal-team-member">
                <div class="member-avatar">${member.name.charAt(0)}</div>
                <div class="member-info">
                    <h5>${member.name}</h5>
                    <p>${member.role}</p>
                    ${member.github ? `<a href="https://github.com/${member.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                </div>
            </div>
        `).join('');
        
        const screenshots = project.screenshots ? project.screenshots.map((screenshot, index) => `
            <img src="${screenshot}" alt="${project.title} Screenshot ${index + 1}" class="modal-screenshot" loading="lazy">
        `).join('') : '';
        
        return `
            <div class="modal-project-header">
                <div class="modal-project-meta">
                    <span class="modal-category">${project.category}</span>
                    <span class="modal-status ${project.status}">${project.status.replace('-', ' ')}</span>
                    <span class="modal-date">Updated: ${new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div class="modal-project-stats">
                    <span><i class="fas fa-heart"></i> ${project.likes}</span>
                    <span><i class="fas fa-eye"></i> ${project.views}</span>
                    <span><i class="fas fa-download"></i> ${project.downloads}</span>
                </div>
            </div>
            
            <div class="modal-project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            
            <div class="modal-project-description">
                <h4>About the Project</h4>
                <p>${project.longDescription || project.description}</p>
            </div>
            
            ${screenshots ? `
                <div class="modal-project-screenshots">
                    <h4>Screenshots</h4>
                    <div class="screenshots-grid">
                        ${screenshots}
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-project-tech">
                <h4>Technologies Used</h4>
                <div class="modal-tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-project-team">
                <h4>Team Members</h4>
                <div class="modal-team-grid">
                    ${teamMembers}
                </div>
            </div>
            
            ${project.tags && project.tags.length > 0 ? `
                <div class="modal-project-tags">
                    <h4>Tags</h4>
                    <div class="modal-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-project-actions">
                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-primary">
                    <span>Live Demo</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>` : ''}
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
                    <span>View Code</span>
                    <i class="fab fa-github"></i>
                </a>` : ''}
                <button class="btn btn-outline" onclick="projectsManager.likeProject('${project._id}')">
                    <span>Like Project</span>
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
    }
    
    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    async trackProjectView(projectId) {
        try {
            await fetch(`/api/projects/${projectId}/view`, { method: 'POST' });
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    }
    
    async likeProject(projectId) {
        try {
            const response = await fetch(`/api/projects/${projectId}/like`, { method: 'POST' });
            if (response.ok) {
                // Update local data and refresh
                const project = this.projects.find(p => p._id === projectId);
                if (project) {
                    project.likes += 1;
                    this.renderProjects();
                    this.renderFeaturedProjects();
                    this.showNotification('Project liked! ❤️', 'success');
                }
            }
        } catch (error) {
            console.error('Error liking project:', error);
        }
    }
    
    updateProjectCount() {
        const countElement = document.getElementById('projectCount');
        if (countElement) {
            countElement.textContent = `${this.filteredProjects.length} project${this.filteredProjects.length !== 1 ? 's' : ''} found`;
        }
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="projectsManager.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button onclick="projectsManager.goToPage(${i})" 
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
            <button onclick="projectsManager.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderProjects();
        this.renderPagination();
        
        // Scroll to projects section
        document.getElementById('projectsContainer')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.hero-stats .stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 50;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation after a delay
            setTimeout(updateCounter, 1000);
        });
    }
    
    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.toggle('show', show);
        }
        
        const containers = ['projectsContainer', 'featuredProjectsContainer'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.classList.toggle('loading', show);
            }
        });
    }
    
    showError(message) {
        console.error(message);
        // Implement error notification
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            color: var(--text-primary);
            z-index: 10000;
            transform: translateX(400px);
            transition: var(--transition-normal);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize projects manager when DOM is loaded
let projectsManager;
document.addEventListener('DOMContentLoaded', () => {
    projectsManager = new ProjectsManager();
});

// Additional CSS for modal content
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-lg);
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }
    
    .modal-project-meta {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        align-items: center;
    }
    
    .modal-category {
        background: rgba(99, 102, 241, 0.2);
        color: var(--primary-light);
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--border-radius-lg);
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .modal-status {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .modal-status.completed {
        background: rgba(16, 185, 129, 0.2);
        color: var(--success-color);
    }
    
    .modal-status.in-progress {
        background: rgba(245, 158, 11, 0.2);
        color: var(--warning-color);
    }
    
    .modal-status.archived {
        background: rgba(156, 163, 175, 0.2);
        color: var(--text-muted);
    }
    
    .modal-date {
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .modal-project-stats {
        display: flex;
        gap: var(--spacing-lg);
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .modal-project-stats span {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }
    
    .modal-project-image {
        margin-bottom: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        overflow: hidden;
    }
    
    .modal-project-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    
    .modal-project-description,
    .modal-project-tech,
    .modal-project-team,
    .modal-project-screenshots,
    .modal-project-tags {
        margin-bottom: var(--spacing-xl);
    }
    
    .modal-project-description h4,
    .modal-project-tech h4,
    .modal-project-team h4,
    .modal-project-screenshots h4,
    .modal-project-tags h4 {
        color: var(--primary-light);
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-md);
    }
    
    .modal-project-description p {
        color: var(--text-secondary);
        line-height: 1.7;
    }
    
    .modal-tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
    
    .modal-team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
    }
    
    .modal-team-member {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        background: rgba(255, 255, 255, 0.03);
        padding: var(--spacing-md);
        border-radius: var(--border-radius-md);
    }
    
    .member-avatar {
        width: 40px;
        height: 40px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .member-info h5 {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: var(--spacing-xs);
        font-size: 0.9rem;
    }
    
    .member-info p {
        color: var(--text-muted);
        font-size: 0.8rem;
        margin-bottom: var(--spacing-xs);
    }
    
    .member-info a {
        color: var(--primary-color);
        font-size: 1.1rem;
        transition: var(--transition-normal);
    }
    
    .member-info a:hover {
        color: var(--primary-light);
    }
    
    .screenshots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
    }
    
    .modal-screenshot {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: var(--border-radius-md);
        transition: var(--transition-normal);
    }
    
    .modal-screenshot:hover {
        transform: scale(1.05);
    }
    
    .modal-tags,
    .modal-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
    
    .project-tag {
        background: rgba(244, 63, 94, 0.2);
        color: var(--secondary-color);
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--border-radius-lg);
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .modal-project-actions {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        justify-content: center;
        margin-top: var(--spacing-xl);
        padding-top: var(--spacing-xl);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
        .modal-project-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .modal-team-grid {
            grid-template-columns: 1fr;
        }
        
        .screenshots-grid {
            grid-template-columns: 1fr;
        }
        
        .modal-project-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(modalStyles);