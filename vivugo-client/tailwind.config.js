// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bảng màu chính, lấy cảm hứng từ logo "VivuGo"
        primary: {
          light: "#FCD34D", // amber-300
          DEFAULT: "#F59E0B", // amber-500
          dark: "#B45309", // amber-700
        },
        // Màu phụ (cho text, footer, v.v.)
        secondary: {
          light: "#64748B", // slate-500
          DEFAULT: "#334155", // slate-700
          dark: "#1E293B", // slate-800
        },
      },
      fontFamily: {
        // Thêm font chữ đẹp (nếu bạn muốn)
        // 'sans': ['Inter', 'sans-serif'],
      },
      // Thêm chiều cao cho Hero Section
      minHeight: {
        "screen-nav": "calc(100vh - 80px)", // 100vh trừ đi chiều cao navbar (ví dụ)
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
