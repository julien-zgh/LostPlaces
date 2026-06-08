import express from "express";
import crypto from "crypto";
import PassReset from "../Models/PassReset.js";

const router = express.Router();

router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const passResetEntry = await PassReset.findOne({ token: hashedToken });
    if (!passResetEntry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    return res.status(200).json({ message: "Token is valid" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
