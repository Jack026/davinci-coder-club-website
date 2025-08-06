/* ========================================
   JACK026 ADMIN SHORTCUTS JAVASCRIPT
   Updated: 2025-08-06 20:13:28 UTC
   Current User: Jack026
======================================== */

// Basic admin shortcuts functionality
console.log('📄 Jack026 Admin Shortcuts loaded at 2025-08-06 20:13:28');

// Add shortcut indicator
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard listener for admin shortcuts
    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
        
        // Ctrl+Shift+A for Admin Panel
        if (ctrlKey && e.shiftKey && e.code === 'KeyA') {
            e.preventDefault();
            console.log('👑 Jack026: Admin shortcut activated');
            window.location.href = '/admin/';
        }
    });
    
    console.log('⌨️ Jack026 shortcuts ready - Press Ctrl+Shift+A for admin access');
});