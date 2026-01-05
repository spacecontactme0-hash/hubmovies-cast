import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    directorId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: String, default: "" },
    deadline: { type: String, default: "" },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// Performance indexes
// Index on directorId for fetching director's jobs
JobSchema.index({ directorId: 1 });

// Index on status for filtering open/closed jobs
JobSchema.index({ status: 1 });

// Index on deadline for sorting and filtering by deadline
JobSchema.index({ deadline: 1 });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);

