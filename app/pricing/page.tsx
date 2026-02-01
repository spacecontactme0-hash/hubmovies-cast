"use client";

import { motion } from "framer-motion";
import Header from "@/app/components/header";

export default function PricingPage() {
  const plans = [
    {
      name: "Talent",
      price: "Free",
      description: "For actors, models, and performers",
      features: [
        "Unlimited job applications",
        "Profile visibility",
        "Direct messaging with directors",
        "Application tracking",
        "Portfolio showcase",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Director",
      price: "Free",
      description: "For casting directors and producers",
      features: [
        "Post unlimited jobs",
        "Review applications",
        "Message talents directly",
        "Trust-based visibility",
        "Application management",
      ],
      cta: "Get Started",
      highlight: true,
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
              Simple, <span className="text-[var(--accent-gold)]">Transparent</span> Pricing
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              No hidden fees. No gatekeeping. Just a platform that works for everyone.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white/5 border p-8 rounded ${
                  plan.highlight
                    ? "border-[var(--accent-gold)] bg-white/10"
                    : "border-white/10"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl text-white mb-2 font-heading">
                    {plan.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl text-white font-heading">
                      {plan.price}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[var(--accent-gold)] mt-1">✓</span>
                      <span className="text-[var(--text-secondary)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/auth"
                  className={`block w-full text-center py-3 transition ${
                    plan.highlight
                      ? "bg-[var(--accent-gold)] text-black hover:opacity-90"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-[var(--text-secondary)] text-sm"
          >
            <p>
              All plans are currently free during our beta phase. Premium features coming soon.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}



