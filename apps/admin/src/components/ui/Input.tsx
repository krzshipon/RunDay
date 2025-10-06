import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "elegant"
    isError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = "default", isError, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base styles
                    "flex w-full px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",

                    // Variant styles
                    {
                        // Default input
                        "bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500":
                            variant === "default",

                        // Elegant input with more sophisticated styling
                        "bg-gray-950/50 border border-gray-800 rounded-xl backdrop-blur-sm focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-gray-900/50":
                            variant === "elegant",
                    },

                    // Error states
                    {
                        "border-red-500 focus:border-red-500 focus:ring-red-500": isError,
                    },

                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }