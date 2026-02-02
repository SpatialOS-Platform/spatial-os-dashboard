import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
            </div>

            <Sidebar className="hidden md:flex flex-shrink-0 z-20" />

            <main className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
                <Header />
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
