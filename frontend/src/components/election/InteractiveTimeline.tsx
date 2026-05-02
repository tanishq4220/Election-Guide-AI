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

const STAR_POSITIONS = [
  { id: 1, top: '15%', left: '20%', duration: 3.5 },
  { id: 2, top: '75%', left: '80%', duration: 4.2 },
  { id: 3, top: '25%', left: '90%', duration: 2.8 },
  { id: 4, top: '85%', left: '10%', duration: 3.9 },
  { id: 5, top: '45%', left: '50%', duration: 4.5 },
  { id: 6, top: '5%', left: '60%', duration: 2.5 },
  { id: 7, top: '95%', left: '30%', duration: 3.1 },
  { id: 8, top: '35%', left: '15%', duration: 4.8 },
  { id: 9, top: '65%', left: '85%', duration: 2.2 },
  { id: 10, top: '55%', left: '5%', duration: 3.7 },
  { id: 11, top: '10%', left: '40%', duration: 4.1 },
  { id: 12, top: '90%', left: '70%', duration: 2.9 },
  { id: 13, top: '20%', left: '95%', duration: 3.4 },
  { id: 14, top: '80%', left: '25%', duration: 4.6 },
  { id: 15, top: '50%', left: '75%', duration: 2.7 },
  { id: 16, top: '30%', left: '55%', duration: 3.3 },
  { id: 17, top: '70%', left: '45%', duration: 4.3 },
  { id: 18, top: '40%', left: '35%', duration: 2.6 },
  { id: 19, top: '60%', left: '95%', duration: 3.8 },
  { id: 20, top: '10%', left: '85%', duration: 4.7 }
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
        {STAR_POSITIONS.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: star.duration, repeat: Infinity }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
            }}
          />
        ))}
      </div>
    </div>
  );
};
