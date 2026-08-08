import { Logo } from "@/components/Logo";
import { SITE_CONFIG } from "@/constants/site";

export const DocsFooter = () => (
    <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <Logo size={24} />
            <p className="text-xs text-zinc-500 font-medium tracking-tight">© 2026 {SITE_CONFIG.name} Engine. Part of the Platform initiative.</p>
        </div>
        <div className="flex gap-6">
            <a href={SITE_CONFIG.links.github} className="text-xs text-zinc-400 hover:text-white transition-colors font-mono">v1.2.4-stable</a>
        </div>
    </div>
);
