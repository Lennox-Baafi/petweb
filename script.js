// script.js - PetBuy Centre Application

// Global user state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const DOM = {
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    petCards: document.querySelectorAll('.pet-card'),
    petModal: document.getElementById('pet-modal'),
    proceedToAdoptBtn: document.getElementById('proceed-to-adopt'),
    loginRequiredMsg: document.getElementById('login-required'),
    adoptionForm: document.getElementById('adoption-form')
};

// Initialize the application
function init() {
    updateAuthUI();
    setupEventListeners();
    checkProtectedPages();
}

// Update UI based on authentication state
function updateAuthUI() {
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const logoutBtn = document.querySelector('.btn-logout');
    const welcomeMsg = document.querySelector('.welcome');

    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (welcomeMsg) {
            welcomeMsg.style.display = 'inline-block';
            welcomeMsg.textContent = `Welcome, ${currentUser.name}`;
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (welcomeMsg) welcomeMsg.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Login form
    if (DOM.loginForm) {
        DOM.loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form
    if (DOM.registerForm) {
        DOM.registerForm.addEventListener('submit', handleRegister);
    }

    // Pet cards and modal
    if (DOM.petCards.length > 0) {
        setupPetCards();
    }

    // Adoption form
    if (DOM.adoptionForm) {
        setupAdoptionForm();
    }

    // Close modal buttons
    const closeModalButtons = document.querySelectorAll('.close-modal, .btn-close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Window click to close modal
    window.addEventListener('click', (e) => {
        if (e.target === DOM.petModal) {
            closeModal();
        }
    });
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, you would verify credentials with a server
    currentUser = {
        email: email,
        name: email.split('@')[0], // Simple demo name
        token: 'demo-token-' + Math.random().toString(36).substr(2, 9)
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    alert('Login successful!');
    window.location.href = 'pets.html';
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone').value;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (!firstName || !lastName || !email || !password || !phone) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create user object
    currentUser = {
        email: email,
        name: `${firstName} ${lastName}`,
        phone: phone,
        token: 'demo-token-' + Math.random().toString(36).substr(2, 9)
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    alert('Registration successful! You are now logged in.');
    window.location.href = 'pets.html';
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
    window.location.href = 'index.html';
}

// Setup pet card interactions
function setupPetCards() {
    DOM.petCards.forEach(card => {
        const adoptBtn = card.querySelector('.btn-buy');
        adoptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPetModal(card);
        });
    });
}

// Open pet modal with pet info
function openPetModal(petCard) {
    const petName = petCard.querySelector('.pet-name').textContent;
    const petBreed = petCard.querySelector('.pet-breed').textContent;
    const petImage = petCard.querySelector('.pet-image').src;
    const petDetails = petCard.querySelectorAll('.pet-details span');
    const petHealth = petCard.querySelector('.pet-health').textContent;
    const petDescription = petCard.querySelector('p:not(.pet-breed):not(.pet-health)').textContent;
    
    // Populate modal
    document.getElementById('modal-pet-name').textContent = petName;
    document.getElementById('modal-pet-breed').textContent = petBreed;
    document.getElementById('modal-pet-image').src = petImage;
    document.getElementById('modal-pet-gender').innerHTML = petDetails[0].innerHTML;
    document.getElementById('modal-pet-age').innerHTML = petDetails[1].innerHTML;
    document.getElementById('modal-pet-health').textContent = petHealth;
    document.getElementById('modal-pet-description').textContent = petDescription;
    
    // Set up proceed button based on auth state
    if (currentUser) {
        DOM.proceedToAdoptBtn.style.display = 'inline-block';
        DOM.loginRequiredMsg.style.display = 'none';
        
        const petParam = petName.toLowerCase().split(' ')[0];
        DOM.proceedToAdoptBtn.onclick = () => {
            window.location.href = `adopt.html?pet=${petParam}`;
        };
    } else {
        DOM.proceedToAdoptBtn.style.display = 'none';
        DOM.loginRequiredMsg.style.display = 'block';
    }
    
    // Show modal
    DOM.petModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    if (DOM.petModal) {
        DOM.petModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Setup adoption form
function setupAdoptionForm() {
    // Check authentication
    if (!currentUser) {
        alert('You must be logged in to access the adoption form');
        window.location.href = 'login.html';
        return;
    }

    // Get pet info from URL
    const urlParams = new URLSearchParams(window.location.search);
    const petParam = urlParams.get('pet');
    
    if (petParam) {
        // In a real app, you would fetch pet info from database
        const petNameField = document.getElementById('pet-name');
        const pets = {
            'max': { name: 'Max - Golden Retriever' },
            'luna': { name: 'Luna - Siamese Cat' },
            'rocky': { name: 'Rocky - Siberian Husky' }
        };
        
        if (pets[petParam]) {
            petNameField.value = pets[petParam].name;
        }
    }

    // Form steps functionality
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (nextBtn && backBtn && submitBtn) {
        nextBtn.addEventListener('click', handleNextStep);
        backBtn.addEventListener('click', handleBackStep);
        submitBtn.addEventListener('click', handleFormSubmit);
    }
}

// Handle next step in adoption form
function handleNextStep() {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    
    // Validate form
    const requiredFields = step1.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    if (isValid) {
        generateReviewContent();
        step1.style.display = 'none';
        step2.style.display = 'block';
        updateProgressSteps(2);
    }
}

// Handle back step in adoption form
function handleBackStep() {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    
    step2.style.display = 'none';
    step1.style.display = 'block';
    updateProgressSteps(1);
}

// Handle form submission
function handleFormSubmit() {
    generateReceipt();
    
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    step2.style.display = 'none';
    step3.style.display = 'block';
    updateProgressSteps(3);
    
    storeAdoptionData();
}

// Generate review content
function generateReviewContent() {
    const personalInfo = document.getElementById('review-personal');
    const petInfo = document.getElementById('review-pet');
    
    personalInfo.innerHTML = `
        <p><strong>Name:</strong> ${document.getElementById('full-name').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>
        <p><strong>Address:</strong> ${document.getElementById('address').value}</p>
    `;
    
    petInfo.innerHTML = `
        <p><strong>Pet:</strong> ${document.getElementById('pet-name').value}</p>
        <p><strong>Adoption Reason:</strong> ${document.getElementById('adoption-reason').value}</p>
    `;
}

// Generate receipt
function generateReceipt() {
    const receiptInfo = document.getElementById('receipt-info');
    const now = new Date();
    const appointmentDate = new Date();
    appointmentDate.setDate(now.getDate() + 3); // 3 days from now
    
    receiptInfo.innerHTML = `
        <h4>Adoption Receipt</h4>
        <p><strong>Receipt ID:</strong> PB-${now.getTime().toString().slice(-6)}</p>
        <p><strong>Date:</strong> ${now.toLocaleDateString()}</p>
        <hr>
        <p><strong>Pet:</strong> ${document.getElementById('pet-name').value}</p>
        <p><strong>Adopter:</strong> ${document.getElementById('full-name').value}</p>
        <hr>
        <h4>Appointment Details</h4>
        <p>Please visit our center on:</p>
        <p><strong>${appointmentDate.toLocaleDateString()} at 10:00 AM</strong></p>
        <p>Bring this receipt and a valid ID to complete the adoption process.</p>
        <hr>
        <p><strong>PetBuy Centre</strong><br>
        Okponglo, Accra-Ghana<br>
        Phone: +233 20 781 5205</p>
    `;
}

// Store adoption data
function storeAdoptionData() {
    const adoptionData = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        pet: document.getElementById('pet-name').value,
        date: new Date().toLocaleDateString(),
        receiptId: `PB-${new Date().getTime().toString().slice(-6)}`
    };
    
    localStorage.setItem('adoptionData', JSON.stringify(adoptionData));
}

// Update progress steps
function updateProgressSteps(activeStep) {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index + 1 < activeStep) {
            step.classList.add('completed');
        } else if (index + 1 === activeStep) {
            step.classList.add('active');
        }
    });
}

// Check protected pages
function checkProtectedPages() {
    if (window.location.pathname.includes('adopt.html') && !currentUser) {
        alert('You must be logged in to access this page');
        window.location.href = 'login.html';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);