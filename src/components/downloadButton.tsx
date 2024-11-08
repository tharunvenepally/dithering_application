import React from "react"

interface DownloadButtonProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

 const DownloadButton: React.FC<DownloadButtonProps> = ({ canvasRef }) => {
    const downloadImage = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'dithered-image.png';
            link.click();
        }
    };

  return (
    <>
        <button 
            className="btn btn-secondary mt-4" 
            onClick={downloadImage} 
            disabled={!canvasRef}
        >
            Download Dithered Image
        </button>
    </>
  ) 
}

export default DownloadButton
