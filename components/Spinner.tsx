import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="mt-4 text-indigo-300 animate-pulse font-medium">Stitching outfit...</p>
  </div>
);
