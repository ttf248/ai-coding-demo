import * as THREE from 'three';
import { ParticleSystem } from './utils/ParticleSystem.js';
import { ImageProcessor } from './utils/ImageProcessor.js';
import { HandTracker } from './utils/HandTracker.js';

class PixelFlowApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particleSystem = null;
        this.handTracker = null;
        
        this.imageData = null;
        this.imageWidth = 0;
        this.imageHeight = 0;
        
        this.cameraStream = null;
        this.isAnimating = true;
        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        
        this.setupUI();
        this.initThreeJS();
        this.initHandTracking();
    }

    setupUI() {
        this.elements = {
            canvas: document.getElementById('glCanvas'),
            imageInput: document.getElementById('imageInput'),
            particleCountSlider: document.getElementById('particleCount'),
            particleCountDisplay: document.getElementById('particleCountDisplay'),
            enableCameraCheckbox: document.getElementById('enableCamera'),
            resetBtn: document.getElementById('resetBtn'),
            toggleAnimationBtn: document.getElementById('toggleAnimationBtn'),
            cameraContainer: document.getElementById('cameraContainer'),
            cameraFeed: document.getElementById('cameraFeed'),
            cameraCanvas: document.getElementById('cameraCanvas'),
            handDetected: document.getElementById('handDetected'),
            restorationLevel: document.getElementById('restorationLevel'),
            fps: document.getElementById('fps'),
            loading: document.getElementById('loading')
        };

        this.elements.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.elements.particleCountSlider.addEventListener('input', (e) => this.handleParticleCountChange(e));
        this.elements.enableCameraCheckbox.addEventListener('change', (e) => this.handleCameraToggle(e));
        this.elements.resetBtn.addEventListener('click', () => this.resetParticles());
        this.elements.toggleAnimationBtn.addEventListener('click', () => this.toggleAnimation());
    }

    initThreeJS() {
        const width = this.elements.canvas.clientWidth;
        const height = this.elements.canvas.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 200);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 20;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.elements.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setAnimationLoop(() => this.animate());

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff88, 0.4);
        pointLight.position.set(20, 20, 30);
        this.scene.add(pointLight);

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        this.particleSystem = new ParticleSystem(2000);
    }

    async initHandTracking() {
        this.handTracker = new HandTracker();
        await this.handTracker.initialize();
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading(true);

        try {
            const image = await ImageProcessor.loadImage(file);
            const dimensions = ImageProcessor.getImageDimensions(image, 256);
            
            this.imageWidth = dimensions.width;
            this.imageHeight = dimensions.height;
            this.imageData = ImageProcessor.extractPixels(image, this.imageWidth, this.imageHeight);

            // Remove old particle system
            if (this.particleSystem.mesh && this.scene.children.includes(this.particleSystem.mesh)) {
                this.scene.remove(this.particleSystem.mesh);
            }

            // Create new particle system
            const newParticleSystem = new ParticleSystem(
                parseInt(this.elements.particleCountSlider.value)
            );
            const mesh = newParticleSystem.initialize(this.imageData, this.imageWidth, this.imageHeight);
            this.scene.add(mesh);
            this.particleSystem = newParticleSystem;
        } catch (error) {
            console.error('Error loading image:', error);
            alert('Failed to load image');
        } finally {
            this.showLoading(false);
        }
    }

    handleParticleCountChange(event) {
        const count = parseInt(event.target.value);
        this.elements.particleCountDisplay.textContent = count;

        if (this.imageData && this.imageData.length > 0) {
            this.showLoading(true);
            setTimeout(() => {
                this.particleSystem.setParticleCount(count);
                
                if (this.particleSystem.mesh && this.scene.children.includes(this.particleSystem.mesh)) {
                    this.scene.remove(this.particleSystem.mesh);
                }

                const newParticleSystem = new ParticleSystem(count);
                const mesh = newParticleSystem.initialize(this.imageData, this.imageWidth, this.imageHeight);
                this.scene.add(mesh);
                this.particleSystem = newParticleSystem;
                
                this.showLoading(false);
            }, 100);
        }
    }

    async handleCameraToggle(event) {
        if (event.target.checked) {
            this.startCamera();
        } else {
            this.stopCamera();
        }
    }

    async startCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });

            this.elements.cameraFeed.srcObject = this.cameraStream;
            this.elements.cameraContainer.style.display = 'block';

            return new Promise((resolve) => {
                this.elements.cameraFeed.onloadedmetadata = () => {
                    this.elements.cameraFeed.play().then(resolve);
                };
            });
        } catch (error) {
            console.error('Camera access error:', error);
            this.elements.enableCameraCheckbox.checked = false;
            this.elements.cameraContainer.style.display = 'none';
            alert('Camera access denied');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        this.elements.cameraContainer.style.display = 'none';
        this.elements.handDetected.textContent = 'No';
    }

    resetParticles() {
        if (this.particleSystem) {
            this.particleSystem.reset();
        }
    }

    toggleAnimation() {
        if (this.particleSystem) {
            const isAnimating = this.particleSystem.toggleAnimation();
            this.elements.toggleAnimationBtn.textContent = isAnimating ? 'Pause Animation' : 'Resume Animation';
        }
    }

    showLoading(show) {
        if (show) {
            this.elements.loading.classList.add('active');
        } else {
            this.elements.loading.classList.remove('active');
        }
    }

    onWindowResize() {
        const width = this.elements.canvas.clientWidth;
        const height = this.elements.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    async animate() {
        if (!this.particleSystem || !this.particleSystem.mesh) return;

        // Calculate FPS
        const now = performance.now();
        this.frameCount++;
        if (now - this.lastFrameTime > 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = now;
            this.elements.fps.textContent = this.fps;
        }

        // Hand tracking
        let handPosition = null;
        let gestureIntensity = 0;
        let hasHand = false;

        if (this.handTracker && this.handTracker.isInitialized && this.elements.cameraFeed.readyState === this.elements.cameraFeed.HAVE_ENOUGH_DATA) {
            try {
                const detections = this.handTracker.detect(this.elements.cameraFeed);
                if (detections && detections.landmarks && detections.landmarks.length > 0) {
                    hasHand = true;
                    handPosition = this.handTracker.getHandPosition(detections);
                    gestureIntensity = this.handTracker.getGestureIntensity(detections);
                }
            } catch (error) {
                console.error('Hand tracking error:', error);
            }
        }

        this.elements.handDetected.textContent = hasHand ? 'Yes' : 'No';

        // Update particles
        const attractionStrength = 0.05 + gestureIntensity * 0.15;
        this.particleSystem.update(handPosition, attractionStrength);

        // Update UI
        const restorationPercent = Math.round(this.particleSystem.restorationLevel * 100);
        this.elements.restorationLevel.textContent = restorationPercent + '%';

        // Rotate scene slightly for visual effect
        this.scene.rotation.z += 0.0001;

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PixelFlowApp();
});
