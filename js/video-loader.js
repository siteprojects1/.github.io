// Video loading functionality
const allVideos = [
    '1069778933', '1069778911', '1069778877', '1070283295', 
    '1070283254', '1070283275', '1069780195', '1069055189', 
    '1069710654', '1069710703', '1069714903', '1069720118',
    '1069720051', '1069086739', '1069719595', '1069055176',
    '1069719749', '1069719692', '1069719657', '1069719628', 
    '1068978779', '1068979046', '1068979098', '1068979142', 
    '1069719983', '1069719932', '1069719846', '1069719790',
    '1068979205', '1068979244', '1068978881', '1069713151', 
    '1069052048', '1069052091', '1069052080', '1069055126',
    '1069052068', '1069052057', '1069720017', '1069726346',
    '1069055162', '1069055149', '1069055138', '1069726380', 
    '1069055115', 
];

// Featured video info
const featuredVideo = {
    id: '1070270679',
    creditName: 'Kemal Aslan',
    creditLink: 'https://www.instagram.com/reel/DHtATU9txvJ/?igsh=MWR6Nm1tcjM2ZW5hdQ==',
    description: "'ın kamerasından 23 Mart 2025 Saraçhane..."
};

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
    
    // Store the original container properties
    const originalWidth = container.offsetWidth;
    const originalHeight = container.offsetHeight;
    const originalPosition = window.getComputedStyle(container).position;
    
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
    
    // Add iframe with proper settings - keeping Vimeo controls
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1&muted=1`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('playsinline', '');
    iframe.setAttribute('webkit-playsinline', '');
    iframe.setAttribute('webkitallowfullscreen', ''); // For older Safari versions
    iframe.setAttribute('mozallowfullscreen', ''); // For Firefox
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    
    // Add elements to wrapper
    wrapper.appendChild(iframe);
    wrapper.appendChild(fullscreenBtn); // Place button after iframe to ensure it's on top
    
    // Store original container dimensions
    container.setAttribute('data-original-width', originalWidth);
    container.setAttribute('data-original-height', originalHeight);
    container.setAttribute('data-original-position', originalPosition);
    
    // Add fullscreen functionality with more reliable click handler
    fullscreenBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent video click event
        
        // The toggle function now handles both entering and exiting fullscreen
        toggleFullScreen(container, iframe);
    });
    
    // Handle ESC key for exiting iOS fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && container.classList.contains('ios-fullscreen')) {
            toggleFullScreen(container, iframe);
        }
    });
    
    // Append wrapper to container
    container.appendChild(wrapper);
    
    // Update fullscreen button icon when fullscreen state changes
    document.addEventListener('fullscreenchange', function() {
        updateFullscreenButtonIcon(container);
    });
    
    // iOS-specific fullscreen change events
    document.addEventListener('webkitfullscreenchange', function() {
        updateFullscreenButtonIcon(container);
    });
}

/**
 * Toggle fullscreen state for an element
 * @param {HTMLElement} element - The element to toggle fullscreen for
 * @param {HTMLIFrameElement} iframe - The iframe element for iOS workaround
 */
function toggleFullScreen(element, iframe) {
    // Detect iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Check if we're already in iOS fullscreen mode
    const isInIOSFullscreen = element.classList.contains('ios-fullscreen');
    
    if ((!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement) && 
        !isInIOSFullscreen) {
        
        // Enter fullscreen - standard approach first
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        // iOS-specific solution
        else if (isIOS && iframe) {
            // Add iOS-specific class for custom fullscreen styling
            element.classList.add('ios-fullscreen');
            document.body.classList.add('ios-fullscreen-body');
            
            // Try to use Vimeo's API if available
            try {
                iframe.contentWindow.postMessage(JSON.stringify({
                    method: 'setFullscreen',
                    value: true
                }), '*');
            } catch (e) {
                console.log('Vimeo fullscreen API not available');
            }
            
            // Update button immediately for iOS
            const fullscreenBtn = element.querySelector('.fullscreen-btn');
            if (fullscreenBtn) fullscreenBtn.innerHTML = 'x';
            
            // Store original positions to restore later
            element.setAttribute('data-original-scroll', window.scrollY);
            element.setAttribute('data-original-position', element.style.position || 'static');
            element.setAttribute('data-original-zindex', element.style.zIndex || 'auto');
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        // iOS-specific solution
        else if (isIOS && isInIOSFullscreen) {
            // Try to use Vimeo's API if available
            try {
                iframe.contentWindow.postMessage(JSON.stringify({
                    method: 'setFullscreen',
                    value: false
                }), '*');
            } catch (e) {
                console.log('Vimeo fullscreen API not available');
            }
            
            // Remove iOS-specific classes
            element.classList.remove('ios-fullscreen');
            document.body.classList.remove('ios-fullscreen-body');
            
            // Restore original positions
            const originalScroll = parseInt(element.getAttribute('data-original-scroll') || '0');
            window.scrollTo(0, originalScroll);
            
            // Update button immediately for iOS
            const fullscreenBtn = element.querySelector('.fullscreen-btn');
            if (fullscreenBtn) fullscreenBtn.innerHTML = '⤢';
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
    
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement ||
        container.classList.contains('ios-fullscreen')) {
        fullscreenBtn.innerHTML = '×'; // Changed to simple X for exit fullscreen icon
    } else {
        fullscreenBtn.innerHTML = '⤢'; // Enter fullscreen icon remains the same
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

/**
 * Load featured video with credit and description
 */
function loadFeaturedVideo() {
    const featuredSection = document.getElementById('featured-video-section');
    if (!featuredSection) return;
    
    // Create container for the featured video
    const videoContainer = document.createElement('div');
    videoContainer.className = 'featured-video-container fade-in';
    
    // Create video thumbnail
    const videoThumbnail = document.createElement('div');
    videoThumbnail.className = 'video-thumbnail featured-thumbnail';
    videoThumbnail.dataset.vimeoId = featuredVideo.id;
    videoThumbnail.onclick = function() {
        loadVideo(videoContainer, featuredVideo.id);
    };
    
    // Add play button to thumbnail
    const playButton = document.createElement('div');
    playButton.className = 'play-button';
    videoThumbnail.appendChild(playButton);
    
    // Create caption for the featured video
    const videoCaption = document.createElement('div');
    videoCaption.className = 'featured-video-caption';
    
    // Create a single line with the name as clickable link
    // Format: "Kemal Aslan'ın kamerasından 23 Mart 2025 Saraçhane..."
    
    // Add credit with link (only the name part)
    const creditLink = document.createElement('a');
    creditLink.href = featuredVideo.creditLink;
    creditLink.className = 'featured-credit';
    creditLink.target = '_blank';
    creditLink.rel = 'noopener noreferrer';
    creditLink.textContent = featuredVideo.creditName;
    
    // Create the full caption text
    videoCaption.appendChild(creditLink);
    videoCaption.appendChild(document.createTextNode(featuredVideo.description));
    
    // Add elements to the DOM
    videoContainer.appendChild(videoThumbnail);
    videoContainer.appendChild(videoCaption);
    featuredSection.appendChild(videoContainer);
    
    // Fetch the thumbnail for featured video
    fetch(`https://api.vimeo.com/videos/${featuredVideo.id}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data?.pictures?.sizes?.[3]?.link) {
                videoThumbnail.style.backgroundImage = `url(${data.pictures.sizes[3].link})`;
                videoThumbnail.classList.add('thumbnail-loaded');
            }
        })
        .catch(() => videoThumbnail.classList.add('thumbnail-fallback'));
}


// Export functions for use in main.js
window.loadVideo = loadVideo;
window.loadMoreVideos = loadMoreVideos;
window.setupInfiniteScroll = setupInfiniteScroll;
window.loadFeaturedVideo = loadFeaturedVideo;
