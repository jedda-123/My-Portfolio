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

let flashProgress = -1;

function drawFlash() {
    if (flashProgress === -1) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.sqrt(canvas.width**2 + canvas.height**2);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * flashProgress, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 0, 0, ${1 - flashProgress})`;
    ctx.lineWidth = 5;
    ctx.stroke();
    flashProgress += 0.04;
    if (flashProgress > 1) flashProgress = -1;
    requestAnimationFrame(drawFlash);
}
// Click Animate
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        flashProgress = 0;
        drawFlash();
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
// Nav Animation
const navLinks = document.querySelectorAll('.nav-links a, .link-item');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        flashProgress = 0;
        drawFlash();

        navLinks.forEach(l => l.classList.remove('active-link'));

        this.classList.add('active-link');
    });
});