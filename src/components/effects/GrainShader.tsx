import React from 'react';

const GrainShader = () => {
  return (
    <svg 
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.035] isolate pointer-events-none select-none"
      style={{ filter: 'contrast(120%) brightness(100%)' }}
    >
      <filter id="gestusadineNoise">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.65" 
          numOctaves="3" 
          stitchTiles="stitch" 
        />
        <feColorMatrix 
          type="matrix" 
          values="0 0 0 0 0 
                  0 0 0 0 0 
                  0 0 0 0 0 
                  0 0 0 0.8 0" 
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#gestusadineNoise)" />
    </svg>
  );
};

export default GrainShader;
