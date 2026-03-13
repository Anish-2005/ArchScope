"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden bg-zinc-950 flex items-center justify-center">
            {/* Dynamic base gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-80" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)]" />

            {/* Hero glow effects */}
            <motion.div
                className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-20 right-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
        </div>
    );
};
