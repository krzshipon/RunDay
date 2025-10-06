import {
    Calendar,
    Users,
    Settings,
    Trophy,
    BarChart3,
    FileText,
    MapPin,
    Star,
    Heart,
    Clock,
    User
} from 'lucide-react';
import { NavigationItem, DashboardConfig } from './types';

// Admin navigation preset
export const adminNavigation: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
    },
    {
        id: 'events',
        label: 'Events',
        href: '/events',
        icon: Calendar,
        children: [
            {
                id: 'events-list',
                label: 'All Events',
                href: '/events',
                icon: Calendar,
            },
            {
                id: 'events-create',
                label: 'Create Event',
                href: '/events/create',
                icon: Calendar,
            },
        ],
    },
    {
        id: 'participants',
        label: 'Participants',
        href: '/participants',
        icon: Users,
    },
    {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        icon: FileText,
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

// User navigation preset
export const userNavigation: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
    },
    {
        id: 'events',
        label: 'Events',
        href: '/events',
        icon: Calendar,
        children: [
            {
                id: 'events-browse',
                label: 'Browse Events',
                href: '/events',
                icon: MapPin,
            },
            {
                id: 'events-my',
                label: 'My Events',
                href: '/events/my',
                icon: User,
            },
            {
                id: 'events-history',
                label: 'Event History',
                href: '/events/history',
                icon: Clock,
            },
        ],
    },
    {
        id: 'achievements',
        label: 'Achievements',
        href: '/achievements',
        icon: Trophy,
    },
    {
        id: 'favorites',
        label: 'Favorites',
        href: '/favorites',
        icon: Heart,
    },
    {
        id: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: User,
    },
];

// Configuration factory functions
export function createAdminDashboardConfig(
    user: { id: string; email: string; name?: string; role?: string },
    onSignOut: () => void
): Partial<DashboardConfig> {
    return {
        title: 'RunDay Admin',
        logoText: 'RunDay',
        navigation: adminNavigation,
        user: {
            ...user,
            role: user.role || 'admin',
        },
        onSignOut,
    };
}

export function createUserDashboardConfig(
    user: { id: string; email: string; name?: string },
    onSignOut: () => void
): Partial<DashboardConfig> {
    return {
        title: 'RunDay',
        logoText: 'RunDay',
        navigation: userNavigation,
        user: {
            ...user,
            role: 'user',
        },
        onSignOut,
    };
}

// Theme presets
export const defaultTheme = {
    primary: '#2B2D42',
    secondary: '#8D99AE',
    accent: '#FF9F1C',
    background: '#EDF2F4',
    text: '#2B2D42',
};

export const darkTheme = {
    primary: '#FF9F1C',
    secondary: '#8D99AE',
    accent: '#2B2D42',
    background: '#1a1a1a',
    text: '#ffffff',
};