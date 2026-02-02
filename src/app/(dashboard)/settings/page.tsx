"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Key, Plus, Trash2, Copy } from "lucide-react";

interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
}

const MOCK_KEYS: ApiKey[] = [
    { id: "1", name: "Development Key", prefix: "sk_live_...", created: "2023-10-15", lastUsed: "2 mins ago" },
    { id: "2", name: "Staging Cluster", prefix: "sk_test_...", created: "2023-11-02", lastUsed: "1 day ago" },
];

export default function SettingsPage() {
    const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateKey = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const newKey: ApiKey = {
                id: Math.random().toString(36).substr(2, 9),
                name: `New Key ${keys.length + 1}`,
                prefix: "sk_live_...",
                created: new Date().toISOString().split("T")[0],
                lastUsed: "Never",
            };
            setKeys([...keys, newKey]);
            setIsGenerating(false);
        }, 1000);
    };

    const deleteKey = (id: string) => {
        setKeys(keys.filter((k) => k.id !== id));
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold">Settings & Keys</h2>
                    <p className="text-muted-foreground mt-1">Manage access tokens for the Spatial API.</p>
                </div>
                <Button onClick={generateKey} isLoading={isGenerating}>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                </Button>
            </div>

            <div className="glass-card p-1 rounded-2xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Token Prefix</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {keys.map((key) => (
                            <TableRow key={key.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    {key.name}
                                </TableCell>
                                <TableCell>
                                    <code className="px-2 py-1 rounded bg-white/5 font-mono text-xs">{key.prefix}</code>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{key.created}</TableCell>
                                <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Copy Key">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteKey(key.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* billing section placeholder */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 mt-8">
                <h3 className="text-xl font-bold mb-4">Plan & Billing</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                        <p className="font-medium">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">Unlimited anchors, 1M API calls/mo</p>
                    </div>
                    <Button variant="outline">Manage Subscription</Button>
                </div>
            </div>
        </div>
    );
}
