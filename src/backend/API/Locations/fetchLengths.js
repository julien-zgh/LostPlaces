import express from "express";
import WhishListItem from "../../Models/Whishlist.js";
import VisitedItem from "../../Models/VisitedItem.js";
import Rating from "../../models/Rating.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const WhishlistCount = await WhishListItem.countDocuments({ userId });
    const VisitedCount = await VisitedItem.countDocuments({ userId });
    const RatingsCount = await Rating.countDocuments({ userId });

    return res.json({
      whishlist_count: WhishlistCount,
      visited_count: VisitedCount,
      ratings_count: RatingsCount,
    });
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
