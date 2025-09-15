/**
 * ShimmerButton Component - Creates buttons with shimmer effects
 */
class ShimmerButton {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            shimmerColor: options.shimmerColor || '#ffffff',
            shimmerDuration: options.shimmerDuration || 1500,
            shimmerIntensity: options.shimmerIntensity || 0.3,
            hoverEffect: options.hoverEffect !== false,
            clickEffect: options.clickEffect !== false,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        
        this.createShimmerEffect();
        this.bindEvents();
    }
    
    createShimmerEffect() {
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer-button-effect';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                ${this.options.shimmerColor} 25%, 
                ${this.options.shimmerColor} 50%, 
                ${this.options.shimmerColor} 75%, 
                transparent 100%);
            opacity: ${this.options.shimmerIntensity};
            pointer-events: none;
            z-index: 1;
        `;
        
        this.element.appendChild(shimmer);
        
        // Add CSS animation if not already present
        if (!document.getElementById('shimmer-button-styles')) {
            const style = document.createElement('style');
            style.id = 'shimmer-button-styles';
            style.textContent = `
                @keyframes shimmerButton {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .shimmer-button-effect {
                    animation: shimmerButton ${this.options.shimmerDuration}ms infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    bindEvents() {
        if (this.options.hoverEffect) {
            this.element.addEventListener('mouseenter', () => {
                this.triggerShimmer();
            });
        }
        
        if (this.options.clickEffect) {
            this.element.addEventListener('click', () => {
                this.triggerShimmer();
            });
        }
    }
    
    triggerShimmer() {
        const shimmer = this.element.querySelector('.shimmer-button-effect');
        if (shimmer) {
            shimmer.style.animation = 'none';
            setTimeout(() => {
                shimmer.style.animation = `shimmerButton ${this.options.shimmerDuration}ms infinite`;
            }, 10);
        }
    }
    
    destroy() {
        const shimmer = this.element.querySelector('.shimmer-button-effect');
        if (shimmer) {
            shimmer.remove();
        }
    }
}

// Export for use
window.ShimmerButton = ShimmerButton;
