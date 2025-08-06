/* ========================================
   REAL-TIME WEBSOCKET SERVER
   Updated: 2025-08-06 14:13:14 UTC
   Built for: Jack026's Real-time Features
======================================== */

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User, Notification } = require('./database-models');

class Jack026WebSocketServer {
    constructor() {
        this.wss = null;
        this.clients = new Map(); // Map of userId -> WebSocket connection
        this.rooms = new Map(); // Map of roomId -> Set of userIds
        this.heartbeatInterval = 30000; // 30 seconds
        this.jack026UserId = null;
        
        this.init();
    }
    
    init() {
        this.wss = new WebSocket.Server({ 
            port: process.env.WS_PORT || 8080,
            perMessageDeflate: false
        });
        
        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });
        
        this.startHeartbeat();
        this.loadJack026UserId();
        
        console.log(`🔌 WebSocket server started on port ${process.env.WS_PORT || 8080} at 2025-08-06 14:13:14`);
    }
    
    async loadJack026UserId() {
        try {
            const jack026 = await User.findOne({ username: 'Jack026' });
            if (jack026) {
                this.jack026UserId = jack026._id.toString();
                console.log(`👤 Jack026 user ID loaded: ${this.jack026UserId}`);
            }
        } catch (error) {
            console.error('Failed to load Jack026 user ID:', error);
        }
    }
    
    handleConnection(ws, req) {
        ws.isAlive = true;
        ws.userId = null;
        ws.username = null;
        ws.rooms = new Set();
        
        console.log(`🔗 New WebSocket connection from ${req.socket.remoteAddress} at 2025-08-06 14:13:14`);
        
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        
        ws.on('message', (message) => {
            this.handleMessage(ws, message);
        });
        
        ws.on('close', () => {
            this.handleDisconnection(ws);
        });
        
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            this.handleDisconnection(ws);
        });
        
        // Send welcome message
        this.sendToClient(ws, {
            type: 'connection_established',
            timestamp: '2025-08-06 14:13:14',
            message: 'Connected to Da-Vinci Coder Club real-time server'
        });
    }
    
    async handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'authenticate':
                    await this.authenticateClient(ws, data.token);
                    break;
                    
                case 'join_room':
                    this.joinRoom(ws, data.roomId);
                    break;
                    
                case 'leave_room':
                    this.leaveRoom(ws, data.roomId);
                    break;
                    
                case 'ping':
                    this.sendToClient(ws, { type: 'pong', timestamp: '2025-08-06 14:13:14' });
                    break;
                    
                case 'status_update':
                    await this.handleStatusUpdate(ws, data);
                    break;
                    
                case 'typing_start':
                    this.handleTypingStatus(ws, data, true);
                    break;
                    
                case 'typing_stop':
                    this.handleTypingStatus(ws, data, false);
                    break;
                    
                case 'jack026_command':
                    if (ws.userId === this.jack026UserId) {
                        await this.handleJack026Command(ws, data);
                    }
                    break;
                    
                default:
                    console.warn(`Unknown message type: ${data.type}`);
            }
        } catch (error) {
            console.error('Message handling error:', error);
            this.sendToClient(ws, {
                type: 'error',
                message: 'Invalid message format',
                timestamp: '2025-08-06 14:13:14'
            });
        }
    }
    
    async authenticateClient(ws, token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('username profile.firstName profile.lastName role isOnline');
            
            if (!user) {
                this.sendToClient(ws, {
                    type: 'auth_error',
                    message: 'Invalid user',
                    timestamp: '2025-08-06 14:13:14'
                });
                return ws.close();
            }
            
            // Remove existing connection for this user
            if (this.clients.has(user._id.toString())) {
                const existingWs = this.clients.get(user._id.toString());
                existingWs.close();
            }
            
            // Set up new connection
            ws.userId = user._id.toString();
            ws.username = user.username;
            this.clients.set(user._id.toString(), ws);
            
            // Update user online status
            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
                lastSeen: new Date('2025-08-06 14:13:14')
            });
            
            // Join default rooms
            this.joinRoom(ws, 'general');
            if (user.role === 'leadership' || user.role === 'core') {
                this.joinRoom(ws, 'leadership');
            }
            
            // Special handling for Jack026
            if (user.username === 'Jack026') {
                this.joinRoom(ws, 'jack026_admin');
                console.log(`👑 Jack026 connected with admin privileges at 2025-08-06 14:13:14`);
            }
            
            this.sendToClient(ws, {
                type: 'authenticated',
                user: {
                    id: user._id,
                    username: user.username,
                    name: `${user.profile.firstName} ${user.profile.lastName}`,
                    role: user.role
                },
                timestamp: '2025-08-06 14:13:14'
            });
            
            // Broadcast user online status
            this.broadcastToRoom('general', {
                type: 'user_online',
                userId: user._id,
                username: user.username,
                timestamp: '2025-08-06 14:13:14'
            }, ws.userId);
            
            console.log(`✅ ${user.username} authenticated successfully at 2025-08-06 14:13:14`);
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.sendToClient(ws, {
                type: 'auth_error',
                message: 'Authentication failed',
                timestamp: '2025-08-06 14:13:14'
            });
            ws.close();
        }
    }
    
    handleDisconnection(ws) {
        if (ws.userId) {
            // Update user offline status
            User.findByIdAndUpdate(ws.userId, {
                isOnline: false,
                lastSeen: new Date('2025-08-06 14:13:14')
            }).catch(err => console.error('Error updating offline status:', err));
            
            // Remove from clients map
            this.clients.delete(ws.userId);
            
            // Remove from all rooms
            ws.rooms.forEach(roomId => {
                const room = this.rooms.get(roomId);
                if (room) {
                    room.delete(ws.userId);
                    if (room.size === 0) {
                        this.rooms.delete(roomId);
                    }
                }
            });
            
            // Broadcast user offline status
            this.broadcastToRoom('general', {
                type: 'user_offline',
                userId: ws.userId,
                username: ws.username,
                timestamp: '2025-08-06 14:13:14'
            });
            
            console.log(`❌ ${ws.username || 'Unknown user'} disconnected at 2025-08-06 14:13:14`);
        }
    }
    
    joinRoom(ws, roomId) {
        if (!ws.userId) return;
        
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        
        this.rooms.get(roomId).add(ws.userId);
        ws.rooms.add(roomId);
        
        console.log(`📝 ${ws.username} joined room: ${roomId}`);
    }
    
    leaveRoom(ws, roomId) {
        if (!ws.userId) return;
        
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(ws.userId);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }
        
        ws.rooms.delete(roomId);
        
        console.log(`📤 ${ws.username} left room: ${roomId}`);
    }
    
    async handleStatusUpdate(ws, data) {
        if (!ws.userId) return;
        
        try {
            const { activity, isOnline } = data;
            
            await User.findByIdAndUpdate(ws.userId, {
                'profile.currentActivity': activity,
                isOnline: isOnline !== undefined ? isOnline : true,
                lastSeen: new Date('2025-08-06 14:13:14')
            });
            
            // Broadcast status update
            this.broadcastToRoom('general', {
                type: 'status_updated',
                userId: ws.userId,
                username: ws.username,
                activity,
                isOnline,
                timestamp: '2025-08-06 14:13:14'
            }, ws.userId);
            
        } catch (error) {
            console.error('Status update error:', error);
        }
    }
    
    handleTypingStatus(ws, data, isTyping) {
        if (!ws.userId || !data.roomId) return;
        
        this.broadcastToRoom(data.roomId, {
            type: 'typing_status',
            userId: ws.userId,
            username: ws.username,
            isTyping,
            timestamp: '2025-08-06 14:13:14'
        }, ws.userId);
    }
    
    async handleJack026Command(ws, data) {
        const { command, payload } = data;
        
        console.log(`👑 Jack026 command executed: ${command} at 2025-08-06 14:13:14`);
        
        switch (command) {
            case 'broadcast_announcement':
                await this.broadcastAnnouncement(payload);
                break;
                
            case 'update_user_role':
                await this.updateUserRole(payload);
                break;
                
            case 'send_notification':
                await this.sendNotificationToUser(payload);
                break;
                
            case 'get_online_users':
                this.sendOnlineUsers(ws);
                break;
                
            case 'force_disconnect':
                this.forceDisconnectUser(payload.userId);
                break;
                
            default:
                this.sendToClient(ws, {
                    type: 'command_error',
                    message: `Unknown command: ${command}`,
                    timestamp: '2025-08-06 14:13:14'
                });
        }
    }
    
    async broadcastAnnouncement(payload) {
        const { message, priority = 'medium', targetRole } = payload;
        
        const announcement = {
            type: 'announcement',
            message,
            priority,
            from: 'Jack026',
            timestamp: '2025-08-06 14:13:14'
        };
        
        if (targetRole) {
            // Send to specific role
            const users = await User.find({ role: targetRole }).select('_id');
            users.forEach(user => {
                this.sendToUser(user._id.toString(), announcement);
            });
        } else {
            // Send to all connected users
            this.broadcastToAll(announcement);
        }
        
        console.log(`📢 Jack026 sent announcement: "${message}" at 2025-08-06 14:13:14`);
    }
    
    async updateUserRole(payload) {
        const { userId, newRole } = payload;
        
        try {
            await User.findByIdAndUpdate(userId, { role: newRole });
            
            this.sendToUser(userId, {
                type: 'role_updated',
                newRole,
                updatedBy: 'Jack026',
                timestamp: '2025-08-06 14:13:14'
            });
            
            console.log(`👤 Jack026 updated user ${userId} role to ${newRole} at 2025-08-06 14:13:14`);
            
        } catch (error) {
            console.error('Role update error:', error);
        }
    }
    
    async sendNotificationToUser(payload) {
        const { userId, title, message, type = 'system_announcement' } = payload;
        
        try {
            const notification = new Notification({
                recipientId: userId,
                senderId: this.jack026UserId,
                type,
                title,
                message,
                metadata: {
                    fromJack026: true,
                    priority: 'high'
                }
            });
            
            await notification.save();
            
            this.sendToUser(userId, {
                type: 'new_notification',
                notification: {
                    id: notification._id,
                    title,
                    message,
                    type,
                    createdAt: notification.createdAt
                },
                timestamp: '2025-08-06 14:13:14'
            });
            
            console.log(`📬 Jack026 sent notification to user ${userId} at 2025-08-06 14:13:14`);
            
        } catch (error) {
            console.error('Notification send error:', error);
        }
    }
    
    sendOnlineUsers(ws) {
        const onlineUsers = Array.from(this.clients.entries()).map(([userId, clientWs]) => ({
            userId,
            username: clientWs.username,
            rooms: Array.from(clientWs.rooms)
        }));
        
        this.sendToClient(ws, {
            type: 'online_users',
            users: onlineUsers,
            count: onlineUsers.length,
            timestamp: '2025-08-06 14:13:14'
        });
    }
    
    forceDisconnectUser(userId) {
        const clientWs = this.clients.get(userId);
        if (clientWs) {
            this.sendToClient(clientWs, {
                type: 'forced_disconnect',
                reason: 'Disconnected by administrator',
                by: 'Jack026',
                timestamp: '2025-08-06 14:13:14'
            });
            
            setTimeout(() => {
                clientWs.close();
            }, 1000);
            
            console.log(`🚫 Jack026 force disconnected user ${userId} at 2025-08-06 14:13:14`);
        }
    }
    
    sendToClient(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }
    
    sendToUser(userId, data) {
        const ws = this.clients.get(userId);
        if (ws) {
            this.sendToClient(ws, data);
        }
    }
    
    broadcastToRoom(roomId, data, excludeUserId = null) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.forEach(userId => {
                if (userId !== excludeUserId) {
                    this.sendToUser(userId, data);
                }
            });
        }
    }
    
    broadcastToAll(data, excludeUserId = null) {
        this.clients.forEach((ws, userId) => {
            if (userId !== excludeUserId) {
                this.sendToClient(ws, data);
            }
        });
    }
    
    startHeartbeat() {
        setInterval(() => {
            this.wss.clients.forEach(ws => {
                if (!ws.isAlive) {
                    console.log(`💔 Terminating inactive connection for ${ws.username || 'unknown'}`);
                    return ws.terminate();
                }
                
                ws.isAlive = false;
                ws.ping();
            });
        }, this.heartbeatInterval);
    }
    
    // Public methods for external use
    notifyAchievementEarned(userId, achievement) {
        this.sendToUser(userId, {
            type: 'achievement_earned',
            achievement,
            timestamp: '2025-08-06 14:13:14'
        });
        
        // Also broadcast to general room for Jack026
        if (userId === this.jack026UserId) {
            this.broadcastToRoom('general', {
                type: 'jack026_achievement',
                achievement,
                timestamp: '2025-08-06 14:13:14'
            }, userId);
        }
    }
    
    notifyProjectUpdate(userId, project) {
        this.sendToUser(userId, {
            type: 'project_updated',
            project,
            timestamp: '2025-08-06 14:13:14'
        });
    }
    
    notifyCollaborationRequest(recipientId, request) {
        this.sendToUser(recipientId, {
            type: 'collaboration_request',
            request,
            timestamp: '2025-08-06 14:13:14'
        });
    }
    
    notifyMentorshipUpdate(userId, mentorship) {
        this.sendToUser(userId, {
            type: 'mentorship_update',
            mentorship,
            timestamp: '2025-08-06 14:13:14'
        });
    }
    
    getStats() {
        return {
            connectedClients: this.clients.size,
            activeRooms: this.rooms.size,
            jack026Online: this.clients.has(this.jack026UserId),
            uptime: process.uptime(),
            timestamp: '2025-08-06 14:13:14'
        };
    }
}

// Create singleton instance
const wsServer = new Jack026WebSocketServer();

module.exports = wsServer;