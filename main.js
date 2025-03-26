const allVideos = [
    '1069778933', '1069778911', '1069778877', '1069780195',
    '1069055189', '1069710654', '1069710703', '1069714903',
    '1069720118', '1069720051', '1069086739', '1069719595',
    '1069719749', '1069719692', '1069719657', '1069719628', 
    '1068978779', '1068979046', '1068979098', '1068979142', 
    '1069719983', '1069719932', '1069719846', '1069719790',
    '1068979205', '1068979244', '1068978881', '1069713151', 
    '1068978836', '1069052048', '1069052091', '1069052080',
    '1069052068', '1069052057', '1069720017', '1069055176',
    '1069055162', '1069055149', '1069055138', '1069055126',
    '1069055115', '1069726380', '1069726346'
];

let currentPage = 0;
const videosPerPage = 6;
let loadingMore = false;

// Slider Variables
let currentIndex = 0;

function initSlider() {
    const container = document.querySelector('.slider-container');
    if (!container) return;
    
    // Initial position
    updateSliderPosition(0);
}

function updateSliderPosition(index) {
    const container = document.querySelector('.slider-container');
    if (!container) return;
    
    const slideWidth = container.offsetWidth / 3;
    currentIndex = index;
    
    container.style.transform = `translateX(${-index * slideWidth}px)`;
}

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

// Initialize everything on load
window.onload = () => {
    initSlider();
    loadMoreVideos();
    setupImageClickHandlers();
    setupScrollButton();
    
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreVideos();
        }
    });
}

// Set up click handlers for all slider images
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

// Track if user is sliding the image carousel
window.isSliding = false;

// Handle video loading and fullscreen
function loadVideo(container, videoId) {
    // Remove any existing content
    container.innerHTML = '';
    
    // Create a new wrapper div to maintain aspect ratio
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    
    // Add muted=1 to allow autoplay on mobile devices
    wrapper.innerHTML = `
        <button class="fullscreen-btn" onclick="document.fullscreenElement ? document.exitFullscreen() : this.parentNode.requestFullscreen()">⛶</button>
        <iframe src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1&muted=1" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen
            playsinline
            webkit-playsinline
            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></iframe>
    `;
    
    container.appendChild(wrapper);
}

// Load more videos with thumbnails
function loadMoreVideos() {
    if (loadingMore || currentPage * videosPerPage >= allVideos.length) {
        document.getElementById('loading-indicator').style.display = 'none';
        return;
    }
    
    loadingMore = true;
    document.getElementById('loading-indicator').style.display = 'block';
    
    const videoGrid = document.getElementById('video-grid');
    const endIndex = Math.min((currentPage + 1) * videosPerPage, allVideos.length);
    
    for (let i = currentPage * videosPerPage; i < endIndex; i++) {
        const videoId = allVideos[i];
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container fade-in';
        videoContainer.innerHTML = `
            <div class="video-thumbnail" data-vimeo-id="${videoId}" onclick="loadVideo(this.parentNode, '${videoId}')">
                <div class="play-button"></div>
            </div>
        `;
        videoGrid.appendChild(videoContainer);
        
        fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
            .then(response => response.json())
            .then(data => {
                if (data?.[0]?.thumbnail_large) {
                    const thumbnail = videoContainer.querySelector('.video-thumbnail');
                    thumbnail.style.backgroundImage = `url(${data[0].thumbnail_large})`;
                    thumbnail.classList.add('thumbnail-loaded');
                }
            })
            .catch(() => videoContainer.querySelector('.video-thumbnail').classList.add('thumbnail-fallback'));
    }
    
    currentPage++;
    setTimeout(() => {
        loadingMore = false;
        document.getElementById('loading-indicator').style.display = 'none';
    }, 500);
}

// Modal functionality for Gençliğe Hitabe
document.querySelector('.signature').addEventListener('click', () => {
    document.getElementById('hitabeModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
});

document.querySelector('.close-modal').addEventListener('click', closeModal);
document.getElementById('hitabeModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('hitabeModal')) {
        closeModal();
    }
});

function closeModal() {
    document.getElementById('hitabeModal').style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('hitabeModal').style.display === 'block') {
        closeModal();
    }
});

// Setup the scroll button functionality
function setupScrollButton() {
    const scrollButton = document.getElementById('scroll-to-videos');
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            const videoGrid = document.getElementById('video-grid');
            if (videoGrid) {
                // Use a smoother scroll with longer duration
                smoothScrollTo(videoGrid, 1000);
            }
        });
    }
}

// Custom smooth scroll function with configurable duration
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

// Share button functionality
document.getElementById('share-button').addEventListener('click', async () => {
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