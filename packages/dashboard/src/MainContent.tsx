'use client';

import { MainContentProps } from './types';

export function MainContent({ children, className = '' }: MainContentProps) {
    return (
        <main className={`flex-1 p-8 ${className}`}>
            {children}
        </main>
    );
}