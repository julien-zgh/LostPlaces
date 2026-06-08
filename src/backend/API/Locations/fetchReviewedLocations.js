import express from "express";
import Rating from "../../models/Rating.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reviewsLocations = await Rating.find({ userId });
    return res.status(200).json(reviewsLocations);
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
