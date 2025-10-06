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
    className = ''
}: HeaderProps) {
    return (
        <header className={`bg-white border-b border-[#8D99AE]/20 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt={title} className="w-8 h-8" />
                            ) : (
                                <div className="w-8 h-8 bg-[#FF9F1C] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {logoText.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="ml-2 text-xl font-bold text-[#2B2D42]">{title}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-[#8D99AE]">
                                Welcome, {user.name || user.email}
                            </span>
                            {user.role && (
                                <span className="text-xs text-[#8D99AE] capitalize">
                                    {user.role}
                                </span>
                            )}
                        </div>
                        {user.avatar && (
                            <img
                                src={user.avatar}
                                alt={user.name || user.email}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onSignOut}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}