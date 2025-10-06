import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "success" | "warning" | "danger" | "info" | "neutral"
    size?: "sm" | "md" | "lg"
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "neutral", size = "md", ...props }, ref) => {
        const getBadgeStyles = () => {
            switch (variant) {
                case "success":
                    return { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981', color: '#10B981' }
                case "warning":
                    return { backgroundColor: 'rgba(255, 159, 28, 0.2)', borderColor: '#FF9F1C', color: '#FF9F1C' }
                case "danger":
                    return { backgroundColor: 'rgba(239, 35, 60, 0.2)', borderColor: '#EF233C', color: '#EF233C' }
                case "info":
                    return { backgroundColor: 'rgba(141, 153, 174, 0.2)', borderColor: '#8D99AE', color: '#8D99AE' }
                case "neutral":
                    return { backgroundColor: 'rgba(43, 45, 66, 0.2)', borderColor: '#2B2D42', color: '#EDF2F4' }
                default:
                    return { backgroundColor: 'rgba(43, 45, 66, 0.2)', borderColor: '#2B2D42', color: '#EDF2F4' }
            }
        }

        return (
            <div
                ref={ref}
                style={getBadgeStyles()}
                className={cn(
                    "inline-flex items-center font-medium rounded-full border",
                    {
                        "px-2 py-1 text-xs": size === "sm",
                        "px-3 py-1 text-sm": size === "md",
                        "px-4 py-2 text-base": size === "lg",
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