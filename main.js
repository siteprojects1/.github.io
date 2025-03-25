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

let currentSlide = 0;
const slideDelay = 7000; // 7 seconds
let slideInterval;
let isTransitioning = false;

function changeSlide(direction) {
    if (isTransitioning) return;
    
    const container = document.querySelector('.slider-container');
    const totalSlides = 3; // We have 3 unique images
    
    isTransitioning = true;
    currentSlide += direction;
    
    // Calculate the transform offset (33.333% per slide)
    const offset = -currentSlide * 33.333;
    container.style.transition = 'transform 0.5s ease';
    container.style.transform = `translateX(${offset}%)`;
    
    // Reset timer for auto-slide
    if (slideInterval) {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    
    // Handle the seamless loop
    if (currentSlide >= totalSlides) {
        setTimeout(() => {
            container.style.transition = 'none';
            currentSlide = 0;
            container.style.transform = 'translateX(0)';
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
                isTransitioning = false;
            }, 50);
        }, 500);
    } else if (currentSlide < 0) {
        setTimeout(() => {
            container.style.transition = 'none';
            currentSlide = totalSlides - 1;
            container.style.transform = `translateX(-${(totalSlides - 1) * 33.333}%)`;
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
                isTransitioning = false;
            }, 50);
        }, 500);
    } else {
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
}

function startAutoSlide() {
    // Auto-advance to the right every 7 seconds
    slideInterval = setInterval(() => changeSlide(1), slideDelay);
}

// Initialize everything on load
window.onload = () => {
    const container = document.querySelector('.slider-container');
    if (container) {
        // Initial setup for seamless looping
        container.style.transform = 'translateX(0)';
        startAutoSlide();
    }
    
    loadMoreVideos();
    
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreVideos();
        }
    });
}