interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundColor: '#EDF2F4', // Fallback background
                background: 'linear-gradient(135deg, #EDF2F4 0%, rgba(141, 153, 174, 0.2) 100%)',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}