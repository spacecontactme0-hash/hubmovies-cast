import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      index: true,
    },
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    directorId: {
      type: String,
      required: true,
      index: true,
    },
    talentId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["director", "talent"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["in-app", "email", "phone"],
      default: "in-app",
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
MessageSchema.index({ directorId: 1, createdAt: -1 });
MessageSchema.index({ talentId: 1, createdAt: -1 });
MessageSchema.index({ applicationId: 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;

