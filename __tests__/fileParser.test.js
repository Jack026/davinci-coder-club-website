const FileParser = require('../server/utils/fileParser');
const fs = require('fs');
const path = require('path');

describe('FileParser', () => {
    const testDir = '/tmp/test-parser';
    
    beforeAll(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterAll(() => {
        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    describe('parseCSV', () => {
        test('should parse valid CSV file', async () => {
            const csvContent = `name,role,department
John Doe,Developer,Computer Science
Jane Smith,Designer,Information Technology`;
            
            const csvPath = path.join(testDir, 'test.csv');
            fs.writeFileSync(csvPath, csvContent);
            
            const result = await FileParser.parseCSV(csvPath);
            
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                name: 'John Doe',
                role: 'Developer', 
                department: 'Computer Science'
            });
            expect(result[1]).toEqual({
                name: 'Jane Smith',
                role: 'Designer',
                department: 'Information Technology'
            });
        });

        test('should handle empty CSV file', async () => {
            const csvPath = path.join(testDir, 'empty.csv');
            fs.writeFileSync(csvPath, '');
            
            const result = await FileParser.parseCSV(csvPath);
            expect(result).toHaveLength(0);
        });
    });

    describe('parseJSON', () => {
        test('should parse valid JSON array', async () => {
            const jsonContent = `[
                {"title": "Project 1", "description": "Test project"},
                {"title": "Project 2", "description": "Another test project"}
            ]`;
            
            const jsonPath = path.join(testDir, 'test.json');
            fs.writeFileSync(jsonPath, jsonContent);
            
            const result = await FileParser.parseJSON(jsonPath);
            
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Project 1');
            expect(result[1].title).toBe('Project 2');
        });

        test('should handle single JSON object', async () => {
            const jsonContent = `{"title": "Single Project", "description": "Test project"}`;
            
            const jsonPath = path.join(testDir, 'single.json');
            fs.writeFileSync(jsonPath, jsonContent);
            
            const result = await FileParser.parseJSON(jsonPath);
            
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Single Project');
        });

        test('should throw error for invalid JSON', async () => {
            const jsonPath = path.join(testDir, 'invalid.json');
            fs.writeFileSync(jsonPath, '{invalid json}');
            
            await expect(FileParser.parseJSON(jsonPath)).rejects.toThrow('JSON parsing error');
        });
    });

    describe('validateMemberData', () => {
        test('should validate and clean member data', () => {
            const memberData = {
                name: 'John Doe',
                role: 'Developer',
                department: 'Computer Science',
                year: '3rd Year',
                bio: 'Full-stack developer',
                skills: 'JavaScript,React,Node.js',
                github: 'johndoe'
            };
            
            const result = FileParser.validateMemberData(memberData);
            
            expect(result.name).toBe('John Doe');
            expect(result.role).toBe('Developer');
            expect(result.skills).toEqual(['JavaScript', 'React', 'Node.js']);
            expect(result.social.github).toBe('johndoe');
            expect(result.position).toBe('Member'); // default value
        });

        test('should handle case variations in field names', () => {
            const memberData = {
                Name: 'Jane Smith',
                Role: 'Designer',
                Department: 'IT',
                Year: '2nd Year',
                Bio: 'UI/UX Designer',
                Skills: 'Figma;Adobe XD',
                LinkedIn: 'janesmith'
            };
            
            const result = FileParser.validateMemberData(memberData);
            
            expect(result.name).toBe('Jane Smith');
            expect(result.role).toBe('Designer');
            expect(result.skills).toEqual(['Figma', 'Adobe XD']);
            expect(result.social.linkedin).toBe('janesmith');
        });
    });

    describe('validateProjectData', () => {
        test('should validate and clean project data', () => {
            const projectData = {
                title: 'Test Project',
                description: 'A test project',
                category: 'Web Development',
                technologies: 'React,Node.js,MongoDB',
                status: 'in-progress',
                featured: 'true'
            };
            
            const result = FileParser.validateProjectData(projectData);
            
            expect(result.title).toBe('Test Project');
            expect(result.category).toBe('Web Development');
            expect(result.technologies).toEqual(['React', 'Node.js', 'MongoDB']);
            expect(result.featured).toBe(true);
            expect(result.status).toBe('in-progress');
        });
    });

    describe('validateEventData', () => {
        test('should validate and clean event data', () => {
            const eventData = {
                title: 'Tech Workshop',
                description: 'React.js workshop',
                category: 'Workshop',
                date: '2025-08-15',
                time: '10:00 AM',
                venue: 'Computer Lab',
                organizer: 'Coding Club',
                capacity: '50'
            };
            
            const result = FileParser.validateEventData(eventData);
            
            expect(result.title).toBe('Tech Workshop');
            expect(result.category).toBe('Workshop');
            expect(result.venue).toBe('Computer Lab');
            expect(result.capacity).toBe(50);
            expect(result.date).toBeInstanceOf(Date);
        });

        test('should handle invalid date gracefully', () => {
            const eventData = {
                title: 'Test Event',
                description: 'Test event',
                category: 'Workshop',
                date: 'invalid-date',
                venue: 'Test Venue',
                organizer: 'Test Org'
            };
            
            const result = FileParser.validateEventData(eventData);
            
            expect(result.date).toBeInstanceOf(Date);
            // Should default to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(result.date.getDate()).toBe(tomorrow.getDate());
        });
    });

    describe('parseArrayField', () => {
        test('should parse comma-separated string', () => {
            const result = FileParser.parseArrayField('React,Node.js,MongoDB');
            expect(result).toEqual(['React', 'Node.js', 'MongoDB']);
        });

        test('should parse semicolon-separated string', () => {
            const result = FileParser.parseArrayField('React;Node.js;MongoDB');
            expect(result).toEqual(['React', 'Node.js', 'MongoDB']);
        });

        test('should return empty array for empty string', () => {
            const result = FileParser.parseArrayField('');
            expect(result).toEqual([]);
        });

        test('should return array as-is', () => {
            const input = ['React', 'Node.js'];
            const result = FileParser.parseArrayField(input);
            expect(result).toEqual(input);
        });
    });

    describe('parseBooleanField', () => {
        test('should parse boolean strings correctly', () => {
            expect(FileParser.parseBooleanField('true')).toBe(true);
            expect(FileParser.parseBooleanField('yes')).toBe(true);
            expect(FileParser.parseBooleanField('1')).toBe(true);
            expect(FileParser.parseBooleanField('false')).toBe(false);
            expect(FileParser.parseBooleanField('no')).toBe(false);
            expect(FileParser.parseBooleanField('0')).toBe(false);
        });

        test('should return default value for invalid input', () => {
            expect(FileParser.parseBooleanField('invalid', true)).toBe(true);
            expect(FileParser.parseBooleanField('invalid', false)).toBe(false);
        });
    });
});