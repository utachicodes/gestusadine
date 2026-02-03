import React from "react";
import { motion } from "framer-motion";

const shapes = [
  { size: 400, x: "-10%", y: "-10%", color: "bg-cyan-glow/5" },
  { size: 300, x: "80%", y: "10%", color: "bg-purple-500/5" },
  { size: 500, x: "10%", y: "70%", color: "bg-blue-600/5" },
];

const GeometricBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] animate-pattern-rotate" />

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
            scale: [0.99, 1.01, 0.99],
            y: [0, -4, 0],
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2.5,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricBackground;


