import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@runday/ui';
import { Calendar, Users, Trophy, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#2B2D42]">Dashboard</h1>
                        <p className="mt-2 text-[#8D99AE]">Welcome to your event management dashboard</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#FF9F1C]/10 rounded-lg">
                                        <Calendar className="h-6 w-6 text-[#FF9F1C]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Total Events</p>
                                        <p className="text-2xl font-bold text-[#2B2D42]">12</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#2B2D42]/10 rounded-lg">
                                        <Users className="h-6 w-6 text-[#2B2D42]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Total Participants</p>
                                        <p className="text-2xl font-bold text-[#2B2D42]">1,234</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#EF233C]/10 rounded-lg">
                                        <Trophy className="h-6 w-6 text-[#EF233C]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Completed Events</p>
                                        <p className="text-2xl font-bold text-[#2B2D42]">8</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#8D99AE]/10 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-[#8D99AE]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">This Month</p>
                                        <p className="text-2xl font-bold text-[#2B2D42]">4</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Recent Events</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-[#2B2D42]">Morning 5K Run</p>
                                            <p className="text-sm text-[#8D99AE]">Dec 15, 2024</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[#FF9F1C]/10 text-[#FF9F1C] rounded-full text-sm">
                                            Upcoming
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-[#2B2D42]">City Marathon</p>
                                            <p className="text-sm text-[#8D99AE]">Nov 28, 2024</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[#EF233C]/10 text-[#EF233C] rounded-full text-sm">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-[#2B2D42]">Fun Run 2024</p>
                                            <p className="text-sm text-[#8D99AE]">Nov 20, 2024</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[#EF233C]/10 text-[#EF233C] rounded-full text-sm">
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 bg-[#FF9F1C]/5 hover:bg-[#FF9F1C]/10 border border-[#FF9F1C]/20 rounded-lg transition-colors">
                                        <p className="font-medium text-[#2B2D42]">Create New Event</p>
                                        <p className="text-sm text-[#8D99AE]">Set up a new running event</p>
                                    </button>
                                    <button className="w-full text-left p-3 bg-[#2B2D42]/5 hover:bg-[#2B2D42]/10 border border-[#2B2D42]/20 rounded-lg transition-colors">
                                        <p className="font-medium text-[#2B2D42]">Manage Participants</p>
                                        <p className="text-sm text-[#8D99AE]">View and edit registrations</p>
                                    </button>
                                    <button className="w-full text-left p-3 bg-[#8D99AE]/5 hover:bg-[#8D99AE]/10 border border-[#8D99AE]/20 rounded-lg transition-colors">
                                        <p className="font-medium text-[#2B2D42]">Generate Reports</p>
                                        <p className="text-sm text-[#8D99AE]">Export event data and analytics</p>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}