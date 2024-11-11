"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";

import { cn } from "../../utils/cn";

interface SlightFlipProps {
  word: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export function SlightFlip({
  word,
  duration = 1,
  delayMultiple = 0.08,
  framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  className,
}: SlightFlipProps) {
  return (
    <div className="flex justify-center space-x-2">
      <AnimatePresence mode="wait">
      {word.split().map((char, i) => (
  <motion.span
    key={i}
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={framerProps}
    transition={{ duration, delay: i * delayMultiple }}
    className={cn("origin-center drop-shadow-sm", className)}
    style={{ display: '', marginRight: '0rem' }} 
  >
    {char}
  </motion.span>
))}
      </AnimatePresence>
    </div>
  );
}