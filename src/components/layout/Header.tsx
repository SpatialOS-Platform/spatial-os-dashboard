"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Bell, Search, UserCircle } from "lucide-react";

export function Header({ className }: { className?: string }) {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const pageName = pathname === "/" ? "Overview" : pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1);

    return (
        <header className={cn("h-16 px-8 flex items-center justify-between glass border-b border-glass-border sticky top-0 z-50", className)}>
            <div className="flex flex-col justify-center">
                <h1 className="font-display font-semibold text-lg">{pageName}</h1>
                <p className="text-xs text-muted-foreground hidden md:block">Manage your spatial cloud infrastructure</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="h-10 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm w-64 transition-all"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

                    <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20">
                            AD
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium leading-none">Admin User</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Spatial Operations</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
