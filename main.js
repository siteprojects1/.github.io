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

// Slider configuration
const slideDelay = 5000; // 5 seconds between auto-slides
let slideInterval = null;

// Slider Variables
let isDragging = false;
let startX;
let sliderTranslate = 0;
let currentIndex = 0;

function startDragging(e) {
    e.preventDefault(); // Prevent default image drag
    isDragging = true;
    startX = e.pageX - sliderTranslate;
    document.querySelector('.slider-container').classList.add('grabbing');
    
    // Clear auto-slide when user starts dragging
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function handleDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX;
    const walk = x - startX;
    const container = document.querySelector('.slider-container');
    
    sliderTranslate = walk;
    container.style.transform = `translateX(${walk}px)`;
}

function initSlider() {
    const container = document.querySelector('.slider-container');
    if (!container) return;

    // Prevent default drag behavior on the container
    container.addEventListener('dragstart', e => e.preventDefault());

    // Mouse events
    container.addEventListener('mousedown', e => {
        e.preventDefault(); // Prevent image dragging
        startDragging(e);
        
        const handleMouseMove = e => handleDrag(e);
        const handleMouseUp = () => {
            stopDragging();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    });

    // Touch events with improved handling
    container.addEventListener('touchstart', e => {
        e.preventDefault();
        startDragging(e.touches[0]);
        
        const handleTouchMove = e => {
            e.preventDefault();
            handleDrag(e.touches[0]);
        };
        
        const handleTouchEnd = () => {
            stopDragging();
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    }, { passive: false });

    // Initial position and start auto-sliding
    updateSliderPosition(0);
    startAutoSlide();
}

function updateSliderPosition(index) {
    const container = document.querySelector('.slider-container');
    if (!container) return;
    
    const slideWidth = container.offsetWidth / 3;
    currentIndex = index;
    sliderTranslate = -index * slideWidth;
    
    container.style.transition = 'transform 0.3s ease';
    container.style.transform = `translateX(${sliderTranslate}px)`;
}

function changeSlide(direction) {
    const container = document.querySelector('.slider-container');
    const slideCount = document.querySelectorAll('.slider-image').length;
    let newIndex = currentIndex + direction;
    
    // Ensure we don't scroll past the bounds
    newIndex = Math.max(0, Math.min(newIndex, slideCount - 3));
    updateSliderPosition(newIndex);

    // Reset interval when manually changing slides
    if (slideInterval) {
        clearInterval(slideInterval);
        startAutoSlide();
    }
}

function startAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(() => {
        const slideCount = document.querySelectorAll('.slider-image').length;
        let newIndex = currentIndex + 1;
        
        if (newIndex > slideCount - 3) {
            newIndex = 0;
        }
        
        updateSliderPosition(newIndex);
    }, slideDelay);
}

// Handle video loading and fullscreen
function loadVideo(container, videoId) {
    container.innerHTML = `
        <button class="fullscreen-btn" onclick="document.fullscreenElement ? document.exitFullscreen() : this.parentNode.requestFullscreen()">⛶</button>
        <iframe src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1" 
            frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
    `;
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