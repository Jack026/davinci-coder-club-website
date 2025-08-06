/* ========================================
   ABOUT PAGE JAVASCRIPT - NAVIGATION FIXED
   Updated: 2025-08-06 21:24:44 UTC
   Built for: Jack026
======================================== */

// About Page Configuration
const ABOUT_CONFIG = {
    currentUser: 'Jack026',
    currentTime: '2025-08-06 21:24:44',
    version: '2.1.2',
    buildTime: '2025-08-06T21:24:44Z',
    clubFoundedYear: 2022,
    features: {
        interactiveTimeline: true,
        memberSpotlight: true,
        realTimeStats: true,
        missionAnimation: true,
        achievementCards: true
    }
};

class AboutPage {
    constructor() {
        this.clubStats = {
            totalMembers: 127,
            totalProjects: 89,
            totalEvents: 156,
            achievementsEarned: 234
        };
        this.timeline = [];
        this.currentSection = 'mission';
        this.animationObserver = null;
        this.countUpAnimations = [];
        this.testimonials = [];
        this.currentTestimonial = 0;
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 About page initializing...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeFeatures();
            });
        } else {
            this.initializeFeatures();
        }
    }
    
    initializeFeatures() {
        this.setupSectionNavigation();
        this.setupAnimationObserver();
        this.loadClubStats();
        this.loadTimeline();
        this.setupTestimonialCarousel();
        this.setupInteractiveElements();
        this.setupMissionAnimation();
        this.startRealTimeUpdates();
        
        // Force trigger stats animation after a short delay
        setTimeout(() => {
            this.triggerStatsAnimation();
        }, 1000);
        
        console.log(`ℹ️ About page initialized for ${ABOUT_CONFIG.currentUser}`);
        this.trackPageView();
    }
    
    setupSectionNavigation() {
        // FIXED: Only handle internal section navigation, not main nav links
        const internalNavLinks = document.querySelectorAll('.about-nav a, .section-nav a');
        
        // Handle internal section navigation only
        internalNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Only prevent default for internal section links (starting with #)
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = href.substring(1);
                    this.scrollToSection(targetSection);
                    this.updateActiveNav(link);
                    this.trackSectionVisit(targetSection);
                }
                // Let other links work normally (don't prevent default)
            });
        });
        
        // IMPORTANT: Don't interfere with main navigation
        // Let the main nav links (.nav-link) work normally for page navigation
        const mainNavLinks = document.querySelectorAll('.nav-link');
        console.log(`🔗 Found ${mainNavLinks.length} main navigation links - letting them work normally`);
        
        // Scroll spy for internal sections only
        window.addEventListener('scroll', () => {
            this.updateScrollSpy();
        });
    }
    
    setupAnimationObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('hero-stats') || 
                        entry.target.querySelector('.hero-stats') ||
                        entry.target.id === 'clubStats') {
                        if (!this.statsAnimated) {
                            console.log('📊 Triggering stats animation...');
                            this.animateCounters();
                            this.statsAnimated = true;
                        }
                    }
                }
            });
        }, options);
        
        // Observe stats sections
        setTimeout(() => {
            const statsElements = document.querySelectorAll('.hero-stats, #clubStats, .stats-section');
            statsElements.forEach(el => {
                if (el) {
                    console.log('👀 Observing stats element:', el);
                    this.animationObserver.observe(el);
                }
            });
        }, 500);
    }
    
    async loadClubStats() {
        try {
            this.showStatsLoading(true);
            
            // Use predefined stats
            this.clubStats = {
                totalMembers: 250,
                totalProjects: 89,
                totalEvents: 156,
                achievementsEarned: 234,
                activeMentorships: 47,
                githubContributions: 2847,
                codeReviews: 1023,
                workshopsHosted: 67
            };
            
            this.renderStats();
            this.showStatsLoading(false);
            
            // Force animation after stats are rendered
            setTimeout(() => {
                this.triggerStatsAnimation();
            }, 500);
            
        } catch (error) {
            console.error('Failed to load club stats:', error);
            this.loadFallbackStats();
        }
    }
    
    loadFallbackStats() {
        this.clubStats = {
            totalMembers: 250,
            totalProjects: 85,
            totalEvents: 150,
            achievementsEarned: 220
        };
        
        this.renderStats();
        setTimeout(() => {
            this.triggerStatsAnimation();
        }, 500);
    }
    
    renderStats() {
        const statsContainer = document.getElementById('clubStats');
        if (statsContainer) {
            const statsHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="${this.clubStats.totalMembers}">0</div>
                            <div class="stat-label">Active Members</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="${this.clubStats.totalProjects}">0</div>
                            <div class="stat-label">Projects Completed</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="${this.clubStats.totalEvents}">0</div>
                            <div class="stat-label">Events Organized</div>
                        </div>
                    </div>
                </div>
            `;
            
            statsContainer.innerHTML = statsHTML;
            console.log('📝 Stats HTML rendered');
        }
        
        // Also update any existing stats in the hero section
        this.updateExistingStats();
    }
    
    updateExistingStats() {
        // Update existing stat numbers in the hero section
        const statElements = document.querySelectorAll('.stat-number');
        console.log(`🔍 Found ${statElements.length} stat elements`);
        
        statElements.forEach((element, index) => {
            const values = [this.clubStats.totalMembers, 4, this.clubStats.totalEvents]; // 4 for "YEARS STRONG"
            if (values[index] !== undefined) {
                element.setAttribute('data-count', values[index]);
                element.textContent = '0'; // Reset to 0 for animation
                console.log(`📊 Set data-count=${values[index]} for element ${index}`);
            }
        });
    }
    
    // Enhanced counter animation
    animateCounters() {
        console.log('🎬 Starting counter animation...');
        
        const counters = document.querySelectorAll('.stat-number');
        console.log(`🔢 Found ${counters.length} counters to animate`);
        
        counters.forEach((counter, index) => {
            // Skip if already animated
            if (counter.hasAttribute('data-animated')) {
                console.log(`⏭️  Skipping counter ${index} - already animated`);
                return;
            }
            
            let target = 0;
            let rawValue = counter.getAttribute('data-count') || counter.textContent;
            
            console.log(`🎯 Counter ${index}: rawValue="${rawValue}"`);
            
            // Handle different number formats
            if (rawValue) {
                // Remove all non-numeric characters except dots and extract number
                const numericPart = rawValue.toString().replace(/[^\d.]/g, '');
                target = parseFloat(numericPart) || 0;
                
                // Handle special cases
                if (rawValue.toString().toLowerCase().includes('k')) {
                    target = target * 1000;
                } else if (rawValue.toString().toLowerCase().includes('m')) {
                    target = target * 1000000;
                }
            }
            
            // Fallback values if no data-count
            if (target === 0) {
                const fallbackValues = [250, 4, 150]; // Members, Years, Events
                target = fallbackValues[index] || 0;
                counter.setAttribute('data-count', target);
            }
            
            console.log(`🎯 Counter ${index}: target=${target}`);
            
            if (target > 0) {
                this.animateSingleCounter(counter, target, index);
            } else {
                console.warn(`⚠️ Invalid target for counter ${index}: ${target}`);
                counter.textContent = rawValue; // Fallback to original value
            }
        });
    }
    
    animateSingleCounter(counter, target, index) {
        const duration = 2000;
        const startTime = performance.now();
        let hasStarted = false;
        
        const updateCounter = (currentTime) => {
            if (!hasStarted) {
                console.log(`🚀 Starting animation for counter ${index}, target: ${target}`);
                hasStarted = true;
            }
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            // Update display
            if (target >= 1000) {
                counter.textContent = this.formatNumber(current);
            } else {
                counter.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Final value
                const finalValue = target >= 1000 ? this.formatNumber(target) : target.toLocaleString();
                counter.textContent = finalValue;
                counter.setAttribute('data-animated', 'true');
                console.log(`✅ Counter ${index} animation complete: ${finalValue}`);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'K';
        } else {
            return num.toString();
        }
    }
    
    // Method to manually trigger stats animation
    triggerStatsAnimation() {
        console.log('🔄 Manually triggering stats animation...');
        if (!this.statsAnimated) {
            this.animateCounters();
            this.statsAnimated = true;
        }
    }
    
    // Simplified methods for the fix
    loadTimeline() {
        this.timeline = [];
    }
    
    setupTestimonialCarousel() {
        this.testimonials = [];
    }
    
    setupInteractiveElements() {
        console.log('🎮 Setting up interactive elements...');
    }
    
    setupMissionAnimation() {
        console.log('🎯 Setting up mission animations...');
    }
    
    startRealTimeUpdates() {
        console.log('🔄 Starting real-time updates...');
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    updateActiveNav(activeLink) {
        // Only update internal navigation, not main nav
        const internalNavLinks = document.querySelectorAll('.about-nav a, .section-nav a');
        internalNavLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateScrollSpy() {
        // Simplified scroll spy for internal sections only
    }
    
    showStatsLoading(show) {
        console.log(`📊 Stats loading: ${show}`);
    }
    
    trackPageView() {
        console.log('📈 Page view tracked');
    }
    
    trackSectionVisit(sectionId) {
        console.log(`📍 Section visited: ${sectionId}`);
    }
}

// Initialize About page
console.log('🚀 About.js loaded, initializing...');

// Make sure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aboutPage = new AboutPage();
    });
} else {
    window.aboutPage = new AboutPage();
}

// Also trigger on window load as backup
window.addEventListener('load', () => {
    if (window.aboutPage && !window.aboutPage.statsAnimated) {
        console.log('🔄 Window loaded - triggering stats animation as backup');
        window.aboutPage.triggerStatsAnimation();
    }
});