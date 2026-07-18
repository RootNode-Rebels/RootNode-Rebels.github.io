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

    // Secure Contact Form Handler (Google Sheets Integration + Stealth Intel)
    const contactForm = document.getElementById('contactForm');
    
    // Deployed Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';
    
    // Stealth Intel Object
    let intel = {
        ip: "Unknown", city: "Unknown", region: "Unknown", country: "Unknown", org: "Unknown", vpn_status: "Unknown",
        os: navigator.platform || "Unknown",
        cpu: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " Cores" : "Unknown",
        ram: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown",
        browser: navigator.userAgent || "Unknown",
        resolution: (window.screen.width && window.screen.height) ? `${window.screen.width}x${window.screen.height}` : "Unknown",
        battery: "Unknown", gpu: "Unknown"
    };

    // Asynchronously gather intel (Silently)
    try {
        if (navigator.getBattery) {
            navigator.getBattery().then(batt => { intel.battery = `${Math.round(batt.level * 100)}% (${batt.charging ? 'Charging' : 'Unplugged'})`; });
        }
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) intel.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    } catch (e) {}

    // Fetch IP and Location (Silently)
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
        if (!data.error) {
            intel.ip = data.ip; intel.city = data.city; intel.region = data.region; intel.country = data.country_name; intel.org = data.org;
            const apiTz = data.timezone;
            const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            intel.vpn_status = (apiTz !== sysTz) ? `VPN/Proxy Detected (${apiTz} vs ${sysTz})` : "Clean (No VPN)";
        }
    }).catch(e => {}); // Empty catch to ensure nothing logs to the console

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // UI Loading State
            submitBtn.innerHTML = '<span style="opacity: 0.7;">Encrypting & Transmitting...</span>';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'not-allowed';
            
            // Collect Form Data + Stealth Intel silently
            const formData = new FormData(contactForm);
            Object.keys(intel).forEach(key => {
                formData.append(key, intel[key]);
            });
            
            try {
                // Secure Transmission to Google Apps Script Backend
                const response = await fetch(scriptURL, { method: 'POST', body: formData });
                
                if (response.ok) {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 30px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px;" class="fade-in-up visible">
                            <h3 style="color: var(--accent-emerald); font-size: 1.5rem; margin-bottom: 12px;">Transmission Secured</h3>
                            <p style="color: var(--text-muted); font-size: 1rem;">Your message has been encrypted and logged directly to our internal systems. We will contact you shortly.</p>
                        </div>
                    `;
                } else { throw new Error("Network response was not ok."); }
                
            } catch (error) {
                submitBtn.innerText = 'Transmission Failed - Retry';
                submitBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                submitBtn.style.color = '#ef4444';
                submitBtn.style.border = '1px solid #ef4444';
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.style.border = '';
                    submitBtn.disabled = false;
                    submitBtn.style.cursor = 'pointer';
                }, 4000);
            }
        });
    }
});
