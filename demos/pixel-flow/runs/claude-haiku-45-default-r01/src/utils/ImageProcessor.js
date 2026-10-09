export class ImageProcessor {
    static loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    static extractPixels(image, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image to canvas
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const pixels = [];
        for (let i = 0; i < data.length; i += 4) {
            pixels.push({
                r: data[i],
                g: data[i + 1],
                b: data[i + 2],
                a: data[i + 3]
            });
        }

        return pixels;
    }

    static getImageDimensions(image, maxSize = 256) {
        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {
            const ratio = width / height;
            if (ratio > 1) {
                width = maxSize;
                height = Math.round(maxSize / ratio);
            } else {
                height = maxSize;
                width = Math.round(maxSize * ratio);
            }
        }

        return { width, height };
    }
}
