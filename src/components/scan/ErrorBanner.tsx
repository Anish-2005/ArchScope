import { motion } from "framer-motion";

interface ErrorBannerProps {
    message: string;
}

export const ErrorBanner = ({ message }: ErrorBannerProps) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest bg-rose-500/10 py-2.5 px-4 rounded-full border border-rose-500/20 shadow-lg"
    >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        {message}
    </motion.div>
);
