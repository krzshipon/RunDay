import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // RunDay Brand Colors
                primary: {
                    50: '#f0f4ff',
                    100: '#e1eafe',
                    200: '#c7d8fc',
                    300: '#a5bef9',
                    400: '#8194f4',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                navy: '#2B2D42',
                orange: '#FF9F1C',
                gray: {
                    light: '#EDF2F4',
                    medium: '#8D99AE',
                    dark: '#2B2D42',
                },
                success: '#06D6A0',
                warning: '#FFD23F',
                error: '#EF233C',
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
        },
    },
    plugins: [],
};

export default config;