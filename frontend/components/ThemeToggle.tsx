"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  variant?: "pill" | "icon" | "full";
}

export default function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300
          ${isDark
            ? "bg-[#18181b]/80 border-white/10 text-neutral-300 hover:text-white hover:border-white/20 hover:bg-[#202024]"
            : "bg-[#f4f3ed] border-[#e2dfd5] text-neutral-700 hover:text-neutral-900 hover:border-[#cbcaa] hover:bg-[#eceae2]"
          } ${className}`}
      >
        <span className="relative flex items-center justify-center w-4 h-4">
          {isDark ? (
            <Moon size={14} className="text-emerald-400" />
          ) : (
            <Sun size={14} className="text-amber-600" />
          )}
        </span>
        <span className="capitalize">{resolvedTheme} Mode</span>
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300
          ${isDark
            ? "bg-[#18181b]/60 border-white/10 text-neutral-300 hover:text-white hover:border-white/20 hover:bg-[#1f1f23]"
            : "bg-[#f4f3ee] border-[#e5e2d9] text-neutral-700 hover:text-neutral-900 hover:border-[#d5d1c5] hover:bg-[#ebe8de]"
          } ${className}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? <Moon size={14} className="text-emerald-400" /> : <Sun size={14} className="text-amber-600" />}
          <span>Theme</span>
        </span>
        <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          {resolvedTheme}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center
        ${isDark
          ? "bg-[#18181b]/80 border-white/10 text-neutral-300 hover:text-white hover:border-white/25 hover:bg-[#222226]"
          : "bg-[#f4f3ee] border-[#e2dfd5] text-neutral-700 hover:text-neutral-900 hover:border-[#cbcaa] hover:bg-[#ebe8de] shadow-xs"
        } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun size={16} className="text-amber-300 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={16} className="text-neutral-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </motion.button>
  );
}
