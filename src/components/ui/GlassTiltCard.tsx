import React from 'react';
import { motion } from 'framer-motion';

interface GlassTiltCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const GlassTiltCard = ({ children, className = "", delay = 0 }: GlassTiltCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
            className={`relative group ${className}`}
        >
            <div className="h-full w-full glass-card-warm p-7 rounded-2xl transition-all duration-200 hover:shadow-md">
                {children}
            </div>
        </motion.div>
    );
};
