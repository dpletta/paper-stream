/**
 * TextShimmer Component - Creates a shimmering text effect
 */
class TextShimmer {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: options.duration || 2000,
            colors: options.colors || ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
            intensity: options.intensity || 0.8,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        
        // Create shimmer effect
        this.createShimmerEffect();
        
        // Start animation
        this.startAnimation();
    }
    
    createShimmerEffect() {
        const shimmer = document.createElement('div');
        shimmer.className = 'text-shimmer-effect';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                ${this.options.colors[0]} 25%, 
                ${this.options.colors[1]} 50%, 
                ${this.options.colors[2]} 75%, 
                transparent 100%);
            opacity: ${this.options.intensity};
            animation: shimmer ${this.options.duration}ms infinite;
            pointer-events: none;
        `;
        
        this.element.appendChild(shimmer);
        
        // Add CSS animation if not already present
        if (!document.getElementById('text-shimmer-styles')) {
            const style = document.createElement('style');
            style.id = 'text-shimmer-styles';
            style.textContent = `
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    startAnimation() {
        // Animation is handled by CSS
    }
    
    destroy() {
        const shimmer = this.element.querySelector('.text-shimmer-effect');
        if (shimmer) {
            shimmer.remove();
        }
    }
}

// Export for use
window.TextShimmer = TextShimmer;
