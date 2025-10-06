'use client';

import { useState, useEffect } from 'react';
// Import Button and Card components - adjust path as needed
// import { Button } from './button';
// import { Card } from './card';

// For now, using basic interfaces to avoid import issues in the package
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
    <button className={`btn ${className}`} {...props}>{children}</button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`card ${className}`}>{children}</div>
);

// Note: This component should be used in the actual apps where @runday/auth is available
// This is a template component that demonstrates the role management UI

interface UserProfile {
    id: string;
    full_name: string | null;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

interface RoleManagementPanelProps {
    // These would be passed from the parent component that has access to auth
    users: UserProfile[];
    currentUser: { id: string } | null;
    isAdmin: boolean;
    loading?: boolean;
    onRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
    onRefresh: () => void;
    error?: string | null;
}
import { Shield, Users, Crown, User } from 'lucide-react';

export function RoleManagementPanel({
    users,
    currentUser,
    isAdmin,
    loading = false,
    onRoleChange,
    onRefresh,
    error = null
}: RoleManagementPanelProps) {
    const [updating, setUpdating] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
        try {
            setUpdating(userId);
            await onRoleChange(userId, newRole);
        } catch (err) {
            // Error handling is done by parent component
        } finally {
            setUpdating(null);
        }
    };

    if (!isAdmin) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center text-red-600">
                    <Shield className="h-6 w-6 mr-2" />
                    <span>Admin access required</span>
                </div>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF9F1C]"></div>
                    <span className="ml-2">Loading users...</span>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center mb-6">
                <Users className="h-6 w-6 mr-2 text-[#FF9F1C]" />
                <h3 className="text-lg font-semibold">User Role Management</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-3">
                {users.map((userData) => (
                    <div
                        key={userData.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex items-center">
                            {userData.role === 'admin' ? (
                                <Crown className="h-5 w-5 text-[#FF9F1C] mr-3" />
                            ) : (
                                <User className="h-5 w-5 text-gray-400 mr-3" />
                            )}
                            <div>
                                <p className="font-medium">{userData.full_name || 'Unknown User'}</p>
                                <p className="text-sm text-gray-500">ID: {userData.id.slice(0, 8)}...</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${userData.role === 'admin'
                                    ? 'bg-[#FF9F1C]/10 text-[#FF9F1C]'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {userData.role.toUpperCase()}
                            </span>

                            {userData.id !== currentUser?.id && ( // Prevent self-demotion
                                <Button
                                    size="sm"
                                    variant={userData.role === 'admin' ? 'secondary' : 'primary'}
                                    onClick={() => handleRoleChange(
                                        userData.id,
                                        userData.role === 'admin' ? 'user' : 'admin'
                                    )}
                                    disabled={updating === userData.id}
                                >
                                    {updating === userData.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    ) : (
                                        userData.role === 'admin' ? 'Demote' : 'Promote'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t">
                <Button
                    variant="secondary"
                    onClick={onRefresh}
                    disabled={loading}
                    size="sm"
                >
                    Refresh Users
                </Button>
            </div>
        </Card>
    );
}