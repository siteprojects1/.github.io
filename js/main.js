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
});
