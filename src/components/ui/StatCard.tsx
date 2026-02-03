import * as React from "react"
import { cn } from "@/lib/cn"
import { LucideIcon } from "lucide-react"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    value: string
    icon: LucideIcon
    trend?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({ className, title, value, icon: Icon, trend, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    {trend && (
                        <p className={cn(
                            "text-xs mt-2",
                            trend.startsWith("+") ? "text-green-400" :
                                trend.startsWith("-") ? "text-red-400" : "text-gray-400"
                        )}>
                            {trend}
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-lg bg-white/10">
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    )
)
StatCard.displayName = "StatCard"

export { StatCard }
