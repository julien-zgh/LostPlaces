import express from "express";
import WhishListItem from "../../Models/Whishlist.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const savedLocations = await WhishListItem.find({ userId });
    // console.log(savedLocations);
    return res.status(200).json(savedLocations);
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
