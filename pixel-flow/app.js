import { translations } from './translations.js';

// --- Global State ---
let scene, camera, renderer, particles;
let currentLang = 'zh';
let currentInteractionMode = 'gravity'; // 'gravity', 'rewind', 'dual'
let hands = { left: null, right: null };

// Mode-specific state
let timeRewindProgress = 1.0; // 0 = restored, 1 = scattered

// --- UI Elements ---
const videoElement = document.getElementById('input-video');
const canvasElement = document.getElementById('output-canvas');
const imageUpload = document.getElementById('image-upload');
const loadingElement = document.getElementById('loading');
const welcomeContainer = document.getElementById('welcome-container');
const gestureHint = document.getElementById('gesture-hint');
const dynamicInstructions = document.getElementById('dynamic-instructions');

// Language and Mode Buttons
const langZhButton = document.getElementById('lang-zh');
const langEnButton = document.getElementById('lang-en');
const modeGravityButton = document.getElementById('mode-gravity');
const modeRewindButton = document.getElementById('mode-rewind');
const modeDualButton = document.getElementById('mode-dual');

// --- Particle & Interaction Physics ---
const particleState = {
    damping: 0.93,
    noiseSpeed: 0.004,
    noiseScale: 1.5,
    // Mode-specific
    gravity: { attraction: 0.02, repel: 0.1 },
    rewind: { speed: 0.005 },
    dual: { brushRadius: 80, attraction: 0.1, repel: 0.05 },
};

// --- Core Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    showLoading(true);

    setupEventListeners();
    setInteractionMode(currentInteractionMode); // Sets default mode and text

    initThree();
    initMediaPipe();
    animate();

    showLoading(false);
});

function setupEventListeners() {
    langZhButton.addEventListener('click', () => setLanguage('zh'));
    langEnButton.addEventListener('click', () => setLanguage('en'));
    modeGravityButton.addEventListener('click', () => setInteractionMode('gravity'));
    modeRewindButton.addEventListener('click', () => setInteractionMode('rewind'));
    modeDualButton.addEventListener('click', () => setInteractionMode('dual'));

    imageUpload.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                welcomeContainer.classList.add('hidden');
                gestureHint.classList.remove('hidden');
                videoElement.classList.remove('hidden');

                const img = new Image();
                img.onload = () => createParticles(img);
                img.src = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });
}

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;
    renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function initMediaPipe() {
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
        maxNumHands: 2, // Enable two hands
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });
    hands.onResults(onHandResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => { await hands.send({ image: videoElement }); },
        width: 640,
        height: 360,
    });
    camera.start();
}


// --- Text & Mode Management ---
function setLanguage(lang) {
    currentLang = lang;
    [langZhButton, langEnButton].forEach(b => b.classList.remove('active'));
    lang === 'zh' ? langZhButton.classList.add('active') : langEnButton.classList.add('active');
    updateDynamicText();
}

function setInteractionMode(mode) {
    currentInteractionMode = mode;
    [modeGravityButton, modeRewindButton, modeDualButton].forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    // Reset states when switching modes for clean transitions
    if (particles) {
        const count = particles.geometry.attributes.position.count;
        for (let i = 0; i < count; i++) {
            particles.geometry.attributes.isCollected.array[i] = 0;
        }
        particles.geometry.attributes.isCollected.needsUpdate = true;
    }
    if (mode !== 'rewind') {
         // Apply rewind position to current particles before switching away
        if(timeRewindProgress > 0 && particles) {
            applyRewindState();
        }
        timeRewindProgress = 1.0;
    }

    updateDynamicText();
}

function updateDynamicText() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerHTML = t[key];
    });

    const instructionsHtml = `
        <p>${t[currentInteractionMode + '_instruct_p1']}</p>
        <p>${t[currentInteractionMode + '_instruct_p2']}</p>
        ${t[currentInteractionMode + '_instruct_p3'] ? `<p>${t[currentInteractionMode + '_instruct_p3']}</p>` : ''}
    `;
    dynamicInstructions.innerHTML = instructionsHtml;
    gestureHint.innerHTML = `<p>${t[currentInteractionMode + '_hint']}</p>`;
}


// --- Particle & Hand Logic ---

function createParticles(image) {
    if (particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
    }

    const imgWidth = image.width, imgHeight = image.height;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgWidth; canvas.height = imgHeight;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight).data;

    const geometry = new THREE.BufferGeometry();
    const pos = [], origPos = [], rndPos = [], colors = [], vels = [], collected = [];

    const MAX_PARTICLES = 150000;
    const totalPixels = imgWidth * imgHeight;
    let sampleRate = Math.ceil(Math.sqrt(totalPixels / MAX_PARTICLES));
    sampleRate = Math.max(1, sampleRate);

    for (let y = 0; y < imgHeight; y += sampleRate) {
        for (let x = 0; x < imgWidth; x += sampleRate) {
            if (imageData[(y * imgWidth + x) * 4 + 3] > 128) {
                pos.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
                origPos.push(x - imgWidth / 2, -(y - imgHeight / 2), 0);
                rndPos.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
                const i = (y * imgWidth + x) * 4;
                colors.push(imageData[i] / 255, imageData[i + 1] / 255, imageData[i + 2] / 255);
                vels.push(0, 0, 0);
                collected.push(0);
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geometry.setAttribute('originalPos', new THREE.Float32BufferAttribute(origPos, 3));
    geometry.setAttribute('randomPos', new THREE.Float32BufferAttribute(rndPos, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(vels, 3));
    geometry.setAttribute('isCollected', new THREE.Float32BufferAttribute(collected, 1));

    const material = new THREE.PointsMaterial({ size: sampleRate, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onHandResults(results) {
    hands = { left: null, right: null };
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const hand = results.multiHandLandmarks[i];
            const handedness = results.multiHandedness[i].label; // 'Left' or 'Right'
            const handData = { landmarks: hand, gesture: getGesture(hand) };
            if (handedness === 'Left') hands.left = handData;
            else if (handedness === 'Right') hands.right = handData;
        }
    }
}

function getGesture(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];
    const avgDist = (landmarks[8].y + landmarks[12].y + landmarks[16].y + landmarks[20].y) / 4;
    
    if (avgDist < landmarks[5].y && avgDist < landmarks[9].y) return 'fist';
    if (indexTip.y < landmarks[5].y) return 'finger_up';
    if (indexTip.y > landmarks[5].y + 0.1) return 'finger_down';
    return 'open_palm';
}


// --- Main Animation Loop & Mode Dispatcher ---

function animate() {
    requestAnimationFrame(animate);
    if (particles) {
        switch (currentInteractionMode) {
            case 'gravity': updateGravityMode(); break;
            case 'rewind': updateTimeRewindMode(); break;
            case 'dual': updateDualBrushMode(); break;
        }
    }
    renderer.render(scene, camera);
}

// --- Mode-Specific Update Functions ---

function updateGravityMode() {
    const hand = hands.right || hands.left;
    const gesture = hand ? hand.gesture : null;

    const positions = particles.geometry.attributes.position;
    const vels = particles.geometry.attributes.velocity;
    const origPos = particles.geometry.attributes.originalPos;
    const isCollected = particles.geometry.attributes.isCollected;

    const handVec = hand ? getHandPos(hand.landmarks, 0) : null;
    const force = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(positions, i);
        const v = new THREE.Vector3().fromBufferAttribute(vels, i);
        force.set(0, 0, 0);

        if (handVec && gesture === 'open_palm') {
            const dist = p.distanceTo(handVec);
            if (dist < 200) {
                force.add(handVec.clone().sub(p).normalize().multiplyScalar(particleState.gravity.attraction * (200 - dist)));
                isCollected.array[i] = 1;
            }
        } else if (handVec && gesture === 'fist' && isCollected.array[i] === 1) {
            const op = new THREE.Vector3().fromBufferAttribute(origPos, i);
            force.add(op.clone().sub(p).multiplyScalar(particleState.gravity.repel));
        }

        v.add(force).multiplyScalar(particleState.damping);
        p.add(v);
        positions.setXYZ(i, p.x, p.y, p.z);
        vels.setXYZ(i, v.x, v.y, v.z);
    }
    positions.needsUpdate = vels.needsUpdate = isCollected.needsUpdate = true;
}

function updateTimeRewindMode() {
    const hand = hands.right || hands.left;
    const gesture = hand ? hand.gesture : null;
    const speed = particleState.rewind.speed * (hand ? (hand.landmarks[0].x * 2) : 1);

    if (gesture === 'finger_up') timeRewindProgress = Math.min(1.0, timeRewindProgress + speed);
    else if (gesture === 'finger_down') timeRewindProgress = Math.max(0.0, timeRewindProgress - speed);
    
    applyRewindState();
}

function applyRewindState() {
     if(!particles) return;
    const positions = particles.geometry.attributes.position;
    const origPos = particles.geometry.attributes.originalPos;
    const rndPos = particles.geometry.attributes.randomPos;
    for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(origPos, i);
        const r = new THREE.Vector3().fromBufferAttribute(rndPos, i);
        p.lerp(r, timeRewindProgress);
        positions.setXYZ(i, p.x, p.y, p.z);
    }
    positions.needsUpdate = true;
}

function updateDualBrushMode() {
    const positions = particles.geometry.attributes.position;
    const vels = particles.geometry.attributes.velocity;
    const origPos = particles.geometry.attributes.originalPos;

    const rBrush = hands.right ? getHandPos(hands.right.landmarks, 8) : null;
    const lBrush = hands.left ? getHandPos(hands.left.landmarks, 8) : null;
    const force = new THREE.Vector3();
    const radius = particleState.dual.brushRadius;

    for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(positions, i);
        const v = new THREE.Vector3().fromBufferAttribute(vels, i);
        const op = new THREE.Vector3().fromBufferAttribute(origPos, i);
        force.set(0,0,0);

        if (rBrush) {
            const dist = p.distanceTo(rBrush);
            if (dist < radius) {
                force.add(op.clone().sub(p).multiplyScalar(particleState.dual.attraction));
            }
        }
        if (lBrush) {
            const dist = p.distanceTo(lBrush);
            if (dist < radius) {
                force.add(p.clone().sub(lBrush).normalize().multiplyScalar(particleState.dual.repel * (radius-dist)));
            }
        }
        
        // Add noise for idle particles
        if (!rBrush && !lBrush) {
            const noise = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
            force.add(noise.multiplyScalar(particleState.noiseScale));
        }

        v.add(force).multiplyScalar(particleState.damping);
        p.add(v);
        positions.setXYZ(i, p.x, p.y, p.z);
        vels.setXYZ(i, v.x, v.y, v.z);
    }
    positions.needsUpdate = vels.needsUpdate = true;
}

// --- Helper Functions ---
function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
}
function getHandPos(landmarks, index) {
    const p = landmarks[index];
    return new THREE.Vector3((p.x - 0.5) * window.innerWidth * 1.2, -(p.y - 0.5) * window.innerHeight * 1.2, 0);
}