"use client";

import { useSpring, motion, Variants } from "motion/react";
import React, { useRef, useEffect, useState } from "react";

function MouseFollow() {
  const x = useSpring(0, { stiffness: 150, damping: 25 });
  const y = useSpring(0, { stiffness: 150, damping: 25 });
  const [isClicked, setIsClicked] = useState(false);

  const clickVariant: Variants = {
    initial: {
      scale: 1,
    },
    animate: {
      scale: [1, 0.4, 1.1, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const mouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset slightly to center the 24px cursor follower
      x.set(e.clientX - 12);
      y.set(e.clientY - 12);
    };

    const handleMouseClick = () => {
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleMouseClick, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, [x, y]);

  return (
    <motion.div
      ref={mouseRef}
      style={{ x, y }}
      className="hidden md:block w-6 h-6 rounded-full fixed top-0 left-0 z-50 pointer-events-none bg-neutral-900/15 dark:bg-white/20 border border-neutral-900/20 dark:border-white/25 backdrop-blur-[1px] transition-colors duration-200"
      animate={isClicked ? "animate" : "initial"}
      variants={clickVariant}
    />
  );
}

export default MouseFollow;
