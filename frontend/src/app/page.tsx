"use client";

import { useState, useEffect } from "react";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { InteractiveTimeline } from "@/components/election/InteractiveTimeline";
import { FloatingOrb } from "@/components/chat/FloatingOrb";
import { ReadinessQuiz } from "@/components/election/ReadinessQuiz";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { 
  Vote, Users, Search, ClipboardList, Info, ArrowRight, 
  MapPin, Eye, EyeOff, LayoutPanelLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [location, setLocation] = useState("Mumbai, MH");

  return (
    <main className={`min-h-screen bg-[#050505] text-white overflow-x-hidden relative ${reduceMotion ? 'motion-reduce' : ''}`}>
      {!reduceMotion && <CursorTrail />}

      {/* Accessibility Controls */}
      <div className="fixed top-4 right-4 z-[100] flex gap-2">
        <button 
          onClick={() => setReduceMotion(!reduceMotion)}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          title={reduceMotion ? "Enable Motion" : "Reduce Motion"}
        >
          {reduceMotion ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center rotate-12">
                <Vote size={40} className="text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight">Your Vote, <br /> Intelligent.</h2>
                <p className="text-white/60">Welcome to the future of election guidance. Experience our zero-gravity AI interface designed for clarity.</p>
              </div>
              <button 
                onClick={() => setShowOnboarding(false)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20"
              >
                Enter Experience
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center" aria-label="Introduction">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm mb-8"
        >
          <MapPin size={14} />
          <span>Showing data for: <span className="font-bold">{location}</span></span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Election Guide <br />
          <span className="text-blue-500">AI Experience</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          This system reduces confusion for first-time voters by converting complex procedures into interactive, personalized guidance.
        </p>
      </section>

      {/* Interactive Timeline */}
      <section className="relative z-10 py-20 px-6" aria-label="Election Timeline">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Election Lifecycle</h2>
            <p className="text-white/40">From registration to results, explained visually</p>
          </div>
          <InteractiveTimeline />
        </div>
      </section>

      {/* Readiness & Quiz */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]" aria-label="Ready to Vote Quiz">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black tracking-tight leading-none">Are you <br /><span className="text-blue-500">Ready to Vote?</span></h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Our interactive readiness check analyzes your current status and provides actionable steps to ensure your voice is heard.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold">12.5k</div>
                <div className="text-xs text-white/40 uppercase">Voters Guided</div>
              </div>
              <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-white/40 uppercase">Clarity Score</div>
              </div>
            </div>
          </div>
          <ReadinessQuiz />
        </div>
      </section>

      {/* Floating Info Cards */}
      <section className="relative z-10 py-20 px-6" aria-label="Resources">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FloatingCard delay={0.1}>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Voter Eligibility</h3>
            <p className="text-white/60 text-sm leading-relaxed">Find out if you qualify. Check citizenship status and residency rules.</p>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Find Your Booth</h3>
            <p className="text-white/60 text-sm leading-relaxed">Locate your nearest polling station with real-time distance metrics.</p>
          </FloatingCard>

          <FloatingCard delay={0.3}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Required IDs</h3>
            <p className="text-white/60 text-sm leading-relaxed">Full list of accepted IDs including digital versions like m-Aadhaar.</p>
          </FloatingCard>
        </div>
      </section>

      <FloatingOrb />

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10 text-center text-white/40 text-sm">
        <p>© 2026 Election Guide AI. Built for the Future of Democracy.</p>
      </footer>
    </main>
  );
}
