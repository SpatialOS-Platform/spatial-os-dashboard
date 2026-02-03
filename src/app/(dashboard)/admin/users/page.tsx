'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface User {
    principal_id: string;
    display_name?: string;
    email?: string;
    role?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await admin.getUsers();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Unexpected data format:', data);
                setError('Received invalid data format from API');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async (userId: string) => {
        try {
            const key = await admin.createKey({ owner_id: userId, tier: 'pro' });
            alert(`API Key Created: ${key.key}`);
            loadUsers();
        } catch (err) {
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to create key'}`);
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {users.map(user => (
                            <tr key={user.principal_id} className="border-t border-white/5">
                                <td className="p-4">{user.display_name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Button size="sm" onClick={() => handleCreateKey(user.principal_id)}>
                                        Generate API Key
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
