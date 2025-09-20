// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Toggle dropdown menus on mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
                
                // Close other open dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.parentElement.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.main-nav a:not(.dropdown > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Show/hide back to top button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize Hero Slider
    const heroSlider = document.querySelector('.hero-slider');
    
    if (heroSlider) {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideCount = slides.length;
        
        // Show first slide
        slides[0].classList.add('active');
        
        // Auto-advance slides
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slideCount;
            slides[currentSlide].classList.add('active');
        }
        
        // Change slide every 5 seconds
        if (slideCount > 1) {
            setInterval(nextSlide, 5000);
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.insertBefore(successMessage, contactForm);
                contactForm.reset();
                
                // Scroll to success message
                setTimeout(() => {
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Here you would typically send the email to your server
                console.log('Newsletter subscription:', emailInput.value);
                
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.className = 'newsletter-success';
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                
                this.parentNode.appendChild(successMessage);
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Counter animation for statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target.toLocaleString();
                    }
                };
                
                // Start animation when element is in viewport
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        observer.unobserve(stat);
                    }
                });
                
                observer.observe(stat);
            });
        };
        
        // Run the animation when the page loads
        window.addEventListener('load', animateStats);
    }
    
    // Responsive iframes (for embedded content)
    function makeIframesResponsive() {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            // Skip if already wrapped
            if (iframe.parentElement.classList.contains('responsive-iframe-wrapper')) {
                return;
            }
            
            const wrapper = document.createElement('div');
            wrapper.className = 'responsive-iframe-wrapper';
            
            // Get aspect ratio from data attribute or default to 16:9
            const ratio = iframe.getAttribute('data-ratio') || '16/9';
            const [width, height] = ratio.split('/').map(Number);
            const paddingBottom = (height / width) * 100;
            
            wrapper.style.position = 'relative';
            wrapper.style.paddingBottom = `${paddingBottom}%`;
            wrapper.style.overflow = 'hidden';
            
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
        });
    }
    
    // Call the function when the page loads
    window.addEventListener('load', makeIframesResponsive);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            makeIframesResponsive();
        }, 250);
    });

    // Floating Chat Widget
    (function initChatWidget(){
        if (document.querySelector('.chat-launcher')) return;
        const launcher = document.createElement('button');
        launcher.className = 'chat-launcher';
        launcher.setAttribute('aria-label', 'Chat with us');
        // Use chat bubble icon for a clear affordance
        launcher.innerHTML = '<i class="fas fa-comments"></i>';

        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.innerHTML = `
            <div class="chat-header">
                <h4>Chat with us</h4>
                <button class="chat-close" aria-label="Close chat">&times;</button>
            </div>
            <div class="chat-body">
                <div class="chat-message agent"><div class="chat-bubble">Hello! How can we help you today?</div></div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button type="button">Send</button>
            </div>
        `;

        document.body.appendChild(launcher);
        document.body.appendChild(widget);

        const bodyEl = widget.querySelector('.chat-body');
        const inputEl = widget.querySelector('.chat-input input');
        const sendBtn = widget.querySelector('.chat-input button');
        const closeBtn = widget.querySelector('.chat-close');

        function toggleWidget(){ widget.classList.toggle('open'); if (widget.classList.contains('open')) { inputEl.focus(); } }
        launcher.addEventListener('click', toggleWidget);
        closeBtn.addEventListener('click', toggleWidget);

        function sendMessage(){
            const text = (inputEl.value || '').trim();
            if (!text) return;
            const message = document.createElement('div');
            message.className = 'chat-message user';
            message.innerHTML = `<div class="chat-bubble"></div>`;
            message.querySelector('.chat-bubble').textContent = text;
            bodyEl.appendChild(message);
            inputEl.value = '';
            bodyEl.scrollTop = bodyEl.scrollHeight;
            // Simulated agent reply
            setTimeout(() => {
                const reply = document.createElement('div');
                reply.className = 'chat-message agent';
                reply.innerHTML = `<div class="chat-bubble">Thanks! We will get back to you shortly.</div>`;
                bodyEl.appendChild(reply);
                bodyEl.scrollTop = bodyEl.scrollHeight;
            }, 800);
        }

        sendBtn.addEventListener('click', sendMessage);
        inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    })();
});

// Function to handle image error
function handleImageError(image) {
    image.onerror = '';
    image.src = 'assets/images/placeholder.jpg';
    return true;
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
