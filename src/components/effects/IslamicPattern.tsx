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
        transition={{ duration: 2 }}
        width="100%"
        height="100%"
        className="text-white"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          <pattern
            id="islamic-pattern-geometric"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0l5.8 14.2 14.2 5.8-14.2 5.8L40 40l-5.8-14.2-14.2-5.8 14.2-5.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="40" cy="40" r="2" fill="currentColor" />
            <path
              d="M0 40h10M70 40h10M40 0v10M40 70v10"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern-geometric)" />
      </motion.svg>
    </div>
  );
};

export default IslamicPattern;
