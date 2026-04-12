import React from 'react';
import { motion } from 'framer-motion';

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  scale?: number;
}

const IslamicPattern: React.FC<IslamicPatternProps> = ({ 
  className = "", 
  opacity = 0.05,
  scale = 1 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: opacity }}
        transition={{ duration: 3, ease: "easeInOut" }}
        width="100%"
        height="100%"
        className="text-white/20"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          <pattern
            id="girih-pattern"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Intricate Girih Geometry */}
            <path
              d="M60 0 L120 40 L120 80 L60 120 L0 80 L0 40 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M60 0 L60 120 M0 60 L120 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              strokeDasharray="4 4"
            />
            <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path
              d="M30 30 L90 90 M90 30 L30 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            {/* Secondary Layer */}
            <rect x="20" y="20" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
          </pattern>
          
          <radialGradient id="pattern-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          <mask id="pattern-mask">
            <rect width="100%" height="100%" fill="url(#pattern-fade)" />
          </mask>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#girih-pattern)" mask="url(#pattern-mask)" />
      </motion.svg>
    </div>
  );
};

export default IslamicPattern;
