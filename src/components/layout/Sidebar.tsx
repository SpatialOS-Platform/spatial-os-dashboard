"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
    LayoutDashboard,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Hexagon,
    Layers,
    QrCode,
    Search,
    Download,
    MapPin
} from "lucide-react";
import { logout } from "@/lib/auth";

const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Users", href: "/users", icon: Users },
    { label: "Spaces", href: "/spaces", icon: MapPin },
    { label: "Layers", href: "/admin/layers", icon: Layers },
    { label: "Anchor Search", href: "/admin/search", icon: Search },
    { label: "QR Generator", href: "/admin/qrcode", icon: QrCode },
    { label: "Import/Export", href: "/admin/import-export", icon: Download },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col h-full w-64 glass border-r border-glass-border pt-6 pb-4 transition-all duration-300", className)}>
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <Hexagon className="w-6 h-6 text-primary fill-primary/20" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">Spatial<span className="text-primary">Admin</span></span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 mt-auto">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
