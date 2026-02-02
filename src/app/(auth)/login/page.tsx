
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';
import { auth } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await auth.login({ username: email, password }); // Using email as username for now or we change backend to accept email
            login(data.token, { ...data, email }); // Mocking user object structure for now
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="w-full max-w-md space-y-8 p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-400">Enter your credentials to access the Spatial Cloud</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <Input
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={otpSent}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />

                        {!isOtpMode ? (
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        ) : otpSent && (
                            <Input
                                placeholder="One-Time Password"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-center tracking-widest"
                            />
                        )}
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" isLoading={isLoading}>
                        {isOtpMode ? (otpSent ? 'Verify & Login' : 'Send OTP') : 'Sign In'}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => { setIsOtpMode(!isOtpMode); setOtpSent(false); setError(''); }}
                            className="text-sm text-gray-400 hover:text-white underline"
                        >
                            {isOtpMode ? 'Use Password' : 'Login with OTP'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">First time? </span>
                    <Link href="/register" className="text-white hover:underline">Create Access Point</Link>
                </div>
            </div>
        </div>
    );
}
