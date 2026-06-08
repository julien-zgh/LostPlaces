import express from "express";
import WhishListItem from "../../Models/Whishlist.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { placeId, userId } = req.body;
    
    const newWhilistItem = new WhishListItem({ placeId, userId });

    await newWhilistItem.save();

    return res.status(201).json({ message: "Location added to whishlist" });
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
