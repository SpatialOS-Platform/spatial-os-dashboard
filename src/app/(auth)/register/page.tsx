
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await auth.register({ username: displayName, email, password });
            // Redirect to login
            router.push('/login');
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
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-400">Join the Spatial Cloud</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <Input
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <Input
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" isLoading={isLoading}>
                        Sign Up
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">Already have an account? </span>
                    <Link href="/login" className="text-white hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}
