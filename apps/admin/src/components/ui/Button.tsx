import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "danger" | "ghost"
    size?: "sm" | "md" | "lg"
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
                    {
                        "px-3 py-1.5 text-sm rounded-md": size === "sm",
                        "px-6 py-3 text-base rounded-lg": size === "md",
                        "px-8 py-4 text-lg rounded-xl": size === "lg",
                    },
                    {
                        "bg-white text-black hover:bg-gray-100 focus:ring-white shadow-lg hover:shadow-xl transform hover:scale-105":
                            variant === "primary",
                        "bg-transparent border-2 border-gray-600 text-gray-200 hover:border-white hover:text-white focus:ring-gray-500":
                            variant === "secondary",
                        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-lg hover:shadow-xl":
                            variant === "accent",
                        "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg":
                            variant === "danger",
                        "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-600":
                            variant === "ghost",
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                ref={ref}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"

export { Button }