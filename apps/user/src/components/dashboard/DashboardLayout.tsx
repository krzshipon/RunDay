'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import {
    DashboardLayout as BaseDashboardLayout,
    createUserDashboardConfig,
    DashboardConfig
} from '@runday/dashboard';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, signOut } = useAuth();

    if (!user) {
        return null; // This should be handled by ProtectedRoute
    }

    // Create user dashboard configuration
    const dashboardConfig: DashboardConfig = {
        ...createUserDashboardConfig(
            {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email,
            },
            signOut
        ),
    } as DashboardConfig;

    return (
        <BaseDashboardLayout config={dashboardConfig}>
            {children}
        </BaseDashboardLayout>
    );
}