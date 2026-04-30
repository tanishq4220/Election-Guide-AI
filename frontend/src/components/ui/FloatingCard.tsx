"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  /** Content to render inside the card. */
  children: React.ReactNode;
  /** Additional CSS classes. */
  className?: string;
  /** Animation delay in seconds. */
  delay?: number;
}

/**
 * Animated floating card component with hover effects.
 * Used for displaying resource cards with a premium glassmorphism style.
 */
export const FloatingCard = ({ children, className, delay = 0 }: FloatingCardProps) => {
  return (
    <motion.article
      initial={{ y: 0 }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        filter: "brightness(1.1)",
        y: -10,
      }}
      className={cn(
        "relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden",
        "transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-400",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </motion.article>
  );
};
