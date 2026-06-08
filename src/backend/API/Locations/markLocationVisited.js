import express from "express";
import VisitedItem from "../../Models/VisitedItem.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { placeId, userId } = req.body;

    const newVisitedItem = new VisitedItem({ placeId, userId });

    await newVisitedItem.save();

    return res.status(201).json({ message: "Location visited" });
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
