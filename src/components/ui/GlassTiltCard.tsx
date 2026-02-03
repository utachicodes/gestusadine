import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassTiltCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const GlassTiltCard = ({ children, className = "", delay = 0 }: GlassTiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 degrees tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={`relative transform-style-3d ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
                scale: isHovered ? 1.02 : 1,
            }}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
        >
            {/* Glare effect */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 transition-opacity duration-300 z-10"
                style={{
                    opacity: isHovered ? 0.15 : 0,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)`
                }}
            />

            {/* Glass Content */}
            <div className="h-full w-full bg-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl relative z-0">
                {children}
            </div>
        </motion.div>
    );
};
