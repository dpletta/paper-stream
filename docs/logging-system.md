# Paper Stream Logging System

## Overview

The Paper Stream logging system provides comprehensive monitoring, debugging, and analytics capabilities across both frontend and backend components. It follows industry best practices for structured logging, error tracking, and performance monitoring.

## Logging Architecture

### Multi-Layer Logging Strategy
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   Logging       │    │   Logging       │    │   Services      │
│                 │    │                 │    │                 │
│ • User Actions  │    │ • API Requests  │    │ • Sentry        │
│ • Performance   │    │ • Errors        │    │ • Analytics     │
│ • Errors        │    │ • Performance   │    │ • Monitoring    │
│ • Analytics     │    │ • Business      │    │ • Alerts        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Logging

### Logging Levels

#### Error Level
```javascript
// Critical errors that require immediate attention
logger.error('API request failed', {
  endpoint: '/api/papers',
  error: error.message,
  stack: error.stack,
  userId: req.user?.id,
  timestamp: new Date().toISOString(),
  requestId: req.id
});
```

#### Warning Level
```javascript
// Non-critical issues that should be monitored
logger.warn('Cache miss for frequently requested data', {
  cacheKey: 'papers:ml:ai',
  hitRate: cacheStats.hitRate,
  timestamp: new Date().toISOString()
});
```

#### Info Level
```javascript
// General application flow and business events
logger.info('Paper aggregation completed', {
  source: 'arxiv',
  papersFound: papers.length,
  processingTime: Date.now() - startTime,
  tags: tagList,
  timestamp: new Date().toISOString()
});
```

#### Debug Level
```javascript
// Detailed debugging information
logger.debug('Cache lookup', {
  key: cacheKey,
  exists: cacheManager.has(key),
  ttl: cacheManager.getTTL(key),
  timestamp: new Date().toISOString()
});
```

### Structured Logging Format

#### Log Entry Structure
```javascript
{
  timestamp: "2024-03-15T10:30:00.000Z",
  level: "info",
  message: "Paper aggregation completed",
  service: "paper-stream-api",
  version: "1.0.0",
  environment: "production",
  requestId: "req_123456789",
  userId: "user_987654321",
  sessionId: "session_abcdef123",
  metadata: {
    // Context-specific data
    endpoint: "/api/papers",
    method: "GET",
    statusCode: 200,
    responseTime: 1250,
    papersCount: 15,
    sources: ["arxiv", "openalex"],
    cacheHit: true
  },
  error: {
    // Only present for error logs
    name: "ValidationError",
    message: "Invalid tags parameter",
    stack: "Error stack trace...",
    code: "INVALID_TAGS"
  }
}
```

### Logger Implementation

#### Base Logger Class
```javascript
class Logger {
  constructor(service, version, environment) {
    this.service = service;
    this.version = version;
    this.environment = environment;
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  formatLog(level, message, metadata = {}, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      version: this.version,
      environment: this.environment,
      ...metadata
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      };
    }

    return logEntry;
  }

  error(message, metadata = {}, error = null) {
    if (this.shouldLog('error')) {
      console.error(JSON.stringify(this.formatLog('error', message, metadata, error)));
    }
  }

  warn(message, metadata = {}) {
    if (this.shouldLog('warn')) {
      console.warn(JSON.stringify(this.formatLog('warn', message, metadata)));
    }
  }

  info(message, metadata = {}) {
    if (this.shouldLog('info')) {
      console.info(JSON.stringify(this.formatLog('info', message, metadata)));
    }
  }

  debug(message, metadata = {}) {
    if (this.shouldLog('debug')) {
      console.debug(JSON.stringify(this.formatLog('debug', message, metadata)));
    }
  }

  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }
}
```

#### Request Logger Middleware
```javascript
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  req.id = requestId;
  req.startTime = startTime;

  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Log response
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString()
    });
  });

  next();
};
```

### Performance Logging

#### API Performance Monitoring
```javascript
const performanceLogger = {
  logApiCall: (endpoint, method, duration, statusCode, metadata = {}) => {
    logger.info('API call performance', {
      endpoint,
      method,
      duration,
      statusCode,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  },

  logCachePerformance: (operation, key, hit, duration) => {
    logger.debug('Cache performance', {
      operation,
      key,
      hit,
      duration,
      timestamp: new Date().toISOString()
    });
  },

  logExternalApiCall: (service, endpoint, duration, statusCode, error = null) => {
    const level = error ? 'error' : 'info';
    logger[level]('External API call', {
      service,
      endpoint,
      duration,
      statusCode,
      error: error?.message,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Business Logic Logging

#### Paper Aggregation Logging
```javascript
class PaperAggregatorLogger {
  logAggregationStart(tags, includePreprints) {
    logger.info('Paper aggregation started', {
      tags,
      includePreprints,
      timestamp: new Date().toISOString()
    });
  }

  logSourceFetch(source, papersFound, duration) {
    logger.info('Source fetch completed', {
      source,
      papersFound,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  logDeduplication(originalCount, deduplicatedCount, duplicatesRemoved) {
    logger.info('Deduplication completed', {
      originalCount,
      deduplicatedCount,
      duplicatesRemoved,
      timestamp: new Date().toISOString()
    });
  }

  logAggregationComplete(totalPapers, totalDuration, sources) {
    logger.info('Paper aggregation completed', {
      totalPapers,
      totalDuration,
      sources,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Frontend Logging

### User Action Tracking
```javascript
class FrontendLogger {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
  }

  logUserAction(action, metadata = {}) {
    const logData = {
      action,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    };

    // Send to analytics service
    this.sendToAnalytics(logData);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('User Action:', logData);
    }
  }

  logPaperInteraction(paperId, action, metadata = {}) {
    this.logUserAction('paper_interaction', {
      paperId,
      action, // 'view', 'click', 'save', 'share'
      ...metadata
    });
  }

  logSettingsChange(setting, oldValue, newValue) {
    this.logUserAction('settings_change', {
      setting,
      oldValue,
      newValue
    });
  }

  logError(error, context = {}) {
    const errorData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Send to error tracking service
    this.sendToErrorTracking(errorData);
    
    console.error('Frontend Error:', errorData);
  }

  logPerformance(metric, value, metadata = {}) {
    this.logUserAction('performance_metric', {
      metric,
      value,
      ...metadata
    });
  }
}
```

### Performance Monitoring

#### Core Web Vitals Tracking
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observer = null;
  }

  init() {
    // Track Core Web Vitals
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackFCP();
  }

  trackLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.logMetric('LCP', lastEntry.startTime, {
        element: lastEntry.element?.tagName,
        url: lastEntry.url
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  trackFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.logMetric('FID', entry.processingStart - entry.startTime, {
          eventType: entry.name
        });
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }

  trackCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.logMetric('CLS', clsValue);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  trackFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.logMetric('FCP', entry.startTime);
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }

  logMetric(name, value, metadata = {}) {
    frontendLogger.logPerformance(name, value, {
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Error Tracking

#### Global Error Handler
```javascript
class ErrorTracker {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason
      });
    });

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError(new Error('Resource loading failed'), {
          type: 'resource_error',
          element: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);
  }

  logError(error, context = {}) {
    frontendLogger.logError(error, context);
  }
}
```

## Log Aggregation and Analysis

### Log Storage Strategy

#### Structured Log Storage
```javascript
// Log rotation and archival
const logRotation = {
  daily: true,
  maxFiles: 30,
  maxSize: '100MB',
  compress: true,
  datePattern: 'YYYY-MM-DD'
};

// Log levels by environment
const logLevels = {
  development: 'debug',
  staging: 'info',
  production: 'warn'
};
```

### Analytics Integration

#### User Behavior Analytics
```javascript
class AnalyticsLogger {
  constructor() {
    this.events = [];
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
  }

  track(event, properties = {}) {
    const eventData = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };

    this.events.push(eventData);

    // Batch send events
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  flush() {
    if (this.events.length === 0) return;

    // Send to analytics service
    this.sendToAnalytics(this.events);
    this.events = [];
  }

  // Track specific Paper Stream events
  trackPaperView(paperId, source, title) {
    this.track('paper_viewed', {
      paper_id: paperId,
      source,
      title_length: title.length
    });
  }

  trackTagAdded(tag) {
    this.track('tag_added', {
      tag,
      tag_count: this.getTagCount()
    });
  }

  trackSearchPerformed(query, resultsCount) {
    this.track('search_performed', {
      query_length: query.length,
      results_count: resultsCount
    });
  }
}
```

## Monitoring and Alerting

### Health Check Logging
```javascript
const healthCheckLogger = {
  logHealthCheck: (status, details = {}) => {
    logger.info('Health check', {
      status,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  logCacheHealth: (cacheStats) => {
    logger.info('Cache health', {
      hitRate: cacheStats.hitRate,
      missRate: cacheStats.missRate,
      size: cacheStats.size,
      timestamp: new Date().toISOString()
    });
  },

  logApiHealth: (apiStats) => {
    logger.info('API health', {
      responseTime: apiStats.avgResponseTime,
      errorRate: apiStats.errorRate,
      requestsPerMinute: apiStats.requestsPerMinute,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Alerting Rules
```yaml
# Example alerting rules
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 0.05"
    duration: "5m"
    severity: "warning"
    
  - name: "API Response Time High"
    condition: "avg_response_time > 2000"
    duration: "10m"
    severity: "critical"
    
  - name: "Cache Hit Rate Low"
    condition: "cache_hit_rate < 0.7"
    duration: "15m"
    severity: "warning"
```

## Security and Privacy

### Sensitive Data Handling
```javascript
class SecureLogger {
  constructor() {
    this.sensitiveFields = ['password', 'token', 'key', 'secret'];
  }

  sanitizeData(data) {
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (this.sensitiveFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      )) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  logSecure(level, message, data = {}) {
    const sanitizedData = this.sanitizeData(data);
    logger[level](message, sanitizedData);
  }
}
```

### GDPR Compliance
```javascript
class PrivacyCompliantLogger {
  constructor() {
    this.userConsent = this.getUserConsent();
  }

  logWithConsent(event, data) {
    if (!this.userConsent.analytics) {
      return; // Skip logging if user hasn't consented
    }

    // Remove PII if consent doesn't include personal data
    const sanitizedData = this.userConsent.personalData ? 
      data : this.removePII(data);

    this.log(event, sanitizedData);
  }

  removePII(data) {
    const piiFields = ['email', 'name', 'ip', 'userAgent'];
    const sanitized = { ...data };
    
    piiFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}
```

## Implementation Checklist

### Backend Implementation
- [ ] Set up structured logging with Winston or similar
- [ ] Implement request/response logging middleware
- [ ] Add performance monitoring for API endpoints
- [ ] Configure log rotation and archival
- [ ] Set up error tracking with Sentry
- [ ] Implement health check logging
- [ ] Add business logic event logging

### Frontend Implementation
- [ ] Set up user action tracking
- [ ] Implement performance monitoring (Core Web Vitals)
- [ ] Add global error handling
- [ ] Configure analytics integration
- [ ] Implement privacy-compliant logging
- [ ] Set up real-user monitoring (RUM)
- [ ] Add A/B testing event tracking

### Monitoring Setup
- [ ] Configure log aggregation (ELK stack or similar)
- [ ] Set up dashboards and visualizations
- [ ] Implement alerting rules
- [ ] Configure log retention policies
- [ ] Set up log analysis and search
- [ ] Implement log-based metrics
- [ ] Configure automated log analysis

### Security and Compliance
- [ ] Implement data sanitization
- [ ] Set up access controls for logs
- [ ] Configure audit logging
- [ ] Implement GDPR compliance measures
- [ ] Set up log encryption
- [ ] Configure secure log transmission
- [ ] Implement log integrity verification
