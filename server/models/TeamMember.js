const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    image: {
        type: String,
        default: '/images/default-avatar.jpg'
    },
    social: {
        github: String,
        linkedin: String,
        twitter: String,
        instagram: String,
        portfolio: String
    },
    achievements: [{
        title: String,
        description: String,
        date: Date
    }],
    position: {
        type: String,
        enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Lead', 'Creative Head', 'Event Manager', 'Member'],
        default: 'Member'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

teamMemberSchema.index({ position: 1 });
teamMemberSchema.index({ isActive: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);