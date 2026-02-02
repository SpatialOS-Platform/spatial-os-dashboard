"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "destructive" | "outline" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] transition-transform",
                    {
                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25": variant === "default",
                        "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25": variant === "destructive",
                        "border border-white/10 bg-transparent hover:bg-white/5 hover:text-foreground text-foreground": variant === "outline",
                        "bg-white/10 text-foreground hover:bg-white/20 hover:text-white": variant === "secondary",
                        "bg-transparent hover:bg-white/5 text-foreground": variant === "ghost",
                        "h-10 px-4 py-2": size === "default",
                        "h-8 rounded-lg px-3 text-xs": size === "sm",
                        "h-12 rounded-2xl px-8 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
