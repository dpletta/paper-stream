# Paper Stream UI Style Guide

## Design Philosophy

Paper Stream follows a modern, clean design philosophy that prioritizes:
- **Clarity**: Clear information hierarchy and readable typography
- **Efficiency**: Streamlined workflows for academic researchers
- **Accessibility**: Inclusive design for all users
- **Performance**: Smooth animations and responsive interactions
- **Elegance**: Subtle Magic UI effects that enhance without distracting

## Color Palette

### Primary Colors
```css
/* Blue - Primary brand color */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main primary */
--primary-600: #2563eb;  /* Current header */
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### Neutral Colors
```css
/* Gray scale for text and backgrounds */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Semantic Colors
```css
/* Success, warning, error states */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
--info-500: #3b82f6;
```

### Magic UI Accent Colors
```css
/* Dynamic colors for Magic UI effects */
--magic-primary: #3b82f6;
--magic-secondary: #8b5cf6;
--magic-accent: #06b6d4;
--magic-gradient: linear-gradient(135deg, #3b82f6, #8b5cf6);
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale
```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px - Hero titles */
--text-3xl: 1.875rem;   /* 30px - Section headers */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-xl: 1.25rem;     /* 20px - Subsection headers */
--text-lg: 1.125rem;    /* 18px - Large body text */

/* Body text */
--text-base: 1rem;      /* 16px - Default body */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Captions, labels */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing System

### Spacing Scale (8px base)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-600);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-600);
  color: white;
}
```

### Paper Cards

#### Base Card
```css
.paper-card {
  background: white;
  border-radius: 0.75rem;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--primary-600);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.paper-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

#### Card with Magic UI Effects
```css
.paper-card-magic {
  /* Base card styles */
  background: white;
  border-radius: 0.75rem;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
  
  /* Magic UI border beam effect */
  border: 1px solid transparent;
  background-clip: padding-box;
}

.paper-card-magic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--magic-gradient);
  border-radius: inherit;
  padding: 1px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: border-beam 3s linear infinite;
}
```

### Tags

#### Research Tag
```css
.research-tag {
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  color: var(--primary-800);
  padding: var(--space-2) var(--space-4);
  border-radius: 9999px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: all 0.2s ease;
}

.research-tag:hover {
  background: linear-gradient(135deg, var(--primary-200), var(--primary-300));
  transform: scale(1.05);
}
```

### Loading States

#### Shimmer Effect
```css
.shimmer {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### Spinner
```css
.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Layout Patterns

### Grid System
```css
.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-6);
  padding: var(--space-6);
}

@media (max-width: 768px) {
  .papers-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }
}
```

### Flexbox Utilities
```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-col {
  display: flex;
  flex-direction: column;
}
```

## Magic UI Integration

### Particles Background
```css
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.6;
}
```

### Border Beam Animation
```css
@keyframes border-beam {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Text Shimmer
```css
.text-shimmer {
  background: linear-gradient(
    90deg,
    var(--gray-600) 0%,
    var(--primary-600) 50%,
    var(--gray-600) 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shimmer 2s ease-in-out infinite;
}

@keyframes text-shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Optimizations
```css
/* Touch-friendly sizing */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Improved readability on mobile */
@media (max-width: 768px) {
  .paper-card {
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .paper-title {
    font-size: var(--text-lg);
    line-height: var(--leading-tight);
  }
}
```

## Dark Mode Support

### CSS Custom Properties for Dark Mode
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
  }
}
```

## Accessibility Guidelines

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
.focus-visible:focus:not(:focus-visible) {
  outline: none;
}
```

### High Contrast Support
```css
@media (prefers-contrast: high) {
  .paper-card {
    border: 2px solid var(--text-primary);
  }
  
  .btn-primary {
    background: var(--text-primary);
    color: var(--bg-primary);
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animation Guidelines

### Timing Functions
```css
/* Standard easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom easing for Magic UI */
--ease-magic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Animation Durations
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-magic: 2000ms;
```

## Implementation Notes

### CSS Architecture
- Use CSS Custom Properties for consistent theming
- Implement BEM methodology for component naming
- Organize styles by component, not by property
- Use utility classes for common patterns

### Performance Considerations
- Minimize CSS bundle size
- Use `transform` and `opacity` for animations
- Implement `will-change` sparingly
- Use CSS containment for complex layouts

### Browser Support
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Graceful degradation for older browsers
- Progressive enhancement for advanced features
