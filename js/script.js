// Skip preloader if already seen in this session to avoid interior page-navigation delays
if (sessionStorage.getItem('preloaderShown')) {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none'; // Instant hide with no rendering wait
    }
}

// ==========================================
// 📱 1. MOBILE NAVIGATION MENU TOGGLE
// ==========================================
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    // Click event to open/close menu on mobile screens
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggle menu visibility
        const icon = mobileToggle.querySelector('i');
        
        // Swap between Burger (Bars) and X Mark icons during toggle
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Automatically close the mobile menu once any link inside is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        });
    });
}

// ==========================================
// 🧭 2. STICKY NAVBAR SCROLL BACKGROUND
// ==========================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    // Adds background overlay to Navbar after scrolling 50px down
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// 🎬 3. SCROLL REVEAL ANIMATIONS (OBSERVER)
// ==========================================
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is in view
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits top
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // Add animation trigger class
        }
    });
}, observerOptions);

// Dynamically attach reveals to content blocks (cards, titles, images)
document.querySelectorAll('section').forEach(sec => {
    const title = sec.querySelector('.section-title');
    if (title) { title.classList.add('reveal'); observer.observe(title); }

    // Staggered reveal for grid elements (adds slight timing delay per card)
    sec.querySelectorAll('.record-card, .event-card, .leader-card, .gallery-item').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    sec.querySelectorAll('.about-text, .about-image').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});

// ==========================================
// 🔍 4. LIGHTBOX (GALLERY IMAGE ZOOM VIEW)
// ==========================================
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `<div class="lightbox-content"><img src="" alt="" class="lightbox-img"></div><button class="lightbox-close"><i class="fa-solid fa-xmark"></i></button>`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-img');
const closeBtn = lightbox.querySelector('.lightbox-close');

// Open Zoom Lightbox when general gallery items are clicked
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', (e) => {
        const parentA = img.closest('a');
        if (parentA) { e.preventDefault(); } // Stop normal click page redirects if single-page viewing
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
    });
});

// Close Lightbox logics
const closeLightbox = () => { lightbox.classList.remove('active'); };
closeBtn.addEventListener('click', closeLightbox); // Close via X button
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { closeLightbox(); } }); // Close via background click
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) { closeLightbox(); } }); // Close via ESC key

// ==========================================
// ⏳ 5. PRELOADER BOOT ANIMATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    // Run animation ONLY if it hasn't loaded before in this session
    if (preloader && !sessionStorage.getItem('preloaderShown')) {
        // Fire immediately instead of waiting for heavy images to download
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                sessionStorage.setItem('preloaderShown', 'true'); // Flag loaded sets to memory
            }, 400); // 400ms fade transition delay
        }, 100); // Ultra-fast 100ms delay instead of 2000ms
    }
});

// ==========================================
// 鼠标 6. GLOWING CUSTOM CURSOR
// ==========================================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
const cursorDot = document.createElement('div');
cursorDot.classList.add('custom-cursor-dot');
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

// Move custom cursor dynamically to match native mouse move pixels
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

// Scale Shrink Effect on click hold (Down/Up)
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Expand Trigger on hover (Links, buttons, interactive zones)
const interactives = document.querySelectorAll('a, button, .mobile-toggle, input, textarea, .gallery-item');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ==========================================
// 🖼️ 7. PRELAZY-LOADING TRIGGER SETUP
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        // Observer to load images smoothly BEFORE they scroll fully up on viewport (500px pre-cache buffer)
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if(img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '500px 0px' 
        });

        images.forEach(img => imageObserver.observe(img));
    }
});
