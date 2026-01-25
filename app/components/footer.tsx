"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-main)]">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'200\\' height=\\'200\\' filter=\\'url(%23n)\\' opacity=\\'0.15\\'/%3E%3C/svg%3E')",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link
              href="/"
              className="font-heading text-xl sm:text-2xl tracking-wide text-white mb-4 inline-block hover:text-[var(--accent-gold)] transition"
            >
              Hub<span className="text-[var(--accent-gold)]">Movies</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              A global casting marketplace connecting actors, filmmakers, and creative professionals with producers, studios, and brands.
            </p>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-heading text-white text-sm sm:text-base mb-4 tracking-wide">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/jobs"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Jobs
              </Link>
              <Link
                href="/talents"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Talents
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Pricing
              </Link>
            </nav>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading text-white text-sm sm:text-base mb-4 tracking-wide">
              Resources
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/auth/password"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Create Account
              </Link>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Forgot Password
              </Link>
            </nav>
          </motion.div>

          {/* Legal Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-heading text-white text-sm sm:text-base mb-4 tracking-wide">
              Legal
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
              >
                Cookie Policy
              </Link>
            </nav>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 sm:pt-12 border-t border-[var(--border-subtle)]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body">
              © {currentYear} HubMovies. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
                aria-label="Twitter"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
                aria-label="Instagram"
              >
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

