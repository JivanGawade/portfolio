const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const particleCount = 80; // Optimized for performance
const connectDistance = 130;
const particleSpeed = 1.2;

// Resize handling
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() * particleSpeed) - (particleSpeed / 2);
        this.speedY = (Math.random() * particleSpeed) - (particleSpeed / 2);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reverse direction upon hitting edge bounds
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(79, 172, 254, 0.7)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    resizeCanvas();
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Draw connecting lines if nodes are close enough
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectDistance) {
                const opacity = 1 - (distance / connectDistance);
                ctx.strokeStyle = `rgba(79, 172, 254, ${opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// --- Modal Logic ---
const modal = document.getElementById("certModal");
const modalImg = document.getElementById("certImg");
const captionText = document.getElementById("caption");
const closeBtn = document.getElementById("closeModalBtn");
const viewBtns = document.querySelectorAll(".view-cert-btn");

// Open modal when any "View Certificate" button is clicked
viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        modal.style.display = "block";
        // Slight delay ensures the CSS transition for opacity works
        setTimeout(() => modal.classList.add("show"), 10);
        
        // Get the image source and caption from the button's data attributes
        modalImg.src = this.getAttribute('data-img-src');
        captionText.innerHTML = this.getAttribute('data-caption');
    });
});

// Function to close the modal
const closeModal = () => {
    modal.classList.remove("show");
    // Wait for the opacity transition to finish before hiding the element
    setTimeout(() => modal.style.display = "none", 300); 
};

// Close on 'X' button click
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking anywhere outside the image
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        closeModal();
    }
});

// Close modal on Escape key press
window.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
    }
});

// --- Visitor Counter API Integration ---
async function fetchVisitorCount() {
    const countDisplay = document.getElementById('visitorCount');
    
    // We use a free, open counter API (counterapi.dev) to track global hits.
    // The '/up' endpoint automatically increments the count by 1 in the cloud on each visit.
    const apiUrl = 'https://api.counterapi.dev/v1/jivangawade_portfolio/visits/up';
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.count) {
            countDisplay.textContent = `${data.count} Profile Views`;
        }
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        countDisplay.textContent = "Views currently unavailable";
    }
}

// Start the animation loop and initialize API calls
init();
animate();
fetchVisitorCount();