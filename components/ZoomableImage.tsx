import React, { useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''} ${className}`}
      onClick={() => setIsZoomed(!isZoomed)}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
      />
    </div>
  );
};
