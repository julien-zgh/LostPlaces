import express from "express";
import WhishListItem from "../../Models/Whishlist.js";

const router = express.Router();

router.get("/:placeId/:userId", async (req, res) => {
  try {
    const { placeId, userId } = req.params;

    const isSaved = await WhishListItem.find({ placeId, userId });

    if (!isSaved || isSaved.length === 0) {
      return res.status(200).json(false);
    }
    return res.status(201).json(true);
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
