import express from "express";
import VisitedItem from "../../Models/VisitedItem.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const visitedLocations = await VisitedItem.find({ userId });
    console.log(visitedLocations);
    return res.status(200).json(visitedLocations);
  } catch {
    return res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
