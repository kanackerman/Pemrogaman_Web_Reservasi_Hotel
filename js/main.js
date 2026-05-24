// LUMIERE Hotel - Main JavaScript with React-like Hooks Patterns

// Custom useState Hook
function useState(initialValue) {
    let state = initialValue;
    const listeners = [];
    
    const setState = (newValue) => {
        state = typeof newValue === 'function' ? newValue(state) : newValue;
        listeners.forEach(listener => listener(state));
    };
    
    const getState = () => state;
    
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    };
    
    return [getState, setState, subscribe];
}

// Custom useEffect Hook
function useEffect(callback, dependencies = []) {
    let prevDependencies = [];
    let cleanup;
    
    const runEffect = () => {
        if (cleanup) cleanup();
        cleanup = callback();
    };
    
    const checkDependencies = (currentDependencies) => {
        const hasChanged = dependencies.some((dep, index) => 
            dep !== currentDependencies[index]
        );
        
        if (dependencies.length === 0 || hasChanged) {
            prevDependencies = [...currentDependencies];
            runEffect();
        }
    };
    
    return { checkDependencies };
}

// Custom useReducer Hook
function useReducer(reducer, initialState) {
    const [getState, setState] = useState(initialState);
    
    const dispatch = (action) => {
        setState(currentState => reducer(currentState, action));
    };
    
    return [getState, dispatch];
}

// Application State
const appState = {
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    notifications: [],
    bookings: [],
    rooms: [],
    cart: []
};

// User State with useState
const [getUser, setUser] = useState(null);
const [getIsLoggedIn, setIsLoggedIn] = useState(false);
const [getIsAdmin, setIsAdmin] = useState(false);
const [getNotifications, setNotifications] = useState([]);

// Notification System
function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString()
    };
    
    const currentNotifications = getNotifications();
    setNotifications([...currentNotifications, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification.id);
    }, 5000);
}

function removeNotification(id) {
    const currentNotifications = getNotifications();
    setNotifications(currentNotifications.filter(n => n.id !== id));
}

// Session Management
function setSession(user, isAdmin = false) {
    localStorage.setItem('lumiere_user', JSON.stringify(user));
    localStorage.setItem('lumiere_is_admin', isAdmin);
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
}

function getSession() {
    const user = JSON.parse(localStorage.getItem('lumiere_user'));
    const isAdmin = localStorage.getItem('lumiere_is_admin') === 'true';
    
    if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
    }
    
    return { user, isAdmin };
}

function clearSession() {
    localStorage.removeItem('lumiere_user');
    localStorage.removeItem('lumiere_is_admin');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    addNotification('Anda telah logout', 'success');
}

// Room Data
const roomsData = [
    {
        id: 1,
        name: 'Deluxe Room',
        type: 'deluxe',
        capacity: 2,
        units: 30,
        priceWeekday: 650000,
        priceWeekend: 750000,
        priceBreakfastWeekday: 750000,
        priceBreakfastWeekend: 850000,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        facilities: ['AC', 'Smart TV', 'WiFi', 'Kamar mandi pribadi', 'Air mineral', 'Lemari pakaian'],
        description: 'Kamar standar yang nyaman dan fungsional'
    },
    {
        id: 2,
        name: 'Business Suite',
        type: 'business',
        capacity: 2,
        units: 45,
        priceWeekday: 950000,
        priceWeekend: 1050000,
        priceBreakfastWeekday: 1050000,
        priceBreakfastWeekend: 1150000,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
        facilities: ['Meja kerja', 'Kursi kerja', 'Smart TV', 'WiFi', 'AC', 'Mini bar'],
        description: 'Dirancang untuk kebutuhan bisnis dan perjalanan dinas'
    },
    {
        id: 3,
        name: 'Grand Deluxe Room',
        type: 'grand-deluxe',
        capacity: 2,
        units: 38,
        priceWeekday: 1150000,
        priceWeekend: 1300000,
        priceBreakfastWeekday: 1250000,
        priceBreakfastWeekend: 1400000,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
        facilities: ['Sofa santai', 'Smart TV', 'WiFi', 'AC', 'City view', 'Mini bar'],
        description: 'Kamar lebih luas untuk relaksasi dan staycation'
    },
    {
        id: 4,
        name: 'Family Suite',
        type: 'family',
        capacity: 6,
        units: 30,
        priceWeekday: 1850000,
        priceWeekend: 2050000,
        priceBreakfastWeekday: 2000000,
        priceBreakfastWeekend: 2200000,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
        facilities: ['2 tempat tidur', 'Ruang keluarga kecil', 'Smart TV', 'WiFi', 'AC', 'Dining area'],
        description: 'Cocok untuk keluarga dan grup kecil'
    },
    {
        id: 5,
        name: 'Executive Suite',
        type: 'executive',
        capacity: 4,
        units: 7,
        priceWeekday: 3500000,
        priceWeekend: 3900000,
        priceBreakfastWeekday: 3800000,
        priceBreakfastWeekend: 4200000,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        facilities: ['Living room', 'Bathtub', 'Smart TV', 'WiFi', 'Mini bar premium', 'Premium interior'],
        description: 'Kamar premium dengan fasilitas eksklusif'
    }
];

// Ballroom Data
const ballroomData = [
    {
        id: 1,
        name: 'LUMIERE GRAND BALLROOM',
        description: 'Ballroom terbesar dan paling mewah di Hotel Lumiere yang dirancang untuk acara berskala besar dengan interior elegan dan fasilitas premium.',
        capacity: {
            theater: 1000,
            roundTable: 700,
            classroom: 500
        },
        price: {
            weekdayNonCatering: 25000000,
            weekdayCatering: 40000000,
            weekendNonCatering: 32000000,
            weekendCatering: 48000000
        },
        facilities: ['LED Screen', 'Sound System Premium', 'WiFi', 'AC', 'Stage Besar', 'Lighting Premium', 'Ruang Persiapan', 'Area Parkir Luas'],
        suitableFor: ['Wedding', 'Wisuda', 'Gala Dinner', 'Konser Indoor', 'Seminar Besar'],
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400'
    },
    {
        id: 2,
        name: 'AURORA BALLROOM',
        description: 'Ballroom modern dengan desain fleksibel yang cocok digunakan untuk acara perusahaan, seminar, dan gathering formal.',
        capacity: {
            theater: 400,
            roundTable: 250,
            classroom: 180
        },
        price: {
            weekdayNonCatering: 15000000,
            weekdayCatering: 24000000,
            weekendNonCatering: 19000000,
            weekendCatering: 29000000
        },
        facilities: ['Projector', 'Sound System', 'WiFi', 'AC', 'Stage', 'Microphone Wireless', 'Meja & Kursi Event'],
        suitableFor: ['Seminar', 'Conference', 'Gathering', 'Workshop', 'Corporate Meeting'],
        image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400'
    },
    {
        id: 3,
        name: 'SERENITY BALLROOM',
        description: 'Ballroom dengan suasana lebih private dan nyaman yang dirancang untuk acara formal berskala kecil hingga menengah.',
        capacity: {
            theater: 150,
            roundTable: 100,
            classroom: 80
        },
        price: {
            weekdayNonCatering: 6000000,
            weekdayCatering: 12000000,
            weekendNonCatering: 8000000,
            weekendCatering: 15000000
        },
        facilities: ['Projector', 'WiFi', 'Sound System', 'AC', 'Whiteboard', 'Meeting Table', 'Coffee Break Area'],
        suitableFor: ['Private Meeting', 'Workshop', 'Birthday Party', 'Family Gathering', 'Small Seminar'],
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400'
    }
];

// Restaurant Menu Data
const restaurantMenu = [
    {
        id: 1,
        name: 'Nasi Goreng Spesial',
        category: 'Main Course',
        price: 85000,
        description: 'Nasi goreng dengan ayam, udang, dan telur',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300'
    },
    {
        id: 2,
        name: 'Mie Goreng Seafood',
        category: 'Main Course',
        price: 95000,
        description: 'Mie goreng dengan campuran seafood segar',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300'
    },
    {
        id: 3,
        name: 'Sate Ayam',
        category: 'Appetizer',
        price: 65000,
        description: 'Sate ayam dengan bumbu kacang',
        image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=300'
    },
    {
        id: 4,
        name: 'Es Kelapa Muda',
        category: 'Beverage',
        price: 35000,
        description: 'Es kelapa muda segar',
        image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=300'
    },
    {
        id: 5,
        name: 'Steak Wagyu',
        category: 'Main Course',
        price: 350000,
        description: 'Steak wagyu premium dengan saus spesial',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300'
    },
    {
        id: 6,
        name: 'Salad Buah',
        category: 'Appetizer',
        price: 55000,
        description: 'Salad buah segar dengan dressing yogurt',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300'
    },
    {
        id: 7,
        name: 'Kopi Latte',
        category: 'Beverage',
        price: 45000,
        description: 'Kopi latte dengan foam lembut',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300'
    },
    {
        id: 8,
        name: 'Chocolate Lava Cake',
        category: 'Dessert',
        price: 75000,
        description: 'Chocolate cake dengan cairan coklat di dalam',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300'
    }
];

// Filter Rooms
function filterRooms(filters) {
    return roomsData.filter(room => {
        if (filters.type && room.type !== filters.type) return false;
        if (filters.capacity && room.capacity < filters.capacity) return false;
        if (filters.maxPrice && room.priceWeekday > filters.maxPrice) return false;
        return true;
    });
}

// Search Rooms
function searchRooms(query) {
    const searchTerm = query.toLowerCase();
    return roomsData.filter(room => 
        room.name.toLowerCase().includes(searchTerm) ||
        room.description.toLowerCase().includes(searchTerm) ||
        room.facilities.some(f => f.toLowerCase().includes(searchTerm))
    );
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format Date
function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Calculate Days Between Dates
function calculateDaysBetween(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Calculate Total Price
function calculateTotalPrice(room, checkIn, checkOut, includeBreakfast, isWeekend) {
    const days = calculateDaysBetween(checkIn, checkOut);
    let pricePerNight = isWeekend ? room.priceWeekend : room.priceWeekday;
    
    if (includeBreakfast) {
        pricePerNight = isWeekend ? room.priceBreakfastWeekend : room.priceBreakfastWeekday;
    }
    
    return pricePerNight * days;
}

// Room Slider Functionality
let currentSlide = 0;
const slideRooms = (direction) => {
    const container = document.querySelector('.room-slider-container');
    const cardWidth = 330; // card width + gap
    const maxSlide = roomsData.length - 3;
    
    currentSlide += direction;
    
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    
    container.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
};

// Image Upload Handler
function handleImageUpload(input, previewElement) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Form Validation
function validateForm(formData) {
    const errors = {};
    
    if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Nama harus diisi';
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = 'Email tidak valid';
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
        errors.phone = 'Nomor telepon harus diisi';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// Initialize App
function initApp() {
    getSession();
    initScrollToTop();
    
    // Dynamic Navbar based on Login state
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (authButtonsContainer) {
        if (getIsLoggedIn()) {
            const user = getSession().user;
            const isAdmin = getIsAdmin();
            const profileLink = isAdmin ? (window.location.pathname.includes('admin') ? 'dashboard.html' : 'admin/dashboard.html') : 'profile.html';
            authButtonsContainer.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-gold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: var(--gold); border-color: var(--gold);">
                        <i class="fas fa-user-circle me-2"></i>${user ? user.name : 'User'}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" style="background: var(--ebony); border: 1px solid var(--deep-taupe);">
                        <li><a class="dropdown-item" href="${profileLink}" style="color: var(--silver-grey);"><i class="fas fa-user me-2"></i>Profil</a></li>
                        <li><hr class="dropdown-divider" style="border-color: var(--deep-taupe);"></li>
                        <li><a class="dropdown-item" href="#" onclick="handleLogout(event)" style="color: var(--silver-grey);"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            `;
        }
    } else {
        // Jika tidak ada auth-buttons, mungkin ini layout lama yg menggunakan nav-item biasa
        const nav = document.querySelector('.navbar-nav');
        if (nav && getIsLoggedIn()) {
            const loginLink = Array.from(nav.querySelectorAll('.nav-link')).find(a => a.textContent.toLowerCase() === 'login' || a.textContent.toLowerCase() === 'masuk');
            if (loginLink) {
                const li = loginLink.parentElement;
                const user = getSession().user;
                const isAdmin = getIsAdmin();
                const profileLink = isAdmin ? (window.location.pathname.includes('admin') ? 'dashboard.html' : 'admin/dashboard.html') : 'profile.html';
                li.innerHTML = `
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-circle me-1"></i>${user ? user.name : 'User'}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" style="background: var(--ebony); border: 1px solid var(--deep-taupe);">
                            <li><a class="dropdown-item" href="${profileLink}" style="color: var(--silver-grey);">Profil</a></li>
                            <li><hr class="dropdown-divider" style="border-color: var(--deep-taupe);"></li>
                            <li><a class="dropdown-item" href="#" onclick="handleLogout(event)" style="color: var(--silver-grey);">Logout</a></li>
                        </ul>
                    </div>
                `;
            }
            // Hapus tombol register jika ada
            const registerLink = Array.from(nav.querySelectorAll('.nav-link')).find(a => a.textContent.toLowerCase() === 'register' || a.textContent.toLowerCase() === 'daftar');
            if (registerLink) {
                registerLink.parentElement.remove();
            }
        }
    }

    // Check if user is on login page
    if (window.location.pathname.includes('login.html')) {
        initLoginPage();
    }
    
    // Check if user is on admin page
    if (window.location.pathname.includes('admin')) {
        if (!getIsAdmin()) {
            window.location.href = '../login.html';
        }
    }

    // Booking Flow Initialize
    initBookingFlow();
}

// Login Page Initialization
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Simulate login (in real app, this would be an API call)
    if (email && password) {
        const user = {
            id: 1,
            name: 'User Demo',
            email: email,
            phone: '+62 812 3456 7890'
        };
        
        const isAdmin = role === 'admin';
        setSession(user, isAdmin);
        
        addNotification('Login berhasil!', 'success');
        
        if (isAdmin) {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'profile.html';
        }
    } else {
        addNotification('Email dan password harus diisi', 'error');
    }
}

// Handle Logout
function handleLogout(e) {
    if (e) e.preventDefault();
    clearSession();
    // Redirect ke home tergantung dari path saat ini
    if (window.location.pathname.includes('admin/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Booking Flow Handling
function initBookingFlow() {
    // 1. Tangkap submit dari form booking
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const roomType = document.getElementById('roomType')?.value || '';
            const checkIn = document.getElementById('checkIn')?.value || '';
            const checkOut = document.getElementById('checkOut')?.value || '';
            const roomCount = document.getElementById('roomCount')?.value || '1';
            const guestName = document.getElementById('guestName')?.value || '';
            const guestEmail = document.getElementById('guestEmail')?.value || '';
            const guestPhone = document.getElementById('guestPhone')?.value || '';
            const guestCount = document.getElementById('guestCount')?.value || '2';
            const breakfast = document.getElementById('breakfast')?.value === 'yes';

            const bookingData = {
                roomType, checkIn, checkOut, roomCount, guestName, guestEmail, guestPhone, guestCount, breakfast,
                id: 'BK' + new Date().getTime().toString().slice(-6)
            };
            localStorage.setItem('lumiere_current_booking', JSON.stringify(bookingData));
            window.location.href = 'booking-confirmation.html';
        });
    }

    // 2. Tampilkan data di booking confirmation
    if (window.location.pathname.includes('booking-confirmation.html')) {
        const data = JSON.parse(localStorage.getItem('lumiere_current_booking'));
        if (data) {
            // Find elements to populate, based on HTML structure
            const strongElements = document.querySelectorAll('.card-text');
            strongElements.forEach(el => {
                if (el.innerHTML.includes('ID Booking:')) el.innerHTML = `<strong>ID Booking:</strong> #${data.id}`;
                if (el.innerHTML.includes('Tipe Kamar:')) el.innerHTML = `<strong>Tipe Kamar:</strong> ${data.roomType}`;
                if (el.innerHTML.includes('Jumlah Kamar:')) el.innerHTML = `<strong>Jumlah Kamar:</strong> ${data.roomCount}`;
                if (el.innerHTML.includes('Check In:')) el.innerHTML = `<strong>Check In:</strong> ${data.checkIn}`;
                if (el.innerHTML.includes('Check Out:')) el.innerHTML = `<strong>Check Out:</strong> ${data.checkOut}`;
                if (el.innerHTML.includes('Nama Tamu:')) el.innerHTML = `<strong>Nama Tamu:</strong> ${data.guestName}`;
                if (el.innerHTML.includes('Email:')) el.innerHTML = `<strong>Email:</strong> ${data.guestEmail}`;
                if (el.innerHTML.includes('Telepon:')) el.innerHTML = `<strong>Telepon:</strong> ${data.guestPhone}`;
                if (el.innerHTML.includes('Jumlah Tamu:')) el.innerHTML = `<strong>Jumlah Tamu:</strong> ${data.guestCount} Orang`;
                if (el.innerHTML.includes('Breakfast:')) el.innerHTML = `<strong>Breakfast:</strong> ${data.breakfast ? 'Include' : 'Exclude'}`;
            });
        }
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        useState,
        useEffect,
        useReducer,
        addNotification,
        removeNotification,
        setSession,
        getSession,
        clearSession,
        filterRooms,
        searchRooms,
        formatCurrency,
        formatDate,
        calculateDaysBetween,
        calculateTotalPrice,
        slideRooms,
        handleImageUpload,
        validateForm,
        handleLogin,
        handleLogout,
        roomsData,
        ballroomData,
        restaurantMenu
    };
}
