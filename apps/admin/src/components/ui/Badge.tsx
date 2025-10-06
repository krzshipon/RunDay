import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "success" | "warning" | "danger" | "info" | "neutral"
    size?: "sm" | "md" | "lg"
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "neutral", size = "md", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Base styles
                    "inline-flex items-center font-medium rounded-full border",

                    // Size variants
                    {
                        "px-2 py-1 text-xs": size === "sm",
                        "px-3 py-1 text-sm": size === "md",
                        "px-4 py-2 text-base": size === "lg",
                    },

                    // Variant styles with elegant dark theme
                    {
                        // Success - Green
                        "bg-green-900/30 border-green-700 text-green-300": variant === "success",

                        // Warning - Yellow/Orange
                        "bg-yellow-900/30 border-yellow-700 text-yellow-300": variant === "warning",

                        // Danger - Red
                        "bg-red-900/30 border-red-700 text-red-300": variant === "danger",

                        // Info - Blue
                        "bg-blue-900/30 border-blue-700 text-blue-300": variant === "info",

                        // Neutral - Gray
                        "bg-gray-800/30 border-gray-600 text-gray-300": variant === "neutral",
                    },

                    className
                )}
                {...props}
            />
        )
    }
)
Badge.displayName = "Badge"

export { Badge }

// Utility function to get badge variant from status
export function getStatusBadgeVariant(status: string): BadgeProps['variant'] {
    switch (status.toLowerCase()) {
        case 'active':
        case 'confirmed':
        case 'completed':
            return 'success'
        case 'pending':
        case 'waiting':
        case 'upcoming':
            return 'warning'
        case 'cancelled':
        case 'inactive':
        case 'expired':
            return 'danger'
        case 'draft':
        case 'review':
            return 'info'
        default:
            return 'neutral'
    }
}