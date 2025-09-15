# Magic UI Components

This directory contains custom Magic UI components integrated into the Paper Stream application. These components provide enhanced visual effects and animations to improve the user experience.

## Components

### TextShimmer
Creates a shimmering text effect for titles and headings.

**Usage:**
```javascript
const shimmer = new TextShimmer(element, {
    duration: 2000,
    colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
    intensity: 0.8
});
```

### Particles
Creates animated particle background effects with optional connections.

**Usage:**
```javascript
const particles = new Particles(container, {
    count: 50,
    speed: 1,
    size: 2,
    color: '#2563eb',
    opacity: 0.6,
    connectionDistance: 100,
    showConnections: true
});
```

### AnimatedList
Provides smooth animations for list items with various animation types.

**Usage:**
```javascript
const animatedList = new AnimatedList(container, {
    animationDuration: 300,
    staggerDelay: 50,
    animationType: 'fadeInUp'
});
```

### ShimmerButton
Adds shimmer effects to buttons on hover and click.

**Usage:**
```javascript
const shimmerBtn = new ShimmerButton(button, {
    shimmerColor: '#ffffff',
    shimmerDuration: 1500,
    shimmerIntensity: 0.3,
    hoverEffect: true,
    clickEffect: true
});
```

### WarpBackground
Creates a warping background effect with gradient colors.

**Usage:**
```javascript
const warpBg = new WarpBackground(container, {
    intensity: 0.1,
    speed: 1,
    colors: ['#2563eb', '#3b82f6', '#60a5fa']
});
```

## Integration

All components are automatically initialized in the main `app.js` file when the application loads. The components are designed to be lightweight and performant, with proper cleanup methods to prevent memory leaks.

## Browser Support

These components use modern web APIs and are optimized for:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Components use `requestAnimationFrame` for smooth animations
- Canvas-based effects are optimized for 60fps
- Automatic cleanup prevents memory leaks
- Responsive design adapts to different screen sizes
