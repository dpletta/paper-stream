# Paper Stream Architecture

## Overview

Paper Stream is a Progressive Web Application (PWA) that aggregates academic papers from multiple sources and presents them in a unified, personalized feed. The application follows a modern, scalable architecture with clear separation of concerns.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend PWA  │    │   Backend API   │    │  External APIs  │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │◄──►│ • Express.js    │◄──►│ • arXiv API     │
│ • Service Worker│    │ • Paper Aggreg. │    │ • OpenAlex API  │
│ • LocalStorage  │    │ • Cache Manager │    │ • Semantic API  │
│ • Responsive UI  │    │ • Cron Jobs     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **UI Framework**: Magic UI components for enhanced visual effects
- **Storage**: LocalStorage for user preferences
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Animations**: CSS Animations, Magic UI effects

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Caching**: File-based + Memory caching
- **Scheduling**: node-cron for automated updates
- **API Integration**: HTTP clients for external APIs

#### External Services
- **arXiv**: Pre-print repository (XML API)
- **OpenAlex**: Open academic database (REST API)
- **Semantic Scholar**: AI-powered academic search (REST API)

## Component Architecture

### Frontend Components

#### Core Application (`app.js`)
```javascript
class PaperStreamApp {
  // State management
  // Event handling
  // API communication
  // UI rendering
  // Service worker registration
}
```

#### Key Frontend Modules
1. **Settings Manager**: Handles research tags and preferences
2. **Paper Renderer**: Displays paper cards with Magic UI effects
3. **Cache Manager**: Manages offline data and service worker
4. **UI Components**: Magic UI integration for enhanced UX

### Backend Components

#### Server (`server/index.js`)
- Express.js application setup
- API route definitions
- Middleware configuration
- Static file serving

#### Paper Aggregator (`server/paperAggregator.js`)
- Multi-source paper fetching
- Deduplication logic
- Data normalization
- Error handling and fallbacks

#### Cache Manager (`server/cacheManager.js`)
- File-based caching system
- Memory cache for performance
- Cache expiration and cleanup
- Cache statistics and monitoring

## Data Flow

### Paper Aggregation Flow
```
1. User Request → API Endpoint
2. Parse Parameters (tags, preprints, lastUpdate)
3. Check Cache → Return cached data if valid
4. Fetch from External APIs (arXiv, OpenAlex, Semantic Scholar)
5. Deduplicate Papers (by title, arXiv ID, DOI)
6. Filter by Preprint Setting
7. Update Cache
8. Return Response
```

### Frontend Data Flow
```
1. User Interaction → Event Handler
2. Update Local State
3. Persist to LocalStorage
4. API Request → Backend
5. Receive Response
6. Update UI with Magic UI Effects
7. Render Paper Cards
```

## API Design

### RESTful Endpoints

#### GET /api/papers
**Purpose**: Retrieve papers based on research interests
**Parameters**:
- `tags` (required): Comma-separated research tags
- `includePreprints` (optional): Boolean flag
- `lastUpdate` (optional): ISO timestamp for incremental updates

**Response**:
```json
{
  "papers": [
    {
      "title": "Paper Title",
      "abstract": "Abstract text...",
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

#### GET /api/health
**Purpose**: Health check and cache status
**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "cache": {
    "hits": 150,
    "misses": 25,
    "size": "2.5MB"
  }
}
```

## Caching Strategy

### Multi-Level Caching
1. **Memory Cache**: Fast access for frequently requested data
2. **File Cache**: Persistent storage for offline access
3. **Service Worker Cache**: Browser-level caching for PWA

### Cache Invalidation
- Time-based expiration (30 minutes)
- Manual refresh triggers
- Incremental updates based on timestamps

## Security Considerations

### API Security
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting for external API calls
- Error handling without information leakage

### Client Security
- XSS prevention through proper HTML escaping
- Content Security Policy (CSP) headers
- Secure service worker implementation

## Performance Optimization

### Frontend Optimizations
- Lazy loading of paper cards
- Virtual scrolling for large datasets
- Magic UI animations with GPU acceleration
- Service worker for offline functionality

### Backend Optimizations
- Multi-level caching
- Parallel API requests
- Response compression
- Efficient deduplication algorithms

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- External cache (Redis) for multi-instance deployments
- Load balancer compatibility

### Vertical Scaling
- Memory-efficient data structures
- Optimized algorithms for large datasets
- Efficient database queries (if implemented)

## Monitoring and Logging

### Application Metrics
- API response times
- Cache hit/miss ratios
- Error rates and types
- User engagement metrics

### Logging Strategy
- Structured logging with timestamps
- Error tracking and alerting
- Performance monitoring
- User behavior analytics

## Future Enhancements

### Planned Features
1. **User Authentication**: Personal accounts and preferences
2. **Advanced Filtering**: Date ranges, author filters, journal filters
3. **Recommendation Engine**: ML-based paper recommendations
4. **Social Features**: Sharing, commenting, collaboration
5. **Mobile App**: Native iOS/Android applications
6. **Real-time Updates**: WebSocket connections for live updates

### Technical Improvements
1. **Database Integration**: PostgreSQL for persistent storage
2. **Search Engine**: Elasticsearch for advanced search capabilities
3. **Microservices**: Break down into smaller, focused services
4. **Containerization**: Docker for consistent deployments
5. **CI/CD Pipeline**: Automated testing and deployment
