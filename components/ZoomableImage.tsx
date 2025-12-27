import React, { useState, useRef, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClientPos = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Stop event propagation to prevent scrolling parent elements if needed, 
    // though native scroll is prevented by css touch-none/overflow-hidden mostly.
    e.stopPropagation(); 
    
    // Zoom Logic
    const delta = -e.deltaY * 0.002;
    const newScale = Math.min(Math.max(1, scale + delta), 5); // Max zoom 5x
    
    setScale(newScale);

    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Dragging - Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault(); // Prevent default image drag behavior
      setIsDragging(true);
      lastClientPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const dx = e.clientX - lastClientPos.current.x;
      const dy = e.clientY - lastClientPos.current.y;
      
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastClientPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Touch Support (Pinch & Drag)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      // Drag start
      setIsDragging(true);
      lastClientPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - lastTouchDistance.current;
      const newScale = Math.min(Math.max(1, scale + delta * 0.005), 5);
      
      setScale(newScale);
      lastTouchDistance.current = dist;
    } else if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastClientPos.current.x;
      const dy = e.touches[0].clientY - lastClientPos.current.y;
      
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastClientPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  // Reset when src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-hidden relative touch-none bg-slate-900/20" 
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-75 ease-out origin-center select-none pointer-events-none`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          willChange: 'transform'
        }}
        draggable={false}
      />
      
      {scale > 1 && (
        <div className="absolute top-2 right-2 z-20">
            <button 
                onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({x:0, y:0}); }}
                className="bg-black/60 hover:bg-indigo-600 text-white p-1.5 rounded-full backdrop-blur-sm transition-all shadow-lg border border-white/10"
                title="Reset Zoom"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      )}
    </div>
  );
};