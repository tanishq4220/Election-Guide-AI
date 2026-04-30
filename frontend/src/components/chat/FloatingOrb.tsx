"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Zap, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

/** Chat message type definition. */
interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

/** API timeout duration in milliseconds. */
const API_TIMEOUT_MS = 8000;

export const FloatingOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"simple" | "detailed">("detailed");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Welcome! I'm your contextual Election AI. How can I help you navigate democracy today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleLogin = useCallback(async () => {
    if (auth && typeof signInWithPopup === 'function') {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        // Login failed — user cancelled or popup blocked
      }
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ 
          prompt: userMsg, 
          history: messages,
          userId: user?.uid,
          mode,
        }),
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      const reply = data.message || data.reply;
      
      if (!reply) {
        throw new Error("No reply from AI");
      }

      setMessages([...newMessages, { role: "bot", text: reply }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && error.name === 'AbortError'
        ? "Response took too long. Please try a shorter question." 
        : "Sorry, I couldn't understand. Try again.";
      setMessages([...newMessages, { role: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, user, mode]);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-[400px] h-[550px] flex flex-col rounded-3xl border border-white/20 bg-black/80 backdrop-blur-3xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Election AI Chat Assistant"
          >
            {/* Header */}
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center" aria-hidden="true">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white" id="chat-title">Election AI</h2>
                  <div className="flex gap-2 mt-1" role="radiogroup" aria-label="Response mode">
                    <button 
                      id="mode-simple-btn"
                      onClick={() => setMode("simple")}
                      role="radio"
                      aria-checked={mode === "simple"}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full transition-all", mode === "simple" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40")}
                    >
                      Simple
                    </button>
                    <button 
                      id="mode-detailed-btn"
                      onClick={() => setMode("detailed")}
                      role="radio"
                      aria-checked={mode === "detailed"}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full transition-all", mode === "detailed" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40")}
                    >
                      Detailed
                    </button>
                  </div>
                </div>
              </div>
              <button 
                id="close-chat-btn"
                onClick={() => setIsOpen(false)} 
                aria-label="Close chat" 
                className="text-white/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            {/* User Profile / Auth */}
            {!user && (
              <div className="p-2 bg-blue-600/10 text-center border-b border-white/5">
                <button 
                  id="sign-in-btn"
                  onClick={handleLogin} 
                  className="text-[10px] text-blue-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Sign in with Google to save chat history
                </button>
              </div>
            )}

            {/* Messages */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" 
              aria-live="polite" 
              aria-label="Chat messages" 
              role="log"
              aria-relevant="additions"
              tabIndex={0}
            >
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={`msg-${i}`} 
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
                      aria-label={msg.role === "user" ? "Your message" : "AI response"}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "bot" && (
                      <button 
                        onClick={() => speak(msg.text)}
                        className="mt-1 text-white/20 hover:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-0.5"
                        aria-label="Read this response aloud"
                      >
                        <Volume2 size={12} aria-hidden="true" />
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
                  role="status"
                  aria-label="AI is thinking"
                >
                  <Zap size={10} className="animate-bounce" aria-hidden="true" /> Thinking...
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Ask your election question</label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                aria-label="Type your election question"
                autoComplete="off"
                disabled={loading}
              />
              <button
                id="send-message-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Send message"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="open-chat-btn"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Election Assistant" : "Open Election Assistant"}
        aria-expanded={isOpen}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl relative focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping pointer-events-none" aria-hidden="true" />
        <MessageCircle className="text-white" size={30} aria-hidden="true" />
      </motion.button>
    </div>
  );
};
