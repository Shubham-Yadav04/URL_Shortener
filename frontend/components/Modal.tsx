"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function Modal({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm " onClick={onDismiss}>
        <motion.div
          layout
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full max-w-md bg-[#0a0a0c] border border-white/10 p-10 rounded-3xl z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-y-scroll no-scrollbar"
        >
          <button 
            onClick={onDismiss}
            className="absolute top-6 right-6 z-20 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
