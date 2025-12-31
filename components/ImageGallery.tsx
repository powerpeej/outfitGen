import React, { useState, useEffect } from 'react';
import { SavedOutfit } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ isOpen, onClose }) => {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [selectedImage, setSelectedImage] = useState<SavedOutfit | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setOutfits(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load or parse outfits from localStorage", e);
        setOutfits([]);
      }
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSelectImage = (outfit: SavedOutfit) => {
    setSelectedImage(outfit);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col p-4" onClick={onClose}>
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Outfit Gallery</h2>
        <button
          onClick={onClose}
          className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          aria-label="Close Gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        {outfits.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {outfits.map((outfit) => (
                <div
                key={outfit.id}
                className="group relative aspect-w-3 aspect-h-4 bg-slate-800 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all"
                onClick={() => handleSelectImage(outfit)}
                >
                <img
                    src={outfit.imageUrl}
                    alt={outfit.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-xs text-white line-clamp-2">{outfit.prompt}</p>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">Your saved outfits will appear here.</p>
            </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={handleCloseModal}
        >
            <div className="relative max-w-3xl max-h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    className="max-h-[80vh] w-auto h-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
                    <p className="text-white text-sm">{selectedImage.prompt}</p>
                </div>
                <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/80 rounded-full p-2"
                    aria-label="Close Image View"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
