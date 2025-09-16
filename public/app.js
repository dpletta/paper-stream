class PaperStreamApp {
    constructor() {
        this.tags = JSON.parse(localStorage.getItem('researchTags') || '[]');
        this.includePreprints = JSON.parse(localStorage.getItem('includePreprints') || 'true');
        this.papers = [];
        this.filteredPapers = [];
        this.searchQuery = '';
        this.lastUpdate = localStorage.getItem('lastUpdate') || null;
        this.filters = {
            source: localStorage.getItem('filterSource') || 'all',
            dateRange: localStorage.getItem('filterDateRange') || 'all',
            sortBy: localStorage.getItem('filterSortBy') || 'date'
        };
        
        // Magic UI components
        this.magicUI = {
            textShimmer: null,
            particles: null,
            animatedList: null,
            shimmerButtons: [],
            warpBackground: null
        };

        this.initializeElements();
        this.bindEvents();
        this.loadTags();
        this.registerServiceWorker();
        this.initializeMagicUI();

        // Load papers if we have tags
        if (this.tags.length > 0) {
            this.loadPapers();
        }
    }

    initializeElements() {
        this.elements = {
            settingsBtn: document.getElementById('settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),
            closeSettingsBtn: document.getElementById('close-settings-btn'),
            tagInput: document.getElementById('tag-input'),
            addTagBtn: document.getElementById('add-tag-btn'),
            tagsList: document.getElementById('tags-list'),
            includePreprints: document.getElementById('include-preprints'),
            refreshFeedBtn: document.getElementById('refresh-feed-btn'),
            papersContainer: document.getElementById('papers-container'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            retryBtn: document.getElementById('retry-btn'),
            sourceFilter: document.getElementById('source-filter'),
            dateRangeFilter: document.getElementById('date-range'),
            sortByFilter: document.getElementById('sort-by'),
            searchInput: document.getElementById('search-input'),
            searchBtn: document.getElementById('search-btn'),
            viewBookmarksBtn: document.getElementById('view-bookmarks-btn')
        };
        
        this.elements.includePreprints.checked = this.includePreprints;
        this.elements.sourceFilter.value = this.filters.source;
        this.elements.dateRangeFilter.value = this.filters.dateRange;
        this.elements.sortByFilter.value = this.filters.sortBy;
    }

    bindEvents() {
        this.elements.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.elements.closeSettingsBtn.addEventListener('click', () => this.toggleSettings());
        this.elements.addTagBtn.addEventListener('click', () => this.addTag());
        this.elements.tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTag();
        });
        this.elements.includePreprints.addEventListener('change', () => this.updatePreprintSetting());
        this.elements.refreshFeedBtn.addEventListener('click', () => this.refreshFeed());
        this.elements.retryBtn.addEventListener('click', () => this.loadPapers());
        this.elements.viewBookmarksBtn.addEventListener('click', () => this.showBookmarks());
        
        // Filter event listeners
        this.elements.sourceFilter.addEventListener('change', () => this.updateFilters());
        this.elements.dateRangeFilter.addEventListener('change', () => this.updateFilters());
        this.elements.sortByFilter.addEventListener('change', () => this.updateFilters());
        
        // Search event listeners
        this.elements.searchBtn.addEventListener('click', () => this.performSearch());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        this.elements.searchInput.addEventListener('input', () => this.handleSearchInput());
    }

    toggleSettings() {
        this.elements.settingsPanel.classList.toggle('hidden');
    }

    addTag() {
        const tag = this.elements.tagInput.value.trim().toLowerCase();
        if (tag && !this.tags.includes(tag)) {
            this.tags.push(tag);
            this.saveTags();
            this.loadTags();
            this.elements.tagInput.value = '';
            
            // Auto-refresh if this is the first tag
            if (this.tags.length === 1) {
                this.loadPapers();
            }
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.saveTags();
        this.loadTags();
        
        // Reload papers with updated tags
        if (this.tags.length > 0) {
            this.loadPapers();
        } else {
            this.showWelcomeMessage();
        }
    }

    loadTags() {
        this.elements.tagsList.innerHTML = '';
        this.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <button class="tag-remove" onclick="app.removeTag('${tag}')">×</button>
            `;
            this.elements.tagsList.appendChild(tagElement);
        });
    }

    saveTags() {
        localStorage.setItem('researchTags', JSON.stringify(this.tags));
    }

    updatePreprintSetting() {
        this.includePreprints = this.elements.includePreprints.checked;
        localStorage.setItem('includePreprints', JSON.stringify(this.includePreprints));
        
        // Reload papers with updated setting
        if (this.tags.length > 0) {
            this.loadPapers();
        }
    }

    async loadPapers() {
        if (this.tags.length === 0) {
            this.showWelcomeMessage();
            return;
        }

        this.showLoading();
        
        try {
            const queryParams = new URLSearchParams({
                tags: this.tags.join(','),
                includePreprints: this.includePreprints,
                lastUpdate: this.lastUpdate || ''
            });
            
            const response = await fetch(`/api/papers?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.papers = data.papers || [];
            this.lastUpdate = data.timestamp;
            localStorage.setItem('lastUpdate', this.lastUpdate);
            
            this.applyFilters();
            this.renderPapers();
            this.hideLoading();
            
            // Show success message if papers were loaded
            if (this.papers.length > 0) {
                this.showNotification(`Loaded ${this.papers.length} papers`, 'success');
            }
            
        } catch (error) {
            console.error('Error loading papers:', error);
            this.showError(error.message);
        }
    }

    async refreshFeed() {
        this.lastUpdate = null;
        localStorage.removeItem('lastUpdate');
        await this.loadPapers();
    }

    updateFilters() {
        this.filters.source = this.elements.sourceFilter.value;
        this.filters.dateRange = this.elements.dateRangeFilter.value;
        this.filters.sortBy = this.elements.sortByFilter.value;
        
        // Save filters to localStorage
        localStorage.setItem('filterSource', this.filters.source);
        localStorage.setItem('filterDateRange', this.filters.dateRange);
        localStorage.setItem('filterSortBy', this.filters.sortBy);
        
        this.applyFilters();
        this.renderPapers();
    }

    applyFilters() {
        let filtered = [...this.papers];
        
        // Apply search filter first
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(paper => 
                paper.title.toLowerCase().includes(query) ||
                paper.abstract.toLowerCase().includes(query) ||
                paper.authors.some(author => author.toLowerCase().includes(query))
            );
        }
        
        // Filter by source
        if (this.filters.source !== 'all') {
            filtered = filtered.filter(paper => paper.source === this.filters.source);
        }
        
        // Filter by date range
        if (this.filters.dateRange !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();
            
            switch (this.filters.dateRange) {
                case 'week':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filtered = filtered.filter(paper => {
                const paperDate = new Date(paper.publishedDate);
                return paperDate >= cutoffDate;
            });
        }
        
        // Sort papers
        filtered.sort((a, b) => {
            switch (this.filters.sortBy) {
                case 'date':
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                case 'source':
                    return a.source.localeCompare(b.source);
                case 'relevance':
                    // Simple relevance based on title length and abstract length
                    const aRelevance = a.title.length + a.abstract.length;
                    const bRelevance = b.title.length + b.abstract.length;
                    return bRelevance - aRelevance;
                default:
                    return 0;
            }
        });
        
        this.filteredPapers = filtered;
    }

    performSearch() {
        this.searchQuery = this.elements.searchInput.value.trim();
        this.applyFilters();
        this.renderPapers();
    }

    handleSearchInput() {
        // Debounced search for better performance
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }

    renderPapers() {
        const papersToRender = this.filteredPapers.length > 0 ? this.filteredPapers : this.papers;
        
        if (papersToRender.length === 0) {
            const noPapersHTML = `
                <div class="welcome-message">
                    <h2>No papers found</h2>
                    <p>Try adjusting your research interests or check back later for new papers.</p>
                </div>
            `;
            
            if (this.magicUI.animatedList) {
                this.magicUI.animatedList.updateItems([noPapersHTML]);
            } else {
                this.elements.papersContainer.innerHTML = noPapersHTML;
            }
            return;
        }

        const papersHTML = papersToRender.map((paper, index) => `
            <div class="paper-card" data-paper-index="${index}" onclick="app.openPaperSource('${this.escapeHtml(paper.url)}')">
                <h3 class="paper-title">
                    ${this.escapeHtml(paper.title)}
                </h3>
                <div class="paper-authors">${this.escapeHtml(paper.authors.join(', '))}</div>
                <div class="paper-meta">
                    <span class="paper-source">${paper.source}</span>
                    <span class="paper-date">${this.formatDate(paper.publishedDate)}</span>
                    ${paper.isPreprint ? '<span class="preprint-badge">Pre-print</span>' : ''}
                    ${paper.doi ? '<span class="doi-badge">DOI</span>' : ''}
                </div>
                <div class="paper-abstract">${this.escapeHtml(paper.abstract)}</div>
                <div class="paper-actions">
                    <button class="btn-read-paper" onclick="event.stopPropagation(); app.openPaperSource('${this.escapeHtml(paper.url)}')">
                        📖 Read Paper
                    </button>
                    <button class="btn-bookmark ${this.isBookmarked(index) ? 'bookmarked' : ''}" onclick="event.stopPropagation(); app.toggleBookmark(${index})" title="${this.isBookmarked(index) ? 'Remove bookmark' : 'Bookmark'}">
                        ${this.isBookmarked(index) ? '🔖' : '🔖'}
                    </button>
                </div>
            </div>
        `);

        if (this.magicUI.animatedList) {
            this.magicUI.animatedList.updateItems(papersHTML);
        } else {
            this.elements.papersContainer.innerHTML = papersHTML.join('');
        }
    }

    showWelcomeMessage() {
        this.elements.papersContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to Paper Stream!</h2>
                <p>Add your research interests in settings to start receiving personalized paper recommendations.</p>
            </div>
        `;
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.papersContainer.innerHTML = '';
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message = 'Error loading papers. Please try again.') {
        this.elements.loading.classList.add('hidden');
        this.elements.error.classList.remove('hidden');
        this.elements.papersContainer.innerHTML = '';
        
        // Update error message
        const errorElement = this.elements.error.querySelector('p');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        this.showNotification(message, 'error');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    openPaperSource(url) {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    isBookmarked(paperIndex) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPapers') || '[]');
        return bookmarks.includes(paperIndex);
    }

    toggleBookmark(paperIndex) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPapers') || '[]');
        const index = bookmarks.indexOf(paperIndex);
        
        if (index > -1) {
            bookmarks.splice(index, 1);
        } else {
            bookmarks.push(paperIndex);
        }
        
        localStorage.setItem('bookmarkedPapers', JSON.stringify(bookmarks));
        this.renderPapers(); // Re-render to update bookmark icons
    }

    showBookmarks() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPapers') || '[]');
        
        if (bookmarks.length === 0) {
            this.elements.papersContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>No bookmarks yet</h2>
                    <p>Bookmark papers by clicking the bookmark button on any paper card.</p>
                </div>
            `;
            return;
        }
        
        const bookmarkedPapers = bookmarks.map(index => this.papers[index]).filter(Boolean);
        
        if (bookmarkedPapers.length === 0) {
            this.elements.papersContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>Bookmarked papers not found</h2>
                    <p>The bookmarked papers may have been removed from the current feed.</p>
                </div>
            `;
            return;
        }
        
        const papersHTML = bookmarkedPapers.map((paper, index) => `
            <div class="paper-card bookmarked-card" data-paper-index="${index}" onclick="app.openPaperSource('${this.escapeHtml(paper.url)}')">
                <h3 class="paper-title">
                    ${this.escapeHtml(paper.title)}
                </h3>
                <div class="paper-authors">${this.escapeHtml(paper.authors.join(', '))}</div>
                <div class="paper-meta">
                    <span class="paper-source">${paper.source}</span>
                    <span class="paper-date">${this.formatDate(paper.publishedDate)}</span>
                    ${paper.isPreprint ? '<span class="preprint-badge">Pre-print</span>' : ''}
                    ${paper.doi ? '<span class="doi-badge">DOI</span>' : ''}
                    <span class="bookmark-indicator">🔖 Bookmarked</span>
                </div>
                <div class="paper-abstract">${this.escapeHtml(paper.abstract)}</div>
                <div class="paper-actions">
                    <button class="btn-read-paper" onclick="event.stopPropagation(); app.openPaperSource('${this.escapeHtml(paper.url)}')">
                        📖 Read Paper
                    </button>
                    <button class="btn-bookmark bookmarked" onclick="event.stopPropagation(); app.removeBookmark('${this.escapeHtml(paper.url)}')" title="Remove bookmark">
                        🔖
                    </button>
                </div>
            </div>
        `);

        this.elements.papersContainer.innerHTML = papersHTML.join('');
    }

    removeBookmark(paperUrl) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPapers') || '[]');
        const paperIndex = this.papers.findIndex(paper => paper.url === paperUrl);
        
        if (paperIndex !== -1) {
            const bookmarkIndex = bookmarks.indexOf(paperIndex);
            if (bookmarkIndex > -1) {
                bookmarks.splice(bookmarkIndex, 1);
                localStorage.setItem('bookmarkedPapers', JSON.stringify(bookmarks));
                this.showBookmarks(); // Refresh bookmarks view
                this.showNotification('Bookmark removed', 'info');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    initializeMagicUI() {
        // Initialize TextShimmer for main title
        const mainTitle = document.getElementById('main-title');
        if (mainTitle && window.TextShimmer) {
            this.magicUI.textShimmer = new TextShimmer(mainTitle, {
                duration: 3000,
                colors: ['#ffffff', '#e0e7ff', '#c7d2fe', '#ffffff'],
                intensity: 0.6
            });
        }

        // Initialize Particles for background
        const app = document.getElementById('app');
        if (app && window.Particles) {
            this.magicUI.particles = new Particles(app, {
                count: 30,
                speed: 0.5,
                size: 2,
                color: '#ffffff',
                opacity: 0.3,
                connectionDistance: 80,
                showConnections: true
            });
        }

        // Initialize WarpBackground
        if (app && window.WarpBackground) {
            this.magicUI.warpBackground = new WarpBackground(app, {
                intensity: 0.05,
                speed: 0.5,
                colors: ['#2563eb', '#3b82f6', '#60a5fa']
            });
        }

        // Initialize AnimatedList for papers container
        const papersContainer = document.getElementById('papers-container');
        if (papersContainer && window.AnimatedList) {
            this.magicUI.animatedList = new AnimatedList(papersContainer, {
                animationDuration: 400,
                staggerDelay: 100,
                animationType: 'fadeInUp'
            });
        }

        // Initialize ShimmerButtons for all buttons with shimmer-btn class
        const shimmerButtons = document.querySelectorAll('.shimmer-btn');
        shimmerButtons.forEach(button => {
            if (window.ShimmerButton) {
                const shimmerBtn = new ShimmerButton(button, {
                    shimmerColor: '#ffffff',
                    shimmerDuration: 1200,
                    shimmerIntensity: 0.4,
                    hoverEffect: true,
                    clickEffect: true
                });
                this.magicUI.shimmerButtons.push(shimmerBtn);
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PaperStreamApp();
});