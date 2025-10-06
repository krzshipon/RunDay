'use client';

import { MainContentProps } from './types';

export function MainContent({ children, className = '', theme }: MainContentProps) {
    const isDark = theme?.variant === 'dark';

    const contentClass = isDark
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
        : 'bg-gradient-to-br from-[#EDF2F7] to-white text-[#2B2D42]';

    return (
        <main className={`flex-1 p-4 lg:p-8 overflow-y-auto ${contentClass} ${className}`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
    );
}