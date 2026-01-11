// Form submission now handled by backend server at cookingrescue.com

// Form Elements
const form = document.getElementById('leadMagnetForm');
const firstNameInput = document.getElementById('firstName');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const firstNameError = document.getElementById('firstNameError');
const emailError = document.getElementById('emailError');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate individual field
function validateField(input, errorElement, validationFn) {
    const isValid = validationFn(input.value);

    if (!isValid) {
        input.classList.add('error');
        errorElement.classList.remove('hidden');
        return false;
    } else {
        input.classList.remove('error');
        errorElement.classList.add('hidden');
        return true;
    }
}

// Validation functions
function validateFirstName(value) {
    return value.trim().length > 0;
}

function validateEmail(value) {
    return emailRegex.test(value.trim());
}

// Real-time validation
firstNameInput.addEventListener('blur', () => {
    validateField(firstNameInput, firstNameError, validateFirstName);
});

emailInput.addEventListener('blur', () => {
    validateField(emailInput, emailError, validateEmail);
});

// Remove error on input
firstNameInput.addEventListener('input', () => {
    if (firstNameInput.classList.contains('error')) {
        firstNameInput.classList.remove('error');
        firstNameError.classList.add('hidden');
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        emailInput.classList.remove('error');
        emailError.classList.add('hidden');
    }
});

// Show loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'Get My Free Guide Now!';
    }
}

// Show success message
function showSuccess() {
    successMessage.classList.remove('hidden');
    form.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Show error message
function showError(message) {
    alert(message || 'Something went wrong. Please try again.');
}

// Submit to backend API (which then calls Brevo)
async function submitToBrevo(firstName, email) {
    try {
        // Use relative URL - works for both localhost and production
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                email: email
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to subscribe');
        }

        return { success: true };
    } catch (error) {
        console.error('Subscription Error:', error);
        throw error;
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateField(firstNameInput, firstNameError, validateFirstName);
    const isEmailValid = validateField(emailInput, emailError, validateEmail);

    if (!isFirstNameValid || !isEmailValid) {
        return;
    }

    // Get form values
    const firstName = firstNameInput.value.trim();
    const email = emailInput.value.trim();

    // Set loading state
    setLoadingState(true);

    try {
        // Submit to Brevo
        await submitToBrevo(firstName, email);

        // Show success message
        showSuccess();

        // Optional: Track conversion with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                event_category: 'Lead Magnet',
                event_label: 'Meal Prep Guide'
            });
        }

    } catch (error) {
        showError('Unable to complete signup. Please try again or contact support.');
    } finally {
        setLoadingState(false);
    }
});

// Add subtle animations on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe elements for scroll animations
document.querySelectorAll('.trust-badge').forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    badge.style.transition = 'all 0.6s ease';
    observer.observe(badge);
});
