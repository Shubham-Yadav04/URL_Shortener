
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.6 1"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [100, 0]
  );

  const blur = useTransform(
    scrollYProgress,
    [0, 0.5],
    [12, 0]
  );

  return (
    <motion.section
      ref={ref}
      style={{
        opacity,
        y,
        filter: useTransform(blur, (value) => `blur(${value}px)`),
      }}
      className={`py-20 sm:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden ${className}`}
      id={id}
    >
      {children}
    </motion.section>
  );
}

export default AnimatedSection;
