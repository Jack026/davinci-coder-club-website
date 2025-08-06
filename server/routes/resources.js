const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Mock database - replace with actual database
let resources = [
    {
        _id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Complete guide to JavaScript basics and advanced concepts',
        category: 'tutorials',
        difficulty: 'beginner',
        technology: 'javascript',
        type: 'video',
        url: 'https://youtube.com/watch?v=example',
        downloadUrl: null,
        thumbnail: '/images/resources/js-fundamentals.jpg',
        author: 'Da-Vinci Team',
        duration: '2 hours',
        rating: 4.8,
        views: 1250,
        featured: true,
        tags: ['javascript', 'programming', 'web-development'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-07-20')
    },
    {
        _id: '2',
        title: 'React Hooks Guide',
        description: 'Master React Hooks with practical examples and best practices',
        category: 'documentation',
        difficulty: 'intermediate',
        technology: 'react',
        type: 'article',
        url: '/docs/react-hooks-guide.pdf',
        downloadUrl: '/downloads/react-hooks-guide.pdf',
        thumbnail: '/images/resources/react-hooks.jpg',
        author: 'Priya Devi',
        duration: '45 min read',
        rating: 4.9,
        views: 890,
        featured: true,
        tags: ['react', 'hooks', 'frontend'],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-06-15')
    },
    {
        _id: '3',
        title: 'Python Data Science Toolkit',
        description: 'Essential Python libraries and tools for data science',
        category: 'tools',
        difficulty: 'intermediate',
        technology: 'python',
        type: 'tool',
        url: 'https://github.com/davinci-coder-club/python-ds-toolkit',
        downloadUrl: '/downloads/python-ds-toolkit.zip',
        thumbnail: '/images/resources/python-ds.jpg',
        author: 'Ananya Sharma',
        duration: 'Tool',
        rating: 4.7,
        views: 650,
        featured: false,
        tags: ['python', 'data-science', 'pandas', 'numpy'],
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-08-01')
    }
];

// Get all resources
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            difficulty, 
            technology, 
            featured, 
            search,
            sort = 'recent',
            limit = 12, 
            page = 1 
        } = req.query;

        let filteredResources = [...resources];

        // Apply filters
        if (category && category !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.category === category
            );
        }

        if (difficulty && difficulty !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.difficulty === difficulty
            );
        }

        if (technology && technology !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.technology === technology
            );
        }

        if (featured === 'true') {
            filteredResources = filteredResources.filter(resource => 
                resource.featured === true
            );
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            filteredResources = filteredResources.filter(resource => 
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Apply sorting
        switch (sort) {
            case 'popular':
                filteredResources.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                filteredResources.sort((a, b) => b.rating - a.rating);
                break;
            case 'alphabetical':
                filteredResources.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'recent':
            default:
                filteredResources.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedResources = filteredResources.slice(startIndex, endIndex);

        res.json({
            resources: paginatedResources,
            totalResources: filteredResources.length,
            totalPages: Math.ceil(filteredResources.length / limit),
            currentPage: parseInt(page),
            hasNext: endIndex < filteredResources.length,
            hasPrev: startIndex > 0
        });

    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Get single resource
router.get('/:id', async (req, res) => {
    try {
        const resource = resources.find(r => r._id === req.params.id);
        
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Increment view count
        resource.views += 1;

        res.json(resource);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
});

// Track resource download
router.post('/:id/download', async (req, res) => {
    try {
        const resource = resources.find(r => r._id === req.params.id);
        
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        if (!resource.downloadUrl) {
            return res.status(400).json({ error: 'Resource is not downloadable' });
        }

        // Track download analytics here
        
        res.json({ 
            message: 'Download tracked successfully',
            downloadUrl: resource.downloadUrl 
        });
    } catch (error) {
        console.error('Error tracking download:', error);
        res.status(500).json({ error: 'Failed to track download' });
    }
});

// Rate resource
router.post('/:id/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const resource = resources.find(r => r._id === req.params.id);
        
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // In a real app, you'd store individual ratings and calculate average
        // For now, we'll just update the rating
        resource.rating = ((resource.rating * 10) + rating) / 11; // Simple average

        res.json({ 
            message: 'Rating submitted successfully',
            newRating: resource.rating 
        });
    } catch (error) {
        console.error('Error rating resource:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/resources/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Submit new resource
router.post('/submit', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            technology,
            type,
            url,
            author,
            tags
        } = req.body;

        const newResource = {
            _id: (resources.length + 1).toString(),
            title,
            description,
            category,
            difficulty,
            technology,
            type,
            url: url || (req.files.file ? `/uploads/resources/${req.files.file[0].filename}` : null),
            downloadUrl: req.files.file ? `/uploads/resources/${req.files.file[0].filename}` : null,
            thumbnail: req.files.thumbnail ? `/uploads/resources/${req.files.thumbnail[0].filename}` : '/images/default-resource.jpg',
            author,
            duration: type === 'video' ? 'TBD' : 'TBD',
            rating: 0,
            views: 0,
            featured: false,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        resources.push(newResource);

        res.status(201).json({
            message: 'Resource submitted successfully! It will be reviewed and published soon.',
            resource: newResource
        });

    } catch (error) {
        console.error('Error submitting resource:', error);
        res.status(500).json({ error: 'Failed to submit resource' });
    }
});

// Get resource categories with counts
router.get('/stats/categories', async (req, res) => {
    try {
        const categoryStats = resources.reduce((acc, resource) => {
            acc[resource.category] = (acc[resource.category] || 0) + 1;
            return acc;
        }, {});

        res.json(categoryStats);
    } catch (error) {
        console.error('Error fetching category stats:', error);
        res.status(500).json({ error: 'Failed to fetch category statistics' });
    }
});

module.exports = router;