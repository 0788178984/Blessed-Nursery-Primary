document.addEventListener('DOMContentLoaded', function() {
    // Get slider elements
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const indicators = document.querySelectorAll('.slide-indicators .indicator');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    const totalSlides = slides.length;

    // Function to show a specific slide
    function showSlide(index) {
        // Wrap around if needed
        currentSlide = (index + totalSlides) % totalSlides;
        
        // Update slides
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update indicators if they exist
        if (indicators.length > 0) {
            indicators.forEach((indicator, i) => {
                if (i === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    // Navigation functions
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event listeners for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-advance slides
    function startAutoSlide() {
        // Advance every 5 seconds
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Initialize auto-slide
    startAutoSlide();
    
    // Pause auto-advance on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Initialize the slider
    showSlide(0);
});
