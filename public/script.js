
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

// --- Cart Logic ---
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPrice = document.getElementById('cart-total-price');
const placeOrderBtn = document.getElementById('place-order-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

let cart = JSON.parse(localStorage.getItem('ccb_cart')) || [];

function saveCart() {
    localStorage.setItem('ccb_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Update items display
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalPrice.textContent = '₹0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn minus" data-id="${item.id}">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn plus" data-id="${item.id}">+</button>
                <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalPrice.textContent = '₹' + total;
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// Event Listeners for Cart Actions
if (cartIcon) cartIcon.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Add to Cart Buttons
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        addToCart(id, name, price);
    });
});

// Cart Items container clicks (Event Delegation)
if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('plus')) {
            const id = e.target.getAttribute('data-id');
            changeQuantity(id, 1);
        } else if (e.target.classList.contains('minus')) {
            const id = e.target.getAttribute('data-id');
            changeQuantity(id, -1);
        } else if (e.target.classList.contains('remove-item')) {
            const id = e.target.getAttribute('data-id');
            removeItem(id);
        }
    });
}

// Place Order
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Thank you for your order! Your Briyani is on its way.");
        clearCart();
        closeCart();
    });
}

// Init Cart UI on load
updateCartUI();


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