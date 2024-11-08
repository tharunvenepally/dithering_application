import { useEffect, useRef, useState, ChangeEvent } from "react";
import UploadButton from "./uploadButton";
import DownloadButton from "./downloadButton";
import { floydSteinbergDithering } from "../services/floydSteinbergDithering";
import { jarvisJudiceNinkeDithering } from "../services/jarvisJudiceNinkeDithering";
import { stuckiDithering } from "../services/stuckiDithering";
import { bayerOrderedDithering } from "../services/bayerOrderedDithering";
import { atkinsonDithering } from "../services/atkinsonDithering";

function Hero() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );
  const [ditheredImageData, setDitheredImageData] = useState<ImageData | null>(
    null
  );
  const ditheredCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>("Floyd-Steinberg");

  const [threshold, setThreshold] = useState<number>(128);
  const [errorDiffusionFactor, setErrorDiffusionFactor] = useState<number>(1);
  const [matrixSize, setMatrixSize] = useState<number>(4);

  const handleImageUpload = (image: HTMLImageElement) => {
    setOriginalImage(image);
    setDitheredImageData(null);
  };

  const handleAlgorithmChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgorithm(event.target.value);
  };

  const applyDithering = () => {
    if (originalImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx?.drawImage(originalImage, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const clampedThreshold = Math.min(255, Math.max(0, threshold));
        const clampedErrorDiffusionFactor = Math.min(2, Math.max(0.5, errorDiffusionFactor));
        const clampedMatrixSize = [2, 4].includes(matrixSize) ? matrixSize : 4; 
        
        let ditheredData: ImageData;

        switch (selectedAlgorithm) {
          case "Floyd-Steinberg":
            ditheredData = floydSteinbergDithering(
              imageData,
              clampedErrorDiffusionFactor
            );
            break;
          case "Jarvis-Judice-Ninke":
            ditheredData = jarvisJudiceNinkeDithering(
              imageData,
              clampedErrorDiffusionFactor
            );
            break;
          case "Stucki":
            ditheredData = stuckiDithering(
                imageData,
                clampedErrorDiffusionFactor);
            break;
          case "Bayer Ordered":
            ditheredData = bayerOrderedDithering(
              imageData,
              clampedThreshold,
              clampedMatrixSize
            );
            break;
          case "Atkinson":
            ditheredData = atkinsonDithering(
                imageData, 
                clampedErrorDiffusionFactor);
            break;
          default:
            ditheredData = imageData;
            break;
        }

        setDitheredImageData(ditheredData);
      }
    }
  };

  useEffect(() => {
    if (ditheredImageData && ditheredCanvasRef.current) {
      const canvas = ditheredCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = ditheredImageData.width;
        canvas.height = ditheredImageData.height;
        ctx.putImageData(ditheredImageData, 0, 0);
      }
    }
  }, [ditheredImageData]);

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="w-full">
            <ul className="steps">
              <li className="step step-info">Upload Image</li>
              <li className="step step-info">Choose Dither algorithm</li>
              <li className="step step-info">Select Parameters</li>
              <li className="step step-info">Apply</li>
              <li className="step step-accent" data-content="✔">
                Download
              </li>
            </ul>

            <div>
              <div className="py-6">
                <UploadButton onImageUpload={handleImageUpload} />
              </div>

              <div className="py-4">
                <label className="block text-sm font-bold mb-2">
                  Select Dithering Algorithm:
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={selectedAlgorithm}
                  onChange={handleAlgorithmChange}
                >
                  <option value="Floyd-Steinberg">Floyd-Steinberg</option>
                  <option value="Jarvis-Judice-Ninke">
                    Jarvis-Judice-Ninke
                  </option>
                  <option value="Stucki">Stucki</option>
                  <option value="Bayer Ordered">Bayer Ordered</option>
                  <option value="Atkinson">Atkinson</option>
                </select>
              </div>

              <div className="py-4">
                <label className="block text-sm font-bold mb-2">
                  Grayscale Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="range range-primary"
                />
              </div>

              <div className="py-4">
                <label className="block text-sm font-bold mb-2">
                  Error Diffusion Factor
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={errorDiffusionFactor}
                  onChange={(e) =>
                    setErrorDiffusionFactor(Number(e.target.value))
                  }
                  className="range range-primary"
                />
              </div>

              <div className="py-4">
                <label className="block text-sm font-bold mb-2">
                  Matrix Size (Bayer Ordered)
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={matrixSize}
                  onChange={(e) => setMatrixSize(Number(e.target.value))}
                  className="range range-primary"
                />
              </div>
            </div>

            <button className="btn btn-primary" onClick={applyDithering}>
              Apply Dithering
            </button>
            <div className="flex flex-col w-full justify-center gap-4 md:flex-row flex-wrap">
              {originalImage && (
                <div className="py-6 w-full md:max-w-[48%]">
                  <h2 className="text-xl font-bold">Original Image</h2>
                  <img
                    src={originalImage.src}
                    alt="original"
                    className="rounded w-full  h-auto mx-auto md:mx-0"
                  />
                </div>
              )}

              {ditheredImageData && (
                <>
                  <div className="py-6 w-full md:max-w-[48%]">
                    <h2 className="text-xl font-bold">Dithered Image</h2>
                    <canvas
                      ref={ditheredCanvasRef}
                      className="rounded w-full h-auto mx-auto md:mx-0"
                    />
                  </div>
                  <DownloadButton canvasRef={ditheredCanvasRef} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
