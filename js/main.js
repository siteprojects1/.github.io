// Main initialization file

/**
 * Initialize all components on document load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image slider
    initSlider();
    setupImageClickHandlers();
    
    // Load initial set of videos
    loadMoreVideos();
    setupInfiniteScroll();
    
    // Setup UI interactions
    setupScrollButton();
    setupModal();
    setupShareButton();
    
    // Initialize scroll animations for modern feel
    setupScrollAnimations();
});

/**
 * Set up scroll reveal animations for a more dynamic Gen Z feel
 */
function setupScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.video-container, h1, .explanatory-text, .constitution-excerpt');
    
    // Create IntersectionObserver for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible
    
    // Observe each element
    animatedElements.forEach(element => {
        // Add base animation class
        element.classList.add('animate-on-scroll');
        
        // Start observing
        observer.observe(element);
    });
}
