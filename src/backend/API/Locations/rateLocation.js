import express from "express";
import Rating from "../../models/Rating.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { placeId, userId, rating } = req.body;

    if (!placeId || !userId || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const ratedPlaces = await Rating.findOne({placeId: placeId, userId: userId});
    if (ratedPlaces) {
      await Rating.updateOne(
        { placeId: placeId, userId: userId },
        { $set: { rating: rating } }
      );
      return res.status(200).json({ message: "Rating updated successfully" });
    }

    const newRating = new Rating({
      placeId,
      userId,
      rating,
    });
    await newRating.save();
    return res.status(200).json({ message: "Rating submitted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
