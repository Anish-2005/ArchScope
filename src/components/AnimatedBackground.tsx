"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(1300px_550px_at_15%_-5%,rgba(34,211,238,0.14),transparent_60%),radial-gradient(900px_540px_at_85%_0%,rgba(251,113,133,0.12),transparent_58%),linear-gradient(180deg,#080b12_0%,#05070b_42%,#04060a_100%)]" />

            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(to_right,rgba(255,255,255,0.065)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:38px_38px] [mask-image:radial-gradient(ellipse_72%_58%_at_50%_8%,#000_32%,transparent_100%)]" />

            <motion.div
                className="absolute inset-x-0 top-[12%] h-px bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent"
                initial={{ opacity: 0, scaleX: 0.75 }}
                animate={{ opacity: 0.8, scaleX: 1 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
            />

            <motion.div
                className="absolute top-[-14%] left-[-8%] w-[620px] h-[620px] bg-cyan-400/12 rounded-full blur-[130px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.45, 0.62, 0.45] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[12%] right-[-12%] w-[560px] h-[560px] bg-rose-400/10 rounded-full blur-[130px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.35, 0.52, 0.35] }}
                transition={{ duration: 14, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[1050px] -translate-x-1/2 rounded-[50%] border border-cyan-200/8 bg-cyan-300/5 blur-3xl" />
        </div>
    );
};
