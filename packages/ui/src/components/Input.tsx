import { cn } from "../lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "elegant"
    isError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = "default", isError, type, ...props }, ref) => {
        const getInputStyles = () => {
            if (isError) {
                return {
                    backgroundColor: 'rgba(43, 45, 66, 0.3)',
                    borderColor: '#EF233C',
                    color: '#EDF2F4'
                }
            }

            switch (variant) {
                case "default":
                    return {
                        backgroundColor: 'rgba(43, 45, 66, 0.5)',
                        borderColor: '#8D99AE',
                        color: '#EDF2F4'
                    }
                case "elegant":
                    return {
                        backgroundColor: 'rgba(43, 45, 66, 0.3)',
                        borderColor: '#8D99AE',
                        color: '#EDF2F4',
                        backdropFilter: 'blur(10px)'
                    }
                default:
                    return {
                        backgroundColor: 'rgba(43, 45, 66, 0.5)',
                        borderColor: '#8D99AE',
                        color: '#EDF2F4'
                    }
            }
        }

        return (
            <input
                type={type}
                style={getInputStyles()}
                className={cn(
                    "flex w-full px-4 py-3 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 border rounded-lg placeholder-blue-gray",
                    {
                        "focus:border-opacity-80 focus:ring-1": variant === "default",
                        "rounded-xl focus:ring-2": variant === "elegant",
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