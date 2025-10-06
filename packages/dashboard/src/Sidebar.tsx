'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarProps, NavigationItem, ThemeConfig } from './types';

interface NavigationItemComponentProps {
    item: NavigationItem;
    pathname: string;
    onNavigate?: (href: string) => void;
    theme?: ThemeConfig;
}

function NavigationItemComponent({ item, pathname, onNavigate, theme }: NavigationItemComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isActive = item.isActive ?? (pathname === item.href || pathname.startsWith(item.href + '/'));
    const hasChildren = item.children && item.children.length > 0;
    const isDark = theme?.variant === 'dark';

    const handleNavigation = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate(href);
        } else {
            // Fallback to browser navigation
            window.location.href = href;
        }
    };

    const activeClass = isDark
        ? 'text-white bg-gradient-to-r from-[#FF9F1C] to-orange-500 shadow-lg'
        : 'text-[#2B2D42] bg-gradient-to-r from-[#FF9F1C]/10 to-orange-500/10';

    const inactiveClass = isDark
        ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
        : 'text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#FF9F1C]/10';

    return (
        <div>
            <div
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? activeClass : inactiveClass
                    }`}
            >
                {hasChildren ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center w-full"
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#FF9F1C] text-white rounded-full shadow-sm">
                                {item.badge}
                            </span>
                        )}
                        {isExpanded ? (
                            <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
                        ) : (
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200" />
                        )}
                    </button>
                ) : (
                    <a
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item.href)}
                        className="flex items-center w-full cursor-pointer"
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#FF9F1C] text-white rounded-full shadow-sm">
                                {item.badge}
                            </span>
                        )}
                    </a>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.children!.map((child) => (
                        <NavigationItemComponent
                            key={child.id}
                            item={child}
                            pathname={pathname}
                            onNavigate={onNavigate}
                            theme={theme}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface ExtendedSidebarProps extends SidebarProps {
    currentPath?: string;
    onNavigate?: (href: string) => void;
}

export function Sidebar({
    navigation,
    className = '',
    currentPath = '',
    onNavigate,
    theme,
    isOpen = true,
    onClose
}: ExtendedSidebarProps) {
    const isDark = theme?.variant === 'dark';

    const sidebarClass = isDark
        ? 'bg-slate-800/95 backdrop-blur-sm border-slate-700/50 shadow-2xl'
        : 'bg-white/95 backdrop-blur-sm shadow-sm border-[#8D99AE]/20';

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 ${sidebarClass} border-r transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
                fixed top-16 bottom-0 left-0
                ${className}
            `}>
                <nav className="mt-8 px-4 pb-4 h-full overflow-y-auto">
                    <div className="space-y-2">
                        {navigation.map((item) => (
                            <NavigationItemComponent
                                key={item.id}
                                item={item}
                                pathname={currentPath}
                                onNavigate={onNavigate}
                                theme={theme}
                            />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}