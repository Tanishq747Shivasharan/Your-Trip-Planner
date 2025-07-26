// Animation Library for TripPlanner

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initHoverAnimations();
    initLoadingAnimations();
});

// Scroll-triggered animations using GSAP
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Feature cards animation
    gsap.from('.feature-item', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Stats cards animation
    gsap.from('.stat-card', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Section headers animation
    gsap.from('.section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Hover animations using Anime.js
function initHoverAnimations() {
    if (typeof anime === 'undefined') return;
    
    // Feature card hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    });
    
    // Button hover effects
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
    });
    
    // Trip type selection animation
    document.querySelectorAll('.trip-type').forEach(type => {
        type.addEventListener('click', function() {
            // Remove selection from others
            document.querySelectorAll('.trip-type').forEach(t => t.classList.remove('selected'));
            
            // Add selection to clicked item
            this.classList.add('selected');
            
            // Animate selection
            anime({
                targets: this,
                scale: [1, 1.1, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    });
}

// Loading animations
function initLoadingAnimations() {
    if (typeof anime === 'undefined') return;
    
    // Loading icon animation
    const loadingIcon = document.querySelector('.loading-icon');
    if (loadingIcon) {
        anime({
            targets: loadingIcon,
            translateX: [-20, 20],
            rotate: [-10, 10],
            duration: 2000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }
}

// Page transition animations
function animatePageTransition() {
    if (typeof anime === 'undefined') return;
    
    // Fade out current content
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutCubic',
        complete: function() {
            // Fade back in after navigation
            anime({
                targets: 'body',
                opacity: [0, 1],
                duration: 300,
                easing: 'easeInCubic'
            });
        }
    });
}

// Form input animations
function animateFormInputs() {
    if (typeof anime === 'undefined') return;
    
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            anime({
                targets: this,
                scale: [1, 1.02],
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
        
        input.addEventListener('blur', function() {
            anime({
                targets: this,
                scale: [1.02, 1],
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
    });
}

// Notification animations
function animateNotification(element) {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: element,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutCubic'
    });
}

// Card flip animation for trip cards
function animateCardFlip(card) {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: card,
        rotateY: [0, 180],
        duration: 600,
        easing: 'easeInOutCubic',
        complete: function() {
            // Update card content here if needed
            anime({
                targets: card,
                rotateY: [180, 360],
                duration: 600,
                easing: 'easeInOutCubic'
            });
        }
    });
}

// Progress bar animation
function animateProgressBar(element, percentage) {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: element,
        width: percentage + '%',
        duration: 1000,
        easing: 'easeOutCubic'
    });
}

// Counter animation for statistics
function animateCounter(element, endValue) {
    if (typeof anime === 'undefined') return;
    
    const obj = { value: 0 };
    
    anime({
        targets: obj,
        value: endValue,
        duration: 2000,
        easing: 'easeOutCubic',
        update: function() {
            element.textContent = Math.round(obj.value);
        }
    });
}

// Stagger animation for lists
function animateList(selector, delay = 100) {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: selector,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(delay),
        easing: 'easeOutCubic'
    });
}

// Pulse animation for notifications
function pulseElement(element) {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: element,
        scale: [1, 1.1, 1],
        duration: 600,
        easing: 'easeInOutCubic'
    });
}

// Initialize form animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    animateFormInputs();
});

// Export animation functions
window.Animations = {
    animatePageTransition,
    animateFormInputs,
    animateNotification,
    animateCardFlip,
    animateProgressBar,
    animateCounter,
    animateList,
    pulseElement
};