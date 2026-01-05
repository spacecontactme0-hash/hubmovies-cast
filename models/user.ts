import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["TALENT", "DIRECTOR"],
      required: true,
      index: true,
    },
    emailVerified: { type: Date },
    name: { type: String },
    image: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // Profile completion (for talents)
    profileCompletion: { type: Number, default: 0, min: 0, max: 100 },
    // Verification tier (for talents)
    verificationTier: {
      type: String,
      enum: ["BASIC", "COMPLETE", "VERIFIED", "FEATURED"],
      default: "BASIC",
      index: true,
    },
    // Trust score (for directors)
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    // Talent profile fields
    phone: { type: String },
    bio: { type: String },
    primaryRole: { type: String },
    skills: [{ type: String }],
    experience: [{ type: String }],
    portfolio: [{ type: String }], // Array of media URLs
  },
  { timestamps: true }
);

// Performance indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);


