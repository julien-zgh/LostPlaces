import express from "express";
import Rating from "../../models/Rating.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Rating.find({ placeId: id });
    if (!data) {
      return res.status(404).json({ message: "No Rating for this location" });
    }
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      message: "Error While trying to fetch rating for this location",
    });
  }
});

export default router;
