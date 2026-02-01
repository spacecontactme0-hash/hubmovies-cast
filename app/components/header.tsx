"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import NotificationBell from "./notifications/notification-bell";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    
    // For talents, check if name exists and profile completion >= 70%
    if (user.role === "TALENT") {
      return user.name && user.profileCompletion >= 70;
    }
    
    // For directors, check if name exists
    if (user.role === "DIRECTOR") {
      return !!user.name;
    }
    
    return false;
  };

  const shouldShowName = isProfileComplete();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg sm:text-xl tracking-wide text-white flex-shrink-0"
        >
          Hub<span className="text-[var(--accent-gold)]">Movies</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm tracking-wide">
          <Link href="/jobs" className="text-[var(--text-secondary)] hover:text-white transition">
            Jobs
          </Link>
          <Link href="/talents" className="text-[var(--text-secondary)] hover:text-white transition">
            Talents
          </Link>
          <Link href="/how-it-works" className="text-[var(--text-secondary)] hover:text-white transition">
            How It Works
          </Link>
          <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-white transition">
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {status === "loading" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <>
              <NotificationBell />
              {/* User Menu with Dropdown */}
              <div className="relative flex items-center gap-2 sm:gap-3" ref={menuRef}>
                {user?.role === "ADMIN" ? (
                  <span className="text-xs sm:text-sm text-white font-medium">Welcome Admin</span>
                ) : (
                  <>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center gap-2 sm:gap-3 focus:outline-none"
                    >
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/20 cursor-pointer hover:border-[var(--accent-gold)]/50 transition"
                        />
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-[var(--accent-gold)]/50 transition">
                          <span className="text-[var(--accent-gold)] text-xs font-medium">
                            {(user?.name || user?.email || "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      {shouldShowName && (
                        <span className="text-xs sm:text-sm text-white font-medium hidden sm:block max-w-[100px] truncate">
                          {user?.name || user?.email?.split("@")[0] || "User"}
                        </span>
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-main)] border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          {user?.role === "DIRECTOR" ? (
                            <Link
                              href="/director/dashboard"
                              onClick={() => setShowMenu(false)}
                              className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                            >
                              Dashboard
                            </Link>
                          ) : user?.role === "TALENT" ? (
                            <Link
                              href="/talent/dashboard"
                              onClick={() => setShowMenu(false)}
                              className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                            >
                              Dashboard
                            </Link>
                          ) : null}
                          
                          <Link
                            href={user?.role === "TALENT" ? "/talent/profile" : user?.role === "DIRECTOR" ? "/director/dashboard" : "/admin/jobs"}
                            onClick={() => setShowMenu(false)}
                            className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                          >
                            Profile
                          </Link>
                          
                          <div className="border-t border-white/10 my-1" />
                          
                          <button
                            onClick={() => {
                              setShowMenu(false);
                              signOut({ redirect: false }).then(() => {
                                router.push("/");
                                router.refresh();
                              });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <NotificationBell />
              <Link
                href="/auth/password"
                className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[var(--accent-gold)] text-[var(--accent-gold)] text-xs sm:text-sm hover:bg-[var(--accent-gold)] hover:text-black transition whitespace-nowrap"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
