// Global variables
let scene, camera, renderer, particles;
let handLandmarks = [];

const videoElement = document.getElementById('input-video');
const canvasElement = document.getElementById('output-canvas');
const imageUpload = document.getElementById('image-upload');
const loadingElement = document.getElementById('loading');
const infoText = document.getElementById('info-text');

// Particle state
const particleState = {
    isRestoring: false,
    attractionForce: 0.05,
    damping: 0.95,
    noiseSpeed: 0.005,
    noiseScale: 2,
};

function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
}

function setInfoText(text) {
    infoText.textContent = text;
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
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        handLandmarks = results.multiHandLandmarks[0];
        checkGesture(handLandmarks);
    } else {
        handLandmarks = [];
        particleState.isRestoring = false;
    }
}

// 3. Image Processing and Particle Creation
imageUpload.addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                createParticles(img);
                setInfoText('Make a fist to restore the image!');
            };
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
    const positions = [];
    const colors = [];
    const originalPositions = [];
    const velocities = [];
    const randoms = [];

    const sampleRate = Math.max(1, Math.floor(imgWidth / 200)); // Adjust sample rate for performance

    for (let y = 0; y < imgHeight; y += sampleRate) {
        for (let x = 0; x < imgWidth; x += sampleRate) {
            const i = (y * imgWidth + x) * 4;
            if (imageData[i + 3] > 128) { // Only use non-transparent pixels
                // Initial random position
                positions.push(
                    (Math.random() - 0.5) * window.innerWidth,
                    (Math.random() - 0.5) * window.innerHeight,
                    (Math.random() - 0.5) * 1000
                );

                // Original position (target)
                originalPositions.push(
                    x - imgWidth / 2,
                    -(y - imgHeight / 2),
                    0
                );
                
                // Color
                colors.push(imageData[i] / 255, imageData[i + 1] / 255, imageData[i + 2] / 255);

                // Initial velocity
                velocities.push(0, 0, 0);

                // Random values for noise
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
        size: sampleRate * 1.2,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
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

    let handVec = null;
    if (handLandmarks.length > 0) {
        const palmCenter = handLandmarks[0]; // Using palm base as center
        handVec = new THREE.Vector3(
            (palmCenter.x - 0.5) * window.innerWidth,
            -(palmCenter.y - 0.5) * window.innerHeight,
            0
        );
    }

    const time = Date.now() * particleState.noiseSpeed;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const op = new THREE.Vector3(originalPos[i3], originalPos[i3 + 1], originalPos[i3 + 2]);
        const v = new THREE.Vector3(velocities[i3], velocities[i3 + 1], velocities[i3 + 2]);

        if (particleState.isRestoring) {
            // Move towards original position
            const attraction = op.clone().sub(p).multiplyScalar(particleState.attractionForce);
            v.add(attraction);
        } else {
            // Dynamic floating behavior using noise
            const noise = new THREE.Vector3(
                (Math.sin(p.y * 0.01 + time + randoms[i3] * 5)) * particleState.noiseScale,
                (Math.sin(p.x * 0.01 + time + randoms[i3+1] * 5)) * particleState.noiseScale,
                (Math.sin(p.z * 0.01 + time + randoms[i3+2] * 5)) * particleState.noiseScale,
            );
            v.add(noise);
        }

        // Apply hand interaction "force field"
        if (handVec) {
            const dist = p.distanceTo(handVec);
            if (dist < 150) { // Interaction radius
                 const repel = p.clone().sub(handVec).normalize().multiplyScalar(150 / Math.max(20, dist));
                 v.add(repel.multiplyScalar(0.5));
            }
        }
        
        // Apply damping and update position
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

// 5. Gesture Recognition
function checkGesture(landmarks) {
    // Simple "fist" gesture: check if fingertips are close to the palm.
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];

    const avgDist = (
        getDistance(thumbTip, wrist) +
        getDistance(indexTip, wrist) +
        getDistance(middleTip, wrist) +
        getDistance(ringTip, wrist) +
        getDistance(pinkyTip, wrist)
    ) / 5;
    
    // A smaller average distance suggests a closed fist.
    // The threshold (0.25) might need tuning.
    if (avgDist < 0.25) {
        particleState.isRestoring = true;
    } else {
        particleState.isRestoring = false;
    }
}

function getDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// --- Main Execution ---
showLoading(true);
initThree();
initMediaPipe();
animate();
showLoading(false);
setInfoText('Upload an image to start!');
