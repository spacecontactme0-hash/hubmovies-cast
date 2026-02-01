"use client";

import { motion } from "framer-motion";

type DirectorStatsProps = {
  totalJobs: number;
  totalApplications: number;
  shortlisted: number;
  rejected: number;
};

export default function DirectorStats({
  totalJobs,
  totalApplications,
  shortlisted,
  rejected,
}: DirectorStatsProps) {
  const stats = [
    {
      label: "Total Jobs Posted",
      value: totalJobs,
      color: "text-[var(--accent-gold)]",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      color: "text-white",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      color: "text-white",
      image: "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Rejected",
      value: rejected,
      color: "text-[var(--text-secondary)]",
      image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
          className="relative bg-white/5 border border-white/10 p-4 sm:p-6 rounded overflow-hidden group"
        >
          {/* Subtle background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity"
            style={{ backgroundImage: `url('${stat.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

          {/* Content */}
          <div className="relative z-10">
            <p className="text-[var(--text-secondary)] text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-medium ${stat.color}`}>{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
