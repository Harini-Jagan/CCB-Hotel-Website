
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Toggle icon (hamburger to cross)
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking any nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Image Slider functionality
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;
let slideInterval;

// Initialize the slider logic only if slides exist
if (slides.length > 0) {
    function initSlider() {
        // Ensure first slide is shown
        slides[currentSlide].classList.add('active');
        startSlideInterval();
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));

        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
        resetInterval();
    }

    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
        resetInterval();
    }

    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 3000); // Trigger next slide every 3 seconds
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    // Attach click events for manual slider navigation wrapper
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Boot up the slider
    initSlider();
}

// Smooth scrolling for Anchor Links with offset for fixed Navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Ignore just '#'

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Header offset to account for fixed navbar covering the section top
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- Cart Logic Removed for Showcase Mode ---

const MOCK_MENU = [
    {
        id: "1",
        name: "Authentic Chicken Briyani",
        price: "₹120",
        image: "images/briyani2.jpg"
    },
    {
        id: "2",
        name: "Chicken 65 (1/4)",
        price: "₹80",
        image: "images/chicken652.jpg"
    },
    {
        id: "3",
        name: "Beeda",
        price: "₹10",
        image: "images/bedda.jpg"
    },
    {
        id: "4",
        name: "Creamy Ice Cream",
        price: "from ₹10",
        image: "images/icecream.jpg"
    },
    {
        id: "5",
        name: "Fresh Fruit Juice",
        price: "from ₹10",
        image: "images/juice.jpg"
    }
];

function fetchMenu() {
    try {
        renderMenu(MOCK_MENU);
    } catch (err) {
        console.error("Error fetching menu:", err);
        const grid = document.getElementById('dynamic-menu-grid');
        if (grid) grid.innerHTML = '<p style="color:red; text-align:center;">Failed to load menu. Please try again later.</p>';
    }
}

function renderMenu(menuItems) {
    const grid = document.getElementById('dynamic-menu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="menu-img-container">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-info">
                <div class="menu-title-row">
                    <h3>${item.name}</h3>
                    <span class="price">${item.price}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Booking Logic Removed ---

// Init Page details
fetchMenu();

// Dynamic Navbar Background & Styling on Scroll Down
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.8rem 5%';
            navbar.style.backgroundColor = 'rgba(139, 0, 0, 0.95)'; // Transparent dark red
        } else {
            navbar.style.padding = '1.2rem 5%';
            navbar.style.backgroundColor = 'var(--primary-color)';
        }
    });
}