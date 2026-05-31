document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax Effect for Background Elements
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let currentScrollY = window.scrollY;

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            updateParallax();
        });

        // Track Scroll
        window.addEventListener('scroll', () => {
            currentScrollY = window.scrollY;
            updateParallax();
        });

        function updateParallax() {
            requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-speed'));
                    // Calculate movement based on mouse + scroll for parallax
                    const moveX = mouseX * 60 * speed;
                    // Move opposite to scroll for depth
                    const moveY = (mouseY * 60 * speed) - (currentScrollY * speed * 0.4);
                    
                    el.style.setProperty('--mouseX', `${moveX}px`);
                    el.style.setProperty('--mouseY', `${moveY}px`);
                });
            });
        }
        
        // Initial setup
        updateParallax();
    }

    // Global Interactive Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');

    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            // Create fluid trailing animation using Web Animations API
            cursorGlow.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 3000, fill: 'forwards' });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission via FormSubmit.co
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';

            const formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/ninetystudioz@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true' || data.success === true) {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = 'var(--accent-2)';
                    contactForm.reset();
                } else {
                    btn.textContent = 'Error! Try Again';
                    btn.style.background = '#e74c3c';
                }

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                btn.textContent = 'Error! Try Again';
                btn.style.background = '#e74c3c';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            });
        });
    }

    // Portfolio Hover Video & Slideshow Logic
    const hoverContainers = document.querySelectorAll('.portfolio-item, .portfolio-row-media');

    hoverContainers.forEach(item => {
        const video = item.querySelector('.portfolio-video, .slide-video');
        const slideshow = item.querySelector('.portfolio-slideshow');
        const prevBtn = item.querySelector('.prev-slide');
        const nextBtn = item.querySelector('.next-slide');
        let slideInterval;
        let currentSlide = 0;
        let isAutoPlaying = false;

        const startAutoPlay = () => {
            if (slideshow && !isAutoPlaying) {
                const slides = slideshow.querySelectorAll('.slide');
                if (slides.length > 1) {
                    isAutoPlaying = true;
                    slides.forEach((slide, idx) => {
                        if (slide.classList.contains('active')) currentSlide = idx;
                    });
                    
                    slideInterval = setInterval(() => {
                        slides[currentSlide].classList.remove('active');
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].classList.add('active');
                    }, 1200); // Change image every 1200ms
                }
            }
        };

        const stopAutoPlay = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
            isAutoPlaying = false;
        };

        const navigateSlide = (direction) => {
            if (slideshow) {
                const slides = slideshow.querySelectorAll('.slide');
                if (slides.length > 1) {
                    stopAutoPlay(); // Halt auto cycles on manual navigate
                    
                    slides[currentSlide].classList.remove('active');
                    if (direction === 'next') {
                        currentSlide = (currentSlide + 1) % slides.length;
                    } else if (direction === 'prev') {
                        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    }
                    slides[currentSlide].classList.add('active');
                }
            }
        };

        item.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(e => console.log('Video autoplay blocked:', e));
            }
            startAutoPlay();
        });

        item.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
            }
            stopAutoPlay();
            if (slideshow) {
                const slides = slideshow.querySelectorAll('.slide');
                slides.forEach(s => s.classList.remove('active'));
                if (slides.length > 0) {
                    slides[0].classList.add('active');
                    currentSlide = 0;
                }
            }
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateSlide('prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateSlide('next');
            });
        }
    });

    // Portfolio Category Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryItems = document.querySelectorAll('.category-item');

    if (filterButtons.length > 0 && categoryItems.length > 0) {
        // Function to filter items
        const filterPortfolio = (filterValue) => {
            // Update active button
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Show/hide items
            categoryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = ''; // Reset to CSS default (flex)
                    // small delay for animation effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        };

        // Check URL for category parameter on page load
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            // Check if param is valid
            const isValid = Array.from(filterButtons).some(btn => btn.getAttribute('data-filter') === categoryParam);
            if (isValid) {
                filterPortfolio(categoryParam);
            } else {
                filterPortfolio('all');
            }
        }

        // Add click listeners to buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterValue = e.target.getAttribute('data-filter');
                filterPortfolio(filterValue);
                
                // Update URL without reloading
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('category', filterValue);
                window.history.pushState({}, '', newUrl);
            });
        });
    }

    // Instagram Reels Horizontal Row Slide Player Engine
    const initInstagramReelsSlider = () => {
        const viewport = document.querySelector('.video-slider-viewport');
        const wrapper = document.querySelector('.video-slider-track');
        const slides = document.querySelectorAll('.video-slide-card');
        const prevBtn = document.querySelector('.prev-vid-btn');
        const nextBtn = document.querySelector('.next-vid-btn');
        const currentIndicator = document.querySelector('.current-vid-slide');
        const totalIndicator = document.querySelector('.total-vid-slides');

        if (!viewport || !wrapper || slides.length === 0) return;

        let activeIndex = 0;
        const totalSlides = slides.length;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let dragTranslation = 0;

        if (totalIndicator) totalIndicator.textContent = totalSlides;

        // Center-aligned slide update logic
        const updateSlider = () => {
            const viewportWidth = viewport.getBoundingClientRect().width;
            const cardWidth = slides[0].getBoundingClientRect().width;
            
            // get computed gap
            const style = window.getComputedStyle(wrapper);
            const gap = parseFloat(style.gap) || 32;

            // Center calculation formula
            let translateVal = (viewportWidth / 2) - (cardWidth / 2) - (activeIndex * (cardWidth + gap));
            
            wrapper.style.transform = `translateX(${translateVal}px)`;

            // Update classes and media states
            slides.forEach((slide, idx) => {
                const video = slide.querySelector('.slide-video');
                if (!video) return;

                if (idx === activeIndex) {
                    slide.classList.add('active');
                    // Play active centered slide
                    video.play().catch(() => {});
                } else {
                    slide.classList.remove('active');
                    // Pause non-active slides
                    video.pause();
                }
            });

            if (currentIndicator) currentIndicator.textContent = activeIndex + 1;
        };

        // Initialize Slider Positioning
        setTimeout(updateSlider, 100);
        window.addEventListener('resize', updateSlider);

        // Individual Card Operations (Hover Autoplay, Likes, Double Taps, Progress)
        slides.forEach((slide, idx) => {
            const video = slide.querySelector('.slide-video');
            const playOverlay = slide.querySelector('.video-play-overlay');
            const overlayPanel = slide.querySelector('.video-overlay-panel');
            const likeBtn = slide.querySelector('.like-btn');
            const likeCountText = slide.querySelector('.like-count');
            const followBtn = slide.querySelector('.card-follow-badge');
            const progressFill = slide.querySelector('.progress-line-fill');

            if (!video) return;

            // Hover Autoplay (plays muted when hovered, pauses when left if not active)
            slide.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });

            slide.addEventListener('mouseleave', () => {
                if (idx !== activeIndex) {
                    video.pause();
                }
            });

            // Tap to Play / Pause
            const togglePlay = () => {
                if (video.paused) {
                    video.play().catch(() => {});
                    showPlayOverlay('play');
                } else {
                    video.pause();
                    showPlayOverlay('pause');
                }
            };

            const showPlayOverlay = (state) => {
                if (!playOverlay) return;
                if (state === 'play') {
                    playOverlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                } else {
                    playOverlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
                }
                playOverlay.classList.add('active');
                setTimeout(() => {
                    playOverlay.classList.remove('active');
                }, 500);
            };

            if (overlayPanel) {
                overlayPanel.addEventListener('click', (e) => {
                    // Prevent pause on actions clicks or links
                    if (e.target.closest('.card-insta-actions') || e.target.closest('.video-card-details')) return;
                    togglePlay();
                });
            }

            // Follow Badge
            if (followBtn) {
                followBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (followBtn.textContent === 'Follow') {
                        followBtn.textContent = 'Following';
                        followBtn.style.background = 'rgba(255,255,255,0.2)';
                    } else {
                        followBtn.textContent = 'Follow';
                        followBtn.style.background = 'transparent';
                    }
                });
            }

            // Likes Counting
            if (likeBtn && likeCountText) {
                let initialCount = parseFloat(likeCountText.textContent);
                let liked = false;

                likeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    liked = !liked;
                    likeBtn.classList.toggle('liked', liked);
                    if (liked) {
                        likeCountText.textContent = (initialCount + 0.1).toFixed(1) + 'K';
                    } else {
                        likeCountText.textContent = initialCount.toFixed(1) + 'K';
                    }
                });

                // Double tap on panel to like
                if (overlayPanel) {
                    overlayPanel.addEventListener('dblclick', (e) => {
                        if (e.target.closest('.card-insta-actions') || e.target.closest('.video-card-details')) return;
                        if (!liked) {
                            likeBtn.click();
                        }
                    });
                }
            }

            // Progress Bar Line update
            video.addEventListener('timeupdate', () => {
                if (video.duration && progressFill) {
                    const percent = (video.currentTime / video.duration) * 100;
                    progressFill.style.width = `${percent}%`;
                }
            });
        });

        // Navigation Arrows clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (activeIndex > 0) {
                    activeIndex--;
                    updateSlider();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (activeIndex < totalSlides - 1) {
                    activeIndex++;
                    updateSlider();
                }
            });
        }

        // Horizontal Drag-to-Scroll Mechanics (Mouse)
        const getTranslateX = () => {
            const transform = window.getComputedStyle(wrapper).transform;
            if (transform === 'none') return 0;
            const matrix = new DOMMatrixReadOnly(transform);
            return matrix.m41;
        };

        viewport.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            currentTranslate = getTranslateX();
            wrapper.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentX = e.clientX;
            const diffX = currentX - startX;
            dragTranslation = currentTranslate + diffX;
            wrapper.style.transform = `translateX(${dragTranslation}px)`;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.transition = '';

            const endX = e.clientX;
            const diffX = endX - startX;

            const cardWidth = slides[0].getBoundingClientRect().width;
            const style = window.getComputedStyle(wrapper);
            const gap = parseFloat(style.gap) || 32;
            const snapThreshold = (cardWidth + gap) * 0.22;

            if (diffX < -snapThreshold && activeIndex < totalSlides - 1) {
                activeIndex++;
            } else if (diffX > snapThreshold && activeIndex > 0) {
                activeIndex--;
            }
            updateSlider();
        });

        // Touch Swipe Mechanics (Mobile)
        viewport.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            currentTranslate = getTranslateX();
            wrapper.style.transition = 'none';
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            dragTranslation = currentTranslate + diffX;
            wrapper.style.transform = `translateX(${dragTranslation}px)`;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.transition = '';

            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;

            const cardWidth = slides[0].getBoundingClientRect().width;
            const style = window.getComputedStyle(wrapper);
            const gap = parseFloat(style.gap) || 32;
            const snapThreshold = (cardWidth + gap) * 0.22;

            if (diffX < -snapThreshold && activeIndex < totalSlides - 1) {
                activeIndex++;
            } else if (diffX > snapThreshold && activeIndex > 0) {
                activeIndex--;
            }
            updateSlider();
        }, { passive: true });

        // Scroll play snaps using IntersectionObserver
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const activeSlide = slides[activeIndex];
                if (!activeSlide) return;
                const video = activeSlide.querySelector('.slide-video');
                if (!video) return;

                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        sliderObserver.observe(viewport);
    };

    // Dynamic Showcase Manifest Loader for Graphic Design and Photography
    const initDynamicDesignShowcases = () => {
        const sliders = {
            posters: document.querySelector('.slider-posters'),
            logos: document.querySelector('.slider-logos'),
            banners: document.querySelector('.slider-banners'),
            photo_product: document.querySelector('.slider-photography-product'),
            photo_model: document.querySelector('.slider-photography-model'),
            photo_events: document.querySelector('.slider-photography-events')
        };

        if (!Object.values(sliders).some(el => el !== null)) return;

        fetch('assets/manifest.json')
            .then(res => {
                if (!res.ok) throw new Error('Manifest not found');
                return res.json();
            })
            .then(data => {
                for (const [key, paths] of Object.entries(data)) {
                    const sliderContainer = sliders[key];
                    if (!sliderContainer || !paths || paths.length === 0) continue;

                    let newHtml = '';
                    paths.forEach(imagePath => {
                        const filename = imagePath.split('/').pop().split('.')[0];
                        const readableName = filename
                            .replace(/[_-]/g, ' ')
                            .replace(/\b\w/g, c => c.toUpperCase());

                        newHtml += `<div class="showcase-slide"><img src="${imagePath}" alt="${readableName}"></div>`;
                    });

                    // Zero-layout-shift DOM updater: only update if contents changed
                    const cleanHtml = newHtml.replace(/\s+/g, '');
                    const currentCleanHtml = sliderContainer.innerHTML.replace(/\s+/g, '');
                    if (cleanHtml !== currentCleanHtml) {
                        sliderContainer.innerHTML = newHtml;
                    }
                }
            })
            .catch(err => {
                console.warn('Dynamic portfolio loading fallback active:', err.message);
            });
    };

    // Initialize Instagram Reels Slider
    initInstagramReelsSlider();

    // Initialize Dynamic Showcase Manifest Loader
    initDynamicDesignShowcases();

});
