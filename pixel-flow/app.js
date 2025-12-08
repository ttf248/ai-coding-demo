import { translations } from './translations.js';

// Global variables
let scene, camera, renderer, particles;
let handLandmarks = [];
let currentLang = 'zh';

// UI Elements
const videoElement = document.getElementById('input-video');
const canvasElement = document.getElementById('output-canvas');
const imageUpload = document.getElementById('image-upload');
const loadingElement = document.getElementById('loading');
const welcomeContainer = document.getElementById('welcome-container');
const gestureHint = document.getElementById('gesture-hint');
const langZhButton = document.getElementById('lang-zh');
const langEnButton = document.getElementById('lang-en');

// Particle & Interaction state
const particleState = {
    attractionForce: 0.025, // Force pulling particles to their target
    damping: 0.92,         // Friction to slow down particles
    noiseSpeed: 0.004,     // How fast the idle particles drift
    noiseScale: 1.5,       // How far the idle particles drift
    brushRadius: 100,      // The radius of the 'magic brush'
};

function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
}

// --- I18n Language Function ---
function setLanguage(lang) {
    currentLang = lang;
    const translationData = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translationData[key]) {
            // Use innerHTML to support tags like <strong>
            element.innerHTML = translationData[key];
        }
    });

    // Update button active state
    if (lang === 'zh') {
        langZhButton.classList.add('active');
        langEnButton.classList.remove('active');
    } else {
        langEnButton.classList.add('active');
        langZhButton.classList.remove('active');
    }
}

// 1. Initialize Three.js Scene
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

// 2. Initialize MediaPipe Hands
function initMediaPipe() {
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    hands.onResults(onHandResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 360,
    });
    camera.start();
}

function onHandResults(results) {
    // Store the latest hand landmarks
    handLandmarks = results.multiHandLandmarks && results.multiHandLandmarks.length > 0
        ? results.multiHandLandmarks[0]
        : [];
}

// 3. Image Processing and Particle Creation
imageUpload.addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Hide welcome screen and show hints
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

function createParticles(image) {
    if (particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
    }

    const imgWidth = image.width;
    const imgHeight = image.height;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight).data;

    const geometry = new THREE.BufferGeometry();
    const positions = [], colors = [], originalPositions = [], velocities = [], randoms = [];

    const MAX_PARTICLES = 150000;
    const totalPixels = imgWidth * imgHeight;
    let sampleRate = 1;
    if (totalPixels > MAX_PARTICLES) {
        sampleRate = Math.ceil(Math.sqrt(totalPixels / MAX_PARTICLES));
    }

    for (let y = 0; y < imgHeight; y += sampleRate) {
        for (let x = 0; x < imgWidth; x += sampleRate) {
            const i = (y * imgWidth + x) * 4;
            if (imageData[i + 3] > 128) {
                positions.push(
                    (Math.random() - 0.5) * window.innerWidth * 1.2,
                    (Math.random() - 0.5) * window.innerHeight * 1.2,
                    (Math.random() - 0.5) * 1000
                );
                originalPositions.push(x - imgWidth / 2, -(y - imgHeight / 2), 0);
                colors.push(imageData[i] / 255, imageData[i + 1] / 255, imageData[i + 2] / 255);
                velocities.push(0, 0, 0);
                randoms.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('originalPos', new THREE.Float32BufferAttribute(originalPositions, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    geometry.setAttribute('random', new THREE.Float32BufferAttribute(randoms, 3));

    const material = new THREE.PointsMaterial({
        size: sampleRate,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// 4. Interaction and Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (particles) {
        updateParticles();
    }
    renderer.render(scene, camera);
}

function updateParticles() {
    const positions = particles.geometry.attributes.position.array;
    const originalPos = particles.geometry.attributes.originalPos.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const randoms = particles.geometry.attributes.random.array;
    const particleCount = positions.length / 3;

    let brushVec = null;
    if (handLandmarks.length > 0) {
        const indexFingerTip = handLandmarks[8]; // Landmark for the tip of the index finger
        brushVec = new THREE.Vector3(
            (indexFingerTip.x - 0.5) * window.innerWidth,
            -(indexFingerTip.y - 0.5) * window.innerHeight,
            0
        );
    }

    const time = Date.now() * particleState.noiseSpeed;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const op = new THREE.Vector3(originalPos[i3], originalPos[i3 + 1], originalPos[i3 + 2]);
        const v = new THREE.Vector3(velocities[i3], velocities[i3 + 1], velocities[i3 + 2]);

        let force = new THREE.Vector3();

        if (brushVec) {
            const dist = p.distanceTo(brushVec);
            if (dist < particleState.brushRadius) {
                // If inside brush radius, attract to original position
                const attraction = op.clone().sub(p).multiplyScalar(particleState.attractionForce);
                force.add(attraction);
            }
        }

        // Add gentle, random noise for idle floating
        const noise = new THREE.Vector3(
            (Math.sin(p.y * 0.01 + time + randoms[i3] * Math.PI)) * particleState.noiseScale,
            (Math.sin(p.x * 0.01 + time + randoms[i3 + 1] * Math.PI)) * particleState.noiseScale,
            (Math.sin(p.z * 0.01 + time + randoms[i3 + 2] * Math.PI)) * particleState.noiseScale
        );
        force.add(noise);
        
        // Apply forces, damping, and update position
        v.add(force);
        v.multiplyScalar(particleState.damping);
        p.add(v);

        positions[i3] = p.x;
        positions[i3 + 1] = p.y;
        positions[i3 + 2] = p.z;
        velocities[i3] = v.x;
        velocities[i3 + 1] = v.y;
        velocities[i3 + 2] = v.z;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.velocity.needsUpdate = true;
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    showLoading(true);

    // Setup language switcher
    langZhButton.addEventListener('click', () => setLanguage('zh'));
    langEnButton.addEventListener('click', () => setLanguage('en'));

    // Set default language
    setLanguage('zh');

    initThree();
    initMediaPipe();
    animate();

    showLoading(false);
});
