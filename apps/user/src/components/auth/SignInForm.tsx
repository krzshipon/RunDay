'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Card } from '@runday/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
                if (signInError.message.includes('Email not confirmed')) {
                    setError('Please check your email and click the verification link before signing in.');
                } else {
                    setError(signInError.message);
                }
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
                    <h1 className="text-2xl font-bold text-[#EDF2F4]">Welcome Back</h1>
                    <p className="mt-2 text-[#8D99AE]">Sign in to your RunDay account</p>
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
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="flex w-full px-4 py-3 pl-10 transition-all duration-200 focus:outline-none border rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                                    borderColor: '#8D99AE',
                                    color: '#EDF2F4',
                                }}
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
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="flex w-full px-4 py-3 pl-10 transition-all duration-200 focus:outline-none border rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                                    borderColor: '#8D99AE',
                                    color: '#EDF2F4',
                                }}
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

                    <div className="text-center space-y-2">
                        <Link href="/auth/forgot-password" className="text-[#8D99AE] hover:text-[#FF9F1C] transition-colors text-sm block">
                            Forgot your password?
                        </Link>
                        <div>
                            <span className="text-[#8D99AE]">Don't have an account? </span>
                            <Link href="/auth/signup" className="text-[#FF9F1C] hover:text-[#FF9F1C]/80 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </Card>
    );
}