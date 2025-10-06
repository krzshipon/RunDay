import { AuthLayout } from '@/components/auth/AuthLayout';
import { Card, Button } from '@runday/ui';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
    return (
        <AuthLayout>
            <Card variant="glass" className="w-full max-w-md">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF9F1C] rounded-full mb-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#EDF2F4]">Check Your Email</h1>
                        <p className="mt-2 text-[#8D99AE]">
                            Please verify your email address to access your account
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 rounded-lg backdrop-blur-sm">
                            <p className="text-sm text-[#FF9F1C] text-center">
                                We sent a verification link to your email. Click the link to verify your account.
                            </p>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-[#8D99AE]">
                                Didn't receive the email? Check your spam folder or contact support.
                            </p>

                            <Link href="/auth/signin">
                                <Button className="w-full">
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </AuthLayout>
    );
}