import express from "express";
import Submission from "../../Models/Submission.js";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const locationUpdatedData = req.body;

    const { user_id, status } = locationUpdatedData;

    if (status === "pending") {
      const updatedUser = await Explorer.findByIdAndUpdate(
        user_id,
        { $inc: { approved: -1, pending: 1 } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
    }

    const updatedLocation = await Submission.findByIdAndUpdate(
      id,
      locationUpdatedData,
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      updatedLocation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
