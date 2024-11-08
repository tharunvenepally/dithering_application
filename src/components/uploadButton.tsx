import {ChangeEvent } from 'react'

interface UploadButtonProps {
    onImageUpload: (image: HTMLImageElement) => void;
}

function UploadButton({ onImageUpload}: UploadButtonProps) {
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                onImageUpload(img);
            };
        }
    };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
    </>
  ) 
}

export default UploadButton


