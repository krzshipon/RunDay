'use client';

import { Button } from '@runday/ui';
import { LogOut } from 'lucide-react';
import { HeaderProps } from './types';

export function Header({
    title,
    logoText,
    logoUrl,
    user,
    onSignOut,
    className = '',
    theme,
    onToggleSidebar,
    isSidebarOpen = false
}: HeaderProps) {
    const isDark = theme?.variant === 'dark';

    const headerClass = isDark
        ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700/50 shadow-lg'
        : 'bg-white/90 backdrop-blur-sm border-[#8D99AE]/20 shadow-sm';

    const textClass = isDark ? 'text-white' : 'text-[#2B2D42]';
    const secondaryTextClass = isDark ? 'text-slate-300' : 'text-[#8D99AE]';

    return (
        <header className={`${headerClass} border-b sticky top-0 z-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center ml-6">
                        <div className="flex-shrink-0 flex items-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt={title} className="w-8 h-8" />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-[#FF9F1C] to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-sm font-bold text-white">
                                        {logoText.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className={`ml-4 text-xl font-bold ${textClass}`}>{title}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 mr-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className={`text-sm ${secondaryTextClass}`}>
                                Welcome, {user.name || user.email.split('@')[0]}
                            </span>
                            {user.role && (
                                <span className={`text-xs ${secondaryTextClass} capitalize`}>
                                    {user.role}
                                </span>
                            )}
                        </div>

                        {/* Clickable Profile Avatar */}
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    // Navigate to profile for both user and admin roles
                                    if (user.role === 'user' || user.role === 'admin') {
                                        window.location.href = '/profile';
                                    }
                                }
                            }}
                            className={`focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:ring-opacity-50 rounded-full transition-all duration-200 ${(user.role === 'user' || user.role === 'admin') ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
                                }`}
                            disabled={!(user.role === 'user' || user.role === 'admin')}
                            title={(user.role === 'user' || user.role === 'admin') ? 'Go to Profile' : undefined}
                        >
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || user.email}
                                    className="w-8 h-8 rounded-full ring-2 ring-[#FF9F1C] ring-opacity-50"
                                />
                            ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isDark ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-[#EDF2F4] text-[#2B2D42] hover:bg-slate-200'
                                    }`}>
                                    {(user.name || user.email).charAt(0).toUpperCase()}
                                </div>
                            )}
                        </button>

                        {/* Add some spacing before logout button */}
                        <div className="w-2"></div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onSignOut}
                            className={`flex items-center gap-2 ${isDark
                                ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50'
                                : ''
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}