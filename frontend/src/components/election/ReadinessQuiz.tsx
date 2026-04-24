"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti";

const questions = [
  { q: "Are you 18 years or older?", a: true, tip: "You must be 18 to vote in national elections." },
  { q: "Do you have a valid Voter ID (EPIC)?", a: true, tip: "A Voter ID is essential, but other documents like Aadhaar can sometimes work." },
  { q: "Is your name in the Electoral Roll?", a: true, tip: "Check nvsp.in to verify your registration status." },
  { q: "Do you know your polling booth location?", a: true, tip: "Use the Booth Locator on our home page!" },
];

export const ReadinessQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (ans: boolean) => {
    if (ans === questions[current].a) setScore(score + 1);
    
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      if (score >= 2) confetti();
    }
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest">
              <span>Question {current + 1} of {questions.length}</span>
              <span>Ready Score: {Math.round((score / questions.length) * 100)}%</span>
            </div>
            <h3 className="text-xl font-bold text-white">{questions[current].q}</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all font-bold"
              >
                No
              </button>
            </div>
            <p className="text-xs text-white/40 italic flex gap-2 items-center">
              <AlertCircle size={14} /> {questions[current].tip}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle2 size={60} className="mx-auto text-green-500" />
            <h3 className="text-3xl font-black">Score: {score}/{questions.length}</h3>
            <p className="text-white/60">
              {score === questions.length 
                ? "You're fully ready to vote! Go make a difference." 
                : "You're almost there! Check the steps above to complete your readiness."}
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
            >
              <RefreshCcw size={16} /> Retake Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
