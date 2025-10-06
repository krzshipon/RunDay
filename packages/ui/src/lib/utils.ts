import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export function formatTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} at ${formatTime(date)}`
}

export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'active':
        case 'confirmed':
            return 'bg-green-900/30 border-green-700 text-green-300'
        case 'pending':
        case 'waiting':
            return 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
        case 'cancelled':
        case 'inactive':
            return 'bg-red-900/30 border-red-700 text-red-300'
        default:
            return 'bg-blue-900/30 border-blue-700 text-blue-300'
    }
}