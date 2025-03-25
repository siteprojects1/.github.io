// Video data - add all your video IDs here
const allVideos = [
    '1068978779', '1068979046', '1068979098', '1068979142', 
    '1068979205', '1068979244', '1068978881', '1068978779', 
    '1068978836', '1069052048', '1069052091', '1069052080',
    '1069052068', '1069052057', '1069055189', '1069055176',
    '1069055162', '1069055149', '1069055138', '1069055126',
    '1069055115',
    // Add more video IDs as needed
];

let currentPage = 0;
const videosPerPage = 6;
let loadingMore = false;

// Function to load and play video when thumbnail is clicked
function loadVideo(container, videoId) {
    container.innerHTML = `
        <button class="fullscreen-btn" onclick="toggleFullscreen(this.parentNode)">⛶</button>
        <iframe src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1" 
            frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
    `;
}

// Function to toggle fullscreen
function toggleFullscreen(element) {
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

// Load more videos as user scrolls
function loadMoreVideos() {
    if (loadingMore) return;
    
    const startIndex = currentPage * videosPerPage;
    
    // Check if we've loaded all videos
    if (startIndex >= allVideos.length) {
        document.getElementById('loading-indicator').style.display = 'none';
        return;
    }
    
    loadingMore = true;
    document.getElementById('loading-indicator').style.display = 'block';
    
    const endIndex = Math.min(startIndex + videosPerPage, allVideos.length);
    const videoGrid = document.getElementById('video-grid');
    
    for (let i = startIndex; i < endIndex; i++) {
        const videoId = allVideos[i];
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container fade-in';
        
        videoContainer.innerHTML = `
            <div class="video-thumbnail" data-vimeo-id="${videoId}" onclick="loadVideo(this.parentNode, '${videoId}')">
                <div class="play-button"></div>
            </div>
        `;
        
        videoGrid.appendChild(videoContainer);
        
        // Load thumbnail from Vimeo
        fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0] && data[0].thumbnail_large) {
                    const thumbnail = videoContainer.querySelector('.video-thumbnail');
                    thumbnail.style.backgroundImage = `url(${data[0].thumbnail_large})`;
                    thumbnail.classList.add('thumbnail-loaded');
                }
            })
            .catch(() => {
                // Fallback in case API fails
                const thumbnail = videoContainer.querySelector('.video-thumbnail');
                thumbnail.classList.add('thumbnail-fallback');
            });
    }
    
    currentPage++;
    setTimeout(() => {
        loadingMore = false;
        document.getElementById('loading-indicator').style.display = 'none';
    }, 500); // Add a small delay to prevent multiple rapid loads
}

// Initialize slider for images
let currentSlide = 0;
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slider-image');
    
    slides[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
}

// Setup event listeners when page loads
window.onload = function() {
    // Start image slider
    const slides = document.querySelectorAll('.slider-image');
    if (slides.length > 0) {
        slides[0].classList.add('active');
        
        // Auto-advance slider every 5 seconds
        setInterval(function() {
            changeSlide(1);
        }, 5000);
    }
    
    // Load initial videos
    loadMoreVideos();
    
    // Setup infinite scroll
    window.addEventListener('scroll', function() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        // Check if user has scrolled near the bottom
        if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreVideos();
        }
    });
}