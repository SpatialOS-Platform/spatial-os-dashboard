
'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Box, Database, Users } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({ spaces: 0, anchors: 0, users: 0, latency_ms: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await admin.getStats();
                setStats({
                    spaces: data.spaces || 0,
                    anchors: data.anchors || 0,
                    users: data.users || 0,
                    latency_ms: 24
                });
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-display">Overview</h2>
                <p className="text-gray-400">Real-time metrics from your spatial cloud.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Active Spaces" value={stats.spaces.toString()} icon={Box} trend="+2.5%" />
                <StatCard title="Total Anchors" value={stats.anchors.toString()} icon={Database} trend="+12%" />
                <StatCard title="Registered Users" value={stats.users.toString()} icon={Users} trend="+4" />
                <StatCard title="Avg Latency" value={`${stats.latency_ms}ms`} icon={Activity} trend="-1.2%" />
            </div>

            {/* Placeholder Chart Area */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm h-[300px] flex items-center justify-center text-gray-400">
                    Activity Chart (Coming Soon)
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm h-[300px] flex items-center justify-center text-gray-400">
                    Storage Usage (Coming Soon)
                </div>
            </div>
        </div>
    );
}
