import express from "express";
import mongoose from "mongoose";
import Submission from "../../Models/Submission.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid or missing user_id" });
  }

  try {
    const places = await Submission.find({ user_id }).sort({ createdAt: -1 });
    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

export default router;
