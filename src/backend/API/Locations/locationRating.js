import express from "express";
import Rating from "../../models/Rating.js";

const router = express.Router();

router.get("/:placeId/:userId", async (req, res) => {
  try {
    const { placeId, userId } = req.params;

    const ratedLocation = await Rating.findOne({
      placeId: placeId,
      userId: userId,
    });
    if (!ratedLocation) {
      return res.status(200).json({ rating: 0 });
    }
    return res.status(200).json({ rating: ratedLocation.rating });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
