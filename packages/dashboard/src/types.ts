import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// Navigation item interface
export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
    isActive?: boolean;
    children?: NavigationItem[];
}

// User interface for header
export interface DashboardUser {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: string;
}

// Dashboard configuration
export interface DashboardConfig {
    title: string;
    logoUrl?: string;
    logoText: string;
    navigation: NavigationItem[];
    user: DashboardUser;
    onSignOut: () => void;
    theme?: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
}

// Layout component props
export interface DashboardLayoutProps {
    config: DashboardConfig;
    children: ReactNode;
    className?: string;
}

// Sidebar component props
export interface SidebarProps {
    navigation: NavigationItem[];
    className?: string;
}

// Header component props
export interface HeaderProps {
    title: string;
    logoText: string;
    logoUrl?: string;
    user: DashboardUser;
    onSignOut: () => void;
    className?: string;
}

// Main content area props
export interface MainContentProps {
    children: ReactNode;
    className?: string;
}