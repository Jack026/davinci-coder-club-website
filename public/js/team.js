// Team Page JavaScript
class TeamManager {
    constructor() {
        this.members = [];
        this.filteredMembers = [];
        this.currentPage = 1;
        this.membersPerPage = 12;
        this.currentFilters = {
            position: 'all',
            department: 'all',
            year: 'all',
            search: ''
        };
        
        this.init();
    }
    
    init() {
        this.initializeEventListeners();
        this.loadTeamMembers();
    }
    
    initializeEventListeners() {
        // Filter controls
        document.getElementById('positionFilter')?.addEventListener('change', (e) => {
            this.currentFilters.position = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('departmentFilter')?.addEventListener('change', (e) => {
            this.currentFilters.department = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('yearFilter')?.addEventListener('change', (e) => {
            this.currentFilters.year = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('searchTeam')?.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // Member modal
        const modal = document.getElementById('memberModal');
        const closeBtn = modal?.querySelector('.close');
        
        closeBtn?.addEventListener('click', () => {
            this.closeMemberModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeMemberModal();
            }
        });
    }
    
    async loadTeamMembers() {
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/team');
            const data = await response.json();
            
            if (response.ok) {
                this.members = data.members || [];
                this.applyFilters();
                this.renderLeadershipTeam();
                this.renderCoreTeam();
            } else {
                this.showError('Failed to load team members');
            }
        } catch (error) {
            console.error('Error loading team members:', error);
            // Load sample data for demo
            this.loadSampleMembers();
        }
        
        this.showLoading(false);
    }
    
    loadSampleMembers() {
        this.members = [
            {
                _id: '1',
                name: 'Arjun Sharma',
                role: 'Club President',
                department: 'Computer Science',
                year: '4th Year',
                bio: 'Full-stack developer passionate about AI and blockchain technology. Leading the club towards innovation and excellence.',
                skills: ['React', 'Python', 'AI/ML', 'Leadership', 'Project Management'],
                image: '/images/team/arjun.jpg',
                social: {
                    github: 'arjun-sharma',
                    linkedin: 'arjun-sharma-dev',
                    twitter: 'arjundev',
                    portfolio: 'https://arjunsharma.dev'
                },
                achievements: [
                    { title: 'Winner - National Hackathon 2024', description: 'Led team to victory in Smart India Hackathon', date: new Date('2024-03-15') },
                    { title: 'Google Developer Student Club Lead', description: 'Selected as GDSC Lead for ADTU', date: new Date('2023-08-01') },
                    { title: 'Best Student Developer Award', description: 'Recognized for outstanding contribution to open source', date: new Date('2024-01-20') }
                ],
                position: 'President',
                isActive: true,
                joinDate: new Date('2021-09-01')
            },
            {
                _id: '2',
                name: 'Priya Devi',
                role: 'Vice President',
                department: 'Information Technology',
                year: '3rd Year',
                bio: 'Mobile app developer specializing in Flutter and React Native. Passionate about creating user-centric applications.',
                skills: ['Flutter', 'React Native', 'UI/UX', 'Firebase', 'Dart'],
                image: '/images/team/priya.jpg',
                social: {
                    github: 'priya-devi',
                    linkedin: 'priya-devi-mobile',
                    instagram: 'priyadev_designs'
                },
                achievements: [
                    { title: 'Best Mobile App - TechFest 2024', description: 'Created award-winning educational app', date: new Date('2024-02-10') },
                    { title: 'Flutter Community Contributor', description: 'Active contributor to Flutter open source projects', date: new Date('2023-12-05') }
                ],
                position: 'Vice President',
                isActive: true,
                joinDate: new Date('2022-01-15')
            },
            {
                _id: '3',
                name: 'Rohit Kumar',
                role: 'Technical Lead',
                department: 'Computer Science',
                year: '4th Year',
                bio: 'Backend enthusiast with expertise in cloud computing and DevOps. Architect of our technical infrastructure.',
                skills: ['Node.js', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'],
                image: '/images/team/rohit.jpg',
                social: {
                    github: 'rohit-kumar-dev',
                    linkedin: 'rohit-kumar-cloud',
                    twitter: 'rohitcloud'
                },
                achievements: [
                    { title: 'AWS Certified Solutions Architect', description: 'Achieved professional cloud certification', date: new Date('2024-01-08') },
                    { title: 'DevOps Excellence Award', description: 'Streamlined deployment processes for 10+ projects', date: new Date('2023-11-20') }
                ],
                position: 'Technical Lead',
                isActive: true,
                joinDate: new Date('2021-10-20')
            },
            {
                _id: '4',
                name: 'Sneha Patil',
                role: 'Creative Director',
                department: 'Computer Science',
                year: '3rd Year',
                bio: 'Frontend wizard creating beautiful and intuitive user experiences. Design thinking meets technical excellence.',
                skills: ['JavaScript', 'CSS', 'Figma', 'Adobe Creative Suite', 'Three.js'],
                image: '/images/team/sneha.jpg',
                social: {
                    github: 'sneha-patil',
                    linkedin: 'sneha-patil-design',
                    behance: 'snehapatil',
                    dribbble: 'snehadesigns'
                },
                achievements: [
                    { title: 'UI/UX Design Competition Winner', description: 'First place in state-level design competition', date: new Date('2024-04-12') },
                    { title: 'Figma Community Creator', description: 'Published design systems used by 1000+ designers', date: new Date('2023-09-18') }
                ],
                position: 'Creative Head',
                isActive: true,
                joinDate: new Date('2022-03-10')
            },
            {
                _id: '5',
                name: 'Vikram Singh',
                role: 'Event Manager',
                department: 'Information Technology',
                year: '2nd Year',
                bio: 'Organizing and managing club events with precision and creativity. Making every event memorable.',
                skills: ['Event Management', 'Marketing', 'Communication', 'Leadership', 'Social Media'],
                image: '/images/team/vikram.jpg',
                social: {
                    linkedin: 'vikram-singh-events',
                    instagram: 'vikram_events',
                    twitter: 'vikramevents'
                },
                achievements: [
                    { title: 'Event Excellence Award', description: 'Successfully organized 15+ technical events', date: new Date('2024-05-30') },
                    { title: 'Marketing Campaign Success', description: 'Increased event participation by 200%', date: new Date('2024-03-22') }
                ],
                position: 'Event Manager',
                isActive: true,
                joinDate: new Date('2023-01-12')
            },
            {
                _id: '6',
                name: 'Ananya Sharma',
                role: 'AI/ML Lead',
                department: 'Computer Science',
                year: '3rd Year',
                bio: 'Data scientist passionate about machine learning and artificial intelligence. Building intelligent solutions.',
                skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Computer Vision'],
                image: '/images/team/ananya.jpg',
                social: {
                    github: 'ananya-sharma-ai',
                    linkedin: 'ananya-sharma-ml',
                    kaggle: 'ananyasharma'
                },
                achievements: [
                    { title: 'Kaggle Expert', description: 'Achieved Expert level in Kaggle competitions', date: new Date('2024-02-28') },
                    { title: 'Research Paper Published', description: 'Published paper on computer vision in IEEE conference', date: new Date('2023-12-15') }
                ],
                position: 'Member',
                isActive: true,
                joinDate: new Date('2022-08-05')
            }
        ];
        
        // Add more sample members
        for (let i = 7; i <= 25; i++) {
            this.members.push({
                _id: i.toString(),
                name: `Member ${i}`,
                role: 'Member',
                department: ['Computer Science', 'Information Technology', 'Electronics'][i % 3],
                year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4],
                bio: `Passionate developer interested in various technologies and innovation.`,
                skills: ['JavaScript', 'Python', 'React', 'Node.js'].slice(0, (i % 4) + 1),
                image: `/images/team/member${i}.jpg`,
                social: {
                    github: `member${i}`,
                    linkedin: `member${i}`
                },
                achievements: [],
                position: 'Member',
                isActive: true,
                joinDate: new Date(2022 + (i % 3), (i % 12), (i % 28) + 1)
            });
        }
        
        this.applyFilters();
        this.renderLeadershipTeam();
        this.renderCoreTeam();
    }
    
    applyFilters() {
        this.filteredMembers = this.members.filter(member => {
            // Position filter
            if (this.currentFilters.position !== 'all') {
                const positionMap = {
                    'leadership': ['President', 'Vice President'],
                    'core': ['Technical Lead', 'Creative Head', 'Event Manager', 'Secretary', 'Treasurer'],
                    'member': ['Member']
                };
                
                if (!positionMap[this.currentFilters.position]?.includes(member.position)) {
                    return false;
                }
            }
            
            // Department filter
            if (this.currentFilters.department !== 'all' && member.department !== this.currentFilters.department) {
                return false;
            }
            
            // Year filter
            if (this.currentFilters.year !== 'all' && member.year !== this.currentFilters.year) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchFields = [
                    member.name,
                    member.role,
                    member.department,
                    member.bio,
                    ...(member.skills || [])
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderAllMembers();
        this.renderPagination();
        this.updateMemberCount();
    }
    
    renderLeadershipTeam() {
        const container = document.getElementById('leadershipContainer');
        if (!container) return;
        
        const leaders = this.members.filter(member => 
            ['President', 'Vice President'].includes(member.position)
        );
        
        if (leaders.length === 0) {
            container.innerHTML = '<p class="no-members">No leadership team members found.</p>';
            return;
        }
        
        container.innerHTML = leaders.map(leader => this.createLeadershipCard(leader)).join('');
    }
    
    renderCoreTeam() {
        const container = document.getElementById('coreTeamContainer');
        if (!container) return;
        
        const coreMembers = this.members.filter(member => 
            ['Technical Lead', 'Creative Head', 'Event Manager', 'Secretary', 'Treasurer'].includes(member.position)
        );
        
        if (coreMembers.length === 0) {
            container.innerHTML = '<p class="no-members">No core team members found.</p>';
            return;
        }
        
        container.innerHTML = coreMembers.map(member => this.createTeamCard(member)).join('');
    }
    
    renderAllMembers() {
        const container = document.getElementById('membersContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.membersPerPage;
        const endIndex = startIndex + this.membersPerPage;
        const membersToShow = this.filteredMembers.slice(startIndex, endIndex);
        
        if (membersToShow.length === 0) {
            container.innerHTML = '<div class="no-members"><p>No members found matching your criteria.</p></div>';
            return;
        }
        
        container.innerHTML = membersToShow.map(member => this.createMemberCard(member)).join('');
        
        // Add click event listeners
        container.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('click', () => {
                const memberId = card.dataset.memberId;
                this.openMemberModal(memberId);
            });
        });
    }
    
    createLeadershipCard(leader) {
        const avatarBg = this.getAvatarBackground(leader.name);
        const achievements = leader.achievements ? leader.achievements.slice(0, 3) : [];
        
        return `
            <div class="leadership-card" data-member-id="${leader._id}">
                <div class="leader-image">
                    <div class="leader-avatar" style="background: ${avatarBg}">
                        ${leader.name.charAt(0)}
                    </div>
                    <div class="leader-badge">Leader</div>
                    <div class="leader-social">
                        ${leader.social?.github ? `<a href="https://github.com/${leader.social.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${leader.social?.linkedin ? `<a href="https://linkedin.com/in/${leader.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${leader.social?.twitter ? `<a href="https://twitter.com/${leader.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                        ${leader.social?.portfolio ? `<a href="${leader.social.portfolio}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                    </div>
                </div>
                <div class="leader-info">
                    <h3 class="leader-name">${leader.name}</h3>
                    <p class="leader-position">${leader.role}</p>
                    <p class="leader-department">${leader.department} • ${leader.year}</p>
                    <p class="leader-bio">${leader.bio}</p>
                    ${achievements.length > 0 ? `
                        <div class="leader-achievements">
                            <h5>Recent Achievements</h5>
                            <ul class="achievements-list">
                                ${achievements.map(achievement => `
                                    <li><i class="fas fa-trophy"></i> ${achievement.title}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="leader-skills">
                        ${leader.skills.slice(0, 5).map(skill => 
                            `<span class="skill-badge">${skill}</span>`
                        ).join('')}
                        ${leader.skills.length > 5 ? `<span class="skill-badge">+${leader.skills.length - 5}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    createTeamCard(member) {
        const avatarBg = this.getAvatarBackground(member.name);
        
        return `
            <div class="team-card" data-member-id="${member._id}" onclick="teamManager.openMemberModal('${member._id}')">
                <div class="team-image">
                    <div class="team-avatar" style="background: ${avatarBg}">
                        ${member.name.charAt(0)}
                    </div>
                    <div class="team-social">
                        ${member.social?.github ? `<a href="https://github.com/${member.social.github}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                        ${member.social?.linkedin ? `<a href="https://linkedin.com/in/${member.social.linkedin}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${member.social?.twitter ? `<a href="https://twitter.com/${member.social.twitter}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-twitter"></i></a>` : ''}
                    </div>
                </div>
                <div class="team-info">
                    <h3 class="team-name">${member.name}</h3>
                    <p class="team-role">${member.role}</p>
                    <p class="team-department">${member.department} • ${member.year}</p>
                    <p class="team-bio">${member.bio}</p>
                    <div class="team-skills">
                        ${member.skills.slice(0, 4).map(skill => 
                            `<span class="skill-badge">${skill}</span>`
                        ).join('')}
                        ${member.skills.length > 4 ? `<span class="skill-badge">+${member.skills.length - 4}</span>` : ''}
                    </div>
                    <div class="team-stats">
                        <span><i class="fas fa-calendar-alt"></i> Joined ${new Date(member.joinDate).getFullYear()}</span>
                        <span><i class="fas fa-trophy"></i> ${member.achievements?.length || 0} achievements</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    createMemberCard(member) {
        const avatarBg = this.getAvatarBackground(member.name);
        
        return `
            <div class="member-card" data-member-id="${member._id}">
                <div class="member-avatar" style="background: ${avatarBg}">
                    ${member.name.charAt(0)}
                </div>
                <div class="member-info">
                    <h4 class="member-name">${member.name}</h4>
                    <p class="member-role">${member.role}</p>
                    <p class="member-department">${member.department} • ${member.year}</p>
                    <div class="member-skills">
                        ${member.skills.slice(0, 3).map(skill => 
                            `<span class="skill-badge">${skill}</span>`
                        ).join('')}
                        ${member.skills.length > 3 ? `<span class="skill-badge">+${member.skills.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    getAvatarBackground(name) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        ];
        
        const hash = name.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        return colors[Math.abs(hash) % colors.length];
    }
    
    openMemberModal(memberId) {
        const member = this.members.find(m => m._id === memberId);
        if (!member) return;
        
        const modal = document.getElementById('memberModal');
        const modalName = document.getElementById('modalMemberName');
        const modalContent = document.getElementById('modalMemberContent');
        
        if (modal && modalName && modalContent) {
            modalName.textContent = member.name;
            modalContent.innerHTML = this.createMemberModalContent(member);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    createMemberModalContent(member) {
        const avatarBg = this.getAvatarBackground(member.name);
        const achievements = member.achievements || [];
        
        return `
            <div class="modal-member-header">
                <div class="modal-member-avatar" style="background: ${avatarBg}">
                    ${member.name.charAt(0)}
                </div>
                <div class="modal-member-info">
                    <h4>${member.name}</h4>
                    <p class="modal-member-role">${member.role}</p>
                    <p class="modal-member-department">${member.department} • ${member.year}</p>
                </div>
            </div>
            
            <div class="modal-member-bio">
                <p>${member.bio}</p>
            </div>
            
            <div class="modal-member-skills">
                <h5>Skills & Technologies</h5>
                <div class="modal-skills-grid">
                    ${member.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                </div>
            </div>
            
            ${achievements.length > 0 ? `
                <div class="modal-member-achievements">
                    <h5>Achievements</h5>
                    <ul class="modal-achievements-list">
                        ${achievements.map(achievement => `
                            <li>
                                <i class="fas fa-trophy"></i>
                                <div>
                                    <strong>${achievement.title}</strong>
                                    <p>${achievement.description}</p>
                                    <small>${new Date(achievement.date).toLocaleDateString()}</small>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="modal-member-social">
                ${member.social?.github ? `<a href="https://github.com/${member.social.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                ${member.social?.linkedin ? `<a href="https://linkedin.com/in/${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                ${member.social?.twitter ? `<a href="https://twitter.com/${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                ${member.social?.instagram ? `<a href="https://instagram.com/${member.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                ${member.social?.portfolio ? `<a href="${member.social.portfolio}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
            </div>
        `;
    }
    
    closeMemberModal() {
        const modal = document.getElementById('memberModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    updateMemberCount() {
        const countElement = document.getElementById('memberCount');
        if (countElement) {
            countElement.textContent = `${this.filteredMembers.length} member${this.filteredMembers.length !== 1 ? 's' : ''} found`;
        }
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredMembers.length / this.membersPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="teamManager.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button onclick="teamManager.goToPage(${i})" 
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
            <button onclick="teamManager.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredMembers.length / this.membersPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderAllMembers();
        this.renderPagination();
        
        // Scroll to members section
        document.getElementById('membersContainer')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    showLoading(show) {
        // Implement loading state
        const containers = ['leadershipContainer', 'coreTeamContainer', 'membersContainer'];
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
}

// Initialize team manager when DOM is loaded
let teamManager;
document.addEventListener('DOMContentLoaded', () => {
    teamManager = new TeamManager();
});