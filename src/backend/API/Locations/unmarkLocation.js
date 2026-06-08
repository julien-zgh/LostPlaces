import express from "express";
import VisitedItem from "../../Models/VisitedItem.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { placeId, userId } = req.body;

    // Ensure both fields are provided
    if (!placeId || !userId) {
      return res
        .status(400)
        .json({ message: "placeId and userId are required" });
    }

    const item = await VisitedItem.findOneAndDelete({ placeId, userId });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(201).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
