// Variables globales
let isPlaying = false;
let particles = [];
let mouse = { x: 0, y: 0 };

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    createParticles();
    addScrollAnimations();
    addInteractiveEffects();
    addSmoothScrolling();
});

// Función para inicializar animaciones
function initializeAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.timeline-item, .gallery-item, .message-card').forEach(el => {
        observer.observe(el);
    });
}

// Sistema de partículas románticas
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    
    document.getElementById('particles-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear partículas
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            alpha: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#ff6b9d' : '#ffd93d'
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Actualizar posición
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Efecto de mouse
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.01;
                particle.y -= dy * 0.01;
            }
            
            // Rebote en los bordes
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Mantener dentro del canvas
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            
            // Dibujar partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();
            
            // Conectar partículas cercanas
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 107, 157, ${0.1 * (1 - distance / 80)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Seguimiento del mouse para efectos interactivos
document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Efecto de corazones siguiendo al mouse
    if (Math.random() < 0.1) {
        createMouseHeart(e.clientX, e.clientY);
    }
});

// Crear corazón que sigue al mouse
function createMouseHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.fontSize = '20px';
    heart.style.animation = 'heartFloat 2s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Navegación suave
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para scroll a sección específica
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Control de música de fondo
function playMusic() {
    const audio = document.getElementById('background-music');
    const button = document.getElementById('music-text');
    
    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            button.textContent = 'Pausar Música';
            showNotification('🎵 Música iniciada', 'success');
        }).catch(err => {
            showNotification('📱 Haz clic para activar la música', 'info');
        });
    } else {
        audio.pause();
        isPlaying = false;
        button.textContent = 'Escuchar Nuestra Canción';
        showNotification('🔇 Música pausada', 'info');
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#0984e3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        backdrop-filter: blur(10px);
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Galería modal
function openModal(imageSrc, caption) {
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    modalCaption.textContent = caption;
    
    // Efecto de zoom y corazones
    createHeartExplosion();
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Cerrar al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    document.getElementById('photo-modal').style.display = 'none';
}

// Explosión de corazones
function createHeartExplosion() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💕', '💗', '❤️', '💝'][Math.floor(Math.random() * 5)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10001';
            heart.style.animation = `heartExplosion 3s ease-out forwards`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
}

// Mensaje especial
function showSpecialMessage() {
    const overlay = document.getElementById('special-message');
    overlay.style.display = 'block';
    
    // Efecto especial de corazones
    createRomanticEffect();
    
    // Reproducir sonido romántico (si está disponible)
    playRomanticSound();
}

function hideSpecialMessage() {
    document.getElementById('special-message').style.display = 'none';
}

// Efecto romántico especial
function createRomanticEffect() {
    const colors = ['#ff6b9d', '#ffd93d', '#e84393', '#fd79a8', '#fdcb6e'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            element.innerHTML = '💖';
            element.style.position = 'fixed';
            element.style.left = Math.random() * window.innerWidth + 'px';
            element.style.top = '-50px';
            element.style.fontSize = (Math.random() * 30 + 20) + 'px';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '10002';
            element.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            element.style.animation = `romanticFloat 6s ease-out forwards`;
            
            document.body.appendChild(element);
            
            setTimeout(() => element.remove(), 6000);
        }, i * 200);
    }
}

// Reproducir sonido romántico
function playRomanticSound() {
    // Crear tonos románticos usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const melody = [523.25, 587.33, 659.25, 698.46, 783.99]; // Do, Re, Mi, Fa, Sol
        
        melody.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
            }, index * 300);
        });
    } catch (error) {
        console.log('Audio not available');
    }
}

// Efectos de scroll
function addScrollAnimations() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax en el hero
        const hero = document.querySelector('.hero-section');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Efectos en la navegación
        const navbar = document.querySelector('.navbar');
        if (scrolled > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Efectos interactivos adicionales
function addInteractiveEffects() {
    // Efecto hover en cards
    document.querySelectorAll('.message-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            createMiniHearts(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efecto click en botones
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Crear mini corazones en hover
function createMiniHearts(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💕';
            heart.style.position = 'fixed';
            heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
            heart.style.top = (rect.top + Math.random() * rect.height) + 'px';
            heart.style.fontSize = '12px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = 'miniHeartFloat 2s ease-out forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// Efectos de teclado
document.addEventListener('keydown', function(e) {
    // Easter eggs con teclas
    if (e.key === 'h' || e.key === 'H') {
        createHeartRain();
    }
    
    if (e.key === 'l' || e.key === 'L') {
        toggleLoveMode();
    }
});

// Lluvia de corazones
function createHeartRain() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💕', '💗', '❤️', '💝', '💘'][Math.floor(Math.random() * 6)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.fontSize = (Math.random() * 25 + 15) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10000';
            heart.style.animation = `heartRain 4s linear forwards`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// Modo amor intenso
let loveMode = false;
function toggleLoveMode() {
    loveMode = !loveMode;
    
    if (loveMode) {
        document.body.style.filter = 'hue-rotate(15deg) saturate(1.3)';
        showNotification('💕 Modo Amor Activado', 'success');
        
        // Efecto continuo de corazones
        const loveInterval = setInterval(() => {
            if (!loveMode) {
                clearInterval(loveInterval);
                return;
            }
            createMiniHeartExplosion();
        }, 2000);
    } else {
        document.body.style.filter = 'none';
        showNotification('✨ Modo Normal', 'info');
    }
}

function createMiniHeartExplosion() {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = Math.random() * window.innerHeight + 'px';
        heart.style.fontSize = '15px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9998';
        heart.style.animation = 'miniHeartFloat 3s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }
}

// Añadir CSS para animaciones adicionales
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes heartExplosion {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(0.8) rotate(360deg) translateY(-100px); opacity: 0; }
    }
    
    @keyframes romanticFloat {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(${window.innerHeight + 100}px) rotate(720deg); opacity: 0; }
    }
    
    @keyframes miniHeartFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-80px) scale(0.5); opacity: 0; }
    }
    
    @keyframes heartRain {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(${window.innerHeight + 100}px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards !important;
    }
`;

document.head.appendChild(additionalStyles);

// Mensaje de bienvenida
setTimeout(() => {
    showNotification('💕 Bienvenid@ a nuestro sitio especial', 'success');
    
    setTimeout(() => {
        showNotification('💡 Presiona "H" para lluvia de corazones', 'info');
    }, 3000);
    
    setTimeout(() => {
        showNotification('🎵 Presiona "L" para modo amor', 'info');
    }, 6000);
}, 2000);