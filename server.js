const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'"],
        },
    },
}));

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// MongoDB connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

// Serve static files with proper paths
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/docs', express.static(path.join(__dirname, 'public/docs')));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/events', require('./server/routes/events'));
app.use('/api/projects', require('./server/routes/projects'));
app.use('/api/team', require('./server/routes/team'));
app.use('/api/contact', require('./server/routes/contact'));
app.use('/api/resources', require('./server/routes/resources'));
app.use('/api/newsletter', require('./server/routes/newsletter'));
app.use('/api/admin', require('./server/routes/admin'));

// Serve HTML pages
const pages = ['', 'about', 'events', 'projects', 'resources', 'team', 'contact'];
pages.forEach(page => {
    const route = page === '' ? '/' : `/${page}`;
    const file = page === '' ? 'index.html' : `${page}.html`;
    
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', file));
    });
});

// Special files
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/robots.txt'));
});

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/manifest.json'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        user: 'Jack026'
    });
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log('🚀 Da-Vinci Coder Club Server Started!');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`👤 User: Jack026`);
    console.log(`📅 ${new Date().toISOString()}`);
});