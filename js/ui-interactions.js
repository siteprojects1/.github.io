// UI interactions functionality

/**
 * Set up the scroll button functionality
 */
function setupScrollButton() {
    // Handle both desktop and mobile scroll buttons
    const scrollButtonIds = ['scroll-to-videos', 'scroll-to-videos-mobile'];
    
    scrollButtonIds.forEach(buttonId => {
        const scrollButton = document.getElementById(buttonId);
        if (scrollButton) {
            scrollButton.addEventListener('click', () => {
                const videoGrid = document.getElementById('video-grid');
                if (videoGrid) {
                    // Use a smoother scroll with longer duration
                    smoothScrollTo(videoGrid, 1000);
                }
            });
        }
    });
}

/**
 * Custom smooth scroll function with configurable duration
 * @param {HTMLElement} element - The element to scroll to
 * @param {number} duration - Duration of scroll animation in ms
 */
function smoothScrollTo(element, duration) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollY = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, scrollY);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Easing function for smoother acceleration/deceleration
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

/**
 * Set up modal functionality for Gençliğe Hitabe
 */
function setupModal() {
    // Open modal on signature click
    const signature = document.querySelector('.signature');
    if (signature) {
        signature.addEventListener('click', () => {
            document.getElementById('hitabeModal').style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }

    // Close modal button
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('hitabeModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('hitabeModal').style.display === 'block') {
            closeModal();
        }
    });
}

/**
 * Close the modal and restore scrolling
 */
function closeModal() {
    const modal = document.getElementById('hitabeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Set up share button functionality
 */
function setupShareButton() {
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            const shareData = {
                title: 'Zulme Tanık Ol!',
                text: '19 Mart direnişi ve olayları hakkında video ve görsel arşivi',
                url: window.location.href
            };

            try {
                // Check if Web Share API is available
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback for browsers that don't support Web Share API
                    // Copy the URL to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    
                    // Create and show a temporary notification
                    const notification = document.createElement('div');
                    notification.textContent = 'Bağlantı kopyalandı!';
                    notification.style.position = 'fixed';
                    notification.style.bottom = '130px';
                    notification.style.right = '20px';
                    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    notification.style.color = 'white';
                    notification.style.padding = '10px 20px';
                    notification.style.borderRadius = '4px';
                    notification.style.zIndex = '1000';
                    
                    document.body.appendChild(notification);
                    
                    // Remove notification after 2 seconds
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transition = 'opacity 0.5s';
                        setTimeout(() => document.body.removeChild(notification), 500);
                    }, 2000);
                }
            } catch (error) {
                console.error('Sharing failed:', error);
            }
        });
    }
}

// Export functions for use in main.js
window.setupScrollButton = setupScrollButton;
window.setupModal = setupModal;
window.setupShareButton = setupShareButton;
