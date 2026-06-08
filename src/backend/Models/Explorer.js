import mongoose from "mongoose";

const explorerSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: String,
    approved: Number,
    pending: Number,
    rejected: Number,
    saved: [String],
    visited: [String],
    reviewed: [String],
    joinDate: Date,
    profile_pic: String,
    twoFA: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const Explorer =
  mongoose.models.Explorer || mongoose.model("Explorer", explorerSchema);

export default Explorer;
