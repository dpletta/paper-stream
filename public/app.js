class PaperStreamApp {
    constructor() {
        this.tags = JSON.parse(localStorage.getItem('researchTags') || '[]');
        this.includePreprints = JSON.parse(localStorage.getItem('includePreprints') || 'true');
        this.papers = [];
        this.lastUpdate = localStorage.getItem('lastUpdate') || null;
        
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
            retryBtn: document.getElementById('retry-btn')
        };
        
        this.elements.includePreprints.checked = this.includePreprints;
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
            this.papers = data.papers;
            this.lastUpdate = data.timestamp;
            localStorage.setItem('lastUpdate', this.lastUpdate);
            
            this.renderPapers();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading papers:', error);
            this.showError();
        }
    }

    async refreshFeed() {
        this.lastUpdate = null;
        localStorage.removeItem('lastUpdate');
        await this.loadPapers();
    }

    renderPapers() {
        if (this.papers.length === 0) {
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

        const papersHTML = this.papers.map(paper => `
            <div class="paper-card">
                <h3 class="paper-title">
                    <a href="${paper.url}" target="_blank" rel="noopener noreferrer">
                        ${this.escapeHtml(paper.title)}
                    </a>
                </h3>
                <div class="paper-authors">${this.escapeHtml(paper.authors.join(', '))}</div>
                <div class="paper-meta">
                    <span class="paper-source">${paper.source}</span>
                    <span>${paper.publishedDate}</span>
                    ${paper.isPreprint ? '<span style="color: #f59e0b;">Pre-print</span>' : ''}
                </div>
                <div class="paper-abstract">${this.escapeHtml(paper.abstract)}</div>
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

    showError() {
        this.elements.loading.classList.add('hidden');
        this.elements.error.classList.remove('hidden');
        this.elements.papersContainer.innerHTML = '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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