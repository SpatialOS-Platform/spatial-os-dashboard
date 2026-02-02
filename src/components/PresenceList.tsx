'use client';

import { useEffect, useState } from 'react';
import { Users, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

interface PresenceUser {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    position: { x: number; y: number; z: number };
    last_seen: string;
}

interface PresenceData {
    space_id: string;
    count: number;
    users: PresenceUser[];
}

export function PresenceList({ spaceId }: { spaceId: string }) {
    const [data, setData] = useState<PresenceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPresence = async () => {
            try {
                // Use environment variable for API URL in production
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
                const res = await fetch(`${API_URL}/presence/spaces/${spaceId}/users`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch presence', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPresence();
        const interval = setInterval(fetchPresence, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [spaceId]);

    if (loading && !data) {
        return <div className="animate-pulse h-20 bg-muted rounded-md" />;
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Active Users ({data?.count || 0})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data?.users.map((user) => (
                        <div key={user.user_id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url || ''} />
                                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">{user.display_name || 'Anonymous'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {user.position.x.toFixed(1)}, {user.position.z.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-2 w-2 rounded-full bg-green-500" />
                        </div>
                    ))}
                    {(!data?.users || data.users.length === 0) && (
                        <p className="text-xs text-muted-foreground">No users active in the last minute.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
