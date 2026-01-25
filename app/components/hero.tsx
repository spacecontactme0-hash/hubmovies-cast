"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const handlePostJob = () => {
    if (!session?.user) {
      // Not logged in - redirect to signup with director role
      router.push("/signup?role=DIRECTOR");
      return;
    }

    if (user?.role === "DIRECTOR") {
      // Director - go to dashboard to post job
      router.push("/director/dashboard");
    } else {
      // Not a director - redirect to signup as director
      router.push("/signup?role=DIRECTOR");
    }
  };
  const heroImage =
    "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg";
  // Image source: Pexels (free)

  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      
      {/* Hero Image */}
      <motion.img
        src={heroImage}
        alt="Cinematic film production"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark cinematic wash */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Light bloom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-[var(--accent-gold)]/10 blur-[200px]"
      />

      {/* Moving cinematic sheen */}
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),rgba(255,255,255,0),rgba(255,255,255,0.04))] bg-[length:400%_400%]"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10 max-w-5xl px-6 text-center pt-12 sm:pt-16 md:pt-20"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 1.2 }}
          className="font-heading text-[clamp(3.6rem,7vw,5.8rem)] text-white mb-6 sm:mb-8"
        >
          Where Stories  
          <br />
          Find Their People
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          HubMovies is a global casting marketplace connecting actors,
          filmmakers, and creative professionals with producers, studios,
          and brands — built for trust, visibility, and serious work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 md:mb-20"
        >
          <Link
            href="/talents"
            className="px-8 py-4 bg-[var(--accent-gold)] text-black font-semibold tracking-wide hover:opacity-90 transition inline-block text-center"
          >
            Explore Talent
          </Link>

          <button
            onClick={handlePostJob}
            className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 transition"
          >
            Post a Job
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
