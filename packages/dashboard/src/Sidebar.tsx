'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarProps, NavigationItem } from './types';

interface NavigationItemComponentProps {
    item: NavigationItem;
    pathname: string;
    onNavigate?: (href: string) => void;
}

function NavigationItemComponent({ item, pathname, onNavigate }: NavigationItemComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isActive = item.isActive ?? (pathname === item.href || pathname.startsWith(item.href + '/'));
    const hasChildren = item.children && item.children.length > 0;

    const handleNavigation = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate(href);
        } else {
            // Fallback to browser navigation
            window.location.href = href;
        }
    };

    return (
        <div>
            <div
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? 'text-[#2B2D42] bg-[#FF9F1C]/10'
                        : 'text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#FF9F1C]/10'
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
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#FF9F1C] text-white rounded-full">
                                {item.badge}
                            </span>
                        )}
                        {isExpanded ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronRight className="ml-2 h-4 w-4" />
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
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#FF9F1C] text-white rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </a>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => (
                        <NavigationItemComponent
                            key={child.id}
                            item={child}
                            pathname={pathname}
                            onNavigate={onNavigate}
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
    onNavigate
}: ExtendedSidebarProps) {
    return (
        <aside className={`w-64 bg-white shadow-sm border-r border-[#8D99AE]/20 ${className}`}>
            <nav className="mt-8 px-4">
                <div className="space-y-2">
                    {navigation.map((item) => (
                        <NavigationItemComponent
                            key={item.id}
                            item={item}
                            pathname={currentPath}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </nav>
        </aside>
    );
}