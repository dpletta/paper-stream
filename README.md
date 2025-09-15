# Paper Stream

A progressive web application (PWA) that streams recent academic papers related to a user's research interests into a single, unified feed.

![Paper Stream Interface](https://github.com/user-attachments/assets/db49fd4f-630a-4e69-9bb6-97bbe7912d18)

## Features

### ✨ Core Functionality
- **📄 Academic Paper Aggregation**: Fetches papers from multiple sources (arXiv, OpenAlex, Semantic Scholar)
- **🏷️ Research Interest Tags**: User-defined tags for personalized paper recommendations
- **🔄 Automatic Deduplication**: Intelligent deduplication to remove duplicate papers across sources
- **⚡ Incremental Updates**: Diff-based approach for efficient feed updates
- **💾 Smart Caching**: File and memory-based caching for improved performance
- **📱 Progressive Web App**: Installable PWA with offline support

### 🎛️ User Controls
- **🔍 Research Interest Management**: Add/remove research tags dynamically
- **📋 Pre-print Toggle**: Include or exclude pre-print papers
- **🔄 Manual Refresh**: Force refresh to get latest papers
- **💾 Persistent Settings**: User preferences saved in localStorage

### 🔧 Technical Features
- **🌐 Multi-source Integration**: arXiv, OpenAlex, Semantic Scholar APIs
- **📊 RESTful API**: Clean API endpoints for paper retrieval
- **🎨 Responsive Design**: Works on desktop, tablet, and mobile
- **⚙️ Service Worker**: Offline functionality and caching
- **🕒 Scheduled Updates**: Automated periodic cache updates
- **✨ Magic UI Components**: Enhanced visual effects and animations
- **🎭 Glassmorphism Design**: Modern UI with backdrop blur effects
- **🎪 Interactive Animations**: Smooth transitions and hover effects

## Screenshots

### Settings Panel
![Settings Panel](https://github.com/user-attachments/assets/e3b16253-3bd1-44ce-809a-82e87f5fdcb8)

### Paper Feed
![Paper Feed](https://github.com/user-attachments/assets/db49fd4f-630a-4e69-9bb6-97bbe7912d18)

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd paper-stream

# Install dependencies
npm install

# Start the development server
npm start
```

### Usage
1. Open http://localhost:3000 in your browser
2. Click the "⚙️ Settings" button
3. Add your research interests (e.g., "machine learning", "artificial intelligence")
4. Toggle pre-print inclusion as desired
5. Click "Refresh Feed" to load papers
6. Browse your personalized academic paper feed!

## API Endpoints

### GET /api/papers
Retrieve papers based on research interests.

**Parameters:**
- `tags` (required): Comma-separated list of research tags
- `includePreprints` (optional): Boolean to include/exclude pre-prints (default: true)
- `lastUpdate` (optional): ISO timestamp for incremental updates

**Response:**
```json
{
  "papers": [
    {
      "title": "Paper Title",
      "abstract": "Paper abstract...",
      "authors": ["Author 1", "Author 2"],
      "publishedDate": "2024-03-15",
      "url": "https://arxiv.org/abs/...",
      "source": "arXiv",
      "isPreprint": true,
      "arxivId": "1234.5678",
      "doi": null
    }
  ],
  "timestamp": "2024-03-15T10:30:00.000Z",
  "count": 5
}
```

### GET /api/health
Check API health and cache status.

## ✨ Magic UI Integration

The Paper Stream app now includes custom Magic UI components for enhanced visual effects:

- **TextShimmer**: Animated shimmer effects on the main title
- **Particles**: Dynamic background particle system with connections
- **AnimatedList**: Smooth animations for paper cards with staggered effects
- **ShimmerButton**: Interactive shimmer effects on all buttons
- **WarpBackground**: Subtle warping background gradient

These components are automatically initialized and provide a modern, engaging user experience while maintaining excellent performance.

## 🎨 Enhanced UI Design

The application features:
- Glassmorphism design with backdrop blur effects
- Gradient backgrounds and smooth transitions
- Responsive animations and hover effects
- Modern card-based layout with enhanced shadows
- Improved color scheme and typography

## Architecture

### Frontend (PWA)
- **HTML/CSS/JavaScript**: Vanilla web technologies for maximum compatibility
- **Service Worker**: Offline functionality and caching
- **LocalStorage**: User preferences persistence
- **Responsive Design**: Mobile-first approach
- **Magic UI Components**: Custom animated components for enhanced UX

### Backend (Node.js)
- **Express.js**: RESTful API server
- **Paper Aggregation**: Multi-source paper fetching with error handling
- **Deduplication Engine**: Intelligent duplicate detection by title, arXiv ID, and DOI
- **Caching System**: File and memory-based caching with expiration
- **Scheduled Tasks**: Automatic cache updates using node-cron

### Data Sources
- **arXiv**: Pre-print repository (XML API)
- **OpenAlex**: Open academic database (REST API)
- **Semantic Scholar**: AI-powered academic search (REST API)
- **Mock Data**: Fallback for demonstration in restricted environments

## Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run test suite
npm run lint       # Run ESLint code quality checks
npm run build      # Build for production (currently a placeholder)
```

### Project Structure
```
paper-stream/
├── public/                 # Frontend PWA files
│   ├── index.html         # Main HTML page
│   ├── app.js             # Frontend JavaScript
│   ├── styles.css         # Responsive CSS
│   ├── service-worker.js  # PWA service worker
│   ├── manifest.json      # PWA manifest
│   └── components/        # Magic UI components
│       ├── text-shimmer.js
│       ├── particles.js
│       ├── animated-list.js
│       ├── shimmer-button.js
│       ├── warp-background.js
│       └── README.md
├── server/                # Backend API
│   ├── index.js           # Express server
│   ├── paperAggregator.js # Multi-source paper fetching
│   ├── cacheManager.js    # Caching system
│   └── mockPaperSource.js # Mock data for demo
├── tests/                 # Test files
├── docs/                  # Documentation
│   ├── architecture.md
│   ├── development-plan.md
│   ├── ui-style-guide.md
│   ├── logging-system.md
│   └── README.md
├── cache/                 # File cache directory (auto-created)
└── package.json           # Dependencies and scripts
```

## Features Implemented

### ✅ Core Requirements Met
- [x] **PWA Implementation**: Complete with manifest, service worker, offline support
- [x] **Multi-source Integration**: arXiv, OpenAlex, Semantic Scholar APIs
- [x] **Research Interest Tags**: Dynamic tag management with localStorage persistence
- [x] **Pre-print Toggle**: User-controlled inclusion/exclusion of pre-print papers
- [x] **Automatic Deduplication**: Title, arXiv ID, and DOI-based duplicate detection
- [x] **Caching System**: Multi-level caching (memory + file) with expiration
- [x] **Diff-based Updates**: Incremental updates based on publication dates
- [x] **Unified Feed**: Single interface combining papers from all sources

### ⚡ Performance Optimizations
- [x] **Smart Caching**: Reduces API calls and improves response times
- [x] **Incremental Loading**: Only fetch new papers since last update
- [x] **Rate Limiting**: Respectful API usage with delays between requests
- [x] **Error Handling**: Graceful fallbacks when external APIs are unavailable
- [x] **Mock Data**: Demonstration mode when APIs are restricted

### 🎨 User Experience
- [x] **Responsive Design**: Works seamlessly on all device sizes
- [x] **Intuitive Interface**: Clean, modern design with clear navigation
- [x] **Real-time Updates**: Immediate UI updates when settings change
- [x] **Loading States**: Clear feedback during data fetching
- [x] **Error States**: Helpful error messages and retry options

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.