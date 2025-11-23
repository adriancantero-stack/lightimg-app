/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                apple: {
                    gray: '#F5F5F7',
                    blue: '#007AFF',
                    dark: '#1D1D1F',
                    text: '#111111'
                }
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
                'card': '0 2px 12px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
