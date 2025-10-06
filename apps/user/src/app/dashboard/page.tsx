import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button } from '@runday/ui';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        {/* Welcome Section */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-[#2B2D42] mb-2">Welcome to RunDay</h1>
                            <p className="text-[#8D99AE]">Discover and join amazing running events</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-[#FF9F1C]/10 rounded-lg">
                                            <Calendar className="h-6 w-6 text-[#FF9F1C]" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-[#8D99AE]">Upcoming Events</p>
                                            <p className="text-2xl font-bold text-[#2B2D42]">3</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-[#2B2D42]/10 rounded-lg">
                                            <Trophy className="h-6 w-6 text-[#2B2D42]" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-[#8D99AE]">Completed</p>
                                            <p className="text-2xl font-bold text-[#2B2D42]">12</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-[#EF233C]/10 rounded-lg">
                                            <Users className="h-6 w-6 text-[#EF233C]" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-[#8D99AE]">Total Distance</p>
                                            <p className="text-2xl font-bold text-[#2B2D42]">45km</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Upcoming Events */}
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Upcoming Events</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[#EDF2F4] rounded-lg">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-[#8D99AE] mr-3" />
                                            <div>
                                                <p className="font-medium text-[#2B2D42]">Morning 5K Run</p>
                                                <p className="text-sm text-[#8D99AE]">Dec 15, 2024 • Central Park</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-[#FF9F1C]/10 text-[#FF9F1C] rounded-full text-sm">
                                            Registered
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[#EDF2F4] rounded-lg">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-[#8D99AE] mr-3" />
                                            <div>
                                                <p className="font-medium text-[#2B2D42]">Winter Marathon</p>
                                                <p className="text-sm text-[#8D99AE]">Jan 20, 2025 • City Center</p>
                                            </div>
                                        </div>
                                        <Button size="sm">
                                            Register
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-[#2B2D42]">City Marathon</p>
                                            <p className="text-sm text-[#8D99AE]">Completed • Nov 28, 2024</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[#EF233C]/10 text-[#EF233C] rounded-full text-sm">
                                            2:45:30
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-[#2B2D42]">Fun Run 2024</p>
                                            <p className="text-sm text-[#8D99AE]">Completed • Nov 20, 2024</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[#EF233C]/10 text-[#EF233C] rounded-full text-sm">
                                            25:15
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}