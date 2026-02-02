"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Shield, User } from "lucide-react";

const MOCK_USERS = [
    { id: 1, name: "Alice Freeman", email: "alice@spatial.io", role: "Admin", status: "Active", lastActive: "Just now" },
    { id: 2, name: "Bob Constructor", email: "bob@builder.com", role: "Developer", status: "Active", lastActive: "2 hours ago" },
    { id: 3, name: "Charlie Viewer", email: "charlie@guest.com", role: "Viewer", status: "Inactive", lastActive: "3 days ago" },
    { id: 4, name: "Dave Operator", email: "dave@ops.io", role: "Operator", status: "Active", lastActive: "5 mins ago" },
    { id: 5, name: "Eve Monitor", email: "eve@security.com", role: "Viewer", status: "Suspended", lastActive: "1 week ago" },
];

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold">User Management</h2>
                    <p className="text-muted-foreground mt-1">Control access permissions across your organization.</p>
                </div>
                <Button>Invite User</Button>
            </div>

            <div className="glass-card p-1 rounded-2xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_USERS.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {user.role === "Admin" ? <Shield className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-muted-foreground" />}
                                        <span className={user.role === "Admin" ? "text-purple-400 font-medium" : ""}>{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-500/10 text-green-500" :
                                            user.status === "Suspended" ? "bg-red-500/10 text-red-500" :
                                                "bg-white/5 text-muted-foreground"
                                        }`}>
                                        {user.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">{user.lastActive}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
