/* ========================================
   ENHANCED API ROUTES & MIDDLEWARE
   Updated: 2025-08-06 14:13:14 UTC
   Built for: Jack026's Complete Backend
======================================== */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult, param, query } = require('express-validator');
const { User, Notification, Analytics, Collaboration, Mentorship } = require('./database-models');
const wsServer = require('./websocket-server');

const router = express.Router();

// Enhanced Rate Limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
});

// Different rate limits for different endpoints
const authRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts');
const generalRateLimit = createRateLimit(15 * 60 * 1000, 100, 'Too many requests');
const uploadRateLimit = createRateLimit(60 * 60 * 1000, 10, 'Too many upload attempts');

// Validation Middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
            timestamp: '2025-08-06 14:13:14'
        });
    }
    next();
};

// Jack026 Admin Middleware
const requireJack026Admin = async (req, res, next) => {
    try {
        if (req.user.username !== 'Jack026' || !['leadership', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Jack026 admin privileges required',
                timestamp: '2025-08-06 14:13:14'
            });
        }
        
        // Log admin action
        console.log(`👑 Jack026 admin action: ${req.method} ${req.path} at 2025-08-06 14:13:14`);
        
        // Track admin analytics
        await Analytics.create({
            userId: req.user._id,
            sessionId: req.sessionID,
            event: 'jack026_admin_action',
            data: {
                method: req.method,
                path: req.path,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip
            }
        });
        
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Admin verification failed',
            timestamp: '2025-08-06 14:13:14'
        });
    }
};

// ==================== ADVANCED ACCOUNT ROUTES ====================

// Get Jack026's Advanced Dashboard
router.get('/dashboard/advanced', 
    generalRateLimit,
    [
        query('period').optional().isIn(['week', 'month', 'quarter', 'year']),
        query('includeAnalytics').optional().isBoolean()
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { user } = req;
            const { period = 'month', includeAnalytics = true } = req.query;
            
            // Comprehensive dashboard data
            const dashboardData = {
                profile: await getEnhancedProfile(user._id),
                stats: await getAdvancedStats(user._id, period),
                recentActivity: await getDetailedActivity(user._id, 20),
                achievements: await getAchievementProgress(user._id),
                projects: await getProjectsWithMetrics(user._id),
                notifications: await getNotificationsWithPriority(user._id),
                mentorship: await getMentorshipData(user._id),
                collaboration: await getCollaborationData(user._id),
                skillsAnalysis: await getSkillsAnalysis(user._id),
                contributionMap: await getContributionHeatmap(user._id),
                socialConnections: await getSocialConnections(user._id),
                upcomingEvents: await getUpcomingEvents(user._id)
            };
            
            if (includeAnalytics && user.username === 'Jack026') {
                dashboardData.analytics = await getLeadershipAnalytics(user._id);
                dashboardData.teamOverview = await getTeamOverview();
                dashboardData.systemMetrics = wsServer.getStats();
            }
            
            res.json({
                success: true,
                data: dashboardData,
                generatedAt: '2025-08-06 14:13:14',
                cacheExpiry: 300 // 5 minutes
            });
            
        } catch (error) {
            console.error('Advanced dashboard error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to load advanced dashboard',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Update Jack026's Status
router.put('/status',
    generalRateLimit,
    [
        body('activity').optional().isString().isLength({ max: 100 }),
        body('mood').optional().isIn(['productive', 'learning', 'mentoring', 'leading', 'collaborating']),
        body('availability').optional().isIn(['available', 'busy', 'do-not-disturb', 'away'])
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { user } = req;
            const { activity, mood, availability } = req.body;
            
            const statusUpdate = {
                'profile.currentActivity': activity,
                'profile.mood': mood,
                'profile.availability': availability,
                lastSeen: new Date('2025-08-06 14:13:14')
            };
            
            await User.findByIdAndUpdate(user._id, statusUpdate);
            
            // Broadcast status update via WebSocket
            wsServer.broadcastToRoom('general', {
                type: 'user_status_updated',
                userId: user._id,
                username: user.username,
                activity,
                mood,
                availability,
                timestamp: '2025-08-06 14:13:14'
            }, user._id.toString());
            
            // Track activity
            await user.addActivity(
                'status_updated',
                'Updated Status',
                `Changed status: ${activity || 'No activity'}`,
                { mood, availability }
            );
            
            res.json({
                success: true,
                message: 'Status updated successfully',
                timestamp: '2025-08-06 14:13:14'
            });
            
        } catch (error) {
            console.error('Status update error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update status',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Advanced Analytics for Jack026
router.get('/analytics/advanced',
    requireJack026Admin,
    [
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601(),
        query('granularity').optional().isIn(['hour', 'day', 'week', 'month'])
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { startDate, endDate, granularity = 'day' } = req.query;
            
            const analytics = {
                userEngagement: await getUserEngagementMetrics(startDate, endDate, granularity),
                projectMetrics: await getProjectMetrics(startDate, endDate),
                achievementTrends: await getAchievementTrends(startDate, endDate),
                collaborationStats: await getCollaborationStats(startDate, endDate),
                mentorshipMetrics: await getMentorshipMetrics(startDate, endDate),
                platformUsage: await getPlatformUsageStats(startDate, endDate),
                performanceMetrics: await getPerformanceMetrics(),
                realTimeStats: wsServer.getStats(),
                jack026Specific: {
                    leadershipImpact: await getLeadershipImpact(req.user._id),
                    teamGrowth: await getTeamGrowthMetrics(),
                    mentorshipSuccess: await getMentorshipSuccessRate(req.user._id),
                    projectLeadership: await getProjectLeadershipMetrics(req.user._id)
                }
            };
            
            res.json({
                success: true,
                data: analytics,
                generatedAt: '2025-08-06 14:13:14',
                period: { startDate, endDate, granularity }
            });
            
        } catch (error) {
            console.error('Advanced analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate analytics',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Collaboration Management
router.post('/collaborations/request',
    generalRateLimit,
    [
        body('projectId').isString().notEmpty(),
        body('ownerId').isMongoId(),
        body('requestedRole').isIn(['contributor', 'maintainer', 'reviewer']),
        body('message').optional().isString().isLength({ max: 500 }),
        body('skills').optional().isArray(),
        body('expectedContribution').optional().isString().isLength({ max: 1000 })
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { user } = req;
            const collaborationData = req.body;
            
            // Check if request already exists
            const existingRequest = await Collaboration.findOne({
                projectId: collaborationData.projectId,
                requesterId: user._id,
                status: 'pending'
            });
            
            if (existingRequest) {
                return res.status(400).json({
                    success: false,
                    error: 'Collaboration request already pending',
                    timestamp: '2025-08-06 14:13:14'
                });
            }
            
            // Create collaboration request
            const collaboration = new Collaboration({
                ...collaborationData,
                requesterId: user._id,
                createdAt: new Date('2025-08-06 14:13:14')
            });
            
            await collaboration.save();
            
            // Create notification for project owner
            const notification = new Notification({
                recipientId: collaborationData.ownerId,
                senderId: user._id,
                type: 'collaboration_request',
                title: 'New Collaboration Request',
                message: `${user.username} wants to collaborate on your project`,
                metadata: {
                    collaborationId: collaboration._id,
                    projectId: collaborationData.projectId,
                    actionRequired: true
                }
            });
            
            await notification.save();
            
            // Send real-time notification
            wsServer.notifyCollaborationRequest(collaborationData.ownerId, {
                id: collaboration._id,
                requester: user.username,
                projectId: collaborationData.projectId,
                role: collaborationData.requestedRole
            });
            
            // Track activity
            await user.addActivity(
                'collaboration_requested',
                'Collaboration Requested',
                `Requested to collaborate on project ${collaborationData.projectId}`,
                { role: collaborationData.requestedRole }
            );
            
            res.json({
                success: true,
                data: collaboration,
                message: 'Collaboration request sent successfully',
                timestamp: '2025-08-06 14:13:14'
            });
            
        } catch (error) {
            console.error('Collaboration request error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send collaboration request',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Mentorship Management
router.post('/mentorship/request',
    generalRateLimit,
    [
        body('mentorId').isMongoId(),
        body('goals').isArray().notEmpty(),
        body('skills').isArray().notEmpty(),
        body('duration.weeks').isInt({ min: 1, max: 52 }),
        body('duration.hoursPerWeek').isInt({ min: 1, max: 20 }),
        body('requestMessage').isString().isLength({ max: 500 })
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { user } = req;
            const mentorshipData = req.body;
            
            // Check if user is requesting mentorship from themselves
            if (mentorshipData.mentorId === user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot request mentorship from yourself',
                    timestamp: '2025-08-06 14:13:14'
                });
            }
            
            // Check if active mentorship already exists
            const existingMentorship = await Mentorship.findOne({
                mentorId: mentorshipData.mentorId,
                menteeId: user._id,
                status: { $in: ['requested', 'active'] }
            });
            
            if (existingMentorship) {
                return res.status(400).json({
                    success: false,
                    error: 'Active mentorship or pending request already exists',
                    timestamp: '2025-08-06 14:13:14'
                });
            }
            
            // Create mentorship request
            const mentorship = new Mentorship({
                mentorId: mentorshipData.mentorId,
                menteeId: user._id,
                goals: mentorshipData.goals.map(goal => ({
                    title: goal.title,
                    description: goal.description,
                    targetDate: goal.targetDate ? new Date(goal.targetDate) : null
                })),
                skills: mentorshipData.skills,
                duration: mentorshipData.duration,
                schedule: mentorshipData.schedule,
                requestMessage: mentorshipData.requestMessage,
                createdAt: new Date('2025-08-06 14:13:14')
            });
            
            await mentorship.save();
            
            // Create notification for mentor
            const notification = new Notification({
                recipientId: mentorshipData.mentorId,
                senderId: user._id,
                type: 'mentorship_request',
                title: 'New Mentorship Request',
                message: `${user.username} has requested your mentorship`,
                metadata: {
                    mentorshipId: mentorship._id,
                    actionRequired: true
                }
            });
            
            await notification.save();
            
            // Send real-time notification
            wsServer.notifyMentorshipUpdate(mentorshipData.mentorId, {
                id: mentorship._id,
                mentee: user.username,
                type: 'request'
            });
            
            // Track activity
            await user.addActivity(
                'mentorship_requested',
                'Mentorship Requested',
                `Requested mentorship from user ${mentorshipData.mentorId}`,
                { skills: mentorshipData.skills }
            );
            
            res.json({
                success: true,
                data: mentorship,
                message: 'Mentorship request sent successfully',
                timestamp: '2025-08-06 14:13:14'
            });
            
        } catch (error) {
            console.error('Mentorship request error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send mentorship request',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Jack026's Team Management
router.get('/team/management',
    requireJack026Admin,
    async (req, res) => {
        try {
            const teamData = {
                overview: await getTeamOverview(),
                recentJoins: await getRecentTeamMembers(30),
                activeMembers: await getActiveMembers(),
                mentorshipPrograms: await getActiveMentorships(),
                projectDistribution: await getProjectDistribution(),
                skillsMatrix: await getTeamSkillsMatrix(),
                performanceMetrics: await getTeamPerformanceMetrics(),
                upcomingEvents: await getTeamEvents(),
                announcements: await getTeamAnnouncements()
            };
            
            res.json({
                success: true,
                data: teamData,
                timestamp: '2025-08-06 14:13:14'
            });
            
        } catch (error) {
            console.error('Team management error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to load team management data',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Export Account Data (Enhanced)
router.post('/export/enhanced',
    uploadRateLimit,
    [
        body('format').optional().isIn(['json', 'csv', 'pdf']),
        body('includeAnalytics').optional().isBoolean(),
        body('dateRange.start').optional().isISO8601(),
        body('dateRange.end').optional().isISO8601()
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { user } = req;
            const { format = 'json', includeAnalytics = false, dateRange } = req.body;
            
            const exportData = await generateEnhancedExport(user._id, {
                format,
                includeAnalytics: includeAnalytics && user.username === 'Jack026',
                dateRange
            });
            
            // Track export
            await user.addActivity(
                'data_exported',
                'Data Exported',
                `Exported account data in ${format} format`,
                { format, includeAnalytics }
            );
            
            if (format === 'json') {
                res.json({
                    success: true,
                    data: exportData,
                    exportedAt: '2025-08-06 14:13:14'
                });
            } else {
                // For CSV/PDF, we would generate files and return download links
                res.json({
                    success: true,
                    downloadUrl: `/downloads/export_${user._id}_${Date.now()}.${format}`,
                    exportedAt: '2025-08-06 14:13:14'
                });
            }
            
        } catch (error) {
            console.error('Enhanced export error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to export account data',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// Real-time Status Endpoint
router.get('/realtime/status',
    generalRateLimit,
    async (req, res) => {
        try {
            const { user } = req;
            
            const realtimeStatus = {
                isConnected: wsServer.clients.has(user._id.toString()),
                lastSeen: user.lastSeen,
                currentActivity: user.profile.currentActivity,
                onlineUsers: wsServer.clients.size,
                userRooms: user.username === 'Jack026' ? 
                    Array.from(wsServer.rooms.keys()) : 
                    ['general'],
                serverStats: user.username === 'Jack026' ? wsServer.getStats() : null,
                timestamp: '2025-08-06 14:13:14'
            };
            
            res.json({
                success: true,
                data: realtimeStatus,
                timestamp: '2025-08-06 14:13:14'
            });
            
        } catch (error) {
            console.error('Real-time status error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get real-time status',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
);

// ==================== HELPER FUNCTIONS ====================

async function getEnhancedProfile(userId) {
    const user = await User.findById(userId)
        .select('-password -security.twoFactorSecret')
        .lean();
    
    return {
        ...user.profile,
        stats: user.stats,
        joinDate: user.joinDate,
        lastSeen: user.lastSeen,
        isOnline: user.isOnline,
        role: user.role,
        achievements: user.achievements.filter(a => a.earnedDate).length,
        projects: user.projects.length
    };
}

async function getAdvancedStats(userId, period) {
    const user = await User.findById(userId);
    
    // Calculate period-specific stats
    const periodStart = new Date('2025-08-06 14:13:14');
    switch (period) {
        case 'week':
            periodStart.setDate(periodStart.getDate() - 7);
            break;
        case 'month':
            periodStart.setMonth(periodStart.getMonth() - 1);
            break;
        case 'quarter':
            periodStart.setMonth(periodStart.getMonth() - 3);
            break;
        case 'year':
            periodStart.setFullYear(periodStart.getFullYear() - 1);
            break;
    }
    
    // Get analytics for the period
    const analytics = await Analytics.find({
        userId,
        timestamp: { $gte: periodStart }
    });
    
    return {
        total: user.stats,
        period: {
            events: analytics.length,
            uniqueSessions: new Set(analytics.map(a => a.sessionId)).size,
            avgSessionDuration: calculateAvgSessionDuration(analytics),
            mostActiveDay: getMostActiveDay(analytics),
            topEvents: getTopEvents(analytics)
        },
        trends: calculateTrends(analytics),
        comparison: await getPeriodComparison(userId, period)
    };
}

async function getLeadershipAnalytics(userId) {
    // Special analytics for Jack026's leadership role
    return {
        teamGrowth: await getTeamGrowthMetrics(),
        mentorshipImpact: await getMentorshipImpact(userId),
        projectLeadership: await getProjectLeadershipMetrics(userId),
        communityEngagement: await getCommunityEngagementMetrics(userId),
        decisionImpact: await getDecisionImpactMetrics(userId)
    };
}

async function getTeamOverview() {
    const totalMembers = await User.countDocuments({ isActive: true });
    const onlineMembers = await User.countDocuments({ isOnline: true });
    const newThisMonth = await User.countDocuments({
        joinDate: { $gte: new Date('2025-07-06 14:13:14') }
    });
    
    const roleDistribution = await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    return {
        totalMembers,
        onlineMembers,
        newThisMonth,
        roleDistribution: roleDistribution.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}),
        lastUpdated: '2025-08-06 14:13:14'
    };
}

module.exports = router;