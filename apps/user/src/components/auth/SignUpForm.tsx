'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Card } from '@runday/ui';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
}

export function SignUpForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpData>();

    const password = watch('password');

    const onSubmit = async (data: SignUpData) => {
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!data.email || !data.password || !data.fullName) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (data.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            setEmailSent(true);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <Card variant="glass" className="w-full max-w-md">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#EDF2F4]">Check Your Email</h1>
                        <p className="mt-2 text-[#8D99AE]">
                            We&apos;ve sent you a verification link. Please check your email and click the link to activate your account.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm">
                            <p className="text-sm text-green-400 text-center">
                                After clicking the verification link, you&apos;ll be redirected to sign in.
                            </p>
                        </div>

                        <Link href="/auth/signin">
                            <Button className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="glass" className="w-full max-w-md">
            <div className="p-6">
                <div className="text-center mb-6">
                    {/* Logo inside card */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF9F1C] rounded-full mb-4">
                        <span className="text-2xl font-bold text-white">R</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#EDF2F4]">Join RunDay</h1>
                    <p className="mt-2 text-[#8D99AE]">Create your account to start running</p>
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
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D99AE]" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="flex w-full px-4 py-3 pl-10 transition-all duration-200 focus:outline-none border rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                                    borderColor: '#8D99AE',
                                    color: '#EDF2F4',
                                }}
                                {...register('fullName', { required: 'Full name is required' })}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-[#EF233C]">{errors.fullName.message}</p>
                        )}
                    </div>

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
                                {...register('email', { required: 'Email is required' })}
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
                                placeholder="Create a password"
                                className="flex w-full px-4 py-3 pl-10 transition-all duration-200 focus:outline-none border rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                                    borderColor: '#8D99AE',
                                    color: '#EDF2F4',
                                }}
                                {...register('password', { required: 'Password is required' })}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-[#EF233C]">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D99AE]" />
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="flex w-full px-4 py-3 pl-10 transition-all duration-200 focus:outline-none border rounded-lg"
                                style={{
                                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                                    borderColor: errors.confirmPassword || (password && password !== watch('confirmPassword')) ? '#EF233C' : '#8D99AE',
                                    color: '#EDF2F4',
                                }}
                                {...register('confirmPassword', { required: 'Please confirm your password' })}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-[#EF233C]">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <div className="text-center">
                        <span className="text-[#8D99AE]">Already have an account? </span>
                        <Link href="/auth/signin" className="text-[#FF9F1C] hover:text-[#FF9F1C]/80 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </Card>
    );
}