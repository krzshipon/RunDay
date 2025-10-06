import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button } from '@runday/ui';
import { Calendar, MapPin, Trophy, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Welcome to RunDay</h1>
                        <p className="text-slate-300 text-lg">Discover and join amazing running events</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-[#FF9F1C] to-amber-500 rounded-xl shadow-lg">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Upcoming Events</p>
                                    <p className="text-2xl font-bold text-white">3</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Completed</p>
                                    <p className="text-2xl font-bold text-white">12</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Total Distance</p>
                                    <p className="text-2xl font-bold text-white">45km</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-slate-300 mr-3" />
                                    <div>
                                        <p className="font-medium text-white">Morning 5K Run</p>
                                        <p className="text-sm text-slate-300">Dec 15, 2024 • Central Park</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-gradient-to-r from-[#FF9F1C] to-amber-500 text-white rounded-full text-sm shadow-md">
                                    Registered
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-slate-300 mr-3" />
                                    <div>
                                        <p className="font-medium text-white">Winter Marathon</p>
                                        <p className="text-sm text-slate-300">Jan 20, 2025 • City Center</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg"
                                >
                                    Register
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200">
                                <div>
                                    <p className="font-medium text-white">City Marathon</p>
                                    <p className="text-sm text-slate-300">Completed • Nov 28, 2024</p>
                                </div>
                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
                                    2:45:30
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200">
                                <div>
                                    <p className="font-medium text-white">Fun Run 2024</p>
                                    <p className="text-sm text-slate-300">Completed • Nov 20, 2024</p>
                                </div>
                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
                                    25:15
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}