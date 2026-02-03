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
            {/* Glare effect - adjusted for premium dark mode */}
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-300 z-10"
                style={{
                    opacity: isHovered ? 0.4 : 0,
                    background: `radial-gradient(circle at ${rotation.y * 10 + 50}% ${-rotation.x * 10 + 50}%, rgba(0,245,255,0.15), transparent 70%)`
                }}
            />

            {/* Glass Content - Uses glass-card-premium utility */}
            <div className={`h-full w-full glass-card-premium rounded-3xl p-8 relative z-0 transition-all duration-500 border border-white/5 ${isHovered ? 'border-cyan-glow/30 bg-white/10 shadow-[0_0_40px_rgba(0,245,255,0.1)]' : 'bg-white/5'}`}>
                {children}
            </div>
        </motion.div>
    );
};
