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

// Sub-navigation item component for child items
function SubNavigationItem({ item, pathname, onNavigate, theme }: NavigationItemComponentProps) {
    const isActive = item.isActive ?? (pathname === item.href || pathname.startsWith(item.href + '/'));
    const isDark = theme?.variant === 'dark';

    const handleNavigation = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate(href);
        } else {
            window.location.href = href;
        }
    };

    const activeSubClass = isDark
        ? 'text-[#FF9F1C] bg-gradient-to-r from-slate-700/80 to-slate-600/60 border-l-3 border-[#FF9F1C] shadow-md'
        : 'text-[#FF9F1C] bg-gradient-to-r from-[#FF9F1C]/8 to-orange-500/5 border-l-3 border-[#FF9F1C]';

    const inactiveSubClass = isDark
        ? 'text-slate-400 hover:text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/30 border-l-3 border-slate-600/50 hover:border-slate-500'
        : 'text-[#8D99AE] hover:text-[#2B2D42] hover:bg-gradient-to-r hover:from-[#FF9F1C]/5 hover:to-orange-500/3 border-l-3 border-slate-300/50 hover:border-slate-400';

    return (
        <div className="relative">
            {/* Connection line */}
            <div className={`absolute left-4 -top-1 w-px h-3 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />

            {/* Horizontal connection */}
            <div className={`absolute left-4 top-3 w-4 h-px ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />

            <div
                className={`flex items-center px-6 py-2 text-xs font-normal rounded-lg transition-all duration-200 ml-6 mr-2 relative ${isActive ? activeSubClass : inactiveSubClass
                    }`}
            >
                <a
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    className="flex items-center w-full cursor-pointer"
                >
                    {/* Small dot indicator */}
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 ${isActive
                        ? 'bg-[#FF9F1C]'
                        : isDark
                            ? 'bg-slate-500'
                            : 'bg-slate-400'
                        }`} />

                    <item.icon className="mr-4 h-3.5 w-3.5 opacity-80" />
                    <span className="flex-1 text-xs font-medium">{item.label}</span>
                    {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-[#FF9F1C]/80 text-white rounded-full shadow-sm text-[10px]">
                            {item.badge}
                        </span>
                    )}
                </a>
            </div>
        </div>
    );
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
                <div className="mt-2 mb-1 relative">
                    {/* Vertical connection line */}
                    <div className={`absolute left-6 top-0 bottom-2 w-px ${theme?.variant === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                        }`} />

                    <div className="space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                        {item.children!.map((child, index) => (
                            <div key={child.id} className="relative">
                                <SubNavigationItem
                                    item={child}
                                    pathname={pathname}
                                    onNavigate={onNavigate}
                                    theme={theme}
                                />
                                {/* Bottom connection for last item */}
                                {index === item.children!.length - 1 && (
                                    <div className={`absolute left-6 top-4 w-px h-2 ${theme?.variant === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
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
        <aside className={`
            w-72 ${sidebarClass} border-r flex-shrink-0 ${className}
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
    );
}