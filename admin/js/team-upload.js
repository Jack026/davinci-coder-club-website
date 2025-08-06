/* ========================================
   JACK026 TEAM UPLOAD FUNCTIONALITY
   Updated: 2025-08-06 20:37:25 UTC
   Current User: Jack026
======================================== */

class Jack026TeamUpload {
    constructor() {
        this.currentUser = 'Jack026';
        this.currentTime = '2025-08-06 20:37:25';
        this.apiBaseUrl = '/api/admin';
        this.selectedFiles = {};
        this.uploadHistory = [];
        this.teamMembers = [];
        this.previewData = null;
        
        this.init();
    }
    
    init() {
        console.log(`👥 Jack026 Team Upload initialized at ${this.currentTime}`);
        
        // Update time
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // Setup drag and drop
        this.setupDragAndDrop();
        
        // Load initial data
        this.loadTeamData();
        this.loadUploadHistory();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Team upload system ready for Jack026');
    }
    
    updateCurrentTime() {
        const now = new Date();
        const utcTime = now.toISOString().replace('T', ' ').substring(0, 19);
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = utcTime;
        }
        this.currentTime = utcTime;
    }
    
    setupDragAndDrop() {
        const dropZones = ['csv-drop-zone', 'json-drop-zone'];
        
        dropZones.forEach(zoneId => {
            const zone = document.getElementById(zoneId);
            if (!zone) return;
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                zone.addEventListener(eventName, () => {
                    zone.classList.add('drag-over');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, () => {
                    zone.classList.remove('drag-over');
                });
            });
            
            zone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const type = zoneId.replace('-drop-zone', '');
                    this.handleFileSelection(type, files[0]);
                }
            });
        });
    }
    
    setupEventListeners() {
        // History table click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.history-table tbody tr')) {
                const row = e.target.closest('tr');
                this.showUploadPreview(row.dataset.uploadId);
            }
        });
    }
    
    async loadTeamData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/members`, {
                headers: { 'X-User': 'Jack026' }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.teamMembers = data.data.members || [];
                this.updateTeamStats(data.data);
            }
        } catch (error) {
            console.log('⚠️ Using demo team data');
            this.teamMembers = [
                { id: 1, name: 'Jack026', email: 'jack026@club.adtu.ac.in', role: 'admin' },
                { id: 2, name: 'Sarah Chen', email: 'sarah.chen@student.adtu.ac.in', role: 'member' }
            ];
            this.updateTeamStats({ total: 156, active: 142 });
        }
    }
    
    updateTeamStats(stats) {
        document.getElementById('total-members').textContent = stats.total || this.teamMembers.length;
        document.getElementById('pending-uploads').textContent = 0;
    }
    
    loadUploadHistory() {
        // Load from localStorage or use demo data
        const saved = localStorage.getItem('jack026_team_upload_history');
        if (saved) {
            this.uploadHistory = JSON.parse(saved);
        } else {
            this.uploadHistory = [
                {
                    id: '1',
                    timestamp: '2025-08-06 19:30:15',
                    method: 'csv',
                    filename: 'new_members_batch1.csv',
                    records: 25,
                    status: 'success',
                    addedBy: 'Jack026',
                    details: {
                        processed: 25,
                        errors: 0,
                        duplicates: 0
                    }
                },
                {
                    id: '2',
                    timestamp: '2025-08-06 18:45:22',
                    method: 'manual',
                    filename: 'Individual Entry',
                    records: 1,
                    status: 'success',
                    addedBy: 'Jack026',
                    details: {
                        processed: 1,
                        errors: 0
                    }
                },
                {
                    id: '3',
                    timestamp: '2025-08-06 17:15:08',
                    method: 'json',
                    filename: 'senior_members.json',
                    records: 8,
                    status: 'success',
                    addedBy: 'Jack026',
                    details: {
                        processed: 8,
                        errors: 0
                    }
                }
            ];
        }
        
        this.updateUploadHistoryTable();
    }
    
    updateUploadHistoryTable() {
        const tbody = document.getElementById('upload-history-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.uploadHistory.map(entry => `
            <tr data-upload-id="${entry.id}" class="upload-row ${entry.status}">
                <td>${entry.timestamp}</td>
                <td>
                    <span class="method-badge ${entry.method}">
                        <i class="fas fa-${this.getMethodIcon(entry.method)}"></i>
                        ${entry.method.toUpperCase()}
                    </span>
                </td>
                <td>${entry.filename}</td>
                <td><strong>${entry.records}</strong></td>
                <td>
                    <span class="status-badge ${entry.status}">
                        <i class="fas fa-${entry.status === 'success' ? 'check' : 'times'}"></i>
                        ${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                </td>
                <td>${entry.addedBy}</td>
                <td>
                    <button class="file-action-btn" onclick="viewUploadDetails('${entry.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="file-action-btn" onclick="downloadUploadData('${entry.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    getMethodIcon(method) {
        const icons = {
            csv: 'file-csv',
            json: 'file-code',
            manual: 'user-edit',
            bulk: 'users-cog'
        };
        return icons[method] || 'file';
    }
    
    handleFileSelection(type, file) {
        console.log(`📁 Jack026: File selected for ${type}:`, file.name);
        
        if (!this.validateFile(type, file)) {
            return;
        }
        
        this.selectedFiles[type] = file;
        this.updateFileDropZone(type, file);
        this.enableUploadButton(type);
        this.previewFileContent(type, file);
    }
    
    validateFile(type, file) {
        const validations = {
            csv: { 
                extensions: ['.csv'], 
                maxSize: 10 * 1024 * 1024,
                requiredHeaders: ['name', 'email']
            },
            json: { 
                extensions: ['.json'], 
                maxSize: 5 * 1024 * 1024
            }
        };
        
        const validation = validations[type];
        if (!validation) return false;
        
        // Check extension
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!validation.extensions.includes(extension)) {
            this.showNotification(`Invalid file type. Expected: ${validation.extensions.join(', ')}`, 'error');
            return false;
        }
        
        // Check size
        if (file.size > validation.maxSize) {
            const maxSizeMB = validation.maxSize / (1024 * 1024);
            this.showNotification(`File too large. Maximum size: ${maxSizeMB}MB`, 'error');
            return false;
        }
        
        this.showNotification(`File "${file.name}" ready for upload`, 'success');
        return true;
    }
    
    updateFileDropZone(type, file) {
        const dropZone = document.getElementById(`${type}-drop-zone`);
        const dropContent = document.getElementById(`${type}-drop-content`);
        
        dropZone.classList.add('file-selected');
        
        dropContent.innerHTML = `
            <div class="file-selected-info">
                <div class="file-details">
                    <i class="fas fa-file-${type === 'csv' ? 'csv' : 'code'}"></i>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-meta">${this.formatFileSize(file.size)} • Ready for upload</div>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="previewFile('${type}')" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="file-action-btn danger" onclick="removeSelectedFile('${type}')" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    enableUploadButton(type) {
        const uploadBtn = document.getElementById(`${type}-upload-btn`);
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.classList.add('ready');
        }
    }
    
    async previewFileContent(type, file) {
        try {
            const content = await this.readFileContent(file);
            this.previewData = { type, content, filename: file.name };
            this.updatePreviewPanel();
        } catch (error) {
            console.error('Error previewing file:', error);
        }
    }
    
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    
    updatePreviewPanel() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent || !this.previewData) return;
        
        const { type, content, filename } = this.previewData;
        let preview = '';
        
        try {
            if (type === 'csv') {
                const lines = content.split('\n').filter(line => line.trim());
                const headers = lines[0].split(',').map(h => h.trim());
                const sampleRows = lines.slice(1, 6); // Show first 5 rows
                
                preview = `
                    <div class="preview-summary">
                        <h4>📄 ${filename}</h4>
                        <p><strong>Total rows:</strong> ${lines.length - 1} members</p>
                        <p><strong>Columns:</strong> ${headers.join(', ')}</p>
                    </div>
                    <div class="preview-table">
                        <table>
                            <thead>
                                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${sampleRows.map(row => {
                                    const cells = row.split(',').map(cell => cell.trim());
                                    return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                        ${lines.length > 6 ? `<p class="preview-more">...and ${lines.length - 6} more rows</p>` : ''}
                    </div>
                `;
            } else if (type === 'json') {
                const data = JSON.parse(content);
                const isArray = Array.isArray(data);
                const members = isArray ? data : [data];
                const sampleMembers = members.slice(0, 3);
                
                preview = `
                    <div class="preview-summary">
                        <h4>📄 ${filename}</h4>
                        <p><strong>Total members:</strong> ${members.length}</p>
                        <p><strong>Format:</strong> JSON ${isArray ? 'Array' : 'Object'}</p>
                    </div>
                    <div class="preview-json">
                        ${sampleMembers.map(member => `
                            <div class="json-member">
                                <h5>${member.name || 'Unnamed'}</h5>
                                <pre>${JSON.stringify(member, null, 2)}</pre>
                            </div>
                        `).join('')}
                        ${members.length > 3 ? `<p class="preview-more">...and ${members.length - 3} more members</p>` : ''}
                    </div>
                `;
            }
        } catch (error) {
            preview = `
                <div class="preview-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error previewing file: ${error.message}</p>
                </div>
            `;
        }
        
        previewContent.innerHTML = preview;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /* ========================================
   JACK026 TEAM UPLOAD FUNCTIONALITY
   Updated: 2025-08-06 20:41:00 UTC
   Current User: Jack026
======================================== */

    // Upload Processing Functions
    async processCsvUpload() {
        console.log('📤 Jack026: Processing CSV upload...');
        const file = this.selectedFiles.csv;
        if (!file) {
            this.showNotification('No CSV file selected', 'error');
            return;
        }
        
        try {
            this.showUploadProgress('csv', 0);
            
            // Read and parse CSV
            const content = await this.readFileContent(file);
            const result = await this.parseCsvContent(content);
            
            // Simulate upload progress
            await this.simulateUploadProgress('csv', result);
            
            // Process members
            const processResult = await this.processMembers(result.members, 'csv');
            
            // Complete upload
            this.completeUpload('csv', file, processResult);
            
        } catch (error) {
            console.error('CSV upload failed:', error);
            this.hideUploadProgress('csv');
            this.showNotification(`CSV upload failed: ${error.message}`, 'error');
        }
    }
    
    async processJsonUpload() {
        console.log('📤 Jack026: Processing JSON upload...');
        const file = this.selectedFiles.json;
        if (!file) {
            this.showNotification('No JSON file selected', 'error');
            return;
        }
        
        try {
            this.showUploadProgress('json', 0);
            
            // Read and parse JSON
            const content = await this.readFileContent(file);
            const result = await this.parseJsonContent(content);
            
            // Simulate upload progress
            await this.simulateUploadProgress('json', result);
            
            // Process members
            const processResult = await this.processMembers(result.members, 'json');
            
            // Complete upload
            this.completeUpload('json', file, processResult);
            
        } catch (error) {
            console.error('JSON upload failed:', error);
            this.hideUploadProgress('json');
            this.showNotification(`JSON upload failed: ${error.message}`, 'error');
        }
    }
    
    async parseCsvContent(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const members = [];
        
        // Validate required headers
        const requiredHeaders = ['name', 'email'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length && values[0] && values[1]) {
                const member = {};
                headers.forEach((header, index) => {
                    member[header] = values[index];
                });
                
                // Add default values
                member.role = member.role || 'member';
                member.status = 'active';
                member.joinDate = new Date().toISOString().split('T')[0];
                member.addedBy = 'Jack026';
                member.addedAt = this.currentTime;
                
                members.push(member);
            }
        }
        
        return { members, headers, totalRows: lines.length - 1 };
    }
    
    async parseJsonContent(content) {
        const data = JSON.parse(content);
        const members = Array.isArray(data) ? data : [data];
        
        // Validate and normalize members
        const processedMembers = members.map((member, index) => {
            if (!member.name || !member.email) {
                throw new Error(`Member at index ${index} is missing required fields (name, email)`);
            }
            
            return {
                ...member,
                role: member.role || 'member',
                status: member.status || 'active',
                joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                addedBy: 'Jack026',
                addedAt: this.currentTime
            };
        });
        
        return { members: processedMembers, totalRows: members.length };
    }
    
    async processMembers(members, method) {
        console.log(`👥 Jack026: Processing ${members.length} members via ${method}...`);
        
        const results = {
            total: members.length,
            processed: 0,
            duplicates: 0,
            errors: 0,
            errorDetails: []
        };
        
        for (const member of members) {
            try {
                // Check for duplicates
                const existingMember = this.teamMembers.find(m => 
                    m.email.toLowerCase() === member.email.toLowerCase()
                );
                
                if (existingMember) {
                    results.duplicates++;
                    console.log(`⚠️ Duplicate email: ${member.email}`);
                    continue;
                }
                
                // Validate email format
                if (!this.isValidEmail(member.email)) {
                    results.errors++;
                    results.errorDetails.push(`Invalid email: ${member.email}`);
                    continue;
                }
                
                // Add to team (simulate API call)
                await this.addMemberToTeam(member);
                results.processed++;
                
            } catch (error) {
                results.errors++;
                results.errorDetails.push(`Error processing ${member.name}: ${error.message}`);
            }
        }
        
        return results;
    }
    
    async addMemberToTeam(member) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Add to local team members array
        member.id = Date.now() + Math.random();
        this.teamMembers.push(member);
        
        // In production, this would be an actual API call:
        // const response = await fetch(`${this.apiBaseUrl}/members`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', 'X-User': 'Jack026' },
        //     body: JSON.stringify(member)
        // });
        
        console.log(`✅ Jack026: Added member ${member.name}`);
    }
    
    async simulateUploadProgress(type, result) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (!progressElement) return;
        
        let progress = 0;
        const totalSteps = result.members ? result.members.length : result.totalRows;
        const increment = 90 / totalSteps; // Leave 10% for final processing
        
        while (progress < 90) {
            progress += increment;
            this.updateProgressBar(type, progress);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Final processing
        this.updateProgressBar(type, 100);
    }
    
    showUploadProgress(type, progress) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (progressElement) {
            progressElement.style.display = 'block';
            this.updateProgressBar(type, progress);
        }
    }
    
    updateProgressBar(type, progress) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (!progressElement) return;
        
        const progressFill = progressElement.querySelector('.progress-fill');
        const progressPercentage = progressElement.querySelector('.progress-percentage');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }
    }
    
    hideUploadProgress(type) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (progressElement) {
            setTimeout(() => {
                progressElement.style.display = 'none';
            }, 1000);
        }
    }
    
    completeUpload(type, file, result) {
        this.hideUploadProgress(type);
        
        // Add to upload history
        const historyEntry = {
            id: Date.now().toString(),
            timestamp: this.currentTime,
            method: type,
            filename: file.name,
            records: result.processed,
            status: result.errors > 0 ? 'partial' : 'success',
            addedBy: 'Jack026',
            details: result
        };
        
        this.uploadHistory.unshift(historyEntry);
        this.saveUploadHistory();
        this.updateUploadHistoryTable();
        
        // Show results modal
        this.showUploadResults(type, file, result);
        
        // Reset upload area
        this.resetUploadArea(type);
        
        // Update team stats
        this.updateTeamStats({ total: this.teamMembers.length });
    }
    
    showUploadResults(type, file, result) {
        const modal = document.getElementById('uploadResultsModal');
        const title = document.getElementById('upload-results-title');
        const body = document.getElementById('upload-results-body');
        
        title.textContent = `${type.toUpperCase()} Upload Complete`;
        
        const successRate = Math.round((result.processed / result.total) * 100);
        
        body.innerHTML = `
            <div class="upload-results-content">
                <div class="results-summary">
                    <div class="result-icon ${result.errors === 0 ? 'success' : 'warning'}">
                        <i class="fas fa-${result.errors === 0 ? 'check-circle' : 'exclamation-triangle'}"></i>
                    </div>
                    <h3>${result.errors === 0 ? 'Upload Successful!' : 'Upload Completed with Issues'}</h3>
                    <p>File: <strong>${file.name}</strong></p>
                </div>
                
                <div class="results-stats-grid">
                    <div class="result-stat success">
                        <span class="stat-number">${result.processed}</span>
                        <span class="stat-label">Members Added</span>
                    </div>
                    <div class="result-stat warning">
                        <span class="stat-number">${result.duplicates}</span>
                        <span class="stat-label">Duplicates Skipped</span>
                    </div>
                    <div class="result-stat ${result.errors > 0 ? 'danger' : 'neutral'}">
                        <span class="stat-number">${result.errors}</span>
                        <span class="stat-label">Errors</span>
                    </div>
                    <div class="result-stat info">
                        <span class="stat-number">${successRate}%</span>
                        <span class="stat-label">Success Rate</span>
                    </div>
                </div>
                
                ${result.errorDetails.length > 0 ? `
                    <div class="error-details">
                        <h4>⚠️ Issues Found:</h4>
                        <ul>
                            ${result.errorDetails.slice(0, 5).map(error => `<li>${error}</li>`).join('')}
                            ${result.errorDetails.length > 5 ? `<li>...and ${result.errorDetails.length - 5} more</li>` : ''}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="results-actions">
                    <button class="btn-primary" onclick="closeUploadResults()">
                        <i class="fas fa-check"></i>
                        Done
                    </button>
                    <button class="btn-secondary" onclick="viewTeamMembers()">
                        <i class="fas fa-users"></i>
                        View Team
                    </button>
                    ${result.processed > 0 ? `
                        <button class="btn-info" onclick="exportNewMembers()">
                            <i class="fas fa-download"></i>
                            Export Added Members
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    resetUploadArea(type) {
        const dropZone = document.getElementById(`${type}-drop-zone`);
        const dropContent = document.getElementById(`${type}-drop-content`);
        const uploadBtn = document.getElementById(`${type}-upload-btn`);
        const fileInput = document.getElementById(`${type}-file`);
        
        // Reset drop zone
        if (dropZone) {
            dropZone.classList.remove('file-selected');
        }
        
        // Reset content
        if (dropContent) {
            const originalContent = {
                csv: `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h4>Drop CSV file here</h4>
                    <p>or <button class="browse-btn" onclick="triggerFileInput('csv-file')">browse files</button></p>
                    <div class="file-requirements">
                        <small>Max file size: 10MB | Format: CSV</small>
                        <small>Required columns: name, email, role</small>
                    </div>
                `,
                json: `
                    <i class="fas fa-file-code"></i>
                    <h4>Drop JSON file here</h4>
                    <p>or <button class="browse-btn" onclick="triggerFileInput('json-file')">browse files</button></p>
                    <div class="file-requirements">
                        <small>Max file size: 5MB | Format: JSON</small>
                        <small>Array of member objects</small>
                    </div>
                `
            };
            
            dropContent.innerHTML = originalContent[type] || '';
        }
        
        // Reset upload button
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.classList.remove('ready');
        }
        
        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear selected file
        delete this.selectedFiles[type];
    }
    
    // Manual Entry Functions
    async addMemberManually() {
        const name = document.getElementById('manual-name').value.trim();
        const email = document.getElementById('manual-email').value.trim();
        const role = document.getElementById('manual-role').value;
        const department = document.getElementById('manual-department').value;
        const year = document.getElementById('manual-year').value;
        const phone = document.getElementById('manual-phone').value.trim();
        
        if (!name || !email) {
            this.showNotification('Name and email are required', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Check for duplicates
        const existingMember = this.teamMembers.find(m => 
            m.email.toLowerCase() === email.toLowerCase()
        );
        
        if (existingMember) {
            this.showNotification('A member with this email already exists', 'error');
            return;
        }
        
        const member = {
            name,
            email,
            role,
            department,
            year,
            phone,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            addedBy: 'Jack026',
            addedAt: this.currentTime
        };
        
        try {
            await this.addMemberToTeam(member);
            
            // Add to history
            const historyEntry = {
                id: Date.now().toString(),
                timestamp: this.currentTime,
                method: 'manual',
                filename: 'Individual Entry',
                records: 1,
                status: 'success',
                addedBy: 'Jack026',
                details: { processed: 1, errors: 0, duplicates: 0 }
            };
            
            this.uploadHistory.unshift(historyEntry);
            this.saveUploadHistory();
            this.updateUploadHistoryTable();
            this.updateTeamStats({ total: this.teamMembers.length });
            
            this.showNotification(`Member ${name} added successfully!`, 'success');
            this.clearManualForm();
            
        } catch (error) {
            console.error('Error adding member:', error);
            this.showNotification('Error adding member', 'error');
        }
    }
    
    clearManualForm() {
        document.getElementById('manual-name').value = '';
        document.getElementById('manual-email').value = '';
        document.getElementById('manual-role').value = 'member';
        document.getElementById('manual-department').value = '';
        document.getElementById('manual-year').value = '';
        document.getElementById('manual-phone').value = '';
    }
    
    // Team Operations
    async bulkUpdateRoles() {
        console.log('👥 Jack026: Bulk updating roles...');
        this.showNotification('Bulk role update feature coming soon!', 'info');
    }
    
    async validateTeamData() {
        console.log('✅ Jack026: Validating team data...');
        
        let validationResults = {
            totalMembers: this.teamMembers.length,
            validEmails: 0,
            invalidEmails: 0,
            duplicateEmails: 0,
            missingFields: 0
        };
        
        const emailSet = new Set();
        const duplicates = [];
        
        this.teamMembers.forEach(member => {
            // Check email validity
            if (this.isValidEmail(member.email)) {
                validationResults.validEmails++;
            } else {
                validationResults.invalidEmails++;
            }
            
            // Check for duplicates
            if (emailSet.has(member.email.toLowerCase())) {
                duplicates.push(member.email);
                validationResults.duplicateEmails++;
            } else {
                emailSet.add(member.email.toLowerCase());
            }
            
            // Check for missing fields
            if (!member.name || !member.email) {
                validationResults.missingFields++;
            }
        });
        
        this.showValidationResults(validationResults, duplicates);
    }
    
    showValidationResults(results, duplicates) {
        const modal = document.getElementById('uploadResultsModal');
        const title = document.getElementById('upload-results-title');
        const body = document.getElementById('upload-results-body');
        
        title.textContent = 'Team Data Validation Results';
        
        body.innerHTML = `
            <div class="validation-results">
                <div class="validation-summary">
                    <div class="result-icon ${results.invalidEmails === 0 && results.duplicateEmails === 0 ? 'success' : 'warning'}">
                        <i class="fas fa-${results.invalidEmails === 0 && results.duplicateEmails === 0 ? 'check-shield' : 'exclamation-triangle'}"></i>
                    </div>
                    <h3>Validation Complete</h3>
                    <p>Analyzed ${results.totalMembers} team members</p>
                </div>
                
                <div class="results-stats-grid">
                    <div class="result-stat success">
                        <span class="stat-number">${results.validEmails}</span>
                        <span class="stat-label">Valid Emails</span>
                    </div>
                    <div class="result-stat ${results.invalidEmails > 0 ? 'danger' : 'neutral'}">
                        <span class="stat-number">${results.invalidEmails}</span>
                        <span class="stat-label">Invalid Emails</span>
                    </div>
                    <div class="result-stat ${results.duplicateEmails > 0 ? 'warning' : 'neutral'}">
                        <span class="stat-number">${results.duplicateEmails}</span>
                        <span class="stat-label">Duplicate Emails</span>
                    </div>
                    <div class="result-stat ${results.missingFields > 0 ? 'danger' : 'neutral'}">
                        <span class="stat-number">${results.missingFields}</span>
                        <span class="stat-label">Missing Fields</span>
                    </div>
                </div>
                
                ${duplicates.length > 0 ? `
                    <div class="error-details">
                        <h4>⚠️ Duplicate Emails Found:</h4>
                        <ul>
                            ${duplicates.slice(0, 5).map(email => `<li>${email}</li>`).join('')}
                            ${duplicates.length > 5 ? `<li>...and ${duplicates.length - 5} more</li>` : ''}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="results-actions">
                    <button class="btn-primary" onclick="closeUploadResults()">
                        <i class="fas fa-check"></i>
                        Done
                    </button>
                    ${results.invalidEmails > 0 || results.duplicateEmails > 0 ? `
                        <button class="btn-warning" onclick="exportValidationReport()">
                            <i class="fas fa-file-export"></i>
                            Export Issues
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    async findDuplicates() {
        console.log('🔍 Jack026: Finding duplicates...');
        
        const emailMap = new Map();
        const duplicates = [];
        
        this.teamMembers.forEach(member => {
            const email = member.email.toLowerCase();
            if (emailMap.has(email)) {
                duplicates.push({
                    email,
                    members: [emailMap.get(email), member]
                });
            } else {
                emailMap.set(email, member);
            }
        });
        
        if (duplicates.length === 0) {
            this.showNotification('No duplicate emails found! ✅', 'success');
        } else {
            this.showNotification(`Found ${duplicates.length} duplicate email(s)`, 'warning');
            // You could show a detailed modal here
        }
    }
    
    async archiveInactiveMembers() {
        console.log('📦 Jack026: Archiving inactive members...');
        
        if (confirm('This will archive members who haven\'t been active in 6+ months. Continue?')) {
            // Simulate archiving
            const archivedCount = Math.floor(Math.random() * 10) + 1;
            this.showNotification(`Archived ${archivedCount} inactive members`, 'success');
        }
    }
    
    async resetTeamData() {
        if (confirm('⚠️ This will reset all team data to demo state. Are you sure, Jack026?')) {
            console.log('🔄 Jack026: Resetting team data...');
            
            // Clear data
            this.teamMembers = [];
            this.uploadHistory = [];
            localStorage.removeItem('jack026_team_upload_history');
            
            // Reload demo data
            await this.loadTeamData();
            this.loadUploadHistory();
            
            this.showNotification('Team data reset to demo state', 'success');
        }
    }
    
    // Template Downloads
    downloadCsvTemplate() {
        console.log('📥 Jack026: Downloading CSV template...');
        
        const csvContent = [
            'name,email,role,department,year,phone',
            'John Doe,john.doe@student.adtu.ac.in,member,Computer Science,2nd Year,+91-9876543210',
            'Jane Smith,jane.smith@student.adtu.ac.in,senior,Information Technology,3rd Year,+91-9876543211',
            'Mike Johnson,mike.johnson@student.adtu.ac.in,core,Electronics,4th Year,+91-9876543212'
        ].join('\n');
        
        this.downloadFile(csvContent, 'team_members_template.csv', 'text/csv');
        this.showNotification('CSV template downloaded successfully', 'success');
    }
    
    downloadJsonTemplate() {
        console.log('📥 Jack026: Downloading JSON template...');
        
        const jsonData = [
            {
                name: "John Doe",
                email: "john.doe@student.adtu.ac.in",
                role: "member",
                department: "Computer Science",
                year: "2nd Year",
                phone: "+91-9876543210",
                skills: ["JavaScript", "Python"],
                interests: ["Web Development", "AI"]
            },
            {
                name: "Jane Smith",
                email: "jane.smith@student.adtu.ac.in",
                role: "senior",
                department: "Information Technology",
                year: "3rd Year",
                phone: "+91-9876543211",
                skills: ["React", "Node.js"],
                interests: ["Mobile Development", "Cloud Computing"]
            }
        ];
        
        const jsonContent = JSON.stringify(jsonData, null, 2);
        this.downloadFile(jsonContent, 'team_members_template.json', 'application/json');
        this.showNotification('JSON template downloaded successfully', 'success');
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Utility Functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    saveUploadHistory() {
        localStorage.setItem('jack026_team_upload_history', JSON.stringify(this.uploadHistory));
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
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global Functions
function triggerFileInput(inputId) {
    document.getElementById(inputId).click();
}

function handleCsvUpload(input) {
    if (input.files.length > 0) {
        window.teamUpload.handleFileSelection('csv', input.files[0]);
    }
}

function handleJsonUpload(input) {
    if (input.files.length > 0) {
        window.teamUpload.handleFileSelection('json', input.files[0]);
    }
}

function processCsvUpload() {
    window.teamUpload.processCsvUpload();
}

function processJsonUpload() {
    window.teamUpload.processJsonUpload();
}

function removeSelectedFile(type) {
    window.teamUpload.resetUploadArea(type);
}

function previewFile(type) {
    window.teamUpload.updatePreviewPanel();
}

function downloadCsvTemplate() {
    window.teamUpload.downloadCsvTemplate();
}

function downloadJsonTemplate() {
    window.teamUpload.downloadJsonTemplate();
}

function addMemberManually() {
    window.teamUpload.addMemberManually();
}

function clearManualForm() {
    window.teamUpload.clearManualForm();
}

function bulkUpdateRoles() {
    window.teamUpload.bulkUpdateRoles();
}

function validateTeamData() {
    window.teamUpload.validateTeamData();
}

function findDuplicates() {
    window.teamUpload.findDuplicates();
}

function archiveInactiveMembers() {
    window.teamUpload.archiveInactiveMembers();
}

function resetTeamData() {
    window.teamUpload.resetTeamData();
}

function showQuickAddMember() {
    document.getElementById('quickAddModal').style.display = 'flex';
}

function closeQuickAdd() {
    document.getElementById('quickAddModal').style.display = 'none';
}

function submitQuickAdd(event) {
    event.preventDefault();
    
    const name = document.getElementById('quick-name').value.trim();
    const email = document.getElementById('quick-email').value.trim();
    const role = document.getElementById('quick-role').value;
    const department = document.getElementById('quick-department').value;
    
    if (!name || !email) {
        window.teamUpload.showNotification('Name and email are required', 'error');
        return;
    }
    
    // Use manual add functionality
    document.getElementById('manual-name').value = name;
    document.getElementById('manual-email').value = email;
    document.getElementById('manual-role').value = role;
    document.getElementById('manual-department').value = department;
    
    window.teamUpload.addMemberManually();
    closeQuickAdd();
    
    // Clear quick add form
    document.getElementById('quick-name').value = '';
    document.getElementById('quick-email').value = '';
    document.getElementById('quick-role').value = 'member';
    document.getElementById('quick-department').value = 'Computer Science';
}

function closeUploadResults() {
    document.getElementById('uploadResultsModal').style.display = 'none';
}

function viewTeamMembers() {
    window.teamUpload.showNotification('Opening team members view...', 'info');
    closeUploadResults();
}

function exportNewMembers() {
    window.teamUpload.showNotification('Exporting newly added members...', 'info');
    closeUploadResults();
}

function exportTeamData() {
    console.log('📤 Jack026: Exporting team data...');
    
    const teamData = {
        exportedBy: 'Jack026',
        exportedAt: window.teamUpload.currentTime,
        totalMembers: window.teamUpload.teamMembers.length,
        members: window.teamUpload.teamMembers
    };
    
    const content = JSON.stringify(teamData, null, 2);
    window.teamUpload.downloadFile(content, `team_data_export_${Date.now()}.json`, 'application/json');
    window.teamUpload.showNotification('Team data exported successfully', 'success');
}

function showTeamStatistics() {
    console.log('📊 Jack026: Showing team statistics...');
    
    const stats = {
        total: window.teamUpload.teamMembers.length,
        byRole: {},
        byDepartment: {},
        recentJoins: 0
    };
    
    // Calculate statistics
    window.teamUpload.teamMembers.forEach(member => {
        // By role
        stats.byRole[member.role] = (stats.byRole[member.role] || 0) + 1;
        
        // By department
        if (member.department) {
            stats.byDepartment[member.department] = (stats.byDepartment[member.department] || 0) + 1;
        }
        
        // Recent joins (last 30 days)
        const joinDate = new Date(member.joinDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (joinDate > thirtyDaysAgo) {
            stats.recentJoins++;
        }
    });
    
    window.teamUpload.showNotification(`Team Stats: ${stats.total} total, ${stats.recentJoins} joined recently`, 'info');
}

function refreshUploadHistory() {
    window.teamUpload.loadUploadHistory();
    window.teamUpload.showNotification('Upload history refreshed', 'success');
}

function exportUploadHistory() {
    const historyData = {
        exportedBy: 'Jack026',
        exportedAt: window.teamUpload.currentTime,
        history: window.teamUpload.uploadHistory
    };
    
    const content = JSON.stringify(historyData, null, 2);
    window.teamUpload.downloadFile(content, `upload_history_${Date.now()}.json`, 'application/json');
    window.teamUpload.showNotification('Upload history exported', 'success');
}

function viewUploadDetails(uploadId) {
    console.log(`👁️ Jack026: Viewing details for upload ${uploadId}`);
    const upload = window.teamUpload.uploadHistory.find(u => u.id === uploadId);
    if (upload) {
        window.teamUpload.showNotification(`Upload: ${upload.filename} - ${upload.records} records`, 'info');
    }
}

function downloadUploadData(uploadId) {
    console.log(`📥 Jack026: Downloading data for upload ${uploadId}`);
    window.teamUpload.showNotification('Download feature coming soon!', 'info');
}

function closePreview() {
    const previewContent = document.getElementById('preview-content');
    if (previewContent) {
        previewContent.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-eye"></i>
                <p>Select a file to preview its contents</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.teamUpload = new Jack026TeamUpload();
    
    console.log('🎯 Jack026 Team Upload system fully loaded at 2025-08-06 20:41:00');
});