import Link from "next/link";

interface NavLinkProps {
    href: string;
    label: string;
    active: boolean;
    className?: string;
}

export const NavLink = ({ href, label, active, className }: NavLinkProps) => (
    <Link
        href={href}
        className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${className} ${
            active ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
        }`}
    >
        {label}
        {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
    </Link>
);
