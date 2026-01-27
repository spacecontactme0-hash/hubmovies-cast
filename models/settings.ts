import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    ethAddress: { type: String, default: null },
    btcAddress: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
