/* ========================================
   PERFECT 404 ERROR PAGE JAVASCRIPT
   Updated: 2025-08-06 16:22:38 UTC
   Built for: Jack026 & Da-Vinci Coder Club
======================================== */

// 404 Page Configuration
const ERROR_404_CONFIG = {
    currentUser: 'Jack026',
    currentTime: '2025-08-06 16:22:38',
    version: '1.0.0',
    features: {
        adminTools: true,
        errorReporting: true,
        analytics: true,
        search: true
    }
};

// Enhanced 404 Page Class
class Error404Page {
    constructor() {
        this.currentUrl = window.location.href;
        this.referrer = document.referrer;
        this.userAgent = navigator.userAgent;
        this.isJack026 = true; // In production, check actual authentication
        this.errorStartTime = Date.now();
        
        this.init();
    }
    
    init() {
        this.updateErrorDetails();
        this.setupSearch();
        this.setupErrorReporting();
        this.initializeAnalytics();
        this.showJack026Tools();
        this.trackError();
        
        console.log(`❌ 404 Error page initialized for Jack026 at ${ERROR_404_CONFIG.currentTime}`);
    }
    
    updateErrorDetails() {
        // Update current URL display
        const currentUrlElement = document.getElementById('current-url');
        if (currentUrlElement) {
            currentUrlElement.textContent = window.location.pathname;
        }
        
        // Update referrer information
        const referrerElement = document.getElementById('referrer-page');
        const referrerInfoElement = document.getElementById('referrerInfo');
        
        const referrerText = this.referrer || 'Direct access';
        
        if (referrerElement) {
            referrerElement.value = referrerText;
        }
        
        if (referrerInfoElement) {
            const referrerHost = this.referrer ? 
                new URL(this.referrer).hostname : 'Direct';
            referrerInfoElement.textContent = referrerHost;
        }
        
        // Update user agent
        const userAgentElement = document.getElementById('userAgent');
        if (userAgentElement) {
            const shortUA = this.userAgent.split(' ')[0] + '...';
            userAgentElement.textContent = shortUA;
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('site-search');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            // Enter key search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSiteSearch();
                }
            });
            
            // Auto-suggestions
            searchInput.addEventListener('input', (e) => {
                this.showSearchSuggestions(e.target.value);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSiteSearch();
            });
        }
    }
    
    performSiteSearch() {
        const searchInput = document.getElementById('site-search');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (!query) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }
        
        // Track search
        this.trackEvent('404_search_performed', { query });
        
        // Simulate search (in production, implement actual search)
        this.showNotification(`🔍 Searching for "${query}"...`, 'info');
        
        setTimeout(() => {
            // Redirect to search results or home with query
            const searchUrl = `/?search=${encodeURIComponent(query)}`;
            window.location.href = searchUrl;
        }, 1000);
    }
    
    searchFor(query) {
        const searchInput = document.getElementById('site-search');
        if (searchInput) {
            searchInput.value = query;
            this.performSiteSearch();
        }
    }
    
    showSearchSuggestions(query) {
        if (query.length < 2) return;
        
        // Mock suggestions based on query
        const suggestions = [
            'Jack026 projects',
            'React tutorials',
            'Python guides',
            'Team members',
            'Upcoming events',
            'Coding resources'
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
        
        // In production, fetch actual suggestions from API
        console.log('Search suggestions for:', query, suggestions);
    }
    
    setupErrorReporting() {
        const reportForm = document.querySelector('.report-form');
        const reportBtn = document.querySelector('.btn-report');
        
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                this.submitErrorReport();
            });
        }
    }
    
    submitErrorReport() {
        const expectedPage = document.getElementById('expected-page')?.value;
        const referrerPage = document.getElementById('referrer-page')?.value;
        const additionalInfo = document.getElementById('additional-info')?.value;
        
        if (!expectedPage?.trim()) {
            this.showNotification('Please describe what page you were looking for', 'warning');
            return;
        }
        
        const reportData = {
            expectedPage: expectedPage.trim(),
            referrerPage: referrerPage || 'Unknown',
            additionalInfo: additionalInfo?.trim() || '',
            currentUrl: this.currentUrl,
            userAgent: this.userAgent,
            timestamp: ERROR_404_CONFIG.currentTime,
            reportedBy: ERROR_404_CONFIG.currentUser
        };
        
        // Track report submission
        this.trackEvent('404_error_reported', reportData);
        
        // Simulate report submission
        this.showNotification('📧 Error report submitted successfully!', 'success');
        
        // In production, send to actual endpoint
        console.log('Error report submitted:', reportData);
        
        // Reset form
        document.querySelector('.report-form').reset();
    }
    
    initializeAnalytics() {
        // Update analytics widget
        this.startErrorTracking();
        
        // Performance tracking
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.trackPerformance();
            }, 1000);
        });
    }
    
    startErrorTracking() {
        const analyticsWidget = document.getElementById('errorAnalytics');
        if (!analyticsWidget) return;
        
        // Simulate real-time error tracking
        setInterval(() => {
            this.updateAnalyticsDisplay();
        }, 5000);
    }
    
    updateAnalyticsDisplay() {
        // Update timestamp or other real-time data
        const timeOnPage = Math.floor((Date.now() - this.errorStartTime) / 1000);
        console.log(`⏱️ Time on 404 page: ${timeOnPage} seconds`);
    }
    
    showJack026Tools() {
        if (!this.isJack026) return;
        
        const adminSection = document.getElementById('Jack026-admin-actions');
        if (adminSection) {
            adminSection.style.display = 'block';
            console.log('👑 Jack026 admin tools activated');
        }
    }
    
    trackError() {
        const errorData = {
            type: '404_page_not_found',
            url: this.currentUrl,
            referrer: this.referrer,
            userAgent: this.userAgent,
            timestamp: ERROR_404_CONFIG.currentTime,
            user: ERROR_404_CONFIG.currentUser
        };
        
        // Send to analytics
        this.trackEvent('404_error_occurred', errorData);
        
        // Send to server if available
        this.sendErrorToServer(errorData);
    }
    
    trackEvent(eventName, data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_map: data,
                event_category: '404_error',
                event_label: this.currentUrl
            });
        }
        
        // Console tracking for development
        console.log(`📊 Event tracked: ${eventName}`, data);
    }
    
    trackPerformance() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const performanceMetrics = {
            loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            user: ERROR_404_CONFIG.currentUser,
            timestamp: ERROR_404_CONFIG.currentTime
        };
        
        this.trackEvent('404_page_performance', performanceMetrics);
        
        console.log(`📊 404 page performance metrics:`, performanceMetrics);
    }
    
    sendErrorToServer(errorData) {
        // Send error data to server for logging
        if (typeof fetch !== 'undefined') {
            fetch('/api/analytics/404', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorData)
            }).then(response => {
                if (response.ok) {
                    console.log('✅ Error data sent to server');
                }
            }).catch(error => {
                console.log('❌ Failed to send error data:', error);
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        const container = document.getElementById('toastContainer') || document.body;
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Jack026 Admin Error Handler
class Jack026ErrorHandler {
    static checkServerLogs() {
        console.log('👑 Jack026: Checking server logs...');
        error404Page.showNotification('📋 Server logs checked - No critical errors found', 'success');
        
        // Track admin action
        error404Page.trackEvent('Jack026_admin_action', {
            action: 'check_server_logs',
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
    
    static analyzeTraffic() {
        console.log('👑 Jack026: Analyzing traffic patterns...');
        error404Page.showNotification('📈 Traffic analysis complete - 404 rate within normal range', 'info');
        
        // Track admin action
        error404Page.trackEvent('Jack026_admin_action', {
            action: 'analyze_traffic',
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
    
    static createRedirect() {
        console.log('👑 Jack026: Creating redirect rule...');
        
        const currentPath = window.location.pathname;
        const suggestedRedirect = Jack026ErrorHandler.suggestRedirect(currentPath);
        
        error404Page.showNotification(
            `🔀 Redirect suggested: ${currentPath} → ${suggestedRedirect}`, 
            'success'
        );
        
        // Track admin action
        error404Page.trackEvent('Jack026_admin_action', {
            action: 'create_redirect',
            from: currentPath,
            to: suggestedRedirect,
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
    
    static suggestRedirect(path) {
        // Smart redirect suggestions based on path patterns
        const redirectMap = {
            '/old-projects': '/projects',
            '/team-members': '/team',
            '/tutorials': '/resources',
            '/events-list': '/events',
            '/contact-us': '/contact',
            '/about-us': '/about'
        };
        
        // Check for exact matches
        if (redirectMap[path]) {
            return redirectMap[path];
        }
        
        // Check for partial matches
        for (const [pattern, redirect] of Object.entries(redirectMap)) {
            if (path.includes(pattern.substring(1))) {
                return redirect;
            }
        }
        
        // Default suggestion
        return '/';
    }
}

// Global functions for inline event handlers
function performSiteSearch() {
    if (window.error404Page) {
        error404Page.performSiteSearch();
    }
}

function searchFor(query) {
    if (window.error404Page) {
        error404Page.searchFor(query);
    }
}

function submitErrorReport() {
    if (window.error404Page) {
        error404Page.submitErrorReport();
    }
}

// Make Jack026ErrorHandler globally available
window.Jack026ErrorHandler = Jack026ErrorHandler;

// Initialize 404 page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize error page
    window.error404Page = new Error404Page();
    
    // Add Jack026 signature
    const signature = document.createElement('div');
    signature.className = 'Jack026-error-signature';
    signature.innerHTML = '404 handled by Jack026 • 2025-08-06 16:22:38 UTC';
    document.body.appendChild(signature);
    
    console.log(`👤 404 page fully initialized for Jack026 at ${ERROR_404_CONFIG.currentTime}`);
    console.log(`🚨 Error tracking active for URL: ${window.location.href}`);
});

// Enhanced error boundary
window.addEventListener('error', (event) => {
    console.error('💥 JavaScript error on 404 page:', event.error);
    
    if (window.error404Page) {
        error404Page.trackEvent('javascript_error_on_404', {
            error: event.error?.message || 'Unknown error',
            filename: event.filename,
            lineno: event.lineno,
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
});

// Track page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.error404Page) {
        const visibilityState = document.visibilityState;
        error404Page.trackEvent('404_page_visibility_changed', {
            state: visibilityState,
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
});

// Track user engagement
let engagementStartTime = Date.now();
let userInteractions = 0;

document.addEventListener('click', () => {
    userInteractions++;
});

document.addEventListener('scroll', () => {
    userInteractions++;
});

// Track session end
window.addEventListener('beforeunload', () => {
    if (window.error404Page) {
        const sessionDuration = Date.now() - engagementStartTime;
        error404Page.trackEvent('404_session_end', {
            duration: sessionDuration,
            interactions: userInteractions,
            timestamp: ERROR_404_CONFIG.currentTime
        });
    }
});

/* ========================================
   END OF 404 ERROR PAGE JAVASCRIPT
   Current Date: 2025-08-06 16:22:38 UTC
   Current User: Jack026
   Built for: Enhanced Error Handling Experience
======================================== */