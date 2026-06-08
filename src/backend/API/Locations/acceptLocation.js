import express from "express";
import Submission from "../../Models/Submission.js";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //get location
    const location = await Submission.findById(id);
    if (!location) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const { user_id } = location;

    //update user
    const updatedUser = await Explorer.findByIdAndUpdate(
      user_id,
      { $inc: { approved: 1, pending: -1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    //update location
    const updatedLocation = await Submission.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Submission approved successfully",
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
