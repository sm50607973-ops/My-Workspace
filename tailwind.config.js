/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-900': '#0f172a',
        'cool-grey-100': '#f3f4f6',
        'sand-100': '#f5f5dc',
        'olive-500': '#808000',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [], // ⚠️ 플러그인을 비워서 에러 원인 제거
}