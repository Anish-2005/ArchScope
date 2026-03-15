import { LucideIcon } from 'lucide-react';

export interface NavItemType {
  label: string;
  href: string;
  icon: LucideIcon;
  id?: string;
}

export interface DocsSectionData {
  id: string;
  title: string;
  gradientFrom: string;
  accentColor: string;
}
