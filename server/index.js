const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const PaperAggregator = require('./paperAggregator');
const CacheManager = require('./cacheManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize services
const cacheManager = new CacheManager();
const paperAggregator = new PaperAggregator(cacheManager);

// API Routes
app.get('/api/papers', async (req, res) => {
    try {
        const { tags, includePreprints = 'true', lastUpdate } = req.query;
        
        if (!tags) {
            return res.status(400).json({ 
                error: 'Tags parameter is required',
                papers: [],
                timestamp: new Date().toISOString()
            });
        }
        
        const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
        const includePreprintsFlag = includePreprints === 'true';
        
        console.log(`Fetching papers for tags: ${tagList.join(', ')}, preprints: ${includePreprintsFlag}`);
        
        const papers = await paperAggregator.aggregatePapers(
            tagList, 
            includePreprintsFlag,
            lastUpdate
        );
        
        res.json({
            papers,
            timestamp: new Date().toISOString(),
            count: papers.length
        });
        
    } catch (error) {
        console.error('Error in /api/papers:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            papers: [],
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        cache: cacheManager.getStats()
    });
});

// Serve the main app for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Schedule periodic cache updates (every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
    console.log('Running scheduled cache update...');
    try {
        await paperAggregator.updateCache();
        console.log('Cache update completed');
    } catch (error) {
        console.error('Error during scheduled cache update:', error);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Paper Stream server running on http://localhost:${PORT}`);
    console.log('Starting initial cache warm-up...');
    
    // Initial cache warm-up
    setTimeout(async () => {
        try {
            await paperAggregator.updateCache();
            console.log('Initial cache warm-up completed');
        } catch (error) {
            console.error('Error during initial cache warm-up:', error);
        }
    }, 5000);
});

module.exports = app;