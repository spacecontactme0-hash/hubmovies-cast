import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    sessionToken: { type: String, unique: true, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expires: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Performance indexes
SessionSchema.index({ sessionToken: 1 });
SessionSchema.index({ userId: 1 });
SessionSchema.index({ expires: 1 });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
