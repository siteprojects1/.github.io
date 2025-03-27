// Image slider functionality
let currentIndex = 0;
let isSliding = false;

/**
 * Initialize the slider
 */
function initSlider() {
    const container = document.querySelector('.slider-container');
    if (!container) return;
    
    // Initial position
    updateSliderPosition(0);
}

/**
 * Update slider position based on index
 * @param {number} index - The slide index to move to
 */
function updateSliderPosition(index) {
    const container = document.querySelector('.slider-container');
    if (!container) return;
    
    const slideWidth = container.offsetWidth / 3;
    currentIndex = index;
    
    container.style.transform = `translateX(${-index * slideWidth}px)`;
}

/**
 * Change the slide by direction
 * @param {number} direction - Direction to move (-1 for left, 1 for right)
 */
function changeSlide(direction) {
    const container = document.querySelector('.slider-container');
    const slideCount = document.querySelectorAll('.slider-image').length;
    let newIndex = currentIndex + direction;
    
    // Set sliding flag to prevent image opening during slide action
    window.isSliding = true;
    setTimeout(() => { window.isSliding = false; }, 300);
    
    // Ensure we don't scroll past the bounds
    newIndex = Math.max(0, Math.min(newIndex, slideCount - 3));
    updateSliderPosition(newIndex);
}

/**
 * Set up click handlers for slider images
 */
function setupImageClickHandlers() {
    const sliderImages = document.querySelectorAll('.slider-image');
    
    sliderImages.forEach(image => {
        // Add pointer cursor style
        image.style.cursor = 'pointer';
        
        // Add click event to open image in new tab
        image.addEventListener('click', (event) => {
            // If user is dragging/sliding, don't open in new tab
            if (!window.isSliding) {
                event.stopPropagation();
                window.open(image.src, '_blank');
            }
        });
    });
}

// Export functions for use in main.js
window.changeSlide = changeSlide; // Needed for inline onclick handlers
window.initSlider = initSlider;
window.setupImageClickHandlers = setupImageClickHandlers;
