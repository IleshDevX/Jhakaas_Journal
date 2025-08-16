const navItems = document.querySelector('.nav__items'); 
const navToggleBtn = document.querySelector('#open__nav-btn');
const closeNavBtn = document.querySelector('#close__nav-btn');

// Hide the close button permanently
if (closeNavBtn) {
    closeNavBtn.style.display = 'none';
}

// Track navigation state
let isNavOpen = false;

// Toggle Navigation Function
const toggleNav = () => {
    if (isNavOpen) {
        // Close navigation - slide out to the right
        navItems.classList.remove('show');
        isNavOpen = false;
        // Re-enable body scroll
        document.body.style.overflow = 'auto';
        console.log('Navigation closed');
    } else {
        // Open navigation - slide in from the right
        navItems.classList.add('show');
        isNavOpen = true;
        // Prevent body scroll when nav is open
        document.body.style.overflow = 'hidden';
        console.log('Navigation opened');
    }
}

// Close navigation when clicking on a nav link
const navLinks = document.querySelectorAll('.nav__items a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Only close on mobile (when toggle button is visible)
        if (window.getComputedStyle(navToggleBtn).display !== 'none') {
            navItems.classList.remove('show');
            isNavOpen = false;
            document.body.style.overflow = 'auto';
            console.log('Navigation closed via link click');
        }
    });
});

// Handle window resize to ensure proper display on screen size changes
window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
        // Desktop view - ensure nav is visible and button is hidden
        navItems.classList.remove('show');
        navToggleBtn.style.display = 'none';
        isNavOpen = false;
        document.body.style.overflow = 'auto';
        // Reset nav positioning for desktop
        navItems.style.position = 'static';
        navItems.style.right = 'auto';
        navItems.style.display = 'flex';
    } else {
        // Mobile view - ensure nav is hidden initially and button is visible
        navToggleBtn.style.display = 'inline-block';
        if (!isNavOpen) {
            navItems.classList.remove('show');
        }
        // Set nav positioning for mobile
        navItems.style.position = 'fixed';
        navItems.style.display = 'flex';
    }
});

// Initial setup based on screen size
if (window.innerWidth <= 1080) {
    navToggleBtn.style.display = 'inline-block';
    isNavOpen = false;
    navItems.style.position = 'fixed';
    navItems.style.display = 'flex';
} else {
    navToggleBtn.style.display = 'none';
    navItems.style.position = 'static';
    navItems.style.display = 'flex';
}

// Add click event listener to the toggle button
navToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle button clicked, current state:', isNavOpen);
    toggleNav();
});

// Close navigation when clicking on backdrop (outside the menu)
navItems.addEventListener('click', (e) => {
    // If clicking on the backdrop (the nav container itself, not menu items)
    if (e.target === navItems && isNavOpen) {
        navItems.classList.remove('show');
        isNavOpen = false;
        document.body.style.overflow = 'auto';
        console.log('Navigation closed by backdrop click');
    }
});

// Prevent closing when clicking inside the menu area
navItems.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Add swipe gesture support for mobile devices
let startX = 0;
let currentX = 0;
let isDragging = false;

navItems.addEventListener('touchstart', (e) => {
    if (isNavOpen) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
});

navItems.addEventListener('touchmove', (e) => {
    if (isDragging && isNavOpen) {
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        
        // Only allow swiping to the right (closing)
        if (deltaX > 0) {
            const progress = Math.min(deltaX / 200, 1); // 200px for full close
            navItems.style.transform = `translateX(${deltaX}px)`;
            navItems.style.opacity = 1 - (progress * 0.5);
        }
    }
});

navItems.addEventListener('touchend', (e) => {
    if (isDragging && isNavOpen) {
        const deltaX = currentX - startX;
        
        // If swiped more than 100px to the right, close the nav
        if (deltaX > 100) {
            navItems.classList.remove('show');
            isNavOpen = false;
            document.body.style.overflow = 'auto';
        }
        
        // Reset transform and opacity
        navItems.style.transform = '';
        navItems.style.opacity = '';
        isDragging = false;
    }
});