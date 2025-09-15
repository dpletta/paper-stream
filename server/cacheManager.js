const fs = require('fs').promises;
const path = require('path');

class CacheManager {
    constructor() {
        this.cacheDir = path.join(__dirname, '../cache');
        this.ensureCacheDir();
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes in milliseconds
    }

    async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.error('Error creating cache directory:', error);
        }
    }

    generateCacheKey(tags, includePreprints) {
        const sortedTags = [...tags].sort().join(',');
        return `papers_${sortedTags}_${includePreprints}`;
    }

    async get(key) {
        try {
            // Check in-memory cache first
            if (this.cache.has(key)) {
                const cached = this.cache.get(key);
                if (Date.now() - cached.timestamp < this.cacheExpiry) {
                    console.log(`Cache hit (memory): ${key}`);
                    return cached.data;
                } else {
                    this.cache.delete(key);
                }
            }

            // Check file cache
            const filePath = path.join(this.cacheDir, `${key}.json`);
            const fileContent = await fs.readFile(filePath, 'utf8');
            const cached = JSON.parse(fileContent);
            
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                console.log(`Cache hit (file): ${key}`);
                // Store in memory for faster future access
                this.cache.set(key, cached);
                return cached.data;
            } else {
                // Delete expired file cache
                await fs.unlink(filePath).catch(() => {});
                return null;
            }
        } catch (error) {
            // Cache miss or error
            return null;
        }
    }

    async set(key, data) {
        try {
            const cached = {
                data,
                timestamp: Date.now()
            };

            // Store in memory
            this.cache.set(key, cached);

            // Store in file
            const filePath = path.join(this.cacheDir, `${key}.json`);
            await fs.writeFile(filePath, JSON.stringify(cached, null, 2));
            
            console.log(`Cache set: ${key}`);
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }

    async clear() {
        try {
            // Clear memory cache
            this.cache.clear();

            // Clear file cache
            const files = await fs.readdir(this.cacheDir);
            const deletePromises = files
                .filter(file => file.endsWith('.json'))
                .map(file => fs.unlink(path.join(this.cacheDir, file)));
            
            await Promise.all(deletePromises);
            console.log('Cache cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    async cleanExpired() {
        try {
            // Clean memory cache
            for (const [key, cached] of this.cache.entries()) {
                if (Date.now() - cached.timestamp >= this.cacheExpiry) {
                    this.cache.delete(key);
                }
            }

            // Clean file cache
            const files = await fs.readdir(this.cacheDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(this.cacheDir, file);
                        const fileContent = await fs.readFile(filePath, 'utf8');
                        const cached = JSON.parse(fileContent);
                        
                        if (Date.now() - cached.timestamp >= this.cacheExpiry) {
                            await fs.unlink(filePath);
                            console.log(`Cleaned expired cache: ${file}`);
                        }
                    } catch (error) {
                        // Delete corrupted cache files
                        await fs.unlink(path.join(this.cacheDir, file));
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning expired cache:', error);
        }
    }

    getStats() {
        return {
            memoryEntries: this.cache.size,
            cacheExpiry: this.cacheExpiry,
            lastCleanup: new Date().toISOString()
        };
    }

    // Get diff-based updates - returns only new papers since lastUpdate
    async getDiff(key, lastUpdate, newData) {
        if (!lastUpdate) {
            return newData; // Return all data if no lastUpdate
        }

        try {
            const lastUpdateDate = new Date(lastUpdate);
            return newData.filter(paper => {
                const paperDate = new Date(paper.publishedDate);
                return paperDate > lastUpdateDate;
            });
        } catch (error) {
            console.error('Error calculating diff:', error);
            return newData; // Return all data on error
        }
    }
}

module.exports = CacheManager;