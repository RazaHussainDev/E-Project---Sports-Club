/* =================================== */
/* IMPORTS                             */
/* =================================== */
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/geometries/RoundedBoxGeometry.js';

/* =================================== */
/* NAVIGATION                          */
/* =================================== */
document.addEventListener("DOMContentLoaded", function() {
    const navToggle = document.getElementById("rscNavToggle");
    const navLinksList = document.getElementById("rscNavLinks");

    if (navToggle && navLinksList) {
        navToggle.addEventListener("click", function() {
            navLinksList.classList.toggle("rsc-nav-links-open");
        });
    }

    const dropdownToggles = document.querySelectorAll(".rsc-nav-dropdown-toggle");

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", function(event) {
            event.preventDefault();
            
            const dropdownContainer = event.currentTarget.closest(".rsc-nav-dropdown-container");
            if (!dropdownContainer) return;
            
            dropdownContainer.classList.toggle("rsc-nav-dropdown-open");

            if (window.innerWidth > 1024) {
                document.querySelectorAll(".rsc-nav-dropdown-container").forEach(container => {
                    if (container !== dropdownContainer) {
                        container.classList.remove("rsc-nav-dropdown-open");
                    }
                });
            }
        });
    });

    window.addEventListener("click", function(event) {
        if (window.innerWidth > 1024) {
            if (!event.target.closest(".rsc-nav-dropdown-container")) {
                document.querySelectorAll(".rsc-nav-dropdown-container").forEach(container => {
                    container.classList.remove("rsc-nav-dropdown-open");
                });
            }
        }
    });

    function highlightActiveLink() {
        const allLinks = document.querySelectorAll(".rsc-nav-link, .rsc-nav-dropdown-link");
        const currentPageUrl = window.location.href;

        allLinks.forEach(link => {
            link.classList.remove("rsc-nav-active");

            if (link.href === currentPageUrl) {
                link.classList.add("rsc-nav-active");

                const parentDropdown = link.closest(".rsc-nav-dropdown-container");
                if (parentDropdown) {
                    const parentToggle = parentDropdown.querySelector(".rsc-nav-dropdown-toggle");
                    if (parentToggle) {
                        parentToggle.classList.add("rsc-nav-active");
                    }
                }
            }
        });
    }

    highlightActiveLink();

    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.rsc-nav-container');
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.style.padding = '8px 5%';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.padding = '12px 5%';
            nav.style.boxShadow = 'var(--shadow)';
        }
    });

    /* =================================== */
    /* COUNTER ANIMATION                   */
    /* =================================== */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const raw = counter.getAttribute('data-count');
            const target = raw ? parseInt(raw, 10) : 0;
            if (isNaN(target) || target <= 0) {
                counter.textContent = '0+';
                return;
            }
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 16);
        });
    }

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    /* =================================== */
    /* BUTTON EFFECTS                      */
    /* =================================== */
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    createParticleBackground();

    /* =================================== */
    /* PARALLAX EFFECTS                    */
    /* =================================== */
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
        });
    });

    /* =================================== */
    /* RIPPLE EFFECT                       */
    /* =================================== */
    const contactBtn = document.querySelector('.btn-primary');
    const tourBtn = document.querySelector('.btn-secondary');

    if (contactBtn) {
        contactBtn.addEventListener('click', function(event) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = (event && event.clientX ? event.clientX : rect.left + rect.width / 2) - rect.left - size / 2;
            const y = (event && event.clientY ? event.clientY : rect.top + rect.height / 2) - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                window.location.href = 'pages/contact.html';
            }, 600);
        });
    }

    if (tourBtn) {
        tourBtn.addEventListener('click', function() {
            alert('Virtual tour feature coming soon!');
        });
    }

    if (!document.querySelector('#ripple-animation')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-animation';
        rippleStyle.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(rippleStyle);
    }
});

/* =================================== */
/* PARTICLE BACKGROUND                 */
/* =================================== */
function createParticleBackground() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-background';
    heroSection.appendChild(particleContainer);

    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary);
            border-radius: 50%;
            opacity: ${Math.random() * 0.6 + 0.2};
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        
        particleContainer.appendChild(particle);
    }

    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(0px);
                    opacity: 0;
                }
            }
            .particle-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
}

/* =================================== */
/* THREE.JS INITIALIZATION             */
/* =================================== */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initThreeJS, 100);
});

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(-5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00aaff, 1.2);
    pointLight.position.set(5, -5, -5);
    scene.add(pointLight);

    const cubeGroup = new THREE.Group();
    const cubeGeometry = new RoundedBoxGeometry(1, 1, 1, 6, 0.1);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0055ff,
        shininess: 100,
        specular: 0x444444,
    });

    const numCubes = 50;
    for (let i = 0; i < numCubes; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
        const radius = 3.5;
        const phi = Math.random() * Math.PI * 2;
        const costheta = Math.random() * 2 - 1;
        const u = Math.random();
        
        const theta = Math.acos(costheta);
        const r = radius * Math.cbrt(u) + (Math.random() - 0.5) * 2;

        cube.position.set(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)
        );
        
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        cubeGroup.add(cube);
    }

    scene.add(cubeGroup);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

/* =================================== */
/* MISSION SECTION PARTICLES           */
/* =================================== */
function createMissionParticles() {
  const particlesContainer = document.getElementById('rsc-particles');
  if (!particlesContainer) {
    return;
  }
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('rsc-particle');
    
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 20 + 10;
    const animationDelay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${animationDuration}s`;
    particle.style.animationDelay = `${animationDelay}s`;
    
    particlesContainer.appendChild(particle);
  }
}

/* =================================== */
/* MISSION ANIMATIONS                  */
/* =================================== */
function initMissionAnimations() {
  const missionText = document.querySelector('.rsc-mission-text');
  const floatingCards = document.querySelectorAll('.rsc-floating-card');
  
  if (!missionText || floatingCards.length === 0) {
    return;
  }
  
  missionText.style.opacity = '0';
  missionText.style.transform = 'translateX(-30px)';
  
  floatingCards.forEach(card => {
    card.style.opacity = '0';
    const originalTransform = getComputedStyle(card).transform || 'none';
    card.dataset._originalTransform = originalTransform;
    card.style.transform = `${originalTransform} translateY(30px)`;
  });
  
  setTimeout(() => {
    missionText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    missionText.style.opacity = '1';
    missionText.style.transform = 'translateX(0)';
    
    floatingCards.forEach((card, index) => {
      let baseTransform = 'rotate(0deg)';
      if(card.classList.contains('rsc-card-1')) baseTransform = 'rotate(-5deg)';
      if(card.classList.contains('rsc-card-2')) baseTransform = 'rotate(3deg)';
      if(card.classList.contains('rsc-card-3')) baseTransform = 'rotate(-3deg)';
      if(card.classList.contains('rsc-card-4')) baseTransform = 'rotate(5deg)';

      card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
      card.style.opacity = '1';
      card.style.transform = baseTransform;
    });
  }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
  createMissionParticles();
  initMissionAnimations();
});

/* =================================== */
/* FACILITY TABS                       */
/* =================================== */
function initFacilityTabs() {
  const tabButtons = document.querySelectorAll('.rsc-tab-btn');
  const tabPanes = document.querySelectorAll('.rsc-tab-pane');

  if (tabButtons.length === 0 || tabPanes.length === 0) {
    return;
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      if (!targetTab) return;

      tabButtons.forEach(btn => btn.classList.remove('rsc-tab-active'));
      button.classList.add('rsc-tab-active');

      tabPanes.forEach(pane => {
        pane.classList.remove('rsc-pane-active');
      });
      
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('rsc-pane-active');
    });
  });
}

document.addEventListener('DOMContentLoaded', initFacilityTabs);

/* =================================== */
/* HERO CAROUSEL                       */
/* =================================== */
function initHeroCarousel() {
    const carousel = document.getElementById('rscHeroCarousel');
    if (!carousel) {
        return; 
    }

    const slides = carousel.querySelectorAll('.rsc-hero-slide');
    const progressBars = carousel.querySelectorAll('.rsc-hero-progress');
    const slideIntervalTime = 6000;
    if (slides.length === 0) return;
    if (progressBars.length !== slides.length) {
    }
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide) => {
            slide.classList.remove('rsc-slide-active');
        });
        
        progressBars.forEach(bar => {
            bar.classList.remove('rsc-progress-active');
            const inner = bar.querySelector('.rsc-hero-progress-inner');
            if (inner) {
                inner.style.transition = 'none';
                inner.style.width = '0%';
            }
        });

        if (slides[index]) slides[index].classList.add('rsc-slide-active');
        
        setTimeout(() => {
            const bar = progressBars[index];
            if (bar) {
                bar.classList.add('rsc-progress-active');
                const inner = bar.querySelector('.rsc-hero-progress-inner');
                if (inner) {
                    inner.style.transition = `width ${slideIntervalTime}ms linear`;
                    inner.style.width = '100%';
                }
            }
        }, 50);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }
    
    startSlideshow(); 
}

document.addEventListener('DOMContentLoaded', initHeroCarousel);


function initTestimonialSlider() {
    const slider = document.getElementById('rscTestimonialSlider');
    if (!slider) {
        return;
    }

    const track = slider.querySelector('.rsc-testimonial-track');
    if (!track) {
        return;
    }
    const items = Array.from(track.children);
    if (items.length === 0) return;

    const prevBtn = document.getElementById('rscTestiPrev');
    const nextBtn = document.getElementById('rscTestiNext');
    const progressBar = document.getElementById('rscTestiProgressBar');

    let currentTestimonial = 0;
    const slideIntervalTime = 7000;
    let autoPlayInterval;

    function showTestimonial(index) {
        if (!progressBar) {
        } else {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        }
        
        items.forEach(item => {
            item.classList.remove('rsc-testi-active', 'rsc-testi-leaving');
        });

        if (items[index]) items[index].classList.add('rsc-testi-active');
        currentTestimonial = index;

        setTimeout(() => {
            if (progressBar) {
                progressBar.style.transition = `width ${slideIntervalTime}ms linear`;
                progressBar.style.width = '100%';
            }
        }, 50);
    }

    function nextTestimonial() {
        showTestimonial((currentTestimonial + 1) % items.length);
    }

    function prevTestimonial() {
        showTestimonial((currentTestimonial - 1 + items.length) % items.length);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextTestimonial, slideIntervalTime);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoPlay();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoPlay();
        });
    }

    showTestimonial(0);
    startAutoPlay();

    slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    slider.addEventListener('mouseleave', () => startAutoPlay());
}

document.addEventListener('DOMContentLoaded', initTestimonialSlider);

/* =================================== */
/* FAQ ACCORDION                       */
/* =================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.rsc-faq-item');

  if (faqItems.length === 0) {
    return;
  }

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.rsc-faq-question');
    if (!questionButton) return;

    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('rsc-faq-active');
      if (isActive) {
        item.classList.remove('rsc-faq-active');
      } else {
        item.classList.add('rsc-faq-active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initFaqAccordion);

/* =================================== */
/* FOOTER YEAR                         */
/* =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const yearSpanRevised = document.getElementById('currentYearRevised');
    if (yearSpanRevised) {
        yearSpanRevised.textContent = new Date().getFullYear();
    }
});

/* =================================== */
/* ATHLETES PAGE                       */
/* =================================== */
function initAthletesPage() {
    const filterButtons = document.querySelectorAll('.rsc-athletes-filter-btn');
    const athleteCards = document.querySelectorAll('.rsc-athlete-card');
    
    if (filterButtons.length > 0 && athleteCards.length > 0) {
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('rsc-active'));
                this.classList.add('rsc-active');
                
                const filterValue = this.getAttribute('data-filter') || 'all';
                
                athleteCards.forEach(card => {
                    const cardSport = card.getAttribute('data-sport') || '';
                    
                    if (filterValue === 'all' || cardSport === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    const achievementNumbers = document.querySelectorAll('.rsc-achievement-number');
    
    if (achievementNumbers.length > 0) {
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const raw = target.getAttribute('data-count');
                    const finalValue = raw ? parseInt(raw, 10) : 0;
                    if (isNaN(finalValue) || finalValue <= 0) {
                        observer.unobserve(target);
                        return;
                    }
                    let currentValue = 0;
                    
                    const increment = Math.max(1, Math.ceil(finalValue / 50));
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue);
                        }
                    }, 30);
                    
                    observer.unobserve(target);
                }
            });
        }, observerOptions);
        
        achievementNumbers.forEach(number => {
            observer.observe(number);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAthletesPage(); 
});

/* =================================== */
/* GALLERY PAGE                        */
/* =================================== */
function initGalleryPage() {
    const filterButtons = document.querySelectorAll('.rsc-gallery-filter-btn');
    const galleryCards = document.querySelectorAll('.rsc-gallery-card');

    if (filterButtons.length === 0 || galleryCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('rsc-active'));
            this.classList.add('rsc-active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    void card.offsetWidth;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    const lightbox = document.getElementById('rscLightbox');
    const lightboxImage = document.getElementById('rscLightboxImage');
    const lightboxTitle = document.getElementById('rscLightboxTitle');
    const lightboxCategory = document.getElementById('rscLightboxCategory');
    const lightboxDescription = document.getElementById('rscLightboxDescription');
    const lightboxClose = document.querySelector('.rsc-lightbox-close');
    const lightboxPrev = document.querySelector('.rsc-lightbox-prev');
    const lightboxNext = document.querySelector('.rsc-lightbox-next');

    let currentImageIndex = 0;
    const galleryImages = Array.from(galleryCards);

    function openLightbox(index) {
        const card = galleryImages[index];
        const imgSrc = card.querySelector('img').src;
        const title = card.querySelector('.rsc-gallery-title').textContent;
        const category = card.querySelector('.rsc-gallery-category').textContent;
        const description = card.querySelector('.rsc-gallery-description').textContent;
        
        lightbox.style.display = 'flex';
        lightboxImage.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
        lightboxDescription.textContent = description;
        currentImageIndex = index;
        
        lightboxPrev.style.display = index === 0 ? 'none' : 'flex';
        lightboxNext.style.display = index === galleryImages.length - 1 ? 'none' : 'flex';
    }

    function navigateLightbox(direction) {
        let newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < galleryImages.length) {
            openLightbox(newIndex);
        }
    }

    galleryCards.forEach((card, index) => {
        card.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose?.addEventListener('click', () => lightbox.style.display = 'none');
    lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext?.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) lightbox.style.display = 'none';
    });

    document.addEventListener('keydown', (event) => {
        if (lightbox.style.display === 'flex') {
            if (event.key === 'Escape') lightbox.style.display = 'none';
            else if (event.key === 'ArrowLeft') navigateLightbox(-1);
            else if (event.key === 'ArrowRight') navigateLightbox(1);
        }
    });

    const likeButtons = document.querySelectorAll('.rsc-gallery-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);
            
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                countSpan.textContent = count + 1;
                this.style.color = '#ff4757';
            } else {
                icon.classList.replace('fas', 'far');
                countSpan.textContent = count - 1;
                this.style.color = '';
            }
        });
    });

    const viewButtons = document.querySelectorAll('.rsc-gallery-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const card = this.closest('.rsc-gallery-card');
            const index = galleryImages.indexOf(card);
            openLightbox(index);
        });
    });

    const loadMoreBtn = document.querySelector('.rsc-load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Load More Photos';
                this.disabled = false;
            }, 1500);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initGalleryPage();
});

/* =================================== */
/* FEEDBACK PAGE                       */
/* =================================== */
function initFeedbackPage() {
    const feedbackForm = document.getElementById('rscFeedbackForm');
    if (!feedbackForm) return;

    const starRatingContainer = document.getElementById('rscStarRating');
    if (!starRatingContainer) return;

    const stars = starRatingContainer.querySelectorAll('.fas.fa-star');
    const ratingInput = document.getElementById('fb_rating');
    const submitBtn = document.getElementById('rscFeedbackSubmitBtn');
    const formCard = document.getElementById('rscFeedbackFormCard');
    const successCard = document.getElementById('rscFeedbackSuccessCard');
    const submitAnotherBtn = document.querySelector('.rsc-submit-another-btn');

    let currentRating = 0;

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = star.getAttribute('data-value');
                stars.forEach(s =>
                    s.classList.toggle('rsc-star-hover', s.getAttribute('data-value') <= value)
                );
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('rsc-star-hover'));
            });

            star.addEventListener('click', () => {
                currentRating = star.getAttribute('data-value');
                ratingInput.value = currentRating;
                stars.forEach(s =>
                    s.classList.toggle('rsc-star-selected', s.getAttribute('data-value') <= currentRating)
                );
            });
        });
    }

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (currentRating === 0) {
            alert('Please provide a rating before submitting.');
            return;
        }

        const userName = document.getElementById('fb_name')?.value || 'Valued Member';

        submitBtn.disabled = true;
        submitBtn.classList.add('rsc-is-loading');

        setTimeout(() => {
            submitBtn.classList.remove('rsc-is-loading');
            submitBtn.classList.add('rsc-is-flying');

            setTimeout(() => {
                if (formCard) formCard.style.display = 'none';
                if (successCard) successCard.style.display = 'block';

                const successTitle = successCard?.querySelector('.rsc-success-title');
                if (successTitle) {
                    successTitle.textContent = `Thank You, ${userName.split(' ')[0]}!`;
                }
            }, 800);

        }, 1500);
    });

    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', function () {
            successCard.style.display = 'none';
            formCard.style.display = 'block';

            feedbackForm.reset();
            submitBtn.disabled = false;
            submitBtn.classList.remove('rsc-is-flying');

            currentRating = 0;
            ratingInput.value = 0;
            stars.forEach(s => s.classList.remove('rsc-star-selected'));
        });
    }

    if (typeof initTestimonialsSlider === "function") {
        initTestimonialsSlider();
    }
}



/* =================================== */
/* TESTIMONIALS SLIDER                 */
/* =================================== */
function initTestimonialsSlider() {
    const slider = document.getElementById('rscTestimonialsSlider');
    const slides = document.querySelectorAll('.rsc-testimonial-slide');
    const dots = document.querySelectorAll('.rsc-testimonial-dot');
    const prevBtn = document.querySelector('.rsc-testimonial-prev');
    const nextBtn = document.querySelector('.rsc-testimonial-next');
    
    if (!slider || slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('rsc-testimonial-active', 'rsc-testimonial-prev', 'rsc-testimonial-next');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('rsc-testimonial-dot-active');
        });

        slides[index].classList.add('rsc-testimonial-active');
        
        if (dots[index]) {
            dots[index].classList.add('rsc-testimonial-dot-active');
        }

        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    startAutoSlide();

    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    let startX = 0;
    let endX = 0;

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                nextSlide();
            } else if (endX - startX > 50) {
                prevSlide();
            }
            startAutoSlide();
        });
    }

    showSlide(0);
    
}



document.addEventListener('DOMContentLoaded', function () {
    if (typeof initFeedbackPage === "function") initFeedbackPage();
});





function initEventsPage() {
    
    const countdownElement = document.getElementById('rscCountdown');
    const filterButtons = document.querySelectorAll('.rsc-gallery-filter-btn');
    
    if (!countdownElement && filterButtons.length === 0) {
        return;
    }

    if (countdownElement) {
        const eventDate = new Date("Dec 25, 2025 18:00:00").getTime();

        const countdownInterval = setInterval(function() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countdown-days").textContent = String(days).padStart(2, '0');
            document.getElementById("countdown-hours").textContent = String(hours).padStart(2, '0');
            document.getElementById("countdown-minutes").textContent = String(minutes).padStart(2, '0');
            document.getElementById("countdown-seconds").textContent = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "<h3 style='color: var(--primary);'>The Event is Live!</h3>";
            }
        }, 1000);
    }

    if (filterButtons.length > 0) {
        const eventItems = document.querySelectorAll('.rsc-event-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('rsc-active'));
                this.classList.add('rsc-active');
                
                const filterValue = this.getAttribute('data-filter');

                eventItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    initEventsPage();
    
});



function initContactPage() {
    const contactForm = document.getElementById('rscContactForm');
    
    if (!contactForm) {
        return;
    }

    const submitBtn = document.getElementById('rscContactSubmitBtn');
    const formCard = document.getElementById('rscContactFormCard');
    const successCard = document.getElementById('rscContactSuccessCard');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.classList.add('rsc-is-flying'); 
        
        setTimeout(() => {
            formCard.style.display = 'none';
            successCard.style.display = 'block';
        }, 500);

        setTimeout(() => {
            successCard.style.display = 'none';
            formCard.style.display = 'block';
            
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.classList.remove('rsc-is-flying');
            
        }, 5000);
    });
}



document.addEventListener('DOMContentLoaded', function() {
 
    initContactPage();
    
});




function initMainFooter() {
    
    const yearElement = document.getElementById('rscFooterCurrentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const newsletterForm = document.querySelector('.rsc-main-footer-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.rsc-main-footer-newsletter-input');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (emailInput && submitBtn) {
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {

    initMainFooter();

});