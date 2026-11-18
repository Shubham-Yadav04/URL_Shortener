"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/75 backdrop-blur-xs"
        onClick={onDismiss}
      >
        <motion.div
          layout
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.96, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 16, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-white dark:bg-[#121215] border border-[#e6e3da] dark:border-[#232329] p-7 sm:p-9 rounded-3xl z-10 shadow-2xl relative overflow-y-auto no-scrollbar text-[#141413] dark:text-[#f5f5f2]"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-5 right-5 z-20 p-1.5 rounded-lg text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/15 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
