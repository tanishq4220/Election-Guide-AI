"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Zap, Mic, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

export const FloatingOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"simple" | "detailed">("detailed");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Welcome! I'm your contextual Election AI. How can I help you navigate democracy today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleLogin = async () => {
    if (auth && typeof signInWithPopup === 'function') {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ 
          prompt: userMsg, 
          history: messages,
          userId: user?.uid,
          mode 
        }),
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      const reply = data.message || data.reply;
      
      if (!reply) {
        throw new Error("No reply from AI");
      }

      setMessages([...newMessages, { role: "bot", text: reply }]);
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' 
        ? "Response took too long. Please try a shorter question." 
        : "Sorry, I couldn't understand. Try again.";
      setMessages([...newMessages, { role: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-[400px] h-[550px] flex flex-col rounded-3xl border border-white/20 bg-black/80 backdrop-blur-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Election AI</h4>
                  <div className="flex gap-2 mt-1">
                    <button 
                      onClick={() => setMode("simple")}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full transition-all", mode === "simple" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40")}
                    >
                      Simple
                    </button>
                    <button 
                      onClick={() => setMode("detailed")}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full transition-all", mode === "detailed" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40")}
                    >
                      Detailed
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* User Profile / Auth */}
            {!user && (
              <div className="p-2 bg-blue-600/10 text-center border-b border-white/5">
                <button onClick={handleLogin} className="text-[10px] text-blue-400 font-bold hover:underline">
                  Sign in with Google to save chat history
                </button>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20"
                          : "bg-white/10 text-white rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "bot" && (
                      <button 
                        onClick={() => speak(msg.text)}
                        className="mt-1 text-white/20 hover:text-white/40"
                        aria-label="Read Aloud"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center text-blue-400 text-[10px] font-medium animate-pulse"
                >
                  <Zap size={10} className="animate-bounce" /> Thinking...
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 disabled:opacity-50 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Election Assistant"
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl relative"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping pointer-events-none" />
        <MessageCircle className="text-white" size={30} />
      </motion.button>
    </div>
  );
};
