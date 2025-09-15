/**
 * WarpBackground Component - Creates a warping background effect
 */
class WarpBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            intensity: options.intensity || 0.1,
            speed: options.speed || 1,
            colors: options.colors || ['#2563eb', '#3b82f6', '#60a5fa'],
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createCanvas();
        this.startAnimation();
        this.bindEvents();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    drawWarp() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) / 2
        );
        
        gradient.addColorStop(0, this.options.colors[0]);
        gradient.addColorStop(0.5, this.options.colors[1]);
        gradient.addColorStop(1, this.options.colors[2]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = this.options.intensity;
        
        // Create warping effect
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        
        for (let x = 0; x <= width; x += 10) {
            const y = height / 2 + Math.sin((x / width) * Math.PI * 2 + this.time * this.options.speed) * 50;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add additional wave layers
        for (let i = 1; i <= 3; i++) {
            this.ctx.globalAlpha = this.options.intensity * (0.5 / i);
            this.ctx.beginPath();
            this.ctx.moveTo(0, height / 2);
            
            for (let x = 0; x <= width; x += 10) {
                const y = height / 2 + Math.sin((x / width) * Math.PI * 2 + this.time * this.options.speed * (i + 1)) * (30 / i);
                this.ctx.lineTo(x, y);
            }
            
            this.ctx.lineTo(width, height / 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    animate() {
        this.time += 0.01;
        this.drawWarp();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        this.animate();
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Export for use
window.WarpBackground = WarpBackground;
