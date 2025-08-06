const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Meetup']
    },
    date: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        default: 50
    },
    registered: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: '/images/default-event.jpg'
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    organizer: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    registrationOpen: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ featured: 1 });

module.exports = mongoose.model('Event', eventSchema);