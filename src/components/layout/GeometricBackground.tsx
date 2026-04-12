import React from "react";
import { motion } from "framer-motion";

const shapes = [
  { size: 500, x: "-8%", y: "-5%", color: "bg-warm-gold/8" },
  { size: 350, x: "78%", y: "8%", color: "bg-sage-green/10" },
  { size: 450, x: "15%", y: "65%", color: "bg-deep-green/5" },
];

const GeometricBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle warm base gradient */}
      <div className="absolute inset-0 bg-warm-base" />

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 bg-geometric-pattern opacity-100" />

      {/* Ambient orbs */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${shape.color}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.02, 0.98],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 3,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricBackground;
