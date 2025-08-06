const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String
    },
    category: {
        type: String,
        required: true,
        enum: ['Web Development', 'Mobile App', 'AI/ML', 'Blockchain', 'IoT', 'Game Development', 'Data Science']
    },
    technologies: [{
        type: String,
        required: true
    }],
    githubUrl: {
        type: String
    },
    liveUrl: {
        type: String
    },
    image: {
        type: String,
        default: '/images/default-project.jpg'
    },
    screenshots: [{
        type: String
    }],
    team: [{
        name: String,
        role: String,
        github: String
    }],
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'archived'],
        default: 'in-progress'
    },
    featured: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);