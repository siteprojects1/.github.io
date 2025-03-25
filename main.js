const allVideos = [
    '1068978779', '1068979046', '1068979098', '1068979142', 
    '1068979205', '1068979244', '1068978881', '1068978779', 
    '1068978836', '1069052048', '1069052091', '1069052080',
    '1069052068', '1069052057', '1069055189', '1069055176',
    '1069055162', '1069055149', '1069055138', '1069055126',
    '1069055115',
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
    
    // Ensure we don't scroll past the bounds
    newIndex = Math.max(0, Math.min(newIndex, slideCount - 3));
    updateSliderPosition(newIndex);
}

// Initialize everything on load
window.onload = () => {
    initSlider();
    loadMoreVideos();
    
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreVideos();
        }
    });
}

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
    
    wrapper.innerHTML = `
        <button class="fullscreen-btn" onclick="document.fullscreenElement ? document.exitFullscreen() : this.parentNode.requestFullscreen()">⛶</button>
        <iframe src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen
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