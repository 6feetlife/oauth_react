/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ JSX/TSX 파일에서 Tailwind 사용 가능하게 설정
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
