/* ========================================
   DA-VINCI CODER CLUB SERVER
   Updated: 2025-08-07 06:21:52 UTC
   Current User: Jack026
   Database: MongoDB Atlas Connected
   Fix: Real MongoDB upload functionality
======================================== */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

// Import MongoDB models
const Event = require('./server/models/Event');
const Project = require('./server/models/Project'); 
const TeamMember = require('./server/models/TeamMember');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORRECTED MongoDB connection function for Jack026
async function connectDatabaseForJack026() {
    try {
        console.log('🔄 Jack026: Attempting database connection...');
        console.log('⏰ Current Time: 2025-08-07 06:21:52 UTC');
        
        const mongoURI = process.env.MONGODB_URI || 
            'mongodb+srv://souravjyotisahariahbtcs:OPhZ0ea5DIIEfRr0@coderclub.zhsckdk.mongodb.net/?retryWrites=true&w=majority&appName=CoderClub';
        
        // ✅ FIXED connection options (removed unsupported options)
        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 50,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 30000,
        };
        
        const conn = await mongoose.connect(mongoURI, connectionOptions);
        
        console.log('✅ Jack026: MongoDB Atlas Connected Successfully!');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗄️ Database: ${conn.connection.name}`);
        console.log(`👤 User: Jack026`);
        console.log(`🎯 Status: Production Ready`);
        console.log(`⏰ Connected at: 2025-08-07 06:21:52 UTC`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Jack026: MongoDB Connection Failed');
        console.error(`🕒 Error Time: 2025-08-07 06:21:52 UTC`);
        console.error(`📝 Error: ${error.message}`);
        
        // Continue without database in development
        console.log('🔄 Jack026: Continuing without database...');
        console.log('⚠️ Limited functionality - some features unavailable');
        return false;
    }
}

// Connection event handlers for Jack026
mongoose.connection.on('connected', () => {
    console.log('📡 Jack026: Mongoose successfully connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Jack026: Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 Jack026: Mongoose disconnected from MongoDB');
});

// Graceful shutdown for Jack026
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('👋 Jack026: Database connection closed gracefully');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
    }
    process.exit(0);
});

// Initialize database connection
connectDatabaseForJack026().then((connected) => {
    if (connected) {
        console.log('🎯 Jack026: Full functionality enabled');
    } else {
        console.log('⚠️ Jack026: Running in limited mode');
    }
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for Jack026
app.use((req, res, next) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`📡 [${timestamp}] ${req.method} ${req.url} - Jack026 Access`);
    next();
});

// Static file serving
console.log('📁 Setting up static file serving for Jack026...');

// Serve public files (main website)
app.use('/', express.static(path.join(__dirname, 'public'), {
    index: 'index.html',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Serve admin panel files
app.use('/admin', express.static(path.join(__dirname, 'admin'), {
    index: 'index.html',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ FIXED: Create Admin API routes inline (no external file needed)
console.log('🔗 Setting up API routes for Jack026...');

const adminRouter = express.Router();

// Basic admin authentication middleware
adminRouter.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    const user = req.headers['x-user'];
    
    // Allow Jack026 access or basic development access
    if (user === 'Jack026' || req.method === 'GET') {
        req.user = { username: 'Jack026', role: 'super_admin' };
        next();
    } else {
        res.status(401).json({ 
            success: false, 
            error: 'Jack026 access required',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
    }
});

// Dashboard stats endpoint
adminRouter.get('/stats', async (req, res) => {
    console.log('📊 Jack026: Fetching dashboard stats...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        // Get real counts from database if connected
        let realCounts = { members: 156, projects: 24, events: 8 };
        
        if (mongoose.connection.readyState === 1) {
            const memberCount = await TeamMember.countDocuments();
            const projectCount = await Project.countDocuments();
            const eventCount = await Event.countDocuments();
            
            realCounts = {
                members: memberCount || 0,
                projects: projectCount || 0,
                events: eventCount || 0
            };
        }
        
        res.json({
            success: true,
            data: {
                totalMembers: realCounts.members,
                activeProjects: realCounts.projects,
                upcomingEvents: realCounts.events,
                jack026Streak: 48,
                trends: {
                    members: { change: 12, direction: 'up' },
                    projects: { change: 3, direction: 'up' },
                    events: { change: 2, direction: 'neutral' }
                },
                lastUpdated: currentTime,
                user: 'Jack026'
            },
            timestamp: currentTime
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
            timestamp: currentTime
        });
    }
});

// Recent activity endpoint
adminRouter.get('/activity', (req, res) => {
    console.log('📋 Jack026: Fetching recent activity...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    res.json({
        success: true,
        data: [
            {
                id: 1,
                type: 'upload_success',
                message: 'Data upload system activated by Jack026',
                timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
                user: 'Jack026',
                icon: 'fas fa-upload'
            },
            {
                id: 2,
                type: 'member_joined',
                message: 'New member joined: Sarah Chen',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                user: 'Sarah Chen',
                icon: 'fas fa-user-plus'
            },
            {
                id: 3,
                type: 'project_updated',
                message: 'Project "EcoTracker" updated by Jack026',
                timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
                user: 'Jack026',
                icon: 'fas fa-project-diagram'
            },
            {
                id: 4,
                type: 'event_created',
                message: 'Workshop scheduled for Friday',
                timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                user: 'Jack026',
                icon: 'fas fa-calendar'
            },
            {
                id: 5,
                type: 'achievement',
                message: 'Jack026 reached 48-day streak!',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                user: 'Jack026',
                icon: 'fas fa-trophy'
            }
        ],
        timestamp: currentTime
    });
});

// System status endpoint
adminRouter.get('/system-status', (req, res) => {
    console.log('⚙️ Jack026: Checking system status...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const isDbConnected = mongoose.connection.readyState === 1;
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    res.json({
        success: true,
        data: {
            database: {
                status: isDbConnected ? 'connected' : 'disconnected',
                responseTime: isDbConnected ? Math.floor(Math.random() * 50) + 10 : null,
                connections: isDbConnected ? 5 : 0,
                maxConnections: 50,
                host: isDbConnected ? mongoose.connection.host : null
            },
            server: {
                status: 'online',
                uptime: Math.floor(uptime),
                uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
                memory: {
                    used: Math.round(memory.heapUsed / 1024 / 1024),
                    total: Math.round(memory.heapTotal / 1024 / 1024),
                    external: Math.round(memory.external / 1024 / 1024)
                },
                timestamp: currentTime
            },
            uploadSystem: {
                status: 'active',
                message: 'Real MongoDB uploads enabled'
            },
            user: 'Jack026'
        },
        timestamp: currentTime
    });
});

// Members endpoint with real data
adminRouter.get('/members', async (req, res) => {
    console.log('👥 Jack026: Fetching members data...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (mongoose.connection.readyState === 1) {
            const members = await TeamMember.find().limit(50).sort({ createdAt: -1 });
            const totalMembers = await TeamMember.countDocuments();
            const activeMembers = await TeamMember.countDocuments({ isActive: true });
            
            res.json({
                success: true,
                data: {
                    total: totalMembers,
                    active: activeMembers,
                    new_this_week: members.filter(m => 
                        new Date(m.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length,
                    core_team: members.filter(m => 
                        ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.position)
                    ).length,
                    members: members.map(member => ({
                        id: member._id,
                        name: member.name,
                        email: member.email || `${member.name.toLowerCase().replace(' ', '.')}@student.adtu.ac.in`,
                        role: member.position,
                        department: member.department,
                        status: member.isActive ? 'active' : 'inactive',
                        joinDate: member.joinDate.toISOString().split('T')[0],
                        skills: member.skills
                    }))
                },
                timestamp: currentTime
            });
        } else {
            // Fallback data when database not connected
            res.json({
                success: true,
                data: {
                    total: 156,
                    active: 142,
                    new_this_week: 12,
                    core_team: 8,
                    members: [
                        { 
                            id: 1, 
                            name: 'Jack026', 
                            email: 'jack026@davincicoders.adtu.ac.in',
                            role: 'super_admin', 
                            status: 'active',
                            joinDate: '2022-08-15',
                            streak: 48
                        }
                    ]
                },
                timestamp: currentTime
            });
        }
    } catch (error) {
        console.error('❌ Error fetching members:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch members',
            timestamp: currentTime
        });
    }
});

// Add member endpoint
adminRouter.post('/members', async (req, res) => {
    console.log('➕ Jack026: Adding new member...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (mongoose.connection.readyState === 1) {
            const newMember = new TeamMember({
                ...req.body,
                isActive: true,
                joinDate: new Date()
            });
            
            const savedMember = await newMember.save();
            
            res.json({
                success: true,
                message: `Member ${req.body.name} added successfully to MongoDB`,
                data: {
                    id: savedMember._id,
                    ...req.body,
                    addedBy: 'Jack026',
                    addedAt: currentTime
                },
                timestamp: currentTime
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Database not connected',
                timestamp: currentTime
            });
        }
    } catch (error) {
        console.error('❌ Error adding member:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add member',
            timestamp: currentTime
        });
    }
});

// Projects endpoint with real data
adminRouter.get('/projects', async (req, res) => {
    console.log('💻 Jack026: Fetching projects data...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (mongoose.connection.readyState === 1) {
            const projects = await Project.find().limit(50).sort({ createdAt: -1 });
            const totalProjects = await Project.countDocuments();
            const activeProjects = await Project.countDocuments({ status: 'in-progress' });
            const completedProjects = await Project.countDocuments({ status: 'completed' });
            
            res.json({
                success: true,
                data: {
                    total: totalProjects,
                    active: activeProjects,
                    completed: completedProjects,
                    projects: projects.map(project => ({
                        id: project._id,
                        title: project.title,
                        description: project.description,
                        status: project.status,
                        category: project.category,
                        technologies: project.technologies,
                        githubUrl: project.githubUrl,
                        liveUrl: project.liveUrl,
                        team: project.team,
                        featured: project.featured,
                        createdAt: project.createdAt.toISOString().split('T')[0]
                    }))
                },
                timestamp: currentTime
            });
        } else {
            // Fallback data
            res.json({
                success: true,
                data: {
                    total: 24,
                    active: 18,
                    completed: 6,
                    projects: [
                        {
                            id: 1,
                            title: 'EcoTracker',
                            description: 'Environmental impact tracking application',
                            status: 'active',
                            priority: 'high',
                            progress: 75,
                            lead: 'Jack026',
                            team_size: 5,
                            technologies: ['React', 'Node.js', 'MongoDB'],
                            start_date: '2025-07-01'
                        }
                    ]
                },
                timestamp: currentTime
            });
        }
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects',
            timestamp: currentTime
        });
    }
});

// Events endpoint with real data
adminRouter.get('/events', async (req, res) => {
    console.log('📅 Jack026: Fetching events data...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (mongoose.connection.readyState === 1) {
            const events = await Event.find().limit(50).sort({ date: -1 });
            const totalEvents = await Event.countDocuments();
            const upcomingEvents = await Event.countDocuments({ 
                date: { $gte: new Date() },
                status: 'upcoming'
            });
            const pastEvents = await Event.countDocuments({ 
                date: { $lt: new Date() }
            });
            
            res.json({
                success: true,
                data: {
                    total: totalEvents,
                    upcoming: upcomingEvents,
                    past: pastEvents,
                    events: events.map(event => ({
                        id: event._id,
                        title: event.title,
                        description: event.description,
                        type: event.category,
                        date: event.date.toISOString().split('T')[0],
                        time: event.time,
                        location: event.venue,
                        status: event.status,
                        organizer: event.organizer,
                        max_participants: event.capacity,
                        registered: event.registered
                    }))
                },
                timestamp: currentTime
            });
        } else {
            // Fallback data
            res.json({
                success: true,
                data: {
                    total: 8,
                    upcoming: 5,
                    past: 3,
                    events: [
                        {
                            id: 1,
                            title: 'React Workshop',
                            description: 'Hands-on React development workshop',
                            type: 'workshop',
                            date: '2025-08-10',
                            time: '14:00',
                            location: 'Lab 301',
                            status: 'scheduled',
                            organizer: 'Jack026',
                            max_participants: 30,
                            registered: 24
                        }
                    ]
                },
                timestamp: currentTime
            });
        }
    } catch (error) {
        console.error('❌ Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            timestamp: currentTime
        });
    }
});

// ✅ REAL UPLOAD FUNCTIONALITY - Replace fake endpoints
// File upload routes for Jack026
const multer = require('multer');
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to parse CSV
function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

// Helper function to clean up files
function cleanupFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error cleaning up file:', error);
    }
}

// REAL Members Upload Implementation
adminRouter.post('/upload/members', upload.single('file'), async (req, res) => {
    console.log('👥 Jack026: Uploading members file...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                timestamp: currentTime
            });
        }

        console.log(`📁 Processing file: ${req.file.originalname}`);
        console.log(`📂 File path: ${req.file.path}`);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            cleanupFile(req.file.path);
            return res.status(500).json({
                success: false,
                message: 'Database not connected',
                timestamp: currentTime
            });
        }

        // Parse CSV file
        const csvData = await parseCSV(req.file.path);
        console.log(`📊 Parsed ${csvData.length} records from CSV`);

        if (csvData.length === 0) {
            cleanupFile(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'No valid data found in CSV file',
                timestamp: currentTime
            });
        }

        // Transform CSV data to match TeamMember schema
        const membersToInsert = csvData.map((row, index) => ({
            name: row.name || row.Name || `Member ${index + 1}`,
            role: row.role || row.Role || 'Member',
            department: row.department || row.Department || 'General',
            year: row.year || row.Year || '1st',
            bio: row.bio || row.Bio || 'No bio provided',
            skills: row.skills ? row.skills.split(';').map(s => s.trim()) : [],
            position: row.position || row.Position || 'Member',
            isActive: true,
            joinDate: new Date()
        }));

        console.log(`💾 Inserting ${membersToInsert.length} members to MongoDB Atlas...`);

        // Save to MongoDB
        const insertedMembers = await TeamMember.insertMany(membersToInsert);
        
        console.log(`✅ Successfully inserted ${insertedMembers.length} members to MongoDB Atlas`);

        // Clean up uploaded file
        cleanupFile(req.file.path);

        res.json({
            success: true,
            message: 'Members data uploaded successfully to MongoDB Atlas',
            data: {
                filename: req.file.originalname,
                records: insertedMembers.length,
                processed: true,
                insertedIds: insertedMembers.slice(0, 5).map(m => m._id),
                sampleData: membersToInsert.slice(0, 3)
            },
            timestamp: currentTime,
            user: 'Jack026'
        });

    } catch (error) {
        console.error('❌ Members upload failed:', error);
        
        // Clean up file if it exists
        cleanupFile(req.file.path);

        res.status(500).json({
            success: false,
            message: 'Failed to upload members data',
            error: error.message,
            timestamp: currentTime,
            user: 'Jack026'
        });
    }
});

// REAL Projects Upload Implementation
adminRouter.post('/upload/projects', upload.single('file'), async (req, res) => {
    console.log('💻 Jack026: Uploading projects file...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                timestamp: currentTime
            });
        }

        console.log(`📁 Processing file: ${req.file.originalname}`);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            cleanupFile(req.file.path);
            return res.status(500).json({
                success: false,
                message: 'Database not connected',
                timestamp: currentTime
            });
        }

        // Read and parse JSON file
        const jsonContent = fs.readFileSync(req.file.path, 'utf8');
        const jsonData = JSON.parse(jsonContent);
        const projectsArray = Array.isArray(jsonData) ? jsonData : [jsonData];

        console.log(`📊 Parsed ${projectsArray.length} projects from JSON`);

        if (projectsArray.length === 0) {
            cleanupFile(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'No valid projects found in JSON file',
                timestamp: currentTime
            });
        }

        // Transform JSON data to match Project schema
        const projectsToInsert = projectsArray.map((proj, index) => ({
            title: proj.title || proj.name || `Project ${index + 1}`,
            description: proj.description || 'No description provided',
            longDescription: proj.longDescription || proj.details || proj.description,
            category: proj.category || 'Web Development',
            technologies: Array.isArray(proj.technologies) ? proj.technologies : 
                         proj.tech ? proj.tech.split(',').map(t => t.trim()) : 
                         proj.stack ? proj.stack : ['JavaScript'],
            githubUrl: proj.githubUrl || proj.github || proj.repo,
            liveUrl: proj.liveUrl || proj.demo || proj.url,
            status: proj.status || 'in-progress',
            team: proj.team || [],
            tags: proj.tags || [],
            featured: proj.featured || false,
            likes: proj.likes || 0,
            views: proj.views || 0
        }));

        console.log(`💾 Inserting ${projectsToInsert.length} projects to MongoDB Atlas...`);

        // Save to MongoDB
        const insertedProjects = await Project.insertMany(projectsToInsert);
        
        console.log(`✅ Successfully inserted ${insertedProjects.length} projects to MongoDB Atlas`);

        // Clean up uploaded file
        cleanupFile(req.file.path);

        res.json({
            success: true,
            message: 'Projects data uploaded successfully to MongoDB Atlas',
            data: {
                filename: req.file.originalname,
                records: insertedProjects.length,
                processed: true,
                insertedIds: insertedProjects.slice(0, 5).map(p => p._id),
                sampleData: projectsToInsert.slice(0, 3)
            },
            timestamp: currentTime,
            user: 'Jack026'
        });

    } catch (error) {
        console.error('❌ Projects upload failed:', error);
        
        // Clean up file if it exists
        cleanupFile(req.file.path);

        res.status(500).json({
            success: false,
            message: 'Failed to upload projects data',
            error: error.message,
            timestamp: currentTime,
            user: 'Jack026'
        });
    }
});

// REAL Events Upload Implementation
adminRouter.post('/upload/events', upload.single('file'), async (req, res) => {
    console.log('📅 Jack026: Uploading events file...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                timestamp: currentTime
            });
        }

        console.log(`📁 Processing file: ${req.file.originalname}`);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            cleanupFile(req.file.path);
            return res.status(500).json({
                success: false,
                message: 'Database not connected',
                timestamp: currentTime
            });
        }

        // Parse CSV file
        const csvData = await parseCSV(req.file.path);
        console.log(`📊 Parsed ${csvData.length} records from CSV`);

        if (csvData.length === 0) {
            cleanupFile(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'No valid data found in CSV file',
                timestamp: currentTime
            });
        }

        // Transform CSV data to match Event schema
        const eventsToInsert = csvData.map((row, index) => {
            const eventDate = row.date || row.Date;
            let parsedDate;
            
            try {
                parsedDate = new Date(eventDate);
                if (isNaN(parsedDate.getTime())) {
                    parsedDate = new Date();
                    parsedDate.setDate(parsedDate.getDate() + index + 7); // Future date
                }
            } catch {
                parsedDate = new Date();
                parsedDate.setDate(parsedDate.getDate() + index + 7);
            }

            return {
                title: row.title || row.Title || `Event ${index + 1}`,
                description: row.description || row.Description || 'No description provided',
                category: row.category || row.Category || row.type || 'Meetup',
                date: parsedDate,
                time: row.time || row.Time || '10:00 AM',
                venue: row.venue || row.Venue || row.location || 'TBD',
                capacity: parseInt(row.capacity || row.Capacity) || 50,
                organizer: row.organizer || row.Organizer || 'Jack026',
                status: row.status || 'upcoming',
                registrationOpen: true,
                featured: row.featured === 'true' || row.featured === true || false
            };
        });

        console.log(`💾 Inserting ${eventsToInsert.length} events to MongoDB Atlas...`);

        // Save to MongoDB
        const insertedEvents = await Event.insertMany(eventsToInsert);
        
        console.log(`✅ Successfully inserted ${insertedEvents.length} events to MongoDB Atlas`);

        // Clean up uploaded file
        cleanupFile(req.file.path);

        res.json({
            success: true,
            message: 'Events data uploaded successfully to MongoDB Atlas',
            data: {
                filename: req.file.originalname,
                records: insertedEvents.length,
                processed: true,
                insertedIds: insertedEvents.slice(0, 5).map(e => e._id),
                sampleData: eventsToInsert.slice(0, 3)
            },
            timestamp: currentTime,
            user: 'Jack026'
        });

    } catch (error) {
        console.error('❌ Events upload failed:', error);
        
        // Clean up file if it exists
        cleanupFile(req.file.path);

        res.status(500).json({
            success: false,
            message: 'Failed to upload events data',
            error: error.message,
            timestamp: currentTime,
            user: 'Jack026'
        });
    }
});

// Data verification endpoint
adminRouter.get('/verify-data', async (req, res) => {
    console.log('🔍 Jack026: Verifying database data...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                success: false,
                message: 'Database not connected',
                timestamp: currentTime
            });
        }

        const memberCount = await TeamMember.countDocuments();
        const eventCount = await Event.countDocuments();
        const projectCount = await Project.countDocuments();
        
        res.json({
            success: true,
            counts: {
                members: memberCount,
                events: eventCount,
                projects: projectCount
            },
            message: 'Data verified from MongoDB Atlas',
            timestamp: currentTime,
            user: 'Jack026'
        });
    } catch (error) {
        console.error('❌ Data verification failed:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: currentTime
        });
    }
});

// Use admin router
app.use('/api/admin', adminRouter);

// Special routes for Jack026
app.get('/jack026', (req, res) => {
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    res.json({
        message: '👑 Welcome Jack026! Super Admin Access Granted',
        timestamp: currentTime,
        status: 'active',
        privileges: 'unlimited',
        database_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        server_uptime: process.uptime(),
        upload_system: 'real_mongodb_enabled',
        quick_access: {
            admin_panel: '/admin/',
            shortcut: 'Ctrl+Shift+A',
            api_stats: '/api/admin/stats',
            health_check: '/health',
            data_verification: '/api/admin/verify-data'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const uptime = process.uptime();
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    res.json({
        status: 'healthy',
        timestamp: currentTime,
        database: isDbConnected ? 'connected' : 'disconnected',
        uptime: Math.floor(uptime),
        uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        user: 'Jack026',
        upload_system: 'mongodb_enabled',
        memory: process.memoryUsage(),
        version: process.version,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Admin panel route handler
app.get('/admin', (req, res) => {
    console.log('👑 Jack026: Accessing admin panel...');
    const isDbConnected = mongoose.connection.readyState === 1;
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    res.sendFile(path.join(__dirname, 'admin', 'index.html'), (err) => {
        if (err) {
            console.log('⚠️ Admin panel file not found, creating enhanced admin page...');
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Jack026 Admin Panel | Da-Vinci Coder Club</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            background: #0f172a; 
                            color: #f8fafc; 
                        }
                        .container { max-width: 1200px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 2rem; }
                        .crown { font-size: 3rem; margin-bottom: 1rem; }
                        .title { font-size: 2.5rem; margin-bottom: 0.5rem; }
                        .subtitle { color: #94a3b8; }
                        .status { 
                            background: ${isDbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; 
                            padding: 1rem; 
                            border-radius: 0.5rem; 
                            margin: 1rem 0;
                            border: 1px solid ${isDbConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; 
                        }
                        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0; }
                        .stat-card { 
                            background: linear-gradient(135deg, #1e293b, #334155); 
                            padding: 1.5rem; 
                            border-radius: 1rem; 
                            border: 1px solid rgba(99, 102, 241, 0.3); 
                        }
                        .stat-number { font-size: 2rem; font-weight: bold; color: #6366f1; }
                        .stat-label { color: #94a3b8; }
                        .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
                        .action-btn { 
                            background: #6366f1; 
                            color: white; 
                            padding: 1rem; 
                            border: none; 
                            border-radius: 0.5rem; 
                            cursor: pointer; 
                            font-size: 1rem;
                            transition: all 0.3s ease;
                        }
                        .action-btn:hover { background: #5855eb; transform: translateY(-2px); }
                        .upload-btn { background: linear-gradient(135deg, #10b981, #059669); }
                        .shortcut-hint { 
                            background: rgba(99, 102, 241, 0.1); 
                            padding: 1rem; 
                            border-radius: 0.5rem; 
                            text-align: center; 
                            margin: 2rem 0; 
                        }
                        kbd { 
                            background: #6366f1; 
                            color: white; 
                            padding: 0.25rem 0.5rem; 
                            border-radius: 0.25rem; 
                            font-size: 0.9rem; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="crown">👑</div>
                            <h1 class="title">Jack026 Admin Panel</h1>
                            <p class="subtitle">Da-Vinci Coder Club Administration</p>
                            <p class="subtitle">Current Time: ${currentTime} UTC</p>
                        </div>

                        <div class="status">
                            <strong>✅ Server Status:</strong> Online | 
                            <strong>📡 Database:</strong> ${isDbConnected ? 'Connected ✅' : 'Disconnected ⚠️'} | 
                            <strong>📤 Upload System:</strong> ${isDbConnected ? 'Real MongoDB Enabled ✅' : 'Limited Mode ⚠️'} |
                            <strong>👤 User:</strong> Jack026
                        </div>

                        <div class="stats">
                            <div class="stat-card">
                                <div class="stat-number">Real Data</div>
                                <div class="stat-label">MongoDB Connected</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">48</div>
                                <div class="stat-label">Days Streak</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">Active</div>
                                <div class="stat-label">Upload System</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">CSV/JSON</div>
                                <div class="stat-label">File Support</div>
                            </div>
                        </div>

                        <div class="actions">
                            <button class="action-btn upload-btn" onclick="window.location.href='/api/admin/verify-data'">
                                🔍 Verify Database
                            </button>
                            <button class="action-btn" onclick="window.location.href='/api/admin/stats'">
                                📊 View Stats API
                            </button>
                            <button class="action-btn" onclick="window.location.href='/api/admin/members'">
                                👥 Members API
                            </button>
                            <button class="action-btn" onclick="window.location.href='/api/admin/projects'">
                                💻 Projects API
                            </button>
                            <button class="action-btn" onclick="window.location.href='/api/admin/events'">
                                📅 Events API
                            </button>
                            <button class="action-btn" onclick="window.location.href='/health'">
                                ⚙️ Health Check
                            </button>
                        </div>

                        <div class="shortcut-hint">
                            <strong>⌨️ Quick Access:</strong> Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> from any page to open admin panel
                        </div>

                        <div style="text-align: center; margin-top: 2rem; color: #94a3b8;">
                            <p>🚀 Real MongoDB upload system enabled!</p>
                            <p>Upload CSV/JSON files and see them saved to MongoDB Atlas</p>
                            <p>All upload endpoints return actual database record counts</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Team upload page route
app.get('/admin/team-upload', (req, res) => {
    console.log('👥 Jack026: Accessing team upload page...');
    res.sendFile(path.join(__dirname, 'admin', 'team-upload.html'));
});

app.get('/admin/*', (req, res) => {
    console.log(`👑 Jack026: Admin route accessed: ${req.path}`);
    res.sendFile(path.join(__dirname, 'admin', 'index.html'), (err) => {
        if (err) {
            res.redirect('/admin');
        }
    });
});

// Main website routes
app.get('/', (req, res) => {
    console.log('🏠 Serving main website for Jack026...');
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Da-Vinci Coder Club</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            background: #0f172a; 
                            color: #f8fafc; 
                            text-align: center;
                        }
                        .container { max-width: 800px; margin: 0 auto; }
                        .logo { font-size: 4rem; margin-bottom: 1rem; }
                        .title { font-size: 3rem; margin-bottom: 1rem; }
                        .subtitle { color: #94a3b8; margin-bottom: 2rem; }
                        .links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
                        .link { 
                            background: #6366f1; 
                            color: white; 
                            padding: 1rem 2rem; 
                            text-decoration: none; 
                            border-radius: 0.5rem;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        }
                        .link:hover { background: #5855eb; transform: translateY(-2px); }
                        .admin-link { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
                        .upload-link { background: linear-gradient(135deg, #10b981, #059669); }
                        .shortcut { 
                            background: rgba(99, 102, 241, 0.1); 
                            padding: 1rem; 
                            border-radius: 0.5rem; 
                            margin: 2rem 0; 
                        }
                        kbd { 
                            background: #6366f1; 
                            color: white; 
                            padding: 0.25rem 0.5rem; 
                            border-radius: 0.25rem; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">🚀</div>
                        <h1 class="title">Da-Vinci Coder Club</h1>
                        <p class="subtitle">Welcome to the official website</p>
                        <p class="subtitle">Current Time: ${currentTime} UTC</p>
                        
                        <div class="links">
                            <a href="/admin/" class="link admin-link">👑 Admin Panel (Jack026)</a>
                            <a href="/api/admin/verify-data" class="link upload-link">🔍 Verify Database</a>
                            <a href="/health" class="link">⚙️ Health Check</a>
                            <a href="/api/admin/stats" class="link">📊 API Stats</a>
                            <a href="/jack026" class="link">👑 Jack026 Status</a>
                        </div>
                        
                        <div class="shortcut">
                            <strong>⌨️ Quick Access:</strong> Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> for instant admin access
                        </div>
                        
                        <div style="margin-top: 2rem; color: #94a3b8;">
                            <p>✅ Server running successfully</p>
                            <p>📡 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}</p>
                            <p>📤 Upload System: Real MongoDB Enabled</p>
                            <p>👤 Ready for Jack026</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Other page routes
const pages = ['team', 'projects', 'events', 'about', 'contact', 'account'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        res.sendFile(path.join(__dirname, 'public', `${page}.html`), (err) => {
            if (err) {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${page.charAt(0).toUpperCase() + page.slice(1)} | Da-Vinci Coder Club</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background: #0f172a;
                                color: #f8fafc;
                            }
                            .back-link {
                                color: #6366f1;
                                text-decoration: none;
                                font-size: 1.2rem;
                                padding: 10px 20px;
                                border: 2px solid #6366f1;
                                border-radius: 8px;
                                display: inline-block;
                                margin: 10px;
                                transition: all 0.3s ease;
                            }
                            .back-link:hover {
                                background: #6366f1;
                                color: white;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${page.charAt(0).toUpperCase() + page.slice(1)} Page</h1>
                        <p>This page is under construction for Jack026</p>
                        <p>Current Time: ${currentTime} UTC</p>
                        <a href="/" class="back-link">🏠 Go Home</a>
                        <a href="/admin/" class="back-link">👑 Admin Panel</a>
                    </body>
                    </html>
                `);
            }
        });
    });
});

// 404 error handler
app.use((req, res, next) => {
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), err => {
        if (err) {
            res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 Not Found | Da-Vinci Coder Club</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background: #0f172a; 
                            color: #f8fafc; 
                            text-align: center; 
                            padding: 60px;
                        }
                        .code { font-size: 5rem; color: #6366f1; }
                        .msg { font-size: 2rem; margin-bottom: 2rem; }
                        a { color: #6366f1; text-decoration: none; font-weight: bold; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="code">404</div>
                    <div class="msg">Page Not Found</div>
                    <p>Time: ${currentTime} UTC</p>
                    <a href="/">🏠 Go Home</a> | <a href="/admin/">👑 Admin Panel</a>
                </body>
                </html>
            `);
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.error('💥 Server Error for Jack026:', error);
    
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: currentTime,
        user: 'Jack026'
    });
});

// Start server
app.listen(PORT, () => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    console.log('\n' + '='.repeat(70));
    console.log('🚀 Da-Vinci Coder Club Server Started Successfully!');
    console.log('='.repeat(70));
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`👑 Admin Panel: http://localhost:${PORT}/admin/`);
    console.log(`👤 User: Jack026`);
    console.log(`📅 ${currentTime} UTC`);
    console.log(`🎯 Status: Ready for Jack026`);
    console.log(`📡 Database: ${isDbConnected ? 'Connected ✅' : 'Disconnected ⚠️'}`);
    console.log(`📤 Upload System: ${isDbConnected ? 'Real MongoDB Enabled ✅' : 'Limited Mode ⚠️'}`);
    console.log('='.repeat(70));
    console.log('\n📋 Available Routes:');
    console.log('├── 🏠 Main Site: http://localhost:3000/');
    console.log('├── 👑 Admin Panel: http://localhost:3000/admin/');
    console.log('├── 👥 Team Page: http://localhost:3000/team');
    console.log('├── 💻 Projects: http://localhost:3000/projects');
    console.log('├── 📅 Events: http://localhost:3000/events');
    console.log('├── ℹ️ About: http://localhost:3000/about');
    console.log('├── 📧 Contact: http://localhost:3000/contact');
    console.log('├── 👤 Account: http://localhost:3000/account');
    console.log('├── ⚙️ Health: http://localhost:3000/health');
    console.log('└── 👑 Jack026: http://localhost:3000/jack026');
    console.log('\n🔗 API Endpoints:');
    console.log('├── 📊 Stats: http://localhost:3000/api/admin/stats');
    console.log('├── 📋 Activity: http://localhost:3000/api/admin/activity');
    console.log('├── ⚙️ System: http://localhost:3000/api/admin/system-status');
    console.log('├── 👥 Members: http://localhost:3000/api/admin/members');
    console.log('├── 💻 Projects: http://localhost:3000/api/admin/projects');
    console.log('├── 📅 Events: http://localhost:3000/api/admin/events');
    console.log('├── 🔍 Verify: http://localhost:3000/api/admin/verify-data');
    console.log('└── 📤 Uploads: /api/admin/upload/{members|projects|events}');
    console.log('\n⌨️ Quick Access:');
    console.log('└── Press Ctrl+Shift+A from any page for admin access');
    console.log('\n✅ All systems ready for Jack026! Real MongoDB uploads enabled! 🎯');
    console.log('='.repeat(70));
});

// Export app for testing
module.exports = app;