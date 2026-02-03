'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

// Heatmap data is placeholder for future implementation
interface HeatmapPoint {
    x: number;
    y: number;
    value: number;
}

export function AnalyticsCharts() {
    // Mock data for demo since real data is scarce
    const timeSeriesData = [
        { name: '00:00', users: 12, events: 45 },
        { name: '04:00', users: 8, events: 30 },
        { name: '08:00', users: 24, events: 120 },
        { name: '12:00', users: 45, events: 380 },
        { name: '16:00', users: 55, events: 410 },
        { name: '20:00', users: 30, events: 200 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Activity Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="users" stroke="#8884d8" />
                            <Line type="monotone" dataKey="events" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Interaction Types</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'View', count: 120 },
                            { name: 'Click', count: 80 },
                            { name: 'Dwell', count: 45 },
                            { name: 'Trigger', count: 30 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
