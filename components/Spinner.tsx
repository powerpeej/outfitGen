import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Outer Ring */}
      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-pulse"></div>

      {/* Middle Rotating Ring */}
      <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-indigo-400 rounded-full animate-spin"></div>

      {/* Inner Rotating Ring (Reverse) */}
      <div className="absolute inset-2 border-4 border-transparent border-b-pink-500 border-l-pink-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

      {/* Center Dot */}
      <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></div>
    </div>
    <p className="mt-4 text-xs font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 animate-pulse uppercase">
      Weaving Magic...
    </p>
  </div>
);
