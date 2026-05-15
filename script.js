const canvas = document.getElementById('flashCanvas');
const ctx = canvas.getContext('2d');
const navbar = document.querySelector('.top-nav');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Show Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        navbar.classList.add('active');
    } else {
        navbar.classList.remove('active');
    }
});

// NEW ELECTRIC CYAN FLASH WITH TRAIL EFFECT
let flashParticles = [];

class FlashParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = (Math.random() - 0.5) * 20;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 8 + 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
        this.size *= 0.98;
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${this.life * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 255, ${this.life * 0.4})`);
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createFlashEffect(x, y) {
    const centerX = x || canvas.width / 2;
    const centerY = y || canvas.height / 2;
    
    for (let i = 0; i < 30; i++) {
        flashParticles.push(new FlashParticle(centerX, centerY));
    }
    
    ctx.save();
    const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
    pulseGradient.addColorStop(0, '#00ffff');
    pulseGradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.8)');
    pulseGradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.2)');
    pulseGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    
    ctx.fillStyle = pulseGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function animateFlash() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = flashParticles.length - 1; i >= 0; i--) {
        flashParticles[i].update();
        flashParticles[i].draw();
        
        if (flashParticles[i].life <= 0) {
            flashParticles.splice(i, 1);
        }
    }
    
    if (flashParticles.length > 0) {
        requestAnimationFrame(animateFlash);
    }
}

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createFlashEffect(x, y);
        animateFlash();
    });
});

// Nav Animation Accuracy
const navLinks = document.querySelectorAll('.nav-links a, .link-item');
const sections = document.querySelectorAll('section, .split-container');

window.addEventListener('scroll', () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});

// Sticky Note Popup for Gmail
document.addEventListener('DOMContentLoaded', function() {
    const gmailTrigger = document.querySelector('.gmail-trigger');
    const stickyNote = document.getElementById('stickyNote');
    const copyBtn = document.querySelector('.copy-btn');
    const closeBtn = document.querySelector('.close-note');
    
    if (gmailTrigger) {
        gmailTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email');
            stickyNote.querySelector('p strong').textContent = email;
            stickyNote.classList.remove('hidden');
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const email = stickyNote.querySelector('p strong').textContent;
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = 'linear-gradient(45deg, #4caf50, #81c784)';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Email';
                    copyBtn.style.background = 'linear-gradient(45deg, #00ffff, #00d4ff)';
                }, 2000);
            });
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            stickyNote.classList.add('hidden');
        });
    }
    
    stickyNote.addEventListener('click', function(e) {
        if (e.target === this) {
            stickyNote.classList.add('hidden');
        }
    });
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = scrollPercent + '%';
    });
});

// PERMANENT MOUSE TRAIL
const trailCanvas = document.createElement('canvas');
trailCanvas.id = 'mouseTrailCanvas';
trailCanvas.style.position = 'fixed';
trailCanvas.style.top = '0';
trailCanvas.style.left = '0';
trailCanvas.style.pointerEvents = 'none';
trailCanvas.style.zIndex = '9998';
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;
document.body.appendChild(trailCanvas);

const trailCtx = trailCanvas.getContext('2d');
let mousePos = { x: 0, y: 0 };
let trails = [];

function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}

window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    
    // Add new trail particle
    trails.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
    });
    
    // Keep only 50 trails for performance
    if (trails.length > 50) trails.shift();
});

function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    
    trails.forEach((trail, index) => {
        trail.life -= 0.015; // Slower decay for permanent trail
        
        // Update position with slight movement
        trail.x += trail.vx;
        trail.y += trail.vy;
        trail.vx *= 0.95;
        trail.vy *= 0.95;
        
        if (trail.life > 0) {
            trailCtx.save();
            trailCtx.globalAlpha = trail.life * 0.8;
            trailCtx.fillStyle = '#00ffff';
            trailCtx.shadowBlur = 25;
            trailCtx.shadowColor = '#00ffff';
            
            const size = trail.life * 12;
            trailCtx.beginPath();
            trailCtx.arc(trail.x, trail.y, size, 0, Math.PI * 2);
            trailCtx.fill();
            trailCtx.restore();
        } else {
            trails.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateTrail);
}

// Start permanent trail animation
animateTrail();
window.addEventListener('resize', resizeTrailCanvas);

// Project View Counter
document.querySelectorAll('.project-item').forEach((project, index) => {
    const count = localStorage.getItem(`project${index}`) || '1.2k';
    project.querySelector('.view-count').textContent = `(${count} views)`;
    
    project.addEventListener('mouseenter', () => {
        let newCount = parseInt(localStorage.getItem(`project${index}`) || '1200') + 1;
        if (newCount >= 1000) {
            newCount = (newCount / 1000).toFixed(1) + 'k';
        }
        localStorage.setItem(`project${index}`, newCount.toString());
        project.querySelector('.view-count').textContent = `(${newCount} views)`;
    });
});