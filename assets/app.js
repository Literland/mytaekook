
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

// ========== THREE.JS SCENE GLOBALS ==========
let universeScene, camera, renderer, controls, constellationSphere;
let shootingStars = [];
let animationFrameId;

let galleryScene, galleryCamera, galleryRenderer, galleryControls, dragControls, draggablePhotos = [];
let galleryAnimationFrameId;

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

// ========== INICIALIZACIÓN ==========
function init() {
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
    // Cleanup previous 3D scenes if active
    if (scenes[currentSceneIndex].id === 'universe') {
        cleanupUniverseScene();
    }
    if (scenes[currentSceneIndex].id === 'love-gallery') {
        cleanupGalleryScene();
    }

    const transition = document.getElementById('scene-transition');
    transition.classList.add('active');

    currentSceneIndex = index;
    const scene = scenes[index];

    document.querySelectorAll('.scene').forEach(s => {
        s.classList.remove('active');
    });

    const sceneContainer = document.getElementById(scene.id);
    sceneContainer.classList.add('active');
    document.getElementById('scene-indicator').textContent = scene.name;

    loadSceneContent(scene.id);
    document.getElementById('scene-menu').style.display = 'none';

    playSceneMusic(index);

    setTimeout(() => {
        transition.classList.remove('active');
    }, 300);
}

function loadSceneContent(sceneId) {
    const sceneContainer = document.getElementById(sceneId);
    sceneContainer.innerHTML = '';
    
    cleanup2DEffects();

    if (sceneId !== 'snow-garden') {
        const existingSnowflakes = document.querySelectorAll('.snowflake');
        existingSnowflakes.forEach(flake => flake.remove());
    }

    if (sceneId !== 'universe' && sceneId !== 'love-gallery') {
        create2DEffects();
    }

    switch(sceneId) {
        case 'snow-garden':
            createSnowflakes();
            loadSnowGarden(sceneContainer);
            break;
        case 'universe':
            loadUniverse(sceneContainer);
            break;
        case 'k-drama-home':
            loadKdramaHome(sceneContainer);
            break;
        case 'love-gallery':
            loadLoveGallery(sceneContainer);
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

function createDraggablePhoto(scene, photoIndex, position) {
    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    frame.style.left = position.x + '%';
    frame.style.top = position.y + '%';
    frame.dataset.photoIndex = photoIndex;

    if (scene.id === 'snow-garden') {
        frame.classList.add('frosty');
    }

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

    gsap.from(message, { duration: 1.5, opacity: 0, y: 20, ease: 'power3.out', delay: 0.5 });
}

// ========== 3D UNIVERSE SCENE ==========

function loadUniverse(sceneContainer) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);

    universeScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 50;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 300;

    const textureLoader = new THREE.TextureLoader();

    // Background
    textureLoader.load('Photos/universo.jpg.jpg', (texture) => {
        const bgSphere = new THREE.SphereGeometry(1000, 60, 40);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const background = new THREE.Mesh(bgSphere, bgMaterial);
        universeScene.add(background);
    });

    // Constellations
    textureLoader.load('Photos/constelaciones.png', (texture) => {
        const constellationMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.8
        });
        const constellationSphereGeo = new THREE.SphereGeometry(990, 60, 40);
        constellationSphere = new THREE.Mesh(constellationSphereGeo, constellationMaterial);
        universeScene.add(constellationSphere);
    });

    // Starfield
    const starVertices = [];
    for (let i = 0; i < 20000; i++) {
        const x = (Math.random() - 0.5) * 2500;
        const y = (Math.random() - 0.5) * 2500;
        const z = (Math.random() - 0.5) * 2500;
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.9 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    universeScene.add(stars);

    // Photo planes
    const photoIndices = [4, 5, 6, 7, 8, 9, 10, 11];
    photoIndices.forEach((photoIndex) => {
        textureLoader.load(photos[photoIndex], (texture) => {
            const planeGeo = new THREE.PlaneGeometry(15, 18);
            const planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(planeGeo, planeMat);
            
            plane.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 80);
            plane.rotation.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.2);
            universeScene.add(plane);
        });
    });

    createShootingStars();
    
    window.addEventListener('resize', onWindowResize, false);

    animateUniverse();
}

function createShootingStars() {
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([-1, 0, 0, 1, 0, 0]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.8 });
        const shootingStar = new THREE.Line(geometry, material);
        
        resetShootingStar(shootingStar);
        shootingStars.push(shootingStar);
        universeScene.add(shootingStar);
    }
}

function resetShootingStar(star) {
    star.position.set(
        (Math.random() - 0.5) * 1500,
        Math.random() * 500 + 200,
        (Math.random() - 0.5) * 1500
    );
    star.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        -Math.random() * 5 - 5,
        (Math.random() - 0.5) * 20
    );
    star.scale.x = 20;
}

function animateUniverse() {
    animationFrameId = requestAnimationFrame(animateUniverse);

    if (constellationSphere) {
        constellationSphere.rotation.y += 0.0001;
        constellationSphere.rotation.x += 0.00005;
    }

    shootingStars.forEach(star => {
        star.position.add(star.velocity);
        if (star.position.y < -500) {
            resetShootingStar(star);
        }
    });

    controls.update();
    renderer.render(universeScene, camera);
}

function cleanupUniverseScene() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', onWindowResize);
    shootingStars = [];
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        const oldCanvas = renderer.domElement;
        if (oldCanvas && oldCanvas.parentNode) {
            oldCanvas.parentNode.removeChild(oldCanvas);
        }
        renderer = null;
    }
    universeScene = null;
    camera = null;
    controls = null;
    constellationSphere = null;
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ========== 3D GALLERY SCENE ==========

const GRID_SIZE = 30; // Size of the snapping grid
const GRID_DIMENSIONS = 5; // Number of grid points in each dimension

function loadLoveGallery(sceneContainer) {
    galleryRenderer = new THREE.WebGLRenderer({ antialias: true });
    galleryRenderer.setSize(window.innerWidth, window.innerHeight);
    galleryRenderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(galleryRenderer.domElement);

    galleryScene = new THREE.Scene();
    galleryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    galleryCamera.position.z = 50;

    galleryControls = new OrbitControls(galleryCamera, galleryRenderer.domElement);
    galleryControls.enableDamping = true;
    galleryControls.dampingFactor = 0.05;
    galleryControls.screenSpacePanning = true; // Allow panning
    galleryControls.minDistance = 10;
    galleryControls.maxDistance = 200;

    // Background: simple dark gradient or color
    galleryScene.background = new THREE.Color(0x1a1a1a);

    const textureLoader = new THREE.TextureLoader();
    draggablePhotos = [];

    // Create photo planes
    photos.forEach((photoUrl, index) => {
        textureLoader.load(photoUrl, (texture) => {
            const planeGeo = new THREE.PlaneGeometry(15, 18);
            const planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(planeGeo, planeMat);
            
            plane.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40
            );
            plane.rotation.set(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            galleryScene.add(plane);
            draggablePhotos.push(plane);
        });
    });

    // Drag Controls
    dragControls = new DragControls(draggablePhotos, galleryCamera, galleryRenderer.domElement);
    dragControls.addEventListener('dragstart', function (event) {
        galleryControls.enabled = false; // Disable orbit controls during drag
        event.object.material.emissive.set(0xaaaaaa); // Highlight dragged object
    });

    dragControls.addEventListener('dragend', function (event) {
        galleryControls.enabled = true; // Re-enable orbit controls
        event.object.material.emissive.set(0x000000); // Remove highlight
        snapToGrid(event.object); // Snap to grid
    });

    // Snapping Grid Logic
    function snapToGrid(object) {
        const x = Math.round(object.position.x / GRID_SIZE) * GRID_SIZE;
        const y = Math.round(object.position.y / GRID_SIZE) * GRID_SIZE;
        const z = Math.round(object.position.z / GRID_SIZE) * GRID_SIZE;
        
        gsap.to(object.position, { x: x, y: y, z: z, duration: 0.3, ease: "power2.out" });
    }

    window.addEventListener('resize', onWindowResizeGallery, false);

    animateGallery();
}

function animateGallery() {
    galleryAnimationFrameId = requestAnimationFrame(animateGallery);
    galleryControls.update();
    galleryRenderer.render(galleryScene, galleryCamera);
}

function cleanupGalleryScene() {
    if (galleryAnimationFrameId) {
        cancelAnimationFrame(galleryAnimationFrameId);
    }
    window.removeEventListener('resize', onWindowResizeGallery);
    if (galleryRenderer) {
        galleryRenderer.dispose();
        galleryRenderer.forceContextLoss();
        const oldCanvas = galleryRenderer.domElement;
        if (oldCanvas && oldCanvas.parentNode) {
            oldCanvas.parentNode.removeChild(oldCanvas);
        }
        galleryRenderer = null;
    }
    galleryScene = null;
    galleryCamera = null;
    galleryControls = null;
    dragControls = null;
    draggablePhotos = [];
}

function onWindowResizeGallery() {
    if (galleryCamera && galleryRenderer) {
        galleryCamera.aspect = window.innerWidth / window.innerHeight;
        galleryCamera.updateProjectionMatrix();
        galleryRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ========== NAVIGATION AND UI ==========

function nextScene() {
    if (!isExperienceStarted) return;
    loadScene((currentSceneIndex + 1) % scenes.length);
}

function previousScene() {
    if (!isExperienceStarted) return;
    loadScene((currentSceneIndex - 1 + scenes.length) % scenes.length);
}

function toggleSceneMenu() {
    const menu = document.getElementById('scene-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function toggle3DMode() {
    loadScene(1);
}

// ========== SISTEMA DE MÚSICA ==========
function playSceneMusic(sceneIndex) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const scene = scenes[sceneIndex];
    if (!scene.music) return;
    
    currentAudio = new Audio(scene.music);
    currentAudio.volume = 0.5;
    currentAudio.loop = true;
    
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
                btn.remove();
            });
        }
    };
}

function toggleMusic() {
    if (!currentAudio) return;
    
    if (isMusicPlaying) {
        currentAudio.pause();
        isMusicPlaying = false;
    } else {
        currentAudio.play().then(() => { isMusicPlaying = true; });
    }
    updateMusicIcon();
}

function updateMusicIcon() {
    const icon = document.getElementById('music-icon');
    if (icon) {
        icon.className = isMusicPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
}

// ========== EFECTOS VISUALES (2D) ==========
function cleanup2DEffects() {
    document.querySelectorAll('.star, .floating-heart, .bts-element, .special-message').forEach(el => el.remove());
}

function create2DEffects() {
    createStars();
    createFloatingHearts();
    createBTSElements();
    createSpecialMessages();
}

function createSnowflakes() {
    const snowflakeChars = ['❄', '❆', '❅', '·', '.'];
    const snowContainer = document.getElementById('snow-garden');
    if (!snowContainer) return;

    const existingSnowflakes = snowContainer.querySelectorAll('.snowflake');
    existingSnowflakes.forEach(flake => flake.remove());

    for (let i = 0; i < 150; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        snowContainer.appendChild(snowflake);

        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 15 + 8;

        gsap.set(snowflake, {
            x: startX,
            y: -30,
            fontSize: (Math.random() * 1.2 + 0.4) + 'rem',
            opacity: Math.random() * 0.6 + 0.2,
        });

        gsap.to(snowflake, {
            duration: duration,
            y: window.innerHeight + 30,
            x: startX + (Math.random() * 200 - 100),
            rotation: Math.random() * 360,
            ease: 'none',
            repeat: -1,
            delay: Math.random() * -15,
        });

        gsap.to(snowflake, {
            duration: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
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

// ========== PRELOADER LOGIC ==========
function startPreloader() {
    const assetsToLoad = [
        ...photos,
        'Photos/universo.jpg.jpg',
        'Photos/constelaciones.png',
        ...scenes.map(s => s.music).filter(Boolean)
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
            }});
        }, 500);
    }

    assetsToLoad.forEach(url => {
        if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            const img = new Image();
            img.src = url;
            img.onload = assetLoaded;
            img.onerror = assetLoaded;
        } else if (url.match(/\.(mp3)$/)) {
            const audio = new Audio();
            audio.src = url;
            audio.onloadeddata = assetLoaded;
            audio.onerror = assetLoaded;
        } else {
            assetLoaded();
        }
    });
}

// ========== GLOBAL ACCESS ==========
window.startExperience = startExperience;
window.loadScene = loadScene;
window.toggleSceneMenu = toggleSceneMenu;
window.toggleMusic = toggleMusic;
window.previousScene = previousScene;
window.nextScene = nextScene;
window.toggle3DMode = toggle3DMode;

// ========== INICIAR ==========
window.addEventListener('load', () => {
    init();
    startPreloader();
});
