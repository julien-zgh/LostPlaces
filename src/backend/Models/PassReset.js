import mongoose from "mongoose";

const PassResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "pass_reset",
  }
);

// TTL index: auto-delete documents when expiresAt is reached
PassResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PassReset =
  mongoose.models.PassReset || mongoose.model("PassReset", PassResetSchema);
export default PassReset;
