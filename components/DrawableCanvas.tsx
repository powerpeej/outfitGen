import React, { useRef, useEffect, useState } from 'react';

interface DrawableCanvasProps {
  imageUrl: string;
  brushSize: number;
  onMaskChange: (maskDataUrl: string) => void;
  width: number;
  height: number;
}

export const DrawableCanvas: React.FC<DrawableCanvasProps> = ({
  imageUrl,
  brushSize,
  onMaskChange,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      // Initialize mask in memory, but don't draw it yet
    };
  }, [imageUrl, width, height]);

  const getMousePos = (e: React.MouseEvent | MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    isDrawing.current = true;
    lastPos.current = getMousePos(e);
  };

  const draw = (e: React.MouseEvent | MouseEvent) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const currentPos = getMousePos(e);

    ctx.strokeStyle = '#FFFFFF'; // White for mask
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
    }

    lastPos.current = currentPos;
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      // After drawing, generate the mask and send it up
      generateMask();
    }
  };

  const generateMask = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Create a temporary canvas to draw the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d')!;

    // Get the image data from the main canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create new image data for the mask
    const maskImageData = maskCtx.createImageData(width, height);
    const maskData = maskImageData.data;

    // Iterate through pixels: if a pixel is not part of the original image, it's part of the mask
    const originalImage = new Image();
    originalImage.crossOrigin = 'anonymous';
    originalImage.src = imageUrl;
    originalImage.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(originalImage, 0, 0, width, height);
        const originalImageData = tempCtx.getImageData(0, 0, width, height).data;

        for (let i = 0; i < data.length; i += 4) {
            // Compare current canvas with original image
            if (data[i] !== originalImageData[i] || data[i+1] !== originalImageData[i+1] || data[i+2] !== originalImageData[i+2]) {
                // This pixel has been drawn on, make it white in the mask
                maskData[i] = 255;
                maskData[i+1] = 255;
                maskData[i+2] = 255;
                maskData[i+3] = 255;
            } else {
                // This pixel is original, make it black in the mask
                maskData[i] = 0;
                maskData[i+1] = 0;
                maskData[i+2] = 0;
                maskData[i+3] = 255;
            }
        }
        maskCtx.putImageData(maskImageData, 0, 0);
        onMaskChange(maskCanvas.toDataURL('image/png'));
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseUpGlobal = () => stopDrawing();
    const handleMouseMoveGlobal = (e: MouseEvent) => draw(e);

    // Add global listeners to handle mouse up/move outside the canvas
    document.addEventListener('mouseup', handleMouseUpGlobal);
    document.addEventListener('mousemove', handleMouseMoveGlobal);

    return () => {
        document.removeEventListener('mouseup', handleMouseUpGlobal);
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};
