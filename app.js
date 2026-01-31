// Form submission handled by backend server at /api/subscribe

// Form Elements (IDs from homepage_depth.html / index.html)
// Note: The new homepage might not have the form ID 'leadMagnetForm'.
// We need to ensure we target the correct elements.
// The new homepage uses buttons to link to sections, and might need a modal or direct form.
// Based on the HTML, it links to #lead-magnet or #masterclass.
// However, the original request implies using the same backend logic.
// Let's assume we'll add a form/modal or use this for the "Free ROI Guide" if implemented.

document.addEventListener('DOMContentLoaded', () => {
    // Check if the form exists (it might be added later or via modal)
    // If we simply want to reuse the Brevo logic, we can attach it to any form with the ID.
    const form = document.getElementById('leadMagnetForm');

    if (!form) {
        console.log('Lead magnet form not found on this page version.');
        return;
    }

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
            if (errorElement) errorElement.classList.remove('hidden');
            return false;
        } else {
            input.classList.remove('error');
            if (errorElement) errorElement.classList.add('hidden');
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

    // Submit to backend API (which then calls Brevo)
    async function submitToBrevo(firstName, email) {
        try {
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

            // Redirect to thank you page with personalization
            window.location.href = `/thank-you.html?firstName=${encodeURIComponent(firstName)}`;

        } catch (error) {
            alert('Unable to complete signup. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
