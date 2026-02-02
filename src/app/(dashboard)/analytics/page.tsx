"use client";

import { Activity, Database, Globe, Server } from "lucide-react";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold">Analytics</h2>
                    <p className="text-muted-foreground mt-1">Deep dive into your spatial performance metrics.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors">
                        Export CSV
                    </button>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col min-h-[400px]">
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-primary" />
                        Platform Activity
                    </h3>
                    <div className="flex-1 w-full">
                        <AnalyticsCharts />
                    </div>
                </div>

                {/* Side Stats */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl h-[calc(50%-12px)] flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-12 group-hover:bg-blue-500/20 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                <Server className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Avg Latency</span>
                            </div>
                            <p className="text-4xl font-display font-bold">24ms</p>
                            <p className="text-sm text-muted-foreground mt-1">Global edge response time</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl h-[calc(50%-12px)] flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-12 group-hover:bg-purple-500/20 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-purple-400 mb-2">
                                <Database className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Storage</span>
                            </div>
                            <p className="text-4xl font-display font-bold">1.2 TB</p>
                            <p className="text-sm text-muted-foreground mt-1">3D Assets & Point Clouds</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-green-500" />
                    Geographic Distribution
                </h3>
                <div className="w-full h-[300px] rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-muted-foreground">
                    [Interactive Map: User & Anchor Locations]
                </div>
            </div>

        </div>
    );
}
