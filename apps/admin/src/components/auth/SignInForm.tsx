'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '@runday/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SignInData {
    email: string;
    password: string;
}

export function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInData>();

    const onSubmit = async (data: SignInData) => {
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!data.email || !data.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (data.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Authentication failed. Please try again.');
                return;
            }

            // Check if user is admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileError) {
                setError('Failed to verify user permissions. Please try again.');
                console.error('Profile query error:', profileError);
                await supabase.auth.signOut();
                return;
            }

            if (profile?.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                await supabase.auth.signOut();
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card variant="glass" className="w-full max-w-md">
            <div className="p-6">
                <div className="text-center mb-6">
                    {/* Logo inside card */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF9F1C] rounded-full mb-4">
                        <span className="text-2xl font-bold text-white">R</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#EDF2F4]">RunDay Admin Sign In</h1>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 mb-4 text-sm text-[#EF233C] bg-[#EF233C]/10 border border-[#EF233C]/30 rounded-lg backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D99AE]" />
                            <Input
                                type="email"
                                placeholder="admin@runday.com"
                                variant="elegant"
                                className="pl-10"
                                defaultValue="krz.shipon1@gmail.com"
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-[#EF233C]">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D99AE]" />
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                variant="elegant"
                                className="pl-10"
                                defaultValue="101299_Shipon"
                                {...register('password')}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-[#EF233C]">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </Card>
    );
}