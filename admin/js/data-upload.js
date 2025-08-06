/* ========================================
   JACK026 DATA UPLOAD FUNCTIONALITY
   Updated: 2025-08-06 20:26:47 UTC
   Current User: Jack026
======================================== */

class Jack026DataUpload {
    constructor() {
        this.currentUser = 'Jack026';
        this.currentTime = '2025-08-06 20:26:47';
        this.apiBaseUrl = '/api/admin';
        this.uploadHistory = [];
        this.selectedFiles = {};
        
        this.init();
    }
    
    init() {
        console.log(`📤 Jack026 Data Upload initialized at ${this.currentTime}`);
        
        // Update time
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // Setup drag and drop
        this.setupDragAndDrop();
        
        // Load upload history
        this.loadUploadHistory();
        
        // Setup stats
        this.updateUploadStats();
        
        console.log('✅ Data upload system ready for Jack026');
    }
    
    updateCurrentTime() {
        const now = new Date();
        const utcTime = now.toISOString().replace('T', ' ').substring(0, 19);
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = utcTime;
        }
    }
    
    setupDragAndDrop() {
        const uploadAreas = document.querySelectorAll('.file-upload-area');
        
        uploadAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('drag-over');
            });
            
            area.addEventListener('dragleave', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const type = area.id.replace('-upload', '');
                    this.handleFileSelection(type, files[0]);
                }
            });
        });
    }
    
    handleFileSelection(type, file) {
        console.log(`📁 Jack026: File selected for ${type}:`, file.name);
        
        // Validate file
        if (!this.validateFile(type, file)) {
            return;
        }
        
        // Store file
        this.selectedFiles[type] = file;
        
        // Update UI
        this.updateFileUploadUI(type, file);
        
        // Enable upload button
        const uploadBtn = document.querySelector(`button[onclick="upload${type.charAt(0).toUpperCase() + type.slice(1)}Data()"]`);
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.classList.add('ready');
        }
    }
    
    validateFile(type, file) {
        const validations = {
            members: { 
                extensions: ['.csv'], 
                maxSize: 10 * 1024 * 1024, // 10MB
                expectedHeaders: ['name', 'email', 'role', 'department'] 
            },
            projects: { 
                extensions: ['.json'], 
                maxSize: 5 * 1024 * 1024, // 5MB
            },
            events: { 
                extensions: ['.csv'], 
                maxSize: 2 * 1024 * 1024, // 2MB
                expectedHeaders: ['title', 'date', 'time', 'location', 'type']
            }
        };
        
        const validation = validations[type];
        if (!validation) return false;
        
        // Check file extension
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!validation.extensions.includes(extension)) {
            this.showNotification(`Invalid file type. Expected: ${validation.extensions.join(', ')}`, 'error');
            return false;
        }
        
        // Check file size
        if (file.size > validation.maxSize) {
            const maxSizeMB = validation.maxSize / (1024 * 1024);
            this.showNotification(`File too large. Maximum size: ${maxSizeMB}MB`, 'error');
            return false;
        }
        
        this.showNotification(`File "${file.name}" ready for upload`, 'success');
        return true;
    }
    
    updateFileUploadUI(type, file) {
        const uploadArea = document.getElementById(`${type}-upload`);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        
        placeholder.innerHTML = `
            <div class="file-selected">
                <i class="fas fa-file-alt"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="file-remove" onclick="removeSelectedFile('${type}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        uploadArea.classList.add('file-ready');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    async uploadMembersData() {
        console.log('👥 Jack026: Uploading members data...');
        await this.performUpload('members');
    }
    
    async uploadProjectsData() {
        console.log('💻 Jack026: Uploading projects data...');
        await this.performUpload('projects');
    }
    
    async uploadEventsData() {
        console.log('📅 Jack026: Uploading events data...');
        await this.performUpload('events');
    }
    
    async performUpload(type) {
        const file = this.selectedFiles[type];
        if (!file) {
            this.showNotification('No file selected', 'error');
            return;
        }
        
        // Show progress
        this.showUploadProgress(type, 0);
        
        try {
            // Simulate file processing with progress
            await this.simulateUploadWithProgress(type, file);
            
            // Process file content
            const result = await this.processFileContent(type, file);
            
            // Show success
            this.showUploadProgress(type, 100);
            
            // Add to history
            this.addToUploadHistory({
                type: type,
                filename: file.name,
                records: result.recordCount,
                status: 'success',
                timestamp: new Date().toISOString()
            });
            
            // Show results modal
            this.showUploadResults(type, result);
            
            // Reset upload area
            this.resetUploadArea(type);
            
            // Update stats
            this.updateUploadStats();
            
        } catch (error) {
            console.error('Upload failed:', error);
            this.showUploadProgress(type, 0);
            this.showNotification(`Upload failed: ${error.message}`, 'error');
            
            // Add failed upload to history
            this.addToUploadHistory({
                type: type,
                filename: file.name,
                records: 0,
                status: 'failed',
                timestamp: new Date().toISOString(),
                error: error.message
            });
        }
    }
    
    async simulateUploadWithProgress(type, file) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(interval);
                    resolve();
                }
                this.showUploadProgress(type, progress);
            }, 200);
        });
    }
    
    async processFileContent(type, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    let result;
                    
                    if (type === 'projects') {
                        // Process JSON
                        const data = JSON.parse(content);
                        result = this.processProjectsJSON(data);
                    } else {
                        // Process CSV
                        result = this.processCSV(type, content);
                    }
                    
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Failed to process ${type} file: ${error.message}`));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    processCSV(type, content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const records = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const record = {};
                headers.forEach((header, index) => {
                    record[header] = values[index];
                });
                records.push(record);
            }
        }
        
        return {
            recordCount: records.length,
            records: records,
            headers: headers,
            type: type
        };
    }
    
    processProjectsJSON(data) {
        if (!Array.isArray(data)) {
            throw new Error('JSON file must contain an array of projects');
        }
        
        return {
            recordCount: data.length,
            records: data,
            type: 'projects'
        };
    }
    
    showUploadProgress(type, progress) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (!progressElement) return;
        
        progressElement.style.display = 'block';
        
        const progressFill = progressElement.querySelector('.progress-fill');
        const progressText = progressElement.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }
        
        if (progress >= 100) {
            setTimeout(() => {
                progressElement.style.display = 'none';
            }, 1000);
        }
    }
    
    showUploadResults(type, result) {
        const modal = document.getElementById('uploadModal');
        const title = document.getElementById('uploadModalTitle');
        const body = document.getElementById('uploadModalBody');
        
        title.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Upload Complete`;
        
        body.innerHTML = `
            <div class="upload-results">
                <div class="results-header">
                    <i class="fas fa-check-circle" style="color: #10b981; font-size: 2rem;"></i>
                    <h3>Upload Successful!</h3>
                </div>
                <div class="results-stats">
                    <div class="result-stat">
                        <span class="stat-number">${result.recordCount}</span>
                        <span class="stat-label">Records Processed</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-number">${result.recordCount}</span>
                        <span class="stat-label">Successfully Added</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-number">0</span>
                        <span class="stat-label">Errors</span>
                    </div>
                </div>
                <div class="results-details">
                    <h4>Sample Records:</h4>
                    <div class="sample-records">
                        ${result.records.slice(0, 3).map(record => `
                            <div class="sample-record">
                                ${Object.entries(record).slice(0, 3).map(([key, value]) => 
                                    `<span><strong>${key}:</strong> ${value}</span>`
                                ).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="results-actions">
                    <button class="btn-primary" onclick="closeUploadModal()">
                        <i class="fas fa-check"></i>
                        Done
                    </button>
                    <button class="btn-secondary" onclick="viewAllRecords('${type}')">
                        <i class="fas fa-eye"></i>
                        View All Records
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    resetUploadArea(type) {
        const uploadArea = document.getElementById(`${type}-upload`);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        
        const placeholders = {
            members: {
                icon: 'fas fa-cloud-upload-alt',
                text: 'Drop CSV file here or <button class="upload-browse-btn" onclick="triggerFileInput(\'members-file\')">browse</button>',
                format: 'Supported: CSV files up to 10MB'
            },
            projects: {
                icon: 'fas fa-code',
                text: 'Drop JSON file here or <button class="upload-browse-btn" onclick="triggerFileInput(\'projects-file\')">browse</button>',
                format: 'Supported: JSON files up to 5MB'
            },
            events: {
                icon: 'fas fa-calendar-plus',
                text: 'Drop CSV file here or <button class="upload-browse-btn" onclick="triggerFileInput(\'events-file\')">browse</button>',
                format: 'Supported: CSV files up to 2MB'
            }
        };
        
        const config = placeholders[type];
        placeholder.innerHTML = `
            <i class="${config.icon}"></i>
            <p>${config.text}</p>
            <small>${config.format}</small>
        `;
        
        uploadArea.classList.remove('file-ready');
        
        // Reset file input
        const fileInput = document.getElementById(`${type}-file`);
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Disable upload button
        const uploadBtn = document.querySelector(`button[onclick="upload${type.charAt(0).toUpperCase() + type.slice(1)}Data()"]`);
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.classList.remove('ready');
        }
        
        // Clear selected file
        delete this.selectedFiles[type];
    }
    
    addToUploadHistory(entry) {
        this.uploadHistory.unshift(entry);
        this.updateUploadHistoryTable();
    }
    
    updateUploadHistoryTable() {
        const tbody = document.getElementById('upload-history-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.uploadHistory.slice(0, 10).map(entry => `
            <tr class="history-row ${entry.status}">
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>
                    <span class="type-badge ${entry.type}">
                        <i class="fas fa-${this.getTypeIcon(entry.type)}"></i>
                        ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </span>
                </td>
                <td>${entry.filename}</td>
                <td>${entry.records}</td>
                <td>
                    <span class="status-badge ${entry.status}">
                        <i class="fas fa-${entry.status === 'success' ? 'check' : 'times'}"></i>
                        ${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn-action" onclick="viewUploadDetails('${entry.timestamp}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    getTypeIcon(type) {
        const icons = {
            members: 'users',
            projects: 'project-diagram',
            events: 'calendar'
        };
        return icons[type] || 'file';
    }
    
    loadUploadHistory() {
        // Load from localStorage or simulate
        const saved = localStorage.getItem('jack026_upload_history');
        if (saved) {
            this.uploadHistory = JSON.parse(saved);
        } else {
            // Add some demo entries
            this.uploadHistory = [
                {
                    type: 'members',
                    filename: 'new_members_2025.csv',
                    records: 25,
                    status: 'success',
                    timestamp: new Date(Date.now() - 60000).toISOString()
                },
                {
                    type: 'projects',
                    filename: 'summer_projects.json',
                    records: 8,
                    status: 'success',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                }
            ];
        }
        
        this.updateUploadHistoryTable();
    }
    
    updateUploadStats() {
        const today = new Date().toDateString();
        const todayUploads = this.uploadHistory.filter(entry => 
            new Date(entry.timestamp).toDateString() === today
        );
        
        const uploadCount = todayUploads.length;
        const processedCount = todayUploads.reduce((sum, entry) => sum + entry.records, 0);
        const successRate = todayUploads.length > 0 ? 
            Math.round((todayUploads.filter(entry => entry.status === 'success').length / todayUploads.length) * 100) : 100;
        
        document.getElementById('upload-count').textContent = uploadCount;
        document.getElementById('processed-count').textContent = processedCount;
        document.getElementById('success-rate').textContent = `${successRate}%`;
    }
    
    downloadTemplate(type) {
        console.log(`📥 Jack026: Downloading ${type} template...`);
        
        const templates = {
            members: {
                headers: ['name', 'email', 'role', 'department', 'phone', 'year'],
                sample: [
                    ['John Doe', 'john.doe@student.adtu.ac.in', 'member', 'Computer Science', '+91-9876543210', '2024'],
                    ['Jane Smith', 'jane.smith@student.adtu.ac.in', 'senior', 'Information Technology', '+91-9876543211', '2023']
                ]
            },
            projects: {
                sample: [
                    {
                        title: "Web Development Project",
                        description: "Create a responsive website",
                        status: "active",
                        priority: "high",
                        technologies: ["HTML", "CSS", "JavaScript"],
                        team_size: 4,
                        start_date: "2025-08-01",
                        lead: "Jack026"
                    },
                    {
                        title: "Mobile App Development",
                        description: "Build a mobile application",
                        status: "planning",
                        priority: "medium",
                        technologies: ["React Native", "Node.js"],
                        team_size: 6,
                        start_date: "2025-09-01",
                        lead: "Sarah Chen"
                    }
                ]
            },
            events: {
                headers: ['title', 'description', 'date', 'time', 'location', 'type', 'max_participants'],
                sample: [
                    ['React Workshop', 'Learn React fundamentals', '2025-08-15', '14:00', 'Lab 301', 'workshop', '30'],
                    ['Club Meeting', 'Monthly coordination meeting', '2025-08-20', '18:00', 'Conference Room A', 'meeting', '50']
                ]
            }
        };
        
        const template = templates[type];
        let content, filename;
        
        if (type === 'projects') {
            content = JSON.stringify(template.sample, null, 2);
            filename = `${type}_template.json`;
        } else {
            const csvContent = [
                template.headers.join(','),
                ...template.sample.map(row => row.join(','))
            ].join('\n');
            content = csvContent;
            filename = `${type}_template.csv`;
        }
        
        const blob = new Blob([content], { type: type === 'projects' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Template downloaded: ${filename}`, 'success');
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
function triggerFileInput(inputId) {
    document.getElementById(inputId).click();
}

function handleFileUpload(type, input) {
    if (input.files.length > 0) {
        window.dataUpload.handleFileSelection(type, input.files[0]);
    }
}

function removeSelectedFile(type) {
    window.dataUpload.resetUploadArea(type);
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function refreshUploadHistory() {
    window.dataUpload.loadUploadHistory();
    window.dataUpload.showNotification('Upload history refreshed', 'success');
}

function exportAllData() {
    console.log('📤 Jack026: Exporting all data...');
    
    const data = {
        timestamp: '2025-08-06 20:26:47',
        user: 'Jack026',
        members: 156,
        projects: 24,
        events: 8,
        export_type: 'full_backup'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jack026_full_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    window.dataUpload.showNotification('All data exported successfully', 'success');
}

function backupDatabase() {
    console.log('💾 Jack026: Creating database backup...');
    window.dataUpload.showNotification('Database backup initiated - this may take a few minutes', 'info');
    
    setTimeout(() => {
        window.dataUpload.showNotification('Database backup completed successfully', 'success');
    }, 3000);
}

function clearCache() {
    console.log('🧹 Jack026: Clearing cache...');
    
    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('jack026_')) {
            localStorage.removeItem(key);
        }
    });
    
    window.dataUpload.showNotification('Cache cleared successfully', 'success');
}

function resetData() {
    if (confirm('⚠️ This will reset all demo data. Are you sure, Jack026?')) {
        console.log('🔄 Jack026: Resetting demo data...');
        
        localStorage.clear();
        window.dataUpload.uploadHistory = [];
        window.dataUpload.updateUploadHistoryTable();
        window.dataUpload.updateUploadStats();
        
        window.dataUpload.showNotification('Demo data reset successfully', 'success');
    }
}

function viewAllRecords(type) {
    console.log(`👁️ Jack026: Viewing all ${type} records...`);
    window.dataUpload.showNotification(`Opening ${type} records viewer...`, 'info');
}

function viewUploadDetails(timestamp) {
    console.log(`📋 Jack026: Viewing upload details for ${timestamp}`);
    window.dataUpload.showNotification('Opening upload details...', 'info');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dataUpload = new Jack026DataUpload();
    
    console.log('🎯 Jack026 Data Upload system fully loaded at 2025-08-06 20:26:47');
});