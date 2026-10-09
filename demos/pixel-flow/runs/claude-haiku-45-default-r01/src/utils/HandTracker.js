export class HandTracker {
    constructor() {
        this.detector = null;
        this.detections = null;
        this.isSupported = this.checkSupport();
        this.isInitialized = false;
    }

    checkSupport() {
        return typeof window !== 'undefined';
    }

    async initialize() {
        if (!this.isSupported || this.isInitialized) return;

        try {
            // Dynamically import MediaPipe
            const vision = await import('@mediapipe/tasks-vision');
            
            const wasmPath = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm`;
            
            this.detector = await vision.HandLandmarker.createFromOptions(
                vision.FilesetResolver.forVisionTasks(wasmPath),
                {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                }
            );
            
            this.isInitialized = true;
        } catch (error) {
            console.warn('MediaPipe initialization failed, hand tracking disabled:', error);
            this.isInitialized = false;
        }
    }

    detect(videoElement, timestamp) {
        if (!this.detector || !videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            return null;
        }

        try {
            this.detections = this.detector.detectForVideo(videoElement, timestamp || performance.now());
            return this.detections;
        } catch (error) {
            console.error('Hand detection error:', error);
            return null;
        }
    }

    getHandPosition(detections) {
        if (!detections || !detections.landmarks || detections.landmarks.length === 0) {
            return null;
        }

        const landmarks = detections.landmarks[0];
        if (!landmarks || landmarks.length === 0) return null;

        // Use palm center (average of wrist and middle finger base)
        const wrist = landmarks[0]; // Wrist
        const middleBase = landmarks[9]; // Middle finger base

        return {
            x: (wrist.x - 0.5) * 40,
            y: -(wrist.y - 0.5) * 30,
            z: -wrist.z * 20,
            confidence: wrist.z
        };
    }

    isHandOpen(detections) {
        if (!detections || !detections.landmarks || detections.landmarks.length === 0) {
            return false;
        }

        const landmarks = detections.landmarks[0];
        // Check if all fingers are extended (simplified check)
        const fingerTips = [4, 8, 12, 16, 20];
        const palmCenter = landmarks[9];

        let openFingers = 0;
        for (const tipIdx of fingerTips) {
            const tip = landmarks[tipIdx];
            const distance = Math.sqrt(
                Math.pow(tip.x - palmCenter.x, 2) +
                Math.pow(tip.y - palmCenter.y, 2)
            );
            if (distance > 0.05) openFingers++;
        }

        return openFingers >= 4;
    }

    getGestureIntensity(detections) {
        if (!detections || !detections.landmarks || detections.landmarks.length === 0) {
            return 0;
        }

        const landmarks = detections.landmarks[0];
        const handedness = detections.handedness && detections.handedness[0];
        
        if (this.isHandOpen(detections)) {
            return 0.8;
        }

        return 0.2;
    }
}
