// ========== CONFIGURACIÓN ==========
const scenes = [
    { 
        id: 'snow-garden', 
        name: '❄️ Jardín',
        music: 'Music/Snow Flower (feat. Peakboy).mp3'
    },
    { 
        id: 'universe', 
        name: '🌌 Nuestro Universo',
        music: 'Music/Best Of Me.mp3'
    },
    { 
        id: 'k-drama-home', 
        name: '🏡 Hogar',
        music: 'Music/HOME.mp3'
    },
    { 
        id: 'love-gallery', 
        name: '💞 Galería del Alma',
        music: 'Music/Confess To You.mp3'
    }
];

const photos = [
    'Photos/14d8c2703f5903579bd3d8e809f7dd39.jpg',
    'Photos/17ac5a41c03f28b8ef49f4292390d48d.jpg',
    'Photos/20240721_183505_lmc_8.4.NIGHT.jpg',
    'Photos/20240729_204443_lmc_8.4.NIGHT.jpg',
    'Photos/7b53f54291b6bc7d5fdd7abbdfe6bfd3.jpg',
    'Photos/8f3e162fade4cafcc3840ab9fe9e8a83.jpg',
    'Photos/IMG_20240721_182828.jpg',
    'Photos/IMG_20240804_155001.jpg',
    'Photos/image (1).jpg',
    'Photos/image.jpg',
    'Photos/images (1).jpeg',
    'Photos/images.jpeg',
    'Photos/images.jpeg',
    'Photos/flores.png',
    'Photos/demanos.png',
    'Photos/casados.png'
];

const messages = [
    "💖 Un universo en tu mirada.",
    "💜 Juntos, nuestro propio cosmos.",
    "🌸 Contigo, cada momento es un verso.",
    "✨ Brillas más que cualquier constelación.",
    "🐻🐰 Un hilo invisible nos une.",
    "❄️ Nuestro amor, un paisaje invernal.",
    "🌟 En nuestro mikrokosmos particular.",
    "💕 Eres el ancla de mi alma.",
    "🦋 Tus alas, mi cielo.",
    "🎶 La melodía de nuestro destino.",
    "🏡 Contigo, estoy en casa.",
    "💘 Mi amor por ti crece con cada latido."
];

let currentSceneIndex = 0;
let isMusicPlaying = false;
let isExperienceStarted = false;
let currentAudio = null;
let is3DMode = false;
let mouseX = 0;
let mouseY = 0;

// ========== INICIALIZACIÓN ==========
function init() {
    createStars();
    createFloatingHearts();
    createBTSElements();
    createSpecialMessages();
    updateMusicIcon();
    setupMouseTracking();
}

function startExperience() {
    if (isExperienceStarted) return;
    isExperienceStarted = true;
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('experience-container').style.display = 'block';
    
    loadScene(0);
}

// ========== SISTEMA DE ESCENAS MEJORADO ==========
function loadScene(index) {
    // Efecto de transición
    const transition = document.getElementById('scene-transition');
    transition.classList.add('active');

    currentSceneIndex = index;
    const scene = scenes[index];

    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });

    document.getElementById(scene.id).classList.add('active');
    document.getElementById('scene-indicator').textContent = scene.name;

    loadSceneContent(scene.id);
    document.getElementById('scene-menu').style.display = 'none';

    // Reproducir música de la escena actual
    playSceneMusic(index);

    // Finalizar transición
    setTimeout(() => {
        transition.classList.remove('active');
    }, 300);
}

function loadSceneContent(sceneId) {
    const scene = document.getElementById(sceneId);
    scene.innerHTML = '';

    // Clear snowflakes if not in snow garden
    if (sceneId !== 'snow-garden') {
        const existingSnowflakes = document.querySelectorAll('.snowflake');
        existingSnowflakes.forEach(flake => flake.remove());
    }

    switch(sceneId) {
        case 'snow-garden':
            createSnowflakes();
            loadSnowGarden(scene);
            break;
        case 'universe':
            loadUniverse(scene);
            break;
        case 'k-drama-home':
            loadKdramaHome(scene);
            break;
        case 'love-gallery':
            loadLoveGallery(scene);
            break;
    }
}

function loadSnowGarden(scene) {
    const positions = [
        { x: 25, y: 30 }, { x: 75, y: 30 },
        { x: 25, y: 70 }, { x: 75, y: 70 }
    ];
    
    for (let i = 0; i < 4; i++) {
        createDraggablePhoto(scene, i, positions[i]);
    }
    
    createSceneMessage(scene, "Aquí florecen nuestros sueños.", 50, 15);
    createSceneMessage(scene, "Un invierno junto a ti.", 50, 85);
}

function loadUniverse(scene) {
    for (let i = 4; i < 8; i++) {
        const angle = (i - 4) * (Math.PI / 2);
        createDraggablePhoto(scene, i, {
            x: 50 + Math.cos(angle) * 30,
            y: 50 + Math.sin(angle) * 20
        });
    }
    
    createSceneMessage(scene, "Nuestro propio universo.", 50, 10);
    createSceneMessage(scene, "Infinitas como las estrellas.", 50, 90);
}

function loadKdramaHome(scene) {
    const positions = [
        { x: 20, y: 25 }, { x: 80, y: 25 },
        { x: 20, y: 75 }, { x: 80, y: 75 }
    ];
    
    for (let i = 8; i < 12; i++) {
        if (i - 8 < positions.length) {
            createDraggablePhoto(scene, i, positions[i - 8]);
        }
    }
    
    createSceneMessage(scene, "Mi hogar eres tú.", 50, 15);
    createSceneMessage(scene, "Aquí construimos nuestro amor.", 50, 85);
}

function loadLoveGallery(scene) {
    const demanosIndex = photos.findIndex(photo => photo.includes('demanos.png'));

    if (demanosIndex !== -1) {
        const bgFrame = document.createElement('div');
        bgFrame.className = 'love-gallery-background';
        const bgImg = document.createElement('img');
        bgImg.src = photos[demanosIndex];
        bgFrame.appendChild(bgImg);
        scene.appendChild(bgFrame);
    }

    for (let i = 0; i < photos.length; i++) {
        if (i === demanosIndex) continue; // Skip the background image

        const row = Math.floor(i / 4);
        const col = i % 4;
        createDraggablePhoto(scene, i, {
            x: 15 + col * 25,
            y: 20 + row * 30
        });
    }

    createSceneMessage(scene, "Nuestra historia, nuestro arte.", 50, 10);
    createSceneMessage(scene, "Tesoros de nuestra memoria.", 50, 90);
}

function createDraggablePhoto(scene, photoIndex, position) {
    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    frame.style.left = position.x + '%';
    frame.style.top = position.y + '%';
    frame.dataset.photoIndex = photoIndex;

    const img = document.createElement('img');
    img.src = photos[photoIndex];
    img.alt = `Nuestra foto ${photoIndex + 1}`;
    img.draggable = false;

    frame.appendChild(img);
    scene.appendChild(frame);

    setupDragAndDrop(frame);
}

function zoomInPhoto(src) {
    const modal = document.createElement('div');
    modal.className = 'photo-zoom-modal';
    
    const img = document.createElement('img');
    img.src = src;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    gsap.from(modal, { opacity: 0, duration: 0.3 });
    gsap.from(img, { scale: 0.8, duration: 0.3 });

    modal.addEventListener('click', () => {
        gsap.to(modal, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => modal.remove() 
        });
    });
}

function createHeartParticles(x, y) {
    const hearts = ['💖', '💕', '💞', '💓', '💗', '💘'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            
            // Dirección aleatoria
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1500);
        }, i * 100);
    }
}

// ========== SISTEMA DE ARRASTRE MEJORADO ==========
function setupDragAndDrop(element) {
    let isDragging = false;
    let startX, startY, startTime;
    let initialX, initialY;

    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        isDragging = false;
        element.classList.add('dragging');

        const rect = element.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        startTime = Date.now();

        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        isDragging = true;
        let currentX, currentY;

        if (e.type === 'mousemove') {
            currentX = e.clientX;
            currentY = e.clientY;
        } else {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            e.preventDefault();
        }

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        element.style.left = (initialX + deltaX) + 'px';
        element.style.top = (initialY + deltaY) + 'px';
    }

    function stopDrag(e) {
        const endTime = Date.now();
        const deltaTime = endTime - startTime;

        let endX, endY;
        if (e.type === 'mouseup') {
            endX = e.clientX;
            endY = e.clientY;
        } else {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
        }

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (!isDragging && deltaTime < 200 && distance < 10) {
            // It's a click, not a drag
            const photoIndex = parseInt(element.dataset.photoIndex, 10);
            zoomInPhoto(photos[photoIndex]);
        }

        isDragging = false;
        element.classList.remove('dragging');

        const rect = element.getBoundingClientRect();
        const scene = element.parentElement;
        const sceneRect = scene.getBoundingClientRect();

        const percentX = ((rect.left + rect.width / 2 - sceneRect.left) / sceneRect.width) * 100;
        const percentY = ((rect.top + rect.height / 2 - sceneRect.top) / sceneRect.height) * 100;

        element.style.left = Math.max(5, Math.min(95, percentX)) + '%';
        element.style.top = Math.max(5, Math.min(95, percentY)) + '%';
        element.style.transform = 'translate(-50%, -50%)';

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function createSceneMessage(scene, text, x, y) {
    const message = document.createElement('div');
    message.className = 'scene-message';
    message.textContent = text;
    message.style.left = x + '%';
    message.style.top = y + '%';
    scene.appendChild(message);

    gsap.from(message, {
        duration: 1.5,
        opacity: 0,
        y: 20,
        ease: 'power3.out',
        delay: 0.5
    });
}

function showPhotoMessage(photoIndex, element) {
    const message = document.createElement('div');
    message.className = 'special-message';
    message.textContent = messages[photoIndex];
    
    const rect = element.getBoundingClientRect();
    message.style.left = (rect.left + rect.width/2) + 'px';
    message.style.top = (rect.top - 40) + 'px';
    message.style.transform = 'translateX(-50%)';
    message.style.animation = 'message-float 3s ease-in-out';
    message.style.fontSize = '1.5rem';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 1000);
    }, 2500);
}

function nextScene() {
    if (!isExperienceStarted) return;
    const nextIndex = (currentSceneIndex + 1) % scenes.length;
    loadScene(nextIndex);
}

function previousScene() {
    if (!isExperienceStarted) return;
    const prevIndex = (currentSceneIndex - 1 + scenes.length) % scenes.length;
    loadScene(prevIndex);
}

function toggleSceneMenu() {
    const menu = document.getElementById('scene-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ========== SISTEMA DE MÚSICA ==========
function playSceneMusic(sceneIndex) {
    // Detener música actual si existe
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const scene = scenes[sceneIndex];
    if (!scene.music) return;
    
    // Crear nuevo elemento de audio para esta escena
    currentAudio = new Audio(scene.music);
    currentAudio.volume = 0.5;
    currentAudio.loop = true;
    currentAudio.preload = 'none';
    
    const playPromise = currentAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            updateMusicIcon();
        }).catch(error => {
            console.log('La reproducción automática fue bloqueada');
            createMusicActivationButton(sceneIndex);
        });
    }
}

function createMusicActivationButton(sceneIndex) {
    if (document.getElementById('music-activation-btn')) return;
    
    const scene = scenes[sceneIndex];
    const btn = document.createElement('button');
    btn.id = 'music-activation-btn';
    btn.innerHTML = `🎵 Activar Música: ${scene.name}`;
        
    document.body.appendChild(btn);
    
    btn.onclick = function() {
        if (currentAudio) {
            currentAudio.play().then(() => {
                isMusicPlaying = true;
                updateMusicIcon();
                btn.style.transform = 'translateX(-50%) scale(0.9)';
                setTimeout(() => btn.remove(), 300);
            }).catch(err => {
                btn.innerHTML = '❌ Error - Click para intentar';
            });
        }
    };
                        
    setTimeout(() => {
        if (btn.parentNode) btn.remove();
    }, 10000);
}

function toggleMusic() {
    if (!currentAudio) return;
    
    if (isMusicPlaying) {
        currentAudio.pause();
        isMusicPlaying = false;
    } else {
        currentAudio.play().then(() => {
            isMusicPlaying = true;
        }).catch(error => {
            createMusicActivationButton(currentSceneIndex);
        });
    }
    updateMusicIcon();
}

function updateMusicIcon() {
    const icon = document.getElementById('music-icon');
    if (icon) {
        icon.className = isMusicPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
}

// ========== EFECTOS VISUALES ==========
function createSnowflakes() {
    const snowflakeChars = ['❄', '❆', '❅'];
    const snowContainer = document.body;

    // Clear existing snowflakes
    const existingSnowflakes = document.querySelectorAll('.snowflake');
    existingSnowflakes.forEach(flake => flake.remove());

    for (let i = 0; i < 150; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        snowContainer.appendChild(snowflake);

        gsap.set(snowflake, {
            x: Math.random() * window.innerWidth,
            y: -20,
            fontSize: (Math.random() * 1.5 + 0.5) + 'rem',
            opacity: Math.random() * 0.7 + 0.3,
        });

        gsap.to(snowflake, {
            duration: Math.random() * 10 + 5,
            y: window.innerHeight + 10,
            ease: 'none',
            repeat: -1,
            delay: Math.random() * -15,
        });
    }
}

function createStars() {
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 8 + 's';
        star.style.opacity = Math.random() * 0.5 + 0.2;
        document.body.appendChild(star);
    }
}

function createFloatingHearts() {
    const hearts = ['💖', '💕', '💞', '💓', '💗', '💘', '💝'];
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.fontSize = (Math.random() * 1.5 + 2) + 'rem';
        document.body.appendChild(heart);
    }
}

function createBTSElements() {
    const btsSymbols = ['💜', '🐻', '🐰', '🌟', '✨', '🌙', '⭐'];
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'bts-element';
        element.textContent = btsSymbols[Math.floor(Math.random() * btsSymbols.length)];
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = Math.random() * 100 + 'vh';
        element.style.animationDelay = Math.random() * 20 + 's';
        element.style.fontSize = (Math.random() * 1.5 + 2.2) + 'rem';
        document.body.appendChild(element);
    }
}

function createSpecialMessages() {
    const specialTexts = [
        "TE AMO MI NALGONA", "FOREVER",
        "MY SUPITERA", "NUESTRO AMOR", "PARA SIEMPRE 💜",
        "TAE 🐻", "KOOK 🐰"
    ];
    
    for (let i = 0; i < 12; i++) {
        const message = document.createElement('div');
        message.className = 'special-message';
        message.textContent = specialTexts[Math.floor(Math.random() * specialTexts.length)];
        message.style.left = Math.random() * 80 + 10 + '%';
        message.style.top = Math.random() * 80 + 10 + '%';
        message.style.animationDelay = Math.random() * 20 + 's';
        message.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
        document.body.appendChild(message);
    }
}

// ========== SISTEMA 3D INMERSIVO ==========
function toggle3DMode() {
    is3DMode = !is3DMode;
    const currentScene = document.getElementById(scenes[currentSceneIndex].id);
    
    if (is3DMode) {
        // Activar modo 3D
        currentScene.classList.add('scene-3d', 'scene-3d-active');
        create3DEnvironment(currentScene);
        startParallaxEffect();
        
        // Actualizar botón
        const btn3D = document.querySelector('.nav-3d');
        btn3D.innerHTML = '<i class="fas fa-cube" style="color: #ff6b9d;"></i>';
        btn3D.style.background = 'rgba(255, 107, 157, 0.6)';
        
    } else {
        // Desactivar modo 3D
        currentScene.classList.remove('scene-3d', 'scene-3d-active');
        remove3DEnvironment(currentScene);
        
        // Restaurar botón
        const btn3D = document.querySelector('.nav-3d');
        btn3D.innerHTML = '<i class="fas fa-cube"></i>';
        btn3D.style.background = 'rgba(165, 212, 233, 0.4)';
    }
}

function create3DEnvironment(scene) {
    // Limpiar escena primero
    scene.innerHTML = '';
    
    // Crear contenedor parallax
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    parallaxContainer.id = 'parallax-container';
    
    // Crear capas de profundidad
    for (let i = 1; i <= 5; i++) {
        const layer = document.createElement('div');
        layer.className = `parallax-layer layer-${i}`;
        layer.id = `layer-${i}`;
        parallaxContainer.appendChild(layer);
        
        // Agregar partículas a cada capa
        createParticlesForLayer(layer, i);
    }
    
    // Agregar gradiente de fondo
    const bgGradient = document.createElement('div');
    bgGradient.className = 'bg-gradient-3d';
    parallaxContainer.appendChild(bgGradient);
    
    scene.appendChild(parallaxContainer);
    
    // Crear fotos en 3D
    create3DPhotos(scene);
    
    // Crear elementos decorativos 3D
    create3DFloatingElements(scene);
}

function createParticlesForLayer(layer, layerIndex) {
    const particleCount = layerIndex * 8;
    const particleTypes = ['heart', 'star', 'bubble'];
    const colors = ['#FFB7C5', '#FFD1DC', '#D8BFD8', '#E6E6FA', '#B5EAD7', '#A7FFEB', '#87CEEB', '#FFF9C4'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        
        particle.className = `particle-3d particle-${type}`;
        
        switch(type) {
            case 'heart':
                particle.innerHTML = '💖';
                particle.style.color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
                break;
            case 'star':
                const size = Math.random() * 8 + 3;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                break;
            case 'bubble':
                const bubbleSize = Math.random() * 20 + 10;
                particle.style.width = bubbleSize + 'px';
                particle.style.height = bubbleSize + 'px';
                particle.style.background = `radial-gradient(circle at 30% 30%, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
                break;
        }
        
        const startX = Math.random() * 120 - 10 + '%';
        const startY = Math.random() * 120 - 10 + '%';
        const endX = (Math.random() - 0.5) * 200 + '%';
        const endY = (Math.random() - 0.5) * 200 + '%';
        const startZ = -500 + (layerIndex * 100);
        const endZ = 500 - (layerIndex * 100);
        
        particle.style.setProperty('--start-x', startX);
        particle.style.setProperty('--start-y', startY);
        particle.style.setProperty('--start-z', startZ + 'px');
        particle.style.setProperty('--end-x', endX);
        particle.style.setProperty('--end-y', endY);
        particle.style.setProperty('--end-z', endZ + 'px');
        particle.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
        
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        layer.appendChild(particle);
    }
}

function create3DPhotos(scene) {
    const positions = [
        { x: 25, y: 30, z: 50 }, { x: 75, y: 30, z: -30 },
        { x: 25, y: 70, z: -20 }, { x: 75, y: 70, z: 40 },
        { x: 50, y: 50, z: 0 }, { x: 30, y: 50, z: 25 },
        { x: 70, y: 50, z: -25 }, { x: 50, y: 20, z: 15 }
    ];
    
    for (let i = 0; i < Math.min(photos.length, 8); i++) {
        const frame = document.createElement('div');
        frame.className = 'photo-frame-3d';
        frame.style.left = positions[i].x + '%';
        frame.style.top = positions[i].y + '%';
        frame.style.transform = `translateZ(${positions[i].z}px) rotateY(${Math.random() * 20 - 10}deg) rotateX(${Math.random() * 10 - 5}deg)`;
        
        const img = document.createElement('img');
        img.src = photos[i];
        img.alt = `Nuestra foto ${i + 1}`;
        img.draggable = false;
        
        frame.appendChild(img);
        parallaxContainer.appendChild(frame);
        
        setup3DDragAndDrop(frame);
    }
}

function setup3DDragAndDrop(element) {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
        isDragging = true;
        element.classList.add('dragging');
        
        const rect = element.getBoundingClientRect();
        initialX = parseFloat(element.style.left);
        initialY = parseFloat(element.style.top);
        
        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let currentX, currentY;
        
        if (e.type === 'mousemove') {
            currentX = e.clientX;
            currentY = e.clientY;
        } else {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            e.preventDefault();
        }
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        const newX = initialX + (deltaX / window.innerWidth) * 100;
        const newY = initialY + (deltaY / window.innerHeight) * 100;
        
        element.style.left = Math.max(5, Math.min(95, newX)) + '%';
        element.style.top = Math.max(5, Math.min(95, newY)) + '%';
    }
    
    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function create3DFloatingElements(scene) {
    const elements = ['💖', '💕', '💞', '✨', '🌟', '🦋', '🌸', '🎀'];
    const container = scene.querySelector('.parallax-container');
    
    for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element-3d';
        element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.color = ['#FFB7C5', '#D8BFD8', '#B5EAD7', '#87CEEB'][Math.floor(Math.random() * 4)];
        element.style.fontSize = (Math.random() * 2 + 2) + 'rem';
        element.style.animationDelay = Math.random() * 10 + 's';
        
        container.appendChild(element);
    }
}

function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });
}

function startParallaxEffect() {
    function updateParallax() {
        if (!is3DMode) return;
        
        const container = document.getElementById('parallax-container');
        if (!container) return;
        
        const moveX = (mouseX / window.innerWidth - 0.5) * 50;
        const moveY = (mouseY / window.innerHeight - 0.5) * 50;
        
        for (let i = 1; i <= 5; i++) {
            const layer = document.getElementById(`layer-${i}`);
            if (layer) {
                const depth = i * 0.2;
                layer.style.transform = `translate3d(${moveX * depth}px, ${moveY * depth}px, 0)`;
            }
        }
        
        requestAnimationFrame(updateParallax);
    }
    
    updateParallax();
}

function remove3DEnvironment(scene) {
    scene.innerHTML = '';
    // Esto recargará el contenido normal de la escena
    loadSceneContent(scenes[currentSceneIndex].id);
}

// ========== PRELOADER LOGIC ==========
function startPreloader() {
    const assetsToLoad = [
        ...photos,
        ...scenes.map(s => s.music).filter(Boolean) // Filter out any scenes without music
    ];
    const totalAssets = assetsToLoad.length;
    let loadedAssets = 0;

    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('#preloader .progress');
    const assetCounter = document.querySelector('#preloader .asset-counter');

    if (totalAssets === 0) {
        finishLoading();
        return;
    }

    assetCounter.textContent = `${loadedAssets} / ${totalAssets}`;

    function assetLoaded() {
        loadedAssets++;
        const progress = (loadedAssets / totalAssets) * 100;
        progressBar.style.width = `${progress}%`;
        assetCounter.textContent = `${loadedAssets} / ${totalAssets}`;

        if (loadedAssets === totalAssets) {
            finishLoading();
        }
    }

    function finishLoading() {
        setTimeout(() => {
            gsap.to(preloader, { opacity: 0, duration: 1, onComplete: () => {
                preloader.style.display = 'none';
                // We don't call init() here anymore, the welcome screen will be displayed first
            }});
        }, 500); // A small delay for effect
    }

    assetsToLoad.forEach(url => {
        if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            const img = new Image();
            img.src = url;
            img.onload = assetLoaded;
            img.onerror = assetLoaded; // Count errors as "loaded" to not block the app
        } else if (url.match(/\.(mp3)$/)) {
            const audio = new Audio();
            audio.src = url;
            // Using 'loadeddata' as it fires earlier than 'canplaythrough'
            audio.onloadeddata = assetLoaded;
            audio.onerror = assetLoaded; // Count errors as "loaded"
        } else {
            // For any other type or if the url is null/undefined, count it as loaded immediately
            assetLoaded();
        }
    });
}

// ========== INICIAR ==========
window.addEventListener('load', () => {
    init(); // Call init to set up background effects
    startPreloader(); // Then start preloading assets
});