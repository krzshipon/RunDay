'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@runday/ui';
import { LogOut, Settings, Users, Calendar } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-[#EDF2F4]">
            {/* Header */}
            <header className="bg-white border-b border-[#8D99AE]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-8 h-8 bg-[#FF9F1C] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">R</span>
                                </div>
                                <span className="ml-2 text-xl font-bold text-[#2B2D42]">RunDay Admin</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-[#8D99AE]">Welcome, {user?.email}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={signOut}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm border-r border-[#8D99AE]/20">
                    <nav className="mt-8 px-4">
                        <div className="space-y-2">
                            <a
                                href="/dashboard"
                                className="flex items-center px-4 py-2 text-sm font-medium text-[#2B2D42] bg-[#FF9F1C]/10 rounded-lg"
                            >
                                <Calendar className="mr-3 h-5 w-5" />
                                Dashboard
                            </a>
                            <a
                                href="/events"
                                className="flex items-center px-4 py-2 text-sm font-medium text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#FF9F1C]/10 rounded-lg transition-colors"
                            >
                                <Calendar className="mr-3 h-5 w-5" />
                                Events
                            </a>
                            <a
                                href="/participants"
                                className="flex items-center px-4 py-2 text-sm font-medium text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#FF9F1C]/10 rounded-lg transition-colors"
                            >
                                <Users className="mr-3 h-5 w-5" />
                                Participants
                            </a>
                            <a
                                href="/settings"
                                className="flex items-center px-4 py-2 text-sm font-medium text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#FF9F1C]/10 rounded-lg transition-colors"
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </a>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}