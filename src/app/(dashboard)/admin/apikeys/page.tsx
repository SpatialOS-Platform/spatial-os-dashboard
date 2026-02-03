'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Key, Copy, XCircle, Plus } from 'lucide-react';

interface ApiKey {
    key_id: string;
    key: string;
    tier: string;
    is_active: boolean;
    requests_usage_current_month: number;
    requests_limit_month: number;
    created_at: string;
    principal?: {
        display_name?: string;
        email?: string;
    };
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [users, setUsers] = useState<{ principal_id: string; display_name?: string; email?: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedTier, setSelectedTier] = useState('free');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            const data = await admin.getKeys();
            setKeys(data);
        } catch (e) {
            console.error('Failed to fetch keys', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await admin.getUsers();
            setUsers(data);
            if (data.length > 0) setSelectedUser(data[0].principal_id);
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
    };

    useEffect(() => {
        fetchKeys();
        fetchUsers();
    }, []);

    const handleCreateKey = async () => {
        if (!selectedUser) return;
        setCreating(true);
        try {
            await admin.createKey({ owner_id: selectedUser, tier: selectedTier });
            await fetchKeys();
        } catch (e) {
            console.error('Failed to create key', e);
        } finally {
            setCreating(false);
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm('Are you sure you want to revoke this key?')) return;
        try {
            await admin.revokeKey(keyId);
            await fetchKeys();
        } catch (e) {
            console.error('Failed to revoke key', e);
        }
    };

    const copyToClipboard = (key: string, keyId: string) => {
        navigator.clipboard.writeText(key);
        setCopiedId(keyId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const maskKey = (key: string) => {
        return key.substring(0, 7) + '...' + key.substring(key.length - 4);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display flex items-center gap-3">
                        <Key className="w-8 h-8" />
                        API Keys
                    </h2>
                    <p className="text-gray-400">Manage API keys for external clients and integrations.</p>
                </div>
            </div>

            {/* Create Key Section */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Create New Key</h3>
                <div className="flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Owner</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white min-w-[200px]"
                        >
                            {users.map((user) => (
                                <option key={user.principal_id} value={user.principal_id}>
                                    {user.display_name || user.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Tier</label>
                        <select
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="free">Free (1,000/mo)</option>
                            <option value="pro">Pro (10,000/mo)</option>
                            <option value="enterprise">Enterprise (Unlimited)</option>
                        </select>
                    </div>
                    <Button onClick={handleCreateKey} disabled={creating || !selectedUser}>
                        <Plus className="w-4 h-4 mr-2" />
                        {creating ? 'Creating...' : 'Create Key'}
                    </Button>
                </div>
            </div>

            {/* Keys Table */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : keys.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No API keys found. Create one above.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map((k) => (
                                <TableRow key={k.key_id}>
                                    <TableCell className="font-mono text-sm">
                                        {maskKey(k.key)}
                                        <button
                                            onClick={() => copyToClipboard(k.key, k.key_id)}
                                            className="ml-2 p-1 hover:bg-white/10 rounded"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        </button>
                                        {copiedId === k.key_id && (
                                            <span className="ml-2 text-green-400 text-xs">Copied!</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {k.principal?.display_name || k.principal?.email || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${k.tier === 'enterprise' ? 'bg-purple-500/20 text-purple-300' :
                                            k.tier === 'pro' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {k.tier}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {k.requests_usage_current_month} / {k.requests_limit_month}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${k.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                            {k.is_active ? 'Active' : 'Revoked'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {k.is_active && (
                                            <button
                                                onClick={() => handleRevokeKey(k.key_id)}
                                                className="p-2 hover:bg-red-500/20 rounded text-red-400"
                                                title="Revoke key"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
