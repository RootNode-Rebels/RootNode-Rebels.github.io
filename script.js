// script.js - RootNode Rebels Interactions

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Fade-In Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Mouse Glow Orb Tracking
    const glowOrb = document.getElementById('glow-orb');
    
    if (glowOrb) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                requestAnimationFrame(() => {
                    glowOrb.style.left = `${e.clientX}px`;
                    glowOrb.style.top = `${e.clientY}px`;
                });
            }
        });
    }

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Contact Form Handler (Mail Automation)
    const contactForm = document.getElementById('contactForm');
    
    // ⚠️ REPLACE THIS URL WITH YOUR NEW GOOGLE APPS SCRIPT URL ⚠️
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (scriptURL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                alert("Please add your Google Script URL to script.js to enable mail automation!");
                return;
            }
            
            // Get the submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Show loading state
            submitBtn.innerText = 'Transmitting...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            
            // Send Data to Google Apps Script
            fetch(scriptURL, { method: 'POST', body: new FormData(contactForm) })
                .then(response => {
                    // Remove form inputs and show success message
                    this.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <h3 style="color: var(--accent-emerald); font-size: 1.5rem; margin-bottom: 10px;">Transmission Successful!</h3>
                            <p style="color: var(--text-muted);">Your message has been securely delivered to RootNode Rebels.</p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = 'Transmission Failed';
                    submitBtn.style.background = '#ef4444';
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }
});
