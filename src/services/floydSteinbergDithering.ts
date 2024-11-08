// services/floydSteinbergDithering.ts

export function floydSteinbergDithering(imageData: ImageData, errorDiffusionFactor: number): ImageData {
    const { data, width, height } = imageData;
    const newImageData = new Uint8ClampedArray(data); 

    // The error diffusion matrix for Floyd-Steinberg
    const diffusionMatrix = [
        { x: 1, y: 0, factor: 7 / 16 * errorDiffusionFactor },
        { x: -1, y: 1, factor: 3 / 16 * errorDiffusionFactor },
        { x: 0, y: 1, factor: 5 / 16 * errorDiffusionFactor },
        { x: 1, y: 1, factor: 1 / 16 * errorDiffusionFactor }
    ];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            const oldR = newImageData[index];
            const oldG = newImageData[index + 1];
            const oldB = newImageData[index + 2];

            // Converting colored images to grayscale
            const oldGray = 0.299 * oldR + 0.587 * oldG + 0.114 * oldB;
            const newGray = oldGray < 128 ? 0 : 255;

            const error = oldGray - newGray;

            newImageData[index] = newImageData[index + 1] = newImageData[index + 2] = newGray;

            diffusionMatrix.forEach(({ x: dx, y: dy, factor }) => {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const neighborIndex = (ny * width + nx) * 4;
                    newImageData[neighborIndex] += error * factor;
                    newImageData[neighborIndex + 1] += error * factor;
                    newImageData[neighborIndex + 2] += error * factor;
                }
            });
        }
    }

    return new ImageData(newImageData, width, height);
}
