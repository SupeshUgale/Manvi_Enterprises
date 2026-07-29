import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Cpu, Server, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "Connecting to Manvi Encrypted Server...",
  "Syncing Product Catalog from MongoDB...",
  "Verifying End-to-End Session Security...",
  "Loading Energy Systems & Solutions...",
];

export default function SecureLoader({
  message = "Loading Manvi Enterprises...",
  showStepText = true,
  fullScreen = true,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!showStepText) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [showStepText]);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 max-w-md w-full text-center space-y-6 select-none z-50">
      {/* Glowing Shield Animated Badge */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Backlight Effect */}
        <div className="absolute w-28 h-28 bg-[#2F5D50]/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute w-20 h-20 bg-[#D4A64A]/20 rounded-full blur-md animate-ping" />

        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-24 h-24 rounded-full border-2 border-dashed border-[#2F5D50]/60 border-t-[#D4A64A] flex items-center justify-center"
        />

        {/* Central Icon Box */}
        <div className="absolute w-16 h-16 bg-gradient-to-br from-[#1F2937] via-[#2F5D50] to-[#15342C] rounded-2xl flex items-center justify-center shadow-2xl border border-emerald-500/30 text-white">
          <ShieldCheck className="w-8 h-8 text-[#8FAE9D] animate-bounce" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#D4A64A]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4A64A] font-mono">
            SECURE CLOUD SYNC
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
          Manvi Enterprises
        </h2>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-800/80 rounded-full h-2 overflow-hidden border border-emerald-500/20 relative p-0.5">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
          }}
          className="h-full bg-gradient-to-r from-[#2F5D50] via-[#8FAE9D] to-[#D4A64A] rounded-full shadow-lg shadow-emerald-500/50"
        />
      </div>

      {/* Dynamic Security Steps */}
      <div className="h-6 flex items-center justify-center text-xs text-gray-300 font-medium tracking-wide">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 text-[#8FAE9D]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A64A] animate-spin" />
            <span>{showStepText ? LOADING_STEPS[currentStepIndex] : message}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Security Footer Badge */}
      <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-gray-400 font-mono border-t border-gray-800/80 w-full">
        <span className="flex items-center gap-1">
          <Server className="w-3 h-3 text-emerald-400" /> MongoDB Live
        </span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-amber-400" /> 256-Bit SSL Encrypted
        </span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/95 backdrop-blur-md transition-opacity duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[350px] w-full flex items-center justify-center bg-gray-900/60 rounded-3xl border border-gray-800 backdrop-blur-sm p-6">
      {content}
    </div>
  );
}
