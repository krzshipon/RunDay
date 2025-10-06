import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "feature" | "glass"
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Base styles
                    "rounded-xl p-6 transition-all duration-300",

                    // Variant styles
                    {
                        // Default - Subtle card
                        "bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700":
                            variant === "default",

                        // Elevated - Card with shadow and hover effect
                        "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl hover:shadow-3xl transform hover:scale-105":
                            variant === "elevated",

                        // Feature - Special accent card
                        "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/50 backdrop-blur-sm":
                            variant === "feature",

                        // Glass - Ultra modern glass effect
                        "bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl":
                            variant === "glass",
                    },

                    className
                )}
                {...props}
            />
        )
    }
)

Card.displayName = "Card"

const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-xl font-semibold text-white", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-gray-400", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
}