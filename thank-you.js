// Thank You Page JavaScript
// Handles confetti animation, countdown timer, personalization, and social sharing

// ========================================
// 1. PERSONALIZATION FROM URL PARAMETER
// ========================================
function getUserName() {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');

    if (firstName && firstName.trim().length > 0) {
        return firstName.trim();
    }
    return 'Friend';
}

// Set user's name in the hero title
document.addEventListener('DOMContentLoaded', () => {
    const userName = getUserName();
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
});

// ========================================
// 2. CONFETTI ANIMATION
// ========================================
class ConfettiAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = [
            '#FF8C00', // Brand orange
            '#FFA533', // Light orange
            '#CC7000', // Dark orange
            '#36454F', // Brand charcoal
            '#4A5A64', // Light charcoal
            '#FFB84D'  // Lighter orange
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            velocity: {
                x: (Math.random() - 0.5) * 4,
                y: Math.random() * 3 + 2
            },
            size: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            shape: Math.random() > 0.5 ? 'square' : 'circle',
            opacity: 1
        };
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate((particle.rotation * Math.PI) / 180);

        if (particle.shape === 'square') {
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    updateParticle(particle) {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.rotation += particle.rotationSpeed;
        particle.velocity.y += 0.1; // Gravity

        // Fade out as particles fall
        if (particle.y > this.canvas.height * 0.8) {
            particle.opacity -= 0.02;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Add new particles
        if (this.particles.length < 150 && Math.random() > 0.5) {
            this.particles.push(this.createParticle());
        }

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);

            // Remove particles that are off screen or fully transparent
            return particle.y < this.canvas.height + 50 && particle.opacity > 0;
        });

        // Continue animation if there are still particles
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }

    start(duration = 5000) {
        // Create initial burst
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();

        // Stop creating new particles after duration
        setTimeout(() => {
            // No new particles will be created, existing ones will fall and fade
        }, duration);
    }
}

// Initialize confetti on page load
const confettiCanvas = document.getElementById('confettiCanvas');
if (confettiCanvas) {
    const confetti = new ConfettiAnimation(confettiCanvas);
    confetti.start(5000); // Run for 5 seconds
}

// ========================================
// 3. COUNTDOWN TIMER
// ========================================
class CountdownTimer {
    constructor(elementId, startMinutes = 5) {
        this.element = document.getElementById(elementId);
        this.totalSeconds = startMinutes * 60;
        this.interval = null;
    }

    format(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    start() {
        this.update();

        this.interval = setInterval(() => {
            this.totalSeconds--;

            if (this.totalSeconds <= 0) {
                this.stop();
                this.element.textContent = '0:00';
                this.element.parentElement.querySelector('p').textContent = 'Check your inbox now!';
            } else {
                this.update();
            }
        }, 1000);
    }

    update() {
        this.element.textContent = this.format(this.totalSeconds);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Start countdown timer
const countdown = new CountdownTimer('countdown', 5);
countdown.start();

// ========================================
// 4. SOCIAL SHARING HANDLERS
// ========================================
const shareData = {
    url: 'https://cookingrescue.com/',
    title: 'Free Meal Prep Mastery Guide',
    text: 'I just got this amazing FREE meal prep guide that saves 10+ hours per week! Check it out:'
};

// Facebook Share
document.getElementById('shareFacebook')?.addEventListener('click', (e) => {
    e.preventDefault();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    openShareWindow(url, 'Facebook Share');

    trackShare('Facebook');
});

// Twitter Share
document.getElementById('shareTwitter')?.addEventListener('click', (e) => {
    e.preventDefault();
    const text = `${shareData.text} ${shareData.url}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    openShareWindow(url, 'Twitter Share');

    trackShare('Twitter');
});

// LinkedIn Share
document.getElementById('shareLinkedIn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
    openShareWindow(url, 'LinkedIn Share');

    trackShare('LinkedIn');
});

function openShareWindow(url, title) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
        url,
        title,
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0`
    );
}

function trackShare(platform) {
    // Track with analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            method: platform,
            content_type: 'Lead Magnet',
            item_id: 'Meal Prep Guide'
        });
    }

    console.log(`Shared on ${platform}`);
}

// ========================================
// CTA BUTTON HANDLER
// ========================================
document.getElementById('downloadGuideBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    // Google Drive direct download link for Meal Prep Guide
    const guideUrl = 'https://drive.google.com/uc?export=download&id=10Z0wDfuJShC1k0vyBooYGwZxl_6eN0yx';

    // Open the guide in a new tab (triggers download)
    window.open(guideUrl, '_blank');

    // Track the download
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            event_category: 'Lead Magnet',
            event_label: 'Meal Prep Guide',
            value: 1
        });
    }

    console.log('Guide download clicked');
});

// ========================================
// 5. ADD SVG GRADIENT DEFINITION
// ========================================
// Add gradient definition for the checkmark SVG
document.addEventListener('DOMContentLoaded', () => {
    const svg = document.querySelector('.checkmark');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#FF8C00;stop-opacity:1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#FFA533;stop-opacity:1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
});

// ========================================
// 6. SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe animated elements
document.querySelectorAll('.win-card, .resource-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ========================================
// 7. CLEANUP
// ========================================
// Clean up countdown when page is unloaded
window.addEventListener('beforeunload', () => {
    countdown.stop();
});

console.log('✅ Thank you page loaded successfully!');
console.log(`👋 Welcome, ${getUserName()}!`);
