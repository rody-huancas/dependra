"use client";

import useStore from "@/store/useStore";
import { useEffect } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (!storedTheme) {
      document.body.classList.toggle('dark', prefersDark);
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button 
      onClick={toggleTheme}
      className="text-white/90 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
    >
      {theme === 'light' ? (
        <BsMoon className="w-6 h-6 dark:text-white text-gray-700" />
      ) : (
        <BsSun className="w-6 h-6 dark:text-white text-gray-700" />
      )}
    </button>
  );
}; 