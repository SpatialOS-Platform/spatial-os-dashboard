
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get('email') || '';

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3000/v1/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Verification failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            // safe check if user object exists
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div className="space-y-4">
                <Input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                <Input
                    placeholder="6-Digit OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-center tracking-[0.5em] text-xl"
                />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" isLoading={isLoading}>
                Verify & Login
            </Button>
        </form>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="w-full max-w-md space-y-8 p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display">Verify Email</h2>
                    <p className="mt-2 text-sm text-gray-400">Check your console for the Mock OTP</p>
                </div>

                <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
                    <VerifyForm />
                </Suspense>
            </div>
        </div>
    );
}
