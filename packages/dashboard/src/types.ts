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

// Theme variants
export type ThemeVariant = 'light' | 'dark';

// Theme configuration
export interface ThemeConfig {
    variant: ThemeVariant;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: {
            primary: string;
            secondary: string;
        };
        border: string;
    };
}

// Dashboard configuration
export interface DashboardConfig {
    title: string;
    logoUrl?: string;
    logoText: string;
    navigation: NavigationItem[];
    user: DashboardUser;
    onSignOut: () => void;
    theme?: ThemeConfig;
}// Layout component props
export interface DashboardLayoutProps {
    config: DashboardConfig;
    children: ReactNode;
    className?: string;
}

// Sidebar component props
export interface SidebarProps {
    navigation: NavigationItem[];
    className?: string;
    theme?: ThemeConfig;
    isOpen?: boolean;
    onClose?: () => void;
}

// Header component props
export interface HeaderProps {
    title: string;
    logoText: string;
    logoUrl?: string;
    user: DashboardUser;
    onSignOut: () => void;
    className?: string;
    theme?: ThemeConfig;
    onToggleSidebar?: () => void;
    isSidebarOpen?: boolean;
}

// Main content area props
export interface MainContentProps {
    children: ReactNode;
    className?: string;
    theme?: ThemeConfig;
}