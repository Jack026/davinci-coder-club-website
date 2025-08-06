/* ========================================
   JACK026 ADMIN PANEL JAVASCRIPT
   Updated: 2025-08-06 20:13:28 UTC
   Current User: Jack026
======================================== */

class Jack026AdminPanel {
    constructor() {
        this.currentUser = 'Jack026';
        this.currentTime = '2025-08-06 20:13:28';
        this.isAuthenticated = true;
        this.apiBaseUrl = '/api/admin';
        
        this.init();
    }
    
    init() {
        console.log(`👑 Jack026 Admin Panel initialized at ${this.currentTime}`);
        
        // Update current time every second
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // Setup navigation
        this.setupNavigation();
        
        // Load initial data
        this.loadDashboardData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Admin panel ready for Jack026');
    }
    
    updateCurrentTime() {
        const now = new Date();
        const utcTime = now.toISOString().replace('T', ' ').substring(0, 19);
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = utcTime;
        }
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(nl => nl.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Get section name from onclick attribute
                const onclick = link.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/showSection\('([^']+)'\)/);
                    if (match) {
                        this.showSection(match[1]);
                    }
                }
            });
        });
    }
    
    showSection(sectionName) {
        console.log(`📄 Jack026: Switching to ${sectionName} section`);
        
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update page title
        document.title = `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} - Jack026 Admin Panel`;
    }
    
    async loadDashboardData() {
        console.log('📊 Loading dashboard data for Jack026...');
        
        try {
            // Load stats
            const response = await fetch(`${this.apiBaseUrl}/stats`, {
                headers: {
                    'X-User': 'Jack026'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.updateDashboardStats(data.data);
            }
        } catch (error) {
            console.log('⚠️ Using demo data:', error);
            this.updateDashboardStats({
                totalMembers: 156,
                activeProjects: 24,
                upcomingEvents: 8,
                jack026Streak: 47
            });
        }
        
        this.loadRecentActivity();
        this.updateLastSyncTime();
    }
    
    updateDashboardStats(stats) {
        // Update stat numbers with animation
        this.animateStatNumber('total-members', stats.totalMembers);
        this.animateStatNumber('total-projects', stats.activeProjects);
        this.animateStatNumber('upcoming-events', stats.upcomingEvents);
        this.animateStatNumber('jack026-streak', stats.jack026Streak);
        
        // Update sidebar counts
        this.updateElement('team-count', stats.totalMembers);
        this.updateElement('projects-count', stats.activeProjects);
        this.updateElement('events-count', stats.upcomingEvents);
    }
    
    animateStatNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const difference = targetValue - currentValue;
        const duration = 1000;
        const steps = 50;
        const stepValue = difference / steps;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = newValue;
            
            if (currentStep >= steps) {
                element.textContent = targetValue;
                clearInterval(timer);
            }
        }, stepDuration);
    }
    
    async loadRecentActivity() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/activity`, {
                headers: { 'X-User': 'Jack026' }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.updateActivityFeed(data.data);
            }
        } catch (error) {
            console.log('⚠️ Using demo activity data');
            this.updateActivityFeed([
                {
                    id: 1,
                    icon: 'fas fa-user-plus',
                    message: 'New member joined: Sarah Chen',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                    user: 'Sarah Chen'
                },
                {
                    id: 2,
                    icon: 'fas fa-project-diagram',
                    message: 'Project "EcoTracker" updated by Jack026',
                    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
                    user: 'Jack026'
                }
            ]);
        }
    }
    
    updateActivityFeed(activities) {
        const activityStream = document.getElementById('live-activity-stream');
        if (!activityStream) return;
        
        activityStream.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-message">${activity.message}</div>
                    <div class="activity-meta">
                        <span class="activity-time">${this.getTimeAgo(new Date(activity.timestamp))}</span>
                        <span class="activity-user">${activity.user}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
        
        // Export button
        const exportBtn = document.querySelector('.btn-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDashboardData());
        }
        
        // Logout button
        const logoutBtn = document.querySelector('.admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }
    
    async refreshDashboard() {
        console.log('🔄 Jack026: Refreshing dashboard...');
        
        const refreshBtn = document.querySelector('.btn-refresh i');
        if (refreshBtn) {
            refreshBtn.classList.add('fa-spin');
        }
        
        try {
            await this.loadDashboardData();
            this.showNotification('Dashboard refreshed successfully', 'success');
        } catch (error) {
            this.showNotification('Error refreshing dashboard', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('fa-spin');
            }
        }
    }
    
    exportDashboardData() {
        console.log('📤 Jack026: Exporting dashboard data...');
        
        const data = {
            user: this.currentUser,
            timestamp: this.currentTime,
            stats: {
                totalMembers: document.getElementById('total-members')?.textContent || '156',
                activeProjects: document.getElementById('total-projects')?.textContent || '24',
                upcomingEvents: document.getElementById('upcoming-events')?.textContent || '8',
                jack026Streak: document.getElementById('jack026-streak')?.textContent || '47'
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jack026-dashboard-${this.currentTime.replace(/[:\s]/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Dashboard data exported successfully', 'success');
    }
    
    logout() {
        if (confirm('Are you sure you want to logout, Jack026?')) {
            console.log('👋 Jack026: Logging out...');
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '/';
        }
    }
    
    updateLastSyncTime() {
        const lastSyncElement = document.getElementById('last-sync-time');
        if (lastSyncElement) {
            lastSyncElement.textContent = new Date().toISOString().substring(0, 19).replace('T', ' ');
        }
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 1rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions
function showSection(sectionName) {
    if (window.adminPanel) {
        window.adminPanel.showSection(sectionName);
    }
}

function refreshDashboard() {
    if (window.adminPanel) {
        window.adminPanel.refreshDashboard();
    }
}

function exportDashboardData() {
    if (window.adminPanel) {
        window.adminPanel.exportDashboardData();
    }
}

function testDatabaseConnection() {
    console.log('🔍 Jack026: Testing database connection...');
    
    fetch('/api/admin/system-status', {
        headers: { 'X-User': 'Jack026' }
    })
    .then(response => response.json())
    .then(data => {
        const status = data.data.database.status;
        const message = status === 'connected' ? 'Database connection successful!' : 'Database connection failed!';
        const type = status === 'connected' ? 'success' : 'error';
        
        if (window.adminPanel) {
            window.adminPanel.showNotification(message, type);
        }
    })
    .catch(error => {
        console.error('Database test failed:', error);
        if (window.adminPanel) {
            window.adminPanel.showNotification('Database test failed', 'error');
        }
    });
}

function celebrateStreak() {
    console.log('🎉 Jack026: Celebrating streak!');
    
    // Create celebration effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const celebration = document.createElement('div');
            celebration.innerHTML = '🎉';
            celebration.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                font-size: 2rem;
                z-index: 30000;
                animation: confetti-fall 3s linear forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(celebration);
            setTimeout(() => celebration.remove(), 3000);
        }, i * 100);
    }
    
    if (window.adminPanel) {
        window.adminPanel.showNotification('🎉 Congratulations Jack026! 47-day streak is amazing!', 'success');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new Jack026AdminPanel();
    
    console.log('🎯 Jack026 Admin Panel fully loaded at 2025-08-06 20:13:28');
});

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        from {
            transform: translateY(-100vh) rotate(0deg);
        }
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);