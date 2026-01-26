import React, { useState, useRef, useEffect } from 'react';
import { DrawableCanvas } from './DrawableCanvas';
import { Button } from './Button';

interface MaskEditorProps {
  imageUrl: string;
  onSave: (maskDataUrl: string) => void;
  onCancel: () => void;
}

export const MaskEditor: React.FC<MaskEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [brushSize, setBrushSize] = useState(40);
  const [maskData, setMaskData] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (img) {
      const handleLoad = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
      }
      return () => {
        if (img) {
            img.removeEventListener('load', handleLoad);
        }
      };
    }
  }, [imageUrl]);

  const handleMaskChange = (mask: string) => {
    setMaskData(mask);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-4xl flex flex-col gap-4 items-center justify-center">
        <div className="relative border-4 border-indigo-500 rounded-lg overflow-hidden">
          <img ref={imageRef} src={imageUrl} alt="For masking" className="block max-w-full max-h-[calc(90vh-120px)]" />
          {imageSize && (
            <DrawableCanvas
              imageUrl={imageUrl}
              brushSize={brushSize}
              onMaskChange={handleMaskChange}
              width={imageSize.width}
              height={imageSize.height}
            />
          )}
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl flex items-center gap-4 border border-slate-700">
            <div className="text-white text-sm">Brush Size:</div>
            <input
              type="range"
              min="10"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-48 accent-indigo-500"
            />
            <Button onClick={onCancel} variant="secondary">Cancel</Button>
            <Button onClick={() => maskData && onSave(maskData)} disabled={!maskData}>
              Apply Mask
            </Button>
        </div>
      </div>
    </div>
  );
};
