const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        const { category, status, featured, limit = 10, page = 1 } = req.query;
        const query = {};
        
        if (category) query.category = category;
        if (status) query.status = status;
        if (featured) query.featured = featured === 'true';
        
        const events = await Event.find(query)
            .sort({ date: status === 'completed' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Event.countDocuments(query);
        
        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register for event
router.post('/:id/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('department').trim().notEmpty().withMessage('Department is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (!event.registrationOpen) {
            return res.status(400).json({ error: 'Registration is closed for this event' });
        }

        if (event.registered >= event.capacity) {
            return res.status(400).json({ error: 'Event is full' });
        }

        // Here you would typically save the registration to a separate collection
        // For now, we'll just increment the registered count
        event.registered += 1;
        await event.save();

        res.json({ message: 'Successfully registered for the event' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;