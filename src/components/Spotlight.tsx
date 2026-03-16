"use client";

import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const Spotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-30 opacity-40 mix-blend-soft-light"
            style={{
                background: `radial-gradient(600px circle at var(--x) var(--y), rgba(34, 211, 238, 0.15), transparent 80%)`,
                '--x': springX,
                '--y': springY,
            } as React.CSSProperties}
        />
    );
};
