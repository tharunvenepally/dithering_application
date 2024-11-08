// services/bayerOrderedDithering.ts

export function bayerOrderedDithering(imageData: ImageData, threshold: number, matrixSize: number): ImageData {
    const { data, width, height } = imageData;
    const newImageData = new Uint8ClampedArray(data);

    const baseMatrix = [
        [15, 7, 13, 5],
        [3, 11, 1, 9],
        [12, 4, 14, 6],
        [0, 8, 2, 10]
    ];

    let bayerMatrix: number[][] = [];
    if (matrixSize === 4) {
        bayerMatrix = baseMatrix;
    } else if (matrixSize === 2) {
        bayerMatrix = [
            [0, 2],
            [3, 1]
        ];
    } else {
        console.warn(`Matrix size ${matrixSize} is not supported; using default 4x4.`);
        bayerMatrix = baseMatrix;
    }

    const thresholdScale = threshold / (matrixSize * matrixSize);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            const oldR = newImageData[index];
            const oldG = newImageData[index + 1];
            const oldB = newImageData[index + 2];

            const oldGray = 0.299 * oldR + 0.587 * oldG + 0.114 * oldB;

            // Getting the threshold from the Bayer matrix
            const threshold = bayerMatrix[y % matrixSize][x % matrixSize] * thresholdScale;

            const newGray = oldGray > threshold ? 255 : 0;

            newImageData[index] = newImageData[index + 1] = newImageData[index + 2] = newGray;
        }
    }

    return new ImageData(newImageData, width, height);
}
