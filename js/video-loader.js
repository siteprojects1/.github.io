// Video loading functionality
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

/**
 * Handle video loading and fullscreen
 * @param {HTMLElement} container - The container element to load video into
 * @param {string} videoId - The Vimeo video ID
 */
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
    
    // Create fullscreen button with proper icon
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '⤢';
    fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
    
    // Add iframe with proper settings
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1&muted=1`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('playsinline', '');
    iframe.setAttribute('webkit-playsinline', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    
    // Add elements to wrapper
    wrapper.appendChild(fullscreenBtn);
    wrapper.appendChild(iframe);
    
    // Add fullscreen functionality
    fullscreenBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent video click event
        toggleFullScreen(container);
    });
    
    // Append wrapper to container
    container.appendChild(wrapper);
    
    // Update fullscreen button icon when fullscreen state changes
    document.addEventListener('fullscreenchange', function() {
        updateFullscreenButtonIcon(container);
    });
}

/**
 * Toggle fullscreen state for an element
 * @param {HTMLElement} element - The element to toggle fullscreen for
 */
function toggleFullScreen(element) {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

/**
 * Update fullscreen button icon based on current state
 * @param {HTMLElement} container - The container with the fullscreen button
 */
function updateFullscreenButtonIcon(container) {
    const fullscreenBtn = container.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) return;
    
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '⤓'; // Exit fullscreen icon
    } else {
        fullscreenBtn.innerHTML = '⤢'; // Enter fullscreen icon
    }
}

/**
 * Load more videos with thumbnails
 */
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

// Set up infinite scroll handling
function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreVideos();
        }
    });
}

// Export functions for use in main.js
window.loadVideo = loadVideo;
window.loadMoreVideos = loadMoreVideos;
window.setupInfiniteScroll = setupInfiniteScroll;
