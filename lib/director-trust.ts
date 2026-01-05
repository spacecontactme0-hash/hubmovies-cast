/**
 * Director Trust Utility
 * 
 * Provides trust badge/level determination and UI helpers for director trust scores.
 * 
 * Trust Levels:
 * - NEW_DIRECTOR: 0-29 (New Director)
 * - TRUSTED_DIRECTOR: 30-69 (Trusted Director)
 * - VERIFIED_STUDIO: 70-100 (Verified Studio)
 */

export type TrustLevel = "NEW_DIRECTOR" | "TRUSTED_DIRECTOR" | "VERIFIED_STUDIO";

export interface TrustBadge {
  level: TrustLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Get trust level from trust score
 */
export function getTrustLevel(trustScore: number): TrustLevel {
  if (trustScore >= 70) return "VERIFIED_STUDIO";
  if (trustScore >= 30) return "TRUSTED_DIRECTOR";
  return "NEW_DIRECTOR";
}

/**
 * Get trust badge for display
 */
export function getTrustBadge(trustScore: number): TrustBadge {
  const level = getTrustLevel(trustScore);

  switch (level) {
    case "VERIFIED_STUDIO":
      return {
        level,
        label: "VERIFIED STUDIO",
        color: "text-[var(--accent-gold)]",
        bgColor: "bg-[var(--accent-gold)]/20",
        borderColor: "border-[var(--accent-gold)]/30",
      };
    case "TRUSTED_DIRECTOR":
      return {
        level,
        label: "TRUSTED DIRECTOR",
        color: "text-green-400",
        bgColor: "bg-green-400/20",
        borderColor: "border-green-400/30",
      };
    case "NEW_DIRECTOR":
      return {
        level,
        label: "NEW DIRECTOR",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20",
        borderColor: "border-yellow-400/30",
      };
  }
}

/**
 * Get trust improvement suggestions for directors
 */
export function getTrustImprovements(trustScore: number, user: any): string[] {
  const improvements: string[] = [];

  if (!user.emailVerified) {
    improvements.push("Verify your email (+20)");
  }

  // Future: Add more improvements as features are implemented
  // if (!user.companyProfile?.complete) {
  //   improvements.push("Complete company profile (+30)");
  // }
  // if (!user.paymentMethod) {
  //   improvements.push("Add payment method (+20)");
  // }

  if (trustScore < 30) {
    improvements.push("Post more jobs (+10 per job)");
    improvements.push("Review applicants promptly (+10 per review)");
  }

  if (trustScore < 70) {
    improvements.push("Build your reputation through consistent activity");
  }

  return improvements;
}

/**
 * Get trust status text for talents (no numbers, confidence-based)
 */
export function getTrustStatusText(trustLevel: TrustLevel): {
  title: string;
  items: string[];
} {
  switch (trustLevel) {
    case "VERIFIED_STUDIO":
      return {
        title: "About the Director",
        items: [
          "✔ Email verified",
          "✔ Verified studio",
          "✔ Active on platform",
        ],
      };
    case "TRUSTED_DIRECTOR":
      return {
        title: "About the Director",
        items: [
          "✔ Email verified",
          "✔ Previous successful castings",
          "✔ Reviewed applicants promptly",
        ],
      };
    case "NEW_DIRECTOR":
      return {
        title: "About the Director",
        items: [
          "✔ Email verified",
          "✔ New to HubMovies",
        ],
      };
  }
}

/**
 * Director Capabilities Interface
 * Defines what a director can do based on their trust level
 */
export interface DirectorCapabilities {
  maxActiveJobs: number;
  canBulkShortlist: boolean;
  canBulkReject: boolean;
  visibilityWeight: number; // 1.0 = standard, >1.0 = boosted, <1.0 = reduced
  externalContactVisible: boolean;
  canFeatureJobs: boolean;
  analyticsEnabled: boolean;
  earlyAccessFeatures: boolean;
  studioBranding: boolean;
}

/**
 * Get director capabilities based on trust level
 * This is the single source of truth for trust-based feature access
 */
export function getDirectorCapabilities(trustLevel: TrustLevel): DirectorCapabilities {
  switch (trustLevel) {
    case "NEW_DIRECTOR":
      return {
        maxActiveJobs: 2,
        canBulkShortlist: false,
        canBulkReject: false,
        visibilityWeight: 1.0, // Standard visibility
        externalContactVisible: false, // Hidden by default
        canFeatureJobs: false,
        analyticsEnabled: false,
        earlyAccessFeatures: false,
        studioBranding: false,
      };

    case "TRUSTED_DIRECTOR":
      return {
        maxActiveJobs: 5,
        canBulkShortlist: true,
        canBulkReject: true,
        visibilityWeight: 1.2, // Slight boost in listings
        externalContactVisible: true,
        canFeatureJobs: true, // Limited featured placement
        analyticsEnabled: true, // Basic analytics
        earlyAccessFeatures: false,
        studioBranding: false,
      };

    case "VERIFIED_STUDIO":
      return {
        maxActiveJobs: Infinity, // Unlimited
        canBulkShortlist: true,
        canBulkReject: true,
        visibilityWeight: 1.5, // Priority placement
        externalContactVisible: true, // Fully visible
        canFeatureJobs: true, // Full featured placement
        analyticsEnabled: true, // Advanced analytics
        earlyAccessFeatures: true,
        studioBranding: true,
      };
  }
}

/**
 * Get trust-based messaging for talents
 * Returns appropriate CTA and warning text based on trust level
 */
export function getTrustMessaging(trustLevel: TrustLevel): {
  applyCTA: string;
  warning?: string;
  responseFraming: string;
  credibilityFraming: string;
} {
  switch (trustLevel) {
    case "NEW_DIRECTOR":
      return {
        applyCTA: "Proceed with caution",
        warning: "This director is new to HubMovies. Proceed if comfortable.",
        responseFraming: "May take time",
        credibilityFraming: "New director on HubMovies",
      };

    case "TRUSTED_DIRECTOR":
      return {
        applyCTA: "Apply Now",
        responseFraming: "Usually responds",
        credibilityFraming: "Trusted director",
      };

    case "VERIFIED_STUDIO":
      return {
        applyCTA: "Apply Now",
        responseFraming: "Fast response",
        credibilityFraming: "Verified studio",
      };
  }
}

