import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    talentId: { type: String, required: true },
    answer: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

// Performance indexes
// Compound unique index on (jobId, talentId) - prevents duplicate applications
ApplicationSchema.index({ jobId: 1, talentId: 1 }, { unique: true });

// Index on status for filtering applications by status
ApplicationSchema.index({ status: 1 });

// Index on createdAt for sorting and time-based queries
ApplicationSchema.index({ createdAt: -1 });

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
