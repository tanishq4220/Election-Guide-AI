"use client";

import { motion } from "framer-motion";
import { UserPlus, Vote, BarChart3, ShieldCheck } from "lucide-react";

/** Timeline step definition. */
interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: typeof UserPlus;
  color: string;
}

const steps: TimelineStep[] = [
  { id: 1, title: "Registration", description: "Register as a voter at nvsp.in", icon: UserPlus, color: "from-blue-500 to-cyan-400" },
  { id: 2, title: "Verification", description: "Your identity and address are verified", icon: ShieldCheck, color: "from-purple-500 to-pink-400" },
  { id: 3, title: "Voting Day", description: "Cast your vote at your assigned booth", icon: Vote, color: "from-orange-500 to-red-400" },
  { id: 4, title: "Counting", description: "Votes are counted and results declared", icon: BarChart3, color: "from-green-500 to-emerald-400" },
];

export const InteractiveTimeline = () => {
  return (
    <div 
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden"
      role="list"
      aria-label="Election journey timeline"
    >
      {/* Central Sun/Election Point */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-32 h-32 rounded-full bg-blue-500/20 blur-3xl absolute"
        aria-hidden="true"
      />
      <div className="relative z-10 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Election Journey</h3>
        <p className="text-white/40 text-sm">Follow the cosmic path of democracy</p>
      </div>

      {/* Orbiting Planets */}
      {steps.map((step, index) => {
        const angle = (index / steps.length) * (2 * Math.PI);
        const radius = 220;
        const IconComponent = step.icon;
        
        return (
          <motion.div
            key={step.id}
            initial={{ 
              x: Math.cos(angle) * radius, 
              y: Math.sin(angle) * radius,
            }}
            animate={{
              x: [
                Math.cos(angle) * radius,
                Math.cos(angle + Math.PI / 2) * radius,
                Math.cos(angle + Math.PI) * radius,
                Math.cos(angle + 3 * Math.PI / 2) * radius,
                Math.cos(angle) * radius,
              ],
              y: [
                Math.sin(angle) * radius,
                Math.sin(angle + Math.PI / 2) * radius,
                Math.sin(angle + Math.PI) * radius,
                Math.sin(angle + 3 * Math.PI / 2) * radius,
                Math.sin(angle) * radius,
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute"
            role="listitem"
            aria-label={`Step ${step.id}: ${step.title} — ${step.description}`}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-0.5 shadow-lg shadow-blue-500/20`}
            >
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-white gap-1">
                <IconComponent size={24} aria-hidden="true" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{step.title}</span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Background Stars/Particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
