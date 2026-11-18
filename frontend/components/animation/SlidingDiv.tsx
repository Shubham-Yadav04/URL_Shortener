"use client";

import React, { useRef } from "react";
import { motion, Variants } from "motion/react";

interface SlidingDivProps {
  children: React.ReactNode;
  bgColorInitial?: string;
  bgColorFinal?: string;
  className?: string;
}

function SlidingDiv({
  children,
  bgColorInitial,
  bgColorFinal = "rgba(34, 197, 94, 0.2)",
  className = "",
}: SlidingDivProps) {
  const slideVariant: Variants = {
    initial: {
      width: "0%",
      opacity: 0.6,
    },
    animate: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className={`relative inline-block overflow-hidden rounded-xl ${className}`}
      style={bgColorInitial ? { backgroundColor: bgColorInitial } : undefined}
    >
      <motion.div
        variants={slideVariant}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: bgColorFinal }}
      />
      <div className="relative z-10 w-fit h-fit">{children}</div>
    </motion.div>
  );
}

export default SlidingDiv;
