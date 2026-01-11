"use client";

import { motion } from "framer-motion";

export default function SessionLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-main)]/95 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <h3 className="text-xl font-heading text-white mb-2">
          Establishing Session
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Please wait while we log you in...
        </p>
      </motion.div>
    </div>
  );
}

