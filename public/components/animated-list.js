/**
 * AnimatedList Component - Creates animated list items
 */
class AnimatedList {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            animationDuration: options.animationDuration || 300,
            staggerDelay: options.staggerDelay || 50,
            animationType: options.animationType || 'fadeInUp',
            ...options
        };
        
        this.items = [];
        this.init();
    }
    
    init() {
        this.items = Array.from(this.container.children);
        this.setupInitialState();
    }
    
    setupInitialState() {
        this.items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = this.getInitialTransform();
            item.style.transition = `all ${this.options.animationDuration}ms ease-out`;
        });
    }
    
    getInitialTransform() {
        switch (this.options.animationType) {
            case 'fadeInUp':
                return 'translateY(20px)';
            case 'fadeInDown':
                return 'translateY(-20px)';
            case 'fadeInLeft':
                return 'translateX(-20px)';
            case 'fadeInRight':
                return 'translateX(20px)';
            case 'scaleIn':
                return 'scale(0.8)';
            default:
                return 'translateY(20px)';
        }
    }
    
    animateIn() {
        this.items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translate(0, 0) scale(1)';
            }, index * this.options.staggerDelay);
        });
    }
    
    animateOut(callback) {
        let completed = 0;
        const total = this.items.length;
        
        this.items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = this.getInitialTransform();
                
                completed++;
                if (completed === total && callback) {
                    callback();
                }
            }, index * this.options.staggerDelay);
        });
    }
    
    addItem(element, index = -1) {
        const item = typeof element === 'string' ? 
            document.createElement('div') : element;
        
        if (typeof element === 'string') {
            item.innerHTML = element;
        }
        
        item.style.opacity = '0';
        item.style.transform = this.getInitialTransform();
        item.style.transition = `all ${this.options.animationDuration}ms ease-out`;
        
        if (index === -1) {
            this.container.appendChild(item);
            this.items.push(item);
        } else {
            this.container.insertBefore(item, this.container.children[index]);
            this.items.splice(index, 0, item);
        }
        
        // Animate in
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translate(0, 0) scale(1)';
        }, 50);
    }
    
    removeItem(index, callback) {
        if (index < 0 || index >= this.items.length) return;
        
        const item = this.items[index];
        item.style.opacity = '0';
        item.style.transform = this.getInitialTransform();
        
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
            this.items.splice(index, 1);
            if (callback) callback();
        }, this.options.animationDuration);
    }
    
    updateItems(newItems) {
        this.animateOut(() => {
            this.container.innerHTML = '';
            this.items = [];
            
            newItems.forEach((item, index) => {
                this.addItem(item, index);
            });
        });
    }
    
    destroy() {
        this.items = [];
        this.container.innerHTML = '';
    }
}

// Export for use
window.AnimatedList = AnimatedList;
