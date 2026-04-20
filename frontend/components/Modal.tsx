"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Modal({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  
  // const onKeyDown = useCallback(
  //   (e: KeyboardEvent) => {
  //     if (e.key === 'Escape') onDismiss();
  //   },
  //   [onDismiss]
  // );

  // useEffect(() => {
  //   document.addEventListener('keydown', onKeyDown);
  //   return () => document.removeEventListener('keydown', onKeyDown);
  // }, [onKeyDown]);

  return (
    <AnimatePresence>
          <motion.div
          layout
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-md bg-[#0a0a0c] border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {children}
          </motion.div>
   
    </AnimatePresence>
  );
}
