"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingCard = ({ children, className, delay = 0 }: FloatingCardProps) => {
  return (
    <motion.div
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
        "transition-shadow duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      {children}
    </motion.div>
  );
};
