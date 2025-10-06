'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { DashboardLayoutProps } from './types';

export function DashboardLayout({
    config,
    children,
    className = ''
}: DashboardLayoutProps) {
    const [currentPath, setCurrentPath] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Get current path on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    // Handle navigation
    const handleNavigate = (href: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = href;
        }
        setIsSidebarOpen(false); // Close sidebar on navigation (mobile)
    };

    const theme = config.theme;
    const isDark = theme?.variant === 'dark';

    // Dynamic theme classes
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-[#EDF2F4] via-white to-[#EDF2F4]';

    return (
        <div className={`min-h-screen ${backgroundClass} ${className}`}>
            <Header
                title={config.title}
                logoText={config.logoText}
                logoUrl={config.logoUrl}
                user={config.user}
                onSignOut={config.onSignOut}
                theme={theme}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex relative">
                <Sidebar
                    navigation={config.navigation}
                    currentPath={currentPath}
                    onNavigate={handleNavigate}
                    theme={theme}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <MainContent theme={theme}>
                    {children}
                </MainContent>
            </div>
        </div>
    );
}