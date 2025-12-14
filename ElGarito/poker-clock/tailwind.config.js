/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: '#00f3ff',
                    dark: '#004e92',
                    purple: '#bc13fe',
                    red: '#ff073a',
                },
                bg: {
                    dark: '#0a0a12',
                    panel: '#11111e',
                }
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-blue': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
                'neon-red': '0 0 10px #ff073a, 0 0 20px #ff073a',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
