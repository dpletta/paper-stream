const fetch = require('node-fetch');
const MockPaperSource = require('./mockPaperSource');

class PaperAggregator {
    constructor(cacheManager) {
        this.cache = cacheManager;
        this.sources = {
            arxiv: new ArxivSource(),
            openalex: new OpenAlexSource(),
            semanticScholar: new SemanticScholarSource()
        };
        this.mockSource = new MockPaperSource();
        this.useMockData = false;
    }

    async aggregatePapers(tags, includePreprints = true, lastUpdate = null) {
        const allPapers = [];
        let successfulSources = 0;

        // Try to fetch from external sources first
        const promises = Object.entries(this.sources).map(async ([sourceName, source]) => {
            try {
                console.log(`Fetching from ${sourceName}...`);
                const papers = await source.fetchPapers(tags, includePreprints);
                return { sourceName, papers, success: true };
            } catch (error) {
                console.error(`Error fetching from ${sourceName}:`, error.message);
                return { sourceName, papers: [], success: false };
            }
        });

        const results = await Promise.allSettled(promises);
        
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                if (result.value.success) {
                    successfulSources++;
                }
                if (result.value.papers && result.value.papers.length > 0) {
                    allPapers.push(...result.value.papers);
                }
            }
        });

        // If no papers from external sources (e.g., in sandboxed environment), use mock data
        if (allPapers.length === 0 || successfulSources === 0) {
            console.log('External APIs unavailable, using mock data for demonstration...');
            this.useMockData = true;
            const mockPapers = await this.mockSource.fetchPapers(tags, includePreprints);
            allPapers.push(...mockPapers);
        }

        // Deduplicate papers
        const deduplicatedPapers = this.deduplicatePapers(allPapers);
        
        // Sort by publication date (newest first)
        deduplicatedPapers.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        
        // Apply diff-based filtering if lastUpdate is provided
        let filteredPapers = deduplicatedPapers;
        if (lastUpdate) {
            const lastUpdateDate = new Date(lastUpdate);
            filteredPapers = deduplicatedPapers.filter(paper => 
                new Date(paper.publishedDate) > lastUpdateDate
            );
        }

        const sourceInfo = this.useMockData ? 'mock data' : `${successfulSources} external sources`;
        console.log(`Aggregated ${filteredPapers.length} papers from ${sourceInfo}`);
        
        return filteredPapers.slice(0, 50); // Limit to 50 most recent papers
    }

    deduplicatePapers(papers) {
        const seenTitles = new Set();
        const seenArxivIds = new Set();
        const seenDois = new Set();
        
        return papers.filter(paper => {
            // Normalize title for comparison
            const normalizedTitle = paper.title.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Check for duplicates by title, arXiv ID, or DOI
            if (seenTitles.has(normalizedTitle)) return false;
            if (paper.arxivId && seenArxivIds.has(paper.arxivId)) return false;
            if (paper.doi && seenDois.has(paper.doi)) return false;
            
            // Add to seen sets
            seenTitles.add(normalizedTitle);
            if (paper.arxivId) seenArxivIds.add(paper.arxivId);
            if (paper.doi) seenDois.add(paper.doi);
            
            return true;
        });
    }

    async updateCache() {
        // This could be enhanced to update cache for popular tags
        console.log('Cache update completed (placeholder)');
    }
}

// ArXiv API Source
class ArxivSource {
    async fetchPapers(tags, includePreprints) {
        const query = tags.map(tag => `all:"${tag}"`).join(' OR ');
        const url = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending`;
        
        const response = await fetch(url);
        const xmlText = await response.text();
        
        return this.parseArxivXml(xmlText);
    }

    parseArxivXml(xmlText) {
        const papers = [];
        
        // Simple XML parsing (in production, use a proper XML parser)
        const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        
        entryMatches.forEach(entry => {
            try {
                const title = this.extractXmlContent(entry, 'title');
                const summary = this.extractXmlContent(entry, 'summary');
                const published = this.extractXmlContent(entry, 'published');
                const authors = this.extractXmlAuthors(entry);
                const id = this.extractXmlContent(entry, 'id');
                const arxivId = id.split('/').pop();
                
                if (title && summary) {
                    papers.push({
                        title: title.replace(/\s+/g, ' ').trim(),
                        abstract: summary.replace(/\s+/g, ' ').trim(),
                        authors,
                        publishedDate: published ? new Date(published).toISOString().split('T')[0] : '',
                        url: id,
                        source: 'arXiv',
                        isPreprint: true,
                        arxivId,
                        doi: null
                    });
                }
            } catch (error) {
                console.error('Error parsing arXiv entry:', error);
            }
        });
        
        return papers;
    }

    extractXmlContent(xml, tag) {
        const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return match ? match[1].trim() : '';
    }

    extractXmlAuthors(xml) {
        const authorMatches = xml.match(/<author>[\s\S]*?<\/author>/g) || [];
        return authorMatches.map(author => {
            const name = this.extractXmlContent(author, 'name');
            return name;
        }).filter(name => name);
    }
}

// OpenAlex API Source
class OpenAlexSource {
    async fetchPapers(tags, includePreprints) {
        const papers = [];
        
        for (const tag of tags.slice(0, 3)) { // Limit to 3 tags to avoid rate limits
            try {
                const query = encodeURIComponent(tag);
                const url = `https://api.openalex.org/works?search=${query}&sort=publication_date:desc&per_page=10&filter=publication_year:2023-2024`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.results) {
                    const tagPapers = data.results.map(work => ({
                        title: work.title || 'Untitled',
                        abstract: work.abstract || work.display_name || '',
                        authors: work.authorships?.map(a => a.author?.display_name).filter(Boolean) || [],
                        publishedDate: work.publication_date || '',
                        url: work.doi ? `https://doi.org/${work.doi}` : work.landing_page_url || '',
                        source: 'OpenAlex',
                        isPreprint: work.type === 'preprint',
                        arxivId: null,
                        doi: work.doi
                    })).filter(paper => includePreprints || !paper.isPreprint);
                    
                    papers.push(...tagPapers);
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`Error fetching OpenAlex papers for tag "${tag}":`, error);
            }
        }
        
        return papers;
    }
}

// Semantic Scholar API Source
class SemanticScholarSource {
    async fetchPapers(tags, includePreprints) {
        const papers = [];
        
        for (const tag of tags.slice(0, 2)) { // Limit to 2 tags
            try {
                const query = encodeURIComponent(tag);
                const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=10&sort=publicationDate:desc&fields=title,abstract,authors,publicationDate,url,isOpenAccess,venue`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.data) {
                    const tagPapers = data.data.map(paper => ({
                        title: paper.title || 'Untitled',
                        abstract: paper.abstract || '',
                        authors: paper.authors?.map(a => a.name).filter(Boolean) || [],
                        publishedDate: paper.publicationDate || '',
                        url: paper.url || '',
                        source: 'Semantic Scholar',
                        isPreprint: paper.venue?.includes('arXiv') || false,
                        arxivId: null,
                        doi: null
                    })).filter(paper => includePreprints || !paper.isPreprint);
                    
                    papers.push(...tagPapers);
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (error) {
                console.error(`Error fetching Semantic Scholar papers for tag "${tag}":`, error);
            }
        }
        
        return papers;
    }
}

module.exports = PaperAggregator;