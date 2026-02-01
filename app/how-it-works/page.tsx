"use client";

import { motion } from "framer-motion";
import Header from "@/app/components/header";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up as a talent or director. Build your profile with your portfolio, skills, and experience.",
    },
    {
      number: "02",
      title: "Discover Opportunities",
      description: "Browse global casting calls or find the perfect talent for your project. No region locks, no gatekeeping.",
    },
    {
      number: "03",
      title: "Apply & Connect",
      description: "Submit your application with media and answers. Directors review and connect directly with talents.",
    },
    {
      number: "04",
      title: "Get Cast",
      description: "Receive notifications when shortlisted. Communicate through our secure messaging system.",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--bg-main)] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">
              How It <span className="text-[var(--accent-gold)]">Works</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              A simple, transparent process connecting global creatives with casting opportunities.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded"
              >
                <div className="flex items-start gap-6">
                  <div className="text-[var(--accent-gold)] font-heading text-3xl">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2 font-heading">
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-white/5 border border-white/10 p-12 rounded"
          >
            <h2 className="text-3xl text-white mb-4 font-heading">
              Ready to Get Started?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Join thousands of creatives already using HubMovies.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/auth"
                className="px-8 py-3 bg-[var(--accent-gold)] text-black hover:opacity-90 transition font-medium"
              >
                Get Started
              </a>
              <a
                href="/jobs"
                className="px-8 py-3 border border-white/20 text-white hover:bg-white/10 transition"
              >
                Browse Jobs
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}



