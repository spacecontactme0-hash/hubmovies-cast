"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import TalentProfileModal from "./talent-profile-modal";

type Talent = {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  verified?: boolean;
  bio?: string;
};

const talents: Talent[] = [
  {
    id: "talent-1",
    name: "Amara Okoye",
    role: "Actor",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    verified: true,
    bio: "Award-winning screen actor with experience across film, television, and theatre productions.",
  },
  {
    id: "talent-2",
    name: "Lucas Fernández",
    role: "Cinematographer",
    location: "Madrid, Spain",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80",
    verified: false,
    bio: "Visual storyteller specializing in narrative cinema and commercial filmmaking.",
  },
  {
    id: "talent-3",
    name: "Noura Benali",
    role: "Fashion Model",
    location: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    verified: true,
    bio: "International fashion model working across editorial, runway, and luxury brand campaigns.",
  },
  {
    id: "talent-4",
    name: "Daniel Wu",
    role: "Voice Actor",
    location: "Vancouver, Canada",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    verified: false,
    bio: "Versatile voice actor for animation, games, and commercial narration.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function TalentsPreview() {
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  return (
    <>
      <section className="relative py-28 overflow-hidden">
        {/* Background separation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl mb-16"
          >
            <p className="text-sm tracking-[0.25em] text-[var(--accent-gold)] mb-4">
              FEATURED TALENTS
            </p>
            <h2 className="text-white mb-6">
              Discover Exceptional Creative Professionals
            </h2>
            <p className="text-[var(--text-secondary)]">
              From emerging voices to established professionals, HubMovies
              highlights talent ready for global productions.
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {talents.map((talent) => (
              <motion.div
                key={talent.id}
                variants={item}
                onClick={() => setSelectedTalent(talent)}
                className="group cursor-pointer"
              >
                {/* Portrait */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
                </div>

                {/* Info */}
                <div className="mt-4">
                  <h3 className="text-lg text-white mb-1 group-hover:text-[var(--accent-gold)] transition">
                    {talent.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {talent.role} · {talent.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Link
              href="/talents"
              className="inline-flex items-center gap-3 text-[var(--accent-gold)] text-sm tracking-wide hover:gap-5 transition-all"
            >
              Explore all talents
              <span className="text-lg">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <TalentProfileModal
        talent={selectedTalent}
        onClose={() => setSelectedTalent(null)}
      />
    </>
  );
}
