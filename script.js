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
    // Main electric flash ring
    const centerX = x || canvas.width / 2;
    const centerY = y || canvas.height / 2;
    
    // Create 30 particles for explosion effect
    for (let i = 0; i < 30; i++) {
        flashParticles.push(new FlashParticle(centerX, centerY));
    }
    
    // Central electric pulse
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
    
    // Update and draw particles
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

// Click Animate - NEW ELECTRIC EFFECT
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createFlashEffect(x, y);
        animateFlash();
    });
});

// Existing Navbar Scroll Logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        navbar.classList.add('active');
    } else {
        navbar.classList.remove('active');
    }
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