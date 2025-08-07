const fs = require('fs');
const csvParse = require('csv-parse');

/**
 * Utility functions for parsing uploaded CSV and JSON files
 */
class FileParser {
    /**
     * Parse CSV file and return array of objects
     * @param {string} filePath - Path to the CSV file
     * @param {Array} expectedColumns - Array of expected column names
     * @returns {Promise<Array>} Parsed data array
     */
    static async parseCSV(filePath, expectedColumns = []) {
        return new Promise((resolve, reject) => {
            const results = [];
            const fileStream = fs.createReadStream(filePath);
            
            fileStream
                .pipe(csvParse.parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                }))
                .on('data', (row) => {
                    // Basic validation - check if required columns exist
                    if (expectedColumns.length > 0) {
                        const hasRequiredColumns = expectedColumns.some(col => row.hasOwnProperty(col));
                        if (hasRequiredColumns) {
                            results.push(row);
                        }
                    } else {
                        results.push(row);
                    }
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    /**
     * Parse JSON file and return array of objects
     * @param {string} filePath - Path to the JSON file
     * @returns {Promise<Array>} Parsed data array
     */
    static async parseJSON(filePath) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                return data;
            } else if (typeof data === 'object' && data !== null) {
                // If it's a single object, wrap it in an array
                return [data];
            } else {
                throw new Error('Invalid JSON structure - expected array or object');
            }
        } catch (error) {
            throw new Error(`JSON parsing error: ${error.message}`);
        }
    }

    /**
     * Clean up uploaded file after processing
     * @param {string} filePath - Path to the file to delete
     */
    static cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Error cleaning up file ${filePath}:`, error);
        }
    }

    /**
     * Validate member data structure
     * @param {Object} memberData - Member data to validate
     * @returns {Object} Cleaned and validated member data
     */
    static validateMemberData(memberData) {
        const cleaned = {};
        
        // Required fields
        cleaned.name = memberData.name || memberData.Name || '';
        cleaned.role = memberData.role || memberData.Role || '';
        cleaned.department = memberData.department || memberData.Department || '';
        cleaned.year = memberData.year || memberData.Year || '';
        cleaned.bio = memberData.bio || memberData.Bio || '';
        
        // Optional fields
        cleaned.position = memberData.position || memberData.Position || 'Member';
        cleaned.skills = this.parseArrayField(memberData.skills || memberData.Skills);
        cleaned.isActive = this.parseBooleanField(memberData.isActive || memberData.Active, true);
        
        // Social media fields
        cleaned.social = {
            github: memberData.github || memberData.GitHub || '',
            linkedin: memberData.linkedin || memberData.LinkedIn || '',
            twitter: memberData.twitter || memberData.Twitter || '',
            portfolio: memberData.portfolio || memberData.Portfolio || ''
        };

        return cleaned;
    }

    /**
     * Validate project data structure
     * @param {Object} projectData - Project data to validate
     * @returns {Object} Cleaned and validated project data
     */
    static validateProjectData(projectData) {
        const cleaned = {};
        
        // Required fields
        cleaned.title = projectData.title || projectData.Title || '';
        cleaned.description = projectData.description || projectData.Description || '';
        cleaned.category = projectData.category || projectData.Category || 'Web Development';
        cleaned.technologies = this.parseArrayField(projectData.technologies || projectData.Technologies);
        
        // Optional fields
        cleaned.longDescription = projectData.longDescription || projectData.LongDescription || '';
        cleaned.githubUrl = projectData.githubUrl || projectData.GitHubURL || '';
        cleaned.liveUrl = projectData.liveUrl || projectData.LiveURL || '';
        cleaned.status = projectData.status || projectData.Status || 'in-progress';
        cleaned.featured = this.parseBooleanField(projectData.featured || projectData.Featured, false);
        cleaned.tags = this.parseArrayField(projectData.tags || projectData.Tags);

        return cleaned;
    }

    /**
     * Validate event data structure
     * @param {Object} eventData - Event data to validate
     * @returns {Object} Cleaned and validated event data
     */
    static validateEventData(eventData) {
        const cleaned = {};
        
        // Required fields
        cleaned.title = eventData.title || eventData.Title || '';
        cleaned.description = eventData.description || eventData.Description || '';
        cleaned.category = eventData.category || eventData.Category || 'Workshop';
        cleaned.venue = eventData.venue || eventData.Venue || '';
        cleaned.organizer = eventData.organizer || eventData.Organizer || 'Da-Vinci Coder Club';
        
        // Date handling
        cleaned.date = this.parseDate(eventData.date || eventData.Date);
        cleaned.time = eventData.time || eventData.Time || '10:00 AM';
        
        // Optional fields
        cleaned.capacity = parseInt(eventData.capacity || eventData.Capacity) || 50;
        cleaned.status = eventData.status || eventData.Status || 'upcoming';
        cleaned.featured = this.parseBooleanField(eventData.featured || eventData.Featured, false);
        cleaned.registrationOpen = this.parseBooleanField(eventData.registrationOpen || eventData.RegistrationOpen, true);
        cleaned.tags = this.parseArrayField(eventData.tags || eventData.Tags);

        return cleaned;
    }

    /**
     * Parse array field from string or array
     * @param {string|Array} field - Field to parse
     * @returns {Array} Parsed array
     */
    static parseArrayField(field) {
        if (Array.isArray(field)) {
            return field;
        }
        if (typeof field === 'string' && field.trim()) {
            // Split by comma or semicolon and clean up
            return field.split(/[,;]/).map(item => item.trim()).filter(item => item);
        }
        return [];
    }

    /**
     * Parse boolean field
     * @param {any} field - Field to parse
     * @param {boolean} defaultValue - Default value if parsing fails
     * @returns {boolean} Parsed boolean
     */
    static parseBooleanField(field, defaultValue = false) {
        if (typeof field === 'boolean') {
            return field;
        }
        if (typeof field === 'string') {
            const normalized = field.toLowerCase().trim();
            if (['true', 'yes', '1', 'on'].includes(normalized)) {
                return true;
            }
            if (['false', 'no', '0', 'off'].includes(normalized)) {
                return false;
            }
        }
        return defaultValue;
    }

    /**
     * Parse date field
     * @param {string|Date} dateField - Date field to parse
     * @returns {Date} Parsed date
     */
    static parseDate(dateField) {
        if (dateField instanceof Date) {
            return dateField;
        }
        if (typeof dateField === 'string' && dateField.trim()) {
            const parsedDate = new Date(dateField);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }
        // Default to tomorrow if no valid date provided
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }
}

module.exports = FileParser;