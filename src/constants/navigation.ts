export interface NavItem {
    href: string;
    label: string;
    className?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Engine Core" },
    { href: "/docs", label: "Docs" },
    { href: "/portfolio", label: "Portfolio", className: "hidden sm:inline" },
    { href: "/executive", label: "Executive", className: "hidden sm:inline" },
    { href: "/governance", label: "Governance", className: "hidden lg:inline" },
];
