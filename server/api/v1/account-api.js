/* ========================================
   ACCOUNT BACKEND API SYSTEM
   Updated: 2025-08-06 14:03:20 UTC
   Built for: Jack026
   Current User: Jack026
======================================== */

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');
const redis = require('redis');
const WebSocket = require('ws');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Redis Client for Caching
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// WebSocket Server for Real-time Updates
const wss = new WebSocket.Server({ port: 8080 });

// Middleware Setup
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'https://davincicoders.adtu.ac.in'],
    credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const accountRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 900
    }
});

app.use('/api/account', accountRateLimit);

// MongoDB Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        fullName: { type: String },
        bio: { type: String, maxlength: 500 },
        avatar: { type: String },
        role: { type: String, default: 'member' },
        department: { type: String },
        year: { type: String },
        location: { type: String },
        website: { type: String },
        social: {
            github: { type: String },
            linkedin: { type: String },
            twitter: { type: String },
            discord: { type: String }
        }
    },
    stats: {
        totalContributions: { type: Number, default: 0 },
        totalProjects: { type: Number, default: 0 },
        menteesCount: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActivityDate: { type: Date, default: Date.now },
        codingHours: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 }
    },
    achievements: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
        category: { type: String },
        earnedDate: { type: Date },
        progress: { type: Number, default: 0 },
        total: { type: Number, default: 100 }
    }],
    projects: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ['planning', 'active', 'completed', 'paused'] },
        progress: { type: Number, default: 0 },
        technologies: [{ type: String }],
        repository: { type: String },
        featured: { type: Boolean, default: false },
        collaborators: [{ type: String }],
        createdDate: { type: Date, default: Date.now },
        lastUpdated: { type: Date, default: Date.now }
    }],
    activity: [{
        type: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        metadata: { type: Object }
    }],
    settings: {
        theme: { type: String, default: 'dark', enum: ['light', 'dark', 'auto'] },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            projects: { type: Boolean, default: true },
            achievements: { type: Boolean, default: true },
            collaborations: { type: Boolean, default: true }
        },
        privacy: {
            profileVisibility: { type: String, default: 'public', enum: ['public', 'members', 'private'] },
            showActivity: { type: Boolean, default: true },
            showStats: { type: Boolean, default: true }
        }
    },
    security: {
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: { type: String },
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date },
        passwordChangedAt: { type: Date, default: Date.now },
        sessions: [{
            sessionId: { type: String },
            ipAddress: { type: String },
            userAgent: { type: String },
            createdAt: { type: Date, default: Date.now },
            lastActivity: { type: Date, default: Date.now }
        }]
    },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: 'member', enum: ['member', 'core', 'leadership', 'admin'] }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual fields
userSchema.virtual('profile.fullName').get(function() {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

userSchema.virtual('isLocked').get(function() {
    return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
    // Hash password if modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.security.passwordChangedAt = new Date();
    }
    
    // Update full name
    if (this.isModified('profile.firstName') || this.isModified('profile.lastName')) {
        this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    }
    
    next();
});

// User model
const User = mongoose.model('User', userSchema);

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    event: { type: String, required: true, index: true },
    data: { type: Object },
    timestamp: { type: Date, default: Date.now, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    page: { type: String },
    referrer: { type: String }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// File Upload Configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password -security.twoFactorSecret');
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

// Jack026 Admin Middleware
const requireJack026Admin = (req, res, next) => {
    if (req.user.username !== 'Jack026' || req.user.role !== 'leadership') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Jack026 admin privileges required.'
        });
    }
    next();
};

// ==================== ACCOUNT API ROUTES ====================

// Get Jack026's Account Dashboard Data
app.get('/api/account/dashboard', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        
        // Cache key for dashboard data
        const cacheKey = `dashboard:${user._id}:${Date.now()}`;
        
        // Try to get from cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: JSON.parse(cachedData),
                cached: true,
                timestamp: '2025-08-06 14:03:20'
            });
        }
        
        // Generate dashboard data
        const dashboardData = {
            profile: {
                username: user.username,
                fullName: user.profile.fullName,
                avatar: user.profile.avatar,
                role: user.profile.role,
                bio: user.profile.bio,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen
            },
            stats: {
                totalContributions: user.stats.totalContributions,
                totalProjects: user.stats.totalProjects,
                menteesCount: user.stats.menteesCount,
                streakDays: user.stats.streakDays,
                longestStreak: user.stats.longestStreak,
                codingHours: user.stats.codingHours,
                rating: user.stats.rating,
                thisMonth: await getMonthlyStats(user._id)
            },
            recentActivity: await getRecentActivity(user._id, 10),
            achievements: user.achievements.filter(a => a.earnedDate).slice(-5),
            projects: user.projects.filter(p => p.status === 'active').slice(0, 3),
            notifications: await getUnreadNotifications(user._id),
            skills: await getUserSkills(user._id),
            contributionData: await getContributionData(user._id)
        };
        
        // Cache for 5 minutes
        await redisClient.setex(cacheKey, 300, JSON.stringify(dashboardData));
        
        res.json({
            success: true,
            data: dashboardData,
            timestamp: '2025-08-06 14:03:20'
        });
        
        // Track dashboard view
        await trackAnalytics(user._id, req.sessionID, 'dashboard_viewed', {
            timestamp: '2025-08-06 14:03:20'
        }, req);
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load dashboard data'
        });
    }
});

// Update Jack026's Profile
app.put('/api/account/profile', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const updates = req.body;
        
        // Validate allowed fields
        const allowedFields = [
            'profile.firstName',
            'profile.lastName',
            'profile.bio',
            'profile.department',
            'profile.year',
            'profile.location',
            'profile.website',
            'profile.social'
        ];
        
        const updateObj = {};
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                updateObj[key] = updates[key];
            }
        });
        
        // Special handling for Jack026
        if (user.username === 'Jack026') {
            updateObj['profile.role'] = updates['profile.role'] || 'Lead Developer & Club President';
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateObj },
            { new: true, runValidators: true }
        ).select('-password -security.twoFactorSecret');
        
        // Clear cache
        await clearUserCache(user._id);
        
        // Track activity
        await addActivity(user._id, 'profile_updated', 'Updated profile information', {
            updatedFields: Object.keys(updateObj)
        });
        
        // Broadcast update to connected clients
        broadcastToUser(user._id, {
            type: 'profile_updated',
            data: updatedUser.profile
        });
        
        res.json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});

// Upload Avatar
app.post('/api/account/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const { user } = req;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }
        
        // Process image with Sharp
        const processedImage = await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toBuffer();
        
        // Generate filename
        const filename = `avatar_${user._id}_${Date.now()}.jpg`;
        const avatarPath = `/uploads/avatars/${filename}`;
        
        // Save to filesystem (in production, use cloud storage)
        const fs = require('fs').promises;
        const path = require('path');
        const uploadsDir = path.join(__dirname, 'public/uploads/avatars');
        
        // Ensure directory exists
        await fs.mkdir(uploadsDir, { recursive: true });
        
        // Write file
        await fs.writeFile(path.join(uploadsDir, filename), processedImage);
        
        // Update user avatar
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { 'profile.avatar': avatarPath },
            { new: true }
        ).select('-password -security.twoFactorSecret');
        
        // Clear cache
        await clearUserCache(user._id);
        
        // Track activity
        await addActivity(user._id, 'avatar_updated', 'Updated profile picture');
        
        res.json({
            success: true,
            data: {
                avatar: avatarPath,
                user: updatedUser
            },
            message: 'Avatar updated successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload avatar'
        });
    }
});

// Get Jack026's Activity Feed
app.get('/api/account/activity', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { page = 1, limit = 20, type } = req.query;
        
        const query = { userId: user._id };
        if (type) query.type = type;
        
        const activities = await getActivityFeed(user._id, {
            page: parseInt(page),
            limit: parseInt(limit),
            type
        });
        
        // Get activity analytics
        const analytics = await getActivityAnalytics(user._id);
        
        res.json({
            success: true,
            data: {
                activities,
                analytics,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    hasNext: activities.length === parseInt(limit)
                }
            },
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Activity feed error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load activity feed'
        });
    }
});

// Update Jack026's Projects
app.post('/api/account/projects', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const projectData = req.body;
        
        // Validate project data
        const requiredFields = ['title', 'description', 'status'];
        const missingFields = requiredFields.filter(field => !projectData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Create new project
        const newProject = {
            id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: projectData.title,
            description: projectData.description,
            status: projectData.status,
            progress: projectData.progress || 0,
            technologies: projectData.technologies || [],
            repository: projectData.repository,
            featured: user.username === 'Jack026' ? projectData.featured : false,
            collaborators: projectData.collaborators || [],
            createdDate: new Date(),
            lastUpdated: new Date()
        };
        
        // Add to user's projects
        await User.findByIdAndUpdate(
            user._id,
            { 
                $push: { projects: newProject },
                $inc: { 'stats.totalProjects': 1 }
            }
        );
        
        // Clear cache
        await clearUserCache(user._id);
        
        // Track activity
        await addActivity(user._id, 'project_created', `Created new project: ${newProject.title}`, {
            projectId: newProject.id,
            status: newProject.status
        });
        
        // Check for achievements
        await checkProjectAchievements(user._id);
        
        res.json({
            success: true,
            data: newProject,
            message: 'Project created successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Project creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create project'
        });
    }
});

// Update Project Status
app.put('/api/account/projects/:projectId', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { projectId } = req.params;
        const updates = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, 'projects.id': projectId },
            {
                $set: {
                    'projects.$.title': updates.title,
                    'projects.$.description': updates.description,
                    'projects.$.status': updates.status,
                    'projects.$.progress': updates.progress,
                    'projects.$.technologies': updates.technologies,
                    'projects.$.lastUpdated': new Date()
                }
            },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        
        const updatedProject = updatedUser.projects.find(p => p.id === projectId);
        
        // Clear cache
        await clearUserCache(user._id);
        
        // Track activity
        await addActivity(user._id, 'project_updated', `Updated project: ${updatedProject.title}`, {
            projectId,
            changes: Object.keys(updates)
        });
        
        // Check for completion achievements
        if (updates.status === 'completed' && updates.progress === 100) {
            await checkProjectAchievements(user._id);
            await addActivity(user._id, 'project_completed', `Completed project: ${updatedProject.title}`, {
                projectId
            });
        }
        
        // Broadcast update
        broadcastToUser(user._id, {
            type: 'project_updated',
            data: updatedProject
        });
        
        res.json({
            success: true,
            data: updatedProject,
            message: 'Project updated successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Project update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update project'
        });
    }
});

// Get Jack026's Achievements
app.get('/api/account/achievements', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        
        // Get user achievements
        const userAchievements = user.achievements;
        
        // Get available achievements
        const availableAchievements = await getAvailableAchievements();
        
        // Calculate progress for locked achievements
        const achievementsWithProgress = await calculateAchievementProgress(user._id, availableAchievements);
        
        // Get achievement statistics
        const stats = {
            total: availableAchievements.length,
            earned: userAchievements.filter(a => a.earnedDate).length,
            inProgress: userAchievements.filter(a => !a.earnedDate && a.progress > 0).length,
            categories: await getAchievementCategories(user._id)
        };
        
        res.json({
            success: true,
            data: {
                earned: userAchievements.filter(a => a.earnedDate),
                inProgress: userAchievements.filter(a => !a.earnedDate && a.progress > 0),
                available: achievementsWithProgress,
                stats
            },
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Achievements error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load achievements'
        });
    }
});

// Update Account Settings
app.put('/api/account/settings', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { settings } = req.body;
        
        // Validate settings structure
        const allowedSettings = ['theme', 'notifications', 'privacy'];
        const updateObj = {};
        
        Object.keys(settings).forEach(key => {
            if (allowedSettings.includes(key)) {
                updateObj[`settings.${key}`] = settings[key];
            }
        });
        
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateObj },
            { new: true, runValidators: true }
        ).select('-password -security.twoFactorSecret');
        
        // Clear cache
        await clearUserCache(user._id);
        
        // Track activity
        await addActivity(user._id, 'settings_updated', 'Updated account settings', {
            changedSettings: Object.keys(settings)
        });
        
        res.json({
            success: true,
            data: updatedUser.settings,
            message: 'Settings updated successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update settings'
        });
    }
});

// Export Account Data (Jack026's data export)
app.get('/api/account/export', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        
        // Compile comprehensive export data
        const exportData = {
            user: user.username,
            exportDate: '2025-08-06 14:03:20',
            profile: user.profile,
            stats: user.stats,
            achievements: user.achievements,
            projects: user.projects,
            settings: user.settings,
            recentActivity: await getRecentActivity(user._id, 100),
            analytics: await getAnalyticsSummary(user._id),
            contributions: await getContributionData(user._id),
            socialConnections: await getSocialConnections(user._id)
        };
        
        // Track export
        await addActivity(user._id, 'data_exported', 'Exported account data');
        
        await trackAnalytics(user._id, req.sessionID, 'account_data_exported', {
            dataSize: JSON.stringify(exportData).length,
            timestamp: '2025-08-06 14:03:20'
        }, req);
        
        res.json({
            success: true,
            data: exportData,
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Data export error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export account data'
        });
    }
});

// Update Streak Data
app.post('/api/account/streak', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        
        // Check if user has activity today
        const today = new Date().toDateString();
        const lastActivity = new Date(user.stats.lastActivityDate).toDateString();
        
        let streakUpdate = {};
        
        if (lastActivity !== today) {
            // New day activity
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity === yesterday.toDateString()) {
                // Continue streak
                streakUpdate = {
                    'stats.streakDays': user.stats.streakDays + 1,
                    'stats.lastActivityDate': new Date()
                };
                
                // Update longest streak if needed
                if (user.stats.streakDays + 1 > user.stats.longestStreak) {
                    streakUpdate['stats.longestStreak'] = user.stats.streakDays + 1;
                }
            } else {
                // Reset streak
                streakUpdate = {
                    'stats.streakDays': 1,
                    'stats.lastActivityDate': new Date()
                };
            }
            
            // Update user
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $set: streakUpdate },
                { new: true }
            );
            
            // Check for streak achievements
            await checkStreakAchievements(user._id, updatedUser.stats.streakDays);
            
            // Clear cache
            await clearUserCache(user._id);
            
            // Broadcast streak update
            broadcastToUser(user._id, {
                type: 'streak_updated',
                data: {
                    streakDays: updatedUser.stats.streakDays,
                    longestStreak: updatedUser.stats.longestStreak
                }
            });
            
            res.json({
                success: true,
                data: {
                    streakDays: updatedUser.stats.streakDays,
                    longestStreak: updatedUser.stats.longestStreak,
                    isNewRecord: updatedUser.stats.streakDays === updatedUser.stats.longestStreak
                },
                timestamp: '2025-08-06 14:03:20'
            });
        } else {
            res.json({
                success: true,
                data: {
                    streakDays: user.stats.streakDays,
                    longestStreak: user.stats.longestStreak,
                    message: 'Streak already updated today'
                },
                timestamp: '2025-08-06 14:03:20'
            });
        }
        
    } catch (error) {
        console.error('Streak update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update streak'
        });
    }
});

// Analytics Tracking Endpoint
app.post('/api/account/analytics', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { event, data } = req.body;
        
        await trackAnalytics(user._id, req.sessionID, event, data, req);
        
        res.json({
            success: true,
            message: 'Analytics tracked successfully',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Analytics tracking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track analytics'
        });
    }
});

// Real-time Notifications
app.get('/api/account/notifications', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        
        const notifications = await getNotifications(user._id, {
            page: parseInt(page),
            limit: parseInt(limit),
            unreadOnly: unreadOnly === 'true'
        });
        
        res.json({
            success: true,
            data: notifications,
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load notifications'
        });
    }
});

// Mark Notifications as Read
app.put('/api/account/notifications/read', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { notificationIds } = req.body;
        
        await markNotificationsRead(user._id, notificationIds);
        
        res.json({
            success: true,
            message: 'Notifications marked as read',
            timestamp: '2025-08-06 14:03:20'
        });
        
    } catch (error) {
        console.error('Mark notifications error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark notifications as read'
        });
    }
});

// ==================== HELPER FUNCTIONS ====================

// Get monthly statistics
async function getMonthlyStats(userId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const user = await User.findById(userId);
    
    // This would typically come from activity tracking
    return {
        commits: Math.floor(Math.random() * 150) + 50, // 50-200
        mentored: Math.floor(Math.random() * 20) + 5,  // 5-25
        codingHours: Math.floor(Math.random() * 100) + 40, // 40-140
        rating: 4.5 + (Math.random() * 0.5) // 4.5-5.0
    };
}

// Get recent activity
async function getRecentActivity(userId, limit = 10) {
    const user = await User.findById(userId);
    return user.activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
}

// Add activity record
async function addActivity(userId, type, description, metadata = {}) {
    await User.findByIdAndUpdate(userId, {
        $push: {
            activity: {
                $each: [{
                    type,
                    description,
                    metadata,
                    timestamp: new Date()
                }],
                $slice: -100 // Keep only last 100 activities
            }
        }
    });
}

// Get unread notifications
async function getUnreadNotifications(userId) {
    // Mock notifications for Jack026
    return [
        {
            id: 1,
            type: 'collaboration',
            title: 'New Collaboration Request',
            message: 'Sarah Kumar invited you to collaborate on Mobile App UI',
            timestamp: '2025-08-06 12:30:20',
            unread: true
        },
        {
            id: 2,
            type: 'achievement',
            title: 'Achievement Progress',
            message: 'You\'re 70% complete on Innovation Leader badge',
            timestamp: '2025-08-06 11:15:20',
            unread: true
        }
    ];
}

// Get user skills
async function getUserSkills(userId) {
    const user = await User.findById(userId);
    
    // Jack026's skills with progress
    if (user.username === 'Jack026') {
        return [
            { name: 'React.js', level: 95, category: 'Frontend' },
            { name: 'Node.js', level: 88, category: 'Backend' },
            { name: 'Python', level: 92, category: 'Backend' },
            { name: 'System Design', level: 76, category: 'Architecture' },
            { name: 'Leadership', level: 94, category: 'Soft Skills' },
            { name: 'Mentoring', level: 89, category: 'Soft Skills' }
        ];
    }
    
    return [];
}

// Get contribution data for heatmap
async function getContributionData(userId) {
    const contributions = {};
    const today = new Date();
    
    // Generate mock contribution data for the year
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Jack026 is very active, so higher contribution levels
        const level = Math.random() > 0.15 ? Math.floor(Math.random() * 4) + 1 : 0;
        contributions[dateStr] = level;
    }
    
    return contributions;
}

// Track analytics
async function trackAnalytics(userId, sessionId, event, data, req) {
    try {
        const analyticsRecord = new Analytics({
            userId,
            sessionId,
            event,
            data,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            page: req.get('Referer'),
            timestamp: new Date()
        });
        
        await analyticsRecord.save();
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// Clear user cache
async function clearUserCache(userId) {
    try {
        const keys = await redisClient.keys(`*:${userId}:*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
}

// Check project achievements
async function checkProjectAchievements(userId) {
    const user = await User.findById(userId);
    const completedProjects = user.projects.filter(p => p.status === 'completed').length;
    
    // Check for Innovation Leader achievement (10 completed projects)
    if (completedProjects >= 7 && completedProjects < 10) {
        // Update progress
        await User.findOneAndUpdate(
            { _id: userId, 'achievements.id': 'innovation_leader' },
            {
                $set: {
                    'achievements.$.progress': (completedProjects / 10) * 100,
                    'achievements.$.current': completedProjects,
                    'achievements.$.total': 10
                }
            }
        );
    } else if (completedProjects >= 10) {
        // Award achievement
        await awardAchievement(userId, 'innovation_leader');
    }
}

// Check streak achievements
async function checkStreakAchievements(userId, streakDays) {
    if (streakDays >= 30) {
        await awardAchievement(userId, 'streak_master');
    }
    if (streakDays >= 100) {
        await awardAchievement(userId, 'streak_legend');
    }
}

// Award achievement
async function awardAchievement(userId, achievementId) {
    const user = await User.findById(userId);
    const existingAchievement = user.achievements.find(a => a.id === achievementId);
    
    if (!existingAchievement || !existingAchievement.earnedDate) {
        const achievementData = getAchievementData(achievementId);
        
        await User.findOneAndUpdate(
            { _id: userId, 'achievements.id': achievementId },
            {
                $set: {
                    'achievements.$.earnedDate': new Date(),
                    'achievements.$.progress': 100
                }
            },
            { upsert: true }
        );
        
        // Add activity
        await addActivity(userId, 'achievement_earned', `Earned ${achievementData.title} achievement`, {
            achievementId,
            rarity: achievementData.rarity
        });
        
        // Broadcast achievement
        broadcastToUser(userId, {
            type: 'achievement_earned',
            data: achievementData
        });
    }
}

// Get achievement data
function getAchievementData(achievementId) {
    const achievements = {
        innovation_leader: {
            id: 'innovation_leader',
            title: 'Innovation Leader',
            description: 'Lead 10 successful project launches',
            icon: 'fas fa-rocket',
            rarity: 'legendary',
            category: 'leadership'
        },
        streak_master: {
            id: 'streak_master',
            title: 'Streak Master',
            description: 'Maintained 30+ day coding streak',
            icon: 'fas fa-fire',
            rarity: 'rare',
            category: 'coding'
        },
        streak_legend: {
            id: 'streak_legend',
            title: 'Streak Legend',
            description: 'Maintained 100+ day coding streak',
            icon: 'fas fa-crown',
            rarity: 'legendary',
            category: 'coding'
        }
    };
    
    return achievements[achievementId];
}

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'authenticate') {
                // Authenticate WebSocket connection
                authenticateWebSocket(ws, data.token);
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Authenticate WebSocket connection
async function authenticateWebSocket(ws, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user) {
            ws.userId = user._id.toString();
            ws.username = user.username;
            
            // Update user online status
            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
                lastSeen: new Date()
            });
            
            console.log(`WebSocket authenticated for ${user.username}`);
        }
    } catch (error) {
        console.error('WebSocket authentication error:', error);
        ws.close();
    }
}

// Broadcast message to specific user
function broadcastToUser(userId, message) {
    wss.clients.forEach(client => {
        if (client.userId === userId.toString() && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Heartbeat for WebSocket connections
setInterval(() => {
    wss.clients.forEach(ws => {
        if (!ws.isAlive) {
            return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

// Start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/davinci-coders', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected successfully');
    
    app.listen(PORT, () => {
        console.log(`🚀 Jack026's Account API Server running on port ${PORT}`);
        console.log(`📡 WebSocket server running on port 8080`);
        console.log(`⏰ Started at: 2025-08-06 14:03:20 UTC`);
        console.log(`👤 Optimized for: Jack026`);
    });
}).catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

module.exports = app;