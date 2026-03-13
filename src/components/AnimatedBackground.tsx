"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden bg-black flex items-center justify-center">
            {/* Dynamic base gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black opacity-100" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_30%,transparent_100%)]" />

            {/* Hero glow effects subtle mesh */}
            <motion.div
                className="absolute top-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.div
                className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
        </div>
    );
};
