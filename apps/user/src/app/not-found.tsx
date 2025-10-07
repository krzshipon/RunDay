import Link from 'next/link';
import { Button } from '@runday/ui';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">Page not found</p>
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    );
}