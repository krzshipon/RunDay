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
    };

    return (
        <div className={`min-h-screen bg-[#EDF2F4] ${className}`}>
            <Header
                title={config.title}
                logoText={config.logoText}
                logoUrl={config.logoUrl}
                user={config.user}
                onSignOut={config.onSignOut}
            />

            <div className="flex">
                <Sidebar
                    navigation={config.navigation}
                    currentPath={currentPath}
                    onNavigate={handleNavigate}
                />

                <MainContent>
                    {children}
                </MainContent>
            </div>
        </div>
    );
}