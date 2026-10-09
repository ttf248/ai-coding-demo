import * as THREE from 'three';

export class ParticleSystem {
    constructor(particleCount = 2000) {
        this.particleCount = particleCount;
        this.particles = [];
        this.targetPositions = [];
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(particleCount * 3);
        this.colors = new Float32Array(particleCount * 3);
        this.velocities = [];
        
        this.mesh = null;
        this.isAnimating = true;
        this.restorationLevel = 0;
    }

    initialize(pixelData, imageWidth, imageHeight) {
        this.particleCount = Math.min(pixelData.length, this.particleCount);
        this.particles = [];
        this.targetPositions = [];
        this.velocities = [];

        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        const centerX = 0;
        const centerY = 0;
        const scaleX = imageWidth / imageHeight > 1 ? imageHeight : imageWidth;
        const scaleY = imageHeight / imageWidth > 1 ? imageWidth : imageHeight;

        for (let i = 0; i < this.particleCount; i++) {
            const pixelIdx = Math.floor((i / this.particleCount) * pixelData.length);
            const pixel = pixelData[pixelIdx];

            // Target position (original image layout)
            const col = pixelIdx % imageWidth;
            const row = Math.floor(pixelIdx / imageWidth);
            const targetX = (col / imageWidth - 0.5) * scaleX;
            const targetY = -(row / imageHeight - 0.5) * scaleY;

            this.targetPositions.push({
                x: targetX,
                y: targetY,
                z: 0
            });

            // Initial random position
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 10;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Color
            colors[i * 3] = pixel.r / 255;
            colors[i * 3 + 1] = pixel.g / 255;
            colors[i * 3 + 2] = pixel.b / 255;

            // Velocity
            this.velocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            });

            this.particles.push({
                x: x,
                y: y,
                z: z
            });
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });

        this.mesh = new THREE.Points(this.geometry, material);
        this.mesh.position.z = 0;

        return this.mesh;
    }

    update(handPosition = null, attractionStrength = 0.1) {
        if (!this.mesh || !this.isAnimating) return;

        const positions = this.geometry.attributes.position.array;
        const targetPositions = this.targetPositions;
        let restorationSum = 0;

        for (let i = 0; i < this.particleCount; i++) {
            const idx = i * 3;
            let x = positions[idx];
            let y = positions[idx + 1];
            let z = positions[idx + 2];

            const vx = this.velocities[i];
            const target = targetPositions[i];

            // Move towards target position
            const dx = target.x - x;
            const dy = target.y - y;
            const dz = target.z - z;

            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const moveForce = 0.05 * attractionStrength;

            if (distance > 0.1) {
                vx.x += (dx / distance) * moveForce;
                vx.y += (dy / distance) * moveForce;
                vx.z += (dz / distance) * moveForce;
                restorationSum += Math.min(1, 1 - distance / 20);
            } else {
                restorationSum += 1;
            }

            // Hand attraction
            if (handPosition) {
                const hx = handPosition.x - x;
                const hy = handPosition.y - y;
                const hz = handPosition.z - z;
                const handDist = Math.sqrt(hx * hx + hy * hy + hz * hz);

                if (handDist < 15) {
                    const force = (1 - handDist / 15) * 0.3;
                    vx.x += (hx / handDist) * force;
                    vx.y += (hy / handDist) * force;
                    vx.z += (hz / handDist) * force;
                }
            }

            // Damping
            vx.x *= 0.95;
            vx.y *= 0.95;
            vx.z *= 0.95;

            // Limit velocity
            const speed = Math.sqrt(vx.x * vx.x + vx.y * vx.y + vx.z * vx.z);
            if (speed > 1) {
                vx.x = (vx.x / speed) * 1;
                vx.y = (vx.y / speed) * 1;
                vx.z = (vx.z / speed) * 1;
            }

            // Update position
            x += vx.x;
            y += vx.y;
            z += vx.z;

            positions[idx] = x;
            positions[idx + 1] = y;
            positions[idx + 2] = z;

            this.particles[i] = { x, y, z };
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.restorationLevel = restorationSum / this.particleCount;
    }

    reset() {
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 10;

            const idx = i * 3;
            const positions = this.geometry.attributes.position.array;
            positions[idx] = x;
            positions[idx + 1] = y;
            positions[idx + 2] = z;

            this.velocities[i] = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            };

            this.particles[i] = { x, y, z };
        }
        this.geometry.attributes.position.needsUpdate = true;
        this.restorationLevel = 0;
    }

    setParticleCount(count) {
        this.particleCount = Math.min(Math.max(count, 100), 5000);
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }
}
