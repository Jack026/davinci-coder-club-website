/* ========================================
   DATABASE MODELS & SCHEMAS
   Updated: 2025-08-06 14:03:20 UTC
   Built for: Jack026's Account System
======================================== */

const mongoose = require('mongoose');

// Enhanced User Schema with Jack026-specific fields
const enhancedUserSchema = new mongoose.Schema({
    // Basic Information
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8
    },
    
    // Profile Information
    profile: {
        firstName: { type: String, required: true, maxlength: 50 },
        lastName: { type: String, required: true, maxlength: 50 },
        displayName: { type: String, maxlength: 100 },
        bio: { type: String, maxlength: 500 },
        avatar: { type: String },
        coverImage: { type: String },
        title: { type: String, maxlength: 100 },
        department: { 
            type: String, 
            enum: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Other']
        },
        year: { 
            type: String, 
            enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Faculty']
        },
        location: { type: String, maxlength: 100 },
        website: { type: String, maxlength: 255 },
        phoneNumber: { type: String, maxlength: 20 },
        dateOfBirth: { type: Date },
        skills: [{
            name: { type: String, required: true },
            level: { type: Number, min: 0, max: 100 },
            category: { type: String },
            verified: { type: Boolean, default: false }
        }],
        languages: [{
            name: { type: String, required: true },
            proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] }
        }],
        interests: [{ type: String }],
        social: {
            github: { type: String },
            linkedin: { type: String },
            twitter: { type: String },
            discord: { type: String },
            instagram: { type: String },
            portfolio: { type: String }
        },
        badges: [{
            name: { type: String },
            icon: { type: String },
            color: { type: String },
            earnedDate: { type: Date }
        }]
    },
    
    // Statistics & Metrics
    stats: {
        totalContributions: { type: Number, default: 0, min: 0 },
        totalProjects: { type: Number, default: 0, min: 0 },
        totalCommits: { type: Number, default: 0, min: 0 },
        linesOfCode: { type: Number, default: 0, min: 0 },
        menteesCount: { type: Number, default: 0, min: 0 },
        mentorshipHours: { type: Number, default: 0, min: 0 },
        streakDays: { type: Number, default: 0, min: 0 },
        longestStreak: { type: Number, default: 0, min: 0 },
        lastActivityDate: { type: Date, default: Date.now },
        codingHours: { type: Number, default: 0, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reputation: { type: Number, default: 0, min: 0 },
        level: { type: Number, default: 1, min: 1 },
        experience: { type: Number, default: 0, min: 0 },
        weeklyStats: {
            commits: { type: Number, default: 0 },
            hoursActive: { type: Number, default: 0 },
            projectsWorked: { type: Number, default: 0 },
            mentoringSessions: { type: Number, default: 0 }
        },
        monthlyStats: {
            commits: { type: Number, default: 0 },
            hoursActive: { type: Number, default: 0 },
            projectsCompleted: { type: Number, default: 0 },
            membersMentored: { type: Number, default: 0 }
        }
    },
    
    // Achievements System
    achievements: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        rarity: { 
            type: String, 
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common'
        },
        category: { 
            type: String, 
            enum: ['coding', 'leadership', 'mentoring', 'collaboration', 'innovation', 'learning']
        },
        earnedDate: { type: Date },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        total: { type: Number, default: 100 },
        current: { type: Number, default: 0 },
        requirements: [{ type: String }],
        rewards: {
            experience: { type: Number, default: 0 },
            badges: [{ type: String }],
            titles: [{ type: String }]
        }
    }],
    
    // Projects Management
    projects: [{
        id: { type: String, required: true, unique: true },
        title: { type: String, required: true, maxlength: 100 },
        description: { type: String, maxlength: 1000 },
        shortDescription: { type: String, maxlength: 200 },
        status: { 
            type: String, 
            enum: ['planning', 'active', 'completed', 'paused', 'cancelled'],
            default: 'planning'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        technologies: [{ type: String }],
        repository: { type: String },
        liveUrl: { type: String },
        documentation: { type: String },
        featured: { type: Boolean, default: false },
        visibility: {
            type: String,
            enum: ['public', 'private', 'members'],
            default: 'public'
        },
        collaborators: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String },
            role: { type: String, enum: ['owner', 'maintainer', 'contributor', 'viewer'] },
            joinedDate: { type: Date, default: Date.now }
        }],
        milestones: [{
            title: { type: String },
            description: { type: String },
            dueDate: { type: Date },
            completed: { type: Boolean, default: false },
            completedDate: { type: Date }
        }],
        tags: [{ type: String }],
        license: { type: String },
        starCount: { type: Number, default: 0 },
        forkCount: { type: Number, default: 0 },
        viewCount: { type: Number, default: 0 },
        createdDate: { type: Date, default: Date.now },
        lastUpdated: { type: Date, default: Date.now },
        estimatedHours: { type: Number },
        actualHours: { type: Number },
        budget: {
            estimated: { type: Number },
            actual: { type: Number },
            currency: { type: String, default: 'USD' }
        }
    }],
    
    // Activity Feed
    activity: [{
        id: { type: String },
        type: { 
            type: String, 
            required: true,
            enum: [
                'profile_updated', 'project_created', 'project_updated', 'project_completed',
                'achievement_earned', 'streak_updated', 'mentorship_started', 'collaboration_joined',
                'code_committed', 'issue_resolved', 'pull_request_merged', 'review_completed',
                'event_attended', 'presentation_given', 'article_published', 'skill_acquired'
            ]
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now, index: true },
        metadata: {
            projectId: { type: String },
            achievementId: { type: String },
            collaboratorId: { type: String },
            repositoryUrl: { type: String },
            commitHash: { type: String },
            pullRequestUrl: { type: String },
            issueUrl: { type: String },
            additionalData: { type: Object }
        },
        visibility: {
            type: String,
            enum: ['public', 'members', 'private'],
            default: 'public'
        },
        reactions: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            type: { type: String, enum: ['like', 'love', 'wow', 'celebrate'] },
            timestamp: { type: Date, default: Date.now }
        }],
        comments: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String, maxlength: 500 },
            timestamp: { type: Date, default: Date.now }
        }]
    }],
    
    // Settings & Preferences
    settings: {
        theme: { 
            type: String, 
            default: 'dark', 
            enum: ['light', 'dark', 'auto', 'blue', 'purple'] 
        },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'UTC' },
        dateFormat: { type: String, default: 'YYYY-MM-DD' },
        timeFormat: { type: String, default: '24h' },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            mobile: { type: Boolean, default: true },
            projects: { type: Boolean, default: true },
            achievements: { type: Boolean, default: true },
            collaborations: { type: Boolean, default: true },
            mentions: { type: Boolean, default: true },
            newsletters: { type: Boolean, default: false },
            marketing: { type: Boolean, default: false },
            weeklyDigest: { type: Boolean, default: true },
            monthlyReport: { type: Boolean, default: true }
        },
        privacy: {
            profileVisibility: { 
                type: String, 
                default: 'public', 
                enum: ['public', 'members', 'private'] 
            },
            showActivity: { type: Boolean, default: true },
            showStats: { type: Boolean, default: true },
            showProjects: { type: Boolean, default: true },
            showAchievements: { type: Boolean, default: true },
            showContact: { type: Boolean, default: true },
            allowDirectMessages: { type: Boolean, default: true },
            allowCollaborationRequests: { type: Boolean, default: true },
            showOnlineStatus: { type: Boolean, default: true }
        },
        dashboard: {
            layout: { type: String, default: 'default' },
            widgets: [{
                type: { type: String },
                position: { type: Number },
                size: { type: String },
                visible: { type: Boolean, default: true },
                settings: { type: Object }
            }],
            defaultTab: { type: String, default: 'overview' }
        },
        accessibility: {
            reducedMotion: { type: Boolean, default: false },
            highContrast: { type: Boolean, default: false },
            largeText: { type: Boolean, default: false },
            screenReader: { type: Boolean, default: false }
        }
    },
    
    // Security & Authentication
    security: {
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: { type: String },
        backupCodes: [{ type: String }],
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date },
        passwordChangedAt: { type: Date, default: Date.now },
        lastPasswordChange: { type: Date },
        securityQuestions: [{
            question: { type: String },
            answer: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
        sessions: [{
            sessionId: { type: String, required: true },
            ipAddress: { type: String },
            userAgent: { type: String },
            location: {
                country: { type: String },
                city: { type: String },
                region: { type: String }
            },
            createdAt: { type: Date, default: Date.now },
            lastActivity: { type: Date, default: Date.now },
            isActive: { type: Boolean, default: true }
        }],
        apiKeys: [{
            name: { type: String },
            key: { type: String },
            permissions: [{ type: String }],
            createdAt: { type: Date, default: Date.now },
            lastUsed: { type: Date },
            isActive: { type: Boolean, default: true }
        }],
        trustedDevices: [{
            deviceId: { type: String },
            deviceName: { type: String },
            lastUsed: { type: Date },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    
    // Social & Collaboration
    social: {
        following: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],
        followers: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],
        blockedUsers: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],
        mentoring: [{
            menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            startDate: { type: Date, default: Date.now },
            endDate: { type: Date },
            status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
            goals: [{ type: String }],
            progress: { type: Number, default: 0 }
        }],
        mentoredBy: [{
            mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            startDate: { type: Date, default: Date.now },
            endDate: { type: Date },
            status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' }
        }],
        collaborations: [{
            projectId: { type: String },
            role: { type: String },
            startDate: { type: Date, default: Date.now },
            endDate: { type: Date },
            status: { type: String, enum: ['active', 'completed', 'left'], default: 'active' }
        }]
    },
    
    // Analytics & Tracking
    analytics: {
        profileViews: { type: Number, default: 0 },
        projectViews: { type: Number, default: 0 },
        githubViews: { type: Number, default: 0 },
        socialClicks: {
            github: { type: Number, default: 0 },
            linkedin: { type: Number, default: 0 },
            twitter: { type: Number, default: 0 },
            portfolio: { type: Number, default: 0 }
        },
        searchAppearances: { type: Number, default: 0 },
        mentorshipRequests: { type: Number, default: 0 },
        collaborationInvites: { type: Number, default: 0 },
        lastAnalyticsUpdate: { type: Date, default: Date.now }
    },
    
    // Status & Metadata
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    role: { 
        type: String, 
        default: 'member', 
        enum: ['member', 'senior', 'core', 'leadership', 'admin', 'alumni'],
        index: true
    },
    permissions: [{
        resource: { type: String },
        actions: [{ type: String }],
        granted: { type: Boolean, default: true },
        grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        grantedAt: { type: Date, default: Date.now }
    }],
    flags: {
        isBlocked: { type: Boolean, default: false },
        isSuspended: { type: Boolean, default: false },
        needsVerification: { type: Boolean, default: false },
        hasCompletedOnboarding: { type: Boolean, default: false },
        hasAcceptedTerms: { type: Boolean, default: false },
        marketingOptIn: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.security.twoFactorSecret;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

/* Continuing Database Models from where it stopped... */

// Indexes for performance
enhancedUserSchema.index({ username: 1 }, { unique: true });
enhancedUserSchema.index({ email: 1 }, { unique: true });
enhancedUserSchema.index({ role: 1 });
enhancedUserSchema.index({ 'stats.totalContributions': -1 });
enhancedUserSchema.index({ 'stats.streakDays': -1 });
enhancedUserSchema.index({ lastSeen: -1 });
enhancedUserSchema.index({ joinDate: -1 });
enhancedUserSchema.index({ isOnline: 1 });
enhancedUserSchema.index({ 'activity.timestamp': -1 });
enhancedUserSchema.index({ 'projects.status': 1 });
enhancedUserSchema.index({ 'achievements.earnedDate': -1 });

// Virtual fields
enhancedUserSchema.virtual('profile.fullName').get(function() {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

enhancedUserSchema.virtual('isLocked').get(function() {
    return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

enhancedUserSchema.virtual('experienceLevel').get(function() {
    const exp = this.stats.experience;
    if (exp < 1000) return 'Beginner';
    if (exp < 5000) return 'Intermediate';
    if (exp < 15000) return 'Advanced';
    if (exp < 50000) return 'Expert';
    return 'Master';
});

enhancedUserSchema.virtual('totalAchievements').get(function() {
    return this.achievements.filter(a => a.earnedDate).length;
});

// Pre-save middleware
enhancedUserSchema.pre('save', async function(next) {
    const bcrypt = require('bcryptjs');
    
    // Hash password if modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.security.passwordChangedAt = new Date('2025-08-06 14:13:14');
    }
    
    // Update full name
    if (this.isModified('profile.firstName') || this.isModified('profile.lastName')) {
        this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    }
    
    // Calculate level based on experience
    if (this.isModified('stats.experience')) {
        this.stats.level = Math.floor(this.stats.experience / 1000) + 1;
    }
    
    next();
});

// Methods
enhancedUserSchema.methods.comparePassword = async function(candidatePassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(candidatePassword, this.password);
};

enhancedUserSchema.methods.generateAuthToken = function() {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { 
            userId: this._id, 
            username: this.username,
            role: this.role,
            timestamp: '2025-08-06 14:13:14'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

enhancedUserSchema.methods.addActivity = function(type, title, description, metadata = {}) {
    this.activity.unshift({
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title,
        description,
        metadata,
        timestamp: new Date('2025-08-06 14:13:14')
    });
    
    // Keep only last 100 activities
    if (this.activity.length > 100) {
        this.activity = this.activity.slice(0, 100);
    }
    
    return this.save();
};

enhancedUserSchema.methods.updateStreak = function() {
    const today = new Date('2025-08-06 14:13:14').toDateString();
    const lastActivity = new Date(this.stats.lastActivityDate).toDateString();
    
    if (lastActivity !== today) {
        const yesterday = new Date('2025-08-06 14:13:14');
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Continue streak
            this.stats.streakDays += 1;
            if (this.stats.streakDays > this.stats.longestStreak) {
                this.stats.longestStreak = this.stats.streakDays;
            }
        } else {
            // Reset streak
            this.stats.streakDays = 1;
        }
        
        this.stats.lastActivityDate = new Date('2025-08-06 14:13:14');
    }
    
    return this.save();
};

// Create User Model
const User = mongoose.model('User', enhancedUserSchema);

// Notifications Schema
const notificationSchema = new mongoose.Schema({
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    type: {
        type: String,
        required: true,
        enum: [
            'mention', 'collaboration_request', 'collaboration_accepted', 'collaboration_declined',
            'project_invite', 'project_update', 'achievement_earned', 'streak_milestone',
            'mentorship_request', 'mentorship_accepted', 'comment', 'like', 'follow',
            'system_announcement', 'security_alert', 'payment_reminder'
        ],
        index: true
    },
    title: { type: String, required: true, maxlength: 100 },
    message: { type: String, required: true, maxlength: 500 },
    metadata: {
        projectId: { type: String },
        achievementId: { type: String },
        url: { type: String },
        actionRequired: { type: Boolean, default: false },
        priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
        category: { type: String },
        additionalData: { type: Object }
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: () => new Date('2025-08-06 14:13:14'), index: true }
}, {
    timestamps: true
});

// Notification indexes
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

// Enhanced Analytics Schema
const enhancedAnalyticsSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    sessionId: { type: String, required: true, index: true },
    event: { type: String, required: true, index: true },
    category: { type: String, index: true },
    label: { type: String },
    value: { type: Number },
    data: {
        page: { type: String },
        referrer: { type: String },
        userAgent: { type: String },
        screenResolution: { type: String },
        viewportSize: { type: String },
        device: {
            type: { type: String, enum: ['desktop', 'tablet', 'mobile'] },
            os: { type: String },
            browser: { type: String }
        },
        location: {
            country: { type: String },
            region: { type: String },
            city: { type: String },
            timezone: { type: String }
        },
        performance: {
            loadTime: { type: Number },
            domContentLoaded: { type: Number },
            firstPaint: { type: Number }
        },
        customData: { type: Object }
    },
    timestamp: { 
        type: Date, 
        default: () => new Date('2025-08-06 14:13:14'), 
        index: true 
    },
    ipAddress: { type: String },
    processed: { type: Boolean, default: false, index: true }
}, {
    timestamps: true
});

// Analytics indexes
enhancedAnalyticsSchema.index({ userId: 1, timestamp: -1 });
enhancedAnalyticsSchema.index({ event: 1, timestamp: -1 });
enhancedAnalyticsSchema.index({ sessionId: 1, timestamp: -1 });
enhancedAnalyticsSchema.index({ processed: 1, timestamp: -1 });

const Analytics = mongoose.model('Analytics', enhancedAnalyticsSchema);

// Project Collaboration Schema
const collaborationSchema = new mongoose.Schema({
    projectId: { type: String, required: true, index: true },
    projectTitle: { type: String, required: true },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    requesterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'cancelled'],
        default: 'pending',
        index: true
    },
    requestedRole: {
        type: String,
        enum: ['contributor', 'maintainer', 'reviewer'],
        default: 'contributor'
    },
    message: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    expectedContribution: { type: String, maxlength: 1000 },
    timeCommitment: {
        hoursPerWeek: { type: Number },
        duration: { type: String }
    },
    responseMessage: { type: String, maxlength: 500 },
    respondedAt: { type: Date },
    createdAt: { 
        type: Date, 
        default: () => new Date('2025-08-06 14:13:14') 
    }
}, {
    timestamps: true
});

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

// Mentorship Schema
const mentorshipSchema = new mongoose.Schema({
    mentorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    menteeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['requested', 'active', 'completed', 'paused', 'cancelled'],
        default: 'requested',
        index: true
    },
    goals: [{
        title: { type: String, required: true },
        description: { type: String },
        targetDate: { type: Date },
        completed: { type: Boolean, default: false },
        completedDate: { type: Date }
    }],
    skills: [{ type: String }],
    duration: {
        weeks: { type: Number },
        hoursPerWeek: { type: Number }
    },
    schedule: {
        frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
        preferredDays: [{ type: String }],
        preferredTime: { type: String }
    },
    progress: {
        overall: { type: Number, default: 0, min: 0, max: 100 },
        sessions: { type: Number, default: 0 },
        completedGoals: { type: Number, default: 0 }
    },
    feedback: [{
        fromId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxlength: 1000 },
        createdAt: { type: Date, default: () => new Date('2025-08-06 14:13:14') }
    }],
    sessions: [{
        scheduledDate: { type: Date },
        actualDate: { type: Date },
        duration: { type: Number }, // in minutes
        notes: { type: String },
        homework: { type: String },
        completed: { type: Boolean, default: false }
    }],
    requestMessage: { type: String, maxlength: 500 },
    responseMessage: { type: String, maxlength: 500 },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { 
        type: Date, 
        default: () => new Date('2025-08-06 14:13:14') 
    }
}, {
    timestamps: true
});

const Mentorship = mongoose.model('Mentorship', mentorshipSchema);

// System Settings Schema
const systemSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String, default: 'general' },
    description: { type: String },
    dataType: {
        type: String,
        enum: ['string', 'number', 'boolean', 'object', 'array'],
        default: 'string'
    },
    isPublic: { type: Boolean, default: false },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModified: { 
        type: Date, 
        default: () => new Date('2025-08-06 14:13:14') 
    }
}, {
    timestamps: true
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

module.exports = {
    User,
    Notification,
    Analytics,
    Collaboration,
    Mentorship,
    SystemSettings
};