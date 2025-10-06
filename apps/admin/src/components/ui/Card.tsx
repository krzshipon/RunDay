import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "feature" | "glass"
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const getCardStyles = () => {
            switch (variant) {
                case "default":
                    return {
                        backgroundColor: 'rgba(43, 45, 66, 0.3)',
                        borderColor: '#8D99AE',
                        backdropFilter: 'blur(10px)'
                    }
                case "elevated":
                    return {
                        background: 'linear-gradient(135deg, #2B2D42 0%, rgba(43, 45, 66, 0.8) 100%)',
                        borderColor: '#8D99AE'
                    }
                case "feature":
                    return {
                        background: 'linear-gradient(135deg, rgba(255, 159, 28, 0.1) 0%, rgba(239, 35, 60, 0.1) 100%)',
                        borderColor: '#FF9F1C',
                        backdropFilter: 'blur(10px)'
                    }
                case "glass":
                    return {
                        backgroundColor: 'rgba(237, 242, 244, 0.1)',
                        borderColor: 'rgba(237, 242, 244, 0.2)',
                        backdropFilter: 'blur(20px)'
                    }
                default:
                    return { backgroundColor: 'rgba(43, 45, 66, 0.3)', borderColor: '#8D99AE' }
            }
        }

        return (
            <div
                ref={ref}
                style={getCardStyles()}
                className={cn(
                    "rounded-xl p-6 border transition-all duration-300",
                    {
                        "hover:border-opacity-80": variant === "default",
                        "shadow-2xl hover:shadow-3xl transform hover:scale-105": variant === "elevated",
                        "": variant === "feature",
                        "shadow-2xl": variant === "glass",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)

Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 pb-4", className)}
            {...props}
        />
    )
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("text-xl font-semibold", className)}
            style={{ color: '#EDF2F4' }}
            {...props}
        />
    )
)
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("", className)}
            style={{ color: '#8D99AE' }}
            {...props}
        />
    )
)
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
)
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center pt-4", className)}
            {...props}
        />
    )
)
CardFooter.displayName = "CardFooter"

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
}